var Article = {
	createArticle: function(user){
		var article = new Object();
		article.user_id = user.id;
		article.id = this.generateArticleId(article);
		article.title = this.generateArticleTitle();
		article.content = this.generateArticleContent();

		return article;
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
		return 'hello';
	},

	generateHtmlHead: function(article){
		return '<p>' + article.title + '</p>';
	},
}