using StandingOut.Data.DTO;
using StandingOut.Data.Models;
using System;
using System.Threading.Tasks;

namespace StandingOutStore.Business.Services.Interfaces
{
    public interface IOrderService : IDisposable
    {
        Task<Order> CreateNewOrder(User user, BasketDto basket);
        Task<Order> SetOrderPaymentProgress(PaymentResponse paymentResult);
        Task<Order> GetById(Guid orderId);
        Task<Order> UpdateOrderTotal(Order order, decimal totalToPay);
        Task SendCourseInvites(User sender, Order order, BasketDto basketModel);
    }
}
