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
    var exec = require('cordova/exec');

    function NativeAd() {
        this.id = 0;
    }

    NativeAd.prototype = {
        close: function () {
            exec(null, null, "NativeAd", "close", [this.id]);
        }
    };

    module.exports = function(html, width, height, left, top) {
        var ad = new NativeAd();
        width = width || 0;
        height = height || 0;
        left = left || 0;
        top = top || 0;
        var cb = function (id) {
            console.log('open ad', id);
            ad.id = id;
        };
        exec(cb, cb, "NativeAd", "open", [html, width, height, left, top]);
        return ad;
    };
})();
