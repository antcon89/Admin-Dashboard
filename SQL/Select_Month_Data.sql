ALTER PROC [dbo].[AdminDashboard_Select_Month_Data]
      @Month int
	  ,@Year int

/*
		Declare 
			@Month int = 1
			,@Year int = 2021

	Execute [dbo].[AdminDashboard_Select_Month_Data] @Month, @Year

*/

AS

BEGIN

		
		select datepart(WW, p.DateCreated) as WeekNumber
				,Year(p.DateCreated) as YearNumber
				,p.[Name]
				,count(*) as [Count]
				,sum(p.Cost) as totalMoney
		from dbo.PaymentTransactions as p
		where datepart(YY, p.DateCreated) = @Year and Month(p.DateCreated) = @Month
		
		group by  p.[Name],datepart(WW, p.DateCreated) ,Year(p.DateCreated)
		order by p.[Name] DESC

END
