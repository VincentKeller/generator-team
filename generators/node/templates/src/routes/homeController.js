var express = require('express');
var router = express.Router();
var utils = require('../utility');

// application insights
let client = utils.initAppInsights();
let key = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;

/* GET home page. */
router.get('/', function (req, res, next) {
   client.trackNodeHttpRequest({request: req, response: res});
   client.trackEvent({name: "Get Index", properties: {customProperty: "route is /"}});
   res.render('index', { title: 'Home Page', instrumentationKey: key });
});

router.get('/contact', function (req, res, next) {
   client.trackEvent({name: "Get Contact", properties: {customProperty: "route is /contact"}});
   res.render('contact', { title: 'Contact', message: 'Your contact page.', instrumentationKey: key });
});

router.get('/about', function (req, res, next) {
   client.trackEvent({name: "Get About", properties: {customProperty: "route is /about"}});
   res.render('about', { title: 'About', message: 'Your application description page.', instrumentationKey: key });
});

module.exports = router;