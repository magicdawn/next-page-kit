'use strict';

/**
 * module dependencies
 */

const fs = require('fs-extra');
const path = require('path');
const co = require('co');
const cheerio = require('cheerio');
const request = require('superagent');
require('superagent-charset')(request);


/**
 * utils
 */

const NOT_IMPLEMENTED = 'not implemented';
const notImplemented = () => {
  throw new Error(NOT_IMPLEMENTED);
};


const NextPage = exports = module.exports = class NextPage {
  constructor(fns) {
    if (!fns || !fns.action || !fns.hasNext || !fns.getNext) {
      throw new TypeError('action/hasNext/getNext can not be empty');
    }
  }

  // 当前页
  action($) {
    notImplemented();
  }

  // 翻页 ?
  hasNext($) {
    notImplemented();
  }

  // 下页 url
  getNext($) {
    notImplemented();
  }
};

NextPage.prototype.run = co.wrap(function*(url, options) {
  let html, $;

  // options
  options = options || {};
  const enc = options.enc;

  html = yield request.get(url).charset(enc);
  $ = cheerio.load(html);
  this.action($);

  while (this.hasNext($)) {
    const rel = this.getNext($);
    url = path.resolve(url, rel);
    url = normalizeUrl(url);

    html = yield request.get(url).charset(enc);
    $ = cheerio.load(html);
    this.action($);
  }
});

function normalizeUrl(url) {
  if (path.extname(url) === '' && url[url.length - 1] !== '/') {
    url += '/';
  }
  return url;
}