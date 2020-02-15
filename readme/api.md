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

### more see `types/index.d.ts`

```ts
/// <reference types="cheerio" />

export type Charset = 'utf8' | 'gbk'

export default class NextPageKit<T> {
  constructor(options: {
    charset?: Charset
    getCurrent($: CheerioStatic): T[] | T
    hasNext($: CheerioStatic): boolean
    getNext($: CheerioStatic): string
  })

  getCurrent($: CheerioStatic): T[] | T
  hasNext($: CheerioStatic): boolean
  getNext($: CheerioStatic): string

  run(url: string, options?: {limit?: number}): Promise<T[]>
}
```
