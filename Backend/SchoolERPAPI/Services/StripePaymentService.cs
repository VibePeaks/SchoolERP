using Stripe;
using Microsoft.Extensions.Configuration;
using SchoolERP.API.Models;
using SchoolERP.API.Data;

namespace SchoolERP.API.Services
{
    public class StripePaymentService
    {
        private readonly string _stripeSecretKey;
        private readonly AppDbContext _context;

        public StripePaymentService(IConfiguration configuration, AppDbContext context)
        {
            _stripeSecretKey = configuration["Stripe:SecretKey"];
            StripeConfiguration.ApiKey = _stripeSecretKey;
            _context = context;
        }

        public async Task<PaymentResult> CreateSubscriptionPaymentAsync(
            string customerEmail,
            string planName,
            decimal amount,
            string currency = "usd",
            string billingCycle = "monthly")
        {
            try
            {
                // Create or retrieve customer
                var customerService = new CustomerService();
                var customers = await customerService.ListAsync(new CustomerListOptions
                {
                    Email = customerEmail,
                    Limit = 1
                });

                Customer customer;
                if (customers.Data.Count > 0)
                {
                    customer = customers.Data[0];
                }
                else
                {
                    customer = await customerService.CreateAsync(new CustomerCreateOptions
                    {
                        Email = customerEmail,
                    });
                }

                // Create price for the subscription plan
                var priceService = new PriceService();
                var priceOptions = new PriceCreateOptions
                {
                    UnitAmount = (long)(amount * 100), // Convert to cents
                    Currency = currency,
                    Recurring = new PriceRecurringOptions
                    {
                        Interval = billingCycle == "yearly" ? "year" : "month"
                    },
                    ProductData = new PriceProductDataOptions
                    {
                        Name = $"{planName} Plan - {billingCycle}"
                    }
                };

                var price = await priceService.CreateAsync(priceOptions);

                // Create subscription
                var subscriptionService = new SubscriptionService();
                var subscriptionOptions = new SubscriptionCreateOptions
                {
                    Customer = customer.Id,
                    Items = new List<SubscriptionItemOptions>
                    {
                        new SubscriptionItemOptions
                        {
                            Price = price.Id
                        }
                    },
                    PaymentBehavior = "default_incomplete"
                };

                var subscription = await subscriptionService.CreateAsync(subscriptionOptions);

                // Retrieve the invoice with payment intent expanded
                var invoiceService = new InvoiceService();
                var invoice = await invoiceService.GetAsync(subscription.LatestInvoiceId, new InvoiceGetOptions
                {
                    Expand = new List<string> { "payment_intent" }
                });

                return new PaymentResult
                {
                    Success = true,
                    ClientSecret = ((dynamic)invoice).PaymentIntent.ClientSecret,
                    SubscriptionId = subscription.Id,
                    CustomerId = customer.Id
                };
            }
            catch (StripeException ex)
            {
                return new PaymentResult
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<PaymentResult> ProcessPaymentAsync(string paymentMethodId, decimal amount, string currency = "usd")
        {
            try
            {
                var paymentIntentService = new PaymentIntentService();
                var paymentIntent = await paymentIntentService.CreateAsync(new PaymentIntentCreateOptions
                {
                    Amount = (long)(amount * 100), // Convert to cents
                    Currency = currency,
                    PaymentMethod = paymentMethodId,
                    ConfirmationMethod = "manual",
                    Confirm = true,
                    ReturnUrl = "http://localhost:8082/dashboard" // Adjust for production
                });

                return new PaymentResult
                {
                    Success = paymentIntent.Status == "succeeded",
                    PaymentIntentId = paymentIntent.Id,
                    ClientSecret = paymentIntent.ClientSecret
                };
            }
            catch (StripeException ex)
            {
                return new PaymentResult
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<bool> CancelSubscriptionAsync(string subscriptionId)
        {
            try
            {
                var subscriptionService = new SubscriptionService();
                await subscriptionService.CancelAsync(subscriptionId);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }

    public class PaymentResult
    {
        public bool Success { get; set; }
        public string? ClientSecret { get; set; }
        public string? PaymentIntentId { get; set; }
        public string? SubscriptionId { get; set; }
        public string? CustomerId { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
