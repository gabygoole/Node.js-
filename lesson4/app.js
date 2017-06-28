var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
	.end(function(err, res){
		if(err) {
			return console.error(err);
		}
		var topicUrls = [];
		var $ = cheerio.load(res.text);
		var ep = new eventproxy();
		$("#topic_list .topic_title").each(function(index,element) {
			$element = $(element);
			var href = url.resolve(cnodeUrl, $element.attr("href"));
			topicUrls.push(href);
		});

		topicUrls.forEach(function(topicUrl){
			superagent.get(topicUrl)
				.end(function(err, res){
					console.log("fetch " + topicUrl + " successful");
					ep.emit('topic_html',[topicUrl, res.text]);
				});
		});

		
		ep.after('topic_html',topicUrls.length,function(pairs){
			pairs = pairs.map(function(pair){
				var gurl = pair[0];
				var gres = pair[1];
				var $ = cheerio.load(gres);
				return ({
					href : gurl,
					title: $(".topic_full_title").text().trim(),
					comment1: $(".reply_content").eq(0).text().trim(),
					author: $(".user_name").text().trim(),
					score: $(".big").text().trim().replace(/积分:\s(\d+)/,"$1")
				});
			});

			console.log('final:');
			console.log(pairs);
		});
	});

