-- Subscription Sample Data
-- Run this after creating subscription tables and basic user data

USE SchoolERP;
GO

-- Insert sample subscription data for existing users
-- Assuming user IDs start from 1, adjust as needed

-- Create subscriptions for sample users (assuming users exist)
-- Basic users get basic plan by default (no subscription record needed)
-- Premium and Enterprise users need subscription records

-- Create a premium subscription for a teacher user (assuming user ID 2 exists)
INSERT INTO UserSubscriptions (
    UserId, SubscriptionPlanId, StartDate, EndDate, Status, AutoRenew,
    PaymentMethod, PaymentReference, LastPaymentDate, NextPaymentDate
) VALUES (
    2, -- Assuming this is a teacher user
    (SELECT Id FROM SubscriptionPlans WHERE PlanName = 'premium'),
    '2024-01-01',
    '2024-02-01',
    'active',
    1,
    'stripe',
    'sub_sample_teacher_001',
    '2024-01-01',
    '2024-02-01'
);

-- Create an enterprise subscription for an admin user (assuming user ID 1 exists)
INSERT INTO UserSubscriptions (
    UserId, SubscriptionPlanId, StartDate, EndDate, Status, AutoRenew,
    PaymentMethod, PaymentReference, LastPaymentDate, NextPaymentDate
) VALUES (
    1, -- Assuming this is an admin user
    (SELECT Id FROM SubscriptionPlans WHERE PlanName = 'enterprise'),
    '2024-01-01',
    '2024-02-01',
    'active',
    1,
    'stripe',
    'sub_sample_admin_001',
    '2024-01-01',
    '2024-02-01'
);

-- Insert sample payment records
INSERT INTO SubscriptionPayments (
    UserSubscriptionId, Amount, Currency, PaymentDate, PaymentMethod,
    PaymentReference, Status
) VALUES
(1, 79.99, 'USD', '2024-01-01', 'stripe', 'pi_sample_premium_001', 'completed'),
(2, 149.99, 'USD', '2024-01-01', 'stripe', 'pi_sample_enterprise_001', 'completed');

-- Insert some expired/cancelled subscriptions for testing
INSERT INTO UserSubscriptions (
    UserId, SubscriptionPlanId, StartDate, EndDate, Status, AutoRenew,
    PaymentMethod, PaymentReference, LastPaymentDate, NextPaymentDate
) VALUES (
    3, -- Assuming another user exists
    (SELECT Id FROM SubscriptionPlans WHERE PlanName = 'premium'),
    '2023-12-01',
    '2024-01-01',
    'expired',
    0,
    'stripe',
    'sub_expired_sample_001',
    '2023-12-01',
    '2024-01-01'
);

INSERT INTO SubscriptionPayments (
    UserSubscriptionId, Amount, Currency, PaymentDate, PaymentMethod,
    PaymentReference, Status
) VALUES
(3, 79.99, 'USD', '2023-12-01', 'stripe', 'pi_expired_sample_001', 'completed');

-- Insert a cancelled subscription
INSERT INTO UserSubscriptions (
    UserId, SubscriptionPlanId, StartDate, EndDate, Status, AutoRenew,
    PaymentMethod, PaymentReference, LastPaymentDate, NextPaymentDate
) VALUES (
    4, -- Assuming another user exists
    (SELECT Id FROM SubscriptionPlans WHERE PlanName = 'enterprise'),
    '2023-11-01',
    '2023-12-01',
    'cancelled',
    0,
    'stripe',
    'sub_cancelled_sample_001',
    '2023-11-01',
    '2023-12-01'
);

INSERT INTO SubscriptionPayments (
    UserSubscriptionId, Amount, Currency, PaymentDate, PaymentMethod,
    PaymentReference, Status
) VALUES
(4, 149.99, 'USD', '2023-11-01', 'stripe', 'pi_cancelled_sample_001', 'completed');

PRINT 'Subscription sample data inserted successfully!';
GO
