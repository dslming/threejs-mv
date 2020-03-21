function Promise() {

    var callbacks = [];
    var resolved = false;

    this.resolve = function () {

        if (resolved) return;

        resolved = true;
        callbacks.forEach(function (fnc) { fnc() });

    };

    this.then = function (fnc) {

        resolved ? fnc() : callbacks.push(fnc);
        return this;

    }.bind(this);

}

Promise.all = function (arr) {

    var all = new Promise();
    var resolved = 0;

    var callback = function () {
        resolved++;
        if (resolved === arr.length) {
            all.resolve();
        }
    };

    arr.forEach(function (val) {
        val.then(callback);
    });

    return all;

};

window.Promise = Promise
