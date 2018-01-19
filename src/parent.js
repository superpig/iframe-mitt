import mitt from 'mitt';
const emitter = mitt();

const Iframe = {
    window: null,
    callbacks: [],
    ready (cb) {
        return this.callbacks === null ? cb() : this.callbacks.push(cb);
    }
};

export default class {
    /**
     * 监听 iframe 消息，收到 iframe_mitt:ready 事件后即可向 iframe 发送消息
     */
    static init () {
        window.addEventListener('message', (e) => {
            if (!e.data || !e.data.type) return;
            
            const type = e.data.type;
            if (type === 'iframe_mitt:ready') {
                Iframe.window = e.source;
                if (Iframe.callbacks && Iframe.callbacks.length) {
                    while (Iframe.callbacks.length) {
                        Iframe.callbacks.shift()();
                    }
                }
                Iframe.callbacks = null;
            } else {
                const message = {
                    data: e.data.message,
                    origin: e.origin,
                    source: e.source
                }
                emitter.emit(e.data.type, message);
            }
        }, false);
    }
    static emit (type, { message, targetOrigin, transfer }) {
        Iframe.ready(() => {
            const data = { type, message };
            console.log(data, targetOrigin, transfer);
            return Iframe.window.postMessage(data, targetOrigin, transfer);
        });
    }
    static on (type, handler) {
        emitter.on(type, handler);
    }
    static off (type, handler) {
        emitter.off(type, handler);
    }
}
