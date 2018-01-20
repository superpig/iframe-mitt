# iframe-mitt

- **可靠性**：避免父级 window 向 iframe 发送的 message 丢失
- **实用**：无需自己监听 message 事件，维护消息队列
- **用法**：利用 [mitt][1] 的事件分发机制，接口简洁


## 安装

```sh
$ npm install iframe-mitt --save
or
$ yarn add iframe-mitt
```

引用方式：

```js
// ES6 模块引用
import IframeMitt from 'iframe-mitt'

// CommonJS 模块引用
var IframeMitt = require('iframe-mitt')
```

## 使用
**iframe 父级页面调用：**

```javascript
import IframeMitt from 'iframe-mitt';

// iframe 加载之前的前置初始化
IframeMitt.parent.init();

// 可以在任意时刻触发事件（比如：：iframe 初始化之前），无需担心 message 丢失问题
IframeMitt.parent.emit('parent:first', {
    message: 'the first message',
    targetOrigin: 'http://local.xxx.com:9001'
});

// 监听 iframe 的 message
IframeMitt.parent.on('child:first', (event) => {
    console.log(event.data); // 'the first child message'
});

// 使用处理函数引用
function onFoo() {}
IframeMitt.parent.on('foo', onFoo)   // 监听
IframeMitt.parent.off('foo', onFoo)  // 注销
```

**iframe 内部调用：**
```javascript
import IframeMitt from 'iframe-mitt';

// 前置初始化
IframeMitt.child.init();

IframeMitt.child.on('parent:first', (event) => {
    console.log(event.data); // 'the first message'
});

IframeMitt.child.emit('child:first', {
    message: 'the first child message',
    targetOrigin: '*'
});

IframeMitt.child.on('*', (type, event) => {
    console.log(type, event.data); 
});
```

## API

### on
注册 message 事件的处理函数

**参数**
 - `type`:  String 类型，事件名称，`"*"` 表示所有事件
 - `handler`:  Function 类型，响应事件的处理函数，该函数的 event 参数的属性如下，具体参考[Window.postMessage][2]：
    - **data**: 从其他 window 传递过来的对象
    - **orgin**: 调用 postMessage  时消息发送方窗口的 origin . 这个字符串由 协议、“://“、域名、“ : 端口号”拼接而成。
    - **source**: 对发送消息的窗口对象的引用; 

### off
移除 message 事件的处理函数

**参数**
 - `type`:  String 类型，事件名称，`"*"` 表示所有事件
 - `handler`:  Function 类型，要移除的处理函数

### emit
调用该事件的所有处理函数，`"*"` 的处理函数在具体事件的处理函数之后调用

**参数**
 - `type`:  String 类型，事件名称
 - `event`:  Object 类型，包含三个参数：`{ message, targetOrigin, transfer }`，与 postMessage 参数含义一致，具体含义可以参考[Window.postMessage][2]


  [1]: https://github.com/developit/mitt
  [2]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage