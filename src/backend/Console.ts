
import * as chalk from "chalk"

export class Console {
    private _base: Function;
    private _listeners;

    public log: Function;
    public info: Function;
    public warn: Function;
    public error: Function;
    public addListener: Function;
    public removeListener: Function;
    public exec: Function;
    public on: Function;

    constructor(cb: Function) {
        this._listeners = {
            command: []
        };

        this._base = (...message) => {
            const date = new Date();
            const raw = message.join(" ");

            const padNumber = a => String(a).padStart(2, "0");
            const timeString = `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(date.getSeconds())}`;
            console.log(`${chalk.gray(timeString)} ${raw}`);

            cb({
                type: "log",
                content: raw,
                date: date.toISOString()
            });
        }

        this.log = (...message) => {
            this._base(...message);
        }

        this.info = (...message) => {
            this._base(chalk.cyan("[INFO]"), ...message);
        }

        this.warn = (...message) => {
            this._base(chalk.yellow("[WARN]"), ...message);
        }

        this.error = (...message) => {
            this._base(...message.map(a => chalk.red(a)));
        }

        this.exec = cmd => {
            this._listeners["command"].forEach(cb => cb(cmd));
        }

        this.addListener = (event: "command", eventCb) => {
            if (this._listeners.hasOwnProperty(event)) {
                this._listeners[event].push(eventCb);
            }
        }

        this.on = this.addListener;

        this.removeListener = (event, eventCb?) => {
            if (this._listeners.hasOwnProperty(event)) {
                if (eventCb) {
                    const index = this._listeners[event].indexOf(eventCb);
                    this._listeners[event].splice(index, 1);
                } else {
                    this._listeners[event] = [];
                }
            }
        }
    }
}