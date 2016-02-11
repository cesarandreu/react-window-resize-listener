/**
 * resize
 * High-order component for WindowResizeListener
 */
var React = require('react')
var omit = require('lodash.omit')
var merge = require('merge')

function resize(Component) {
  return React.createClass({
    getInitialState: function() {
      windowHeight: 0,
      windowWidth: 0
    },

    render: function render() {
      var children = this.props.children;
      var props = omit(this.props, ['children']);

      return (
        <WindowResizeListener onResize={this.onResize}>
          {React.cloneElement(children, merge({}, props, this.state))}
        </WindowResizeListener>
      )
    },

    onResize: function(size) {
      this.setState(size)
    }
  })
}

exports.default = exports.resize = resize;
