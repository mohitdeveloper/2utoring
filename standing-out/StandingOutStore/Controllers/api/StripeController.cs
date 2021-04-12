using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOut.Data;
using StandingOut.Data.DTO;
using StandingOut.Data.Enums;
using StandingOut.Data.Models;
using StandingOut.Shared;
using StandingOut.Shared.Mapping;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers.api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Stripe")]
    public class StripeController : Controller
    {
        private readonly IStripeService _StripeService;
        private readonly ISessionAttendeeService _SessionAttendeeService;
        private readonly UserManager<Models.User> _UserManager;
        private readonly ITutorService _TutorService;
        private ICompanyService _CompanyService;
        private readonly IClassSessionSubscriptionFeatureService classSessionSubscriptionFeatureService;
        private readonly IClassSessionService _ClassSessionService;
        private readonly IOrderService orderService;
        private readonly ICourseService courseService;
        private readonly IUnitOfWork unitOfWork;

        public StripeController(UserManager<Models.User> userManager, IStripeService stripeService,
            ISessionAttendeeService sessionAttendeeService, ITutorService tutorService, ICompanyService companyService,
            IClassSessionSubscriptionFeatureService classSessionSubscriptionFeatureService,
            IClassSessionService classSessionService, IOrderService orderService, ICourseService courseService,
            IUnitOfWork unitOfWork)
        {
            _UserManager = userManager;
            _StripeService = stripeService;
            _SessionAttendeeService = sessionAttendeeService;
            _TutorService = tutorService;
            _CompanyService = companyService;
            this.classSessionSubscriptionFeatureService = classSessionSubscriptionFeatureService;
            this._ClassSessionService = classSessionService;
            this.orderService = orderService;
            this.courseService = courseService;
            this.unitOfWork = unitOfWork;
        }

        [HttpGet("validatePromoCode")]
        [ProducesResponseType(typeof(Stripe.Coupon), 200)]
        public async Task<IActionResult> ValidatePromoCode(string promoCode)
        {
            var coupon = await _StripeService.ValidatePromoCode(promoCode);
            if (coupon != null)
            {
                return Ok(Mappings.Mapper.Map<Stripe.Coupon, DTO.Coupon>(coupon));
            }
            return Ok(null);
        }
        [HttpGet("card")]
        [ProducesResponseType(typeof(DTO.StripeCard), 200)]
        public async Task<IActionResult> GetCard()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (string.IsNullOrEmpty(user.StripeCustomerId))
                return Ok(null);
            var stripeCard = await _StripeService.GetPaymentMethodByCustomer(user.StripeCustomerId);
            return Ok(Mappings.Mapper.Map<Stripe.PaymentMethod, DTO.StripeCard>(stripeCard));
        }

        [HttpDelete("card")]
        [ProducesResponseType(typeof(void), 200)]
        public async Task<IActionResult> DeleteCard()
        {
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            if (string.IsNullOrEmpty(user.StripeCustomerId))
                throw new Exception("Customer not set up with payment provider");
            await _StripeService.DeletePaymentMethodByCustomer(user.StripeCustomerId);
            return Ok();
        }

        /// <summary>
        /// DEPRECATED - Instead use ConfirmBasketPayment..
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("confirmSessionPayment")]
        [ProducesResponseType(typeof(DTO.PaymentResponse), 200)]
        public async Task<IActionResult> ConfirmSessionPayment([FromBody] DTO.Payment model)
        {
            throw new NotImplementedException("Deprecated.. Use StripeController ConfirmBasketPayment flow");
            //try
            //{
            //    var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            //    if (string.IsNullOrEmpty(model.PaymentMethodId) && string.IsNullOrEmpty(user.StripeCustomerId))
            //        return BadRequest("No payment method could be determined");

            //    // NOTE: Ensure we do the commission calc on Attendee Create so that we create a payment intent amount along with tutor transfer amount (using SOcut)
            //    var featureSet = await classSessionSubscriptionFeatureService.GetSubscriptionFeatureSetByClassSessionId(model.ClassSessionId);
            //    var session = await _ClassSessionService.GetById(model.ClassSessionId);
            //    var standingOutCut = await _SessionAttendeeService.CalcStandingOutCut(session, session.Owner.TutorId.Value, featureSet.ToClassSessionFeatures().Admin_CommissionPerStudent_StudentAttendancePerMonthTiers);

            //    var result = await _StripeService.ConfirmSessionPayment(user, model, standingOutCut);
            //    if (!result.RequiresAction)
            //        await _SessionAttendeeService.Create(result, user, standingOutCut);
            //    return Ok(result);
            //}
            //catch (DTO.SafeguardingException ex)
            //{
            //    // This should ONLY be triggered if the user has attempted to get around the front end validation safeguards
            //    return BadRequest("Oops! Something went wrong...");
            //}
            //catch (DTO.PaymentException ex)
            //{
            //    // To return back to the user to inform of an issue processing
            //    return BadRequest(ex.Message);
            //}
            //catch (Exception ex)
            //{
            //    // Something went wrong!
            //    return StatusCode(500, ex.Message);
            //}
        }

        /// <summary>
        /// First CreateBasketOrder before calling this..
        /// Passes in a Basket for which payment is being made. (Could be called twice eg when RequiresAction=true)
        /// - Create order for user -> returns newOrder;
        /// - foreach course  - get future lessons per course
        /// -   Create enrolment per lesson
        /// - Commit transaction
        /// - Initiate Payment - record it against Order
        /// - Send invite emails for each course
        /// - TODO later - Windows service to cleanup Courses created by WebUsers which have no enrolment..
        /// -   Assumption: Any Courses which Web Users create , they PAY for those immediately.
        /// -   Significance - To free up the tutor slots which were booked for Web User created Course.
        /// -   chk CreatorUserId to Identify Courses created by Web users...
        /// </summary>
        /// <param name="basketModel"></param>
        /// <returns></returns>
        [HttpPost("confirmBasketPayment")]
        [ProducesResponseType(typeof(DTO.PaymentResponse), 200)]
        public async Task<IActionResult> ConfirmBasketPayment([FromBody] DTO.BasketDto basketModel)
        {
            try
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name); // Buyer
                if (string.IsNullOrEmpty(basketModel.Payment.PaymentMethodId) && string.IsNullOrEmpty(user.StripeCustomerId))
                    return BadRequest("No payment method could be determined");

                var newOrder = await orderService.GetById(basketModel.OrderId.Value);
                if (newOrder == null) return BadRequest("Please specify a valid order to pay..");
                if (newOrder.OrderPaymentStatus == OrderPaymentStatus.Paid)
                    return Ok("Order already paid..");

                var paymentResult = await _StripeService.ConfirmOrderPayment(user, newOrder, basketModel);
                await orderService.SetOrderPaymentProgress(paymentResult);
                if (paymentResult.PaymentSucceeded)
                    await orderService.SendCourseInvites(user, newOrder, basketModel);

                return Ok(paymentResult);

                // NOTE: Ensure we do the commission calc on Lesson End so that we create a tutor transfer along with tutor transfer amount (and calc the SOcut then)
            }
            catch (DTO.PaymentException ex)
            {
                return BadRequest("Oops! Something went wrong...");
                // Log Payment exception to error log
                // To return back to the user to inform of an issue processing
                // return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                // Something went wrong!
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("createBasketOrder")]
        [ProducesResponseType(typeof(DTO.BasketCreateOrderResponse), 200)]
        public async Task<IActionResult> CreateBasketOrder([FromBody] DTO.BasketDto basketModel)
        {
            var response = new DTO.BasketCreateOrderResponse { Basket = basketModel };
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name); // Buyer

            using (var transaction = unitOfWork.GetContext().Database.BeginTransaction())
            {
                Models.Order newOrder;
                if (!basketModel.OrderId.HasValue || basketModel.OrderId == Guid.Empty)
                {
                    newOrder = await orderService.CreateNewOrder(user, basketModel);
                }
                else
                {
                    newOrder = await orderService.GetById(basketModel.OrderId.Value);
                }
                if (newOrder == null) response.FailResponses.Add(
                    new KeyValuePair<string, string>(basketModel.BasketId.ToString(), "Unable to create order"));

                // Course-lesson has age, maxpersons, priceperperson
                var createEnrolmentsResult = await CreateCourseEnrolments(user, newOrder, basketModel);
                if (createEnrolmentsResult.response.FailResponses.Any())
                {
                    return BadRequest(createEnrolmentsResult.response);
                }

                basketModel.TotalToPay = CalculateOrderTotal(createEnrolmentsResult.attendees);
                var updOrder = await orderService.UpdateOrderTotal(newOrder, basketModel.TotalToPay);
                if (updOrder == null)
                    response.FailResponses.Add(
                        new KeyValuePair<string, string>(response.OrderId.ToString(), "Unable to give order totals"));

                if (response.FailResponses.Any())
                    return BadRequest(response);

                response.OrderId = newOrder.OrderId;
                transaction.Commit();
            };

            return Ok(response);
        }

        private BasketCreateOrderResponse ValidateSessionEnrolmentRequest(Models.ClassSession classSession, User user)
        {
            BasketCreateOrderResponse response = new BasketCreateOrderResponse();

            if (!user.DateOfBirth.HasValue || (classSession.IsUnder16 && user.DateOfBirth.Value.AddYears(19) < DateTime.UtcNow))
                response.FailResponses.Add(new KeyValuePair<string, string>(classSession.ClassSessionId.ToString(),
                    "User (" + user.Id + ") attempted to access a underage lesson"));
            else if (!classSession.IsUnder16 && user.DateOfBirth.Value.AddYears(17) > DateTime.UtcNow)
                response.FailResponses.Add(new KeyValuePair<string, string>(classSession.ClassSessionId.ToString(),
                    "User (" + user.Id + ") attempted to access a overage lesson"));

            if (classSession.SessionAttendees.Any(x => x.UserId == user.Id && !x.IsDeleted && !x.Refunded && !x.Removed))
                response.FailResponses.Add(new KeyValuePair<string, string>(classSession.ClassSessionId.ToString(),
                    "You've already signed up to this lesson!"));

            if (classSession.SessionAttendees.Count(x => !x.IsDeleted && !x.Refunded && !x.Removed) >= classSession.MaxPersons)
                response.FailResponses.Add(new KeyValuePair<string, string>(classSession.ClassSessionId.ToString(),
                    "It looks like this lesson has filled up. Not to worry though, there's plenty more excellent sessions to choose from!"));

            return response;
        }

        private async Task<(BasketCreateOrderResponse response, List<Models.SessionAttendee> attendees)> CreateCourseEnrolments(User user, Models.Order newOrder, BasketDto basketModel)
        {
            List<Models.SessionAttendee> sessionAttendees = new List<Models.SessionAttendee>();
            BasketCreateOrderResponse response = new BasketCreateOrderResponse();
            foreach (var bi in basketModel.BasketItems)
            {
                // Ideally basketItem should have ClassSessions as user UI should be shown how many lessons and at what times they are enroling for
                var classSessions = await courseService.GetFutureLessons(bi.CourseId);

                foreach (var session in classSessions)
                {
                    var validationResponse = ValidateSessionEnrolmentRequest(session, user);
                    if (validationResponse.FailResponses.Any())
                    {
                        return (validationResponse, sessionAttendees);
                    }

                    var sessionAttendee = await _ClassSessionService.Enrol(user, session.ClassSessionId, newOrder);
                    if (sessionAttendee != null)
                    {
                        sessionAttendees.Add(sessionAttendee);
                    }
                    else
                    {
                        response.FailResponses.Add(
                            new KeyValuePair<string, string>(
                                session.ClassSessionId.ToString(), "No more spaces on session."));
                    }
                }
            }
            return (response, sessionAttendees);
        }

        private decimal CalculateOrderTotal(List<Models.SessionAttendee> enrolments)
        {
            return enrolments.Sum(a => a.AmountCharged);
        }

        [HttpPatch("connectPaymentMethod")]
        [ProducesResponseType(typeof(DTO.StripeCard), 200)]
        public async Task<IActionResult> ConnectPaymentMethod([FromBody] DTO.PaymentCardConnect model)
        {
            try
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                var result = await _StripeService.ConnectPaymentMethod(user, model);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPost("pagedReceipts")]
        [ProducesResponseType(typeof(DTO.StripePagedList<DTO.ReceiptIndex>), 200)]
        public async Task<IActionResult> GetPagedReceipts([FromBody] DTO.StripeSearch model)
        {
            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor") || User.IsInRole("Admin"))
                Forbid();
            var user = await _UserManager.FindByNameAsync(User.Identity.Name);
            return Ok(await _StripeService.GetPagedReceipts(model, user));
        }

        [Authorize]
        [HttpGet("StripeConnectRedirect")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> GetStripeConnectRedirect()
        {
            if (!await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
                Forbid();
            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var tutor = await _TutorService.GetById(user.TutorId.Value);
            var redirect = await _StripeService.GetStripeConnectOAuthLink(tutor, user);
            return Ok(redirect);
        }


        [Authorize]
        [HttpGet("BankAccounts")]
        [ProducesResponseType(typeof(IEnumerable<DTO.StripeBankAccount>), 200)]
        public async Task<IActionResult> GetBankAccounts()
        {
            List<Stripe.BankAccount> accounts = new List<Stripe.BankAccount>();
            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                var tutor = await _TutorService.GetById(user.TutorId.Value);
                accounts = await _StripeService.GetBankAccounts(tutor);
            }
            else if(await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Admin"))
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                var company = await _CompanyService.GetByAdminUser(user);
                accounts = await _StripeService.GetBankAccounts(company);
            }
            else
            {
                Forbid();
            }
            return Ok(Mappings.Mapper.Map<List<Stripe.BankAccount>, List<DTO.StripeBankAccount>>(accounts));
        }

        [Authorize]
        [HttpGet("LoginLink")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> GetLoginLink()
        {

            string redirect = string.Empty;
            if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                var tutor = await _TutorService.GetById(user.TutorId.Value);
                redirect = await _StripeService.GetLoginLink(tutor);
            }
            else if (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Admin"))
            {
                var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
                var company = await _CompanyService.GetByAdminUser(user);
                redirect = await _StripeService.GetLoginLink(company);
            }
            else
            {
                Forbid();
            }
            return Ok(redirect);
        }

        [Authorize]
        [HttpPatch("StripeConnect/Bank/{bankId}")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> UpdateBank(string bankId)
        {
            if (!await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor"))
                Forbid();
            if (string.IsNullOrWhiteSpace(bankId))
            {
                return BadRequest();
            }

            var user = await _UserManager.FindByEmailAsync(User.Identity.Name);
            var tutor = await _TutorService.GetById(user.TutorId.Value);
            tutor.StripeConnectBankAccountId = bankId;
            tutor = await _TutorService.Update(tutor);
            return Ok();
        }
    }
}