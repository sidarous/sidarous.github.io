/**
 * Common brain event tracker interface functions
 *
 * <script src="/js/brainEventTracker.js"></script>
 *
 * brainEventTracker.addEvent(object params) - the heart of it all.
 * Formats the params object's properties and places the request to /brain/track.php.
 *
 * brainEventTracker.logGameEvent(object args) - wrapper for use by games
 * Takes event name and a few other properties in its args and calls addEvent.
 * Can add previously set game or gender to the request.
 *
 * @author Dan Franklin <dan.franklin@pearson.com>
 * @version SVN: $Id: brainEventTracker.js 153873 2016-08-12 16:36:05Z ufrand3 $
 */
window.brainEventTracker = (function () {
    "use strict";

    var http, r, gameValues = {}, fieldNames = {
        brain: true,
        campaign: true,
        choice: true,
        cluster: true,
        country: true,
        dma: true,
        event: true,
        game: true,
        gender: function (g) { return (g === 'M' || g === 'F' || g === '?'); },
        grade: function (g) {
            return (typeof g === 'number') || ((typeof g === 'string') && (g.search(/^(-?[0-9]+)|(\?)$/)) >= 0);
        },
        lang: true,
        login: true,
        member: true,
        numvals: true,
        platform: true,
        randomNumber: true,
        scene: true,
        site: true,
        subchoice: true,
        time: true
    };

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
     * Track one event.
     *
     * @param params - event parameters, as an object. E.g.
     *        { event:"Loaded", gender:"M", grade:7, lang:"en", ... }
     * Parameter names must be chosen from the list of fieldNames above.
     *
     * @return object - object with following properties:
     *     bool   success: true or false
     *     string message: if success===false, contains description of the error
     *     object http:    if success===true, this is the XMLHttpRequest object with the pending call
     */
    function addEvent(params) {
        var localHttp = createRequestObject(), request = [], field;

        for (field in params) {
            if (params.hasOwnProperty(field)) {
                if (!fieldNames.hasOwnProperty(field)) {
                    return { success: false, message: "No such parameter '" + field + "'" };
                }
                if (typeof fieldNames[field] === 'function' && !(fieldNames[field])(params[field])) {
                    return { success: false, message: "Parameter '" + field + "' has invalid value '" + params[field] + "'" };
                }
                request[request.length] = field + '=' + encodeURIComponent(params[field]);
            }
        }
        if (!params.hasOwnProperty('randomNumber')) {
            request[request.length] = 'randomNumber=' + Math.random();
        }
        // localHttp.open('GET', '/brain/track.php?' + request.join('&'), /* async */ true);
        // localHttp.send(null);
        // return { success: true, message: "", "http": localHttp };
    }

    /**
     * Log one game event.  This is a specialization of addEvent that provides
     * grade and gender, when known, and reformats some of the object properties.
     *
     * @param args - object containing these properties:
     *     string event      - event name (required)
     *     string game_name  - name of game (required)
     *     int    time_spent - (Optional) time spent in game, in seconds (events 'won' 'lost' 'done')
     *     int    stars      - (Optional) number of stars won so far (events 'won' 'lost' 'done')
     *     ... other fields  - (Optional) other fields listed in fieldNames above, except numvals
     */
    function logGameEvent(args) {
        var p, required = {'event': true, 'game_name': true}, params = {};
        for (p in required) {
            if (required.hasOwnProperty(p)) {
                if (!args.hasOwnProperty(p)) {
                    return { success: false, message: p + " is required" };
                }
            }
        }
        for (var p in args) {
            // Ignore numvals so we don't have to merge it with time_spent
            if (args.hasOwnProperty(p) && p !== 'numvals') {
                if (fieldNames.hasOwnProperty(p)) {
                    params[p] = args[p];
                }
            }
        }
        params.event = args.event;
        params.game = args.game_name;
        if (args.hasOwnProperty('time_spent')) {
            params.numvals = 'TimeSpent:' + args.time_spent;
        }
        if (args.hasOwnProperty('stars')) {
            params.choice = args.stars;
        }
        if (gameValues.hasOwnProperty('grade')) {
            params.grade = gameValues.grade;
        }
        if (gameValues.hasOwnProperty('gender')) {
            params.gender = gameValues.gender;
        }
        return r.addEvent(params);
    }

    r = {
        "addEvent": addEvent,
        "logGameEvent": logGameEvent,
        "getRequestObject": createRequestObject,
        "setGrade":  function (grade) { gameValues.grade = grade; return this; },
        "setGender": function (gender) { gameValues.gender = gender; return this; }
    };

    return r;
}());
