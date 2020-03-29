import PairShot from './PairShot/PairShot.js';
import CameraTweenBehavior from './behavior/CameraTweenBehavior.js'
import FallBehavior from './behavior/FallBehavior.js'
import { Easing } from '../utils/Easing.js'

import dao from '../Dao.js';
import { map } from '../utils/math.js'

export default class RainShot extends PairShot {
    far = 28000;
    // cuts = {
    //     kicks: [-157.247, 7.456, 346.318, -0.0057, -0.0601, -0.0003, -0.0028, -0.03, -0.0001, 0.9995, 60, 1, far],
    //     past: [275.4952, 140.8028, 148.6545, -1.1314, 1.3097, 1.118, -0.0877, 0.6614, 0.0783, 0.7408, 60, 1, far],
    //     hihats: [122.7725, 167.0485, 150.9345, -0.5543, 0.6051, 0.3386, -0.2092, 0.3265, 0.0743, 0.9188, 60, 1, far],
    //     forward: [-375.0855, 324.505, 252.1986, -0.9347, -0.6841, -0.7078, -0.2943, -0.428, -0.1497, 0.8413, 60, 1, far],
    //     underneath: [83.4989, -220.4249, 153.1916, 0.9634, 0.4645, -0.5726, 0.3749, 0.323, -0.1412, 0.8574, 60, 1, far],
    //     pokes: [204.7161, 192.1022, 386.8859, -0.2049, 0.6512, 0.1253, -0.0768, 0.3237, 0.0264, 0.9427, 60, 1, far]
    // }

    constructor() {
        super()
        this.trackEvents = {};

        this.tracks = [];
        this.pairs = [];

        // this.cameraContainer = new THREE.Group();
        // this.cameraContainer.add(this.camera);
        this.camera.unserialize([-316.0056, 648.9662, -58.4661, 1.7585, -1.0886, 1.782, 0.1574, -0.7201, 0.1736, 0.6532, 60, 1, this.far]);

        this.targetThreshold = 0.5;

        this.camera.distance = 200;

        this.throbFrequency = 2.0;
    }
    start() {
        super.start()
        const { bg, floor, stage } = dao.getData()
        this.container.add(bg);


        var throbTimeline = new TimelineLite({ paused: true });
        var throbAttack = 0.3;
        var ta = 0.5;
        var tb = 0.55;
        throbTimeline.fromTo(floor, this.throbFrequency / 2 * (throbAttack), { threshhold: ta }, { threshhold: tb, ease: Elastic.easeOut });
        throbTimeline.fromTo(floor, this.throbFrequency / 2 * (throbAttack), { threshhold: tb }, { threshhold: ta, ease: Elastic.easeOut }, this.throbFrequency / 2);
        this.throbTimeline = throbTimeline;

        var c = 0xffffff;
        this.timeline.add(bg.wipe(0.25, c), 0.0);
        this.timeline.call(function () {
            bg.visible = false;
        }, [], this, 2.5);

        floor.reset();
        floor.colorHigh = c;
        floor.colorLow = 0xeeeeee;
        floor.opacityHigh = 0;
        floor.position.x = 4000;
        floor.name = "floor"
        floor.children[0].scale.set(20, 20, 20)
        this.container.add(floor);
        this.timeline.fromTo(floor.scale, 2.0,
            { x: 0.01, y: 0.01, z: 0.01 },
            { x: 1.2, y: 1.0, z: 1.2, ease: Back.easeOut }, 0.1);

        this.camera.distanceEasing = 1.0;
        // this.pairs.clear();
        this.trackSpacing = 80;
        this.timeSpacing = 300;
        this.camera.unserialize([-2442.3067, 1415.9202, 1257.6282, -1.3666, -0.3604, -1.04, -0.47, -0.4293, -0.2809, 0.7183, 60, 1, this.far])
        this.camera.quaternion.fromArray([-0.1262, -0.7112, -0.1322, 0.6788])
        TweenLite.to(stage.camera.position, 10, {
            x: 6000.7992,
            y: 156.7858,
            z: -58.3562
        });
        this.camera.updateProjectionMatrix();

        if (0) {

            this.timeline.call(this.fall, [], this, Time.bars(20.125) - this.in);


            this.yeaPair = this.next();
            this.yeaPair.position.z = -100;

            this.camera.passenger.add(this.yeaPair);
            this.timeline.add(this.yeaPair.jump(), Time.bbd(17, 3, 0, 120) - Time.seconds(0.3) - this.in);


            var massivePair;
            var maxX = 0;

            var massiveImpactTime = Time.bbd(19, 3, 3) - this.in;


            _.each(this.trackEvents, function (trackEvents, trackName) {

                var color = Pair.maleColors.next();

                trackEvents.forEach(function (time, i) {

                    time -= this.in;

                    pair = this.next();

                    this.pairs.push(pair);

                    // pair.explode = this.behavior(ExplodeBehavior);
                    // pair.explode.target = pair;

                    pair.fallBehavior = new FallBehavior()//this.behavior(FallBehavior);
                    pair.fallBehavior.target = pair;
                    // pair.fallBehavior.s = 0.1;

                    pair.rotation.x = -Math.PI / 2;
                    pair.position.x = time * this.timeSpacing;
                    pair.position.z = (trackIndex - ~~(numTracks / 2)) * this.trackSpacing;

                    if (pair.position.x > maxX) {
                        maxX = pair.position.x;
                    }

                    var maleScale = 1;

                    if (trackName == 'dennis drums' && i == trackEvents.length - 1) {

                        maleScale = 12;
                        pair.male.scale.set(maleScale, maleScale, maleScale);
                        pair.male.position.z = 1800;

                        massivePair = pair;

                    }

                    var pp = pair;

                    // this.timeline.call( function() {
                    // floor.time.y += random( 0.01, 0.05 );
                    // },[], this, time - 0.2 );
                    // this.timeline.add( floor.splat( 0.5.div ), time );

                    var impactTime = time - Time.seconds(0.4);

                    var raiseDuration = 2.0.beats;
                    var raisePause = (HANDHELD ? 3.0.beats : 2.0.bars);
                    var t = impactTime - raiseDuration - raisePause;

                    var ot = impactTime + (HANDHELD ? 0.5.beats : 2.0.bars);

                    var fallDuration = HANDHELD ? 0.5.beats : 1.0.bars;

                    if (HANDHELD && ot > 0 && pp !== massivePair) {

                        this.timeline.to(pair.position, fallDuration, {
                            y: -30000,
                            ease: Quint.easeIn
                        }, ot);


                    }

                    if (t > 0) {

                        pair.visible = false;
                        this.timeline.set(pair, { visible: true }, t);
                        this.timeline.from(pair.female.position, raiseDuration, {
                            z: -8000,
                            ease: Quint.easeOut
                        }, t);

                        this.timeline.from(pair.male.position, raiseDuration, {
                            z: 8000,
                            ease: Quint.easeOut
                        }, t);


                    }

                    this.timeline.add(pair.insert(2.0, maleScale), impactTime);
                    // this.timeline.call( Renderer.setClearColor, [ pair.maleColor, 1 ], Renderer, time ); // why not?

                }.bind(this));

                trackIndex++;

            }, this);

            ExplodeBehavior.Rate = 12.5;

            this.pairs.forEach(function (pair) {

                pair.explode.center = massivePair.position;
                pair.explode.decay = 0.3;

                pair.explode.offset.y += Math.sin((massivePair.position.x - pair.position.x) / 200) * 500 / Math.max(0.1, Math.abs(massivePair.position.x - pair.position.x) / 500);

                this.timeline.$(massiveImpactTime, pair.explode.start, pair.explode);
                this.timeline.$(massiveImpactTime, pair.explode.speed2.setLength, pair.explode.speed2, 2);

            }, this);

            massivePair.male.visible = false;
            this.timeline.set(massivePair.male, { visible: true }, massiveImpactTime - Time.beats(2));
            this.timeline.set(massivePair.female, { visible: false }, massiveImpactTime);

            var impactZoom = this.behavior(CameraTween);
            impactZoom.dest = new Camera();
            impactZoom.dest.unserialize([7818.298, 178.208, 394.3921, -0.1877, 0.4107, 0.1751, -0.0737, 0.2103, 0.1042, 0.9693, 94, 1, this.far]);
            impactZoom.target = this.camera;
            impactZoom.easing = Easing.Exponential.Out;
            impactZoom.duration = 2.0.beats;

            this.timeline.$(Time.bbd(20) - 1.2.div - this.in, this.camera.toWorld, this.camera);
            this.timeline.$(Time.bbd(20) - 1.2.div - this.in, impactZoom.start, impactZoom);

            var tween2 = this.behavior(CameraTween);
            tween2.target = this.camera;
            tween2.duration = 50.0.div;
            tween2.dest = new Camera()
            tween2.dest.unserialize(7922.264, 227.6843, 633.0721, -0.1878, 0.4108, 0.3375, -0.0564, 0.2156, 0.1825, 0.9576, 94, 1, this.far);

            // this.timeline.$( Time.bbd( 20 ) - this.in, tween2.start, tween2 );

            var center = new THREE.Vector3(maxX / 3, 0, 0);

            var shuff = new Shuffler(this.pairs);
            var hideBox = new THREE.Box3();
            var hideBoxSize = new THREE.Vector3(1, 1, 1).setLength(2000);
            var hidden = [];

            var backDistance = 200;
            var maleDistance = 550;

            massivePair.marked = true;

            var cameraImpact = function (time, insert, shakeDur, jumperTimes, jumpPositions, quicky) {

                var _this = this;

                time -= this.in;

                var pair;

                do {
                    pair = shuff.next();
                } while (pair.marked);

                pair.marked = true;

                var dest = new Camera();
                var tween = this.behavior(CameraTween);
                var rot = { x: random.angle() / 8, y: random.angle() / 8, z: random.angle() / 8 };

                var shake = this.behavior(Shake);
                shake.target = dest;
                shake.duration = shakeDur || 4.0.div;


                dest.distance = !quicky ? this.camera.distance : 50;

                var handheld = this.behavior(HandheldBehavior);
                handheld.target = dest;
                handheld.magnitude.set(100, 100, 0);
                pair.add(dest);

                tween.target = this.camera;
                tween.dest = dest;
                tween.duration = 1.0.div;
                tween.easing = Easing.Quadratic.In;

                var b = 0.5.div;
                var d = tween.duration + b;

                reset(pair);

                // this.timeline.$( this.camera, { distance: dest.position.z } );

                this.timeline.$(time - b, shake.start, shake);
                this.timeline.$(time - b, function () {

                    floor.visible = false;

                    bg.visible = true;

                    bg.colorHigh = Pair.maleColors.next();
                    bg.colorLow = 0xffffff;
                    bg.scale.set(0.6, 0.6, 0.6)
                    bg.randomize();
                    if (quicky) {
                        bg.noiseScale = 6.0;
                    } else {
                        bg.noiseScale = 4.0;
                    }


                    dest.add(bg);

                });

                this.timeline.$(time - b + shake.duration, function () {

                    if (!quicky) bg.visible = false;

                    // if ( !quicky ) {
                    pair.fallBehavior.stop();
                    pair.explode.stop();
                    // }

                });

                // this.timeline.$( time - b, Renderer.setClearColor, Renderer, 0x000000, 1 );
                // this.timeline.$( time - b + shake.duration - 0.05, Renderer.setClearColor, Renderer, 0xffffff, 1 );
                // this.timeline.$( time - b + shake.duration - 0.05, handheld.start, handheld );

                this.timeline.$(time - d, function () {

                    // this.cameraTarget = null;
                    // Scene.camera = this.camera;
                    pair.male.visible = true;
                    pair.male.position.z = maleDistance;
                    pair.visible = true;

                    hideBox.setFromCenterAndSize(pair.position, hideBoxSize);

                    for (var i = 0, l = this.pairs.length; i < l; i++) {
                        var p = this.pairs[i];
                        if (p === pair) continue;
                        if (HANDHELD || hideBox.containsPoint(p.position)) {
                            p.visible = false;
                        }
                    }



                }, this);

                this.timeline.$(time - d, tween.start, tween);


                this.timeline.$(time - b, function () {
                    Scene.camera = dest;
                    this.cameraTarget = dest;

                    if (!HANDHELD) {
                        for (var i = 0, l = hidden.length; i < l; i++) {
                            hidden[i].visible = true;
                        }
                    }
                    hidden.length = 0;
                }, this);


                if (insert !== false) {
                    this.timeline.add(pair.insert3(0.6), time);
                    // this.timeline.to( dest.position, 0.25.div, { z: backDistance, ease: Back.easeOut }, time + shake.duration - 2.0.div );
                } else {

                }

                jumperTimes = jumperTimes || [];

                var roffset = random.angle();
                var x, y;

                var sx = 0;
                var sy = 0;

                jumperTimes.forEach(function (j, jj) {

                    var jumper = shuff.next();
                    while (jumper === pair || jumper.marked) {
                        jumper = shuff.next();
                    }

                    jumper.marked = true;

                    reset(jumper);
                    var rr = random(90, 120);
                    var a = roffset + random.range(0.2) + jj * (Math.PI * 2 / jumperTimes.length);

                    x = jumpPositions[jj * 2];
                    y = jumpPositions[jj * 2 + 1];

                    var tx = x + random.range(20);
                    var rx = random.range(0.2, 0.4);
                    var ty = y + random.range(20);
                    var tz = random(-20, -30);
                    sx += x;
                    sy += y;

                    this.timeline.$(time - b, function () {
                        jumper.explode.stop();
                        jumper.fallBehavior.stop();

                        jumper.reset();
                        jumper.visible = true;
                        pair.add(jumper);

                        _.defer(function () {
                            jumper.male.visible = true;
                            jumper.male.position.z = maleDistance;
                            jumper.rotation.set(rx, random.range(0.2, 0.4), random.range(0.2, 0.4));
                            jumper.position.x = tx;
                            jumper.position.y = ty;
                            jumper.position.z = tz;
                            // jumper.female.position.y = insert ? -300 : -900;
                            jumper.position.z = 0;
                        });

                        // console.log( jumper );

                    });
                    var l = 0.65.div;
                    this.timeline.add(jumper.insert(1.0), time + j - 2.5.div);
                    // this.timeline.to( jumper.female.position, l / 2.0, { y: 0, ease: Quad.easeOut }, time + j - 1.5.div );
                    this.timeline.to(jumper.position, 2.0.beats, { z: tz - 5.0, ease: Expo.easeOut }, time + j - 1.0.div);
                    // this.timeline.to( jumper.rotation, 1.5.beats, { x: rx - random.sign() * random( 0.5, 4.0 ), ease: Expo.easeOut }, time + j - 0.2.div );
                    // if ( insert ) this.timeline.to( dest.position, l / 2.0, { x: x, y: y, ease: Quad.easeOut }, time + j - 1.0.div );

                }, this)

                // this.timeline.to( dest.position, 0.25.div, { x: sx / ( jumperTimes.length + 1 ), z: this.camera.distance, y: sy / ( jumperTimes.length + 1 ), ease: Quint.easeOut }, time + shake.duration - 1.0.div );
                dest.position.x = sx / (jumperTimes.length + 1)
                dest.position.z = dest.distance;//this.camera.distance
                dest.position.y = sy / (jumperTimes.length + 1);

                function reset(pair) {

                    _this.timeline.set(pair.male.position, { z: maleDistance }, time - d);
                    // _this.timeline.set( pair.male.rotation, rot, time - d );
                    // _this.timeline.set( pair.female.rotation, rot, time - d );

                }

            }.bind(this);

            cameraImpact(Time.bbd(20, 2), true, 4.0.div, [
                Time.bbd(0, 0, 1) + 0.9.beats,
                Time.bbd(0, 0, 2) + 0.9.beats
            ], [
                90, 45, 180, -45
            ]);

            cameraImpact(Time.bbd(21, 0), true, 4.0.div, [
                Time.bbd(0, 0, 1) + 0.9.beats,
                Time.bbd(0, 0, 2) + 0.9.beats
            ], [
                90, 45, 180, 90
            ]);

            var fourScale = 0.7;

            cameraImpact(Time.bbd(21, 2), false, 2.0.div, [
                Time.bbd(0, 0, 0) + 0.55.beats,
                Time.bbd(0, 0, 1) + 0.55.beats,
                Time.bbd(0, 0, 2) + 0.55.beats,
                Time.bbd(0, 0, 3) + 0.55.beats,
            ], [
                90 * fourScale, 45 * fourScale,
                180 * fourScale, 90 * fourScale,
                270 * fourScale, 135 * fourScale,
                360 * fourScale, 180 * fourScale
            ]);

            cameraImpact(Time.bbd(22, 0), true, 4.0.div, [
                Time.bbd(0, 0, 1) + 0.9.beats,
                Time.bbd(0, 0, 2) + 0.9.beats
            ], [
                90, -45, 180, -90
            ]);

            cameraImpact(Time.bbd(22, 2), false, 4.0.div, [], [], true);
            cameraImpact(Time.bbd(22, 3), false, 4.0.div, [], [], true);
            cameraImpact(Time.bbd(23, 0), true, 4.0.div, [], [], true);
            cameraImpact(Time.bbd(23, 2), false, 4.0.div, [], [], true);
        }

    }

    fall() {

        this.pairs.forEach(function (pair) {
            pair.fallBehavior.start();
        }.bind(this));

    }

    update() {

        if (Player.now < Time.bars(20)) {
            this.cameraContainer.position.x = this.now * this.timeSpacing;
        }

        if (this.cameraTarget) {
            this.camera.copy(this.cameraTarget);
        }

        // if ( Player.now > Time.bbd( 19, 3, 3 ) ) {

        //     Controls.object._targetDistance = this.postRainDistance;
        //     // console.log( this.postRainDistance );
        // } else {
        //     Controls.object._targetDistance = 200;

        // }

        floor.time.y += 0.003;


        // console.log( Player.now, this.throbFrequency );
        this.throb = ~~((Player.now + (window.number || 0)) / this.throbFrequency);
        if (this.throb > this.lastThrob) {
            // this.throbTimeline.restart();
        }

        this.lastThrob = this.throb;
        // console.log( this.throb, this.lastThrob );

        // floor.threshhold += ( this.targetThreshold - floor.threshhold ) * 0.01;


    }
}
