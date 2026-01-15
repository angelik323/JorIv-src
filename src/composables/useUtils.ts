import {
  FullNameParams,
  IFormatCurrencyOptions,
  IFormatPercentageOptions,
  IPhysicalExam,
  IPhysicalExamKeys,
  ISelectorResources,
  IFieldFilters,
  IGenericResource,
} from '@/interfaces/customs'
import { storeToRefs } from 'pinia'
import { useResourceStore } from '@/stores'
import { useAlert } from '@/composables'
import moment from 'moment'
import { AxiosResponse } from 'axios'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IResource } from '@/interfaces/global'
import { Ref, watch } from 'vue'
import { hollyDays } from '@/utils'
import Holidays from 'date-holidays'

export const useUtils = () => {
  const { showAlert } = useAlert()

  // Calcula el dígito de verificación para un NIT
  const calculateCheckDigit = (nit: number | string): number => {
    const pesos = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]
    const digitsReversed = nit.toString().split('').reverse().map(Number)
    if (digitsReversed.length > pesos.length)
      throw new Error('El NIT supera la longitud permitida.')
    const suma = digitsReversed.reduce(
      (acc, digit, idx) => acc + digit * pesos[idx],
      0
    )
    const modulo = suma % 11
    return modulo < 2 ? modulo : 11 - modulo
  }

  // Formatea un nombre completo a partir de los parámetros dados
  const formatFullName = ({
    firstName,
    middleName,
    lastName,
    secondLastName,
  }: FullNameParams): string | null => {
    const isValidString = (val: unknown): val is string =>
      typeof val === 'string' && val.trim() !== ''
    const nameParts = [
      isValidString(firstName) ? firstName.trim() : null,
      isValidString(middleName) ? middleName.trim() : null,
      isValidString(lastName) ? lastName.trim() : null,
      isValidString(secondLastName) ? secondLastName.trim() : null,
    ].filter(Boolean) as string[]
    return nameParts.length > 0 ? nameParts.join(' ') : null
  }

  // Verifica si el identificador corresponde a un país específico
  const isCountry = (
    identifier: string | number | null | undefined,
    countryName: string
  ): boolean => {
    const { countries } = storeToRefs(useResourceStore('v1'))

    if (!countries?.value || !identifier || !countryName) return false

    const normalizedIdentifier = String(identifier).trim().toLowerCase()
    const normalizedName = countryName.trim().toLowerCase()
    const country = countries.value.find(
      ({ label }) => label?.toLowerCase() === normalizedName
    )
    if (!country) return false

    const { value, label } = country

    return [String(value), label?.toLowerCase()].some(
      (val) => val === normalizedIdentifier
    )
  }

  // Formatea un valor numérico o string como moneda
  const formatCurrencyString = (
    value: string | number | null | undefined,
    options: IFormatCurrencyOptions = {}
  ): string | null => {
    if (value === null || value === undefined) return null

    const {
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
      showCurrencySymbol = true,
    } = options
    const strValue = String(value)
      .replace(/[^0-9.,-]/g, '')
      .replace(',', '.')
    if (!/^-?\d+(\.\d+)?$/.test(strValue)) return null

    const [integerPart, rawDecimalPart = ''] = strValue.split('.')
    let decimalPart = rawDecimalPart
    decimalPart = decimalPart.slice(0, maximumFractionDigits)

    while (decimalPart.length < minimumFractionDigits) {
      decimalPart += '0'
    }

    const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    let result = decimalPart.length
      ? `${withThousands},${decimalPart}`
      : withThousands

    if (showCurrencySymbol) result = `$ ${result}`

    return result
  }

  //Formatea un valor numérico o string como una cadena numerica asegurando siempre un dato por defecto: 0,00
  const getFormatNumber = (val: string | number | null): string => {
    if (val === null || val === undefined) return '0,00'
    const numValue = typeof val === 'string' ? Number(val) : val
    if (isNaN(numValue)) return '0,00'
    return numValue.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    })
  }

  //Formatea un valor numérico o string como una cadena numerica con una determinada cantidad de decimales sin redondear la cifra
  const truncateDecimals = (
    val: number | string,
    decimal_places: number = 2
  ): string => {
    const factor = Math.pow(10, decimal_places)
    const numValue = Math.trunc(Number(val) * factor) / factor

    return numValue.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimal_places,
      useGrouping: true,
    })
  }

  // Limpia una cadena para que solo contenga números y un punto decimal válido
  const sanitizeNumericInput = (val: string): number | undefined => {
    let clean = val
      .replace(/[^0-9.]/g, '') // permite solo números y punto
      .replace(/^\.*/, '') // elimina puntos al inicio
      .replace(/(\..*)\./g, '$1') // evita múltiples puntos

    if (clean.startsWith('.')) clean = '0' + clean

    return clean ? parseFloat(clean) : undefined
  }

  // Formatea la fecha con la mascara recibida
  const formatDate = (
    dateString: string,
    mask: string,
    from_format: string | undefined = undefined
  ): string => {
    return moment(dateString || undefined, from_format).format(mask)
  }

  //formatea un periodo que llega asi 202509 y lo convierte en 2025-09 para mostrarlo bien.
  const formatPeriod = (period?: string) => {
    if (!period || period.length !== 6) return period ?? ''
    return `${period.slice(0, 4)}-${period.slice(4)}`
  }

  // Extrae el nombre del archivo
  const getNameBlob = (response: AxiosResponse<Blob>): string => {
    const contentDisposition = response.headers['content-disposition']
    let fileName = 'archivo' // nombre por defecto
    if (contentDisposition) {
      const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;\n]+)/i)
      if (utf8Match?.[1]) {
        fileName = decodeURIComponent(utf8Match[1])
        return fileName
      }

      const regularMatch = contentDisposition.match(
        /filename[^;=\n]*=(["']?)(.+?)\1(?:;|$)/i
      )
      if (regularMatch && regularMatch[2]) {
        fileName = regularMatch[2].trim()

        fileName = fileName.replace(/^["']|["']$/g, '')

        try {
          fileName = decodeURIComponent(fileName)
        } catch {
          showAlert(
            'Error al procesar el nombre del archivo descargado',
            'error',
            undefined,
            1000
          )
        }
      }
    }

    return fileName
  }

  // Descarga un archivo Blob como .xlsx
  const downloadBlobXlxx = (blob: Blob, fileName: string) => {
    const downloadLink = document.createElement('a')
    const fileUrl = URL.createObjectURL(blob)
    downloadLink.href = fileUrl
    downloadLink.setAttribute('download', fileName)
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(fileUrl)
  }

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // Fallback si no viene nombre o falta extensión
  const fileNameValidate = (fileName: string, defaultName: string) => {
    if (!fileName || fileName === 'data') {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')

      fileName = `${defaultName}_${year}-${month}-${day}.xlsx`
      return fileName
    } else if (!fileName.endsWith('.xlsx')) {
      fileName += '.xlsx'
      return fileName
    } else {
      return fileName
    }
  }

  // Crea y descarga un archivo Blob a partir de un ArrayBuffer
  const createAndDownloadBlobByArrayBuffer = (
    stream: ArrayBuffer,
    fileName: string
  ) => {
    const blob = new Blob([stream], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    downloadBlobXlxx(blob, fileName)
  }

  // Descarga un archivo desde una URL
  const downloadFile = async (
    url?: string | null,
    name: string | null = null,
    message: string | null = null,
    returnFile: boolean = false
  ): Promise<Blob | File | null> => {
    let fileProccessed: File | null = null
    if (!url || url == 'Sin definir') {
      showAlert(
        message ?? 'No hay archivo para descargar',
        'error',
        undefined,
        1000
      )

      return null
    }
    await fetch(url)
      .then((res) => res.blob())
      .then((file) => {
        fileProccessed = new File(
          [file],
          name ?? url.split('/').pop() ?? 'archivo',
          { type: file.type }
        )
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
    return fileProccessed
  }

  // Obtiene un Blob desde una URL
  const getBlobFromUrl = async (blobUrl: string): Promise<Blob> => {
    const response = await fetch(blobUrl)
    return await response.blob()
  }

  const getFileFromS3 = async (
    url: string,
    fileName: string = 'downloaded-file'
  ): Promise<File | null> => {
    const response = await fetch(url)
    if (!response.ok) return null

    const blob = await response.blob()
    return new File([blob], fileName, { type: blob.type })
  }

  // Determina el tipo de archivo de un Blob
  const isBlobImageOrDocument = async (
    blobUrl: string
  ): Promise<{
    type: string
    size: string | number
    name?: string | null
  } | null> => {
    try {
      const blob = await getBlobFromUrl(blobUrl)
      if (blob.type.startsWith('image/'))
        return { type: 'image', size: blob.size }
      if (blob.type === 'application/pdf')
        return { type: 'pdf', size: blob.size }
      if (
        blob.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
        return { type: 'word', size: blob.size }
      if (
        blob.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
        return { type: 'xlsx', size: blob.size }
      if (blob.type === 'text/plain' || blob.type === 'text/csv')
        return { type: 'txt', size: blob.size }
      return { type: 'unknown', size: blob.size }
    } catch {
      return null
    }
  }

  // Genera una contraseña aleatoria segura
  const generatePassword = (): string => {
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

  // Diccionario de iconos Lucide por defecto
  const defaultIconsLucide: Record<string, string> = {
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
    chevronLeft: 'ChevronLeft',
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
    chartLine: 'ChartLine',
    sliders: 'SlidersHorizontal',
    rows2: 'Rows2',
    book: 'Book',
    moreVertical: 'MoreVertical',
    send: 'Send',
    image: 'Image',
    fileWithList: 'FileText',
    sendHorizontal: 'SendHorizontal',
    arrowRight: 'ArrowRight',
    listCheck: 'ListCheck',
    arrowDownToLine: 'ArrowDownToLine',
    circleX: 'CircleX',
    equal: 'Equal',
    circleCheckBig: 'CircleCheckBig',
    circleOff: 'CircleOff',
    filter: 'Filter',
    briefcase: 'Briefcase',
    folder: 'Folder',
    flame: 'Flame',
    snowflake: 'Snowflake',
    banks: 'Coins',
    cog: 'Settings',
    filePenLine: 'FilePenLine',
    scale: 'Scale',
    rotateCcw: 'RotateCcw',
    copyPlus: 'CopyPlus',
    stickyNote: 'StickyNote',
    calculator: 'Calculator',
    notebookText: 'NotebookText',
    bookOpen: 'BookOpen',
    receiptText: 'ReceiptText',
    qrCode: 'QrCode',
    stretchHorizontal: 'StretchHorizontal',
  }

  // Copia texto al portapapeles
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
  }

  // Formatea un objeto a query string, omitiendo valores vacíos, 0 o null
  const formatParamsCustom = (obj: object) => {
    return Object.entries(obj)
      .filter(([_, value]) => value !== null && value !== 0 && value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
  }

  // Genera un arreglo de números aleatorios seguros
  const secureRandom = (length: number, quantity: number) => {
    const randomValuesArray = Array.from({ length: quantity })
    for (let i = 0; i < quantity; i++) {
      const values = new Uint32Array(length)
      crypto.getRandomValues(values)
      randomValuesArray[i] = values[0] % 10
    }
    return randomValuesArray
  }

  // Genera un número aleatorio de la cantidad indicada de dígitos
  const generateRandomNumber = (amount: number) =>
    secureRandom(1, amount).join('').toString()

  // Valida la entrada de dígitos en un input, con opciones para caracteres adicionales, longitud máxima y decimales
  const checkDigit = (
    event: KeyboardEvent,
    allowAdditionalChars?: string | null,
    maxLength?: number,
    decimalLimit?: boolean
  ) => {
    const target = event.target as HTMLInputElement
    const allowedCharsRegex = allowAdditionalChars
      ? new RegExp(`^[0-9${allowAdditionalChars}]$`)
      : /^[0-9]$/
    if (allowAdditionalChars === null) event.preventDefault()
    if (maxLength && target.value.length >= maxLength) {
      if (!['Backspace', 'Tab'].includes(event.key)) event.preventDefault()
    }
    if (event.key.length === 1 && !allowedCharsRegex.test(event.key))
      event.preventDefault()
    if (decimalLimit && event.key === '.') {
      const inputValue = target.value
      if (inputValue.includes('.') || inputValue.length === 0)
        event.preventDefault()
    }
    if (decimalLimit && target.value.includes('.')) {
      const parts = target.value.split('.')
      if (parts.length === 2 && parts[1].length >= 1 && event.key.length === 1)
        event.preventDefault()
    }
  }

  // Verifica si todos los valores de un objeto son 0, vacío o null
  const isEmptyOrZero = <T extends Record<string, unknown>>(
    obj: T
  ): boolean => {
    return Object.values(obj).every(
      (value) =>
        value === 0 ||
        value === '' ||
        value === null ||
        value === undefined ||
        value === '0'
    )
  }

  const isEmptyOrZeroOrFalse = <T extends Record<string, unknown>>(
    obj: T
  ): boolean => {
    return Object.values(obj).every(
      (value) =>
        value === 0 ||
        value === '' ||
        value === null ||
        value === false ||
        value === undefined
    )
  }

  const isEmptyObject = <T extends object>(obj: Partial<T>): boolean => {
    return Object.values(obj).every(
      (v) => v === null || v === undefined || v === '' || v === 0
    )
  }

  // Verifica si todas las descripciones de un examen físico están vacías o null
  const isEmptyOrZeroTemplate = (
    obj: Record<IPhysicalExamKeys, IPhysicalExam>
  ): boolean => {
    return Object.values(obj).every(
      (value) => value.description === '' || value.description === null
    )
  }

  // Convierte una URL a un archivo File
  const urlToFile = async (
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
        Object.defineProperty(file, '__key', {
          value: __key,
          writable: true,
          configurable: true,
          enumerable: false,
        })
      }

      return file
    } catch {
      return undefined
    }
  }

  // Convierte una cadena base64 a un archivo File
  const base64ToFile = (base64: string, filename: string): File => {
    const [metadata, base64Data] = base64.split(',')
    const mimeType = (metadata.match(/:(.*?);/) as RegExpMatchArray)[1]
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf']
    if (!allowedMimeTypes.includes(mimeType))
      throw new Error('Tipo MIME no permitido')
    const binaryString = atob(base64Data)
    const len = binaryString.length
    const uint8Array = new Uint8Array(len)
    for (let i = 0; i < len; i++) uint8Array[i] = binaryString.charCodeAt(i)
    return new File([uint8Array], filename, { type: mimeType })
  }

  // Convierte un objeto File a una URL temporal
  const handleFileObjectToUrlConversion = (file: File) =>
    URL.createObjectURL(file)

  // Convierte una cadena base64 a un archivo File, retornando null si falla
  const handleBase64ToFileConversion = (url: string) => {
    const base64Input = url.trim()
    try {
      const filename = 'file'
      return base64ToFile(base64Input, filename)
    } catch {
      return null
    }
  }

  // Retorna el ID numérico más alto de una lista de objetos con propiedad 'id'
  const getMaxId = <T>(items: T[], key: string = 'id'): number =>
    items.reduce((max, item) => {
      const value = item[key as keyof T]
      const id =
        typeof value === 'number' || typeof value === 'string'
          ? Number(value)
          : NaN
      return !isNaN(id) ? Math.max(max, id) : max
    }, 0)

  // Limpia la cadena de $ en la moneda dejando valor numerico
  const cleanCurrencyToNumber = (value: string | number): number => {
    if (typeof value === 'number') return value
    if (!value) return 0

    const cleaned = value
      .toString()
      .trim()
      .replace(/[^0-9,.-]/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.')

    const num = Number(cleaned)
    return isNaN(num) ? 0 : num
  }

  // Retorna una fecha en formato 'YYYY/MM' sumando años desde hoy
  const getFutureDateByYears = (years: number): string => {
    return moment().add(years, 'year').format('YYYY/MM')
  }

  const capitalize = (text: string) => {
    if (!text) return ''
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  // Devuelve el label de una opción dado un array de opciones y un valor
  const getOptionLabel = <
    T extends { value?: string | number; id?: string | number; label?: string }
  >(
    options: T[] | undefined,
    value: string | number
  ): string | number => {
    if (!options || !Array.isArray(options)) return value

    const found = options.find(
      (opt) => opt.value === value || opt.id === value || opt.label === value
    )

    return found ? found.label ?? found.value ?? found.id ?? value : value
  }

  // Elimina las propiedades con valores null, undefined, '' y opcionalmente 0
  const cleanEmptyFields = (obj: object, allowZero = false) =>
    Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => {
        if (v === null || v === undefined || v === '') return false
        if (Array.isArray(v) && v.length === 0) return false
        if (!allowZero && v === 0) return false
        return true
      })
    )

  const saveTextFileWithFallback = async (
    content: string,
    filename: string
  ): Promise<void> => {
    if ('showSaveFilePicker' in window) {
      const savePicker = window.showSaveFilePicker as (options: {
        suggestedName?: string
        types?: Array<{
          description?: string
          accept: Record<string, string[]>
        }>
        excludeAcceptAllOption?: boolean
      }) => Promise<FileSystemFileHandle>

      try {
        const handle = await savePicker({
          suggestedName: filename,
          types: [
            {
              description: filename.replace('.txt', ''),
              accept: { 'text/plain': ['.txt'] },
            },
          ],
        })

        const writable = await handle.createWritable()
        await writable.write(content)
        await writable.close()

        showAlert(
          'Archivo guardado exitosamente.',
          'success',
          undefined,
          TIMEOUT_ALERT
        )
      } catch {
        showAlert(
          `Error al guardar el archivo`,
          'error',
          undefined,
          TIMEOUT_ALERT
        )
      }
    } else {
      showAlert(
        'Tu navegador no soporta la opción "Guardar como...". El archivo se descargará automáticamente.',
        'warning',
        undefined,
        TIMEOUT_ALERT
      )

      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()

      setTimeout(() => window.URL.revokeObjectURL(url), 100)
    }
  }

  // Verifica si un valor es vacio
  const isEmpty = (val: unknown): boolean => {
    return val === '' || val === 0 || val === null || val === undefined
  }

  const getLabel = <
    T extends ISelectorResources | IResource | IGenericResource
  >(
    id: number | string | null,
    source: T[],
    key: keyof T = 'value',
    labelKey: keyof T = 'label'
  ) =>
    id
      ? source.find((item: T) => item[key] === id)?.[labelKey] ??
        'No registrado'
      : ''

  // Formatea un porcentaje
  const formatPercentageString = (
    value: string | number | null | undefined,
    options: IFormatPercentageOptions = {}
  ): string | null => {
    if (value === null || value === undefined) return null

    const {
      locale = 'es-CO',
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
      includeSymbol = true,
    } = options

    let numericValue: number

    if (typeof value === 'number') {
      numericValue = value
    } else if (typeof value === 'string') {
      const clean = value.replace(/[^0-9.,-]/g, '').replace(',', '.')
      numericValue = parseFloat(clean)
      if (isNaN(numericValue)) return null
    } else {
      return null
    }

    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(numericValue)

    return includeSymbol ? `${formatted}%` : formatted
  }

  const lastDateOfMonth = (date: Date): string => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const lastDay = new Date(year, month, 0).getDate()
    return `${year}-${String(month).padStart(2, '0')}-${lastDay}`
  }
  /**
   * Watchea el valor de una propiedad de un objeto y actualiza otra propiedad
   * con la descripción correspondiente de un array de opciones.
   *
   * @param formData El objeto que contiene la propiedad a watchear y la propiedad
   * a actualizar.
   * @param selectOptions El objeto que contiene las opciones.
   * @param sourceKey La clave de la propiedad a watchear.
   * @param optionsKey La clave del array de opciones.
   * @param descriptionKey La clave de la propiedad a actualizar.
   */
  const watchAndUpdateDescription = <
    TForm extends Record<string, unknown>,
    TOptions extends Record<
      string,
      { value: string | number; description?: string }[]
    >,
    SourceKey extends keyof TForm,
    DescriptionKey extends keyof TForm,
    OptionsKey extends keyof TOptions
  >(
    formData: Ref<TForm>,
    selectOptions: Ref<TOptions>,
    sourceKey: SourceKey,
    optionsKey: OptionsKey,
    descriptionKey: DescriptionKey
  ): void => {
    watch(
      () => formData.value[sourceKey],
      (id) => {
        const options = selectOptions.value[optionsKey]
        const found = options.find((item) => String(item.value) === String(id))
        if (typeof formData.value[descriptionKey] === 'string') {
          formData.value[descriptionKey] = (found?.description ||
            '-') as TForm[DescriptionKey]
        }
      }
    )
  }

  const roundN = (n: number, d: number) => {
    const f = Math.pow(10, d)
    return Math.round(n * f) / f
  }

  const round2 = (n: number) => roundN(n, 2)
  const round6 = (n: number) => roundN(n, 6)

  const toNumber = (v: unknown, fallback = 0): number => {
    if (typeof v === 'number') return Number.isFinite(v) ? v : fallback
    if (typeof v === 'string') {
      const n = cleanCurrencyToNumber(v)
      return Number.isFinite(n) ? n : fallback
    }
    return fallback
  }

  // Convierte un valor a número o devuelve null si no es válido
  const toNumberOrNull = (value: unknown): number | null => {
    const num = Number(value)
    return isNaN(num) ? null : num
  }

  const formatCurrency = (
    value: string | number,
    currency = 'COP',
    locale = 'es-CO'
  ) => {
    const num = Number(value) || 0
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(num)
  }

  const clearFilters = (filters: IFieldFilters[]) => {
    return filters.forEach((f) => (f.value = null))
  }

  const toggleFilterVisibility = (
    filters: IFieldFilters[],
    from: number,
    to: number,
    visible: boolean
  ) => {
    return filters.slice(from, to).forEach((f) => (f.hide = visible))
  }

  const styleColumn = (width: number = 200) => ({
    'white-space': 'nowrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-x': 'hidden',
    'text-overflow': 'ellipsis',
  })

  const styleColumnV2 = (
    width: number = 200,
    extra_styles: string[] = []
  ): string => {
    const styles = [
      'white-space: nowrap',
      `min-width: ${width}px`,
      `max-width: ${width}px`,
      'overflow-x: hidden',
      'text-overflow: ellipsis',
    ]
    styles.push(...extra_styles)
    return styles
      .map((style) => (style.trim().endsWith(';') ? style : `${style};`))
      .join(' ')
  }

  // Solo admite punto como separador decimal
  const cleanCurrencyDotOnly = (value: string | number): number => {
    if (typeof value === 'number') return value
    if (!value) return 0

    const raw = value.toString().trim()

    if (raw.includes(',')) return NaN

    const num = Number(raw)
    return isNaN(num) ? 0 : num
  }

  const calculateComplianceDates = (
    operationDate: string,
    days: number
  ): { compliance_date: string; colocation_resources_date: string } | null => {
    if (!operationDate || days == null) return null

    const holidays = getHolidaysByYear(moment().year(), 'CO')

    const isBusinessDay = (date: string): boolean => {
      const dayOfWeek = moment(date).isoWeekday()
      const isWeekend = dayOfWeek === 6 || dayOfWeek === 7
      const isHoliday = holidays.includes(moment(date).format('YYYY-MM-DD'))
      return !isWeekend && !isHoliday
    }

    const complianceDate = moment(operationDate).add(days, 'days')

    while (!isBusinessDay(complianceDate.format('YYYY-MM-DD'))) {
      complianceDate.add(1, 'days')
    }

    const colocationDate = complianceDate.clone().subtract(1, 'days')

    while (!isBusinessDay(colocationDate.format('YYYY-MM-DD'))) {
      colocationDate.subtract(1, 'days')
    }

    return {
      compliance_date: complianceDate.format('YYYY-MM-DD'),
      colocation_resources_date: colocationDate.format('YYYY-MM-DD'),
    }
  }

  const formatAuditDate = (raw: unknown, keepExistingDate = false): string => {
    if (!raw) return '-'
    const rawStr = String(raw).trim()
    const date = new Date(rawStr)
    const isValid = !isNaN(date.getTime())

    const two = (n: number) => String(n).padStart(2, '0')
    const dd = isValid ? two(date.getDate()) : ''
    const mm = isValid ? two(date.getMonth() + 1) : ''
    const yyyy = isValid ? String(date.getFullYear()) : ''
    const HH = isValid ? two(date.getHours()) : ''

    if (keepExistingDate) {
      const m = rawStr.match(/^(\d{2}\/\d{2}\/\d{4})(?:\s+.*)?$/)
      if (m && isValid) {
        return `${m[1]} ${HH}`
      }
    }

    if (isValid) return `${dd}/${mm}/${yyyy} ${HH}`

    return rawStr
  }

  const isArrayBuffer = (value: unknown): value is ArrayBuffer => {
    return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer
  }

  //Descarga un archivo en base al formato que se le indique por props
  const downloadGenericFile = (
    data: Blob,
    filename: string,
    format: 'csv' | 'xls' | 'xlsx' | 'txt' | 'prn' | 'gpg',
    options?: {
      delimiter?: string
      encoding?: string
      headers?: string[]
    }
  ) => {
    try {
      // Usar solo const, no let
      const formatConfig = {
        csv: { mimeType: 'text/csv', extension: 'csv' },
        xls: { mimeType: 'application/vnd.ms-excel', extension: 'xls' },
        xlsx: {
          mimeType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          extension: 'xlsx',
        },
        txt: { mimeType: 'text/plain', extension: 'txt' },
        prn: { mimeType: 'text/plain', extension: 'prn' },
        gpg: { mimeType: 'application/octet-stream', extension: 'gpg' },
      } as const

      const config = formatConfig[format]
      if (!config) {
        throw new Error(`Formato no soportado: ${format}`)
      }

      const mimeType = config.mimeType
      const fileExtension = config.extension

      let blob: Blob

      if (data instanceof Blob) {
        blob = data
      } else {
        switch (format) {
          case 'csv':
            blob = createCSVBlob(
              data,
              options?.delimiter || ',',
              options?.headers
            )
            break

          case 'txt':
          case 'prn':
            blob = createTextBlob(data, options?.delimiter || '\t')
            break

          case 'xls':
          case 'xlsx':
            const csvContent = createCSVContent(data, ',', options?.headers)
            blob = new Blob([csvContent], { type: mimeType })
            break

          case 'gpg':
            if (typeof data === 'string') {
              blob = new Blob([data], { type: mimeType })
            } else if (isArrayBuffer(data)) {
              blob = new Blob([data], { type: mimeType })
            } else {
              throw new Error(
                'Para formato GPG, los datos deben ser string o ArrayBuffer'
              )
            }
            break

          default:
            throw new Error(`Formato no implementado: ${format}`)
        }
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}.${fileExtension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      showAlert(
        `Archivo ${filename}.${fileExtension} descargado exitosamente`,
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    } catch {
      showAlert(`Error al descargar archivo`, 'error', undefined, TIMEOUT_ALERT)
    }
  }

  const createCSVBlob = <T extends Record<string, unknown>>(
    data: T[],
    delimiter: string = ',',
    headers?: string[]
  ): Blob => {
    const csvContent = createCSVContent(data, delimiter, headers)
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  }

  const createCSVContent = <T extends Record<string, unknown>>(
    data: T[],
    delimiter: string = ',',
    headers?: string[]
  ): string => {
    if (!Array.isArray(data) || data.length === 0) {
      return ''
    }

    let csvContent = ''

    if (headers && headers.length > 0) {
      csvContent += headers.join(delimiter) + '\n'
    } else if (typeof data[0] === 'object' && data[0] !== null) {
      csvContent += Object.keys(data[0]).join(delimiter) + '\n'
    }

    // Agregar filas
    data.forEach((row) => {
      if (typeof row === 'object' && row !== null) {
        const values = Object.values(row).map((value) => {
          const stringValue = String(value || '')
          if (
            stringValue.includes(delimiter) ||
            stringValue.includes('"') ||
            stringValue.includes('\n')
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        csvContent += values.join(delimiter) + '\n'
      } else {
        csvContent += String(row) + '\n'
      }
    })

    return csvContent
  }

  const createTextBlob = (data: Blob, delimiter: string = '\t'): Blob => {
    let textContent = ''

    if (Array.isArray(data)) {
      textContent = createCSVContent(data, delimiter)
    } else if (typeof data === 'string') {
      textContent = data
    } else {
      textContent = JSON.stringify(data, null, 2)
    }

    return new Blob([textContent], { type: 'text/plain;charset=utf-8;' })
  }

  // Permite solo días hábiles (lunes a viernes), que no sean festivos en Colombia y que sean hoy o en el pasado
  const optionsMaxCalendar = (date: string | null) => {
    if (!date) return false

    const today = new Date()
    const current = new Date(date)

    const isPastOrToday = current <= today

    const day = current.getDay()
    const isWeekday = day !== 0 && day !== 6

    const colombiaHolidays2025 = hollyDays

    const dateISO = current.toISOString().split('T')[0]
    const isHoliday = colombiaHolidays2025.includes(dateISO)

    return isPastOrToday && isWeekday && !isHoliday
  }

  // Permite cualquier día hasta hoy, sin importar si es fin de semana o festivo
  const isDateUpToToday = (date: string | null) => {
    if (!date) return false

    const today = new Date()
    const current = new Date(date)

    // Solo verifica que la fecha no sea futura
    return current <= today
  }

  const toSafeNumber = (val: unknown, fallback = 0): number => {
    const num = Number(val)
    return Number.isFinite(num) ? num : fallback
  }

  const getHolidaysByYear = (
    year: number,
    country: string = 'CO'
  ): string[] => {
    const hd = new Holidays(country)
    const holidays = hd.getHolidays(year)
    return holidays.map((holiday) =>
      formatDate(holiday.date, 'YYYY-MM-DD', 'YYYY-MM-DD hh:mm:ss')
    )
  }

  const isDateAllowed = (
    dateStr: string,
    holidays: string[],
    allowFuture = false
  ): boolean => {
    const today = new Date()
    const date = new Date(dateStr)

    if (allowFuture) {
      if (date < new Date(today.toDateString())) return false
    } else {
      if (date > new Date(today.toDateString())) return false
    }

    const day = date.getDay()
    if (day === 0 || day === 6) return false

    if (
      holidays.includes(
        useUtils().formatDate(dateStr, 'YYYY-MM-DD', 'YYYY/MM/DD')
      )
    )
      return false

    return true
  }

  const decodeHtmlEntities = (str?: string | null): string => {
    if (!str) return ''
    const ta = document.createElement('textarea')
    ta.innerHTML = str
    return ta.value
  }

  const htmlToPlain = (str?: string | null): string => {
    if (!str) return ''
    let s = str

    s = s.replace(/^\uFEFF/, '')
    s = s.replace(/<<([^<>]+)>>/g, '§§$1§§')
    s = s.replace(/\{([A-Z0-9_]+)\}/g, '§§$1§§')
    s = s.replace(/<\?xml[^>]*\?>/gi, '')
    s = s
      .replace(/<br\s*\/?>/gi, '\n') // <br> -> \n
      .replace(/<\/p\s*>/gi, '\n\n') // </p> -> \n\n
      .replace(/<p[^>]*>/gi, '') // <p> -> ''

    s = s.replace(/<table[\s\S]*?<\/table>/gi, '')
    // oxlint-disable-next-line no-useless-escape
    s = s.replace(/<\/?[a-zA-Z][\w:\-]*(\s[^>]*)?>/g, '')
    s = decodeHtmlEntities(s)
    s = s.replace(/§§([^§]+)§§/g, '<<$1>>')
    s = s
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    s = s
      .replace(/\s*>+\s*<<\s*/g, ' <<')
      .replace(/^\s*>\s*$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    return s
  }

  /**
   * Asigna valores al formulario según el elemento seleccionado en una lista.
   */
  const selectItemByID = <
    T extends { value: string | number },
    F extends Record<string, unknown>
  >(
    options: T[],
    selectedId: string | number,
    formData: { value: F },
    fieldMap: Partial<Record<keyof F, keyof T | 'value'>>
  ): void => {
    const selected = options.find((item) => item.value === selectedId)
    if (!selected) return

    Object.entries(fieldMap).forEach(([formKey, optionKey]) => {
      if (!optionKey) return

      const key =
        optionKey === 'value' ? selectedId : selected[optionKey as keyof T]
      formData.value[formKey as keyof F] = (key ?? null) as F[keyof F]
    })
  }

  const removeObjectKeys = <T extends Record<string, unknown>>(
    obj: T,
    keysToRemove: string[]
  ): Partial<T> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
    ) as Partial<T>
  }

  const formatUnits = (value: number | string): string => {
    if (value === null || value === undefined || value === '') return '0'

    const numberValue = Number(value)
    if (isNaN(numberValue)) return '0'

    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue)
  }

  // Formatea a un valor string de unidades sin redondear
  const formatUnitsString = (
    value: string | number | null | undefined,
    options: {
      minimumFractionDigits?: number
      maximumFractionDigits?: number
      decimalSeparator?: string
    } = {}
  ): string | null => {
    if (value === null || value === undefined) return null

    const {
      minimumFractionDigits = 0,
      maximumFractionDigits = 6,
      decimalSeparator = ',',
    } = options

    const strValue = String(value)
      .replaceAll(/[^0-9.,-]/g, '')
      .replace(',', '.')

    if (!/^-?\d+(\.\d+)?$/.test(strValue)) return null

    const isNegative = strValue.startsWith('-')
    const absValue = isNegative ? strValue.slice(1) : strValue

    const [integerPart, rawDecimalPart = ''] = absValue.split('.')
    let decimalPart = rawDecimalPart.slice(0, maximumFractionDigits)

    while (decimalPart.length < minimumFractionDigits) {
      decimalPart += '0'
    }

    const formatted = decimalPart.length
      ? `${integerPart}${decimalSeparator}${decimalPart}`
      : integerPart

    return isNegative ? `-${formatted}` : formatted
  }

  // Formatea un valor numérico o string como una cadena numerica
  const cleanValue = (value: string | number | null | undefined): number => {
    if (value === null || value === undefined || value === '') return 0

    const cleaned = String(value).replace(/[^\d.-]/g, '')
    const numberValue = Number(cleaned)

    return isNaN(numberValue) ? 0 : numberValue
  }

  /**
   * Formatea los filtros para que puedan ser enviados como parámetros en una URL. ej: filter[filters]=value
   */
  const formatFiltersToParamsCustom = (
    $filters: Record<string, string | undefined>
  ) => {
    return Object.entries($filters).reduce((acc, [key, value]) => {
      if (value) {
        acc[`filter[${key}]`] = value
      }
      return acc
    }, {} as Record<string, string>)
  }

  const getDateValidationRange =
    (minYear: number = 1900, maxYear: number = 2099) =>
    (value: string) => {
      if (!value) return true

      const year = parseInt(value.substring(0, 4))
      if (isNaN(year)) return false
      if (year < minYear || year > maxYear) {
        return false
      }

      return true
    }

  const getCurrentDateFormatted = (mask: string = 'YYYY-MM-DD'): string => {
    return moment().format(mask)
  }

  const sanitizeHtml = (
    htmlContent: string = '',
    tagsToRemove: string[] = [
      'script',
      'style',
      'iframe',
      'noscript',
      'video',
      'audio',
      'link',
      'object',
      'embed',
      'form',
      'input',
      'button',
      'svg',
      'canvas',
      'meta',
      'base',
      'link',
    ]
  ): string => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    tagsToRemove.forEach((tag) => {
      const elements = doc.querySelectorAll(tag)
      elements.forEach((el) => el.remove())
    })

    const sanitizedContent = doc.body?.innerHTML || ''
    return sanitizedContent
  }
  const getDateWithSumedDays = (
    startDate: string,
    daysToAdd: number,
    format: string = 'YYYY-MM-DD'
  ): string => {
    return moment(startDate).add(daysToAdd, 'days').format(format)
  }

  // Resta días a una fecha y retorna el resultado en el formato especificado
  const subtractDaysFromDate = (
    startDate: string,
    daysToSubtract: number,
    format: string = 'YYYY-MM-DD'
  ): string => {
    return moment(startDate).subtract(daysToSubtract, 'days').format(format)
  }

  // Suma días a una fecha y retorna el resultado en formato YYYY-MM-DD, dateStr en formato string (YYYY-MM-DD)
  const addDaysToDate = (dateStr: string, days: number = 1): string => {
    const date = new Date(dateStr)
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

  const normalizeThousands = (v: string | number | null): number => {
    if (v === null || v === undefined || v === '') return 0

    const raw = String(v).trim()

    if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(raw)) {
      const withoutThousands = raw.replace(/,/g, '')
      return Number(withoutThousands) || 0
    }

    const num = Number(raw)
    return Number.isFinite(num) ? num : 0
  }

  const formatCodeName = (code?: string | number, name?: string) =>
    `${code ?? ''} - ${name ?? ''}`.trim()

  const boolToValue = (
    value: boolean | undefined,
    format: 'number' | 'text' = 'number'
  ) => {
    if (format === 'text') {
      return value ? 'Si' : 'No'
    }

    return value ? 1 : 0
  }

  const getFileExtension = (fileName: string): string => {
    const parts = fileName.split('.')
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
  }

  const isFileTooLarge = (sizeMB: number, maxSizeMB: number): boolean => {
    return sizeMB > maxSizeMB
  }

  const isFileTypeAllowed = (
    fileName: string,
    allowedTypes: string[]
  ): boolean => {
    const extension = getFileExtension(fileName)
    return allowedTypes.includes(extension)
  }

  const isStartDateBeforeEndDate = (
    startDateStr: string,
    endDateStr: string,
    msg?: string
  ): boolean => {
    const dateFormat = ['YYYY-MM-DD']
    const startDate = moment(startDateStr, dateFormat)
    const endDate = moment(endDateStr, dateFormat)

    if (!startDate.isValid() || !endDate.isValid()) {
      showAlert('Las fechas ingresadas no tiene un formato válido', 'error')
      return false
    }

    if (startDate.isAfter(endDate)) {
      showAlert(
        msg ?? 'La fecha final debe ser mayor o igual a la fecha inicial',
        'error'
      )
      return false
    }

    return true
  }

  /**
   * Normaliza texto para búsquedas y comparaciones insensibles a mayúsculas, acentos y caracteres especiales
   * @param value - Texto a normalizar (string, null o undefined)
   * @returns Texto normalizado en minúsculas sin acentos ni caracteres especiales
   */
  const normalizeText = (value: string | null | undefined): string => {
    if (value === null || value === undefined) return ''

    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (acentos, diéresis, etc.)
      .replace(/[^\w\s]/g, '') // Elimina caracteres especiales excepto espacios
      .replace(/\s+/g, ' ') // Convierte múltiples espacios en uno solo
      .trim()
      .toLowerCase()
  }

  const cleanAddress = (address?: string): string => {
    return address
      ? address
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      : ''
  }

  // Devuelve todos los utilitarios
  return {
    cleanAddress,
    isEmpty,
    capitalize,
    calculateCheckDigit,
    formatFullName,
    isCountry,
    formatCurrencyString,
    formatDate,
    createAndDownloadBlobByArrayBuffer,
    downloadBlobXlxx,
    fileNameValidate,
    downloadFile,
    isBlobImageOrDocument,
    getFileFromS3,
    generatePassword,
    defaultIconsLucide,
    copyToClipboard,
    formatPeriod,
    formatParamsCustom,
    secureRandom,
    generateRandomNumber,
    checkDigit,
    isEmptyOrZero,
    isEmptyOrZeroOrFalse,
    isEmptyOrZeroTemplate,
    urlToFile,
    base64ToFile,
    handleFileObjectToUrlConversion,
    handleBase64ToFileConversion,
    getBlobFromUrl,
    getNameBlob,
    getMaxId,
    getFutureDateByYears,
    getFormatNumber,
    truncateDecimals,
    sanitizeNumericInput,
    cleanCurrencyToNumber,
    getOptionLabel,
    cleanEmptyFields,
    saveTextFileWithFallback,
    getLabel,
    formatPercentageString,
    watchAndUpdateDescription,
    lastDateOfMonth,
    roundN,
    formatCurrency,
    round2,
    round6,
    toNumber,
    toNumberOrNull,
    clearFilters,
    toggleFilterVisibility,
    styleColumn,
    styleColumnV2,
    cleanCurrencyDotOnly,
    downloadBlob,
    calculateComplianceDates,
    toSafeNumber,
    formatAuditDate,
    downloadGenericFile,
    optionsMaxCalendar,
    getHolidaysByYear,
    isDateAllowed,
    htmlToPlain,
    selectItemByID,
    removeObjectKeys,
    formatUnits,
    formatUnitsString,
    isEmptyObject,
    cleanValue,
    formatFiltersToParamsCustom,
    getDateValidationRange,
    getCurrentDateFormatted,
    getDateWithSumedDays,
    subtractDaysFromDate,
    isDateUpToToday,
    sanitizeHtml,
    addDaysToDate,
    normalizeThousands,
    formatCodeName,
    boolToValue,
    getFileExtension,
    isFileTooLarge,
    isFileTypeAllowed,
    isStartDateBeforeEndDate,
    normalizeText,
  }
}
