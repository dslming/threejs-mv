import Pair from './Pair.js'
import { where } from '../../utils/where.js'

export default class PairPool {
    constructor(size) {
        this.size = size
    }

    init(callback, progress) {
        this.position = 0;
        this.items = [];
        var itemsPerFrame = 5;
        var addItem = function () {
            if (this.items.length + itemsPerFrame < this.size) {
                requestAnimationFrame(addItem);
            }
            for (var i = 0; i < itemsPerFrame && this.items.length < this.size; i++) {
                var item = this.create();
                item.busy = false;
                this.items.push(item);
            }

            progress && progress(this.items.length / this.size);
            if (this.items.length >= this.size) {
                callback();
            }

        }.bind(this);

        addItem();

    }

    create() {
        return new Pair();
    }

    next(requirements) {
        if (!_.isFunction(requirements)) {
            requirements = where(requirements);
        }
        var item, i = 0;
        do {
            item = this.items[this.position++ % this.items.length];
            i++;
        } while (item.busy && requirements(item) && i < this.items.length);

        if (item.busy) {
            console.error('No available items!');
        }

        item.busy = true;
        return item;
    }

    return(item) {
        item.busy = false;
    }
}
