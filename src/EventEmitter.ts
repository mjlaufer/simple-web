type Callback = () => void;

export default class EventEmitter {
    events: { [key: string]: Callback[] } = {};

    on = (eventName: string, cb: Callback): void => {
        const listeners = this.events[eventName] || [];
        listeners.push(cb);
        this.events[eventName] = listeners;
    };

    trigger = (eventName: string): void => {
        const listeners = this.events[eventName];

        if (!listeners || listeners.length === 0) {
            return;
        }

        listeners.forEach(cb => {
            cb();
        });
    };
}
