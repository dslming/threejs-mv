import * as THREE from '../../../lib/three.module.js';


export default class Background extends THREE.Group {
  constructor() {
    super()
  }
  init(vs, fs, geometry) {
    var uniforms = {
      time: {
        type: 'v3',
        value: new THREE.Vector3()
      },
      noiseScale: {
        type: 'f',
        value: 3.0
      },
      threshhold: {
        type: 'f',
        value: 0
      }
    };

    var colorUniforms = {
      colorLow: {
        type: 'c',
        value: new THREE.Color(1, 1, 1)
      },
      colorHigh: {
        type: 'c',
        value: new THREE.Color(0, .73, .71)
      }
    }

    var material = new THREE.ShaderMaterial({

      uniforms: _.extend({}, uniforms, colorUniforms),
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.BackSide,
      depthTest: false,
      depthWrite: false

    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.name = "BackgroundMesh"
    super.add(this.mesh);
    super.name = "Background"
    this.lastWipe = false;

    _.each(uniforms, function (uniform, k) {
      Object.defineProperty(this, k, {
        get: function () {
          return uniform.value;
        },
        set: function (v) {
          if (uniform.type === 'v3') {
            uniform.value.copy(v);
          } else {
            uniform.value = v;
          }
        }
      })
    }, this);

    _.each(colorUniforms, function (uniform, k) {
      Object.defineProperty(this, k, {
        get: function () {
          return uniform.value;
        },
        set: function (v) {
          uniform.value.set(v);
        }
      })
    }, this);
  }

  clear() {
    this.colorLow.setRGB(1, 1, 1);
    this.colorHigh.setRGB(1, 1, 1);
  }

  solid(color) {
    this.colorLow = color;
    this.colorHigh = color;
  }

  randomize() {
    this.noiseScale = random(2, 8);
    this.threshhold = random(0.3, 0.7);
    this.time.x = random(0, 1000);
    this.time.y = random(0, 1000);
    this.time.z = random(0, 1000);
  }

  wipe(dur, c) {

    var color = 'color' + (this.lastWipe ? 'Low' : 'High');


    var timeline = new TimelineLite();
    timeline.call(function () {
      this[color] = c;
    }, [], this, 0);
    timeline.set(this.time, { x: random(10), y: random(10), z: random(10) }, 0);
    timeline.fromTo(this, dur, { threshhold: this.lastWipe ? 1 : 0 }, { threshhold: this.lastWipe ? 0 : 1, ease: Quad.easeInOut }, 0);

    this.lastWipe = !this.lastWipe;

    return timeline;

  }

  splat(dur) {

    var timeline = new TimelineLite();

    timeline.fromTo(this, dur, { threshhold: 0.7 }, { threshhold: 0.4, ease: Elastic.easeOut });
    return timeline;

  }

  reset() {
    this.opacityLow = 1;
    this.opacityHigh = 1;
  }
  curdle(c1, c2, time) {
    return new TimelineLite()
      .call(() => {
        this.colorLow = c1;
        this.colorHigh = c2;
      }, [], this, 0)
      .fromTo(this, time || 0.5.beats, { noiseScale: 0.25 }, { noiseScale: 3, ease: Expo.easeOut, immediateRender: false }, 0)
  }

  soak(dur, thresh) {
    var timeline = new TimelineLite();
    timeline.fromTo(this, dur, { threshhold: 0 }, { threshhold: thresh === undefined ? 0.5 : thresh });
    return timeline;
  }

  throb(dur) {

    var timeline = new TimelineLite();

    var sign = this.lastThrob ? 1 : -1;
    var ease = Back.easeOut;

    timeline.to(this.time, dur, { x: random(1, 2) * sign, y: -random(1, 2) * sign, z: random(1, 2) * sign, ease: ease }, 0);
    timeline.to(this, dur, { noiseScale: random(3, 4), ease: ease }, 0);
    timeline.to(this, dur * 4, { threshhold: random(0.2, 0.675), ease: Elastic.easeOut }, 0);
    this.lastWipe = !this.lastThrob;
    return timeline;
  }
}
