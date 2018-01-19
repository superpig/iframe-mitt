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
     * 监听 iframe 消息，收到 super_iframe_event:ready 事件后即可向 iframe 发送消息
     */
    static init () {
        window.addEventListener('message', (e) => {
            if (!e.data || !e.data.type) return;
            const type = e.data.type;

            if (type === 'super_iframe_event:ready') {
                Iframe.window = e.source;
                if (Iframe.callbacks && Iframe.callbacks.length) {
                    while (Iframe.callbacks.length) {
                        Iframe.callbacks.shift()();
                    }
                }
                Iframe.callbacks = null;
            } else {
                emitter.emit(type, e);
            }
        }, false);
    }
    /**
     * 监听 iframe 消息，收到 super_iframe_event:ready 事件后即可向预览 iframe 发送消息
     * @param message 同 window.postMessage 的 message 参数
     * @param targetOrigin 同 window.postMessage 的 targetOrigin 参数
     * @param transfer 同 window.postMessage 的 transfer 参数
     */
    static postMessage (message, targetOrigin, transfer) {
        Iframe.ready(() => {
            console.log(message, targetOrigin, transfer);
            return Iframe.window.postMessage(message, targetOrigin, transfer);
        });
    }
    static emit (type, { message, targetOrigin, transfer }) {
        Iframe.ready(() => {
            const data = {
                type,
                message
            };
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
