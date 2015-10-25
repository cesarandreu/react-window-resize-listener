var React = require('react')
var test = require('tape').test
var ReactDOM = require('react-dom')
var WindowResizeListener = require('../lib/WindowResizeListener').WindowResizeListener
var WindowResizeListenerFactory = React.createFactory(WindowResizeListener)

test('WindowResizeListener passes the expected params to onResize', function (t) {
  t.plan(4)

  var mountNode = document.createElement('div')
  var rootNode = React.DOM.div(
    null,
    WindowResizeListenerFactory({
      onResize: onResize
    })
  )
  ReactDOM.render(rootNode, mountNode)

  function onResize (windowSize) {
    t.equals(
      typeof windowSize, 'object',
      'Calls onResize with windowSize object'
    )
    t.equals(
      typeof windowSize.windowHeight, 'number',
      'windowSize.windowHeight is a number'
    )
    t.equals(
      typeof windowSize.windowWidth, 'number',
      'windowSize.windowWidth is a number'
    )
    t.ok(
      ReactDOM.unmountComponentAtNode(mountNode),
      'Unmounts instance from mountNode when done'
    )
  }
})

test('WindowResizeListener calls each onResize', function (t) {
  t.plan(3)

  var mountNode = document.createElement('div')
  var rootNode = React.DOM.div(null, [
    WindowResizeListenerFactory({
      onResize: onResize,
      key: 1
    }),
    WindowResizeListenerFactory({
      onResize: onResize,
      key: 2
    }),
    WindowResizeListenerFactory({
      onResize: onResize,
      key: 3
    })
  ])

  var calls = []
  function onResize () {
    calls.push(Date.now())
  }

  var before = Date.now()
  ReactDOM.render(rootNode, mountNode)

  setTimeout(function () {
    t.equals(
      calls.length, 3,
      'onResize is called 3 times'
    )
    t.ok(
      calls.every(function (after) {
        return WindowResizeListener.DEBOUNCE_TIME <= (after - before)
      }),
      'Each call waited at least DEBOUNCE_TIME'
    )
    t.ok(
      ReactDOM.unmountComponentAtNode(mountNode),
      'Unmounts instance from mountNode when done'
    )
  }, 200)
})

test('WindowResizeListener adds and removes listeners', function (t) {
  t.plan(4)
  t.equals(
    WindowResizeListener._listeners.length, 0,
    'Zero listeners before mounting'
  )

  var mountNode = document.createElement('div')
  var rootNode = React.DOM.div(
    null,
    WindowResizeListenerFactory({
      onResize: function () {
        t.fail('This should never be called')
      }
    })
  )
  ReactDOM.render(rootNode, mountNode)

  t.equals(
    WindowResizeListener._listeners.length, 1,
    'One listener after mounting'
  )
  t.ok(
    ReactDOM.unmountComponentAtNode(mountNode),
    'Unmounts instance from mountNode when done'
  )
  t.equals(
    WindowResizeListener._listeners.length, 0,
    'Zero listeners after unmounting'
  )
})

test('WindowResizeListener calls the latest onResize function', function (t) {
  t.plan(2)

  var mountNode = document.createElement('div')
  var firstRootNode = React.DOM.div(
    null,
    WindowResizeListenerFactory({
      onResize: function () {
        t.fail('Wrong onResize called')
      }
    })
  )
  ReactDOM.render(firstRootNode, mountNode)

  var secondRootNode = React.DOM.div(
    null,
    WindowResizeListenerFactory({
      onResize: function () {
        t.pass('Correct onResize called')
      }
    })
  )
  ReactDOM.render(secondRootNode, mountNode)

  setTimeout(function () {
    t.ok(
      ReactDOM.unmountComponentAtNode(mountNode),
      'Unmounts instance from mountNode when done'
    )
  }, 200)
})
