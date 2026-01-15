import { setActivePinia, createPinia } from 'pinia'
import { useBankAccountBalancesV1 } from './bank-account-balances-v1'
import { executeApi } from '@/apis'

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
}))

describe('useBankAccountBalancesV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of bank account balances', async () => {
    const store = useBankAccountBalancesV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          data: [
            {
              id: 2,
              business_id: 1,
              bank_id: 29,
              bank_account_id: 1,
              currency: 'Extranjera',
              initial_balance_local_currency: '4000000.00',
              initial_balance_foreign_currency: '100.00',
              opening_date: '2000-11-25',
              initial_balance_date: '2025-05-21',
            },
          ],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction()

    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/initial-balances?paginate=1&rows=20'
    )
    expect(store.bank_account_balances_list).toHaveLength(1)
    expect(store.bank_account_balances_list[0].id).toBe(2)
    expect(store.bank_account_balances_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('handles error when fetching list of bank account balances', async () => {
    const store = useBankAccountBalancesV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')

    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/initial-balances?paginate=1&rows=20'
    )
    expect(store.bank_account_balances_list).toEqual([])
  })

  it('fetches bank account balance by ID', async () => {
    const store = useBankAccountBalancesV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          id: 2,
          business_id: 1,
          bank_id: 29,
          bank_account_id: 1,
          currency: 'Extranjera',
          initial_balance_local_currency: '4000000.00',
          initial_balance_foreign_currency: '100.00',
          opening_date: '2000-11-25',
          initial_balance_date: '2025-05-21',
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdBankAccountBalances(2)

    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/initial-balances/2'
    )
    expect(store.type_accont_balances_request?.id).toBe(2)
  })

  it('handles error when fetching bank account balance by ID', async () => {
    const store = useBankAccountBalancesV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdBankAccountBalances(1)

    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/initial-balances/1'
    )
    expect(store.type_accont_balances_request).toBeNull()
  })

  it('creates a new bank account balance', async () => {
    const store = useBankAccountBalancesV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
        data: {
          id: 2,
          business_id: 1,
          bank_id: 29,
          bank_account_id: 1,
          currency: 'Extranjera',
          initial_balance_local_currency: '4000000.00',
          initial_balance_foreign_currency: '100.00',
          opening_date: '2000-11-25',
          initial_balance_date: '2025-05-21',
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      id: 2,
      business_id: 1,
      bank_id: 29,
      bank_account_id: 1,
      currency: 'Extranjera',
      initial_balance_local_currency: '4000000.00',
      initial_balance_foreign_currency: '100.00',
      opening_date: '2000-11-25',
      initial_balance_date: '2025-05-21',
    }
    const result = await store._createBankAccountBalances(payload)

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/initial-balances',
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error when creating a new bank account balance', async () => {
    const store = useBankAccountBalancesV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createBankAccountBalances({
      id: 2,
      business_id: 1,
      bank_id: 29,
      bank_account_id: 1,
      currency: 'Extranjera',
      initial_balance_local_currency: '4000000.00',
      initial_balance_foreign_currency: '100.00',
      opening_date: '2000-11-25',
      initial_balance_date: '2025-05-21',
    })

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/initial-balances',
      {
        id: 2,
        business_id: 1,
        bank_id: 29,
        bank_account_id: 1,
        currency: 'Extranjera',
        initial_balance_local_currency: '4000000.00',
        initial_balance_foreign_currency: '100.00',
        opening_date: '2000-11-25',
        initial_balance_date: '2025-05-21',
      }
    )
    expect(result).toBe(false)
  })

  it('updates a bank account balances', async () => {
    const store = useBankAccountBalancesV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = {
      id: 2,
      business_id: 1,
      bank_id: 29,
      bank_account_id: 1,
      currency: 'Extranjera',
      initial_balance_local_currency: '4000000.00',
      initial_balance_foreign_currency: '100.00',
      opening_date: '2000-11-25',
      initial_balance_date: '2025-05-21',
    }
    const result = await store._updateBankAccountBalances(payload, 2)

    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/initial-balances/2',
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error when updating a bank account balance fails', async () => {
    const store = useBankAccountBalancesV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = {
      id: 2,
      business_id: 1,
      bank_id: 29,
      bank_account_id: 1,
      currency: 'Extranjera',
      initial_balance_local_currency: '4000000.00',
      initial_balance_foreign_currency: '100.00',
      opening_date: '2000-11-25',
      initial_balance_date: '2025-05-21',
    }
    const result = await store._updateBankAccountBalances(payload, 2)

    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/initial-balances/2',
      payload
    )
    expect(result).toBe(false)
  })

  it('change status bank account balance', async () => {
    const store = useBankAccountBalancesV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Deleted',
      },
    })
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: { data: [] },
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({
      delete: mockDelete,
      get: mockGet,
    })

    await store._changeStatusAction(1)

    expect(mockDelete).toHaveBeenCalledWith(
      'treasuries/api/treasuries/initial-balances/1'
    )
    expect(mockGet).toHaveBeenCalled()
  })

  it('handles error when changing status of bank account balance fails', async () => {
    const store = useBankAccountBalancesV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error(' Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._changeStatusAction(1)

    expect(mockDelete).toHaveBeenCalledWith(
      'treasuries/api/treasuries/initial-balances/1'
    )
  })
})
