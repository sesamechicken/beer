var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


app.get('/beerlist', function(req, res){
    var url = 'http://www.point2mobile.com/depsfinewine/depsfinewinecloseoutbeer.html';
    console.log('requesting beer list from ' + url);

    request(url, function(error, response, html){
    var beers = [];
        if(!error){
            var $ = cheerio.load(html);


            console.log($('body').html());
            res.send('ok');




        }else{
            res.send(error);
        }
    });
});


app.get('/api', function(req, res){
    // The URL we will scrape from - in our example Anchorman 2.
    console.log(req.query.beer);
    var beer = req.query.beer;
    // Go to google and get the link to the beer advocate site
    var url = 'http://www.beeradvocate.com/search/?q=' + encodeURIComponent(beer);

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    getBeerURL(url);

    function getBeerURL(url){
        request(url, function(error, response, html){
        var temp_url, data_href;
        /* attrs */


        if(!error){
            var $ = cheerio.load(html);
            $('#ba-content ul li a').first().filter(function(){
                var data = $(this);
                console.log("href: " + data.attr('href'));
                data_href = data.attr('href');
                temp_url = "http://beeradvocate.com" + data_href;
                console.log("temp_url: " +temp_url);
            });
            if(!data_href){
                status = 0;
                var error = {status: status}
                res.send(JSON.stringify(error));
            }else{
                getDetails(temp_url);
            }
        }else{
            status = 0;
            var error = {status: status}
            res.send(JSON.stringify(error));
        }
    });


    }

    function getDetails(beer_url){
        var status, beer_name, score, brewer, style, abv, desc, score_text, ratings, image;
        /* Got the URL, let's go */
        request(beer_url, function(error, response, html){
            if(!error){
                console.log('going to ' + beer_url);
                var $ = cheerio.load(html);

                $('.titleBar h1').filter(function(){
                    beer_name = $(this).text();
                });
                $('span.ba-score').filter(function(){
                    score = $(this).text();
                });
                $('span.ba-ratings').filter(function(){
                    ratings = $(this).text();
                });
                $('span.ba-score_text').filter(function(){
                    score_text = $(this).text();
                });

                $('#ba-content a').eq(7).filter(function(){
                    brewer = $(this).text();
                });
                $('#ba-content a').eq(11).filter(function(){
                    if($(this).text() == "ABV"){
                        style = "NA";
                    }else{
                        style = $(this).text();
                    }
                });

                image = $('#ba-content img').attr('src');

                var json = {status: 1, beer_name: beer_name, score : score, score_text: score_text, ratings: ratings, brewer: brewer, style: style, image: image};
                res.send(JSON.stringify(json));
            }
            else{
                status = 0;
                var error = {status: status}
                res.send(JSON.stringify(error));
            }
        });
    }
});

app.listen(process.env.PORT || 8081);
console.log('Magic happens on port 8081');
exports = module.exports = app;