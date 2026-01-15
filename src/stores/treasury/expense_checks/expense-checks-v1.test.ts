jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

// Mock global de File para entorno Node
if (typeof global.File === 'undefined') {
  global.File = class MockFile {
    name: string
    type: string
    size: number
    lastModified: number

    constructor(
      parts: BlobPart[],
      filename: string,
      options?: FilePropertyBag
    ) {
      this.name = filename
      this.type = options?.type || ''
      this.size = parts.reduce((acc, part) => {
        if (typeof part === 'string') return acc + part.length
        if (part instanceof ArrayBuffer) return acc + part.byteLength
        if (ArrayBuffer.isView(part)) return acc + part.byteLength
        if (part instanceof Blob) return acc + part.size
        return acc
      }, 0)
      this.lastModified = options?.lastModified ?? Date.now()
    }
  } as unknown as typeof File
}

// Mock de los composables con funciones mockeadas
const mockShowAlert = jest.fn()
const mockShowCatchError = jest.fn().mockReturnValue('Error simulado')
const mockGetNameBlob = jest.fn().mockReturnValue('cheques.zip')
const mockDownloadBlob = jest.fn()
const mockFormatCurrency = jest.fn().mockImplementation((value) => `$${value}`)

jest.mock('@/composables', () => ({
  useShowError: () => ({ showCatchError: mockShowCatchError }),
  useAlert: () => ({ showAlert: mockShowAlert }),
  useUtils: () => ({
    getNameBlob: mockGetNameBlob,
    downloadBlobXlxx: mockDownloadBlob,
    formatCurrency: mockFormatCurrency,
  }),
}))

import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

describe('useExpenseChecksStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    mockShowAlert.mockClear()
    mockShowCatchError.mockClear()
    mockGetNameBlob.mockClear()
    mockDownloadBlob.mockClear()
    mockFormatCurrency.mockClear()
  })

  it('inicializa con estado por defecto', () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    expect(store.version).toBe('v1')
    expect(store.expenseChecksList).toEqual([])
    expect(store.check_info).toBeNull()
    expect(store.expense_checks_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('resetea lista de cheques correctamente', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    store.expenseChecksList = [{ id: 1, officeName: 'Test' }]
    await store._resetExpenseChecksList()

    expect(store.expenseChecksList).toEqual([])
  })

  it('carga lista de cheques con datos completos', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockResponse = {
      data: {
        data: {
          data: [
            {
              id: 1,
              office: { name: 'Central Office' },
              business: { business_code: 'ABC123', name: 'Negocio ABC' },
              bank_account: { account_number: '123456789' },
              created_at: '2025-07-18',
              consecutive: '001',
            },
          ],
          current_page: 1,
          last_page: 5,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._loadExpenseChecksList('page=1', 1)

    expect(store.expenseChecksList).toHaveLength(1)
    expect(store.expenseChecksList[0]).toEqual({
      id: 1,
      officeName: 'Central Office',
      business: 'ABC123',
      businessName: 'Negocio ABC',
      accountNumber: '123456789',
      registerDate: '2025-07-18',
      checks: 'Cheque 001',
    })
    expect(store.expense_checks_pages).toEqual({
      currentPage: 1,
      lastPage: 5,
    })
  })

  it('carga lista vacía cuando no hay datos', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: { data: { data: null, current_page: 1, last_page: 1 } },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._loadExpenseChecksList('page=1', 2)

    expect(store.expenseChecksList).toEqual([])
    expect(store.expense_checks_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('maneja error al cargar lista y limpia estado', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockError = new Error('API failed')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._loadExpenseChecksList('page=1', 1)

    expect(store.expenseChecksList).toEqual([])
    expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
    expect(mockShowAlert).toHaveBeenCalledWith('Error simulado', 'error')
  })

  it('carga información completa de cheque por ID', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockResponse = {
      data: {
        data: {
          id: 123,
          beneficiary: { document: '12345678', name: 'Juan Pérez' },
          value: '1500000',
          valueLetters: 'Un millón quinientos mil pesos',
          date: '2024-01-15',
          message: 'Pago servicios',
          consecutive: '1234',
        },
        message: 'Información cargada exitosamente',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._loadInfoCheckById(123)

    expect(store.check_info).toHaveLength(6)
    expect(store.check_info[0]).toEqual({ title: '#', description: '1234' })
    expect(store.check_info[1]).toEqual({
      title: 'Beneficiario',
      description: '12345678 - Juan Pérez',
    })
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Información cargada exitosamente',
      'success'
    )
  })

  it('maneja cheque sin mensaje', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockResponse = {
      data: {
        data: {
          id: 456,
          beneficiary: { document: '87654321', name: 'María García' },
          value: '2000000',
          valueLetters: 'Dos millones',
          date: '2024-02-01',
          message: null,
        },
        message: 'Datos obtenidos',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._loadInfoCheckById(456)

    expect(store.check_info[5]).toEqual({
      title: 'Mensaje',
      description: 'No hay mensaje',
    })
  })

  it('maneja error al cargar información de cheque y limpia estado', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockError = new Error('Cheque no encontrado')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._loadInfoCheckById(999)

    expect(store.check_info).toEqual([])
    expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
    expect(mockShowAlert).toHaveBeenCalledWith('Error simulado', 'error')
  })

  it('genera archivo PDF válido exitosamente', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockBlob = new Blob(['contenido pdf'], { type: 'application/pdf' })
    const mockGet = jest.fn().mockResolvedValue({ data: mockBlob })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._loadPrintCheckPDF(1, 123)

    expect(result).toBeInstanceOf(File)
    expect(result.name).toBe('check-123.pdf')
    expect(result.type).toBe('application/pdf')
  })

  it('rechaza archivo que no es PDF', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockBlob = new Blob(['html content'], { type: 'text/html' })
    const mockGet = jest.fn().mockResolvedValue({ data: mockBlob })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._loadPrintCheckPDF(2, 456)

    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'El archivo descargado no es un PDF válido',
      'error'
    )
  })

  it('maneja error al generar PDF', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockError = new Error('Error al generar PDF')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._loadPrintCheckPDF(1, 789)

    expect(result).toBeNull()
    expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
    expect(mockShowAlert).toHaveBeenCalledWith('Error simulado', 'error')
  })

  it('descarga múltiples cheques exitosamente', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockBlobData = new ArrayBuffer(1024)
    const mockResponse = { data: mockBlobData }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._loadPrintChecks(1, [10, 20, 30])

    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('?typeCheck=1'),
      { checks: [10, 20, 30] },
      { responseType: 'blob' }
    )
    expect(mockGetNameBlob).toHaveBeenCalledWith(mockResponse)
    expect(mockDownloadBlob).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Cheques descargados correctamente',
      'success'
    )
  })

  it('maneja error en descarga múltiple', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockError = new Error('Error en servidor')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._loadPrintChecks(1, [1, 2, 3])

    expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
    expect(mockShowAlert).toHaveBeenCalledWith('Error simulado', 'error')
    expect(mockDownloadBlob).not.toHaveBeenCalled()
  })

  it('usa valores por defecto en descarga múltiple', async () => {
    const { useExpenseChecksStoreV1 } = require('./expense-checks-v1')
    const store = useExpenseChecksStoreV1()

    const mockBlobData = new ArrayBuffer(512)
    const mockResponse = { data: mockBlobData }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._loadPrintChecks(2)

    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('?typeCheck=2'),
      { checks: [] },
      { responseType: 'blob' }
    )
  })
})
