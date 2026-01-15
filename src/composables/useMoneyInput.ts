import { ref, computed } from 'vue'
import { IMoneyInputProps, IMoneyInputReturn } from '@/interfaces/global'

export const useMoneyInput = ({
  maxIntegerDigits = 40,
  maxDecimalDigits = 6,
  thousandSeparator = '.',
  decimalSeparator = ',',
}: IMoneyInputProps): IMoneyInputReturn => {
  const displayValue = ref<string>('')
  const rawValue = ref<string | null>(null)

  // Convierte formato (1234567.89) a formato colombiano (1.234.567,89)
  const formatToDisplay = (value: string | null): string => {
    if (!value || value === '') return ''

    // Limpia excepto dígitos y punto decimal
    const cleaned = value.replaceAll(/[^\d.]/g, '')

    // Parte entera y decimal
    const parts = cleaned.split('.')
    let integerPart = parts[0] || ''
    let decimalPart = parts[1] || ''

    if (integerPart.length > maxIntegerDigits) {
      integerPart = integerPart.slice(0, maxIntegerDigits)
    }
    if (decimalPart.length > maxDecimalDigits) {
      decimalPart = decimalPart.slice(0, maxDecimalDigits)
    }

    // Separador de miles (de derecha a izquierda)
    const formattedInteger = integerPart.replaceAll(
      /\B(?=(\d{3})+(?!\d))/g,
      thousandSeparator
    )

    return decimalPart
      ? `${formattedInteger}${decimalSeparator}${decimalPart}`
      : formattedInteger
  }

  // Convierte formato (1.234.567,89) a raw (1234567.89)
  const parseToRaw = (displayValue: string): string | null => {
    if (!displayValue || displayValue === '') return null

    // Limpia separadores de miles
    let cleaned = displayValue.replaceAll(
      new RegExp(`\\${thousandSeparator}`, 'g'),
      ''
    )

    // Reemplaza separador decimal por punto
    cleaned = cleaned.replace(decimalSeparator, '.')

    if (!/^\d*\.?\d*$/.test(cleaned)) return null

    return cleaned
  }

  // Valida entrada del usuario en tiempo real
  const validateInput = (input: string): string => {
    let cleaned = input.replaceAll(
      new RegExp(`[^\\d${thousandSeparator}${decimalSeparator}]`, 'g'),
      ''
    )

    // Permite solo un separador decimal
    const decimalCount = (
      cleaned.match(new RegExp(`\\${decimalSeparator}`, 'g')) || []
    ).length

    if (decimalCount > 1) {
      const firstDecimalIndex = cleaned.indexOf(decimalSeparator)
      cleaned =
        cleaned.slice(0, firstDecimalIndex + 1) +
        cleaned
          .slice(firstDecimalIndex + 1)
          .replaceAll(new RegExp(`\\${decimalSeparator}`, 'g'), '')
    }

    return cleaned
  }

  // Procesa entrada del usuario
  const handleInput = (
    input: string
  ): { display: string; raw: string | null } => {
    const validated = validateInput(input)

    // Remover separadores de miles temporalmente para procesar
    const withoutThousands = validated.replaceAll(
      new RegExp(`\\${thousandSeparator}`, 'g'),
      ''
    )

    // Separa entero y decimal
    const parts = withoutThousands.split(decimalSeparator)
    let integerPart = parts[0] || ''
    let decimalPart = parts[1] || null

    // Limita dígitos enteros
    if (integerPart.length > maxIntegerDigits) {
      integerPart = integerPart.slice(0, maxIntegerDigits)
    }

    // Limita dígitos decimales
    if (decimalPart !== null && decimalPart.length > maxDecimalDigits) {
      decimalPart = decimalPart.slice(0, maxDecimalDigits)
    }

    const formattedInteger = integerPart.replaceAll(
      /\B(?=(\d{3})+(?!\d))/g,
      thousandSeparator
    )

    let displayResult = formattedInteger

    if (decimalPart !== null) {
      displayResult += decimalSeparator + decimalPart
    } else if (validated.endsWith(decimalSeparator)) {
      // Preservar separador si el usuario acaba de escribirlo
      displayResult += decimalSeparator
    }

    // Valor raw (formato backend)
    const rawResult =
      integerPart + (decimalPart !== null ? `.${decimalPart}` : '')

    displayValue.value = displayResult
    rawValue.value = rawResult || null

    return {
      display: displayResult,
      raw: rawResult || null,
    }
  }

  // Inicializa los valores
  const initialize = (value: string | null): void => {
    if (!value) {
      displayValue.value = ''
      rawValue.value = null
      return
    }

    rawValue.value = value
    displayValue.value = formatToDisplay(value)
  }

  return {
    displayValue: computed(() => displayValue.value),
    rawValue: computed(() => rawValue.value),
    formatToDisplay,
    parseToRaw,
    handleInput,
    initialize,
  }
}
