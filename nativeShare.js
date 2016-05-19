(function(global, factory) {
    'use strict';
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error('nativeShare requires a window with a document');
                }
                return factory(w);
			};
    } else {
        factory(global);
    }
}(typeof window !== 'undefined' ? window : this, function(window, noGlobal) {
    'use strict';
    var ua = (function () {
        var result = {
            os: null,
            browser: null,
            version: null
        };
        var agent = window.navigator.userAgentent;
        var match = null;
        if (/tieba/i.test(agent)) {
            result.browser = 'tieba';
        } else if (/baiduboxapp/i.test(agent)) {
            result.browser = 'baidubox';
        } else if (/MicroMessenger/i.test(agent)) {
            result.browser = 'weixin';
        } else if (match = /UCBrowser\/([\w.]+)/i.exec(agent)) {
            result.browser = 'uc';
            result.version = match[1];
        } else if (/MQQ/i.test(agent)) {
            result.browser = 'qq';
            if (match = /Version\/([\w.]+)/i.exec(agent)) {
                result.version = match[1];
            }
        }
        if (agent.match('iPhone( Simulator)?;') || agent.match('iPad;') || agent.match('iPod;')) {
            result.os = 'ios';
        } else if (agent.match('Android')) {
            result.os = 'android';
        }
        return result;
    })();
    var defaults = function (target, source) {
        var k = null;
        for(k in source) {
            if (source.hasOwnProperty(k) && !target[k]) {
                target[k] = source[k];
            }
        }
        return target;
    };
    var doc = document;
    var intallScript = function (url, callback) {
        var head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;
        var node = doc.createElement('script');
        var onload = function (error) {
            node.onload = node.onerror = null;
            head.removeChild(node);
            node = null;
            callback(error);
        };
        node.onload = onload;
        node.onerror = function () {
            onload(true);
        };
        node.async = true;
        node.src = url;
        head.appendChild(node);
    };
    var title = doc.title;
    var tmp = null;
    var tiebShare = function () {

    };
    var nativeShare = function (config) {
        defaults(config, {
            link: window.location.href || '',
            title: title,
            desc: title,
            imgUrl: (tmp = doc.getElementsByTagName('img')[0]) && tmp.src || '',
            imgTitle: title,
            from: window.location.host
        });
        switch(ua.browser) {
            case 'tieba':
                tiebShare(config);
                break;
            case 'weixin':
                intallScript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', function (error) {
                    if (!error) {

                    }
                });
            case 'baiduboxapp':
                intallScript('http://static1.searchbox.baidu.com/static/searchbox/openjs/aio.js?v=201502', function (error) {
                    if (!error) {

                    }
                });
            case 'uc':
            case 'qq':
            default:
                break;
        }
    };
    return nativeShare;
}));