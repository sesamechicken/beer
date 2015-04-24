var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


app.get('/beerlist', function(req, res){
    var url = 'http://www.point2mobile.com/depsfinewine/depsfinewinecloseoutbeer.html';

    var beerList = [
        {name: 'Stone IPA', price: '12.99', unit: 'case'},
        {name: 'Stone IPA', price: '12.99', unit: 'case'},
        {name: 'Stone IPA', price: '12.99', unit: 'case'},
        {name: 'Stone IPA', price: '12.99', unit: 'case'},
        {name: 'Stone IPA', price: '12.99', unit: 'case'},
        {name: 'Stone IPA', price: '12.99', unit: 'case'}
    ];

    res.send(JSON.stringify(beerList));

});


app.get('/api', function(req, res){
    
    // Go to google and get the link to the beer advocate site
    var url = req.query;
    console.log(req.query);

    var api_key = 'b339256c241180f6a38f6baac6d63805';
    var api_url = 'http://api.brewerydb.com/v2/search?'+'&key='+api_key;
    api_url += '&q=' + req.query.q;
    api_url += '&type=beer';
    api_url += '&p=1'; 
    api_url += '&withBreweries=Y';

    
    request(api_url, function(error, response, data){
        if(!error){
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(data);    
        }else{
            status = 0;
            var error = {status: status}
            res.send(JSON.stringify(error));
        }
    });
});

app.listen(process.env.PORT || 8081);
console.log('Magic happens on port 8081');
exports = module.exports = app;