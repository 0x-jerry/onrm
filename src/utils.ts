import nodeWhich from 'which'

export async function which(command: string) {
  const result = await nodeWhich(command, { nothrow: true })

  return !!result
}
