import pc from 'picocolors'
import { textTableToString } from '@0x-jerry/utils'

export function printTable(table: string[][]) {
  const result = textTableToString(table, {
    highlight(cell) {
      const url = /https?:\/\/[^\s]+/g

      return String(cell).replace(url, (s) => pc.green(s))
    }
  })

  console.log(result)
}
