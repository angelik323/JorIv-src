import { setActivePinia, createPinia } from 'pinia'
import { useAccountingReportListReceiptsReportV1 } from './accounting-report-list-receipts-v1'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

let mockShowAlert: jest.Mock<void, [string, string, string?, number?]>
let mockShowCatchError: jest.Mock<string, [unknown]>

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  mockShowAlert = jest.fn()
  mockShowCatchError = jest.fn().mockReturnValue('Error inesperado')

  return {
    useAlert: () => ({ showAlert: mockShowAlert }),
    useShowError: () => ({ showCatchError: mockShowCatchError }),
  }
})

describe('useAccountingReportListReceiptsReportV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch receipts list and update state on success', async () => {
    const store = useAccountingReportListReceiptsReportV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Consulta exitosa',
        data: {
          data: [{ id: 1 }],
          current_page: 2,
          last_page: 5,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._reportListReceipts('&filter[year]=2025')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/voucher-listing-report?paginate=1&filter[year]=2025`
    )
    expect(store.receipts_list).toEqual([{ id: 1 }])
    expect(store.receipts_pages).toEqual({ currentPage: 2, lastPage: 5 })
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Consulta exitosa',
      'success',
      undefined,
      expect.any(Number)
    )
    expect(result).toBe(true)
  })

  it('should handle error in _reportListReceipts', async () => {
    const store = useAccountingReportListReceiptsReportV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._reportListReceipts('&filter[year]=2025')

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error inesperado',
      'error',
      undefined,
      expect.any(Number)
    )
    expect(result).toBe(false)
  })

  it('should download PDF report (multiple) and return true on success', async () => {
    const store = useAccountingReportListReceiptsReportV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'PDF generado',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._downloadPdf('year=2025', 'ids=1,2,3')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/voucher-listing-report/export-multiple-reports?year=2025&paginate=1&ids=1,2,3&amount_type=Pesos`
    )
    expect(mockShowAlert).toHaveBeenCalledWith(
      'PDF generado',
      'success',
      undefined,
      expect.any(Number)
    )
    expect(result).toBe(true)
  })

  it('should handle error in _downloadPdf', async () => {
    const store = useAccountingReportListReceiptsReportV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error PDF'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._downloadPdf('year=2025', 'ids=1')

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error inesperado',
      'error',
      undefined,
      expect.any(Number)
    )
    expect(result).toBe(false)
  })

  it('should handle error in _downloadPdfIndividual', async () => {
    const store = useAccountingReportListReceiptsReportV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error individual'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadPdfIndividual('year=2025', 321)

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error inesperado',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('should set data_information_form', () => {
    const store = useAccountingReportListReceiptsReportV1()
    const data = { id: 1, amount: 1000 }

    store._setDataInformationForm(data)

    expect(store.data_information_form).toEqual(data)
  })

  it('should clean data correctly', () => {
    const store = useAccountingReportListReceiptsReportV1()
    store.receipts_list = [{ id: 1 }]
    store.receipts_pages = { currentPage: 2, lastPage: 3 }

    store._cleanData()

    expect(store.receipts_list).toEqual([])
    expect(store.receipts_pages).toEqual({ currentPage: 0, lastPage: 0 })
  })
})
