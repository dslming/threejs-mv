export function map(v, a, b, c, d) {
    return c + (d - c) * (v - a) / (b - a);

}

export function lerp(a, b, t) {

    return (b - a) * t + a;

}

export function normalize(v, a, b) {

    return (v - a) / (b - a);

}

export function clamp(v, min, max) {

    return Math.max(min, Math.min(max, v));

}

export function cmap(v, a, b, c, d) {

    return lerp(c, d, cnormalize(v, a, b));

}

export function cnormalize(v, a, b) {

    return clamp(normalize(v, a, b), 0, 1);

}

export function clerp(a, b, t) {

    return clamp(lerp(a, b, t));

}

export function between(min, max) {

    return function (v) {
        return min <= v && v < max;
    }

}


Object.defineProperty(Number.prototype, 'deg', {

    get: function () {
        return this / RADIANS;
    }

});
