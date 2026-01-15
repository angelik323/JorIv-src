import Big from 'big.js'

export const useBigNumbers = () => {
  const createBigNumber = (value: number | string | Big) => {
    try {
      if (value instanceof Big) {
        return value
      }
      return new Big(value)
    } catch {
      return new Big(0)
    }
  }

  const sum = (a: number | string | Big, b: number | string | Big) => {
    return createBigNumber(a).plus(createBigNumber(b))
  }

  const minus = (a: number | string | Big, b: number | string | Big) => {
    return createBigNumber(a).minus(createBigNumber(b))
  }

  const multiply = (a: number | string | Big, b: number | string | Big) => {
    return createBigNumber(a).times(createBigNumber(b))
  }

  const minusMany = (
    a: number | string | Big,
    ...args: Array<number | string | Big>
  ) => {
    return args.reduce(
      (acc, curr) => createBigNumber(acc).minus(createBigNumber(curr)),
      createBigNumber(a)
    )
  }

  return {
    createBigNumber,
    sum,
    minus,
    multiply,
    minusMany,
  }
}
