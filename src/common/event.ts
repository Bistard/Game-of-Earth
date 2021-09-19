import { LinkedList } from "./utils/linkedList.js";

export interface Event<T> {
	(listener: (e: T) => any, thisArgs?: any),
}

export type Listener<T> = [(e: T) => void, any] | ((e: T) => void);

export interface EmitterOptions {
	onFirstListenerAdd?: Function;
	onFirstListenerDidAdd?: Function;
	onListenerDidAdd?: Function;
	onLastListenerRemove?: Function;
}

export class Emitter<T> {
    private readonly _options?: EmitterOptions
    private _event?: Event<T>
    private _deliveryQueue?: LinkedList<[Listener<T>, T]>;
	protected _listeners?: LinkedList<Listener<T>>;

    constructor(options?: EmitterOptions) {
        this._options = options;
    }

    get event(): Event<T> {
        if (!this._event) {
            this._event = (listener: (e: T) => any, thisArgs?: any) => {
                if (!this._listeners) {
					this._listeners = new LinkedList();
				};

                this._listeners.push(!thisArgs ? listener : [listener, thisArgs]);

				if (this._options && this._options.onListenerDidAdd) {
					this._options.onListenerDidAdd(this, listener, thisArgs);
				}

            }
        }


        return this._event;
    }

    fire(event: T): void {
		if (this._listeners) {
			// put all [listener,event]-pairs into delivery queue
			// then emit all event. an inner/nested event might be
			// the driver of this

			if (!this._deliveryQueue) {
				this._deliveryQueue = new LinkedList();
			}

			for (let listener of this._listeners) {
				this._deliveryQueue.push([listener, event]);
			}

			while (this._deliveryQueue.size > 0) {
				const [listener, event] = this._deliveryQueue.shift()!;
				try {
					if (typeof listener === 'function') {
						listener.call(undefined, event);
					} else {
						listener[0].call(listener[1], event);
					}
				} catch (err) {
					throw err;
				}
			}
		}
	}
}


export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}