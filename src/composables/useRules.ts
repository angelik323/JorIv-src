import { formatDate } from '@vueuse/core'
import moment, { Moment } from 'moment'
import Holidays from 'date-holidays'

const validDateMasks = [
  'YYYY-MM-DD',
  'DD/MM/YYYY',
  'YYYY-MM',
  'MM/YYYY',
  'MM-YYYY',
  'YYYY',
]

export const useRules = () => {
  return {
    only_number_greater_than_zero_with_decimal: (val: string) => {
      const numberValue = parseFloat(val)
      return (
        (!isNaN(numberValue) && numberValue >= 0) ||
        'Ingresa un número mayor o igual a cero (0) o un decimal positivo sin comas.'
      )
    },
    date_not_older_than_months:
      (maxMonthsDiff: number = 6, format: string = 'YYYY-MM-DD') =>
        (val: string): true | string => {
          if (!val || typeof val !== 'string') {
            return 'Este campo es obligatorio'
          }

          const inputDate = moment(val.trim(), format, true)
          if (!inputDate.isValid()) {
            return `Ingresa una fecha válida en el formato ${format}`
          }

          const now = moment().startOf('month')
          const monthsDiff = Math.abs(now.diff(inputDate, 'months'))

          return (
            monthsDiff <= maxMonthsDiff ||
            `El período seleccionado supera los ${maxMonthsDiff} meses desde ${now.format(
              'YYYY-MM'
            )}`
          )
        },

    within_months_from:
      (
        getBase: string | (() => string),
        maxMonthsAhead = 6,
        format = 'YYYY-MM'
      ) =>
        (val: string): true | string => {
          if (!val) return true

          const baseStr = typeof getBase === 'function' ? getBase() : getBase
          const cur = moment((baseStr || '').trim(), format, true)
          const sel = moment((val || '').trim(), format, true)

          if (!cur.isValid())
            return 'El período actual es inválido o no está definido'
          if (!sel.isValid())
            return `Ingresa una fecha válida en el formato ${format}`

          const max = moment(cur).add(maxMonthsAhead, 'months').endOf('month')
          return (
            !sel.isAfter(max) ||
            `El período seleccionado supera los ${maxMonthsAhead} meses`
          )
        },

    only_number_greater_than_zero: (val: string) => {
      const numberValue = Number.parseFloat(val)
      return (
        (!Number.isNaN(numberValue) && numberValue >= 0) ||
        'Ingresa un número mayor o igual a cero (0)'
      )
    },

    only_positive_number: (val: string) => {
      const numberValue = Number.parseFloat(val)
      return (
        (!Number.isNaN(numberValue) && numberValue > 0) ||
        'Ingresa un número mayor a cero (0)'
      )
    },

    only_positive_value: (val: string) => {
      const cleanValue = val?.toString().replaceAll(/[$,\s]/g, '') ?? ''
      const numberValue = Number.parseFloat(cleanValue)

      return (
        (!Number.isNaN(numberValue) && numberValue >= 0) ||
        'No se permiten valores negativos'
      )
    },

    percentage_between: (
      val: string | number,
      min: number = 0,
      max: number = 100
    ) => {
      if (val === null || val === undefined || String(val).trim() === '') return true
      const cleanValue = String(val).replace('%', '')
      const numberValue = Number(cleanValue)
      return (
        (!Number.isNaN(numberValue) && numberValue >= min && numberValue <= max) ||
        `El porcentaje debe ser mayor o igual a ${min}% y menor o igual al ${max}%.`
      )
    },

    valid_format_date: (val: string, mask: string) => {
      if (!val || val.trim() === '') return true
      mask = validDateMasks.includes(mask) ? mask : 'YYYY-MM-DD'

      const isValid = moment(val, mask, true).isValid()
      return isValid || `Ingresa una fecha válida en el formato ${mask}.`
    },

    date_before_or_equal_to_the_current_date: (val: string) => {
      // Date now with format moment
      const today: Moment = moment()

      const validDate = moment(val, 'YYYY-MM-DD', true).isValid()

      if (!validDate) {
        return 'Ingresa una fecha válida en el formato AAAA/MM/DD.'
      }

      const formattedDate = moment(val, 'YYYY-MM-DD', true).format('YYYY-MM-DD')

      return (
        moment(formattedDate).isSameOrBefore(today, 'day') ||
        'Ingresa una fecha anterior o igual a la fecha actual.'
      )
    },

    date_after_or_equal_to_specific_date: (
      val: string,
      specificDate: string,
      label?: string
    ) => {
      const format = 'YYYY-MM-DD'

      const isValidDate = (date: string): boolean =>
        moment(date, format, true).isValid()

      if (!isValidDate(val) || !isValidDate(specificDate)) {
        return `Ingresa una fecha válida en el formato ${format}.`
      }

      const inputDate = moment(val, format)
      const comparisonDate = moment(specificDate, format)

      if (label) {
        return (
          inputDate.isSameOrAfter(comparisonDate, 'day') ||
          `La fecha no debe ser inferior a la ${label}.`
        )
      }

      return (
        inputDate.isSameOrAfter(comparisonDate, 'day') ||
        `La fecha debe ser igual o posterior a ${comparisonDate.format(
          'YYYY-MM-DD'
        )}.`
      )
    },

    date_after_specific_date: (val: string, specificDate: string) => {
      const format = 'YYYY-MM-DD'

      const isValidDate = (date: string): boolean =>
        moment(date, format, true).isValid()

      if (!isValidDate(val) || !isValidDate(specificDate)) {
        return 'Ingresa una fecha válida.'
      }

      const inputDate = moment(val, format)
      const comparisonDate = moment(specificDate, format)

      return (
        inputDate.isAfter(comparisonDate, 'day') ||
        `La fecha debe ser posterior a ${comparisonDate.format('YYYY-MM-DD')}.`
      )
    },

    date_before_or_equal_to_the_specific_date: (
      val: string,
      specificDate: string,
      message: string = 'Ingresa una fecha superior o igual a la fecha inicial.'
    ) => {
      const format = 'YYYY-MM-DD'

      const isValidDate = (date: string): boolean =>
        moment(date, format, true).isValid()

      if (!isValidDate(val)) {
        return `Ingresa una fecha válida en el formato ${format}.`
      }

      const inputDate: Moment = moment(val, format)
      const comparisonDate: Moment = moment(specificDate, format)
      const today: Moment = moment()

      if (!inputDate.isSameOrBefore(comparisonDate, 'day')) {
        return message
      }

      if (!inputDate.isSameOrBefore(today, 'day')) {
        return 'Ingresa una fecha anterior o igual a la fecha actual.'
      }

      return true
    },

    date_greater_than_or_equal_to_the_patient_date_of_birth: (
      val: string,
      birthday: string | null | undefined
    ) => {
      if (!birthday) {
        return 'La fecha de nacimiento del paciente es necesaria'
      }
      const validDate = moment(val, 'YYYY/MM/DD', true).isValid()
      const validDateBirthday = moment(birthday).isValid()

      if (!validDate) {
        return 'Ingresa una fecha válida en el formato YYYY/MM/DD.'
      }

      if (!validDateBirthday) {
        return 'La fecha de nacimiento del paciente no es valida'
      }

      const formattedDate = moment(val, 'YYYY/MM/DD', true).format('YYYY-MM-DD')
      const formattedBirthDay = moment(birthday).utc().format('YYYY-MM-DD')

      return (
        moment(formattedDate).isSameOrAfter(formattedBirthDay, 'day') ||
        'Ingresa una fecha mayor o igual a la fecha de nacimiento del paciente'
      )
    },

    is_older_than(date_str: string, min_years: number = 18) {
      const isValidDate = moment(date_str, 'YYYY-MM-DD', true).isValid()

      if (!isValidDate) {
        return 'Ingresa una fecha válida en el formato YYYY-MM-DD.'
      }

      const birthDate = moment(date_str, 'YYYY-MM-DD')
      const today = moment()

      const yearsDiff = today.diff(birthDate, 'years')

      return yearsDiff >= min_years || `Debe tener al menos ${min_years} años`
    },

    valid_format_time: (val: string) => {
      if (!val || val.trim() === '') return true

      const isValid = moment(val, 'HH:mm', true).isValid()
      return isValid || 'Ingresa una hora válida en el formato HH:mm'
    },

    only_number: (val: string) => {
      return /^\d+$/.test(val) || 'Solo se permiten números'
    },

    only_number_with_special_chars: (val: string) => {
      return (
        /^[\d.\-\-%#]*$/.test(val) ||
        'Solo se permiten números, puntos (.), guiones (-), porcentajes (%) y numerales (#)'
      )
    },

    length_between: (
      val: string | number | null | undefined,
      min: number,
      max: number
    ) => {
      if (val === null || val === undefined) return true // o 'Campo requerido' si debe ser obligatorio
      const str = String(val)
      return (
        (str.length >= min && str.length <= max) ||
        `Debe tener entre ${min} y ${max} dígitos`
      )
    },

    non_starting_with: (val: string, character: string) => {
      return !val.startsWith(character) || `No debe comenzar en ${character}`
    },

    starts_with: (val: string, character: string) => {
      return val.startsWith(character) || `Debe comenzar en ${character}`
    },

    is_required: (val: string, msg?: string) => {
      return !!val || (msg ?? 'Este campo es requerido')
    },

    is_required_boolean: (val: boolean, msg?: string) => {
      return typeof val === 'boolean' || (msg ?? 'Este campo es requerido')
    },

    max_length: (val: string | number | null | undefined, max: number) => {
      if (val === null || val === undefined) return true
      const str = String(val)
      return str.length <= max || `Máximo ${max} caracteres`
    },

    min_length: (val: string | number | null | undefined, min: number) => {
      if (val === null || val === undefined) return true
      const str = String(val)
      return str.length >= min || `Mínimo ${min} caracteres`
    },

    only_alphanumeric: (val: string, showError: boolean = true) => {
      return (
        /^[\p{L}\d ]*$/u.test(val) ||
        `${showError ? 'Solo se permiten letras y números' : ''}`
      )
    },

    only_letters: (val: string) => {
      return /^[\p{L} ]+$/u.test(val) || 'Debe tener solo letras'
    },

    max_value: (val: string | number, max: number) => {
      return Number(val) <= max || `No puede ser mayor a ${max}`
    },

    min_value: (val: string | number, max: number, message?: string) => {
      return Number(val) >= max || message || `No puede ser menor a ${max}`
    },
    min_currency_value: (
      val: string | number,
      max: number,
      message?: string
    ) => {
      const cleanValue =
        val
          ?.toString()
          .replace(/\./g, '')
          .replace(',', '.')
          .replace(/[$\s]/g, '') ?? ''
      const numberValue = Number(cleanValue)

      return (
        (!Number.isNaN(numberValue) && numberValue >= max) ||
        message ||
        `No puede ser menor a ${max}`
      )
    },
    is_valid_range: (
      rangeTo: string | number,
      rangeFrom: string | number,
      message = 'El rango final debe ser mayor que el inicial'
    ) => {
      const numTo = typeof rangeTo === 'string' ? parseFloat(rangeTo) : rangeTo
      const numFrom =
        typeof rangeFrom === 'string' ? parseFloat(rangeFrom) : rangeFrom

      if (isNaN(numTo) || isNaN(numFrom)) return true
      return numTo > numFrom || message
    },

    only_number_with_decimals: (val: string, max_decimals: number = 2) => {
      const regex = new RegExp(`^\\d+(\\.\\d{1,${max_decimals}})?$`)
      return regex.test(val) || 'Debe contener solo números y/o decimal'
    },
    minimal_quote: (
      minQuota: number,
      value: number,
      label: string
    ): string | true => {
      if (!minQuota) return true
      if (typeof minQuota !== 'number')
        return `El valor mínimo debe ser un número`
      if (minQuota < 0) return `El valor mínimo no puede ser negativo`
      if (value < minQuota)
        return `El campo ${label} debe tener un valor mínimo de ${minQuota}`
      return true
    },

    max_quote: (
      maxQuota: number,
      value: number,
      label: string
    ): string | true => {
      if (!maxQuota) return true
      if (typeof maxQuota !== 'number')
        return `El valor máximo debe ser un número`
      if (maxQuota < 0) return `El valor máximo no puede ser negativo`
      if (value > maxQuota)
        return `El campo ${label} debe tener un valor máximo de ${maxQuota}`
      return true
    },

    is_email: (
      val: string,
      customMessage = 'Ingresa un correo válido que termine en ".com" únicamente.',
      regex: RegExp = /^[^\s@]+@[^\s@]+\.(com)$/
    ) => {
      if (!val || val.trim() === '') return true
      return regex.test(val.trim()) || customMessage
    },

    is_email_all_domain_extension: (
      val: string,
      customMessage = 'Ingresa un correo válido.',
      regex: RegExp = /^[^\s@]+@[^\s@]+\.(com|net|org|co)$/
    ) => {
      if (!val || val.trim() === '') return true
      return regex.test(val.trim()) || customMessage
    },

    is_required_array: (val: unknown, customMessage: string): true | string => {
      return Array.isArray(val) && val.length > 0
        ? true
        : customMessage || 'El campo es obligatorio'
    },

    end_time_after_start_time: (
      endTime: string,
      startTime: string
    ): true | string => {
      const format = 'HH:mm'
      const end = moment(endTime, format, true)
      const start = moment(startTime, format, true)

      return (
        end.isSameOrAfter(start) ||
        'La hora final no debe ser menor a la hora inicial.'
      )
    },

    no_consecutive_spaces: (val: string) => {
      return !/\s{2,}/.test(val) || 'No debe contener espacios consecutivos'
    },

    only_number_with_max_integers_and_decimals: (
      val: string,
      integers: number,
      decimals: number
    ) => {
      const regex = new RegExp(`^\\d{1,${integers}}(\\.\\d{1,${decimals}})?$`)
      return (
        regex.test(val) ||
        `El valor debe tener hasta ${integers} caracteres enteros y ${decimals} decimales`
      )
    },

    only_number_with_max_integers_and_decimals_ignore_symbols: (
      val: string,
      maxIntegers: number,
      maxDecimals: number
    ) => {
      if (!val) return true

      const numeric = val.replace(/[.,]/g, '')

      if (!/^\d+$/.test(numeric)) return 'Solo se permiten números'

      const [integers, decimals] = val.replace(/\./g, '').split(',')

      if (integers.length > maxIntegers) {
        return `Máximo ${maxIntegers} dígitos enteros`
      }

      if (decimals && decimals.length > maxDecimals) {
        return `Máximo ${maxDecimals} decimales`
      }

      return true
    },

    only_number_with_max_integers_and_decimals_with_dot: (
      val: string,
      maxIntegers: number,
      maxDecimals: number
    ) => {
      if (!val) return true

      if (!/^\d*\.?\d*$/.test(val))
        return 'Solo se permiten números y un punto decimal'

      const dotCount = (val.match(/\./g) || []).length
      if (dotCount > 1) return 'Solo se permite un punto decimal'

      const [integers, decimals] = val.split('.')

      if (integers && integers.length > maxIntegers) {
        return `Máximo ${maxIntegers} dígitos enteros`
      }

      if (decimals && decimals.length > maxDecimals) {
        return `Máximo ${maxDecimals} decimales`
      }

      return true
    },

    no_special_characters: (val: string) => {
      return (
        /^[a-zA-Z0-9ñÑáéíóúÝÉÝÓÚüÜ\s-_]*$/.test(val) ||
        'No se permiten caracteres especiales'
      )
    },

    max_integer_decimal: (
      val: string,
      maxInteger: number,
      maxDecimal: number,
      isCurrencyInput: boolean = false
    ) => {
      const decimalSeparator = isCurrencyInput ? ',' : '.'
      const regex = new RegExp(
        `^\\d{1,${maxInteger}}(\\${decimalSeparator}\\d{0,${maxDecimal}})?$`
      )
      return (
        regex.test(val) ||
        `Máximo ${maxInteger} enteros y ${maxDecimal} decimales`
      )
    },

    max_2_integer_5_decimal: (val: string) => {
      return useRules().max_integer_decimal(val, 2, 5)
    },

    no_special_characters_extended: (val: string) => {
      return (
        /^[a-zA-Z0-9ñÑáéíóúÁÍÝÉÝÓÚüÜ\s-_,.;:&]*$/.test(val) ||
        'No se permiten caracteres especiales'
      )
    },

    email_validation: (val: string) => {
      if (!val || val.trim() === '') return true
      const emailRegex = /.+@.+\..+/
      return emailRegex.test(val) || 'Ingresa un correo electrónico válido'
    },
    email_no_accents: (val: string) => {
      if (!val || val.trim() === '') return true
      return !/[áéíóúÝÉÝÓÚñÑ]/.test(val) || 'El correo no debe contener acentos'
    },
    email_no_invalid_characters: (val: string) => {
      if (!val || val.trim() === '') return true
      return (
        /^[a-zA-Z0-9@._-]+$/.test(val) ||
        'El correo contiene caracteres no permitidos'
      )
    },
    email_no_consecutive_specials: (val: string) => {
      if (!val || val.trim() === '') return true
      return (
        !/[._-]{2,}/.test(val) ||
        'El correo no debe contener puntos, guiones o guiones bajos consecutivos'
      )
    },

    email_max_length: (val: string | null | undefined, max: number) => {
      if (!val?.trim()) return true
      const str = String(val)
      return str.length <= max || `Máximo ${max} caracteres`
    },

    email_min_length: (val: string | null | undefined, min: number) => {
      if (!val?.trim()) return true
      const str = String(val)
      return str.length >= min || `Mínimo ${min} caracteres`
    },

    date_between: (
      val: string,
      startDate: string,
      endDate: string,
      format = 'YYYY-MM-DD'
    ) => {
      if (!val || !startDate || !endDate)
        return 'Ingresa una fecha válida entre ' + startDate + ' y ' + endDate

      const date = moment(val, format, true)
      const start = moment(startDate, format, true)
      const end = moment(endDate, format, true)

      if (!date.isValid() || !start.isValid() || !end.isValid()) {
        return 'Ingresa una fecha válida en el formato YYYY-MM-DD'
      }

      return (
        (date.isSameOrAfter(start) && date.isSameOrBefore(end)) ||
        `La fecha debe estar entre ${startDate} y ${endDate}`
      )
    },

    date_not_before_year_2000: (
      val: string,
      mask: string = 'YYYY-MM',
      msg: string | undefined = undefined
    ) => {
      if (!val || typeof val !== 'string') {
        return 'Este campo es obligatorio'
      }

      const inputDate = moment(val.trim(), mask, true)
      if (!inputDate.isValid()) {
        return `Ingresa una fecha válida en el formato ${mask}`
      }

      const minDate = moment('2000-01', 'YYYY-MM')

      return (
        inputDate.isSameOrAfter(minDate, 'month') ||
        msg ||
        `El período no puede ser menor a ${minDate.format(mask)}`
      )
    },

    date_is_not_weekend: (val: string) => {
      if (!val) return true

      const date = moment(val, 'YYYY-MM-DD', true)
      if (!date.isValid())
        return 'Ingresa una fecha válida en el formato YYYY-MM-DD'

      const dayOfWeek = date.day()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return 'La fecha no debe ser un fin de semana (sábado o domingo)'
      }

      return true
    },
    is_required_equivalence: (
      equivalences: {
        equivalence_1?: string
        equivalence_2?: string
        equivalence_3?: string
      },
      message = 'Al menos una equivalencia es requerida.'
    ) => {
      const { equivalence_1, equivalence_2, equivalence_3 } = equivalences

      if (!equivalence_1 && !equivalence_2 && !equivalence_3) {
        return message
      }
      return true
    },

    length_exactly: (
      val: string | number | null | undefined,
      exact: number
    ) => {
      if (val === null || val === undefined) return true
      const str = String(val)
      return (
        str.length === exact ||
        `Debe tener exactamente ${exact} caracteres, logitud actual ${str.length}`
      )
    },

    not_start_with_zero: (val: string | number | null | undefined) => {
      if (val === null || val === undefined) return true
      const str = String(val)
      return !str.startsWith('0') || 'No debe comenzar con 0'
    },

    no_leading_zeros: (val: string | number | null | undefined) => {
      if (val === null || val === undefined || val === '') return true
      const str = String(val)
      if (str === '0') return true
      return !/^0\d+/.test(str) || 'No se permiten ceros a la izquierda'
    },

    validate_natures_opposite: (
      value1: string | number | null,
      value2: string | number | null,
      fieldName1: string,
      fieldName2: string
    ) => {
      if (value1 === value2) {
        return `${fieldName1} debe ser opuesta a la ${fieldName2}`
      }

      return true
    },
    end_date_after_start_date: (
      endDateStr: string,
      startDateStr: string | null | undefined,
      format: string = 'DD/MM/YYYY',
      initialText: string = 'Fecha de emisión',
      endText: string = 'Fecha de vencimiento'
    ): true | string => {
      if (!startDateStr || !endDateStr) return true

      const startDate = moment(startDateStr, format, true)
      const endDate = moment(endDateStr, format, true)

      if (!startDate.isValid() || !endDate.isValid())
        return 'La fecha no es válida.'

      return endDate.isAfter(startDate)
        ? true
        : `${initialText} debe ser una fecha posterior a ${endText}.`
    },

    hasLeadingOrTrailingSpaces: (input: string): string | true => {
      const regex = /(^\s+)|(\s+$)/
      return regex.test(input)
        ? 'No se permiten espacios al inicio o final.'
        : true
    },
    is_after_or_equal_today: (val: string | null | undefined, msg: string) => {
      if (!val) return true

      const today = moment().startOf('day')
      const selected = moment(val, moment.ISO_8601).startOf('day')

      return selected.isSameOrAfter(today) || msg
    },
    is_after_or_equal_date: (
      val: string | null | undefined,
      minDate: string | null | undefined,
      msg: string
    ) => {
      if (!val || !minDate) return true
      const selected = new Date(val)
      const min = new Date(minDate)
      selected.setHours(0, 0, 0, 0)
      min.setHours(0, 0, 0, 0)
      return selected >= min || msg
    },

    validate_values_not_equal: (
      value1: unknown,
      value2: unknown,
      fieldName1: string,
      fieldName2: string
    ): true | string => {
      if (value1 === value2) {
        return `${fieldName1} no puede ser igual a ${fieldName2}`
      }

      return true
    },

    only_max_1_integer_2_decimals: (val: string) => {
      const regex = /^(\d{0,1})(\.\d{1,2})?$/
      return (
        regex.test(val) ||
        'Debe tener como máximo 1 entero y hasta 2 decimales, usando punto (.) como separador.'
      )
    },

    not_less_or_equal_to_zero: (val: string) => {
      const numberValue = parseFloat(val)
      return (
        (!isNaN(numberValue) && numberValue > 0) ||
        'El valor no puede ser menor o igual a 0'
      )
    },

    has_maximum_n_decimals: (val: string, n: number) => {
      const regex = new RegExp(`^-?(0|[1-9]\\d*)(\\.\\d{1,${n}})?$`)
      return regex.test(val) || `El valor puede tener hasta ${n} decimales`
    },

    validate_not_same: (
      value1: unknown,
      value2: unknown,
      message: string = 'Los valores no pueden ser iguales'
    ) => {
      return value1 !== value2 || message
    },

    max_letter: (val: string, letter: string = 'z', msg?: string) => {
      if (!val) return true
      const lowerVal = val.toLowerCase()
      const lowerLetter = letter.toLowerCase()
      if (lowerVal <= lowerLetter) {
        return true
      }
      return msg ?? `La letra no puede ser mayor a ${letter.toUpperCase()}`
    },
    not_greater_than: (
      referencedValue: string | number,
      comparedValue: string | number,
      message = 'El valor comparado no puede ser mayor que el valor de referencia'
    ) => {
      const referenced = Number(referencedValue)
      const compared = Number(comparedValue)

      if (isNaN(referenced) || isNaN(compared))
        return 'Los valores comparados no son valores númericos'

      return referenced < compared || message
    },
    not_less_than: (
      referencedValue: string | number,
      comparedValue: string | number,
      message = 'El valor comparado no puede ser menor que el valor de referencia'
    ) => {
      const referenced = Number(referencedValue)
      const compared = Number(comparedValue)

      if (isNaN(referenced) || isNaN(compared))
        return 'Los valores comparados no son valores numéricos'

      if (compared < referenced) return message

      return true
    },

    max_value_field: (val: string | number, value: number, max: string) => {
      const parsedVal = parseFloat(String(val).replace(/[^\d.-]/g, ''))
      const parsedValue = parseFloat(String(value).replace(/[^\d.-]/g, ''))
      return parsedVal <= parsedValue || `El valor no puede ser mayor a ${max}`
    },

    is_business_day: (val: string) => {
      if (!val) return true

      const date = moment(val, 'YYYY-MM-DD', true)
      if (!date.isValid()) {
        return 'Ingresa una fecha válida en el formato YYYY-MM-DD'
      }

      const dayOfWeek = date.day()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return 'La fecha corresponde a un día no hábil (sábado o domingo)'
      }

      return true
    },
    not_exist_in_array: (
      val: string | number,
      array: Array<string | number>,
      message = 'El valor ya existe en la lista'
    ) => {
      return array.filter((item) => item === val).length <= 1 || message
    },

    validate_number_days: (
      val: string | number | null | undefined,
      operationType: string,
      operationDate: string
    ): true | string => {
      if (operationType !== 'Operacion Contado') return true

      const num = Number(val ?? 0)

      if (!val) {
        return 'El número de días es obligatorio'
      }

      if (isNaN(num)) {
        return 'El número de días debe ser numérico'
      }

      if (num < 1) {
        return 'El número de días no puede ser menor a 1'
      }

      if (num > 5) {
        return 'El número de días no puede ser mayor a 5'
      }

      const complianceDate = moment(operationDate, 'YYYY-MM-DD')
        .add(num, 'days')
        .format('YYYY-MM-DD')

      const weekendValidation = useRules().date_is_not_weekend(complianceDate)
      if (weekendValidation !== true) {
        return 'El vencimiento cae en día no hábil'
      }

      return true
    },

    validate_date_order: (to: string, from: string, isIndividual: boolean) => {
      if (!from || !to) return true

      if (isIndividual) {
        return Number(to) >= Number(from)
          ? true
          : 'El año hasta no puede ser menor que el año desde'
      }

      const start = moment(from, 'YYYY-MM')
      const end = moment(to, 'YYYY-MM')
      return end.isSameOrAfter(start)
        ? true
        : 'El período hasta no puede ser menor que el período desde'
    },

    validate_future_time: (timeStr: string, selectedDate?: string) => {
      if (!timeStr) return true

      const now = new Date()

      const selected = selectedDate ? new Date(`${selectedDate}T00:00:00`) : now

      const [hours, minutes] = timeStr.split(':').map(Number)
      const selectedMinutes = hours * 60 + minutes

      const isToday =
        formatDate(selected, 'YYYY-MM-DD') === formatDate(now, 'YYYY-MM-DD')

      if (isToday) {
        const currentMinutes = now.getHours() * 60 + now.getMinutes()
        if (selectedMinutes < currentMinutes) {
          return 'No puedes seleccionar una hora pasada.'
        }
      }

      return true
    },

    custom_rule:
      <T>(validator: (val: T) => boolean | Promise<boolean>, message: string) =>
        async (val: T): Promise<true | string> => {
          try {
            const result = await validator(val)
            return result ? true : message
          } catch {
            return message
          }
        },

    only_numbers_and_dots: (val: string | number | null | undefined) => {
      if (val === null || val === undefined || val === '') return true
      const stringValue = String(val)
      return (
        /^[0-9.]*$/.test(stringValue) ||
        'El único carácter especial permitido es el punto'
      )
    },

    is_major_than: (num1: number, num2: number, message: string) => {
      return num1 > num2 ? message : true
    },

    only_business_day: (val: string, country: string) => {
      if (!val) return true

      const hd = new Holidays(country)

      const holidays = hd
        .getHolidays(moment().year())
        .map((holiday) =>
          moment(holiday.date || undefined, 'YYYY-MM-DD hh:mm:ss').format(
            'YYYY-MM-DD'
          )
        )

      const dayOfWeek = moment(val).isoWeekday()
      const isWeekend = dayOfWeek === 6 || dayOfWeek === 7
      const isHoliday = holidays.includes(moment(val).format('YYYY-MM-DD'))

      if (isWeekend) return 'No se permiten fines de semana'
      if (isHoliday) return 'No se permiten festivos'

      return true
    },

    max_currency_value: (val: string | number, max: number) => {
      const numericVal =
        typeof val === 'string'
          ? parseFloat(val.replace(/\./g, '').replace(',', '.'))
          : val

      return numericVal <= max || `No puede ser mayor a ${max}`
    },
    date_less_or_equal: (
      val: string,
      otherDate: string | null | undefined
    ): true | string => {
      const format = 'YYYY-MM-DD'

      if (!val || !otherDate) return true

      const isValid = (d: string) => moment(d, format, true).isValid()

      if (!isValid(val) || !isValid(otherDate)) {
        return `Ingresa una fecha válida en formato ${format}.`
      }

      const date = moment(val, format)
      const other = moment(otherDate, format)

      return (
        date.isSameOrBefore(other, 'day') ||
        `La fecha debe ser menor o igual a la fecha de cierre.`
      )
    },

    // Valida que el valor tenga una de las longitudes especificadas
    length_include: (
      val: string | number | null | undefined,
      lengths: number[],
      message?: string
    ) => {
      if (val === null || val === undefined) return true
      const str = String(val)
      return (
        lengths.includes(str.length) ||
        message ||
        `La longitud debe ser ${lengths.join(', ')} caracteres`
      )
    },
  }
}
