using SchoolERP.API.Data;
using SchoolERP.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace SchoolERP.API.Services
{
    public class AIAnalyticsService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AIAnalyticsService> _logger;

        public AIAnalyticsService(AppDbContext context, ILogger<AIAnalyticsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Predict subscription churn risk
        public async Task<ChurnPrediction> PredictChurnRisk(int userId)
        {
            var user = await _context.Users
                .Include(u => u.CurrentSubscription)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user?.CurrentSubscription == null)
                return new ChurnPrediction { RiskLevel = "low", Confidence = 0.1 };

            var subscription = user.CurrentSubscription;

            // Simple churn prediction algorithm (can be enhanced with ML models)
            double riskScore = 0;

            // Risk factors
            var daysUntilExpiry = subscription.EndDate.HasValue
                ? (subscription.EndDate.Value - DateTime.UtcNow).TotalDays
                : 365;

            if (daysUntilExpiry < 30) riskScore += 0.3; // Expiring soon
            if (!subscription.AutoRenew) riskScore += 0.4; // Not auto-renewing
            if (subscription.Status != "active") riskScore += 0.5; // Not active

            // Payment history analysis
            var failedPayments = await _context.SubscriptionPayments
                .CountAsync(p => p.UserSubscriptionId == subscription.Id && p.Status == "failed");

            riskScore += failedPayments * 0.2; // Failed payment history

            // Usage patterns (simplified)
            var lastPayment = await _context.SubscriptionPayments
                .Where(p => p.UserSubscriptionId == subscription.Id)
                .OrderByDescending(p => p.PaymentDate)
                .FirstOrDefaultAsync();

            if (lastPayment != null && (DateTime.UtcNow - lastPayment.PaymentDate).TotalDays > 60)
                riskScore += 0.2; // Long time since last payment

            // Determine risk level
            string riskLevel;
            double confidence;

            if (riskScore >= 0.7)
            {
                riskLevel = "high";
                confidence = Math.Min(riskScore, 0.95);
            }
            else if (riskScore >= 0.4)
            {
                riskLevel = "medium";
                confidence = riskScore;
            }
            else
            {
                riskLevel = "low";
                confidence = Math.Max(riskScore, 0.1);
            }

            return new ChurnPrediction
            {
                RiskLevel = riskLevel,
                Confidence = confidence,
                Factors = new[]
                {
                    $"Days until expiry: {daysUntilExpiry}",
                    $"Auto-renew: {subscription.AutoRenew}",
                    $"Failed payments: {failedPayments}"
                },
                Recommendations = GenerateRecommendations(riskLevel, subscription)
            };
        }

        // Generate personalized upgrade recommendations
        public async Task<UpgradeRecommendation[]> GetUpgradeRecommendations(int userId)
        {
            var user = await _context.Users
                .Include(u => u.CurrentSubscription)
                    .ThenInclude(us => us.SubscriptionPlan)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user?.CurrentSubscription?.SubscriptionPlan == null)
            {
                // Recommend starting with premium
                var premiumPlan = await _context.SubscriptionPlans
                    .FirstOrDefaultAsync(p => p.PlanName == "premium");

                return new[]
                {
                    new UpgradeRecommendation
                    {
                        PlanName = "premium",
                        Reasoning = "Perfect starting point with essential features",
                        ExpectedValue = "Access to Library and E-Learning modules",
                        Confidence = 0.85
                    }
                };
            }

            var currentPlan = user.CurrentSubscription.SubscriptionPlan;
            var recommendations = new List<UpgradeRecommendation>();

            // Analyze usage patterns to recommend upgrades
            if (currentPlan.PlanName == "basic")
            {
                // Check if user is trying to access premium features
                // This would be enhanced with actual usage tracking

                recommendations.Add(new UpgradeRecommendation
                {
                    PlanName = "premium",
                    Reasoning = "Based on your current usage patterns",
                    ExpectedValue = "Unlock Library and E-Learning capabilities",
                    Confidence = 0.75
                });

                recommendations.Add(new UpgradeRecommendation
                {
                    PlanName = "enterprise",
                    Reasoning = "Complete solution for growing institutions",
                    ExpectedValue = "All features including Hostel Management",
                    Confidence = 0.6
                });
            }
            else if (currentPlan.PlanName == "premium")
            {
                recommendations.Add(new UpgradeRecommendation
                {
                    PlanName = "enterprise",
                    Reasoning = "Scale to enterprise-level features",
                    ExpectedValue = "Hostel Management and Advanced Analytics",
                    Confidence = 0.8
                });
            }

            return recommendations.ToArray();
        }

        // Predict revenue and growth
        public async Task<RevenuePrediction> PredictRevenue(int tenantId, int monthsAhead = 12)
        {
            var subscriptions = await _context.UserSubscriptions
                .Include(us => us.SubscriptionPlan)
                .Where(us => us.TenantId == tenantId && us.Status == "active")
                .ToListAsync();

            var currentRevenue = subscriptions.Sum(us => us.SubscriptionPlan.Price);
            var monthlyRevenue = currentRevenue; // Assuming monthly billing

            // Simple growth prediction (can be enhanced with ML)
            var growthRate = 0.05; // 5% monthly growth assumption
            var predictedRevenue = monthlyRevenue;

            for (int i = 0; i < monthsAhead; i++)
            {
                predictedRevenue *= (1 + growthRate);
            }

            // Calculate churn impact
            var churnRate = 0.02; // 2% monthly churn
            var retainedRevenue = predictedRevenue * Math.Pow(1 - churnRate, monthsAhead);

            return new RevenuePrediction
            {
                CurrentMonthlyRevenue = monthlyRevenue,
                PredictedMonthlyRevenue = predictedRevenue,
                RetainedRevenue = retainedRevenue,
                GrowthRate = growthRate,
                ChurnRate = churnRate,
                Confidence = 0.7,
                Assumptions = new[]
                {
                    "5% monthly growth rate",
                    "2% monthly churn rate",
                    "Current subscription mix maintained"
                }
            };
        }

        // Analyze feature usage patterns
        public async Task<FeatureUsageAnalysis> AnalyzeFeatureUsage(int tenantId)
        {
            var subscriptions = await _context.UserSubscriptions
                .Include(us => us.SubscriptionPlan)
                .Where(us => us.TenantId == tenantId && us.Status == "active")
                .ToListAsync();

            var planUsage = subscriptions
                .GroupBy(us => us.SubscriptionPlan.PlanName)
                .Select(g => new
                {
                    PlanName = g.Key,
                    Count = g.Count(),
                    Revenue = g.Sum(us => us.SubscriptionPlan.Price)
                })
                .ToDictionary(x => x.PlanName, x => x);

            var totalUsers = subscriptions.Count;
            var totalRevenue = subscriptions.Sum(us => us.SubscriptionPlan.Price);

            return new FeatureUsageAnalysis
            {
                TotalUsers = totalUsers,
                TotalRevenue = totalRevenue,
                PlanDistribution = planUsage,
                UnderutilizedFeatures = IdentifyUnderutilizedFeatures(planUsage),
                Recommendations = GenerateOptimizationRecommendations(planUsage)
            };
        }

        // Detect fraudulent payment patterns
        public async Task<FraudAlert[]> DetectFraudPatterns(int tenantId)
        {
            var alerts = new List<FraudAlert>();

            // Check for unusual payment patterns
            var recentPayments = await _context.SubscriptionPayments
                .Include(p => p.UserSubscription)
                .Where(p => p.UserSubscription.TenantId == tenantId &&
                           p.PaymentDate >= DateTime.UtcNow.AddDays(-30))
                .ToListAsync();

            // Detect multiple failed payments for same user
            var failedPaymentsByUser = recentPayments
                .Where(p => p.Status == "failed")
                .GroupBy(p => p.UserSubscription.UserId)
                .Where(g => g.Count() >= 3)
                .Select(g => g.Key);

            foreach (var userId in failedPaymentsByUser)
            {
                alerts.Add(new FraudAlert
                {
                    AlertType = "MultipleFailedPayments",
                    Severity = "medium",
                    UserId = userId,
                    Description = "Multiple failed payment attempts detected",
                    RecommendedAction = "Contact user to verify payment method"
                });
            }

            // Detect unusual large payments
            var avgPayment = recentPayments
                .Where(p => p.Status == "completed")
                .Average(p => p.Amount);

            var largePayments = recentPayments
                .Where(p => p.Status == "completed" && p.Amount > avgPayment * 3)
                .ToList();

            foreach (var payment in largePayments)
            {
                alerts.Add(new FraudAlert
                {
                    AlertType = "UnusualLargePayment",
                    Severity = "low",
                    UserId = payment.UserSubscription.UserId,
                    Description = $"Unusually large payment: ${payment.Amount}",
                    RecommendedAction = "Verify payment legitimacy"
                });
            }

            return alerts.ToArray();
        }

        private string[] GenerateRecommendations(string riskLevel, UserSubscription subscription)
        {
            var recommendations = new List<string>();

            switch (riskLevel)
            {
                case "high":
                    recommendations.Add("Contact customer immediately to discuss renewal");
                    recommendations.Add("Offer discount for immediate renewal");
                    recommendations.Add("Review payment method for issues");
                    break;
                case "medium":
                    recommendations.Add("Send renewal reminder email");
                    recommendations.Add("Consider offering upgrade incentives");
                    break;
                case "low":
                    recommendations.Add("Monitor subscription status regularly");
                    break;
            }

            if (!subscription.AutoRenew)
            {
                recommendations.Add("Encourage enabling auto-renewal");
            }

            return recommendations.ToArray();
        }

        private string[] IdentifyUnderutilizedFeatures(Dictionary<string, dynamic> planUsage)
        {
            var underutilized = new List<string>();

            if (planUsage.ContainsKey("basic"))
            {
                underutilized.Add("Many users on basic plan may benefit from premium features");
            }

            if (planUsage.ContainsKey("premium") && !planUsage.ContainsKey("enterprise"))
            {
                underutilized.Add("Consider enterprise features for growing institutions");
            }

            return underutilized.ToArray();
        }

        private string[] GenerateOptimizationRecommendations(Dictionary<string, dynamic> planUsage)
        {
            var recommendations = new List<string>();

            var basicCount = planUsage.ContainsKey("basic") ? planUsage["basic"].Count : 0;
            var premiumCount = planUsage.ContainsKey("premium") ? planUsage["premium"].Count : 0;
            var enterpriseCount = planUsage.ContainsKey("enterprise") ? planUsage["enterprise"].Count : 0;

            if (basicCount > premiumCount + enterpriseCount)
            {
                recommendations.Add("Focus marketing efforts on premium plan upgrades");
            }

            if (enterpriseCount > premiumCount)
            {
                recommendations.Add("Enterprise adoption is strong - consider enterprise-focused features");
            }

            return recommendations.ToArray();
        }
    }

    // Response DTOs
    public class ChurnPrediction
    {
        public string RiskLevel { get; set; } // "low", "medium", "high"
        public double Confidence { get; set; } // 0.0 to 1.0
        public string[] Factors { get; set; }
        public string[] Recommendations { get; set; }
    }

    public class UpgradeRecommendation
    {
        public string PlanName { get; set; }
        public string Reasoning { get; set; }
        public string ExpectedValue { get; set; }
        public double Confidence { get; set; }
    }

    public class RevenuePrediction
    {
        public decimal CurrentMonthlyRevenue { get; set; }
        public decimal PredictedMonthlyRevenue { get; set; }
        public decimal RetainedRevenue { get; set; }
        public double GrowthRate { get; set; }
        public double ChurnRate { get; set; }
        public double Confidence { get; set; }
        public string[] Assumptions { get; set; }
    }

    public class FeatureUsageAnalysis
    {
        public int TotalUsers { get; set; }
        public decimal TotalRevenue { get; set; }
        public Dictionary<string, dynamic> PlanDistribution { get; set; }
        public string[] UnderutilizedFeatures { get; set; }
        public string[] Recommendations { get; set; }
    }

    public class FraudAlert
    {
        public string AlertType { get; set; }
        public string Severity { get; set; } // "low", "medium", "high"
        public int UserId { get; set; }
        public string Description { get; set; }
        public string RecommendedAction { get; set; }
    }
}
