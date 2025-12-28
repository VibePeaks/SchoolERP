using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace ServerlessFunctions
{
    public class SubscriptionNotifier
    {
        private readonly ILogger<SubscriptionNotifier> _logger;

        public SubscriptionNotifier(ILogger<SubscriptionNotifier> logger)
        {
            _logger = logger;
        }

        [Function("SendSubscriptionExpiryReminder")]
        public async Task<IActionResult> SendExpiryReminder(
            [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req,
            [Queue("subscription-reminders")] IAsyncCollector<string> reminderQueue)
        {
            _logger.LogInformation("Processing subscription expiry reminder");

            try
            {
                var requestBody = await req.ReadAsStringAsync();
                var reminderData = JsonSerializer.Deserialize<ExpiryReminderData>(requestBody);

                if (reminderData == null)
                {
                    return new BadRequestObjectResult("Invalid reminder data");
                }

                // Queue the reminder for processing
                var queueMessage = JsonSerializer.Serialize(new
                {
                    UserId = reminderData.UserId,
                    Email = reminderData.Email,
                    PlanName = reminderData.PlanName,
                    ExpiryDate = reminderData.ExpiryDate,
                    DaysRemaining = reminderData.DaysRemaining,
                    ReminderType = "expiry"
                });

                await reminderQueue.AddAsync(queueMessage);

                _logger.LogInformation($"Queued expiry reminder for user {reminderData.UserId}");

                return new OkObjectResult(new { status = "queued", messageId = Guid.NewGuid().ToString() });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing expiry reminder");
                return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
            }
        }

        [Function("SendPaymentSuccessNotification")]
        public async Task<IActionResult> SendPaymentNotification(
            [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req,
            [Queue("payment-notifications")] IAsyncCollector<string> notificationQueue)
        {
            _logger.LogInformation("Processing payment success notification");

            try
            {
                var requestBody = await req.ReadAsStringAsync();
                var paymentData = JsonSerializer.Deserialize<PaymentNotificationData>(requestBody);

                if (paymentData == null)
                {
                    return new BadRequestObjectResult("Invalid payment data");
                }

                // Queue the notification for processing
                var queueMessage = JsonSerializer.Serialize(new
                {
                    UserId = paymentData.UserId,
                    Email = paymentData.Email,
                    Amount = paymentData.Amount,
                    PlanName = paymentData.PlanName,
                    TransactionId = paymentData.TransactionId,
                    NotificationType = "payment_success"
                });

                await notificationQueue.AddAsync(queueMessage);

                _logger.LogInformation($"Queued payment notification for user {paymentData.UserId}");

                return new OkObjectResult(new { status = "queued", messageId = Guid.NewGuid().ToString() });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment notification");
                return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
            }
        }

        [Function("SendUpgradeRecommendation")]
        public async Task<IActionResult> SendUpgradeRecommendation(
            [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req,
            [Queue("upgrade-recommendations")] IAsyncCollector<string> recommendationQueue)
        {
            _logger.LogInformation("Processing upgrade recommendation");

            try
            {
                var requestBody = await req.ReadAsStringAsync();
                var recommendationData = JsonSerializer.Deserialize<UpgradeRecommendationData>(requestBody);

                if (recommendationData == null)
                {
                    return new BadRequestObjectResult("Invalid recommendation data");
                }

                // Queue the recommendation for processing
                var queueMessage = JsonSerializer.Serialize(new
                {
                    UserId = recommendationData.UserId,
                    Email = recommendationData.Email,
                    CurrentPlan = recommendationData.CurrentPlan,
                    RecommendedPlan = recommendationData.RecommendedPlan,
                    Reasoning = recommendationData.Reasoning,
                    ExpectedValue = recommendationData.ExpectedValue,
                    NotificationType = "upgrade_recommendation"
                });

                await recommendationQueue.AddAsync(queueMessage);

                _logger.LogInformation($"Queued upgrade recommendation for user {recommendationData.UserId}");

                return new OkObjectResult(new { status = "queued", messageId = Guid.NewGuid().ToString() });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing upgrade recommendation");
                return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
            }
        }

        [Function("ProcessStripeWebhook")]
        public async Task<IActionResult> ProcessStripeWebhook(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req,
            [Queue("stripe-webhooks")] IAsyncCollector<string> webhookQueue)
        {
            _logger.LogInformation("Processing Stripe webhook");

            try
            {
                // Get Stripe signature for verification
                var signature = req.Headers.GetValues("Stripe-Signature").FirstOrDefault();
                var requestBody = await req.ReadAsStringAsync();

                // In production, verify webhook signature
                // var webhookEndpointSecret = Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET");
                // var stripeEvent = EventUtility.ConstructEvent(requestBody, signature, webhookEndpointSecret);

                // For demo, just queue the webhook data
                var webhookData = JsonSerializer.Deserialize<JsonElement>(requestBody);

                var queueMessage = JsonSerializer.Serialize(new
                {
                    WebhookBody = requestBody,
                    Signature = signature,
                    ReceivedAt = DateTime.UtcNow,
                    Processed = false
                });

                await webhookQueue.AddAsync(queueMessage);

                _logger.LogInformation("Queued Stripe webhook for processing");

                return new OkObjectResult(new { received = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Stripe webhook");
                return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
            }
        }

        [Function("GenerateRevenueReport")]
        public async Task<IActionResult> GenerateRevenueReport(
            [TimerTrigger("0 0 1 * * *")] TimerInfo timer, // Run monthly on the 1st
            [Queue("report-generation")] IAsyncCollector<string> reportQueue)
        {
            _logger.LogInformation("Generating monthly revenue report");

            try
            {
                var reportRequest = JsonSerializer.Serialize(new
                {
                    ReportType = "monthly_revenue",
                    Period = DateTime.UtcNow.ToString("yyyy-MM"),
                    RequestedAt = DateTime.UtcNow,
                    IncludePredictions = true,
                    Recipients = new[] { "admin@school.com" }
                });

                await reportQueue.AddAsync(reportRequest);

                _logger.LogInformation("Queued monthly revenue report generation");

                return new OkObjectResult(new { status = "report_queued" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error queuing revenue report");
                return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
            }
        }
    }

    // Data transfer objects
    public class ExpiryReminderData
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string PlanName { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int DaysRemaining { get; set; }
    }

    public class PaymentNotificationData
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public decimal Amount { get; set; }
        public string PlanName { get; set; }
        public string TransactionId { get; set; }
    }

    public class UpgradeRecommendationData
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string CurrentPlan { get; set; }
        public string RecommendedPlan { get; set; }
        public string Reasoning { get; set; }
        public string ExpectedValue { get; set; }
    }
}
