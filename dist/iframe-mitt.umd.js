!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("mitt")):"function"==typeof define&&define.amd?define(["mitt"],e):t["iframe-mitt"]=e(t.mitt)}(this,function(t){"use strict";var e=(t=t&&t.hasOwnProperty("default")?t.default:t)(),n=function(){};n.init=function(){window.addEventListener("message",function(t){if(t.data&&t.data.type){var n={data:t.data.message,origin:t.origin,source:t.source};e.emit(t.data.type,n)}});this.postMessage({type:"iframe_mitt:ready",data:"ready"},"*")},n.postMessage=function(t,e,n){window.parent&&(window.console.info(t,e,n),window.parent.postMessage(t,e,n))},n.emit=function(t,e){var n=e.message,a=e.targetOrigin,i=e.transfer,o={type:t,message:n};this.postMessage(o,a,i)},n.on=function(t,n){e.on(t,n)},n.off=function(t,n){e.off(t,n)};var a=t(),i={window:null,callbacks:[],ready:function(t){return null===this.callbacks?t():this.callbacks.push(t)}},o=function(){};return o.init=function(){window.addEventListener("message",function(t){if(t.data&&t.data.type)if("iframe_mitt:ready"===t.data.type){if(i.window=t.source,i.callbacks&&i.callbacks.length)for(;i.callbacks.length;)i.callbacks.shift()();i.callbacks=null}else{var e={data:t.data.message,origin:t.origin,source:t.source};a.emit(t.data.type,e)}},!1)},o.emit=function(t,e){var n=e.message,a=e.targetOrigin,o=e.transfer;i.ready(function(){var e={type:t,message:n};return window.console.info(e,a,o),i.window.postMessage(e,a,o)})},o.on=function(t,e){a.on(t,e)},o.off=function(t,e){a.off(t,e)},{Child:n,Parent:o}});