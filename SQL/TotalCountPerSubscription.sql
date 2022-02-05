ALTER PROC [dbo].[AdminDashboard_TotalCountPerSubscription]

/*
		Execute [dbo].[AdminDashboard_TotalCountPerSubscription]

*/

AS

BEGIN


		SELECT  
				p.SubscriptionTypeId
				,count(P.[SubscriptionTypeId]) AS SubscriptionCount
				,p.[Name]
				,p.Cost
		  FROM [dbo].[SubscriptionType]  AS s
		  LEFT JOIN [dbo].[PaymentTransactions] AS p
				ON s.Id = p.SubscriptionTypeId

		where DateCreated > dateadd(month, -1, (select max(GETUTCDATE()) from [dbo].[PaymentTransactions])) 
		and  p.IsRenewed = 1

		group by s.Id, p.SubscriptionTypeId, p.Cost, p.[Name]

		

END
