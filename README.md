# next-page-kit
> Helper for handle next-next page

[![Build Status](https://img.shields.io/travis/magicdawn/next-page-kit.svg?style=flat-square)](https://travis-ci.org/magicdawn/next-page-kit)
[![Coverage Status](https://img.shields.io/coveralls/magicdawn/next-page-kit.svg?style=flat-square)](https://coveralls.io/github/magicdawn/next-page-kit?branch=master)
[![npm version](https://img.shields.io/npm/v/next-page-kit.svg?style=flat-square)](https://www.npmjs.com/package/next-page-kit)
[![npm downloads](https://img.shields.io/npm/dm/next-page-kit.svg?style=flat-square)](https://www.npmjs.com/package/next-page-kit)
[![npm license](https://img.shields.io/npm/l/next-page-kit.svg?style=flat-square)](http://magicdawn.mit-license.org)

## Install
```shell
npm i next-page-kit -S
```

## API
```js
const NextPage = require('next-page-kit');
```

### `n = new NextPage`
- `init`/`postInit` : hook function. return a promise is also supported
- `action`/`hasNext`/`getNext`: the logic

```js
const n = new NextPage({
  init() {

  },
  postInit() {

  },

  action($) {

  },
  hasNext($) {

  },
  getNext($) {

  }
});

yield n.run()
```

### `n.run`

```js
n.run(url, options)
```

- `url`: the entry
- `options`:
  - `enc`: the html encoding
  - `limit`: page limit

## Changelog
[CHANGELOG.md](CHANGELOG.md)

## License
the MIT License http://magicdawn.mit-license.org