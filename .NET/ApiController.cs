using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.AdminDashboard;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/admins")]
    [ApiController]
    public class AdminDashboardApiController : BaseApiController
    {
        private IAdminDashboardService _service = null;
        private IAuthenticationService<int> _authService = null;

        public AdminDashboardApiController(IAdminDashboardService service
          , ILogger<AdminDashboardApiController> logger
          , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
        [HttpGet]
        public ActionResult<ItemsResponse<PaymentTransactionWithUser>> GetTop()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<PaymentTransactionWithUser> list = _service.GetTop();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<PaymentTransactionWithUser> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("monthly/subs")]
        public ActionResult<ItemResponse<List<SubsPerWeek>>> GetSubsPerWeek(int month, int year)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                List<SubsPerWeek> subsPerWeek = _service.GetSubsPerWeek(month, year);

                if (subsPerWeek == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<SubsPerWeek>> { Item = subsPerWeek };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }
        [HttpGet("subscription/active")]
        public ActionResult<ItemsResponse<Subscription>> GetActiveSubscriptionCount()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<Subscription> list = _service.GetActiveSubscriptionCount();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<Subscription> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("year")]
        public ActionResult<ItemResponse<AdminDash>> GetYearSubscriptionPayments(int year)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                AdminDash result = _service.GetYearSubscriptionPayments(year);
                if (result == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<AdminDash> { Item = result };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("paginate/partner")]
        public ActionResult<ItemResponse<Paged<Partner>>> GetPage(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Partner> page = _service.GetPage(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Partner>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
}
