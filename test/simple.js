'use strict'

/**
 * module dependencies
 */

const resolve = require('url').resolve
const should = require('should')
const _ = require('lodash')
const NextPage = require('../')

describe('V2EX', function() {

  it('it works', function*() {
    const n = new NextPage({
      init() {
        this.topics = []
      },

      postInit() {
        this.topics = _.flatten(this.topics)
      },

      action($) {
        const topics = $('#TopicsNode .cell').map((_, el) => {
          const $el = $(el)

          // url
          let url = $el.find('.item_title a').attr('href')
          url = resolve($._currentUrl, url)

          return {
            title: $el.find('.item_title').text(),
            author: $el.find('.item_title').next().next().find('strong').text(),
            url: url
          }
        }).get()

        this.topics.push(topics)
      },

      hasNext($) {
        return true
      },

      getNext($) {
        return $('.page_current').eq(0).next().attr('href')
      }
    })

    yield n.run('http://v2ex.com/go/share', {
      limit: 3
    })

    n.topics.should.be.Array()
    n.topics.length.should.equal(20 * 3)
  })
})