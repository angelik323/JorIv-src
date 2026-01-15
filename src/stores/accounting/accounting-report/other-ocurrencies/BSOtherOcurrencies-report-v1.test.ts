import { setActivePinia, createPinia } from 'pinia'
import { useOtherCurrenciesReportV1 } from './BSOtherOcurrencies-report-v1'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(),
}))
jest.mock('@/composables', () => ({
  useAlert: jest.fn(),
  useShowError: jest.fn(),
}))

describe('useOtherCurrenciesReportV1', () => {
  const mockGet = jest.fn()
  const mockShowAlert = jest.fn()
  const mockShowCatchError = jest.fn()

  beforeEach(() => {
    setActivePinia(createPinia())
    ;(executeApi as jest.Mock).mockReturnValue({
      get: mockGet,
    })
    ;(useAlert as jest.Mock).mockReturnValue({
      showAlert: mockShowAlert,
    })
    ;(useShowError as jest.Mock).mockReturnValue({
      showCatchError: mockShowCatchError,
    })

    jest.clearAllMocks()
  })

  it('_getTrialBalanceOtherCurrencies - error API', async () => {
    const store = useOtherCurrenciesReportV1()

    mockGet.mockResolvedValueOnce({
      data: { success: false, message: 'Error API' },
    })

    await store._getTrialBalanceOtherCurrencies({})

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error API',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('_getTrialBalanceOtherCurrencies - exception', async () => {
    const store = useOtherCurrenciesReportV1()

    mockGet.mockRejectedValueOnce(new Error('fail'))

    await store._getTrialBalanceOtherCurrencies({})
    expect(mockShowCatchError).toHaveBeenCalled()
  })

  it('downloadBSOtherOcurrenciesPdf - report not ready', async () => {
    const store = useOtherCurrenciesReportV1()
    const blobMock = new Blob([], { type: 'application/json' })

    ;(Blob.prototype.text as jest.Mock) = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          JSON.stringify({ success: false, message: 'Se está construyendo' })
        )
      )

    mockGet.mockResolvedValueOnce({
      data: blobMock,
      headers: { 'content-type': 'application/json' },
    })

    localStorage.setItem('login-auth', JSON.stringify({ token: 'fake-token' }))
    store.report_pdf_url = 'https://fake-pdf.com/file.pdf'

    await store.downloadBSOtherOcurrenciesPdf()
    await Promise.resolve()

    expect(mockShowAlert).toHaveBeenCalledWith('Se está construyendo', 'error')
  })

  it('downloadBSOtherOcurrenciesPdf - no URL', async () => {
    const store = useOtherCurrenciesReportV1()
    store.report_pdf_url = ''

    await store.downloadBSOtherOcurrenciesPdf()

    expect(mockShowAlert).toHaveBeenCalledWith(
      'No hay archivo PDF generado aún',
      'error'
    )
  })

  it('downloadBSOtherOcurrenciesExcel - report not ready', async () => {
    const store = useOtherCurrenciesReportV1()
    const blobMock = new Blob([], { type: 'application/json' })

    ;(Blob.prototype.text as jest.Mock) = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          JSON.stringify({ success: false, message: 'Se está construyendo' })
        )
      )

    mockGet.mockResolvedValueOnce({
      data: blobMock,
      headers: { 'content-type': 'application/json' },
    })

    localStorage.setItem('login-auth', JSON.stringify({ token: 'fake-token' }))
    store.report_excel_url = 'https://fake-excel.com/file.xlsx'

    await store.downloadBSOtherOcurrenciesExcel()
    await Promise.resolve()

    expect(mockShowAlert).toHaveBeenCalledWith('Se está construyendo', 'error')
  })

  it('downloadBSOtherOcurrenciesExcel - no URL', async () => {
    const store = useOtherCurrenciesReportV1()
    store.report_excel_url = ''

    await store.downloadBSOtherOcurrenciesExcel()

    expect(mockShowAlert).toHaveBeenCalledWith(
      'No hay archivo Excel generado aún',
      'error'
    )
  })
})
