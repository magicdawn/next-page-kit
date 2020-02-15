<!-- AUTO_GENERATED_UNTOUCHED_FLAG -->

# next-page-kit

> Helper for handle next-next page

[![Build Status](https://img.shields.io/travis/magicdawn/next-page-kit.svg?style=flat-square)](https://travis-ci.org/magicdawn/next-page-kit)
[![Coverage Status](https://img.shields.io/codecov/c/github/magicdawn/next-page-kit.svg?style=flat-square)](https://codecov.io/gh/magicdawn/next-page-kit)
[![npm version](https://img.shields.io/npm/v/next-page-kit.svg?style=flat-square)](https://www.npmjs.com/package/next-page-kit)
[![npm downloads](https://img.shields.io/npm/dm/next-page-kit.svg?style=flat-square)](https://www.npmjs.com/package/next-page-kit)
[![npm license](https://img.shields.io/npm/l/next-page-kit.svg?style=flat-square)](http://magicdawn.mit-license.org)

## Install

```sh
$ npm i -S next-page-kit
```

## API

```js
const NextPageKit = require('next-page-kit')
```

### `n = new NextPageKit(options)`

| `options`            | type                                   | remark                    |
| -------------------- | -------------------------------------- | ------------------------- |
| `options.charset`    | `type: String`, allowed`utf8` or `gbk` | the page charset          |
| `options.getCurrent` | function `($: cheerio) => any`         | returns current paeg data |
| `options.hasNext`    | function `($: cheerio) => Boolean`     | test has next page        |
| `options.getNext`    | function `($: cheerio) => String`      | get next page url         |

```js
const n = new NextPageKit({
  getCurrent($) {
    return $('img')
      .map(function() {
        return $(this).attr('src')
      })
      .toArray()
  },
  hasNext($) {},
  getNext($) {},
})

// Promise<string[]>
// all img src
n.run()
```

### `n.run(url, options)`

- `url`: the entry
- `options`:
  - `limit`: page limit

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

the MIT License http://magicdawn.mit-license.org
