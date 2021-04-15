using System;
using System.Collections.Generic;
using System.Text;
using Models = StandingOut.Data.Models;
using DTO = StandingOut.Data.DTO;
using StandingOutStore.Business.Services.Interfaces;
using StandingOut.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using StandingOut.Data.Models;
using StandingOut.Data.DTO;
using StandingOut.Data.Enums;
using Utilities;

namespace StandingOutStore.Business.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _UnitOfWork;
        private readonly IHostingEnvironment _Enviroment;
        private readonly IHttpContextAccessor _HttpContext;
        private readonly UserManager<Models.User> _UserManager;
        private readonly IPaymentProviderFieldsetService paymentProviderFieldsetService;
        private readonly ICourseInviteService courseInviteService;
        private readonly AppSettings _AppSettings;
        private bool _Disposed;

        public OrderService(IUnitOfWork unitOfWork, IHostingEnvironment hosting, IHttpContextAccessor httpContext, IOptions<AppSettings> appSettings, UserManager<Models.User> userManager,
            IPaymentProviderFieldsetService paymentProviderFieldsetService, ICourseInviteService courseInviteService)
        {
            _UnitOfWork = unitOfWork;
            _Enviroment = hosting;
            _HttpContext = httpContext;
            _AppSettings = appSettings.Value;
            _UserManager = userManager;
            this.paymentProviderFieldsetService = paymentProviderFieldsetService;
            this.courseInviteService = courseInviteService;
        }

        public void Dispose()
        {
            if (!_Disposed)
            {
                GC.Collect();
            }
        }

        public async Task<Models.Order> GetById(Guid id)
        {
            return await _UnitOfWork.Repository<Models.Order>().GetSingle(o => o.OrderId == id, includeProperties: "PayerUser, PaymentProviderFields, OrderItems, OrderRefunds, SessionAttendees");
        }

        public async Task<Order> CreateNewOrder(User user, BasketDto basket)
        {
            var order = new Order
            {
                CreatedBy = user.Id,
                CreatedDate = DateTime.UtcNow,
                OrderStatus = OrderStatus.Created,
                OrderPaymentStatus = OrderPaymentStatus.Pending,
                PayerUserId = user.Id,
            };
            AddOrderItemsFromBasket(user, order, basket.BasketItems);
            var numCreated = await _UnitOfWork.Repository<Order>().Insert(order);

            return (numCreated >= 1) ? order : null;
        }

        private List<OrderItem> AddOrderItemsFromBasket(User user, Order order, List<BasketItemDto> basketItems)
        {
            foreach (var basketItem in basketItems)
            {
                order.OrderItems.Add(new OrderItem
                {
                    Order = order,
                    CreatedBy = user.Id,
                    CreatedDate = DateTime.UtcNow,
                    CourseId = basketItem.CourseId,
                });
            }
            return order.OrderItems;
        }

        public async Task<Order> SetOrderPaymentProgress(PaymentResponse paymentResult)
        {
            var order = await GetById(paymentResult.OrderId.Value);

            if (!order.PaymentProviderFieldSetId.HasValue)
                order.PaymentProviderFields = new PaymentProviderFieldSet();

            order.PaymentProviderFields.ReceiptId = paymentResult.PaymentIntentId;
            order.PaymentProviderFields.PaymentMethodId = paymentResult.PaymentMethodId;
            order.PaymentProviderFields.PaymentProvider = PaymentProvider.Stripe;

            if (paymentResult.PaymentSucceeded)
                order.OrderPaymentStatus = OrderPaymentStatus.Paid;

            var numUpdated = await _UnitOfWork.Repository<Order>().Update(order);
            return order;
        }

        public async Task<Order> UpdateOrderTotal(Order order, decimal totalToPay)
        {
            order.AmountCharged = totalToPay;
            var numUpdated = await _UnitOfWork.Repository<Order>().Update(order);
            return (numUpdated >= 1) ? order : null;
        }

        public async Task SendCourseInvites(User sender, Order order, BasketDto basketModel)
        {
            var settings = await _UnitOfWork.Repository<Models.Setting>().GetQueryable().AsNoTracking().FirstOrDefaultAsync();

            foreach (var bi in basketModel.BasketItems)
            {
                foreach (var invite in bi.CourseInvites)
                {
                    invite.CourseId = bi.CourseId;
                    invite.OrderItemId = order.OrderItems.Any() ? order.OrderItems.First(x => x.CourseId == bi.CourseId).OrderItemId 
                        : Guid.Empty;
                    var inviteOut = await courseInviteService.Create(sender, invite);
                }
            }
            sender.StripeCountryID = basketModel.Payment.StripeCountryId;
            await _UserManager.UpdateAsync(sender);
        }
    }
}
