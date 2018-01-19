import Mitt from 'mitt';
const emitter = Mitt();

export default class {
    init () {
        window.addEventListener('message', (e) => {
            if (!e.data || !e.data.type) return;

            const { type, message } = e.data;
            e.data = message;
            emitter.emit(type, e);
        });

        const message = {
            type: 'iframe_mitt:ready',
            data: 'ready'
        };
        this.postMessage(message, '*');

    }
    postMessage (message, targetOrigin, transfer) {
        if (window.parent) {
            console.log(message, targetOrigin, transfer);
            window.parent.postMessage(message, targetOrigin, transfer);
        }
    }
    emit (type, { message, targetOrigin, transfer }) {
        const data = {
            type,
            message
        };
        this.postMessage(data, targetOrigin, transfer);
    }
    on (type, handler) {
        emitter.on(type, handler);
    }
    off (type, handler) {
        emitter.off(type, handler);
    }
}
