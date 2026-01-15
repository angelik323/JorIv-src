import { setActivePinia, createPinia } from 'pinia'
import { useGeneralLedgerV1 } from './ledger-report-v1'

const mockGet = jest.fn<
  Promise<{ data: unknown; headers?: Record<string, unknown> }>,
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

describe('useGeneralLedgerV1', () => {
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

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn().mockReturnValue('{"token": "test-token"}'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })
  })

  const mockSuccessResponse = {
    success: true,
    message: 'Operación exitosa',
    data: {
      data: [
        {
          '11052001': {
            initial_balance: '100.00',
            final_balance: '500.00',
            movements: [
              {
                account_name: 'CAJA GENERAL',
                date: '2024-01-15',
                debit: '400.00',
                credit: '0.00',
              },
            ],
          },
        },
      ],
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

  it('_getGeneralLedgerBalance - success', async () => {
    mockGet.mockResolvedValueOnce({ data: mockSuccessResponse })

    const store = useGeneralLedgerV1()
    const params = { 'filter[business_trust_id]': 1 }

    const result = await store._getGeneralLedgerBalance(params)

    expect(mockGet).toHaveBeenCalledTimes(1)
    const calledUrl = mockGet.mock.calls[0]?.[0] as string
    expect(calledUrl).toEqual(
      expect.stringContaining('/general-ledger-and-balance-sheet?')
    )
    expect(calledUrl).toEqual(
      expect.stringContaining('filter%5Bbusiness_trust_id%5D=1')
    )

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Operación exitosa',
      'success',
      undefined,
      3000
    )

    expect(result).toEqual({
      data: [
        {
          account_code: '11052001',
          initial_balance: '100.00',
          final_balance: '500.00',
          movements: [
            {
              account_name: 'CAJA GENERAL',
              date: '2024-01-15',
              debit: '400.00',
              credit: '0.00',
            },
          ],
        },
      ],
      reportables: {
        report_excel_url: '/dev/excel/file.xlsx',
        report_pdf_url: '/dev/pdf/file.pdf',
      },
    })
    expect(store.general_ledger_list.length).toBe(1)
    expect(store.general_ledger_list[0]).toEqual(
      expect.objectContaining({
        account_code: '11052001',
        initial_balance: '100.00',
        final_balance: '500.00',
      })
    )
    expect(store.report_excel_url).toBe('/dev/excel/file.xlsx')
    expect(store.report_pdf_url).toBe('/dev/pdf/file.pdf')
  })

  it('_getGeneralLedgerBalance - API error response', async () => {
    mockGet.mockResolvedValueOnce({ data: mockErrorResponse })

    const store = useGeneralLedgerV1()
    const result = await store._getGeneralLedgerBalance({})

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error de API',
      'error',
      undefined,
      3000
    )
    expect(result).toBeNull()
    expect(store.general_ledger_list).toEqual([])
    expect(store.report_excel_url).toBe('')
    expect(store.report_pdf_url).toBe('')
  })

  it('_getGeneralLedgerBalance - exception', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'))

    const store = useGeneralLedgerV1()
    const result = await store._getGeneralLedgerBalance({})

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error procesando',
      'error',
      undefined,
      3000
    )
    expect(result).toBeNull()
  })

  it('downloadPeriodicBalanceExcel - success', async () => {
    const store = useGeneralLedgerV1()
    store.report_excel_url = '/test/excel/report.xlsx'

    const mockBlob = new MockBlob(['excel content'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    mockGet.mockResolvedValueOnce({
      data: mockBlob,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'content-disposition': 'attachment; filename="report.xlsx"',
      },
    })

    await store.downloadPeriodicBalanceExcel()

    expect(mockGet).toHaveBeenCalledWith('/test/excel/report.xlsx', {
      responseType: 'blob',
      headers: { Authorization: 'Bearer test-token' },
    })
    expect(mockCreateObjectURL).toHaveBeenCalled()
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockClick).toHaveBeenCalled()
    expect(mockAppendChild).toHaveBeenCalled()
    expect(mockRemove).toHaveBeenCalled()
  })

  it('downloadPeriodicBalanceExcel - no URL', async () => {
    const store = useGeneralLedgerV1()
    store.report_excel_url = ''

    await store.downloadPeriodicBalanceExcel()

    expect(mockGet).not.toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'No hay archivo Excel generado aún',
      'error'
    )
  })

  it('downloadPeriodicBalanceExcel - download error', async () => {
    const store = useGeneralLedgerV1()
    store.report_excel_url = '/test/excel/report.xlsx'

    mockGet.mockRejectedValueOnce(new Error('Download failed'))

    await store.downloadPeriodicBalanceExcel()

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error al descargar el Excel',
      'error'
    )
  })

  it('downloadPeriodicBalancePdf - success', async () => {
    const store = useGeneralLedgerV1()
    store.report_pdf_url = '/test/pdf/report.pdf'

    const mockBlob = new MockBlob(['pdf content'], {
      type: 'application/pdf',
    })

    mockGet.mockResolvedValueOnce({
      data: mockBlob,
      headers: {
        'content-type': 'application/pdf',
      },
    })

    await store.downloadPeriodicBalancePdf()

    expect(mockGet).toHaveBeenCalledWith('/test/pdf/report.pdf', {
      responseType: 'blob',
      headers: { Authorization: 'Bearer test-token' },
    })
    expect(mockCreateObjectURL).toHaveBeenCalled()
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockClick).toHaveBeenCalled()
    expect(mockAppendChild).toHaveBeenCalled()
    expect(mockRemove).toHaveBeenCalled()
  })

  it('downloadPeriodicBalancePdf - no URL', async () => {
    const store = useGeneralLedgerV1()
    store.report_pdf_url = ''

    await store.downloadPeriodicBalancePdf()

    expect(mockGet).not.toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'No hay archivo PDF generado aún',
      'error'
    )
  })

  it('downloadPeriodicBalancePdf - download error', async () => {
    const store = useGeneralLedgerV1()
    store.report_pdf_url = '/test/pdf/report.pdf'

    mockGet.mockRejectedValueOnce(new Error('Download failed'))

    await store.downloadPeriodicBalancePdf()

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error al descargar el PDF',
      'error'
    )
  })
})
