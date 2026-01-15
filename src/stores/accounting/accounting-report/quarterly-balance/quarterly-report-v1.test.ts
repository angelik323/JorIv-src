import { setActivePinia, createPinia } from 'pinia'
import { useQuarterlyReportV1 } from './quarterly-report-v1'

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

interface MockBlob {
  content: unknown
  type?: string
}

global.Blob = function (content: unknown, options?: MockBlobOptions): MockBlob {
  return { content, type: options?.type }
} as unknown as typeof Blob

describe('useQuarterlyReportV1', () => {
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
    } as unknown as HTMLAnchorElement) as unknown as typeof document.createElement

    document.body.appendChild =
      mockAppendChild as unknown as typeof document.body.appendChild
  })

  const mockData = {
    success: true,
    message: 'Operación exitosa',
    data: {
      data: [{ id: 1, account: 'Caja' }],
      current_page: 1,
      last_page: 1,
      reportables: {
        report_excel_url: 'https://example.com/report.xlsx',
        report_pdf_url: 'https://example.com/report.pdf',
      },
    },
  }

  it('_getQuarterlyStatementBalance - success', async () => {
    mockGet.mockResolvedValueOnce({ data: mockData })

    const store = useQuarterlyReportV1()
    const params = { 'filter[business_trust_id]': 1 }

    const result = await store._getQuarterlyStatementBalance(params)

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('quarterly-general-balance?')
    )
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Operación exitosa',
      'success',
      undefined,
      3000
    )
    expect(result).toEqual(mockData.data)
  })

  it('_getQuarterlyStatementBalance - error en response', async () => {
    mockGet.mockResolvedValueOnce({
      data: { success: false, message: 'Error de API' },
    })

    const store = useQuarterlyReportV1()
    const result = await store._getQuarterlyStatementBalance({})

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error de API',
      'error',
      undefined,
      3000
    )
    expect(result).toBeNull()
  })

  it('_getQuarterlyStatementBalance - exception', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'))

    const store = useQuarterlyReportV1()
    const result = await store._getQuarterlyStatementBalance({})

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error procesando',
      'error',
      undefined,
      3000
    )
    expect(result).toBeNull()
  })

  it('downloadPeriodicBalancePdf - sin archivo generado', () => {
    const store = useQuarterlyReportV1()
    store.report_pdf_url = ''
    store.isPdfReady = false

    store.downloadPeriodicBalancePdf()

    expect(mockShowAlert).toHaveBeenCalledWith(
      'No hay archivo PDF generado aún',
      'error'
    )
  })
})
