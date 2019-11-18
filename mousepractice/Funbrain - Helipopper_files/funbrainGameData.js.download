/**
 * Created by UFRAND3 on 8/13/14.
 */
window.funbrain = window.funbrain || {};
window.funbrain.GameData = (function () {
    "use strict";
    return (function (gameName, brainName) {
        var http;
        var urlPrefix = '';

        if (!brainName) {
            brainName = 'math';
        }

        /**
         * Internal function to create a request object if we need one.
         *
         * @returns XMLHttpRequest|ActiveXObject
         */
        function createRequestObject() {
            if (!http || (http.readyState !== /* UNSENT */ 0 && http.readyState !== /* DONE */ 4)) {
                if (window.XMLHttpRequest) {
                    // Mozilla, Safari, Chrome, IE >= 7
                    http = new XMLHttpRequest();
                } else if (window.ActiveXObject) {
                    // IE < 7
                    http = new window.ActiveXObject("Microsoft.XMLHTTP");
                }
            }
            return http;
        }

        /**
         * Internal function to build a request string given the brain and game.
         * It will eventually pick up grade from a cookie.
         */
        function buildGameRequest() {
            var r = [];
            /* Always V2 to generate JSON output */
            r[r.length] = 'version=2';
            r[r.length] = 'brain=' + encodeURIComponent(brainName);
            r[r.length] = 'game=' + encodeURIComponent(gameName);
            r[r.length] = 'grade_low=' + encodeURIComponent('0');
            r[r.length] = 'grade_high=' + encodeURIComponent('6');
            return r.join('&');
        }

        return {
            setUrlPrefix: function (prefix) {
                urlPrefix = prefix;
            },

            getProblemSet: function (callBack, nProblems, errorCallBack) {
                var localHttp = createRequestObject();
                var request;
                if (!errorCallBack) {
                    errorCallBack = alert;
                }
                /* tinybop: Removed URL prefix so this works generically */
                if (!urlPrefix && window.location.hostname.indexOf('.funbrain.com') == -1) {
                    urlPrefix = '';
                }
                request = buildGameRequest();
                localHttp.open('GET', urlPrefix + '/cgi-bin/braindata.php?' + request);
                localHttp.onreadystatechange = (function () {
                    var resp, o;
                    if (localHttp.readyState === 4) {
                        if (localHttp.status == 200) {
                            resp = localHttp.responseText;
                            o = null;
                            try {
                                o = JSON.parse(resp);
                                if (o.problems.length > nProblems) {
                                    o.problems.length = nProblems;
                                }
                            } catch (err) {
                                errorCallBack('Received garbled JSON: ' + err.message);
                            }
                            if (o) {
                                callBack(o);
                                return true;
                            }
                        } else {
                            errorCallBack('Error getting game data: ' + localHttp.status + ' ' + localHttp.statusText);
                        }
                    }
                    return false;
                });
                localHttp.send(null);
            }
        };
    });
}());
