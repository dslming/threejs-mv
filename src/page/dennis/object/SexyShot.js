import PairShot from './PairShot/PairShot.js';
import dao from '../Dao.js';
import { PI, HALF_PI } from '../Const.js'
import { map } from '../utils/math.js'

export default class SexyShot extends PairShot {
    constructor() {
        super()
        this.container.name = "SexyShot"

        this.camera.position.z = 80;
        this.camera.distance = this.camera.position.z;
        this.distance = 1;
        this.ry = random.sign() * (HALF_PI - HALF_PI / 1.5);
        this.rx = random.range(HALF_PI / 2);
        this.camera.thetaRange = PI;

        var imageTexture = THREE.ImageUtils.loadTexture("assets/textures/cred-nhx.png");

        this.creditNHX = new THREE.Mesh(new THREE.PlaneBufferGeometry(512, 256), new THREE.MeshBasicMaterial({
            map: imageTexture,
            transparent: true,
            color: 0x282828
        }));
        this.creditNHX.material.map.minFilter = THREE.LinearFilter;
        this.creditNHX.material.map.magFilter = THREE.NearestFilter;
        this.creditNHX.name = "creditNHX"

    }

    start() {
        this.pair = this.next();
        this.pair.rotation.set(this.rx, this.ry, 0);
        this.container.add(this.pair)
        this.pair.male.visible = true;

        if (this.credit) {
            this.container.add(this.creditNHX);
            this.creditNHX.position.z = -10;
            this.creditNHX.position.y = 20;
            this.creditNHX.position.x = 45.5;
            this.creditNHX.scale.setLength(0.12);
        }

        if (this.background) {
            bg.visible = false;
            Renderer.setClearColor(this.pair.colorMale, 1);
        }

        super.start()
        this.update = this.update.bind(this)
        const { player } = dao.getData()
        player.addLoopFn(this.update, "SexyShot_update")
    }

    stop() {
        super.stop()
        const { player } = dao.getData()
        player.removeLoopFn("SexyShot_update")
    }

    update() {
        var t = this.now / this.len;
        this.pair.male.position.z = map(t, 0, 1, 50 * this.distance, 0);
        this.pair.male.rotation.z = map(t, 0, 0.7, HALF_PI / 3 * this.distance, 0);
        this.pair.female.position.z = map(t, 0, 1, -50 * this.distance, 0);
        this.pair.rotation.z = map(t, 0, 1, -HALF_PI / 3 * this.distance, 0);
    }
}
