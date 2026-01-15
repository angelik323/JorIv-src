export const useValidator = () => {
  const validateAlphanumeric = (value: string): boolean => {
    const alphanumericRegex = /^[a-zA-Z0-9\s]*$/
    return alphanumericRegex.test(value) && value.length <= 200
  }

  const validateAlphanumericOnly = (value: string): string | true => {
    if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]*$/.test(value))
      return 'El campo solo debe contener caracteres alfanuméricos.'
    return true
  }

  const validateAlphanumericMessage = (
    value: string,
    length: number = 200,
    label?: string
  ): string | true => {
    if (!value)
      return label ? `${label} es requerido` : 'El campo es obligatorio.'
    if (value.length > length)
      return `El campo debe tener un máximo de ${length} caracteres.`
    if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]*$/.test(value))
      return 'El campo solo debe contener caracteres alfanuméricos.'
    return true
  }

  const validateNumericMessage = (
    value: string,
    maxLength: number = 100,
    label?: string
  ): string | true => {
    if (!value) {
      return label
        ? `El campo ${label} es requerido`
        : 'El campo es obligatorio.'
    }
    if (value.length > maxLength) {
      return `El campo debe tener un máximo de ${maxLength} caracteres.`
    }
    if (!/^-?\d+$/.test(value)) {
      return label
        ? `El campo ${label} solo debe contener números`
        : 'El campo solo debe contener números.'
    }
    return true
  }

  const validateNumericStrict = (
    value: string,
    maxLength: number = 100,
    label?: string
  ): string | true => {
    if (value) {
      if (value.length > maxLength) {
        return `El campo debe tener un máximo de ${maxLength} caracteres.`
      }
      if (!/^\d+$/.test(value)) {
        return label
          ? `El campo ${label} solo permite números`
          : 'Solo se permiten números'
      }
    }
    return true
  }

  const validateAlphabeticStrict = (
    value: string,
    maxLength: number = 100,
    label?: string
  ): string | true => {
    if (value) {
      if (value.length > maxLength) {
        return `El campo debe tener un máximo de ${maxLength} caracteres.`
      }
      if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]+$/.test(value)) {
        return label
          ? `El campo ${label} solo permite letras`
          : 'Solo se permiten letras'
      }
    }
    return true
  }

  const validateEmail = (value: string): string | true => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!value) return 'El correo es requerido.'
    if (value.length > 200)
      return 'El campo debe tener un máximo de 200 caracteres.'
    if (!emailRegex.test(value))
      return 'El campo debe ser un correo electrónico válido.'
    return true
  }

  const validateTwoDecimals = (val: any, label: string): string | true => {
    const decimalPattern = /^\d+(\.\d{1,2})?$/
    if (!val) return `El campo ${label} es requerido`
    if (!decimalPattern.test(val))
      return 'Por favor ingrese hasta dos decimales'
    return true
  }

  const validateCoinValue = (
    val: any,
    label: string,
    length: number = 15
  ): string | true => {
    const decimalPattern = /^\d+(\.\d{1,2})?$/
    if (!val) return `El campo ${label} es requerido y debe ser un número`
    if (val < 0) return `El campo ${label} no puede ser negativo`
    if (val.length > length)
      return `El campo ${label} debe tener un máximo de ${length} caracteres.`
    if (!decimalPattern.test(val))
      return 'Por favor ingrese hasta dos decimales'
    if (parseFloat(val) < 0) return 'El valor no puede ser inferior a 0'
    return true
  }

  const validateLastNumber = (value: string): number | null => {
    const match = value.match(/\d+(?=\D*$)/)
    return match ? parseInt(match[0], 10) : null
  }

  const validateCharacterCount = (
    label: string,
    newCharacter: string,
    maxCount: number
  ) => {
    if (newCharacter.length > maxCount)
      return `El campo ${label} debe tener un máximo de ${maxCount} caracteres y posee ${newCharacter.length} caracteres.`
    return true
  }

  const blockInvalidKeys = (evt: KeyboardEvent) => {
    if (evt.key === 'e' || evt.key === 'E') {
      evt.preventDefault()
    }
  }
  const requiredField = (value: unknown, label: string): string | true => {
    if (!!value === false) {
      return `El campo ${label} es requerido`
    }
    return true
  }

  return {
    requiredField,
    validateAlphanumeric,
    validateAlphanumericOnly,
    validateAlphanumericMessage,
    validateNumericMessage,
    validateNumericStrict,
    validateAlphabeticStrict,
    validateEmail,
    validateTwoDecimals,
    validateCoinValue,
    validateLastNumber,
    validateCharacterCount,
    blockInvalidKeys,
  }
}
