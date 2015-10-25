# react-window-resize-listener

React component for listening to window resize events.

## Installation

```sh
$ npm install react-window-resize-listener
```

## API

### `<WindowResizeListener onResize/>`

React component that takes a single onResize callback which is called every time the window is resized.

#### Props

* `void onResize(windowSize)` - Callback that gets called every time the window is resized. It's always called once soon after getting mounted. Receives a `windowSize` param which is an Object with keys `windowHeight` and `windowWidth`, both values are numbers.

#### Example

```jsx
import { WindowResizeListener } from 'react-window-resize-listener'
import ReactDOM from 'react-dom'
import React from 'react'

ReactDOM.render(
  <div>
    <WindowResizeListener onResize={windowSize => {
      console.log('Window height', windowSize.windowHeight)
      console.log('Window width', windowSize.windowWidth)
    }}/>
  </div>,
  document.getElementById('app')
)
```

### `WindowResizeListener.DEBOUNCE_TIME`

Numeric value of how much time should be waited before calling each listener function. Default value is `100`.

The debounce function is created lazily when the component instance is mounted, so you can change the value before mounting.

## Details

This component lazily adds the window resize event listener, this means it works with universal apps. The listener only get added when a component instance gets mounted.

To avoid performance problems associated with registering multiple event listeners, it only registers a single listener which is shared among all component instances.

## License

MIT
