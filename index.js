const cheerio = require('cheerio')
const _ = require('lodash')
const isPromise = require('is-promise')
const umi = require('umi-request')
const debug = require('debug')('next-page-kit:index')

const NOT_IMPLEMENTED = 'not implemented'
const request = umi.extend({})

module.exports = class NextPageKit {
  constructor(options = {}) {
    if (!options || !options.getCurrent || !options.hasNext || !options.getNext) {
      throw new TypeError('getCurrent/hasNext/getNext can not be empty')
    }
    Object.assign(this, _.pick(options, ['getCurrent', 'hasNext', 'getNext']))

    // charset
    this.charset = options.charset || 'utf8'
  }

  // 当前页
  getCurrent($) {
    /* istanbul ignore next */
    throw new Error(NOT_IMPLEMENTED)
  }

  // 翻页 ?
  hasNext($) {
    /* istanbul ignore next */
    throw new Error(NOT_IMPLEMENTED)
  }

  // 下页 url
  getNext($) {
    /* istanbul ignore next */
    throw new Error(NOT_IMPLEMENTED)
  }

  async run(url, options = {}) {
    let p
    const charset = options.charset || 'utf8'
    const limit = options.limit || Infinity // 无限制页数
    if (!url) throw new Error('url can not be empty')

    const get$ = async link => {
      let html = await request.get(url, {
        charset,
        responseType: 'text',
      })
      $ = cheerio.load(html, {decodeEntities: false})
      $._currentUrl = url
      return $
    }

    let resultArr = []
    let $
    let pageResult

    // first page
    let index = 0
    debug('process: index = %s, url = %s', index, url)
    $ = await get$(url)
    pageResult = await this.getCurrent($)
    resultArr.push(pageResult)

    while (this.hasNext($) && ++index < limit) {
      const rel = this.getNext($)
      url = new URL(rel, url).href

      debug('process: index = %s, url = %s', index, url)
      $ = await get$(url)
      pageResult = await this.getCurrent($)
      resultArr.push(pageResult)
    }

    return resultArr.flat()
  }
}
