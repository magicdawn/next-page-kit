import NextPageKit from './'
import {expectType} from 'tsd'

const n = new NextPageKit({
  getCurrent($): string[] {
    return ['12']
  },
  hasNext() {
    return false
  },
  getNext() {
    return ''
  },
})

expectType<Promise<string[]>>(n.run('start-url'))
