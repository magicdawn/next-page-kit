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
