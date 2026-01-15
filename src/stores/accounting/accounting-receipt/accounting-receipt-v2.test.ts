import { setActivePinia, createPinia } from 'pinia'
import { useAccountingReceiptsV2 } from './accounting-receipt-v2'
import { executeApi } from '@/apis'
import { IAccountingReceiptCreate } from '@/interfaces/customs'

const URL_PATH = 'accounting/api/accounting/v2/voucher'
jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useAccountingReceipts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch accounting receipt list and update state on success', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockResponse = {
      data: {
        success: true,
        data: {
          current_page: 1,
          data: [],
          last_page: 1,
          per_page: 20,
        },
        message: 'Listado obtenido exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getAccountingReceiptList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.accounting_receipt_list).toEqual(mockResponse.data.data.data)
  })

  it('should fetch accounting receipt list and update state on error', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockResponse = {
      data: {
        success: false,
        data: [],
        message: 'Ocurrió un error.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getAccountingReceiptList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.accounting_receipt_list).toEqual(mockResponse.data.data)
  })

  it('should handle error when fetching accounting receipt list', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getAccountingReceiptList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.accounting_receipt_list).toEqual([])
  })

  it('should handle response.data as undefined when fetching the accounting receipt list', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockResponse = { data: undefined }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getAccountingReceiptList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.accounting_receipt_list).toEqual([])
    expect(store.accounting_receipt_pages.currentPage).toBe(0)
    expect(store.accounting_receipt_pages.lastPage).toBe(0)
  })

  it('should handle response.data as null when fetching the accounting receipt list', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockResponse = { data: null }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getAccountingReceiptList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.accounting_receipt_list).toEqual([])
    expect(store.accounting_receipt_pages.currentPage).toBe(0)
    expect(store.accounting_receipt_pages.lastPage).toBe(0)
  })

  it('should create an accounting receipt successfully', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockResponse = {
      data: {
        data: [],
        success: true,
        message: 'Registro creado exitosamente.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IAccountingReceiptCreate = {
      id: 0,
      business_trust_id: 24,
      accounting_structure_id: 1,
      business_trust_account_structure_label: '',
      structure_applied_label: '',
      sub_receipt_type_label: '',
      accounting_structure: {
        id: 1,
        code: 'E001',
        purpose: 'Propósito de la estructura contable',
        type: 'Equivalente',
      },
      business_trust: {
        id: 24,
        business_code: '',
        name: '',
        account: {
          id: 0,
          current_period: '',
          business_trust_account_structure: [],
          account_structure: {
            id: 0,
            code: '',
            purpose: '',
          },
        },
      },
      registration_day: '31',
      registration_date: '2025-01-01',
      receipt_type_id: 22,
      receipt_type: {
        id: 22,
        code: '',
        name: '',
      },
      sub_receipt_type_id: 25,
      sub_receipt_type: {
        id: 25,
        code: '',
        name: '',
      },
      code: '',
      voucher_data: [
        {
          nature: 'Débito',
          account_id: 90,
          third_party_id: 264,
          register_detail: 'eee',
          foreign_currency: '0',
          debit: '100',
        },
        {
          nature: 'Crédito',
          account_id: 20225,
          third_party_id: 95,
          register_detail: 'ggg',
          foreign_currency: '0',
          credit: '100',
        },
      ],
      total_amount_debits: 100,
      total_amount_credits: 100,
      difference_amount: 0,
      status: {
        id: 0,
        status: '',
      },
    }

    // Act
    const result = await store._createAccountingReceipt(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(true)
  })

  it('should handle error when creating an accounting receipt', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockError = {
      response: {
        data: {
          message: 'Ocurrío un error al crear el comprobante contable',
        },
      },
    }
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IAccountingReceiptCreate = {
      id: 0,
      business_trust_id: 24,
      accounting_structure_id: 1,
      business_trust_account_structure_label: '',
      structure_applied_label: '',
      sub_receipt_type_label: '',
      accounting_structure: {
        id: 1,
        code: 'E001',
        purpose: 'Propósito de la estructura contable',
        type: 'Equivalente',
      },
      business_trust: {
        id: 24,
        business_code: '',
        name: '',
        account: {
          id: 0,
          current_period: '',
          business_trust_account_structure: [],
          account_structure: {
            id: 0,
            code: '',
            purpose: '',
          },
        },
      },
      registration_day: '31',
      registration_date: '2025-01-01',
      receipt_type_id: 22,
      receipt_type: {
        id: 22,
        code: '',
        name: '',
      },
      sub_receipt_type_id: 25,
      sub_receipt_type: {
        id: 25,
        code: '',
        name: '',
      },
      code: '',
      voucher_data: [
        {
          nature: 'Crédito',
          account_id: 1,
          third_party_id: 1,
          cost_center_id: 1,
          register_detail: 'fila uno del comprobante',
          credit: '5.00',
          foreign_currency: '',
        },
        {
          nature: 'Débito',
          account_id: 1,
          third_party_id: 1,
          cost_center_id: 1,
          register_detail: 'fila 2 del comprobante',
          debit: '10.00',
          foreign_currency: '',
        },
        {
          nature: 'Crédito',
          account_id: 1,
          third_party_id: 1,
          cost_center_id: 1,
          register_detail: 'fila 3 del comprobante',
          credit: '5.00',
          foreign_currency: '',
        },
      ],
      total_amount_debits: 100,
      total_amount_credits: 100,
      difference_amount: 0,
      status: {
        id: 0,
        status: '',
      },
    }

    // Act
    const result = await store._createAccountingReceipt(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(false)
  })

  it('should fetch an accounting receipt by ID', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'Registro obtenido exitosamente.',
        data: {},
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    const response = await store._getAccountingReceipt(id)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}/show`)
    expect(response).toBe(true)
  })

  it('should handle error when fetching an accounting receipt by ID', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    const response = await store._getAccountingReceipt(id)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}/show`)
    expect(response).toBe(false)
  })

  it('should update an accounting receipt successfully', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'Comprobante contable actualizado exitosamente.',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = {
      business_trust_id: 11,
      registration_date: '26/05/2025',
      registration_day: 22,
      receipt_type_id: 1,
      sub_receipt_type_id: 4,
      voucher_data: [
        {
          nature: 'Crédito',
          account_id: 1,
          third_party_id: 1,
          cost_center_id: 1,
          register_detail: 'fila uno del comprobante',
          credit: '5.00',
          foreign_currency: '',
        },
        {
          nature: 'Débito',
          account_id: 1,
          third_party_id: 1,
          cost_center_id: 1,
          register_detail: 'fila 2 del comprobante',
          debit: '10.00',
          foreign_currency: '',
        },
        {
          nature: 'Crédito',
          account_id: 1,
          third_party_id: 1,
          cost_center_id: 1,
          register_detail: 'fila 3 del comprobante',
          credit: '5.00',
          foreign_currency: '',
        },
      ],
      total_amount_debits: 10,
      total_amount_credits: 10,
      difference_amount: 0,
    }
    // Act
    const result = await store._updateAccountingReceipt(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(true)
  })

  it('should handle error when updating an accounting receipt', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockResponse = new Error('Network Error')
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = {
      business_trust_id: 11,
      registration_date: '26/05/2025',
      registration_day: 22,
      receipt_type_id: 1,
      sub_receipt_type_id: 4,
      voucher_data: [
        {
          nature: 'Crédito',
          account_id: 1,
          third_party_id: 1,
          cost_center_id: 1,
          register_detail: 'fila uno del comprobante',
          credit: '5.00',
          foreign_currency: '',
        },
        {
          nature: 'Débito',
          account_id: 1,
          third_party_id: 1,
          cost_center_id: 1,
          register_detail: 'fila 2 del comprobante',
          debit: '10.00',
          foreign_currency: '',
        },
        {
          nature: 'Crédito',
          account_id: 1,
          third_party_id: 1,
          cost_center_id: 1,
          register_detail: 'fila 3 del comprobante',
          credit: '5.00',
          foreign_currency: '',
        },
      ],
      total_amount_debits: 10,
      total_amount_credits: 10,
      difference_amount: 0,
    }
    // Act
    const result = await store._updateAccountingReceipt(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(false)
  })

  it('should export accounting receipt XLS format succesfully', async () => {
    const store = useAccountingReceiptsV2()

    const mockBlob = new Blob(['data'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const mockResponse = {
      data: mockBlob,
      status: 200,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._downloadAccountingReceipt(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/export?ids[0]=1`, {
      responseType: 'arraybuffer',
    })

    expect(result).toBe(mockBlob)
  })

  it('should export accounting receipt XLS format succesfully', async () => {
    const store = useAccountingReceiptsV2()

    const mockError = {
      data: '',
      status: false,
      message: 'No se pudo exportar el comprobante',
    }

    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._downloadAccountingReceipt(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/export?ids[0]=1`, {
      responseType: 'arraybuffer',
    })

    expect(result).toEqual(null)
  })

  it('should annulate an accounting receipt successfully', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'Registro actualizado exitosamente.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const id = 1
    const annulate_date = '2025-06-06'
    const payload = {
      annulate_date,
    }
    // Act
    const result = await store._annulateAccountingReceipt(id, annulate_date)
    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/annulate/${id}`, payload)
    expect(result).toBe(true)
  })

  it('should handle error annulating an accounting receipt successfully', async () => {
    // Arrange
    const store = useAccountingReceiptsV2()
    const mockError = {
      data: {
        success: false,
        message: 'No se puede anular el comprobante.',
      },
    }
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const id = 1
    const annulate_date = '2025-06-06'
    const payload = {
      annulate_date,
    }

    // Act
    const result = await store._annulateAccountingReceipt(id, annulate_date)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/annulate/${id}`, payload)
    expect(result).toBe(false)
  })
})
