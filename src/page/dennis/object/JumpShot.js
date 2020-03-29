import PairShot from './PairShot/PairShot.js';
import dao from '../Dao.js';
import { map } from '../utils/math.js'

export default class JumpShot extends PairShot {
    constructor() {
        super()
        window.tt = this
        this.camera.position.z = 1200;
        this.camera.distance = this.camera.position.z;
        this.count = 2;
        this.jumpIndex = 0;
        this.insertIndex = 0;
        this.colorIndex = 0;
        this.scale = 3;
    }

    start() {
        const { pairPool, bg, player } = dao.getData()

        bg.position.y = 0;
        bg.updateMatrix();
        // this.camera.add(bg);
        this.container.add(bg)
        const g = new THREE.PlaneBufferGeometry(2048, 1024)
        var imageTexture = THREE.ImageUtils.loadTexture("assets/textures/title.png");
        const m = new THREE.MeshBasicMaterial({
            map: imageTexture,
            transparent: true,
        })
        var dennisTitle = new THREE.Mesh(g, m);
        dennisTitle.name = "dennisTitle"

        if (this.useTitle) {
            dennisTitle.position.set(0, 0, -530);
            dennisTitle.scale.set(1, 1, 1);
            dennisTitle.material.color = new THREE.Color(0xffffff);
            this.container.add(dennisTitle);
            this.camera.thetaRange = 0;
            this.camera.phiRange = 0;
        }

        var slice = this.camera.frustumSlice();
        var x = slice.width / (this.count);
        this.pairs = this.get(this.count)
        let pairsContainer = new THREE.Group()
        pairsContainer.name = "pairsContainer"
        this.pairs.forEach(function (p, i) {
            p.position.x = map(i + 1, 0, this.count + 1, -slice.width / 2, slice.width / 2);
            p.position.y = -700;
            p.scale.set(this.scale, this.scale, this.scale);
            p.rotation.x = random.range(0.2, 0.4);
            pairsContainer.add(p)
        }, this);
        this.container.add(pairsContainer);

        bg.solid(0);
        super.start()
    }
    jump() {
        const { pairPool, bg, player } = dao.getData()
        var pair = this.pairs[this.jumpIndex % this.pairs.length];
        this.jumpIndex++;
        var slice = this.camera.frustumSlice();
        // this.timeline.add(pair.jump(random(slice.height / 2)), player.now);
        pair.jump(random(slice.height / 2))
    }
    color() {
        bg.solid(this.pairs[this.colorIndex % this.pairs.length].colorMale);
        this.colorIndex++;
    }

    insert() {

        var pair = this.pairs[this.insertIndex % this.pairs.length];
        this.insertIndex++;

        var speed = 1.6;

        this.timeline.add(pair.insert(speed), this.now);
        // this.timeline.call( Renderer.setClearColor, [ pair.colorMale, 1 ], this.now - )

    }

    update() {

    }
}
