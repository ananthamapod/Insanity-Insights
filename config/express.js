/**
 * Copyright 2016 Ananth Rao. All Rights Reserved.
 *
 * Based on IBM Personality Insights Boilerplate found at
 * https://console.ng.bluemix.net/catalog/starters/personality-insights-nodejs-web-starter
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Module dependencies
var express    = require('express'),
  bodyParser   = require('body-parser');

module.exports = function (app) {
  app.set('view engine', 'pug');
  app.enable('trust proxy');

  // Configure Express
  app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(express.static(__dirname + '/../public'));

  // Only loaded when SECURE_EXPRESS is `true`
  if (process.env.SECURE_EXPRESS)
    require('./security')(app);

};
