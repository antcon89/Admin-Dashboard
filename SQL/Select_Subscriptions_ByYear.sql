ALTER proc [dbo].[AdminDashboard_Select_Subscriptions_ByYear]
      @Year int


/*
           --- Test Code ---

		Declare 
			@Year int = 2021


	Execute [dbo].[AdminDashboard_Select_Subscriptions_ByYear] @Year

*/

AS

BEGIN


		select Convert (CHAR, DateName(Month, p.DateCreated)) as [MonthName]
				,Month(p.DateCreated) as MonthNumber
				,Year(p.DateCreated) as YearNumber
				,p.[Name]
				,count(*) as [Count]
				,sum(p.Cost) as totalMoney
		from dbo.PaymentTransactions as p
		where   p.[Name]  ='Standard' AND Year(p.DateCreated) = @Year
		group by Convert (CHAR, DateName(Month, p.DateCreated)), p.[Name], Year(p.DateCreated) ,Month(p.DateCreated) 



		

		select Convert (CHAR, DateName(Month, p.DateCreated)) as [MonthName]
				,Month(p.DateCreated) as MonthNumber
				,Year(p.DateCreated) as YearNumber
				,p.[Name]
				,count(*) as [Count]
				,sum(p.Cost) as totalMoney
		from dbo.PaymentTransactions as p
		where   p.[Name]  ='Premium' AND Year(p.DateCreated) = @Year
		group by Convert (CHAR, DateName(Month, p.DateCreated)),p.[Name], Year(p.DateCreated),Month(p.DateCreated) 
		
	

END
