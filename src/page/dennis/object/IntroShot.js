import PairShot from './PairShot/PairShot.js';
import dao from '../Dao.js';
import { map } from '../utils/math.js'

const TimelineLite = window.TimelineLite

export default class IntroShot extends PairShot {
    constructor() {
        super()
        this.container.name = "IntroShot"
        this.container.position.y = 0;

        this.count = 50;
        this.jumpIndex = 0;
        this.insertIndex = 0;
        this.colorIndex = 0;
        this.scale = 1;
        this.offsetY = -10000;
        this.jumpSide = 1;

        // 这里注意 far 和 near参数,可能出现闪烁的情况
        this.camera.position.z = 100;
        this.camera.near = 10;
        this.camera.far = 50000;
        this.camera.fov = 50;
        this.camera.position.y = this.offsetY;
        this.camera.distance = 100


        this._addTitle()

        this.timeline2 = new TimelineLite({ paused: false });
        this.planetContainer = new THREE.Object3D();
        this.planetContainer.name = "planetContainer"
        this.planetContainer.position.y = this.offsetY;
        this.planetContainer.position.z = -35000
        this.container.add(this.planetContainer);

        this.ry = random.range(0.0001, 0.0002);
        this.rx = random.range(0.0001, 0.0002);

        this.pairs = this.get(this.count);
        this.pairs.forEach(function (p, i) {
            p.position.y = this.offsetY - 300;
            p.scale.set(this.scale, this.scale, this.scale);
        }, this);
        this.planetPairs = [];

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
        dennisTitle.position.z = -35000;
        dennisTitle.position.y = this.offsetY
        dennisTitle.scale.multiplyScalar(15);
        this.container.add(dennisTitle);
    }

    start() {
        console.error(this.container.name);

        const { pairPool, bg } = dao.getData()
        this.lastJump = Date.now() + 2200;
        this.nextJumpTime = random(900, 1800);

        this.scatterPairs = this.get((pairPool.size - this.count) / 5);
        this.scatterPairs.forEach(function (p, i) {

            p.position.y = map(i, 0, this.scatterPairs.length, this.offsetY + 40000, 0);
            var d = random(1000, 4000);
            var a = random(Math.PI + 0.8, 2 * Math.PI - 0.8);
            p.position.x = Math.cos(a) * d;
            p.position.z = Math.sin(a) * d;
            p.strokeInflate(0.65);
            if (p.position.y < -500) {
                // p.male.position.set( random(), random(), random() );
                p.scale.setLength(map(i, 0, this.scatterPairs.length, 22, 1) + random(6));
                // p.male.position.setLength( random( 200, 1000 ) );
                // p.male.visible = true;
            }
        }, this);

        // 等待时的静止shot
        this.planetPairs = this.get(pairPool.size);
        this.planetPairs.forEach(function (p, i) {
            // p.position.set( random.range(), random.range(), random.range() );

            p.position.y = Math.cos(i / this.planetPairs.length * Math.PI * 2);
            p.position.z = Math.sin(i / this.planetPairs.length * Math.PI * 2);
            p.position.x = random.range();
            p.position.setLength(i % 2 === 0 ? random(10000, 30000) : random(45000, 48000));
            p.scale.setLength(random(50, 100));
            this.planetContainer.add(p);

            p.rx = random(0.002) * random.sign();
            p.ry = random(0.002) * random.sign();

            p.female.visible = false;// i % 4 === 0;
            p.male.visible = !p.female.visible;
            p.male.position.set(0, 0, 0);

        }, this);


        // hehehe
        _.defer(function () {
            bg.solid(0x824199);

        }.bind(this))
        bg.position.y = this.offsetY;
        bg.updateMatrix();
        this.container.add(bg);
        super.start()

        this.update = this.update.bind(this)
        const { player } = dao.getData()
        player.addLoopFn(this.update, "IntroShot_update")
    }

    stop() {
        // Stage.frozenLoop.off('update', this.update);
        // clearInterval(this.interval);
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
        var timeline = pair.jump2(this.offsetY + random(150 / 4));
        timeline.add(pair.insert2(1.0), 0.5);
        timeline.call(function () {
            // bg.solid( pair.colorMale );
        }, [], this, 0.9)
    }

    color() {
        // bg.colorLow = this.pairs[ this.colorIndex % this.pairs.length ].colorMale.getHex();
        // bg.colorHigh = bg.colorLow;
        // this.colorIndex++;
    }

    insert() {

        var pair = this.pairs[this.insertIndex % this.pairs.length];
        this.insertIndex++;

        var speed = 1.6;

        this.timeline2.add(pair.insert(speed), this.now);
        // this.timeline.call( Renderer.setClearColor, [ pair.colorMale, 1 ], this.now - )


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
