export default class Bootstrap {
    paths = {
        midi: 'mid/' + "dennis" + '.mid',
        mp3: 'mp3/' + "dennis" + '.mp3',
        csv: 'csv/' + "dennis" + '.csv',
        peaks: 'peaks/' + "dennis" + '.json',
        volumes: 'volume!volume/' + "dennis" + '.json'
    }
    constructor() { }

    init(files, callback) {
        // files = files.concat(_.values(this.paths));
        Assets.load({
            files: files,
            basePath: 'assets/',
            progress: function (pct) {
                // this.setProgress(pct * 0.25);
            }
        }).then(() => {
            // this.Midi = Assets(this.paths.midi);
            // this.Csv = Assets(this.paths.csv);
            // this.Volumes = Assets(this.paths.volumes);
            // this.Peaks = Assets(this.paths.peaks);
            callback();
        });
    }

    static setProgress() { }
}
