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
	var modulemapper = require('cordova/modulemapper');
	var urlutil = require('cordova/urlutil');

	function AdView() {
		this.id = 0;
	}

	AdView.prototype = {
		close: function () {
			this.id && exec(null, null, "NativeAd", "close", [this.id]);
		}
	};

	module.exports = {
		openUrl: function(strUrl, strWindowName, strWindowFeatures, callbacks) {
			// Don't catch calls that write to existing frames (e.g. named iframes).
			if (window.frames && window.frames[strWindowName]) {
				var origOpenFunc = modulemapper.getOriginalSymbol(window, 'open');
				return origOpenFunc.apply(window, arguments);
			}
			strUrl = urlutil.makeAbsolute(strUrl);
			callbacks = callbacks || {};
			var cb = function (eventname) { console.log('open ad landing page'); };
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
			};
			exec(cb, cb, "NativeAd", "open", [html, width, height, showAt, closeAt]);
			return ad;
		}
	};
})();
