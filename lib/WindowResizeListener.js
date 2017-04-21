/**
 * WindowResizeListener
 * React component for listening to window resize events
 */
import React from 'react'
import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'

class WindowResizeListener extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'WindowResizeListener'
    /**
     * List of resize listeners
     * @private
     */
    this._listeners = []

    /**
     * Maximum debounce wait time
     * @public
     */
    this._DEBOUNCE_TIME = 100

    // Manually bind this method to the component instance...
    this.onResize = this.onResize.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.onResize !== this.props.onResize
  }

  componentDidMount () {
    // Defer creating _debouncedResize until it's mounted
    // This allows users to change DEBOUNCE_TIME if they want
    // If there's no listeners, we need to attach the window listener
    if (!this._listeners.length) {
      this._debouncedResize = debounce(
        this.onResize,
        this.DEBOUNCE_TIME
      )
      window.addEventListener('resize', this._debouncedResize, false)
    }
    this._listeners.push(this.props.onResize)
    this._debouncedResize()
  }

  componentWillUnmount () {
    const idx = this._listeners.indexOf(this.props.onResize)
    this._listeners.splice(idx, 1)
    if (!this._listeners.length) {
      window.removeEventListener('resize', this._debouncedResize, false)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.onResize !== this.props.onResize) {
      const idx = this._listeners.indexOf(this.props.onResize)
      this._listeners.splice(idx, 1, nextProps.onResize)
    }
  }

  /**
   * Resize handler
   * Gets the window size and calls each listener
   * @private
   */
  onResize () {
    const windowWidth = window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    const windowHeight = window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight

    this._listeners.forEach((listener) => {
      listener({windowWidth, windowHeight})
    })
  }

  render () {
    return null
  }

  /**
   * return the DEBOUNCE_TIME value
   * @return {number}
   * @constructor
   */
  get DEBOUNCE_TIME () {
    return this._DEBOUNCE_TIME
  }

  /**
   * Sets a new value for the DEBOUNCE_TIME variable
   * @param {number} value
   * @constructor
   */
  set DEBOUNCE_TIME (value) {
    this._DEBOUNCE_TIME = value
  }
}

WindowResizeListener.propTypes = {
  /**
   * Called at least once soon after being mounted
   * type WindowSize = { windowWidth: number, windowHeight: number }
   * type onResize = (windowSize: WindowSize) => void
   */
  onResize: PropTypes.func.isRequired
}

export default WindowResizeListener
