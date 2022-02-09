ALTER PROC [dbo].[AdminDashboard_Search_Partners_Page]
	
	@pageIndex int 
	,@pageSize int
	,@Query nvarchar(100)

/*
		Declare 
			@pageIndex int = 0
			,@pageSize int = 6
			,@Query nvarchar(100) = 'Jo'

		Execute [dbo].[AdminDashboard_Search_Partners_Page]
			@pageIndex
			,@pageSize 
			,@Query
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

	  WHERE ([Name] LIKE '%' + @Query + '%' OR 
         [ShortDescription] LIKE '%' + @Query + '%')

	  ORDER BY Id

	  OFFSET @offSet Rows

	  Fetch Next @pageSize Rows ONLY

END
