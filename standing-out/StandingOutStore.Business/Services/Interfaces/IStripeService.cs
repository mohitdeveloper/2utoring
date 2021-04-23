using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOut.Data.Models;
using StandingOut.Data.DTO;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IStripeService : IDisposable
    {
        Task<Stripe.Coupon> ValidatePromoCode(string promoCode);
        Task<Stripe.PaymentMethod> GetPaymentMethodByCustomer(string stripeCustomerId);
        Task DeletePaymentMethodByCustomer(string stripeCustomerId);
        Task<DTO.PaymentResponse> ConfirmSessionPayment(Models.User user, DTO.Payment model, decimal standingOutCut);
        Task<DTO.PaymentResponse> ConfirmOrderPayment(User user, Order newOrder, BasketDto basketModel,Models.StripeCountry stripeCountry);

        Task<DTO.StripeCard> ConnectPaymentMethod(Models.User user, DTO.PaymentCardConnect model);
        Task<DTO.StripePagedList<DTO.ReceiptIndex>> GetPagedReceipts(DTO.StripeSearch model, Models.User user);
        Task<string> GetStripeConnectOAuthLink(Models.Tutor tutor, Models.User user);
        Task<string> GetStripeConnectOAuthLink(Models.Company company, Models.User user);
        Task<(Models.Tutor tutor, bool success)> AuthenticateStripeConnectResponse(Models.Tutor tutor, string code);
        Task<(Models.Company company, bool success)> AuthenticateStripeConnectResponse(Models.Company company, string code);
        Task<List<Stripe.BankAccount>> GetBankAccounts(Models.Tutor tutor);
        Task<List<Stripe.BankAccount>> GetBankAccounts(Models.Company company);
        Task<string> GetLoginLink(Models.Tutor tutor);
        Task<string> GetLoginLink(Models.Company company);
        Task<(decimal amount, Stripe.Payout payout)> ApproveTransfer(Models.Setting settings, Models.Tutor tutor, Models.SessionAttendee attendee);
        Task<Stripe.Balance> GetBalance(Models.Setting settings, Models.Tutor tutor);
        Task<Stripe.Balance> GetBalance(Models.Setting settings, string stripeConnectAccountId);
        Task<(decimal amount, Stripe.Payout payout)> DoPayout(string StripeKey, decimal totalAmount, Models.ClassSession lesson, string stripeConnectAccountId, string stripeConnectBankAccountId);
        Task<Models.Setting> GetSetting();
      
    }
}