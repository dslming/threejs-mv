import dao from './Dao.js'

const Events = window.Events

export default class Behavior extends Events {
    constructor() {
        super()
        this.active = false;
        this.paused = false;
        this.now = 0;
    }

    _update() {
        const { player } = dao.getData()
        this.now = player.now - this.in;
        if (this.duration !== undefined && this.now > this.duration) {
            return this.stop();
        }
        this.frames++;
        this.update();
    }

    _on() {
        console.error(123);
        this.on("update", this._update, this)
        // Loop.on('update', this._update, this);
    }

    _off() {
        // Loop.off('update', this._update, this);
    }

    start() {
        const { player } = dao.getData()

        if (this.active) {
            this.in = undefined;
            this.out = undefined;
            this.stop();
        }

        if (this.in === undefined) {
            this.in = player.now;
        }

        if (this.out !== undefined) {
            this.duration = this.out - this.in;
        } else if (this.duration !== undefined) {
            this.out = this.in + this.duration;
        }

        this.active = true;
        this.frames = 0;
        this.now = 0;
        this._on();
        this.trigger('start');

    }

    pause() {
        if (!this.active || this.paused) return;
        this.paused = true;
        this._off();
        this.trigger('pause');
    }

    resume() {
        if (!this.active || !this.paused) return;
        this.paused = false;
        this._on();
        this.trigger('resume');
    }

    stop() {
        if (!this.active) return;
        this.active = false;
        this.paused = false;
        this._off();
        this.trigger('stop');
    }
}

