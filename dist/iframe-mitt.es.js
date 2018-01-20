import mitt from 'mitt';

var emitter = mitt();

var defaultExport = function defaultExport () {};

defaultExport.init = function init () {
    window.addEventListener('message', function (e) {
        if (!e.data || !e.data.type) { return; }

        var message = {
            data: e.data.message,
            origin: e.origin,
            source: e.source
        };
        emitter.emit(e.data.type, message);
    });

    var message = {
        type: 'iframe_mitt:ready',
        data: 'ready'
    };
    this.postMessage(message, '*');

};
defaultExport.postMessage = function postMessage (message, targetOrigin, transfer) {
    if (window.parent) {
        window.console.info(message, targetOrigin, transfer);
        window.parent.postMessage(message, targetOrigin, transfer);
    }
};
defaultExport.emit = function emit (type, ref) {
        var message = ref.message;
        var targetOrigin = ref.targetOrigin;
        var transfer = ref.transfer;

    var data = { type: type, message: message };
    this.postMessage(data, targetOrigin, transfer);
};
defaultExport.on = function on (type, handler) {
    emitter.on(type, handler);
};
defaultExport.off = function off (type, handler) {
    emitter.off(type, handler);
};

var emitter$1 = mitt();

var Iframe = {
    window: null,
    callbacks: [],
    ready: function ready (cb) {
        return this.callbacks === null ? cb() : this.callbacks.push(cb);
    }
};

var defaultExport$1 = function defaultExport () {};

defaultExport$1.init = function init () {
    window.addEventListener('message', function (e) {
        if (!e.data || !e.data.type) { return; }

        var type = e.data.type;
        if (type === 'iframe_mitt:ready') {
            Iframe.window = e.source;
            if (Iframe.callbacks && Iframe.callbacks.length) {
                while (Iframe.callbacks.length) {
                    Iframe.callbacks.shift()();
                }
            }
            Iframe.callbacks = null;
        } else {
            var message = {
                data: e.data.message,
                origin: e.origin,
                source: e.source
            };
            emitter$1.emit(e.data.type, message);
        }
    }, false);
};
defaultExport$1.emit = function emit (type, ref) {
        var message = ref.message;
        var targetOrigin = ref.targetOrigin;
        var transfer = ref.transfer;

    Iframe.ready(function () {
        var data = { type: type, message: message };
        window.console.info(data, targetOrigin, transfer);
        return Iframe.window.postMessage(data, targetOrigin, transfer);
    });
};
defaultExport$1.on = function on (type, handler) {
    emitter$1.on(type, handler);
};
defaultExport$1.off = function off (type, handler) {
    emitter$1.off(type, handler);
};

var index = {
    child: defaultExport,
    parent: defaultExport$1
};

export default index;
//# sourceMappingURL=iframe-mitt.es.js.map
