import { setActivePinia, createPinia } from 'pinia'
import { useCostCenterReportV1 } from './cost-center-report-v1'

type GetFn = (
  url: string,
  config?: unknown
) => Promise<{ data: unknown; headers?: Record<string, string> }>
const mockGet: jest.MockedFunction<GetFn> = jest.fn()

const mockCreateObjectURL: jest.MockedFunction<
  (obj: Blob | MediaSource) => string
> = jest.fn().mockReturnValue('blob:url')
const mockRevokeObjectURL: jest.MockedFunction<(url: string) => void> =
  jest.fn()

const mockClick: jest.MockedFunction<() => void> = jest.fn()
const mockAppendChild: jest.MockedFunction<(node: Node) => Node> = jest.fn(
  (n) => n
)
const mockRemove: jest.MockedFunction<() => void> = jest.fn()

const mockShowAlert: jest.MockedFunction<
  (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    title?: string,
    timeout?: number
  ) => void
> = jest.fn()

const mockShowCatchError: jest.MockedFunction<() => string> = jest
  .fn()
  .mockReturnValue('Error procesando')

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: mockGet,
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: () => ({ showAlert: mockShowAlert }),
  useShowError: () => ({ showCatchError: mockShowCatchError }),
  __esModule: true,
}))

describe('useCostCenterReportV1', () => {
  let anchorEl: HTMLAnchorElement
  let realCreateElement: typeof document.createElement

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    const OriginalURL = window.URL
    Object.defineProperty(window, 'URL', {
      writable: true,
      value: {
        ...OriginalURL,
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL,
      },
    })

    anchorEl = document.createElement('a')
    Object.defineProperty(anchorEl, 'click', { value: mockClick })
    Object.defineProperty(anchorEl, 'remove', { value: mockRemove })

    realCreateElement = document.createElement.bind(document)
    jest
      .spyOn(document, 'createElement')
      .mockImplementation(
        (tagName: string, options?: ElementCreationOptions): HTMLElement => {
          if (tagName.toLowerCase() === 'a') return anchorEl
          return realCreateElement(tagName, options)
        }
      )

    jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation((node: Node): Node => {
        mockAppendChild(node)
        return node
      })
  })

  it('_getCostCenterBalance - success', async () => {
    const mockData = {
      success: true,
      message: 'Operación exitosa',
      data: [{ id: 1, account: 'Caja' }],
    }
    mockGet.mockResolvedValueOnce({ data: mockData, headers: {} })

    const store = useCostCenterReportV1()
    const params: Record<string, number | string> = {
      'filter[business_trust_id]': 1,
    }

    const result = await store._getCostCenterBalance(params)

    const [calledUrl] = mockGet.mock.calls[0]
    expect(calledUrl).toEqual(
      expect.stringContaining('/balance-by-cost-center?')
    )

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Operación exitosa',
      'success',
      undefined,
      3000
    )

    expect(result).toBe(true)
    expect(store.cost_center_list).toHaveLength(1)
    expect(store.cost_center_list[0]).toMatchObject({
      account: 'Caja',
    })
  })

  it('_getCostCenterBalance - error en response', async () => {
    mockGet.mockResolvedValueOnce({
      data: { success: false, message: 'Error de API' },
      headers: {},
    })

    const store = useCostCenterReportV1()
    const result = await store._getCostCenterBalance({})

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error de API',
      'error',
      undefined,
      3000
    )
    expect(result).toBe(false)
    expect(store.cost_center_list).toEqual([])
    expect(store.cost_center_pages).toEqual({ currentPage: 1, lastPage: 1 })
    expect(store.report_excel_url).toBe('')
    expect(store.report_pdf_url).toBe('')
  })

  it('_getCostCenterBalance - exception', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'))

    const store = useCostCenterReportV1()
    const result = await store._getCostCenterBalance({})

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error procesando',
      'error',
      undefined,
      3000
    )
    expect(result).toBe(false)
    expect(store.cost_center_list).toEqual([])
    expect(store.cost_center_pages).toEqual({ currentPage: 1, lastPage: 1 })
    expect(store.report_excel_url).toBe('')
    expect(store.report_pdf_url).toBe('')
  })

  it('downloadPeriodicBalanceExcel - sin archivo generado', () => {
    const store = useCostCenterReportV1()
    store.costCenterBalanceExcelBlob = null
    store.isExcelReady = false

    store.downloadPeriodicBalanceExcel()

    expect(mockShowAlert).toHaveBeenCalledWith(
      'No hay archivo Excel generado aún',
      'error'
    )
  })

  it('downloadPeriodicBalancePdf - sin archivo generado', () => {
    const store = useCostCenterReportV1()
    store.costCenterBalancePdfBlob = null
    store.isPdfReady = false

    store.downloadPeriodicBalancePdf()

    expect(mockShowAlert).toHaveBeenCalledWith(
      'No hay archivo PDF generado aún',
      'error'
    )
  })
})
