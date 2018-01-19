# iframe-mitt

-   ** 解决问题：** 保证父级 window 向 iframe 发送 postMessage 的可靠性和完整性
-   ** 优点：** 使用轻量的 `mitt`，支持其所有接口，无需自己维护消息队列


## 安装

```sh
$ npm install --save iframe-mitt
or
$ yarn add iframe-mitt -S
```

## 使用

父级

```javascript
import IframeMitt from 'iframe-mitt';

IframeMitt.parent.init();

// 可以在任意时刻触发事件，无需担心 message 丢失问题
IframeMitt.parent.emit('parent:first', {
    message: 'the first message',
    targetOrigin: 'http://local.xxx.com:9001'
});

IframeMitt.parent.emit('parent:second', {
    message: 'the second message',
    targetOrigin: 'http://local.xxx.com:9001'
});

// 监听 iframe 的 message
IframeMitt.parent.on('child:first', (event) => {
    console.log(event.data); // 'the first child message'
});
```

iframe
```javascript
import IframeMitt from 'iframe-mitt';

IframeMitt.child.init();

IframeMitt.child.on('parent:first', ({data, origin, source}) => {
    console.log(data); // 'the first message'
});

IframeMitt.child.on('parent:second', ({data, origin, source}) => {
    console.log(data); // 'the second message'
});

IframeMitt.child.emit('child:first', {
    message: 'the first child message',
    targetOrigin: '*'
});

IframeMitt.child.on('*', (type, {data, origin, source}) => {
    console.log(type, data); 
    // 'parent:first' 'the first message'
    // 'parent:second' 'the second message'
});

```

