/**
 * https://github.com/ecomclub/shopping-cart
 * @author E-Com Club <ti@e-com.club>
 * @license MIT
 */

/**
 * EcomCart object with shopping cart methods.
 * @namespace
 */

var EcomCart = {}

;(function () {
  'use strict'

  /**
   * Current cart object.
   * @type {object}
   * @see {@link https://developers.e-com.plus/docs/api/#/store/carts/carts|Object model}
   */

  EcomCart.cart = {
    subtotal: 0,
    items: []
  }

  /**
   * List of cart items.
   * @type {array.<object>}
   */

  EcomCart.items = EcomCart.cart.items

  // trigger callbacks after cart changes (events)
  var callbacks = []

  /**
   * Add callback function for cart events.
   * @param {function} callback - The callback function
   */

  EcomCart.addCallback = function (callback) {
    if (typeof callback === 'function') {
      callbacks.push(callback)
    }
  }

  /**
   * Fix subtotal and save cart object to browser localStorage.
   */

  EcomCart.saveCart = function () {
    // fix cart subtotal
    EcomCart.cart.subtotal = 0
    var i, item
    for (i = 0; i < EcomCart.items.length; i++) {
      item = EcomCart.items[i]
      EcomCart.cart.subtotal += item.quantity * (item.final_price || item.price)
    }

    /* global localStorage */
    if (typeof localStorage === 'object' && localStorage) {
      localStorage.setItem('cart', JSON.stringify(EcomCart.cart))
    }
    // trigger callbacks
    for (i = 0; i < callbacks.length; i++) {
      callbacks[i](null, EcomCart.cart)
    }
  }

  /*
   * Check item quantity and save new cart object.
   * @param {object} item - Cart item object
   * @returns {string} Returns the item object ID
   */

  EcomCart.handleItem = function (item) {
    if (!item._id) {
      // generate random ObjectID
      // 24 chars hexadecimal string
      item._id = '1234'
      var hexa = '0123456789abcdef'
      for (var i = item._id.length; i < 24; i++) {
        item._id += hexa.charAt(Math.floor(Math.random() * hexa.length))
      }
    }

    // fix item quantity if needed
    if (item.min_quantity && item.quantity < item.min_quantity) {
      item.quantity = item.min_quantity
    } else if (item.max_quantity && item.quantity > item.max_quantity) {
      item.quantity = item.max_quantity
    }
    EcomCart.saveCart()
    return item._id
  }

  /**
   * Exports EcomCart object.
   * @module @ecomplus/shopping-cart
   * @returns {object} {@link EcomCart}
   */

  if (typeof window === 'object') {
    // on browser
    // set EcomCart object globally
    window.EcomCart = EcomCart
  } else if (module && module.exports) {
    // Node.js
    module.exports = EcomCart
  }
}())

// require('methods/*')
// require('reload')
