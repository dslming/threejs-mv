import PairShot from './PairShot/PairShot.js';
import dao from '../Dao.js';
import { map } from '../utils/math.js'

const TimelineLite = window.TimelineLite

export default class IntroShot extends PairShot {
    constructor() {
        super()
        this.container.name = "IntroShot"
        this.container.position.y = 0;

        this.jumpIndex = 0;
        this.insertIndex = 0;
        this.colorIndex = 0;
        this.scale = 1;
        this.jumpSide = 1;
        this.basePosition = {
            x: 0,
            y: -10000,
            z: -35000
        }

        // 这里注意 far 和 near参数,可能出现闪烁的情况
        this.camera.position.z = 100;
        this.camera.near = 10;
        this.camera.far = 50000;
        this.camera.fov = 50;
        this.camera.position.y = this.basePosition.y;

        this._addTitle()
        this.timeline2 = new TimelineLite({ paused: false });
        this.planetContainer = new THREE.Object3D();
        this.planetContainer.name = "planetContainer"
        this.planetContainer.position.y = this.basePosition.y;
        this.planetContainer.position.z = this.basePosition.z
        this.container.add(this.planetContainer);

        this.ry = random.range(0.0001, 0.0002);
        this.rx = random.range(0.0001, 0.0002);

        // 飞起来弹出的shot
        const flyContainer = new THREE.Object3D();
        flyContainer.name = "flyContainer"
        this.pairs = this.get(10);
        this.pairs.forEach((p, i) => {
            p.position.y = this.basePosition.y - 300;
            p.scale.set(this.scale, this.scale, this.scale);
            flyContainer.add(p)
        });
        this.planetPairs = [];
        this.container.add(flyContainer)
    }

    _addTitle() {
        const g = new THREE.PlaneBufferGeometry(2048, 1024)
        var imageTexture = THREE.ImageUtils.loadTexture("assets/textures/title.png");
        const m = new THREE.MeshBasicMaterial({
            map: imageTexture,
            transparent: true,
        })
        var dennisTitle = new THREE.Mesh(g, m);
        dennisTitle.name = "dennisTitle"
        dennisTitle.material.map.magFilter = THREE.NearestFilter;
        dennisTitle.material.color = new THREE.Color(0xffffff);
        dennisTitle.position.z = this.basePosition.z;
        dennisTitle.position.y = this.basePosition.y;
        dennisTitle.scale.multiplyScalar(15);
        this.container.add(dennisTitle);
    }

    start() {
        console.error(this.container.name);

        const { pairPool, bg } = dao.getData()
        this.lastJump = Date.now() + 2200;
        this.nextJumpTime = random(900, 1800);

        // 垂直分散shot
        const scatterContainer = new THREE.Object3D();
        scatterContainer.name = "scatterContainer"
        const scatterPairs = this.get(100);
        scatterPairs.forEach(function (p, i) {
            p.position.y = map(i, 0, scatterPairs.length, this.basePosition.y + 40000, 0);
            var d = random(100, 500);
            var a = random(Math.PI + 0.8, 2 * Math.PI - 0.8);
            p.position.x = Math.cos(a) * d;
            p.position.z = Math.sin(a) * d;
            p.strokeInflate(0.65);
            if (p.position.y < -500) {
                p.scale.setLength(map(i, 0, scatterPairs.length, 22, 1) + random(6));
            }
            scatterContainer.add(p)
        }, this);
        this.container.add(scatterContainer);

        // 等待时的静止shot
        this.planetPairs = this.get(50);
        this.planetPairs.forEach((p, i) => {
            p.position.y = random.range();
            p.position.z = random.range();
            p.position.x = random.range();
            p.position.setLength(i % 2 === 0 ? random(10000, 30000) : random(45000, 48000));
            p.scale.setLength(random(50, 100));
            p.rx = random(0.002) * random.sign();
            p.ry = random(0.002) * random.sign();
            this.planetContainer.add(p);
            p.female.visible = i % 4 === 0;
            p.male.visible = !p.female.visible;
            p.male.position.set(0, 0, 0);
        });


        // hehehe
        _.defer(function () {
            bg.solid(0x824199);
        }.bind(this))

        bg.position.y = this.basePosition.y;
        bg.updateMatrix();
        this.container.add(bg);
        super.start()

        this.update = this.update.bind(this)
        const { player } = dao.getData()
        player.addLoopFn(this.update, "IntroShot_update")
    }

    stop() {
        super.stop()
        const { player } = dao.getData()
        player.removeLoopFn("IntroShot_update")
    }

    jump() {
        var pair = this.pairs[this.jumpIndex % this.pairs.length];
        var r = random();
        var z = map(r * r, 0, 1, -100, 15);
        this.jumpIndex++;
        var r2 = random();
        pair.position.x = 20 + 180 / 3 * (1 - r2 * r2 * r2) * this.jumpSide;
        pair.position.z = z;
        pair.position.y = 0;
        pair.male.position.z = 250;

        this.jumpSide *= -1;
        var timeline = pair.jump2(this.basePosition.y + random(150 / 4));
        timeline.add(pair.insert2(1.0), 0.5);
    }

    update() {
        this.planetContainer.rotation.x += 0.00025;
        for (var i = 0, l = this.planetPairs.length; i < l; i++) {
            var pp = this.planetPairs[i];
            pp.rotation.x += pp.rx;
            pp.rotation.y += pp.ry;
        }
        const t = Date.now() - this.lastJump
        if (t > this.nextJumpTime) {
            this.lastJump = Date.now();
            this.nextJumpTime = random(900, 1800);
            this.jump();
        }
    }
}
