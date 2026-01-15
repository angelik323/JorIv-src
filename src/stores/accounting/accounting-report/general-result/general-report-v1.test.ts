import { setActivePinia, createPinia } from 'pinia'
import { useGeneralResultsV1 } from './general-report-v1'

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

describe('useGeneralResultsV1', () => {
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

    document.body.appendChild = mockAppendChild
  })

  const mockErrorResponse = {
    success: false,
    message: 'Error de API',
  }

  it('_getGeneralResultsBalance - API error response', async () => {
    mockGet.mockResolvedValueOnce({ data: mockErrorResponse })

    const store = useGeneralResultsV1()
    const result = await store._getGeneralResultsBalance({})

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error de API',
      'error',
      undefined,
      3000
    )

    expect(result).toBeNull()

    expect(store.general_results_list).toEqual([])
    expect(store.general_results_pages.currentPage).toBe(1)
    expect(store.general_results_pages.lastPage).toBe(1)
    expect(store.report_excel_url).toBe('')
    expect(store.report_pdf_url).toBe('')
  })
  it('_getGeneralResultsBalance - exception', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'))

    const store = useGeneralResultsV1()
    const result = await store._getGeneralResultsBalance({})

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
