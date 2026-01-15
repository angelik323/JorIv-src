import { setActivePinia, createPinia } from 'pinia'
import { useDailyBalanceV1 } from './dialy-balance-v1'

const mockGet = jest.fn()
const mockCreateObjectURL = jest.fn(() => 'blob:url')
const mockClick = jest.fn()
const mockAppendChild = jest.fn()
const mockRemove = jest.fn()
const mockRevokeObjectURL = jest.fn()

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: mockGet,
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  })),
}))

const mockShowAlert = jest.fn()
const mockShowCatchError = jest.fn().mockReturnValue('Error procesando')

jest.mock('@/composables', () => ({
  useAlert: () => ({ showAlert: mockShowAlert }),
  useShowError: () => ({ showCatchError: mockShowCatchError }),
  __esModule: true,
}))

interface MockBlobOptions {
  type?: string
}

global.Blob = function (content: unknown, options?: MockBlobOptions): Blob {
  return { content, type: options?.type } as unknown as Blob
} as unknown as typeof Blob

describe('useDailyBalanceV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    Object.defineProperty(window, 'URL', {
      writable: true,
      value: {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL,
      },
    })

    document.createElement = jest.fn().mockReturnValue({
      click: mockClick,
      setAttribute: jest.fn(),
      remove: mockRemove,
      href: '',
    })

    document.body.appendChild = mockAppendChild
  })

  const mockData = {
    success: true,
    message: 'Operación exitosa',
    data: [{ id: 1, account: 'Caja' }],
  }

  it('_getDailyBalance - success', async () => {
    mockGet.mockResolvedValueOnce({ data: mockData })

    const store = useDailyBalanceV1()
    const params = { 'filter[business_trust_id]': 1 }

    const result = await store._getDailyBalance(params)

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/account-general-balance/generate?')
    )
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Operación exitosa',
      'success',
      undefined,
      3000
    )
    expect(result).toEqual(mockData.data)
  })

  it('_getDailyBalance - error en response', async () => {
    mockGet.mockResolvedValueOnce({
      data: { success: false, message: 'Error de API' },
    })

    const store = useDailyBalanceV1()
    const result = await store._getDailyBalance({})

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error de API',
      'error',
      undefined,
      3000
    )
    expect(result).toBeNull()
  })

  it('_getDailyBalance - exception', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'))

    const store = useDailyBalanceV1()
    const result = await store._getDailyBalance({})

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error procesando',
      'error',
      undefined,
      3000
    )
    expect(result).toBeNull()
  })

  it('downloadPeriodicBalanceExcel - sin archivo generado', () => {
    const store = useDailyBalanceV1()
    store.periodicBalanceExcelBlob = null
    store.isExcelReady = false

    store.downloadPeriodicBalanceExcel()

    expect(mockShowAlert).toHaveBeenCalledWith(
      'No hay archivo Excel generado aún',
      'error'
    )
  })

  it('downloadPeriodicBalancePdf - sin archivo generado', () => {
    const store = useDailyBalanceV1()
    store.periodicBalancePdfBlob = null
    store.isPdfReady = false

    store.downloadPeriodicBalancePdf()

    expect(mockShowAlert).toHaveBeenCalledWith(
      'No hay archivo PDF generado aún',
      'error'
    )
  })
})
