import * as THREE from '../../../../lib/three.module.js'
import { TWO_PI, PI } from '../../Const.js'

var position = new THREE.Vector3();

var RECT = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
];

export default class Camera extends THREE.PerspectiveCamera {
    constructor(parent) {
        super()
        this.name = "myCamera"
        if (!parent) {

            this.position.set(0, 0, 300);

            this.passenger = new Camera(this);
            this.add(this.passenger);

            var props = {
                fov: 60,
                near: 1,
                far: 30000
            };

            this._distance = 0;
            this._targetDistance = 0;
            this.distanceEasing = 0.1;

            this.thetaRange = TWO_PI / 3;
            this.phiRange = PI;

            _.keys(props).forEach(function (k) {

                Object.defineProperty(this, k, {
                    get: function () {
                        return props[k];
                    },
                    set: function (v) {
                        props[k] = v;
                        // Pair.fogUniforms.far.value = this.far;
                        this.updateProjectionMatrix();
                        this.passenger.updateProjectionMatrix();
                    }
                });

            }, this);

            Object.defineProperty(this, 'distance', {
                get: function () {
                    return this._targetDistance;
                },
                set: function (v) {
                    this._targetDistance = v;
                }
            })


        } else {

            this.rotation.reorder('YXZ');
            // this.matrixAutoUpdate = false;

            var props = ['fov', 'near', 'far', 'distance'];
            props.forEach(function (k) {

                Object.defineProperty(this, k, {
                    get: function () {
                        return parent[k];
                    },
                    set: _.noop
                });

            }, this);


        }

        this.viewOffset = { x: 0, y: 0, width: 1, height: 1 }; // todo

        Object.defineProperty(this, 'aspect', {
            get: function () {
                const { stage } = dao.getData()
                const width = stage.renderer.domElement.parentElement.offsetWidth
                const height = stage.renderer.domElement.parentElement.offsetWidth
                return width / height;
            },
            set: _.noop
        })

        this.updateProjectionMatrix();
    }

    update() {
        this._distance += (this._targetDistance - this._distance) * this.distanceEasing;
    }

    copy($1) {

        if (_.isNumber($1) || _.isArray($1)) {
            this.unserialize.apply(this, arguments);
        } else {
            this.unserialize($1.serialize());
            // this._distance = $1._targetDistance;
            // this._targetDistance = $1._targetDistance;
            // this.distanceEasing = $1.distanceEasing;
            // this.thetaRange = $1.thetaRange;
            // this.phiRange = $1.phiRange;
        }

    }

    copyLocal(camera) {

        this.fov = camera.fov;
        this.near = camera.near;
        this.far = camera.far;

        this.position.copy(camera.position);
        this.quaternion.copy(camera.quaternion);

        this.updateProjectionMatrix();

    }

    // todo: duplicated in Group.js
    toWorld() {

        this.position.copy(this.getWorldPosition());
        this.quaternion.copy(this.getWorldQuaternion());
        // this.scale.copy(this.getWorldScale());
        if (this.parent) {
            this.parent.remove(this);
            Scene.add(this);
        }

    }

    frustumSlice(atDistance) {

        if (arguments.length == 0) {
            atDistance = -this.position.z;
        }

        this.updateProjectionMatrix();
        this.passenger.updateProjectionMatrix();

        var mapped = (atDistance - this.near) / (this.far - this.near),
            result = [];

        for (var i = 0, n, f; i < 4; i++) {

            position.set(RECT[i][0], RECT[i][1], -1);
            position.unproject(this.passenger);
            n = position.clone();

            position.set(RECT[i][0], RECT[i][1], 1);
            position.unproject(this.passenger);
            f = position.clone();

            f.sub(n);
            f.multiplyScalar(mapped);
            f.add(n);

            result.push(f);

        }

        return {
            top: result[0].y,
            right: result[2].x,
            bottom: result[2].y,
            left: result[1].x,
            corners: result,
            width: Math.abs(result[2].x - result[1].x),
            height: Math.abs(result[0].y - result[2].y),
        };

    }

    unserialize() {


        var arr = _.toArray(arguments);

        if (_.isArray(arr[0])) {
            arr = arr[0];
        }

        this.position.fromArray(arr.slice(0, 3));
        this.quaternion.fromArray(arr.slice(6, 10));

        this.fov = arr[10];
        this.near = arr[11];
        this.far = arr[12];
        const { stage } = dao.getData()
        const width = stage.renderer.domElement.parentElement.offsetWidth
        const height = stage.renderer.domElement.parentElement.offsetWidth
        this.aspect = width / height;

        this.updateProjectionMatrix();
        this.updateMatrix();

        this.viewOffset.x = arr[13];
        this.viewOffset.y = arr[14];
        this.viewOffset.width = arr[15];
        this.viewOffset.height = arr[16];
        return this;

    }

    serialize() {

        return [

            parseFloat(this.position.x.toFixed(4)),
            parseFloat(this.position.y.toFixed(4)),
            parseFloat(this.position.z.toFixed(4)),

            parseFloat(this.rotation.x.toFixed(4)),
            parseFloat(this.rotation.y.toFixed(4)),
            parseFloat(this.rotation.z.toFixed(4)),

            parseFloat(this.quaternion.x.toFixed(4)),
            parseFloat(this.quaternion.y.toFixed(4)),
            parseFloat(this.quaternion.z.toFixed(4)),
            parseFloat(this.quaternion.w.toFixed(4)),

            this.fov,
            this.near,
            this.far,
        ];

    }
}
