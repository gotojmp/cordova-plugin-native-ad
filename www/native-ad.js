/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

(function() {

    var cordova = require('cordova');
    var exec = require('cordova/exec');
    var modulemapper = require('cordova/modulemapper');
    var urlutil = require('cordova/urlutil');
    var channel = require('cordova/channel');

    function AdView() {
        this.id = 0;
        this.onClose = function () {};
        this.onClick = function () {};
    }

    AdView.prototype = {
        close: function () {
            this.id && exec(null, null, "NativeAd", "close", [this.id]);
        }
    };

    var NativeAd = {
        ads: {},
        onClose: function (id) {
            var ad = this.ads[id];
            if (ad) ad.onClose();
        },
        onClick: function (id, pos) {
            var ad = this.ads[id];
            if (ad) ad.onClick(pos);
        },
        openDeepLink: function(deepLink, strUrl, strWindowFeatures, callback) {
            strUrl = urlutil.makeAbsolute(strUrl);
            var cb = function () {
                console.log('open ad deep link');
                if (typeof callback == 'function') {
                    callback.apply(null, arguments);
                }
            };
            strWindowFeatures = strWindowFeatures || "";
            exec(cb, cb, "NativeAd", "openDeepLink", [deepLink, strUrl, strWindowFeatures]);
        },
        openUrl: function(strUrl, strWindowName, strWindowFeatures, callback) {
            // Don't catch calls that write to existing frames (e.g. named iframes).
            if (window.frames && window.frames[strWindowName]) {
                var origOpenFunc = modulemapper.getOriginalSymbol(window, 'open');
                return origOpenFunc.apply(window, arguments);
            }
            strUrl = urlutil.makeAbsolute(strUrl);
            var cb = function () {
                console.log('open ad landing page');
                if (typeof callback == 'function') {
                    callback.apply(null, arguments);
                }
            };
            strWindowFeatures = strWindowFeatures || "";
            exec(cb, cb, "NativeAd", "openUrl", [strUrl, strWindowName, strWindowFeatures]);
        },
        open: function(html, width, height, showAt, closeAt) {
            var ad = new AdView();
            width = width || 0;
            height = height || 0;
            showAt = showAt || 'bottom';
            closeAt = closeAt || 'topRight';
            var cb = function (id) {
                console.log('open ad', id);
                ad.id = id;
                NativeAd.ads[id] = ad;
            };
            exec(cb, cb, "NativeAd", "open", [html, width, height, showAt, closeAt]);
            return ad;
        }
    };

    if (cordova.platformId == 'android') {
        channel.onCordovaReady.subscribe(function () {
            exec(function (id) {
                id && NativeAd.onClose(id);
            }, null, "NativeAd", "onClose", []);
        });
        channel.onCordovaReady.subscribe(function () {
            exec(function (obj) {
                obj.id && NativeAd.onClick(obj.id, obj.pos);
            }, null, "NativeAd", "onClick", []);
        });
    }

    module.exports = NativeAd;

})();
