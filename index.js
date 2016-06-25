'use strict'

/**
 * module dependencies
 */

const fs = require('fs-extra')
const path = require('path')
const URL = require('url')
const co = require('co')
const cheerio = require('cheerio')
const request = require('superagent')
require('superagent-charset')(request)
const _ = require('lodash')
const debug = require('debug')('next-page:index')

/**
 * utils
 */

const NOT_IMPLEMENTED = 'not implemented'
const notImplemented = () => {
  throw new Error(NOT_IMPLEMENTED)
}


const NextPage = exports = module.exports = class NextPage {
  constructor(options) {
    _.assign(this, options)

    if (!this.action || !this.hasNext || !this.getNext) {
      throw new TypeError('action/hasNext/getNext can not be empty')
    }

    // init
    if (this.init) {
      this.init()
    }
  }

  // 当前页
  action($) {
    notImplemented()
  }

  // 翻页 ?
  hasNext($) {
    notImplemented()
  }

  // 下页 url
  getNext($) {
    notImplemented()
  }
}

NextPage.prototype.run = co.wrap(function*(url, options) {
  let html, $, index

  // options
  options = options || {}
  const enc = options.enc
  const limit = options.limit || Infinity // 无限制

  index = 0
  debug('process: index = %s, url = %s', index, url)
  html = yield request
    .get(url)
    .charset(enc)
    .then(res => res.text)
  $ = cheerio.load(html)
  $._currentUrl = url
  this.action($)

  while (this.hasNext($) && ++index < limit) {
    const rel = this.getNext($)
    url = URL.resolve(url, rel)
    // url = ensureTrailingSlash(url)

    debug('process: index = %s, url = %s', index, url)
    html = yield request
      .get(url)
      .charset(enc)
      .then(res => res.text)
    $ = cheerio.load(html)
    $._currentUrl = url
    this.action($)
  }

  // postInit
  if(this.postInit) this.postInit()
})

/**
 * 添加末尾 `/`
 */

const ensureTrailingSlash = exports.ensureTrailingSlash = function(url) {
  const parsed = URL.parse(url)
  const pathname = parsed.pathname

  // ensure pathname
  if (!_.endsWith(pathname, '/')) parsed.pathname += '/'

  return URL.format(parsed)
}