using Models = StandingOut.Data.Models;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using StandingOut.Data.Models;
using StandingOut.Data;
using System.Linq;
using StandingOut.Shared.Integrations.Stripe;
using StandingOutStore.Business.Services.Interfaces;

namespace StandingOutStore.Business.Services
{
    public class VendorEarningService : IVendorEarningService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private bool _Disposed;

        public VendorEarningService(IUnitOfWork unitOfWork)
        {
            this._UnitOfWork = unitOfWork;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<List<VendorEarning>> TransferPendingVendorEarnings(Models.Setting settings,Guid id)
        {
            var earningsToProcess = await _UnitOfWork.Repository<Models.VendorEarning>()
                .Get(x => x.PaymentProviderFieldSetId==null && x.ClassSessionId==id, includeProperties: "Tutor, Company, Order, Order.PaymentProviderFields, ClassSession");

            using (var stripeHelper = StripeFactory.GetStripeHelper(settings.StripeKey, settings.StripeConnectClientId))
            {
                foreach (var earning in earningsToProcess)
                {
                    var transferGroup = earning.OrderId.ToString();
                    var vendorConnectedAccountId = earning.TutorId.HasValue ?
                            earning.Tutor.StripeConnectAccountId : earning.Company.StripeConnectAccountId;
                    if (string.IsNullOrEmpty(vendorConnectedAccountId)) 
                        continue;

                    var transferDescription = $"Transfer for Lesson:{earning.ClassSession.Name}, Ended: {earning.ClassSession.EndDate:f}, OrderDt:{earning.Order.CreatedDate:f}";
                    var paymentIntent = earning.Order.PaymentProviderFields.ReceiptId; // Important - transfer is created against original PaymentIntent > Charge (hence the transfer relation to order via sourceTransaction).
                    var transfer = await stripeHelper.CreateTransferToVendor(earning.EarningAmount, vendorConnectedAccountId, transferGroup, transferDescription, paymentIntent);
                    if (transfer != null && !string.IsNullOrWhiteSpace(transfer.Id))
                    {


                        earning.PaymentProviderFieldSet = new PaymentProviderFieldSet
                        {
                            CreditLinkBack = transferGroup,
                            VendorCreditId = transfer.Id
                        };
                        if (Guid.Empty != earning.VendorEarningId)
                        {
                            earning.PaymentProviderFieldSetId = earning.Order.PaymentProviderFieldSetId;
                            var updated = await _UnitOfWork.Repository<Models.VendorEarning>().Update(earning);
                        }
                    }
                }
            }

            // return will have updates
            return earningsToProcess.ToList();
        }

        public async Task<List<VendorEarning>> GetVendorEarningsEligibleForPayout(DateTimeOffset endDateFilter, DateTimeOffset paymentDateFilter)
        {
            var selection = await _UnitOfWork.Repository<Models.VendorEarning>()
                .Get(x => x.ClassSession.EndDate < endDateFilter && x.Order.CreatedDate < paymentDateFilter, includeProperties: "Tutor, Company, Order, VendorPayout, ClassSession, SessionAttendees");
            return selection.ToList();
        }

        public async Task<List<VendorEarning>> Update(List<VendorEarning> earningsPaidOut)
        {
            foreach (var earning in earningsPaidOut)
            {
                await _UnitOfWork.Repository<Models.VendorEarning>().Update(earning);
            }
            return earningsPaidOut;
        }

    }
}
