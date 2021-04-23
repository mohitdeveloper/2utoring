using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;

namespace StandingOut.Shared.Integrations.Stripe
{
    public class StripeHelper : IStripeHelper
    {
        private string _ApiKey;
        private string _ConnectClientId;
        private CustomerService _CustomerService;
        private PaymentMethodService _PaymentMethodService;
        private PaymentIntentService _PaymentIntentService;
        private RefundService _RefundService;
        private SubscriptionService _SubscriptionService;
        private PlanService _PlanService;
        private InvoiceService _InvoiceService;
        private CouponService _CouponService;
        private AccountService _AccountService;
        private ExternalAccountService _ExternalAccountService;
        private LoginLinkService _LoginLinkService;
        private TransferService _TransferService;
        private TransferReversalService _TransferReversalService;
        private PayoutService _PayoutService;
        private BalanceService _BalanceService;

        public StripeHelper(string apiKey, string connectClientId)
        {
            _ApiKey = apiKey;
            _ConnectClientId = connectClientId;
            StripeConfiguration.ApiKey = _ApiKey;


            _CustomerService = new CustomerService();
            _PaymentMethodService = new PaymentMethodService();
            _PaymentIntentService = new PaymentIntentService();
            _RefundService = new RefundService();
            _SubscriptionService = new SubscriptionService();
            _PlanService = new PlanService();
            _InvoiceService = new InvoiceService();
            _CouponService = new CouponService();
            _AccountService = new AccountService();
            _ExternalAccountService = new ExternalAccountService();
            _LoginLinkService = new LoginLinkService();
            _TransferService = new TransferService();
            _TransferReversalService = new TransferReversalService();
            _PayoutService = new PayoutService();
            _BalanceService = new BalanceService();
        }

        public async Task<Customer> CreateCustomer(string name, string email, string paymentMethodId)
        {
            var customerCreateOptions = new CustomerCreateOptions
            {
                Email = email,
                Description = string.Format("{0} - ({1})", name, email)
            };

            var stripeCustomer = await _CustomerService.CreateAsync(customerCreateOptions);
            await CreatePaymentMethod(stripeCustomer.Id, paymentMethodId);

            var customerUpdateOptions = new CustomerUpdateOptions
            {
                InvoiceSettings = new CustomerInvoiceSettingsOptions()
                {
                    DefaultPaymentMethod = paymentMethodId
                }
            };
            stripeCustomer = await _CustomerService.UpdateAsync(stripeCustomer.Id, customerUpdateOptions);

            return stripeCustomer;
        }

        public async Task<StripeList<PaymentMethod>> GetPaymentMethods(string customerId, int limit = 100, string type = "card")
        {
            if (limit > 100 || limit < 1)
                throw new Exception("Limit cannot be more than 100 or less than 1.");

            var options = new PaymentMethodListOptions()
            {
                Customer = customerId,
                Limit = limit,
                Type = type
            };

            return await _PaymentMethodService.ListAsync(options);
        }

        public async Task<PaymentMethod> GetPaymentMethod(string paymentMethodId)
        {
            return await _PaymentMethodService.GetAsync(paymentMethodId);
        }

        public async Task<PaymentMethod> CreatePaymentMethod(string customerId, string paymentMethodId)
        {
            var options = new PaymentMethodAttachOptions()
            {
                Customer = customerId,
            };

            var paymentMethod = await _PaymentMethodService.AttachAsync(paymentMethodId, options);

            var customerUpdateOptions = new CustomerUpdateOptions
            {
                InvoiceSettings = new CustomerInvoiceSettingsOptions()
                {
                    DefaultPaymentMethod = paymentMethodId
                }
            };
            await _CustomerService.UpdateAsync(customerId, customerUpdateOptions);

            return paymentMethod;
        }

        public async Task DeletePaymentMethod(string customerId, string paymentMethodId)
        {
            await _PaymentMethodService.DetachAsync(paymentMethodId);
        }

        public async Task<StripeList<PaymentIntent>> GetPaymentIntents(string customerId = null, int limit = 10, string endingBeforeId = null, string startingAfterId = null)
        {
            if (limit > 100 || limit < 1)
                throw new Exception("Limit cannot be more than 100 or less than 1.");

            var options = new PaymentIntentListOptions()
            {
                Customer = customerId,
                Limit = limit,
                EndingBefore = endingBeforeId,
                StartingAfter = startingAfterId
            };

            return await _PaymentIntentService.ListAsync(options);
        }

        public async Task<PaymentIntent> GetPaymentIntent(string paymentIntentId)
        {
            var paymentIntent = await _PaymentIntentService.GetAsync(paymentIntentId);
            return paymentIntent;
        }

        public async Task DeletePaymentIntent(string paymentIntentId)
        {
            await _PaymentIntentService.CancelAsync(paymentIntentId);
        }
        public async Task<PaymentIntent> ConfirmPaymentIntent(string paymentIntentId)
        {
            var options = new PaymentIntentConfirmOptions();
            return await _PaymentIntentService.ConfirmAsync(paymentIntentId, options);
        }

        public async Task<PaymentIntent> GetUpdatePaymentIntent(string paymentIntentId, string customerId, string paymentMethodId, decimal amount)
        {
            var options = new PaymentIntentUpdateOptions()
            {
                Customer = customerId,
                PaymentMethod = paymentMethodId,
                Amount = (long)decimal.Multiply(amount, 100),
                Currency = "gbp",
                SetupFutureUsage = "off_session",
                //Confirm = true,                
            };

            var paymentIntent = await _PaymentIntentService.UpdateAsync(paymentIntentId, options);

            return paymentIntent;
        }

        public async Task<PaymentIntent> CreatePaymentIntent(string paymentMethodId, decimal amount, string customerId = null, Dictionary<string, string> metadata = null,
            bool offSession = true, bool confirm = false, string tutorId = null, string connectedAccount = null, decimal? transferAmount = null)
        {
            var options = new PaymentIntentCreateOptions()
            {
                Customer = customerId,
                PaymentMethod = paymentMethodId,
                Amount = (long)decimal.Multiply(amount, 100),
                Currency = "gbp",
                SetupFutureUsage = offSession ? "off_session" : "on_session",
                Metadata = metadata,
                Confirm = false,
                TransferGroup = tutorId
            };

            // NOTE: If connectedAccount is null, then the transferAmount charge is not created on the PaymentIntent and the TransferId wont save to the Attendee record
            // Change - TransferData limited to single transfer/charge. Use TransferCreateOptions method instead, ALSO we can create a transferService.Create(transferOptions) specifying the a Transfer Group(LATER)
            if (!string.IsNullOrWhiteSpace(connectedAccount) && transferAmount.HasValue && transferAmount.Value > 0)
            {
                options.TransferData = new PaymentIntentTransferDataOptions
                {
                    Amount = (long)decimal.Multiply(transferAmount.Value, 100),
                    Destination = connectedAccount
                };
            }

            var paymentIntent = await _PaymentIntentService.CreateAsync(options);
            return paymentIntent;
        }

        // Now OrderId is use as TransferGroup.. (instead of assuming a TutorId)
        // Refer to TransferGroup ie OrderId for creating Transfers against. This links back transfers to an Order
        // Refer to OrderId for creating Transfers against a Transfer Group (OrderId)
        // https://stripe.com/docs/connect/charges-transfers
        public async Task<PaymentIntent> CreatePaymentIntent(string paymentMethodId, decimal amount, Models.StripeCountry stripeCountry, string customerId = null, Dictionary<string, string> metadata = null,
            bool offSession = true, bool confirm = false, string orderId = null)
        {
            var options = new PaymentIntentCreateOptions()
            {
                Customer = customerId,
                PaymentMethod = paymentMethodId,
                Amount = (long)decimal.Multiply(amount, stripeCountry.DecimalMultiplier),
                Currency = stripeCountry.CurrencyCode,
                SetupFutureUsage = offSession ? "off_session" : "on_session",
                Metadata = metadata,
                Confirm = false,
                TransferGroup = orderId
            };
            var paymentIntent = await _PaymentIntentService.CreateAsync(options);
            return paymentIntent;
        }

        public async Task<Transfer> CreateTransferToVendor(decimal amount, string destinationConnectedAccountId,
            string OrderIdAsTransferGroup, string transferDescription, string originalPaymentIntent, Models.StripeCountry stripeCountry)
        {
            //var vendorBalance = await GetBalance(destinationConnectedAccountId);
            var pi = await GetPaymentIntent(originalPaymentIntent);
            var chargeId = pi.Charges.First().Id;

            var transferOptions = new TransferCreateOptions()
            {
                Amount = (long)decimal.Multiply(amount, stripeCountry.DecimalMultiplier),
                Currency = stripeCountry.CurrencyCode,
                Destination = destinationConnectedAccountId,
                TransferGroup = OrderIdAsTransferGroup,
                SourceTransaction = chargeId, 
                Description = transferDescription,
            };

            

            var transfer = await _TransferService.CreateAsync(transferOptions);
            return transfer;
        }


        // NOTE: can issue refund against a paymentIntentId instead of ChargeId
        public async Task<Refund> RefundPaymentIntent(string paymentIntentId, long? refundAmountInCents)
        {
            var paymentIntent = await GetPaymentIntent(paymentIntentId);

            if (!paymentIntent.Charges.Any()) return null;
            var options = new RefundCreateOptions()
            {
                Amount = refundAmountInCents ?? paymentIntent.Charges.FirstOrDefault()?.Amount,
                Charge = paymentIntent.Charges.FirstOrDefault()?.Id,
            };

            var refund = await _RefundService.CreateAsync(options);
            return refund;
        }

        public async Task<Subscription> CreateSubscription(SubscriptionCreateOptions subscription)
        {
            return await _SubscriptionService.CreateAsync(subscription);
        }

        public async Task<Plan> GetPlan(string planId)
        {
            return await _PlanService.GetAsync(planId);
        }

        public async Task<Invoice> GetInvoice(string invoiceId)
        {
            return await _InvoiceService.GetAsync(invoiceId);
        }

        public async Task<Invoice> PayStripeInvoice(string stripeInvoiceId)
        {
            var stripeInvoice = await _InvoiceService.PayAsync(stripeInvoiceId);
            return stripeInvoice;
        }

        public async Task<Coupon> GetCoupon(string couponId)
        {
            return await _CouponService.GetAsync(couponId);
        }

        public async Task<Customer> GetCustomer(string customerId)
        {
            return await _CustomerService.GetAsync(customerId);
        }

        public async Task<Subscription> GetSubscription(string subscriptionId)
        {
            return await _SubscriptionService.GetAsync(subscriptionId);
        }

        public async Task CancelSubscription(string subscriptionId)
        {
            await _SubscriptionService.CancelAsync(subscriptionId, null);
        }


        #region Stripe Connect

        public async Task<string> GenerateStripeConnectOAuth(string redirectUrl, Models.Tutor tutor, Models.User user)
        {
            string baseUrl = $"https://connect.stripe.com/express/oauth/authorize?redirect_uri={redirectUrl}&client_id={_ConnectClientId}&state={tutor.TutorId}";

            //we specifically only want to allow transfers (money to the account)
            baseUrl += "&suggested_capabilities[]=transfers";

            //prefill any form inputs we can
            baseUrl += $"&stripe_user[email]={user.Email}";
            baseUrl += $"&stripe_user[first_name]={user.FirstName}";
            baseUrl += $"&stripe_user[last_name]={user.LastName}";
            baseUrl += $"&default_currency="+user.StripeCountry.CurrencyCode;
            baseUrl += $"&stripe_user[url]=2utoring.com";

            if (user.DateOfBirth != null)
            {
                baseUrl += $"&stripe_user[dob_day]={user.DateOfBirth.Value.ToString("dd")}";
                baseUrl += $"&stripe_user[dob_month]={user.DateOfBirth.Value.ToString("MM")}";
                baseUrl += $"&stripe_user[dob_year]={user.DateOfBirth.Value.ToString("yyyy")}";
            }

            return baseUrl;
        }

        public async Task<OAuthToken> AuthenticateStripeConnectResponse(string code)
        {
            var options = new OAuthTokenCreateOptions
            {
                GrantType = "authorization_code",
                Code = code,
            };

            var service = new OAuthTokenService();
            var response = service.Create(options);

            return response;
        }

        public async Task<Account> GetAccount(Models.Tutor tutor)
        {
            return await _AccountService.GetAsync(tutor.StripeConnectAccountId);
        }

        public async Task<List<BankAccount>> GetAccountsBankAccounts(Models.Tutor tutor, int limit = 100)
        {
            var options = new ExternalAccountListOptions
            {
                Limit = limit,
            };
            options.AddExtraParam("object", "bank_account");

            var all = await _ExternalAccountService.ListAsync(tutor.StripeConnectAccountId, options);
            List<BankAccount> banksAccounts = all.Data.Where(o => o.Object == "bank_account").Select(o => (BankAccount)o).ToList();

            return banksAccounts;
        }

        //For Comapny
        public async Task<List<BankAccount>> GetAccountsBankAccounts(Models.Company company, int limit = 100)
        {
            var options = new ExternalAccountListOptions
            {
                Limit = limit,
            };
            options.AddExtraParam("object", "bank_account");

            var all = await _ExternalAccountService.ListAsync(company.StripeConnectAccountId, options);
            List<BankAccount> banksAccounts = all.Data.Where(o => o.Object == "bank_account").Select(o => (BankAccount)o).ToList();

            return banksAccounts;
        }

        public async Task<LoginLink> GenerateLoginLink(Models.Tutor tutor)
        {
            return await _LoginLinkService.CreateAsync(tutor.StripeConnectAccountId);
        }
        public async Task<LoginLink> GenerateLoginLink(Models.Company company)
        {
            return await _LoginLinkService.CreateAsync(company.StripeConnectAccountId);
        }

        public async Task UpdateAccount(Models.Tutor tutor, AccountUpdateOptions options)
        {
            await _AccountService.UpdateAsync(tutor.StripeConnectAccountId, options);
        }

        //For Company
        public async Task UpdateAccount(Models.Company company, AccountUpdateOptions options)
        {
            await _AccountService.UpdateAsync(company.StripeConnectAccountId, options);
        }

        public async Task<Transfer> GetTransfer(string transferId)
        {
            return await _TransferService.GetAsync(transferId);
        }

        public async Task<TransferReversal> CancelTransfer(string transferId)
        {
            return await _TransferReversalService.CreateAsync(transferId);
        }

        public async Task<Payout> CreatePayout(Models.Tutor tutor, PayoutCreateOptions options)
        {
            var requestOptions = new RequestOptions()
            {
                StripeAccount = tutor.StripeConnectAccountId
            };

            return await _PayoutService.CreateAsync(options, requestOptions);
        }
        public async Task<Payout> CreatePayout(string stripeConnectAccountId, PayoutCreateOptions options)
        {
            var requestOptions = new RequestOptions()
            {
                StripeAccount = stripeConnectAccountId
            };

            return await _PayoutService.CreateAsync(options, requestOptions);
        }


        public async Task<Balance> GetBalance(Models.Tutor tutor)
        {
            var requestOptions = new RequestOptions()
            {
                StripeAccount = tutor.StripeConnectAccountId
            };
            return await _BalanceService.GetAsync(requestOptions);
        }
        public async Task<Balance> GetBalance(string stripeConnectAccountId)
        {
            var requestOptions = new RequestOptions()
            {
                StripeAccount = stripeConnectAccountId
            };
            return await _BalanceService.GetAsync(requestOptions);
        }
        #endregion

        #region Stripe Connet For Company
        public async Task<string> GenerateStripeConnectOAuth(string redirectUrl, Models.Company company, Models.User user)
        {
            string baseUrl = $"https://connect.stripe.com/express/oauth/authorize?redirect_uri={redirectUrl}&client_id={_ConnectClientId}&state={company.CompanyId}";

            //we specifically only want to allow transfers (money to the account)
            baseUrl += "&suggested_capabilities[]=transfers";

            //prefill any form inputs we can
            baseUrl += $"&stripe_user[email]={user.Email}";
            baseUrl += $"&stripe_user[first_name]={user.FirstName}";
            baseUrl += $"&stripe_user[last_name]={user.LastName}";
            baseUrl += $"&default_currency=" + user.StripeCountry.CurrencyCode;
            baseUrl += $"&stripe_user[url]=2utoring.com";

            if (user.DateOfBirth != null)
            {
                baseUrl += $"&stripe_user[dob_day]={user.DateOfBirth.Value.ToString("dd")}";
                baseUrl += $"&stripe_user[dob_month]={user.DateOfBirth.Value.ToString("MM")}";
                baseUrl += $"&stripe_user[dob_year]={user.DateOfBirth.Value.ToString("yyyy")}";
            }

            return baseUrl;
        }
        #endregion


        public void Dispose()
        {
            _CustomerService = null;
            _PaymentMethodService = null;
            _PaymentIntentService = null;
            _RefundService = null;
            _SubscriptionService = null;
            _PlanService = null;
            _InvoiceService = null;
            _CouponService = null;
            _AccountService = null;
            _ExternalAccountService = null;
            _LoginLinkService = null;
            _TransferService = null;
            _PayoutService = null;
            _BalanceService = null;

            GC.Collect();
        }
    }
}
