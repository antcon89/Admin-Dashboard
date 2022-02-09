ALTER proc [dbo].[AdminDashboard_Select_Recent_New_Subs]

as 

/*

Execute [dbo].[AdminDashboard_Select_Recent_New_Subs]

*/

BEGIN



		SELECT TOP 6 up.[Id] 
					,up.[UserId]
					,up.[FirstName]
					,up.[LastName]
					,up.[Mi]
					,up.[AvatarUrl]
					,u.[Id]
					,u.[Email]
					,u.[IsConfirmed]
					,u.[HasProfile]
					,u.[UserStatus]
					,u.[Roles]
					,u.UserCreated
					,u.UserModified
					,p.[Id]
					,p.[SubscriptionId]
					,p.[OrderId]
					,p.[Name]
					,p.[Cost]
					,p.[IsRenewed]
					,p.[SubscriptionTypeId]
					,s.[Name] as SubscriptionName
					,s.[Cost]
					,s.[Description]
					,s.[PlanId]
					,p.[PaymentTypeId]
					,ty.[PaymentType]
					,p.[DateCreated]
					,p.[DateModifed]
					,p.[CreatedBy]
					,p.[ModifiedBy]

	  FROM [dbo].[PaymentTransactions] AS p 
			INNER JOIN dbo.SubscriptionType AS s
				ON p.SubscriptionTypeId = s.Id
			INNER JOIN dbo.PaymentTypes AS ty
				ON p.PaymentTypeId = ty.Id
			INNER JOIN [dbo].[vwUser_Basic] as u
				ON u.Id = p.CreatedBy
			INNER JOIN dbo.UserProfiles as up
				ON u.id = up.UserId

		Where p.IsRenewed = 1

		ORDER BY p.[DateCreated] DESC
END
