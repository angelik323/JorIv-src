/*eslint-disable*/

import {
  IPhysicalExam,
  IPhysicalExamKeys,
  IChipsConfig,
  IChipsResult,
} from '@/interfaces/customs'
import moment from 'moment'
import { computed, Ref } from 'vue'
import { useAlert } from '@/composables'

import { ICalendarAgendaItem } from '@/interfaces/customs/agenda/CalendarEvents'

const dateFormat = 'YYYY-MM-DD'
const currentDate = moment()
const { showAlert } = useAlert()
const base64ToFile = (base64: string, filename: string): File => {
  const [metadata, base64Data] = base64.split(',')
  const mimeType = (metadata.match(/:(.*?);/) as RegExpMatchArray)[1]
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf']
  if (!allowedMimeTypes.includes(mimeType)) {
    throw new Error('Tipo MIME no permitido')
  }
  const binaryString = atob(base64Data)
  const len = binaryString.length
  const uint8Array = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    uint8Array[i] = binaryString.charCodeAt(i)
  }
  return new File([uint8Array], filename, { type: mimeType })
}

export const handleFileObjectToUrlConversion = (file: File) => {
  return file ? URL.createObjectURL(file) : ''
}

export const handleBase64ToFileConversion = (url: string) => {
  const base64Input = url.trim()
  try {
    const filename = 'file'
    return base64ToFile(base64Input, filename)
  } catch (error) {
    return null
  }
}

export const replaceDevWithAccounting = (url?: string): string => {
  if (!url) return ''
  return url.replace('/dev', '/accounting')
}

export const returnArrayRulesValidation = (
  required: boolean | null,
  max: number | any | null,
  type: string | string[] | null
): any => {
  const sanitizedValue: any = null
  let arrayRules: [] | any = []
  let typeRegex
  let typeRegexTwo = null
  let typeRegexThree = null
  const regexMaxTwoNumbersbeforeDash = /-\d{2,}$/

  switch (type) {
    case 'nit':
      typeRegex = (val: string) => /^[0-9-]+$/.test(val) || 'Formato invalido'
      typeRegexTwo = (val: string) =>
        /^(\d+(-\d{1,})?)$/.test(val) ||
        'Formato invalido, ingrese el número de verificación'
      typeRegexThree = (val: string) =>
        !regexMaxTwoNumbersbeforeDash.test(val) || 'Formato invalido'
      break

    case 'accounting_account':
      typeRegex = (val: string) =>
        /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(val) || 'Formato invalido'
      break

    case 'numbers':
      typeRegex = (val: string) =>
        /^\d+$/.test(val) || 'El campo solo debe contener números'
      break

    case 'letters':
      typeRegex = (val: string) =>
        /^[a-zA-ZáéíóúÝÉÝÓÚñÑ\s]+$/.test(val) ||
        'El campo solo debe contener letras'
      break

    case 'lettersNumbersDash':
      typeRegex = (val: string) =>
        /^-?[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(val) || 'Formato invalido'
      break

    case 'voidLettersNumbersDash':
      typeRegex = (val: string) =>
        /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)?$/.test(val) || 'Formato invalido'
      break

    case 'lettersNumbers':
      typeRegex = (val: string) =>
        /^[a-zA-Z0-9]+$/.test(val) ||
        'El campo solo debe contener caracteres alfanuméricos'
      break

    case 'lettersNumbersSpacesAccent':
      typeRegex = (val: string) =>
        /^[a-zA-Z0-9áéíóúÝÉÝÓÚñÑ\s]+$/.test(val) ||
        'El campo solo debe contener caracteres alfanuméricos'
      break

    case 'lettersNumbersCharactersSpecials':
      typeRegex = (val: string) =>
        /^[a-zA-Z0-9áéíóúÝÉÝÓÚñÑ\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]*$/.test(
          val
        ) || 'Formato invalido'
      break

    case 'lettersCharactersSpecials':
      typeRegex = (val: string) =>
        /^[a-zA-ZáéíóúÝÉÝÓÚñÑ\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]*$/.test(
          val
        ) || 'Formato invalido'
      break

    case 'voidLettersNumbers':
      typeRegex = (val: string) =>
        /^([a-zA-Z0-9]*)?$/.test(val) ||
        'El campo solo debe contener caracteres alfanuméricos'
      break

    case 'currentMinorStartDate':
      typeRegex = (val: string) =>
        moment(val, dateFormat).isSameOrBefore(currentDate, 'days') ||
        'El campo Fecha inicial debe ser menor o igual a la fecha actual'
      break
  }

  arrayRules = [
    required ? (val: string) => !!val || 'Valor requerido' : null,
    max
      ? sanitizedValue
        ? sanitizedValue.length < max ||
          `El campo debe tener un máximo de ${max} caracteres`
        : (val: string) =>
            new RegExp(`^.{0,${max}}$`).test(val) ||
            `El campo debe tener un máximo de ${max} caracteres`
      : null,
    typeRegex == null ? null : typeRegex,
    typeRegexTwo == null ? null : typeRegexTwo,
    typeRegexThree == null ? null : typeRegexThree,
  ]

  return arrayRules
}

export const urlToFile = async (
  url: string,
  filename: string,
  mimeType: string,
  __key?: number | string
): Promise<File | undefined> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const file = new File([blob], filename, { type: mimeType })

    if (__key !== undefined) {
      ;(file as any).__key = __key
    }

    return file
  } catch (error) {
    return undefined
  }
}

const secureRandom = (length: number, quantity: number) => {
  const randomValuesArray = new Array(quantity)

  for (let i = 0; i < quantity; i++) {
    const values = new Uint32Array(length)
    crypto.getRandomValues(values)
    randomValuesArray[i] = values[0] % 10 // Para obtener un número entre 0 y 9
  }

  return randomValuesArray
}

export const generateRandomNumber = (amount: number) =>
  secureRandom(1, amount).join('').toString()

export const checkDigit = (
  event: KeyboardEvent,
  allowAdditionalChars?: string | null,
  maxLength?: number,
  decimalLimit?: boolean // Nuevo parámetro
) => {
  const target = event.target as HTMLInputElement // Afirmar que el target es un HTMLInputElement
  const allowedCharsRegex = allowAdditionalChars
    ? new RegExp(`^[0-9${allowAdditionalChars}]$`)
    : /^[0-9]$/

  if (allowAdditionalChars === null) {
    event.preventDefault()
  }

  if (maxLength && target.value.length >= maxLength) {
    if (!['Backspace', 'Tab'].includes(event.key)) {
      event.preventDefault()
    }
  }

  if (event.key.length === 1 && !allowedCharsRegex.test(event.key)) {
    event.preventDefault()
  }

  // Nueva validación para el punto decimal
  if (decimalLimit && event.key === '.') {
    const inputValue = target.value

    // Asegurarse de que solo se permite un punto
    if (inputValue.includes('.')) {
      event.preventDefault()
      return
    }

    // Asegurarse de que hay al menos un carácter antes del punto
    if (inputValue.length === 0) {
      event.preventDefault()
      return
    }
  }

  // Validación de caracteres después del punto
  if (decimalLimit && target.value.includes('.')) {
    const parts = target.value.split('.')
    if (parts.length === 2) {
      // Validar que no haya más de 1 carácter después del punto
      if (parts[1].length >= 1 && event.key.length === 1) {
        event.preventDefault()
      }
    }
  }
}
export const escapeHMTL = (unsafe: any) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const validateCondition = (
  condition: boolean,
  errorMessage: string
): boolean => {
  if (!condition) {
    showAlert(errorMessage, 'error', undefined, 1000)
    return false
  }
  return true
}

export const isEmptyOrZero = (obj: Record<string, any>): boolean => {
  return Object.values(obj).every(
    (value) => value === 0 || value === '' || value === null
  )
}

export const isEmptyOrZeroTemplate = (
  obj: Record<IPhysicalExamKeys, IPhysicalExam>
): boolean => {
  return Object.values(obj).every(
    (value) => value.description === '' || value.description === null
  )
}

export const arrayBufferToXlsx = async (
  arrayBuffer: any,
  nameFile?: string,
  nameDate?: any
) => {
  const excelBlob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  // Create a download link
  const downloadLink = document.createElement('a')
  const url = URL.createObjectURL(excelBlob)
  downloadLink.href = url
  downloadLink.download = nameFile
    ? `${nameFile}_${nameDate}.xlsx`
    : `converted-file.xlsx` // File name for the download
  await downloadFile(downloadLink.href, downloadLink.download)
}

export const createAndDownloadBlobByArrayBuffer = (
  stream: any,
  fileName: string,
  date?: Date,
  withTime?: boolean
) => {
  const blob = new Blob([stream], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  downloadBlobXlsx(blob, fileName, date ?? undefined, withTime)
}

export const downloadBlobXlsx = (
  blob: Blob,
  fileName: string,
  date?: Date,
  withTime?: boolean
) => {
  const downloadLink = document.createElement('a')
  const fileUrl = URL.createObjectURL(blob)

  const baseDate = date ?? new Date()
  const format = withTime ? 'YYYY-MM-DD_hh-mm_a' : 'YYYY-MM-DD'
  const formattedDate = moment(baseDate).format(format)

  downloadLink.href = fileUrl
  downloadLink.setAttribute('download', `${fileName}_${formattedDate}.xlsx`)
  document.body.appendChild(downloadLink)
  downloadLink.click()
  downloadLink.remove()

  URL.revokeObjectURL(fileUrl)
}

export const downloadFile = async (
  url?: string | null,
  name: string | null = null,
  message: string | null = null,
  returnFile: boolean = false
) => {
  let fileProccessed: Blob | null = null
  if (!url || url == 'Sin definir') {
    return message
      ? showAlert(message, 'error', undefined, 1000)
      : showAlert('No hay archivo para descargar', 'error', undefined, 1000)
  }

  await fetch(url)
    .then((res) => res.blob())
    .then((file) => {
      fileProccessed = file
      if (!returnFile) {
        const tempUrl = URL.createObjectURL(file)
        const aTag = document.createElement('a')
        aTag.href = tempUrl
        aTag.download = name ?? (url.split('/').pop() as string)
        document.body.appendChild(aTag)
        aTag.click()
        URL.revokeObjectURL(tempUrl)
        aTag.remove()
      }
    })
    .catch(() => {
      fileProccessed = null
      showAlert('La descarga ha fallado', 'error', undefined, 1000)
    })

  if (returnFile) {
    return fileProccessed
  }
}

export const downloadZipFile = (blob: Blob, fileName: string) => {
  const downloadLink = document.createElement('a')
  const fileUrl = URL.createObjectURL(blob)

  downloadLink.href = fileUrl
  downloadLink.setAttribute('download', fileName)
  document.body.appendChild(downloadLink)
  downloadLink.click()

  // Limpiar
  downloadLink.remove()
  URL.revokeObjectURL(fileUrl)
}

// Función para convertir Proxy a File
export const proxyToFile = (proxyObj: any): File => {
  // Extraemos el nombre, tipo y contenido del Proxy
  const { name, type, content } = proxyObj

  // Convertimos el contenido a Blob si es necesario (en este caso, texto)
  const blob = new Blob([content], { type })

  // Creamos un archivo usando el constructor de File
  const file = new File([blob], name, { type })

  return file
}

const getBlobFromUrl = async (blobUrl: string): Promise<Blob> => {
  const response = await fetch(blobUrl)
  return await response.blob()
}

export const isBlobImageOrDocument = async (
  blobUrl: string
): Promise<{
  type: string
  size: string | number
  name?: string | null
} | null> => {
  try {
    const blob = await getBlobFromUrl(blobUrl)

    if (blob.type.startsWith('image/')) {
      return { type: 'image', size: blob.size }
    } else if (blob.type === 'application/pdf') {
      return { type: 'pdf', size: blob.size }
    } else if (
      blob.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return { type: 'word', size: blob.size }
    } else if (
      blob.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return { type: 'xlsx', size: blob.size }
    } else if (blob.type === 'text/plain' || blob.type === 'text/csv') {
      return { type: 'txt', size: blob.size }
    } else {
      return { type: 'unknown', size: blob.size }
    }
  } catch (error) {
    return null
  }
}

export const generatePassword = (): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?'
  const allChars = lowercase + uppercase + numbers + specialChars

  let password = ''

  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += specialChars[Math.floor(Math.random() * specialChars.length)]

  const remainingLength =
    Math.floor(Math.random() * (20 - 9 + 1)) + 9 - password.length

  for (let i = 0; i < remainingLength; i++) {
    const nextChar = allChars[Math.floor(Math.random() * allChars.length)]
    password += nextChar
  }

  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')

  return password
}

export const transformDate = (
  date: string,
  period?: boolean,
  periodDay?: boolean
) => {
  if (!date) return ''
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  if (period) {
    return `${month}-${year}`
  }
  if (periodDay) {
    return `${day}`
  }
  return `${year}-${month}-${day}`
}

export const getMonthsDifferenceForDepreciation = (
  entryDate: string | undefined
): number => {
  if (entryDate) {
    const [year, month, day] = entryDate.split('-').map(Number)
    const entry = new Date(Date.UTC(year, month - 1, day))

    const now = new Date()
    const nowUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    )

    // Se resta el añ actual con el año que llega:
    let yearsDiff = now.getFullYear() - entry.getFullYear()
    let entryMonths = entry.getUTCMonth()

    const nowMonth = nowUTC.getUTCMonth()

    const days = String(entry.getDate()).padStart(2, '0')
    const entryDays = Number(days) + 1

    // Validación resto de meses:
    if (entryDays === 30 && entryMonths !== 2) {
      entryMonths += 1
    }
    // Validación febrero:
    if (entryMonths === 2 && entryDays === 28) {
      entryMonths += 1
    }

    // Diferencia de los meses:
    let monthsDiff = nowMonth - entryMonths

    if (monthsDiff < 0) {
      yearsDiff -= 1
      monthsDiff += 12
    }

    // Cantidad de meses totales:
    const qtaMonths = yearsDiff * 12 + monthsDiff

    return qtaMonths
  } else return 0
}

// ? Tener en cuenta que la función retorna un STRING, y es simplemente visual, no para realizar calculos.
export const numberToMoneyFormat = (
  value: number,
  maxDecimals?: number,
  minDecimals?: number
): string => {
  const formatedValue = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: minDecimals ?? 2,
    maximumFractionDigits: maxDecimals ?? 2,
    useGrouping: true,
  }).format(value)
  return formatedValue
}

export const removeNumberToMoneyFormat = (value: string): string | null => {
  return parseInt(value.split(',')[0]?.replace(/\D/g, '')).toString() ?? null
}

export const defaultIcons = {
  eye: 'mdi-eye',
  eyeOff: 'mdi-eye-off',
  eyeFile: 'mdi-file-eye',
  edit: 'mdi-pencil',
  pause: 'mdi-pause',
  play: 'mdi-play',
  plus: 'mdi-plus',
  plusCircle: 'mdi-plus-circle-outline',
  lockReset: 'mdi-lock-reset',
  lock: 'mdi-lock',
  trash: 'mdi-trash-can',
  close: 'mdi-close',
  checkCircle: 'mdi-check-circle',
  closeCircle: 'mdi-close-circle',
  reload: 'mdi-reload',
  magnify: 'mdi-magnify',
  calendar: 'mdi-calendar',
  heartOff: 'mdi-heart-off',
  download: 'mdi-download',
  excel: 'mdi-microsoft-excel',
  back: 'mdi-chevron-left',
  next: 'mdi-chevron-right',
  accountMultiple: 'mdi-account-multiple',
  accountCheck: 'mdi-account-check',
  accountOff: 'mdi-account-off',
  account: 'mdi-account',
  lockOpen: 'mdi-lock-open-variant',
  listBulleted: 'mdi-format-list-bulleted',
  key: 'mdi-key',
  accountFile: 'mdi-file-account',
  bulletList: 'mdi-format-list-bulleted',
  admin: 'mdi-laptop-account',
  bank: 'mdi-bank',
  info: 'mdi-information-outline',
  information: 'mdi-information',
  cached: 'mdi-cached',
  fileOutline: 'mdi-file-outline',
  listView: 'mdi-view-list',
  delete: 'mdi-delete',
  copy: 'mdi-content-copy',
  autorenew: 'mdi-autorenew',
  history: 'mdi-history',
  minus: 'mdi-minus',
  startArrow: 'mdi-ray-start-arrow',
  carEmergency: 'mdi-car-emergency',
  pdf: 'mdi-file-pdf-box',
  link: 'mdi-link-variant',
  paperClip: 'mdi-paperclip',
  cursorDefault: 'mdi-cursor-default-click',
  injury: 'mdi-account-injury',
  clipboardPlay: 'mdi-clipboard-play-outline',
  factory: 'mdi-factory',
  location: 'mdi-map-marker-outline',
  phone: 'mdi-phone',
  phoneOutline: 'mdi-phone-outline',
  plusCircleOutline: 'mdi-plus-circle-outline',
  emailOutline: 'mdi-email-outline',
  walletOutline: 'mdi-wallet-outline',
  accountBoxOutline: 'mdi-account-box-outline',
  clockOutline: 'mdi-clock-outline',
  arrowChevron: 'mdi-chevron-right',
}

export const defaultIconsLucide = {
  eye: 'Eye',
  eyeOff: 'EyeOff',
  eyeFile: 'File',
  edit: 'Pencil',
  pause: 'Pause',
  play: 'Play',
  plus: 'Plus',
  plusCircle: 'PlusCircle',
  lockReset: 'KeyRound',
  lock: 'Lock',
  trash: 'Trash2',
  close: 'X',
  checkCircle: 'CheckCircle',
  closeCircle: 'XCircle',
  reload: 'RotateCw',
  rotateCcw: 'RotateCcw',
  magnify: 'Search',
  calendar: 'Calendar',
  heartOff: 'HeartOff',
  download: 'Download',
  excel: 'FileSpreadsheet',
  back: 'ChevronLeft',
  next: 'ChevronRight',
  accountMultiple: 'Users',
  accountCheck: 'UserCheck',
  accountOff: 'UserX',
  account: 'User',
  lockOpen: 'Unlock',
  listBulleted: 'List',
  key: 'Key',
  accountFile: 'FileUser',
  bulletList: 'List',
  admin: 'Monitor',
  bank: 'Banknote',
  info: 'Info',
  information: 'Info',
  cached: 'RefreshCw',
  fileOutline: 'File',
  listView: 'List',
  delete: 'Trash',
  copy: 'Copy',
  autorenew: 'RefreshCcw',
  history: 'History',
  minus: 'Minus',
  startArrow: 'ArrowRightCircle',
  carEmergency: 'Car',
  pdf: 'FileText',
  link: 'Link',
  paperClip: 'Paperclip',
  cursorDefault: 'MousePointerClick',
  injury: 'User',
  clipboardPlay: 'Clipboard',
  factory: 'Factory',
  location: 'MapPin',
  phone: 'Phone',
  phoneOutline: 'Phone',
  plusCircleOutline: 'PlusCircle',
  emailOutline: 'Mail',
  walletOutline: 'Wallet',
  ArrowLeftRight: 'ArrowLeftRight',
  logout: 'LogOut',
  clock: 'Clock',
  cloudUpload: 'CloudUpload',
  chevronRight: 'ChevronRight',
  arrowRightLeft: 'ArrowRightLeft',
  squarePercentage: 'SquarePercent',
  dollarSign: 'DollarSign',
  user: 'User',
  badgeDollarSign: 'BadgeDollarSign',
  piggy: 'PiggyBank',
  file: 'FilePlus2',
  corporative: 'SquareUser',
  representative: 'BookUser',
  bankNote: 'Banknote',
  bell: 'Bell',
  circleOff: 'CircleOff',
  chartLine: 'ChartLine',
  briefcase: 'Briefcase',
  print: 'Printer',
  contrast: 'Contrast',
  accessibility: 'Accessibility',
  book: 'Book',
  circleCheckBig: 'CircleCheckBig',
  equal: 'Equal',
  barcode: 'Barcode',
  highlighter: 'Highlighter',
  arrowRight: 'ArrowRight',
  ellipsisVertical: 'EllipsisVertical',
  filePenLine: 'FilePenLine',
  listCheck: 'ListCheck',
  filter: 'Filter',
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    return
  }
}

export const fullName = computed(() => {
  try {
    const data = JSON.parse(localStorage.getItem('login-auth') || '{}')
    const user = data.loggedUser?.user
    if (!user) return 'Usuario desconocido'

    const parts = [user.name, user.last_name, user.second_last_name].filter(
      (val) => val && val.trim() !== ''
    )

    return parts.join(' ')
  } catch {
    return 'Error al leer el usuario'
  }
})

export const formatParamsCustom = (obj: object) => {
  return Object.entries(obj)
    .filter(([_, value]) => value !== null && value !== 0 && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // Codificar solo los valores
    .join('&') // Unir en formato query string
}

export const getRepeatLabelFromValue = (value: string): string => {
  return (
    {
      none: 'No se repite',
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      yearly: 'Anual',
    }[value] || ''
  )
}

export const formatDateTime = (dateStr: string, timeStr: string): string => {
  const [year, month, day] = dateStr.split('-')
  const [hours, minutes, seconds = '00'] = timeStr.split(':')

  return `${year}-${month.padStart(2, '0')}-${day.padStart(
    2,
    '0'
  )} ${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(
    2,
    '0'
  )}`
}

export const chipsData = <T extends Record<string, any>>(
  data: Ref<T>,
  config: IChipsConfig<T>[],
  maxVisible: number = 6
): IChipsResult<T>[] => {
  const useVisibleItems = <V>(list: V[]) => ({
    visible: computed(() => list.slice(0, maxVisible)),
    hiddenCount: computed(() => Math.max(0, list.length - maxVisible)),
  })

  return config.map(({ key, label, emailMode }) => {
    const items = Array.isArray(data.value[key]) ? data.value[key] : []
    const { visible, hiddenCount } = useVisibleItems(items)
    return {
      key,
      label,
      visible,
      hiddenCount,
      emailMode,
    }
  })
}

export const filtersToParams = (
  filters: Record<string, string | undefined>
) => {
  const params: Record<string, string> = {}

  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return

    const match = key.match(/^filter\[(.+)\]$/)
    if (match) {
      params[match[1]] = value
    }
  })

  return params
}

export const getDayClass = (
  day: { date: any; dateStr: string },
  eventsMap: Record<string, ICalendarAgendaItem>,
  currentMonth?: any
) => {
  const baseClass = 'y-calendar'
  const meta = eventsMap[day.dateStr]

  const classes = [baseClass]

  if (currentMonth) {
    if (day.date.day() === 0) classes.push('is-sunday')
    if (day.date.day() === 6) classes.push('is-saturday')
    if (day.date.month() !== currentMonth.month())
      classes.push('is-outside-month')
  }

  if (!meta) return classes.join(' ')

  if (meta.isHoliday) classes.push('is-holiday')
  else if (meta.isMarkedDay) classes.push('is-marked-day')
  else if (meta.countEvents > 0) classes.push('has-events')

  return classes.join(' ')
}

export const removeObjectKeys = <T extends Record<string, any>>(
  obj: T,
  keysToRemove: string[]
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
  ) as Partial<T>
}

export const truncateText = (
  text: string,
  maxLength: number,
  ellipsis: string = '…'
): string =>
  text?.length > maxLength
    ? `${text.slice(0, maxLength - ellipsis.length)}${ellipsis}`
    : text

export const hollyDays = [
  '2025-01-01',
  '2025-01-06',
  '2025-03-24',
  '2025-04-17',
  '2025-04-18',
  '2025-05-01',
  '2025-06-02',
  '2025-06-23',
  '2025-06-30',
  '2025-07-20',
  '2025-08-07',
  '2025-08-18',
  '2025-10-13',
  '2025-11-03',
  '2025-11-17',
  '2025-12-08',
  '2025-12-25',
]
