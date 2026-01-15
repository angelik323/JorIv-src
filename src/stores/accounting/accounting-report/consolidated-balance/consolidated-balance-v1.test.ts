import { setActivePinia, createPinia } from 'pinia'
import { useBalanceReportV1 } from './consolidated-balance-v1'

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

class MockBlob {
  readonly size: number
  readonly type: string;
  readonly [Symbol.toStringTag] = 'Blob'

  constructor(parts?: BlobPart[], options?: BlobPropertyBag) {
    this.type = options?.type ?? ''
    this.size = Array.isArray(parts)
      ? parts.reduce<number>((sum, p) => {
          if (typeof p === 'string') return sum + p.length
          if (p instanceof ArrayBuffer) return sum + p.byteLength
          if (ArrayBuffer.isView(p)) return sum + p.byteLength
          if (p && typeof (p as Blob).size === 'number')
            return sum + (p as Blob).size
          return sum
        }, 0)
      : 0
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0))
  }

  slice(_start?: number, _end?: number, _contentType?: string): Blob {
    return this as unknown as Blob
  }

  stream(): ReadableStream<Uint8Array> {
    return {} as ReadableStream<Uint8Array>
  }

  text(): Promise<string> {
    return Promise.resolve('')
  }
}

Object.defineProperty(global, 'Blob', {
  value: MockBlob as unknown as typeof globalThis.Blob,
  writable: true,
})

Object.defineProperty(global, 'Blob', {
  value: MockBlob as unknown as typeof globalThis.Blob,
  writable: true,
})

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

  jest.spyOn(document, 'createElement').mockReturnValue({
    click: mockClick,
    setAttribute: jest.fn(),
    remove: mockRemove,
    href: '',
  } as unknown as HTMLAnchorElement)

  document.body.appendChild = mockAppendChild
})

describe('useBalanceReportV1', () => {
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

  it('_getConsolidatedBalanceBalance - success', async () => {
    mockGet.mockResolvedValueOnce({ data: mockData })

    const store = useBalanceReportV1()
    const params = { 'filter[business_trust_id]': 1 }

    const result = await store._getConsolidatedBalanceBalance(params)

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('consolidated-balance-report/generate?')
    )
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Operación exitosa',
      'success',
      undefined,
      3000
    )
    expect(result).toEqual(mockData.data)
  })

  it('_getConsolidatedBalanceBalance - error en response', async () => {
    mockGet.mockResolvedValueOnce({
      data: { success: false, message: 'Error de API' },
    })

    const store = useBalanceReportV1()
    const result = await store._getConsolidatedBalanceBalance({})

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error de API',
      'error',
      undefined,
      3000
    )
    expect(result).toBeNull()
  })

  it('_getConsolidatedBalanceBalance - exception', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'))

    const store = useBalanceReportV1()
    const result = await store._getConsolidatedBalanceBalance({})

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
    const store = useBalanceReportV1()
    store.report_pdf_url = ''
    store.isPdfReady = false

    store.downloadPeriodicBalancePdf()

    expect(mockShowAlert).toHaveBeenCalledWith(
      'No hay archivo PDF generado aún',
      'error'
    )
  })
})
