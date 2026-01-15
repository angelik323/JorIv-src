// accouting-report-v1.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useFinancialStatementV1 } from './accouting-report-v1'

// --------- Mocks ---------
const mockGet = jest.fn<
  Promise<{ data: unknown }>,
  [string, ...(readonly unknown[])]
>()
const mockCreateObjectURL = jest.fn(() => 'blob:url')
const mockClick = jest.fn()
const mockAppendChild = jest.fn(<T extends Node>(node: T) => node)
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

jest.mock('@/utils', () => ({
  replaceDevWithAccounting: (u?: string) => u ?? '',
  __esModule: true,
}))

class MockBlob {
  content: (string | Uint8Array)[]
  type?: string
  constructor(content: (string | Uint8Array)[], options?: { type?: string }) {
    this.content = content
    this.type = options?.type
  }
  async text(): Promise<string> {
    try {
      const first = this.content[0]
      if (typeof first === 'string') return first
      return new TextDecoder().decode(first)
    } catch {
      return ''
    }
  }
}
;(globalThis as unknown as { Blob: typeof MockBlob }).Blob = MockBlob

describe('useFinancialStatementV1', () => {
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
    } as unknown as HTMLAnchorElement)

    document.body.appendChild = mockAppendChild as unknown as <T extends Node>(
      node: T
    ) => T
  })

  const mockSuccessResponse = {
    success: true,
    message: 'Operación exitosa',
    data: {
      data: [{ id: 1, account: 'Caja' }],
      current_page: 1,
      last_page: 1,
      reportables: {
        report_excel_url: '/dev/excel/file.xlsx',
        report_pdf_url: '/dev/pdf/file.pdf',
      },
    },
  }

  const mockErrorResponse = {
    success: false,
    message: 'Error de API',
  }

  it('_getComparativeStatementBalance - success', async () => {
    mockGet.mockResolvedValueOnce({ data: mockSuccessResponse })

    const store = useFinancialStatementV1()
    const params = { 'filter[business_trust_id]': 1 }

    const result = await store._getComparativeStatementBalance(params)

    expect(mockGet).toHaveBeenCalledTimes(1)
    const calledUrl = mockGet.mock.calls[0]?.[0] as string
    expect(calledUrl).toEqual(
      expect.stringContaining('/financial-statement-report?')
    )
    expect(calledUrl).toEqual(expect.stringContaining('paginate=1'))
    expect(calledUrl).toEqual(
      expect.stringContaining('filter%5Bbusiness_trust_id%5D=1')
    )

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Operación exitosa',
      'success',
      undefined,
      3000
    )

    expect(result).toEqual(mockSuccessResponse.data)
    expect(store.opening_record_list.length).toBe(1)
    expect(store.opening_record_pages.currentPage).toBe(1)
    expect(store.opening_record_pages.lastPage).toBe(1)
    expect(store.report_excel_url).toBe('/dev/excel/file.xlsx')
    expect(store.report_pdf_url).toBe('/dev/pdf/file.pdf')
  })

  it('_getComparativeStatementBalance - API error response', async () => {
    mockGet.mockResolvedValueOnce({ data: mockErrorResponse })

    const store = useFinancialStatementV1()
    const result = await store._getComparativeStatementBalance({})

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error de API',
      'error',
      undefined,
      3000
    )
    expect(result).toBeNull()
    expect(store.opening_record_list).toEqual([])
    expect(store.opening_record_pages.currentPage).toBe(1)
    expect(store.opening_record_pages.lastPage).toBe(1)
    expect(store.report_excel_url).toBe('')
    expect(store.report_excel_url).toBe('')
  })

  it('_getComparativeStatementBalance - exception', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'))

    const store = useFinancialStatementV1()
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
})
