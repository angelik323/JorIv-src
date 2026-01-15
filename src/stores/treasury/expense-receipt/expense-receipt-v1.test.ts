import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { useExpenseReceiptStoreV1 } from '@/stores/treasury/expense-receipt/expense-receipt-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()
  const getNameBlobMock = jest.fn(() => 'comprobante_egreso.pdf')
  const downloadBlobXlxxMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))
  const useUtils = jest.fn(() => ({
    getNameBlob: getNameBlobMock,
    downloadBlobXlxx: downloadBlobXlxxMock,
  }))

  return {
    useAlert,
    useShowError,
    showAlertMock,
    showCatchErrorMock,
    useUtils,
    getNameBlobMock,
    downloadBlobXlxxMock,
  }
})

describe('useExpenseReceiptStoreV1', () => {
  let store: ReturnType<typeof useExpenseReceiptStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useExpenseReceiptStoreV1()

    jest.clearAllMocks()
  })
  it('should correctly fetch and update the expense receipt list', async () => {
    const store = useExpenseReceiptStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Éxito',
        data: {
          data: [{ id: 1, nombre: 'Recibo 1' }],
          current_page: 2,
          last_page: 5,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getExpenseReceiptList('&filtro=prueba')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/expense-voucher?paginate=1&filtro=prueba`
    )
    expect(store.expenseReceiptList).toEqual([{ id: 1, nombre: 'Recibo 1' }])
    expect(store.expenseReceiptPages).toEqual({ currentPage: 2, lastPage: 5 })
  })

  it('should download the file when the API responds successfully', async () => {
    const mockResponse = {
      data: new Blob(['test data'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1

    await store._getExpenseReceiptExportById(id)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/expense-voucher/export/${id}`,
      { responseType: 'blob' }
    )
    const { getNameBlobMock, downloadBlobXlxxMock } = require('@/composables')
    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
    expect(downloadBlobXlxxMock).toHaveBeenCalledWith(
      mockResponse.data,
      'comprobante_egreso.pdf'
    )
  })
})
