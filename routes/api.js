'use strict'

const express = require('express')
const app = express.Router()
const request = require('request')
const qs = require('querystring')
const watson = require('watson-developer-cloud')
const extend = require('util')._extend
const i18n = require('i18next')

//i18n settings
require('../config/i18n')(app);

var config
if (process.env.VCAP_SERVICES) {
  config = JSON.parse(process.env.apiKeys)
} else {
  config = require('../config/secret.json')
}


// Create the service wrapper
const personalityInsights = watson.personality_insights({
  version: 'v2',
  username: config.Watson.username,
  password: config.Watson.password
});

console.log(personalityInsights)

const twitterSearch = function(req, res, next) {
  let location = req.query? req.query.location : null
  let url = "https://api.twitter.com/1.1/search/tweets.json?q=" +
    (req.query && req.query.querystring? req.query.querystring : "trump") +
    "&result_type=recent" +
    (location ? "&" + JSON.stringify({ geocode:location }) : "")
  console.log(url)
  request({
    url: url,
    method: "GET",
    headers: {
      "Authorization": "Bearer " + config.Twitter.auth
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body))
    } else {
      console.log(error)
      next()
    }
  })
}

app.post('/profile',
  function(req, res, next) {
    var parameters = extend(req.body, { acceptLanguage: i18n.lng() })

    personalityInsights.profile(parameters, function(err, profile) {
      if (err)
        return next(err)
      else
        return res.json(profile)
    })
  }
)

app.get('/maps',
  function(req, res, next) {
    request({
      url: "https://maps.googleapis.com/maps/api/js?" + qs.stringify({ key: config.GoogleMaps.key }),
      method: "GET"
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body)
      }
    })
  }
)

app.get('/weather',
  function(req, res, next) {
    let location = req.query? req.query.location : null
    request({
      url: "http://api.openweathermap.org/data/2.5/weather?" +
        qs.stringify({ appid: config.OpenWeather.key }) +
        (location ? "&" + qs.stringify({ lat: location.lat, lon: location.lng }) : ""),
      method: "GET"
    }, function(error, response, body) {
      console.log("requested")
      if (!error && response.statusCode == 200) {
        console.log(body),
        res.json(JSON.parse(body))
      } else {
        if (response.statusCode == 502) {
          res.json({"error":"City not found"})
        }
        else {
          console.log("error")
          next(error)
        }
      }
    })
  }
)

app.get('/twitter',
  twitterSearch,
  function(req, res, next) {
    let auth_token = new Buffer(config.Twitter.key + ":" + config.Twitter.secret).toString('base64')
    request({
      url: "https://api.twitter.com/oauth2/token",
      method: "POST",
      headers: {
        "Authorization": "Basic " + auth_token,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      form: {
        grant_type: "client_credentials"
      }

    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        let respBody = JSON.parse(body)
        config.Twitter.auth = respBody["access_token"]
        config.Twitter.token_type = respBody["token_type"]
        console.log(config.Twitter.auth)
        console.log(config.Twitter.token_type)
        twitterSearch(req, res, next)
      } else {
        console.log("Fail")
        console.log(response.statusCode)
        res.render('index')
      }
    })
  }
)

module.exports = app
