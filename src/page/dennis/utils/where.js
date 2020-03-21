export function where(requirements) {

    return function (obj) {

        var v = true, t;

        _.each(requirements, function (req, key) {

            if (_.isFunction(req)) {

                t = req(obj[key], obj, key);

            } else {

                t = req === obj[key];

            }

            v = v && t;

        });

        return v;

    }

};
