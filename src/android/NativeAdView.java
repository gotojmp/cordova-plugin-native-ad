/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/
package com.gotojmp.cordova.NativeAd;

import android.content.Context;
import android.graphics.Color;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.view.Gravity;
import android.view.View;
import android.widget.Toast;

/**
 * Created by Oliver on 22/11/2013.
 */
public class NativeAdView extends FrameLayout {
    Context context;
    private NativeAd nativeAd = null;
    private WebView webView = null;
    private RelativeLayout container = null;
    public int id = 0;
    private Boolean hidden = false;

    public NativeAdView(Context context, NativeAd nativeAd, int w, int h, int cw, int ch, String closeAt) {
        super(context);
        this.context = context;
        this.nativeAd = nativeAd;

        this.setLayoutParams(new FrameLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
        this.container = new RelativeLayout(this.context);
        this.container.setLayoutParams(new RelativeLayout.LayoutParams(w, h));
        this.addView(this.container);

        this.webView = new WebView(context);
        this.webView.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
        WebSettings settings = this.webView.getSettings();
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setJavaScriptEnabled(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        this.webView.setWebViewClient(new NativeAdViewClient(this));
        this.container.addView(this.webView);

        RelativeLayout closeButton = new RelativeLayout(this.context);
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(cw, ch);
        if (closeAt.equals("topLeft")) {
            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        } else if (closeAt.equals("topRight")) {
            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        } else if (closeAt.equals("bottomLeft")) {
            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        } else if (closeAt.equals("bottomRight")) {
            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        }
        closeButton.setLayoutParams(layoutParams);
        TextView close = new TextView(this.context);
        close.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
        close.setBackgroundColor(Color.LTGRAY);
        close.setTextColor(Color.WHITE);
        close.setTextSize(12);
        close.setText("关闭广告");
        close.setGravity(Gravity.CENTER);
        close.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                closeAdView(true);
            }
        });
        closeButton.addView(close);
        this.container.addView(closeButton);
    }

    public void load(String html) {
        this.webView.loadData(html, "text/html; charset=UTF-8", null);
    }

    public void closeAdView(Boolean isUser) {
        if (!this.hidden) {
            ((ViewGroup) this.getParent()).removeView(this);
        }
        this.hidden = true;
        if (isUser) {
            this.nativeAd.onClose(this.id);
        }
    }

    public class NativeAdViewClient extends WebViewClient {
        NativeAdView adView;

        public NativeAdViewClient (NativeAdView view) {
            this.adView = view;
        }
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (url.startsWith("http://") || url.startsWith("https://")) {
                // 调用系统默认浏览器处理url
                view.stopLoading();
                this.adView.nativeAd.showWebPage(url, null);
                return true;
            }
            return false;
        }
    }

    public NativeAdView getView() {
        return this;
    }
}

