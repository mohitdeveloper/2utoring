using Stripe;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOut.Shared.Integrations.Stripe
{
    public interface IStripeHelper : IDisposable
    {
        Task<Customer> CreateCustomer(string name, string email, string paymentMethodId);
        Task<StripeList<PaymentMethod>> GetPaymentMethods(string customerId, int limit = 100, string type = "card");
        Task<PaymentMethod> GetPaymentMethod(string paymentMethodId);
        Task<PaymentMethod> CreatePaymentMethod(string customerId, string paymentMethodId);
        Task DeletePaymentMethod(string customerId, string paymentMethodId);
        Task<StripeList<PaymentIntent>> GetPaymentIntents(string customerId = null, int limit = 10, string endingBeforeId = null, string startingAfterId = null);
        Task<PaymentIntent> GetPaymentIntent(string paymentIntentId);
        Task DeletePaymentIntent(string paymentIntentId);
        Task<PaymentIntent> ConfirmPaymentIntent(string paymentIntentId);
        Task<PaymentIntent> GetUpdatePaymentIntent(string paymentIntentId, string customerId, string paymentMethodId, decimal amount);
        Task<PaymentIntent> CreatePaymentIntent(string paymentMethodId, decimal amount, string customerId = null, Dictionary<string, string> metadata = null,
            bool offSession = true, bool confirm = false, string tutorId = null, string connectedAccount = null, decimal? transferAmount = null);
        Task<PaymentIntent> CreatePaymentIntent(string paymentMethodId, decimal amount, string customerId = null, Dictionary<string, string> metadata = null,
            bool offSession = true, bool confirm = false, string orderId = null);
        Task<Transfer> CreateTransferToVendor(decimal amount, string destinationConnectedAccountId, 
            string OrderIdAsTransferGroup, string transferDescription, string paymentIntent, string currency = "gbp");
        Task<Refund> RefundPaymentIntent(string paymentIntentId, long? refundAmountInCents);
        Task<Subscription> CreateSubscription(SubscriptionCreateOptions subscription);
        Task<Plan> GetPlan(string planId);
        Task<Invoice> GetInvoice(string invoiceId);
        Task<Invoice> PayStripeInvoice(string stripeInvoiceId);
        Task<Coupon> GetCoupon(string couponId);
        Task<Customer> GetCustomer(string customerId);
        Task<Subscription> GetSubscription(string subscriptionId);
        Task CancelSubscription(string subscriptionId);
        Task<string> GenerateStripeConnectOAuth(string redirectUrl, Models.Tutor tutor, Models.User user);
        Task<string> GenerateStripeConnectOAuth(string redirectUrl, Models.Company company, Models.User user);
        Task<OAuthToken> AuthenticateStripeConnectResponse(string code);
        Task<Account> GetAccount(Models.Tutor tutor);
        Task<List<BankAccount>> GetAccountsBankAccounts(Models.Tutor tutor, int limit = 100);
        Task<List<BankAccount>> GetAccountsBankAccounts(Models.Company company, int limit = 100);
        Task<LoginLink> GenerateLoginLink(Models.Tutor tutor);
        Task<LoginLink> GenerateLoginLink(Models.Company company);
        Task UpdateAccount(Models.Tutor tutor, AccountUpdateOptions options);
        Task UpdateAccount(Models.Company company, AccountUpdateOptions options);
        Task<Transfer> GetTransfer(string transferId);
        Task<TransferReversal> CancelTransfer(string transferId);
        Task<Payout> CreatePayout(Models.Tutor tutor, PayoutCreateOptions options);
        Task<Payout> CreatePayout(string stripeConnectAccountId, PayoutCreateOptions options);
        Task<Balance> GetBalance(Models.Tutor tutor);
        Task<Balance> GetBalance(string stripeConnectAccountId);
    }
}
