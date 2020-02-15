/// <reference types="cheerio" />

export type Charset = 'utf8' | 'gbk'

export default class NextPageKit<T> {
  constructor(options: {
    charset?: Charset
    getCurrent($: CheerioAPI): T[] | T
    hasNext($: CheerioAPI): boolean
    getNext($: CheerioAPI): string
  })

  getCurrent($: CheerioAPI): T[] | T
  hasNext($: CheerioAPI): boolean
  getNext($: CheerioAPI): string

  run(url: string, options?: {limit?: number}): Promise<T[]>
}
