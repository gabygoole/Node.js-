var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var url = require('url');
var cnodeUrl = "https://cnodejs.org/";
superagent.get(cnodeUrl)
	.end(function(err,res){
		if(err) {
			return console.error(err);
		}
		var topicUrls = [];
		var onCurrentCount = 0;
		var $ = cheerio.load(res.text);
		$('#topic_list .topic_title').each(function(index,element){
			$element = $(element);
			topicUrls.push(url.resolve(cnodeUrl, $element.attr("href")));	
		});	

		async.mapLimit(topicUrls,5,function(topicUrl, callback){
			var delay = Math.ceil(Math.random() * 2000);
			onCurrentCount++;
			console.log("现在的并发数:" + onCurrentCount + "正在抓取的是:" + topicUrl + "延迟是：" + delay);
			setTimeout(function(){
				var title,comment1;
				onCurrentCount--;
				superagent.get(topicUrl)
					.end(function(err,res){
						var $ = cheerio.load(res.text);
						title = $('.topic_full_title').text().trim();
						comment1 = $('.reply_content').eq(0).text().trim();
						callback(null, {
							title: title,
							href: topicUrl,
							comment1: comment1
						});
					});

			},delay);
		},function(err,result){
			console.log(result);
		});
	});

