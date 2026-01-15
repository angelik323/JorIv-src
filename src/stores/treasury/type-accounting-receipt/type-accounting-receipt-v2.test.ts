import { setActivePinia, createPinia } from 'pinia'
import { useTypeAccountingReceiptStoreV2 } from './type-accounting-receipt-v2'
import { executeApi } from '@/apis'

const URL_PATH = 'accounting/api/accounting/v2/receipt-type'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

describe('useTypeAccountingReceiptStoreV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of accounting receipt types', async () => {
    const store = useTypeAccountingReceiptStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          data: [
            {
              id: 5,
              code: 1002,
              name: 'nombre com',
              status_id: 1,
              sub_receipt_types: [
                {
                  id: 3,
                  code: 102,
                  name: 'ejemplo uno',
                  is_cancellation: true,
                  cancellation_association_id: null,
                  is_upload_receipt: true,
                  status_id: 1,
                  receipt_type_id: 5,
                  cancellation_association: null,
                  status: {
                    id: 1,
                    status: 'Activo',
                    comments: null,
                  },
                },
              ],
              status: {
                id: 1,
                status: 'Activo',
                comments: null,
              },
            },
          ],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1`)
    expect(store.type_accounting_receipt_list).toHaveLength(1)
    expect(store.type_accounting_receipt_list[0].id).toBe(5)
  })

  it('handles error when fetching receipt types fails', async () => {
    const store = useTypeAccountingReceiptStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1`)
    expect(store.type_accounting_receipt_list).toHaveLength(0)
  })

  it('fetches receipt type by ID', async () => {
    const store = useTypeAccountingReceiptStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Operación exitosa',
        data: {
          id: 5,
          code: 1002,
          name: 'nombre com',
          status_id: 1,
          sub_receipt_types: [
            {
              id: 3,
              code: 102,
              name: 'ejemplo uno',
              is_cancellation: true,
              cancellation_association_id: null,
              is_upload_receipt: true,
              status_id: 1,
              receipt_type_id: 5,
              cancellation_association: null,
              status: {
                id: 1,
                status: 'Activo',
                comments: null,
              },
            },
          ],
          status: {
            id: 1,
            status: 'Activo',
            comments: null,
          },
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdTypeAccounting(5)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/5`)
    expect(store.type_accounting_request?.code).toBe(1002)
  })

  it('handles error when fetching by ID fails', async () => {
    const store = useTypeAccountingReceiptStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdTypeAccounting(5)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/5`)
    expect(store.type_accounting_request).toBeNull()
  })

  it('creates a new receipt type successfully', async () => {
    const store = useTypeAccountingReceiptStoreV2()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = { name: 'Nuevo Recibo' }
    const result = await store._createTypeAccountingReceipt(payload)

    expect(mockPost).toHaveBeenCalledWith(URL_PATH, payload)
    expect(result).toBe(true)
  })

  it('handles error when creating a receipt type fails', async () => {
    const store = useTypeAccountingReceiptStoreV2()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = { name: 'Fallido' }
    const result = await store._createTypeAccountingReceipt(payload)

    expect(mockPost).toHaveBeenCalledWith(URL_PATH, payload)
    expect(result).toBe(false)
  })

  it('fetches Excel data and triggers download', async () => {
    // Arrange
    const store = useTypeAccountingReceiptStoreV2()

    const mockData = new ArrayBuffer(8)
    const mockGet = jest.fn().mockResolvedValue({
      data: mockData,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'content-disposition': 'attachment; filename="export_data.xlsx"',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getDataExcel('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/excel/export`, {
      responseType: 'blob',
    })
  })

  it('handles error when fetching Excel data fails', async () => {
    // Arrange
    const store = useTypeAccountingReceiptStoreV2()

    const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getDataExcel('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/excel/export`, {
      responseType: 'blob',
    })
  })

  it('updates a receipt type successfully', async () => {
    // Arrange
    const store = useTypeAccountingReceiptStoreV2()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const payload = { id: 1, name: 'Recibo actualizado' }
    const result = await store._updateTypeAccountingReceipt(payload, 1)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/1`, payload)
    expect(result).toBe(true)
  })

  it('handles error when updating a receipt type fails', async () => {
    // Arrange
    const store = useTypeAccountingReceiptStoreV2()
    const mockPut = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = { id: 1, name: 'Fallido' }

    // Act
    const result = await store._updateTypeAccountingReceipt(payload, 1)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/1`, payload)
    expect(result).toBe(false)
  })

  it('changes status and refreshes the list', async () => {
    // Arrange
    const store = useTypeAccountingReceiptStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Estado cambiado con éxito',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._changeStatusAction(10)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/switch-status/10`)
  })

  it('handles error when deleting a receipt type fails', async () => {
    const store = useTypeAccountingReceiptStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._changeStatusAction(3)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/switch-status/3`)
  })

  it('sets data_information_form correctly', () => {
    // Arrange
    const store = useTypeAccountingReceiptStoreV2()
    const mockData = { id: 1, name: 'Detalle' }

    // Act
    store._setDataInformationForm(mockData)

    expect(store.data_information_form).toEqual(mockData)
  })

  it('sets data_information_form correctly', () => {
    // Arrange
    const store = useTypeAccountingReceiptStoreV2()
    const mockDataNull = null

    // Act
    store._setDataInformationForm(mockDataNull)

    // Assert
    expect(store.data_information_form).toBeNull()
  })

  it('handles unsuccessful response in _getListAction', async () => {
    // Arrange
    const store = useTypeAccountingReceiptStoreV2()

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Error al obtener',
        data: {},
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1`)
    expect(store.type_accounting_receipt_list).toEqual([])
  })

  it('handles unsuccessful response in _getByIdTypeAccounting', async () => {
    // Arrange
    const store = useTypeAccountingReceiptStoreV2()

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'No encontrado',
        data: null,
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdTypeAccounting(1)

    // Assert
    expect(store.type_accounting_request).toBeNull()
  })
})
