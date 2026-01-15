import type { DirectiveBinding } from 'vue'
import Big from 'big.js'

interface IPercentageBinding {
  decimals: number
  value: number | string
}

const percentageDirective = (
  element: HTMLElement,
  binding: DirectiveBinding<IPercentageBinding>
) => {
  const { decimals = 10, value = 0 } = binding.value
  try {
    element.innerText = `${Big(value).toFixed(decimals)} %`
  } catch {
    element.innerText = `${value} %`
  }
}

export default {
  mounted: percentageDirective,
  updated: percentageDirective,
}
