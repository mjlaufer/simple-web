type Callback = () => void;

interface Listener {
    cb: Callback;
    scope: any;
}

export default class EventEmitter {
    events: { [key: string]: Listener[] } = {};

    on = (eventName: string, cb: Callback, scope: any): void => {
        const listeners = this.events[eventName] || [];

        const callbacks = listeners.map(({ cb }: Listener) => cb);

        if (!callbacks.includes(cb)) {
            listeners.push({ cb, scope });
        }

        this.events[eventName] = listeners;
    };

    off = (eventName: string, cb: Callback): void => {
        const listeners = this.events[eventName];

        if (!listeners || listeners.length === 0) {
            return;
        }

        if (!cb) {
            delete this.events[eventName];
        } else {
            this.events[eventName] = listeners.filter((listener: Listener) => listener.cb !== cb);
        }
    };

    trigger = (eventName: string): void => {
        const listeners = this.events[eventName];

        if (!listeners || listeners.length === 0) {
            return;
        }

        listeners.forEach(({ cb, scope }: Listener) => {
            cb.bind(scope)();
        });
    };
}
