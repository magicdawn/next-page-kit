const should = require('should')
const _ = require('lodash')
const sleep = require('promise.delay')
const NextPageKit = require('../')

describe('Simple', function() {
  it('it works', async () => {
    const n = new NextPageKit({
      getCurrent($) {
        const topics = $('#TopicsNode .cell')
          .map((_, el) => {
            const $el = $(el)

            // url
            let url = $el.find('.item_title a').attr('href')
            url = new URL(url, $._currentUrl).href

            return {
              title: $el.find('.item_title').text(),
              author: $el
                .find('.item_title')
                .next()
                .next()
                .find('strong')
                .text(),
              url: url,
            }
          })
          .get()
        return topics
      },

      hasNext($) {
        return true
      },

      getNext($) {
        return $('.page_current')
          .eq(0)
          .next()
          .attr('href')
      },
    })

    const limit = 2
    const topics = await n.run('https://v2ex.com/go/share', {limit})
    topics.should.be.Array()
    topics.length.should.equal(20 * limit)
  })

  // why skip
  // 不写 gbk 也可以 pass
  // 不知道是 node-fetch / umi-request / 163.com 哪一方的问题
  it.skip('other charset works', async () => {
    const n = new NextPageKit({
      charset: 'gbk',
      getCurrent($) {
        console.log($.html())
        return $('title').text()
      },
      hasNext: () => false,
      getNext: () => null,
    })
    const [title] = await n.run('https://www.163.com/')
    title.should.equal('网易')
  })
})

describe('Error', function() {
  it('when getCurrent/hasNext/getNext empty', () => {
    ;(function() {
      new NextPageKit()
    }.should
      .throw(/getCurrent/)
      .throw(/empty/))
  })

  it('when url empty in run', async () => {
    const noop = $ => undefined
    const n = new NextPageKit({
      getCurrent: noop,
      hasNext: noop,
      getNext: noop,
    })

    try {
      await n.run()
    } catch (e) {
      e.should.be.Error()
      e.message.should.match(/url/).match(/empty/)
    }
  })
})
