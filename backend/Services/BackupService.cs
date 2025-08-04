using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using SchoolERP.API.Data;
using Microsoft.EntityFrameworkCore;

namespace SchoolERP.API.Services
{
    public class BackupService : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly string _backupPath;

        public BackupService(IServiceProvider services, string backupPath)
        {
            _services = services;
            _backupPath = backupPath;
            Directory.CreateDirectory(backupPath);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _services.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    
                    // Run weekly backups on Sundays at 2 AM
                    if (DateTime.Now.DayOfWeek == DayOfWeek.Sunday && 
                        DateTime.Now.Hour == 2 && 
                        DateTime.Now.Minute == 0)
                    {
                        var backupFile = Path.Combine(_backupPath, $"backup_{DateTime.Now:yyyyMMdd}.sql");
                        await dbContext.Database.ExecuteSqlRawAsync(
                            $"BACKUP DATABASE SchoolERP TO DISK = '{backupFile}'");
                    }
                }
                await Task.Delay(TimeSpan.FromMinutes(60), stoppingToken);
            }
        }
    }
}