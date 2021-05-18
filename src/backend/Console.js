"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.Console = void 0;
var chalk = require("chalk");
var Console = /** @class */ (function () {
    function Console(cb) {
        var _this = this;
        this._listeners = {
            command: []
        };
        this._base = function () {
            var message = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                message[_i] = arguments[_i];
            }
            var date = new Date();
            var raw = message.join(" ");
            var padNumber = function (a) { return String(a).padStart(2, "0"); };
            var timeString = padNumber(date.getHours()) + ":" + padNumber(date.getMinutes()) + ":" + padNumber(date.getSeconds());
            console.log(chalk.gray(timeString) + " " + raw);
            cb({
                type: "log",
                content: raw,
                date: date.toISOString()
            });
        };
        this.log = function () {
            var message = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                message[_i] = arguments[_i];
            }
            _this._base.apply(_this, message);
        };
        this.info = function () {
            var message = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                message[_i] = arguments[_i];
            }
            _this._base.apply(_this, __spreadArray([chalk.cyan("[INFO]")], message));
        };
        this.warn = function () {
            var message = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                message[_i] = arguments[_i];
            }
            _this._base.apply(_this, __spreadArray([chalk.yellow("[WARN]")], message));
        };
        this.error = function () {
            var message = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                message[_i] = arguments[_i];
            }
            _this._base.apply(_this, message.map(function (a) { return chalk.red(a); }));
        };
        this.exec = function (cmd) {
            _this._listeners["command"].forEach(function (cb) { return cb(cmd); });
        };
        this.addListener = function (event, eventCb) {
            if (_this._listeners.hasOwnProperty(event)) {
                _this._listeners[event].push(eventCb);
            }
        };
        this.on = this.addListener;
        this.removeListener = function (event, eventCb) {
            if (_this._listeners.hasOwnProperty(event)) {
                if (eventCb) {
                    var index = _this._listeners[event].indexOf(eventCb);
                    _this._listeners[event].splice(index, 1);
                }
                else {
                    _this._listeners[event] = [];
                }
            }
        };
    }
    return Console;
}());
exports.Console = Console;
