import chalk from 'chalk'

export function printTable(table: string[][]) {
  table = uniformTable(table)

  const [header, ...content] = table

  printLine(header)
  printLine(header.map((n) => '-'.repeat(n.length)))

  content.forEach((row) => printLine(row))
}

function uniformTable(table: string[][]) {
  const colLens = calcColLength(table)

  const uniformed: string[][] = []

  table.forEach((row) => {
    const uniformedRow: string[] = []

    row.forEach((s, idx) => {
      if (s.length <= 1 && idx === 0) {
        uniformedRow[idx] = s.padEnd(1, ' ')
        return
      }

      uniformedRow[idx] = s.padEnd(colLens[idx], ' ')
    })

    uniformed.push(uniformedRow)
  })

  return uniformed
}

function calcColLength(table: string[][]) {
  const [header, ...content] = table
  const colLens = []
  for (let idx = 0; idx < header.length; idx++) {
    let maxLen = header[idx].length

    content.forEach((row) => {
      maxLen = Math.max((row[idx] || '').length, maxLen)
    })

    colLens[idx] = maxLen + 2
  }

  return colLens
}

function printLine(row: string[]) {
  console.log(...row.map((s) => highlight(s)))
}

function highlight(str: string) {
  const url = /^https?:\/\//

  if (url.test(str.trim())) {
    return chalk.green(str)
  }

  return str
}
