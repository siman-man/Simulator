var Article = {
	createArticle: function(user){
		var article;
		article.user_id = user.id;
		article.id = this.generateArticleId(article);
		article.title = generateArticleTitle();
		article.content = generateArticleContent();

		return generateHtmlHead(article);
	},

	generateArticleId: function(article){
		var id = Simulator.article_id;
		Simulator.article_id++;
		return id;
	},

	generateArticleContent: function(){
		return 'hello world!';
	},

	generateArticleTitle: function(){
		return 'Test';
	},

	generateHtmlHead: function(article){
		return '<p>' + article.title + '</p>';
	},
}