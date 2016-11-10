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
module.exports = function (app) {

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.code = 404;
    err.message = 'Not Found';
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    var error = {
      code: err.code || 500,
      error: err.error || err.message
    };
    if (req.url && req.url.indexOf('/json') !== 0)
      console.log('error:', error, 'url:',req.url);

    if (err.code === 'EBADCSRFTOKEN') {
      error = {
        code: 403,
        error: 'http://goo.gl/mGOksD'
      };
    }
    res.status(error.code).json(error);
  });

};
