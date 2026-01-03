using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using SchoolERP.API.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolERPAPI.Services
{
    public interface IDatabaseService
    {
        Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> operation);
        Task ExecuteInTransactionAsync(Func<Task> operation);
        Task<T> ExecuteWithRetryAsync<T>(Func<Task<T>> operation, int maxRetries = 3);
        Task ExecuteWithRetryAsync(Func<Task> operation, int maxRetries = 3);
    }

    public class DatabaseService : IDatabaseService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DatabaseService> _logger;

        public DatabaseService(AppDbContext context, ILogger<DatabaseService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> operation)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted);
            try
            {
                _logger.LogInformation("Starting database transaction");

                var result = await operation();

                await transaction.CommitAsync();
                _logger.LogInformation("Database transaction committed successfully");

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database transaction failed, rolling back");
                await transaction.RollbackAsync();

                // Re-throw with more context
                throw new DatabaseOperationException("Transaction failed and was rolled back", ex);
            }
        }

        public async Task ExecuteInTransactionAsync(Func<Task> operation)
        {
            await ExecuteInTransactionAsync(async () =>
            {
                await operation();
                return true;
            });
        }

        public async Task<T> ExecuteWithRetryAsync<T>(Func<Task<T>> operation, int maxRetries = 3)
        {
            var exceptions = new List<Exception>();
            var delay = 100; // Start with 100ms delay

            for (int attempt = 0; attempt <= maxRetries; attempt++)
            {
                try
                {
                    return await operation();
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    _logger.LogWarning(ex, "Concurrency conflict on attempt {Attempt}", attempt + 1);
                    exceptions.Add(ex);

                    if (attempt == maxRetries)
                        throw new ConcurrencyException("Multiple users modified the data simultaneously", ex);

                    // Refresh the entity and retry
                    foreach (var entry in ex.Entries)
                    {
                        await entry.ReloadAsync();
                    }
                }
                catch (DbUpdateException ex) when (IsRetryableException(ex))
                {
                    _logger.LogWarning(ex, "Retryable database error on attempt {Attempt}", attempt + 1);
                    exceptions.Add(ex);

                    if (attempt == maxRetries)
                        throw new DatabaseRetryException($"Operation failed after {maxRetries + 1} attempts", ex);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Non-retryable error on attempt {Attempt}", attempt + 1);
                    exceptions.Add(ex);

                    if (attempt == maxRetries)
                        throw;
                }

                if (attempt < maxRetries)
                {
                    _logger.LogInformation("Retrying operation in {Delay}ms", delay);
                    await Task.Delay(delay);
                    delay *= 2; // Exponential backoff
                }
            }

            throw new AggregateException("All retry attempts failed", exceptions);
        }

        public async Task ExecuteWithRetryAsync(Func<Task> operation, int maxRetries = 3)
        {
            await ExecuteWithRetryAsync(async () =>
            {
                await operation();
                return true;
            }, maxRetries);
        }

        private bool IsRetryableException(DbUpdateException ex)
        {
            // Check for specific SQL Server error codes that are retryable
            var message = ex.InnerException?.Message ?? ex.Message;

            // Deadlock (1205), Timeout (1222), Connection failure, etc.
            return message.Contains("1205") || // Deadlock
                   message.Contains("1222") || // Lock timeout
                   message.Contains("701") ||  // Insufficient memory
                   message.Contains("8645") || // Timeout
                   message.Contains("8651") || // Low memory condition
                   message.Contains("8628");   // Query processor ran out of internal resources
        }

        public async Task EnsureConnectionAsync()
        {
            try
            {
                await _context.Database.CanConnectAsync();
                _logger.LogInformation("Database connection verified");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database connection failed");
                throw new DatabaseConnectionException("Unable to connect to database", ex);
            }
        }

        public async Task<int> SaveChangesWithValidationAsync()
        {
            try
            {
                // Validate entities before saving
                var entries = _context.ChangeTracker.Entries()
                    .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified)
                    .ToList();

                foreach (var entry in entries)
                {
                    // Custom validation logic can be added here
                    if (entry.Entity is IValidatableEntity validatableEntity)
                    {
                        var validationResult = await validatableEntity.ValidateAsync(_context);
                        if (!validationResult.IsValid)
                        {
                            throw new ValidationException($"Validation failed for {entry.Entity.GetType().Name}: {string.Join(", ", validationResult.Errors)}");
                        }
                    }
                }

                var result = await _context.SaveChangesAsync();
                _logger.LogInformation("Saved {Count} changes to database", result);
                return result;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogWarning(ex, "Concurrency conflict detected");
                throw new ConcurrencyException("Data was modified by another user", ex);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update error");

                // Check for constraint violations
                if (ex.InnerException?.Message.Contains("FOREIGN KEY constraint") == true)
                {
                    throw new ForeignKeyViolationException("Related data prevents this operation", ex);
                }
                else if (ex.InnerException?.Message.Contains("UNIQUE KEY constraint") == true ||
                         ex.InnerException?.Message.Contains("UNIQUE constraint") == true)
                {
                    throw new UniqueConstraintViolationException("Duplicate data not allowed", ex);
                }
                else if (ex.InnerException?.Message.Contains("CHECK constraint") == true)
                {
                    throw new CheckConstraintViolationException("Data validation failed", ex);
                }

                throw new DatabaseUpdateException("Failed to save changes to database", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during save");
                throw new DatabaseOperationException("Unexpected error during database operation", ex);
            }
        }
    }

    // Custom Exceptions
    public class DatabaseOperationException : Exception
    {
        public DatabaseOperationException(string message, Exception innerException)
            : base(message, innerException) { }
    }

    public class DatabaseConnectionException : DatabaseOperationException
    {
        public DatabaseConnectionException(string message, Exception innerException)
            : base(message, innerException) { }
    }

    public class DatabaseUpdateException : DatabaseOperationException
    {
        public DatabaseUpdateException(string message, Exception innerException)
            : base(message, innerException) { }
    }

    public class DatabaseRetryException : DatabaseOperationException
    {
        public DatabaseRetryException(string message, Exception innerException)
            : base(message, innerException) { }
    }

    public class ConcurrencyException : DatabaseOperationException
    {
        public ConcurrencyException(string message, Exception innerException)
            : base(message, innerException) { }
    }

    public class ForeignKeyViolationException : DatabaseUpdateException
    {
        public ForeignKeyViolationException(string message, Exception innerException)
            : base(message, innerException) { }
    }

    public class UniqueConstraintViolationException : DatabaseUpdateException
    {
        public UniqueConstraintViolationException(string message, Exception innerException)
            : base(message, innerException) { }
    }

    public class CheckConstraintViolationException : DatabaseUpdateException
    {
        public CheckConstraintViolationException(string message, Exception innerException)
            : base(message, innerException) { }
    }

    public class ValidationException : Exception
    {
        public ValidationException(string message) : base(message) { }
    }

    // Interface for entities that need custom validation
    public interface IValidatableEntity
    {
        Task<ValidationResult> ValidateAsync(AppDbContext context);
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new List<string>();

        public static ValidationResult Success() => new ValidationResult { IsValid = true };

        public static ValidationResult Failure(params string[] errors)
        {
            return new ValidationResult
            {
                IsValid = false,
                Errors = errors.ToList()
            };
        }
    }
}
