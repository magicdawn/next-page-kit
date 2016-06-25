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
const isPromise = require('is-promise')

const NextPage = exports = module.exports = class NextPage {
  constructor(options) {
    _.assign(this, options)

    if (!this.action || !this.hasNext || !this.getNext) {
      throw new TypeError('action/hasNext/getNext can not be empty')
    }
  }

  // 当前页
  action($) {}

  // 翻页 ?
  hasNext($) {}

  // 下页 url
  getNext($) {}
}

NextPage.prototype.run = co.wrap(function*(url, options) {
  let html, $, index, p

  // init
  if (isPromise(p = this.init())) {
    yield p
  }

  options = options || {}
  const enc = options.enc
  const limit = options.limit || Infinity // 无限制页数

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
  if (isPromise(p = this.postInit())) {
    yield p
  }
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