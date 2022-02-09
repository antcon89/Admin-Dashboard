ALTER PROC [dbo].[AdminDashboard_Select_Partners_Page]
	
	@pageIndex int 
	,@pageSize int


/*
		Declare 
			@pageIndex int = 0
			,@pageSize int = 2

		Execute [dbo].[AdminDashboard_Select_Partners_Page]
			@pageIndex
			,@pageSize 

*/

AS

BEGIN

	Declare @offset int = @pageIndex * @pageSize



	SELECT [Id]
		  ,[Name]
		  ,[ShortDescription]
		  ,[Description]
		  ,[Logo]
		  ,[SiteUrl]
		  ,[LanguageSpoken]
		  ,[IsOrganized]
		  ,[HasBackgroundCheck]
		  ,[CreatedBy]
		  ,[DateCreated]
		  ,[DateModified]
		  ,TotalCount = COUNT(1) OVER()
	  FROM [dbo].[Partners]

		

	  ORDER BY Id

	  OFFSET @offSet Rows

	  Fetch Next @pageSize Rows ONLY

END
