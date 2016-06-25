'use strict';

/**
 * module dependencies
 */

const resolve = require('url').resolve;
const should = require('should');
const _ = require('lodash');
const co = require('co');
const sleep = require('promise.delay');
const NextPage = require('../');

describe('Simple', function() {

  it('it works', function*() {
    const n = new NextPage({
      init() {
        this.topics = [];
      },

      postInit() {
        this.topics = _.flatten(this.topics);
      },

      action($) {
        const topics = $('#TopicsNode .cell').map((_, el) => {
          const $el = $(el);

          // url
          let url = $el.find('.item_title a').attr('href');
          url = resolve($._currentUrl, url);

          return {
            title: $el.find('.item_title').text(),
            author: $el.find('.item_title').next().next().find('strong').text(),
            url: url
          };
        }).get();

        this.topics.push(topics);
      },

      hasNext($) {
        return true;
      },

      getNext($) {
        return $('.page_current').eq(0).next().attr('href');
      }
    });

    yield n.run('http://v2ex.com/go/share', {
      limit: 3
    });

    n.topics.should.be.Array();
    n.topics.length.should.equal(20 * 3);
  });

  it('async init/postInit', function*() {
    const n = new NextPage({
      init: co.wrap(function*() {
        yield sleep(10);
        this.x = 'x';
      }),

      postInit: co.wrap(function*() {
        this.y = 'y';
      }),

      action($) {
        this.title = $('title').text();
      },
      hasNext: $ => false,
      getNext: $ => undefined
    });

    yield n.run('http://www.qq.com/');
    n.x.should.equal('x');
    n.y.should.equal('y');
    n.title.should.match(/腾讯/);
  });
});

describe('Error', function() {
  it('when action/hasNext/getNext empty', function*() {
    (function() {
      new NextPage();
    }).should.throw(/action/).throw(/empty/);
  });

  it('when url empty in run', function*() {
    const noop = $ => undefined;
    const n = new NextPage({
      action: noop,
      hasNext: noop,
      getNext: noop
    });

    try {
      yield n.run();
    } catch (e) {
      e.should.be.Error();
      e.message.should.match(/url/).match(/empty/);
    }
  });
});