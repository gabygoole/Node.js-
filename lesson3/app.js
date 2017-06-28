var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var app = express();

app.get('/',function (req, res, next) {
	superagent.get('https://cnodejs.org/')
		.end(function (err, sres) {
			if(err) {
				return next(err);
}
			var $ = cheerio.load(sres.text);
			var items = [];
			$('#topic_list .topic_title').each(function (idx, element) {
				var $element = $(element);
				$author = $element.parent().siblings(".user_avatar").find("img");
				items.push({
					title: $element.attr('title'),
					href: $element.attr('href'),
					author: $author.attr('title')
});
});
			res.send(items);
});
});

app.listen(3000, function (req, res) {
	console.log('app is running at port 3000');
});
