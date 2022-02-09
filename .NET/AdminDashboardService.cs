namespace Sabio.Services
{
    public class AdminDashboardService : IAdminDashboardService
    {
        IDataProvider _data = null;

        public AdminDashboardService(IDataProvider data)
        {
            _data = data;
        }
        public List<PaymentTransactionWithUser> GetTop()
        {
            string procName = "[dbo].[AdminDashboard_Select_Recent_New_Subs]";
            List<PaymentTransactionWithUser> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: null
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                PaymentTransactionWithUser payment = MapPaymentTransactionWithUser(reader, ref startingIndex);
                if (list == null)
                {
                    list = new List<PaymentTransactionWithUser>();
                }
                list.Add(payment);
            });
            return list;
        }
        public List<Subscription> GetActiveSubscriptionCount()
        {
            string procName = "[dbo].[AdminDashboard_TotalCountPerSubscription]";
            List<Subscription> subscriptions = null;

            _data.ExecuteCmd(procName, inputParamMapper: null
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                Subscription subscription = MapSubscription(reader);
                if (subscriptions == null)
                {
                    subscriptions = new List<Subscription>();
                }
                subscriptions.Add(subscription);
            });
            return subscriptions;
        }
        public AdminDash GetYearSubscriptionPayments(int year)
        {
            string procName = "[dbo].[AdminDashboard_Select_Subscriptions_ByYear]";

            AdminDash adminDash = null;

            List<AdminYear> adminYearA = null;
            List<AdminYear> adminYearB = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@Year", year);
            }
            , delegate (IDataReader reader, short set)
            {
                int startingIdex = 0;
                if (set == 0)
                {
                    AdminYear adminYear = MapAdminYear(reader, ref startingIdex);

                    if (adminYearA == null)
                    {
                        adminYearA = new List<AdminYear>();
                    }
                    adminYearA.Add(adminYear);
                }
                else if (set == 1)
                {
                    AdminYear adminYear = MapAdminYear(reader, ref startingIdex);

                    if (adminYearB == null)
                    {
                        adminYearB = new List<AdminYear>();
                    }
                    adminYearB.Add(adminYear);
                }
                    adminDash = new AdminDash();
                    adminDash.Standard = adminYearA;
                    adminDash.Premium = adminYearB;
            }
            );
            return adminDash;
        }
        public List<SubsPerWeek> GetSubsPerWeek(int month, int year)
        {
            string procName = "[dbo].[AdminDashboard_Select_Month_Data]";
            List<SubsPerWeek> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@Month", month);
                param.AddWithValue("@Year", year);
            }
           , delegate (IDataReader reader, short set)
           {
               int startingIndex = 0;
               SubsPerWeek subsPerDay = MapSubsPerWeek(reader, ref startingIndex);
               if (list == null)
               {
                   list = new List<SubsPerWeek>();
               }
               list.Add(subsPerDay);
           }
           );
            return list;
        }
        public Paged<Partner> GetPage(int pageIndex, int pageSize)
        {
            Paged<Partner> pagedList = null;
            List<Partner> list = null;
            int totalCount = 0;

            string procName = "[dbo].[AdminDashboard_Select_Partners_Page]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@pageIndex", pageIndex);
                param.AddWithValue("@pageSize", pageSize);
            }
           , delegate (IDataReader reader, short set)
           {
               int startingIndex = 0;
               Partner aFile = MapPartner(reader, ref startingIndex);
               if (totalCount == 0)
               {
                   totalCount = reader.GetSafeInt32(startingIndex++);
               }
               if (list == null)
               {
                   list = new List<Partner>();
               }
               list.Add(aFile);
           }
           );
            if (list != null)
            {
                pagedList = new Paged<Partner>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<Partner> GetPageSearch(int pageIndex, int pageSize, string search)
        {
            Paged<Partner> pagedList = null;
            List<Partner> list = null;
            int totalCount = 0;

            string procName = "[dbo].[AdminDashboard_Search_Partners_Page]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@pageIndex", pageIndex);
                param.AddWithValue("@pageSize", pageSize);
                param.AddWithValue("@Query", search);
            }
           , delegate (IDataReader reader, short set)
           {
               int startingIndex = 0;
               Partner aFile = MapPartner(reader, ref startingIndex);
               if (totalCount == 0)
               {
                   totalCount = reader.GetSafeInt32(startingIndex++);
               }
               if (list == null)
               {
                   list = new List<Partner>();
               }
               list.Add(aFile);
           }
           );
            if (list != null)
            {
                pagedList = new Paged<Partner>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        private Partner MapPartner(IDataReader reader, ref int startingIndex)
        {

            Partner model = new Partner();

            model.Id = reader.GetSafeInt32(startingIndex++);
            model.Name = reader.GetSafeString(startingIndex++);
            model.ShortDescription = reader.GetSafeString(startingIndex++);
            model.Description = reader.GetSafeString(startingIndex++);
            model.Logo = reader.GetSafeString(startingIndex++);
            model.SiteUrl = reader.GetSafeString(startingIndex++);
            model.LanguageSpoken = reader.GetSafeString(startingIndex++);
            model.IsOrganized = reader.GetSafeBool(startingIndex++);
            model.HasBackgroundCheck = reader.GetSafeBool(startingIndex++);
            model.CreatedBy = reader.GetSafeInt32(startingIndex++);
            model.DateCreated = reader.GetSafeDateTime(startingIndex++);
            model.DateModified = reader.GetSafeDateTime(startingIndex++);
            return model;
        }
        private static AdminYear MapAdminYear(IDataReader reader, ref int startingIdex)
        {
            AdminYear adminYear = new AdminYear();
            adminYear.MonthName = reader.GetSafeString(startingIdex++);
            adminYear.MonthNumber = reader.GetSafeInt32(startingIdex++);
            adminYear.YearNumber = reader.GetSafeInt32(startingIdex++);
            adminYear.Name = reader.GetSafeString(startingIdex++);
            adminYear.Count = reader.GetSafeInt32(startingIdex++);
            adminYear.TotalMoney = reader.GetSafeDecimal(startingIdex++);

            return adminYear;
        }
        private static SubsPerWeek MapSubsPerWeek(IDataReader reader, ref int startingIdex)
        {
            SubsPerWeek subPerDay = new SubsPerWeek();
            subPerDay.WeekNumber = reader.GetSafeInt32(startingIdex++);
            subPerDay.YearNumber = reader.GetSafeInt32(startingIdex++);
            subPerDay.Name = reader.GetSafeString(startingIdex++);
            subPerDay.Count = reader.GetSafeInt32(startingIdex++);
            subPerDay.TotalMoney = reader.GetSafeDecimal(startingIdex++);

            return subPerDay;
        }
        private static Subscription MapSubscription(IDataReader reader)
        {
            int startingIdex = 0;
            Subscription subscription = new Subscription();
            subscription.Id = reader.GetSafeInt32(startingIdex++);
            subscription.Count = reader.GetSafeInt32(startingIdex++);
            subscription.Name = reader.GetSafeString(startingIdex++);
            subscription.Cost = reader.GetSafeDecimal(startingIdex++);

            return subscription;
        }
        private static PaymentTransactionWithUser MapPaymentTransactionWithUser(IDataReader reader, ref int startingIdex)
        {
            PaymentTransactionWithUser paymentWithUser = new PaymentTransactionWithUser();

            paymentWithUser.UserProfile = new UserProfile();
            paymentWithUser.UserProfile.Id = reader.GetSafeInt32(startingIdex++);
            paymentWithUser.UserProfile.UserId = reader.GetSafeInt32(startingIdex++);
            paymentWithUser.UserProfile.FirstName = reader.GetSafeString(startingIdex++);
            paymentWithUser.UserProfile.LastName = reader.GetSafeString(startingIdex++);
            paymentWithUser.UserProfile.Mi = reader.GetSafeString(startingIdex++);
            paymentWithUser.UserProfile.AvatarUrl = reader.GetSafeString(startingIdex++);

            paymentWithUser.User = new User();
            paymentWithUser.User.Id = reader.GetSafeInt32(startingIdex++);
            paymentWithUser.User.Email = reader.GetSafeString(startingIdex++);
            paymentWithUser.User.IsConfirmed = reader.GetSafeBool(startingIdex++);
            paymentWithUser.User.HasProfile = reader.GetSafeBool(startingIdex++);
            paymentWithUser.User.UserStatus = reader.GetSafeString(startingIdex++);
            paymentWithUser.User.Roles = reader.DeserializeObject<IEnumerable<string>>(startingIdex++);
            paymentWithUser.User.DateCreated = reader.GetSafeDateTime(startingIdex++);
            paymentWithUser.User.DateModified = reader.GetSafeDateTime(startingIdex++);

            paymentWithUser.PaymentTransaction = new PaymentTransaction();
            paymentWithUser.PaymentTransaction.Id = reader.GetSafeInt32(startingIdex++);
            paymentWithUser.PaymentTransaction.SubscriptionId = reader.GetSafeString(startingIdex++);
            paymentWithUser.PaymentTransaction.OrderId = reader.GetSafeString(startingIdex++);
            paymentWithUser.PaymentTransaction.Name = reader.GetSafeString(startingIdex++);
            paymentWithUser.PaymentTransaction.Cost = reader.GetSafeDecimal(startingIdex++);
            paymentWithUser.PaymentTransaction.IsRenewed = reader.GetSafeBool(startingIdex++);

            paymentWithUser.PaymentTransaction.SubscriptionType = new SubscriptionType();
            paymentWithUser.PaymentTransaction.SubscriptionType.Id = reader.GetSafeInt32(startingIdex++);
            paymentWithUser.PaymentTransaction.SubscriptionType.Name = reader.GetSafeString(startingIdex++);
            paymentWithUser.PaymentTransaction.SubscriptionType.Cost = reader.GetSafeDecimal(startingIdex++);
            paymentWithUser.PaymentTransaction.SubscriptionType.Description = reader.GetSafeString(startingIdex++);
            paymentWithUser.PaymentTransaction.SubscriptionType.PlanId = reader.GetSafeString(startingIdex++);

            paymentWithUser.PaymentTransaction.PaymentTypeId = reader.GetSafeInt32(startingIdex++);
            paymentWithUser.PaymentTransaction.PaymentType = reader.GetSafeString(startingIdex++);
            paymentWithUser.PaymentTransaction.DateCreated = reader.GetSafeDateTime(startingIdex++);
            paymentWithUser.PaymentTransaction.DateModifed = reader.GetSafeDateTime(startingIdex++);
            paymentWithUser.PaymentTransaction.CreatedBy = reader.GetSafeInt32(startingIdex++);
            paymentWithUser.PaymentTransaction.ModifiedBy = reader.GetSafeInt32(startingIdex++);

            return paymentWithUser;
        }
    }
}
