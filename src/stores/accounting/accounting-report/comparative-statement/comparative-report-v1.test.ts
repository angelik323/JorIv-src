import { setActivePinia, createPinia } from 'pinia'
import { useComparativeReportV1 } from './comparative-report-v1'

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
  content: any
  type?: string
}

global.Blob = function (content: any, options?: MockBlobOptions): MockBlob {
  return { content, type: options?.type }
} as any

describe('useComparativeReportV1', () => {
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

  it('_getComparativeStatementBalance - success', async () => {
    mockGet.mockResolvedValueOnce({ data: mockData })

    const store = useComparativeReportV1()
    const params = { 'filter[business_trust_id]': 1 }

    const result = await store._getComparativeStatementBalance(params)

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(
        'comparative-financial-statement-report/generate?'
      )
    )
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Operación exitosa',
      'success',
      undefined,
      3000
    )
    expect(result).toEqual(mockData.data)
  })

  it('_getComparativeStatementBalance - error en response', async () => {
    mockGet.mockResolvedValueOnce({
      data: { success: false, message: 'Error de API' },
    })

    const store = useComparativeReportV1()
    const result = await store._getComparativeStatementBalance({})

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error de API',
      'error',
      undefined,
      3000
    )
    expect(result).toBeNull()
  })

  it('_getComparativeStatementBalance - exception', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'))

    const store = useComparativeReportV1()
    const result = await store._getComparativeStatementBalance({})

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
    const store = useComparativeReportV1()
    store.report_pdf_url = ''
    store.isPdfReady = false

    store.downloadPeriodicBalancePdf()

    expect(mockShowAlert).toHaveBeenCalledWith(
      'No hay archivo PDF generado aún',
      'error'
    )
  })
})
