import { get, getBuffer } from './utils/xhr.js';

; (function (scope) {
    scope.Assets = function (asset) {

        // refer to loaded assets with or without path bangs
        // so you can load and request assets with the same string
        asset = asset.substring(asset.indexOf('!') + 1);

        if (!Assets.loaded[asset]) {
            console.error('Request for unloaded asset: ' + asset);
            return;
        }

        return Assets.loaded[asset];

    };
    _.extend(Assets, {

        Types: {},
        loaded: {},
        promises: {},
        basePath: '',

        getExtension: function (path) {
            return /(?:\.([^.]+))?$/.exec(path)[1];
        },

        getType: function (pathBang) {

            var loader;
            var path = pathBang;
            var bang = /^(.*)!(.*)/.exec(pathBang);

            if (bang) {
                loader = Assets.Types[bang[1]];
                path = bang[2];
            } else {
                const type = Assets.getExtension(pathBang)
                loader = Assets.Types[type];
            }

            if (!loader) {
                console.error('Unrecognized file type: ' + pathBang);
                return;
            }

            return { loader: loader, path: path };

        },

        load: function (args) {

            args = _.defaults(args, {
                files: [],
                basePath: Assets.basePath,
                progress: function () { }
            });

            var loaded = 0;
            var promises = [];

            args.files.forEach(function (pathBang) {

                var type = Assets.getType(pathBang);
                var loader = type.loader;
                var path = type.path;

                var promise = Assets.promises[path];

                if (!promise) {

                    promise = Assets.promises[path] = new Promise();

                    loader(args.basePath + path, function (asset) {
                        Assets.loaded[path] = asset;
                        promise.resolve();
                    });

                }

                promise.then(function () {
                    loaded++;
                    args.progress(loaded / args.files.length, loaded, args.files.length);
                });

                promises.push(promise);

            });

            return Promise.all(promises);

        }

    });

    var Types = scope.Assets.Types;


    // Plain Text
    // -------------------------------

    Types.text = get;
    Types.vs = get;
    Types.fs = get;
    Types.glsl = get;
    Types.woff2 = get;

    Types.json = function (url, load, error) {
        get(url, function (text) {
            load(JSON.parse(text));
        }, error);
    };


    // CSV
    // -------------------------------

    Types.csv = function (url, load, error) {

        get(url, function (text) {

            var lines = text.split('\n');
            var columns = lines[0].split(',');

            lines = lines.slice(1);
            lines.forEach(function (line, i) {

                var cells = line.split(',');
                var obj = {};

                cells.forEach(function (val, i) {

                    var col = columns[i];
                    if (col.toLowerCase() == 'time') {
                        var match = val.match(/(\d+):(\d+).(\d+)/);
                        if (match) {
                            var millis = parseInt(match[3]);
                            var seconds = parseInt(match[2]);
                            var minutes = parseInt(match[1]);
                            obj.time = Time.seconds(seconds + millis / 1000 + minutes * 60);
                        }
                    }
                    obj[col] = val;

                });

                lines[i] = obj;
            });

            lines.columns = columns;

            load(lines);

        }, error);

    };


    // Volume
    // -------------------------------

    Types.volume = function (url, load, error) {

        var volume = {};

        get(url, function (text) {
            var json = JSON.parse(text);
            for (var name in json) {
                // volume[name] = new Volume(json[name]);
            }
            load(volume);
        }, error);


    };


    // Images
    // -------------------------------

    Types.png = image;
    Types.jpg = image;
    Types.jpeg = image;
    Types.gif = image;

    function image(path, load) {
        var img = new Image();
        img.onload = function () {
            load(img);
        };
        img.src = path;
    };


    // Binary
    // -------------------------------

    Types.buffer = getBuffer;

    Types.mid = function (path, load, error) {
        getBuffer(path, function (buffer) {
            load(new MIDIFile(buffer));
        }, error)
    };


    // three.js
    // -------------------------------

    if (scope.THREE) {

        Types.texture = function (path, load, error) {
            // THREE.ImageUtils.loadTexture(path, THREE.UVMapping, load, error);
            var loader = new THREE.TextureLoader();
            var texture = loader.load(path, load, error);
        }

        Types.texturecube = function (path, load, error) {
            var paths = [];
            _.each(['px', 'nx', 'py', 'ny', 'pz', 'nz'], function (suf) {
                paths.push(path.replace('*', suf));
            });
            THREE.ImageUtils.loadTextureCube(paths, THREE.UVMapping, load, error);
        }

        if (THREE.OBJLoader) {

            var loader = new THREE.OBJLoader();

            Types.obj = function (url, load, error) {
                loader.load(url, load);
            };

        }

    }


    // pixi.js
    // -------------------------------

    if (scope.PIXI) {

        Types.sprite = function (path, load, error) {

            var loader = new PIXI.ImageLoader(path);
            loader.onLoaded = function () {
                load(new PIXI.Sprite(PIXI.TextureCache[path]));
            };
            loader.load();

        };

        Types.spritesheet = function (path, load, error) {

            var size = 2048; // todo

            var ogPath = path.toString();

            path = path.replace('{s}', size);
            path = path.replace('{n}', 0);

            path += '.json';

            get(path, function (text) {

                var json = JSON.parse(text);
                var sheets = _.map(_.range(json.sheets), function (n) {

                    return ogPath.replace('{s}', size).replace('{n}', n) + '.json';

                });

                var loader = new PIXI.AssetLoader(sheets);
                loader.onComplete = load;
                loader.load();

            }, error);

        };

    }

    var sound = function (url, load, error) {
        var audio = document.createElement('audio');
        audio.setAttribute('preload', 'auto');
        audio.setAttribute('src', url);
        load(audio);
    };

    Types.mp3 = sound;
    Types.ogg = sound;
    Types.wav = sound;
})(window);
