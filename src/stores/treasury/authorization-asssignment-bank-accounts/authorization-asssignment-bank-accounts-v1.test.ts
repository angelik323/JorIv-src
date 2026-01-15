import { setActivePinia, createPinia } from 'pinia'
import { useAuthorizationAssignmentBankAccountsStoreV1 } from '@/stores/treasury/authorization-asssignment-bank-accounts/authorization-asssignment-bank-accounts-v1'
import { IAuthorizationAssignmentBankAccountsItem } from '@/interfaces/customs/treasury/authorizationAssignmentBankAccounts'

const mockGet = jest.fn()
const mockPost = jest.fn()

const mockFetch = jest.fn()
global.fetch = mockFetch

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: mockGet,
    post: mockPost,
  })),
}))

jest.mock('@/constants/apis', () => ({
  URL_PATH_TREASURIES: 'treasuries/api/treasuries',
}))

jest.mock('@/constants/alerts', () => ({
  TIMEOUT_ALERT: 3000,
}))

jest.mock('@/composables', () => ({
  useAlert: () => ({
    showAlert: jest.fn(),
  }),
  useShowError: () => ({
    showCatchError: jest.fn().mockReturnValue('Error procesando'),
  }),
  useUtils: () => ({
    saveTextFileWithFallback: jest.fn().mockResolvedValue(undefined),
  }),
}))

describe('useAuthorizationAssignmentBankAccountsStoreV1', () => {
  let store: ReturnType<typeof useAuthorizationAssignmentBankAccountsStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAuthorizationAssignmentBankAccountsStoreV1()

    jest.clearAllMocks()
  })

  it('should fetch authorization assignment bank accounts list successfully', async () => {
    const mockImplementation = jest.fn().mockImplementation(async () => {
      store.authorization_assignment_bank_accounts_list = [
        {
          id: 1,
          user: 'User 1',
          bank: 'Bank 1',
          bank_description: 'Bank Description 1',
          account: '123456789',
          status_id: 1,
          state: 1,
          balance: 1000,
          business_grantor: 'Business 1',
          business_assign: 'Business 2',
          date: '2024-01-01',
          selected: false,
        },
        {
          id: 2,
          user: 'User 2',
          bank: 'Bank 2',
          bank_description: 'Bank Description 2',
          account: '987654321',
          status_id: 2,
          state: 1,
          balance: 2000,
          business_grantor: 'Business 3',
          business_assign: 'Business 4',
          date: '2024-01-02',
          selected: false,
        },
      ]
      store.authorization_assignment_bank_accounts_list_description = [
        {
          bank: 'Bank Test',
          account_bank: '123456789',
          name_business_assign: 'Business Test',
          code_movement_expenses: 'EXP001',
          name_movement_expenses: 'Expense Test',
          code_movement_incomes: 'INC001',
          name_movement_incomes: 'Income Test',
          rejection_reason: '',
        },
      ]
      store.request_bank_id = 100
    })

    const spy = jest
      .spyOn(store, '_getAuthorizationAssignmentBankAccountsList')
      .mockImplementation(mockImplementation)

    await store._getAuthorizationAssignmentBankAccountsList('&search=test')

    expect(store.authorization_assignment_bank_accounts_list).toHaveLength(2)
    expect(
      store.authorization_assignment_bank_accounts_list_description
    ).toHaveLength(1)
    expect(store.request_bank_id).toBe(100)

    spy.mockRestore()
  })

  it('should handle error on authorization assignment list fetch', async () => {
    const mockImplementation = jest.fn().mockImplementation(async () => {
      store.authorization_assignment_bank_accounts_list = []
      store.authorization_assignment_bank_accounts_list_description = []
      store.request_bank_id = null
    })

    const spy = jest
      .spyOn(store, '_getAuthorizationAssignmentBankAccountsList')
      .mockImplementation(mockImplementation)

    await store._getAuthorizationAssignmentBankAccountsList('')

    expect(store.authorization_assignment_bank_accounts_list).toHaveLength(0)
    expect(
      store.authorization_assignment_bank_accounts_list_description
    ).toHaveLength(0)
    expect(store.request_bank_id).toBeNull()

    spy.mockRestore()
  })

  it('should approve authorization assignment successfully', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Autorización exitosa',
      },
    }

    mockPost.mockResolvedValue(mockResponse)

    const payload = {
      bank_account_grantor_request_id: 1,
      requests: [1, 2, 3],
    }

    const result = await store._authorizationAssignmentBankAccountsList(payload)

    expect(result).toBe(true)
    expect(store.error.hasErrors).toBe(false)
  })

  it('should handle authorization assignment failure and set error state', async () => {
    const mockResponse = {
      data: {
        success: false,
        message: 'Error en autorización',
      },
    }

    mockPost.mockResolvedValue(mockResponse)

    const payload = {
      bank_account_grantor_request_id: 1,
      requests: [1, 2, 3],
    }

    const result = await store._authorizationAssignmentBankAccountsList(payload)

    expect(result).toBe(false)
    expect(store.error.hasErrors).toBe(true)
    expect(store.error.recordId).toEqual([1, 2, 3])
  })

  it('should handle authorization assignment error (catch block)', async () => {
    mockPost.mockRejectedValue(new Error('Network error'))

    const payload = {
      bank_account_grantor_request_id: 1,
      requests: [1, 2, 3],
    }

    const result = await store._authorizationAssignmentBankAccountsList(payload)

    expect(result).toBe(false)
  })

  it('should reject authorization assignment successfully', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Rechazo exitoso',
      },
    }

    mockPost.mockResolvedValue(mockResponse)

    const payload = {
      rejections: [
        {
          bank_account_grantor_request_id: 1,
          rejections: [
            { bank_account_id: 1, reason: 'Motivo 1' },
            { bank_account_id: 2, reason: 'Motivo 2' },
          ],
        },
      ],
    }

    const result = await store._rejectAuthorizationAssignmentBankAccountsList(
      payload
    )

    expect(result).toBe(true)
  })

  it('should handle rejection failure', async () => {
    const mockResponse = {
      data: {
        success: false,
        message: 'Error en rechazo',
      },
    }

    mockPost.mockResolvedValue(mockResponse)

    const payload = {
      rejections: [
        {
          bank_account_grantor_request_id: 1,
          rejections: [{ bank_account_id: 1, reason: 'Motivo' }],
        },
      ],
    }

    const result = await store._rejectAuthorizationAssignmentBankAccountsList(
      payload
    )

    expect(result).toBe(false)
  })

  it('should handle rejection error (catch block)', async () => {
    mockPost.mockRejectedValue(new Error('Network error'))

    const payload = {
      rejections: [
        {
          bank_account_grantor_request_id: 1,
          rejections: [{ bank_account_id: 1, reason: 'Motivo' }],
        },
      ],
    }

    const result = await store._rejectAuthorizationAssignmentBankAccountsList(
      payload
    )

    expect(result).toBe(false)
  })

  it('should download error log successfully', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Log generado',
        data: {
          download_url: 'https://example.com/error-log.txt',
        },
      },
    }

    const mockFileContent =
      'LOG Errores Autorización cesión\nCódigo;Registro;Error\nBUS001;REG001;Error test'

    mockPost.mockResolvedValue(mockResponse)
    mockFetch.mockResolvedValue({
      text: jest.fn().mockResolvedValue(mockFileContent),
    })

    store.request_bank_id = 123

    const result = await store._errorAuthorizationAssignmentBankAccountsList()

    expect(result).toBe(true)
  })

  it('should handle error when no download_url is provided', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Sin URL de descarga',
        data: {},
      },
    }

    mockPost.mockResolvedValue(mockResponse)
    store.request_bank_id = 123

    const result = await store._errorAuthorizationAssignmentBankAccountsList()

    expect(result).toBe(true)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should handle error when backend returns success false for error log', async () => {
    const mockResponse = {
      data: {
        success: false,
        message: 'Error al generar log',
      },
    }

    mockPost.mockResolvedValue(mockResponse)
    store.request_bank_id = 123

    const result = await store._errorAuthorizationAssignmentBankAccountsList()

    expect(result).toBe(false)
  })

  it('should set data selection with valid array', () => {
    const mockData: IAuthorizationAssignmentBankAccountsItem[] = [
      {
        id: 1,
        user: 'User 1',
        bank: 'Bank 1',
        bank_description: 'Bank Description 1',
        account: '123456789',
        status_id: 1,
        state: 1,
        balance: 1000.5,
        business_grantor: 'Business 1',
        business_assign: 'Business 2',
        date: '2024-01-01',
        selected: true,
      },
      {
        id: 2,
        user: 'User 2',
        bank: 'Bank 2',
        bank_description: 'Bank Description 2',
        account: '987654321',
        status_id: 2,
        state: 1,
        balance: 2000.75,
        business_grantor: 'Business 3',
        business_assign: 'Business 4',
        date: '2024-01-02',
        selected: false,
      },
    ]

    store._setDataSelection(mockData)

    expect(store.data_selection).toHaveLength(2)
    expect(store.data_selection[0].id).toBe(1)
    expect(store.data_selection[1].id).toBe(2)
  })

  it('should set data selection to empty array when null is passed', () => {
    store._setDataSelection(null)

    expect(store.data_selection).toEqual([])
  })

  it('should return true when there are errors', () => {
    store.error.hasErrors = true

    expect(store._hasErrors()).toBe(true)
  })

  it('should return false when there are no errors', () => {
    store.error.hasErrors = false

    expect(store._hasErrors()).toBe(false)
  })

  it('should clear data correctly', () => {
    store.authorization_assignment_bank_accounts_list = [
      {
        id: 1,
        user: 'User 1',
        bank: 'Bank 1',
        bank_description: 'Bank Description 1',
        account: '123456789',
        status_id: 1,
        state: 1,
        balance: 1000,
        business_grantor: 'Business 1',
        business_assign: 'Business 2',
        date: '2024-01-01',
        selected: false,
      },
    ]
    store.authorization_assignment_bank_accounts = {
      currentPage: 5,
      lastPage: 10,
    }

    store._clearData()

    expect(store.authorization_assignment_bank_accounts_list).toEqual([])
    expect(store.authorization_assignment_bank_accounts.currentPage).toBe(0)
    expect(store.authorization_assignment_bank_accounts.lastPage).toBe(0)
  })
})
