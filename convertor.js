var BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var URLEX = new RegExp('^http://m.weibo.cn/(\\d+)/(\\d+)[/?#].+');
var CIDEX = new RegExp('[?#&]cid=(\\d+)(&.*)?$')
var MEDEX = new RegExp('[?&]id=(\\d+)(&.*)?$')

chrome.pageAction.onClicked.addListener(function(tab){
    var newurl = tab.url;
    var info = URLEX.exec(newurl);
    if (info) {
        var mid = info[2];
        var ret = '';
        for (var i = mid.length; i > 0; i -= 7) {
            var curr = mid.substring(Math.max(0, i - 7), i);
            var n = parseInt(curr);
            for (var j = 0; j < 4; j ++) {
                ret = BASE62.charAt(n % 62) + ret;
                n = ~~(n / 62);
            }
        }
        newurl = 'http://weibo.com/' + info[1] + '/' + ret.replace(/^0+/, '');
    }
    info = CIDEX.exec(newurl);
    if (info) {
        newurl = 'http://weibo.com/p/' + info[1];
    }
    info = MEDEX.exec(newurl);
    if (info) {
        newurl = 'http://weibo.com/p/' + info[1];
    }
    chrome.tabs.update(tab.id, {url: newurl});
});

// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { hostEquals: "m.weibo.cn" },
          }),
          new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { hostEquals: "card.weibo.com" },
          }),
          new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { hostEquals: "media.weibo.cn" },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});
