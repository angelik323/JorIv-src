import { setActivePinia, createPinia } from 'pinia'
import { useTypeAccountingReceiptStoreV1 } from './type-accounting-receipt-v1'
import { executeApi } from '@/apis'

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

describe('useTypeAccountingReceiptStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of accounting receipt types', async () => {
    const store = useTypeAccountingReceiptStoreV1()
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

    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/accounting-receipt-type?paginate=1'
    )
    expect(store.type_accounting_receipt_list).toHaveLength(1)
    expect(store.type_accounting_receipt_list[0].id).toBe(5)
  })

  it('handles error when fetching receipt types fails', async () => {
    const store = useTypeAccountingReceiptStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')

    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/accounting-receipt-type?paginate=1'
    )
    expect(store.type_accounting_receipt_list).toHaveLength(0)
  })

  it('fetches receipt type by ID', async () => {
    const store = useTypeAccountingReceiptStoreV1()
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

    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/accounting-receipt-type/5'
    )
    expect(store.type_accounting_request?.code).toBe(1002)
  })

  it('handles error when fetching by ID fails', async () => {
    const store = useTypeAccountingReceiptStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdTypeAccounting(5)

    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/accounting-receipt-type/5'
    )
    expect(store.type_accounting_request).toBeNull()
  })

  it('creates a new receipt type successfully', async () => {
    const store = useTypeAccountingReceiptStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = { name: 'Nuevo Recibo' }
    const result = await store._createTypeAccountingReceipt(payload)

    expect(mockPost).toHaveBeenCalledWith(
      'accounting/api/accounting/accounting-receipt-type',
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error when creating a receipt type fails', async () => {
    const store = useTypeAccountingReceiptStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = { name: 'Fallido' }
    const result = await store._createTypeAccountingReceipt(payload)

    expect(mockPost).toHaveBeenCalledWith(
      'accounting/api/accounting/accounting-receipt-type',
      payload
    )
    expect(result).toBe(false)
  })

  it('fetches Excel data and triggers download', async () => {
    // Arrange
    const store = useTypeAccountingReceiptStoreV1()

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
    expect(mockGet).toHaveBeenCalledWith(
      `accounting/api/accounting/accounting-receipt-type/excel/export`,
      { responseType: 'blob' }
    )
  })

  it('handles error when fetching Excel data fails', async () => {
    // Arrange
    const store = useTypeAccountingReceiptStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getDataExcel('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `accounting/api/accounting/accounting-receipt-type/excel/export`,
      { responseType: 'blob' }
    )
  })

  it('updates a receipt type successfully', async () => {
    const store = useTypeAccountingReceiptStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = { id: 1, name: 'Recibo actualizado' }
    const result = await store._updateTypeAccountingReceipt(payload, 1)

    expect(mockPut).toHaveBeenCalledWith(
      'accounting/api/accounting/accounting-receipt-type/1',
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error when updating a receipt type fails', async () => {
    const store = useTypeAccountingReceiptStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = { id: 1, name: 'Fallido' }
    const result = await store._updateTypeAccountingReceipt(payload, 1)

    expect(mockPut).toHaveBeenCalledWith(
      'accounting/api/accounting/accounting-receipt-type/1',
      payload
    )
    expect(result).toBe(false)
  })

  it('changes status and refreshes the list', async () => {
    const store = useTypeAccountingReceiptStoreV1()

    // Mock del GET de executeApi
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Estado cambiado con éxito',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Ejecutar el método
    await store._changeStatusAction(10)

    // Validaciones
    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/accounting-receipt-type/switch-status/10'
    )
  })

  it('handles error when deleting a receipt type fails', async () => {
    const store = useTypeAccountingReceiptStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._changeStatusAction(3)

    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/accounting-receipt-type/switch-status/3'
    )
  })
})
