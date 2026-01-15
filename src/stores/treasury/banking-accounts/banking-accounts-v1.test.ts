import { setActivePinia, createPinia } from 'pinia'
import { useBankingAccountsV1 } from '@/stores/treasury/banking-accounts/banking-accounts-v1'
import { executeApi } from '@/apis'
import type { IBankingAccountsList } from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'

const URL_PATH = `${URL_PATH_TREASURIES}/bank-accounts`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
  useMainLoader: jest.fn(() => ({ useMainLoader: jest.fn() })),
}))

describe('_getBankingAccountsList', () => {
  let store: ReturnType<typeof useBankingAccountsV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBankingAccountsV1()
    jest.clearAllMocks()
  })

  const filters = '&filter[search]=1626336'
  const filtersEmpty = ''

  const mockBankingAccountsListResponse: IBankingAccountsList[] = [
    {
      id: 5,
      account_name: 'nombre de cuenta',
      account_bank: '1626336',
      account_number: '238742834',
      status: {
        id: 1,
        status: 'Activo',
      },
    },
  ]

  it('should fetch banking accounts successfully', async () => {
    // Arrange
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Success',
        data: {
          data: mockBankingAccountsListResponse,
          current_page: 1,
          last_page: 1,
          total: 1,
          per_page: 25,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getBankingAccountsList(filters)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
    expect(store.banking_accounts_list).toEqual(mockBankingAccountsListResponse)
    expect(store.banking_accounts_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('should fetch banking accounts successfully without filters', async () => {
    // Arrange
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Success without filters',
        data: {
          data: mockBankingAccountsListResponse,
          current_page: 1,
          last_page: 1,
          total: 1,
          per_page: 25,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getBankingAccountsList(filtersEmpty)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1`)
    expect(store.banking_accounts_list).toEqual(mockBankingAccountsListResponse)
  })

  it('should handle API success=false response', async () => {
    // Arrange
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed',
        data: {
          data: [],
          current_page: 0,
          last_page: 0,
          total: 0,
          per_page: 25,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getBankingAccountsList(filters)

    // Assert
    expect(mockGet).toHaveBeenCalled()
    expect(store.banking_accounts_list).toEqual([])
  })

  it('handles error when fetching banking accounts fails', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getBankingAccountsList(filters)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
    expect(store.banking_accounts_list).toEqual([])
  })

  it('creates banking account successfully', async () => {
    // Arrange
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Registro creado exitosamente.',
        data: [{ id: 7, performance: { id: 2 }, restatement: { id: 2 } }],
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createBankingAccounts({})

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, {})
  })

  it('handles API success=false in banking account list', async () => {
    // Arrange
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Falló',
        data: {
          data: [],
          current_page: 0,
          last_page: 0,
          total: 0,
          per_page: 25,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getBankingAccountsList(filters)

    // Assert
    expect(store.banking_accounts_list).toEqual([])
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
  })

  it('gets banking account by ID successfully', async () => {
    // Arrange
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Registro obtenido exitosamente.',
        data: {
          data_basic: { id: 1, status: { id: 9 } },
          performance: { id: 2 },
          restatement: { id: 3 },
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdBankingAccounts(1)

    // Assert
    expect(store.information_receipt_request).toMatchObject({ id: 1 })
    expect(store.performance_receipt_request).toEqual({ id: 2 })
    expect(store.restatement_receipt_request).toEqual({ id: 3 })
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
  })

  it('deletes banking account successfully', async () => {
    // Arrange
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Registro eliminado exitosamente.' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    await store._deleteBankingAccounts(1)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH}/1`)
  })

  it('updates banking account successfully', async () => {
    // Arrange
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Registro actualizado exitosamente.' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateBankingAccounts(4, {})

    // Assert
    expect(result).toBe(true)
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/4`, {})
  })

  it('validates basic form successfully', async () => {
    // Arrange
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Validación exitosa.' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._isValidDataBasicForm({})

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/validate-basic-data`, {})
  })

  it('validates basic form for edit successfully', async () => {
    // Arrange
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Validación exitosa.' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._isValidDataBasicEditForm({})

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH}/validate-basic-data-update`,
      {}
    )
  })

  it('validates performance form successfully', async () => {
    // Arrange
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Validación exitosa.' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._isValidPerformanceForm({})

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/validate-performance`, {
      performance: {},
    })
  })

  it('validates restatement form successfully', async () => {
    // Arrange
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Validación exitosa.' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._isValidRestatementForm({})

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/validate-restatement`, {
      restatement: {},
    })
  })

  it('sets basic banking account data', async () => {
    // Arrange
    const sampleData = { id: 1, account_name: 'Cuenta X' }

    // Act
    await store._setDataBasicBankingAccount(sampleData as any)

    // Assert
    expect(store.data_information_form).toEqual(sampleData)
  })

  it('sets performance banking account data', async () => {
    // Arrange
    const sampleData = { id: 2, some_field: 'valor' }

    // Act
    await store._setDataPerformanceBankingAccount(sampleData as any)

    // Assert
    expect(store.data_performance_form).toEqual(sampleData)
  })

  it('sets restatement banking account data', async () => {
    // Arrange
    const sampleData = { id: 3, another_field: 'dato' }

    // Act
    await store._setDataRestatementBankingAccount(sampleData as any)

    // Assert
    expect(store.data_restatement_form).toEqual(sampleData)
  })

  it('sets parsed error in dataBasicError', async () => {
    // Arrange
    const jsonError = JSON.stringify({ field: ['es requerido'] })

    // Act
    await store._dataBasicError(jsonError)

    // Assert
    expect(store.error_information_form).toEqual({ field: ['es requerido'] })
  })

  it('sets null in dataBasicError when no data', async () => {
    // Arrange
    const sampleData = null

    // Act
    await store._dataBasicError(sampleData)

    // Assert
    expect(store.error_information_form).toBeNull()
  })

  it('handles error when updating banking account fails', async () => {
    // Arrange
    const mockPut = jest.fn().mockRejectedValue({
      response: { data: { message: 'Error al actualizar' } },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateBankingAccounts(1, {})

    // Assert
    expect(result).toBe(false)
    expect(store.error_information_form).toBe('Error al actualizar')
  })

  it('handles error in validating basic form', async () => {
    // Arrange
    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._isValidDataBasicForm({})

    // Assert
    expect(result).toBe(false)
  })

  it('handles error in validating basic form for edit', async () => {
    // Arrange
    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._isValidDataBasicEditForm({})

    // Assert
    expect(result).toBe(false)
  })

  it('handles error in validating performance form', async () => {
    // Arrange
    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._isValidPerformanceForm({})

    // Assert
    expect(result).toBe(false)
  })

  it('handles error in validating restatement form', async () => {
    // Arrange
    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._isValidRestatementForm({})

    // Assert
    expect(result).toBe(false)
  })

  it('should fallback to empty list if response.data.data.data is undefined', async () => {
    // Arrange
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'OK',
        data: {
          data: undefined,
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getBankingAccountsList('')

    // Assert
    expect(store.banking_accounts_list).toEqual([]) // fallback
  })

  it('should not set accounting_account_gmf if gmf_business_accounting_account_id is missing', async () => {
    // Arrange
    const mockData = {
      data_basic: {
        id: 1,
        // gmf_business_accounting_account_id
      },
      performance: { id: 2 },
      restatement: { id: 3 },
    }

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'OK',
        data: mockData,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdBankingAccounts(1)

    // Assert
    expect(
      store.information_receipt_request?.accounting_account_gmf
    ).toBeUndefined()
  })

  it('should show error alert if _getByIdBankingAccounts fails', async () => {
    // Arrange
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'No se encontró',
        data: {},
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdBankingAccounts(99)

    // Assert
    expect(store.information_receipt_request).toBeNull()
    expect(store.performance_receipt_request).toBeNull()
    expect(store.restatement_receipt_request).toBeNull()
  })

  it('resets banking account form data to null', async () => {
    // Arrange
    store.data_information_form = { id: 1 } as any
    store.data_performance_form = { id: 2 } as any
    store.data_restatement_form = { id: 3 } as any

    // Act
    store._resetBankingAccountForms()

    // Assert
    expect(store.data_information_form).toBeNull()
    expect(store.data_performance_form).toBeNull()
    expect(store.data_restatement_form).toBeNull()
  })
})

describe('_exportBankingAccountsExcel', () => {
  let store: ReturnType<typeof useBankingAccountsV1>
  let mockGet: jest.Mock
  let mockCreateElement: jest.Mock
  let mockCreateObjectURL: jest.Mock
  let mockRevokeObjectURL: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBankingAccountsV1()
    jest.clearAllMocks()

    // Mock DOM methods
    mockCreateElement = jest.fn().mockReturnValue({
      href: '',
      setAttribute: jest.fn(),
      click: jest.fn(),
      remove: jest.fn(),
    })
    mockCreateObjectURL = jest.fn().mockReturnValue('mocked-url')
    mockRevokeObjectURL = jest.fn()

    Object.defineProperty(document, 'createElement', {
      value: mockCreateElement,
      writable: true,
    })
    Object.defineProperty(document.body, 'appendChild', {
      value: jest.fn(),
      writable: true,
    })
    Object.defineProperty(URL, 'createObjectURL', {
      value: mockCreateObjectURL,
      writable: true,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: mockRevokeObjectURL,
      writable: true,
    })

    mockGet = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
  })

  it('should export banking accounts excel successfully', async () => {
    // Arrange
    const params = 'filter[business]=1&filter[bank]=2'
    const mockBlob = new Blob(['excel data'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    mockGet.mockResolvedValue({
      data: mockBlob,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })

    // Act
    await store._exportBankingAccountsExcel(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-accounts/export?${params}`,
      { responseType: 'blob' }
    )
    expect(mockCreateElement).toHaveBeenCalledWith('a')
    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('mocked-url')
  })

  it('should export banking accounts excel with correct filename format', async () => {
    // Arrange
    const params = 'filter[business]=1'
    const mockBlob = new Blob(['excel data'])
    const mockLink = {
      href: '',
      setAttribute: jest.fn(),
      click: jest.fn(),
      remove: jest.fn(),
    }

    mockCreateElement.mockReturnValue(mockLink)
    mockGet.mockResolvedValue({
      data: mockBlob,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    })

    const mockDateConstructor = jest.fn().mockImplementation(() => ({
      getFullYear: () => 2025,
      getMonth: () => 8,
      getDate: () => 1,
      toISOString: () => '2025-09-01T00:00:00.000Z',
    }))

    const OriginalDate = global.Date
    global.Date = mockDateConstructor as any

    // Act
    await store._exportBankingAccountsExcel(params)

    global.Date = OriginalDate

    // Assert
    expect(mockLink.setAttribute).toHaveBeenCalledWith(
      'download',
      'Listado_de_cuentas_bancarias_2025-09-01.xlsx'
    )
  })

  it('should handle export error with blob response', async () => {
    // Arrange
    const params = 'filter[business]=1'
    const errorBlob = new Blob(
      [JSON.stringify({ message: 'Error personalizado' })],
      {
        type: 'application/json',
      }
    )

    mockGet.mockRejectedValue({
      response: {
        status: 422,
        headers: { 'content-type': 'application/json' },
        data: errorBlob,
      },
    })

    // Mock blob.text() method
    Object.defineProperty(errorBlob, 'text', {
      value: jest
        .fn()
        .mockResolvedValue(JSON.stringify({ message: 'Error personalizado' })),
      writable: true,
    })

    // Act
    await store._exportBankingAccountsExcel(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-accounts/export?${params}`,
      { responseType: 'blob' }
    )
    // Should not create download elements on error
    expect(mockCreateObjectURL).not.toHaveBeenCalled()
  })

  it('should handle export error correctly', async () => {
    // Arrange
    const params = 'filter[business]=1'

    mockGet.mockRejectedValue({
      response: {
        status: 422,
        data: { message: 'Error personalizado' },
      },
    })

    // Act
    await store._exportBankingAccountsExcel(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-accounts/export?${params}`,
      { responseType: 'blob' }
    )
    // Should not create download elements on error
    expect(mockCreateObjectURL).not.toHaveBeenCalled()
  })

  it('should handle 404 error correctly', async () => {
    // Arrange
    const params = 'filter[business]=1'

    mockGet.mockRejectedValue({
      response: {
        status: 404,
        data: { message: 'Not found' },
      },
    })

    // Act
    await store._exportBankingAccountsExcel(params)

    // Assert
    expect(mockGet).toHaveBeenCalled()
    expect(mockCreateObjectURL).not.toHaveBeenCalled()
  })

  it('should handle network error', async () => {
    // Arrange
    const params = 'filter[business]=1'

    mockGet.mockRejectedValue({
      message: 'Network Error',
    })

    // Act
    await store._exportBankingAccountsExcel(params)

    // Assert
    expect(mockGet).toHaveBeenCalled()
    expect(mockCreateObjectURL).not.toHaveBeenCalled()
  })

  it('should handle empty params', async () => {
    // Arrange
    const params = ''
    const mockBlob = new Blob(['excel data'])

    mockGet.mockResolvedValue({
      data: mockBlob,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    })

    // Act
    await store._exportBankingAccountsExcel(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-accounts/export?`,
      { responseType: 'blob' }
    )
  })
})
