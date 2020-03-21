import dao from './Dao.js'
import { map } from './utils/math.js'

// Colors to use for debug mode
const DEBUG_COLORS = [
    '#EC008B',
    '#FF3000',
    '#FFB600',
    '#FFF000',
    '#00FF67',
    '#00ADEF',
    '#A100FF',
];

export default class Debug {
    constructor() {
        const Midi = Assets('mid/dennis.mid')
        Midi.query({ type: 'noteOn' }).forEach(this.debugMidi);
    }

    debugMidi(e) {
        console.error(e);

        var canvas = document.getElementById('debug-canvas');
        var ctx = canvas.getContext('2d');
        const Midi = Assets('mid/dennis.mid')
        const { player, stage } = dao.getData()
        const domWidth = stage.renderer.domElement.width
        const domHeight = stage.renderer.domElement.height

        var noteRange = 50;
        var opacity = { value: 1 }, width, w, t, c, h, y;
        var start = 1;//Math.max( 0.5, e.velocity / 100 );
        player.timeline.fromTo(opacity, 0.02, { value: start }, {
            value: 1,
            onUpdate: function () {
                width = domWidth / 2;

                w = Math.floor(Math.min(width / (Midi.tracks.length - 1)), width / 2);
                t = (e.track || 1) - 1;

                c = Math.round(t / (Midi.tracks.length - 1) * 360);
                h = 1;

                y = Math.floor(map(e.note, 60 + noteRange, 60 - noteRange, 0, domHeight));

                ctx.globalCompositeOperation = 'source-over';

                ctx.globalAlpha = opacity.value;
                ctx.fillStyle = DEBUG_COLORS[t % DEBUG_COLORS.length];
                ctx.fillRect(w * t, 0, w - 1, domHeight);

                ctx.globalAlpha = Math.pow(opacity.value, 3);
                ctx.fillStyle = '#fff';

                ctx.globalAlpha = 1;
                ctx.fillStyle = 'rgba( 255, 255, 255, ' + opacity.value + ' )';
                ctx.fillRect(w * t, y, w - 1, h);

            },

            ease: Expo.easeOut

        }, e.time);
    }
}
