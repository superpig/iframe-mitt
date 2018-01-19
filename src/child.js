import mitt from 'mitt';
const emitter = mitt();

export default class {
    static init () {
        window.addEventListener('message', (e) => {
            if (!e.data || !e.data.type) return;

            const message = {
                data: e.data.message,
                origin: e.origin,
                source: e.source
            };
            emitter.emit(e.data.type, message);
        });

        const message = {
            type: 'iframe_mitt:ready',
            data: 'ready'
        };
        this.postMessage(message, '*');

    }
    static postMessage (message, targetOrigin, transfer) {
        if (window.parent) {
            window.console.info(message, targetOrigin, transfer);
            window.parent.postMessage(message, targetOrigin, transfer);
        }
    }
    static emit (type, { message, targetOrigin, transfer }) {
        const data = { type, message };
        this.postMessage(data, targetOrigin, transfer);
    }
    static on (type, handler) {
        emitter.on(type, handler);
    }
    static off (type, handler) {
        emitter.off(type, handler);
    }
}
