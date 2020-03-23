import * as THREE from '../../../../lib/three.module.js'
import Camera from './Camera.js'
import dao from '../../Dao.js'


export default class PairShot {
    static active = {}
    static count = 0
    _behaviors = []

    constructor() {
        // id
        this.id = PairShot.count++;

        // 相机
        this.camera = new Camera()//new THREE.PerspectiveCamera(60, 1, 0.01, 10000)
        this.camera.position.set(0, 0, 100)
        this.camera.name = "ShotCamera"

        // pair容器
        this.container = new THREE.Group();
        this.container.name = "PairShot"

        // 时间轴
        this.timeline = new TimelineLite({ paused: true });

        this.checkedOut = {}
        this.pairPool = dao.getData().pairPool
        this.update = this.update.bind(this)

    }

    // 开始展示
    start() {
        const { stage, player } = dao.getData()
        stage.changeCamera(this.camera)
        stage.scene.add(this.container);
        this.updataName = Date.now()
        player.addLoopFn(this.update, this.updataName)
    }

    // 停止展示
    stop() {
        const { stage, player, pairPool } = dao.getData()
        stage.scene.remove(this.container);
        player.removeLoopFn(this.updataName)
        for (var id in this.checkedOut) {
            var pair = this.checkedOut[id];
            pair.reset();
            delete this.checkedOut[pair.id];
            pairPool.return(pair)
        }
    }

    update() {
        const { player } = dao.getData()
        this.now = player.now - this.in
        this.timeline.time(this.now, false);
    }

    get(count, req) {
        var pairs = [];
        for (var i = 0; i < count; i++) {
            pairs.push(this.next(req));
        }
        return pairs;
    }

    next(req) {
        var pair = this.pairPool.next(req);
        this.checkedOut[pair.id] = pair;
        pair.reset();
        this.container.add(pair);
        return pair;
    }
}
