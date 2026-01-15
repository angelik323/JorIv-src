// Vue - Vue Router - Pinia - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import { IAccountingParametersAccountingBlockList } from '@/interfaces/customs/fics/AccountingBlocks'
import {
  IAccountingParametersMovementsForm,
  IAccountingParametersMovementsList,
  IAccountingParametersMovementsView,
} from '@/interfaces/customs/fics/AccountingParametersMovements'

// Utils
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useAccountingParametersAccountingParametersMovementsStoreV1 } from './accounting-parameters-movements-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

const mockShowAlert = jest.fn()
const mockShowCatchError = jest.fn(() => 'catch error')

jest.mock('@/composables/useAlert', () => ({
  useAlert: jest.fn(() => ({ showAlert: mockShowAlert })),
}))

jest.mock('@/composables/useShowError', () => ({
  useShowError: jest.fn(() => ({
    showCatchError: mockShowCatchError,
  })),
}))

const URL_PATH = `${URL_PATH_FICS}/accounting-parameters-movements`

describe('useAccountingParametersAccountingParametersMovementsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list successfully', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockData = {
      data: {
        data: [{ id: 10 }],
        current_page: 3,
        last_page: 9,
        total: 50,
        per_page: 5,
      },
      message: 'List ok',
      success: true,
    }

    const mockGet = jest.fn().mockResolvedValue({ data: mockData })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingParametersMovements('&type=1')

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1&type=1`)

    expect(store.accounting_parameters_movements_list).toEqual([{ id: 10 }])

    expect(store.accounting_parameters_movements_pages).toEqual({
      currentPage: 3,
      lastPage: 9,
      total_items: 50,
      per_page: 5,
    })

    expect(mockShowAlert).toHaveBeenCalledWith(
      'List ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error in list', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingParametersMovements('&x=1')

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(store.accounting_parameters_movements_list).toEqual([])
    expect(store.accounting_parameters_movements_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
      total_items: 0,
      per_page: 0,
    })
  })

  it('fetches by id successfully', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const response = {
      data: {
        data: { id: 5, name: 'Test' },
        message: 'Ok',
        success: true,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(response)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdAccountingParametersMovements(5)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/5`)
    expect(store.accounting_parameters_movements_view).toEqual({
      id: 5,
      name: 'Test',
    })

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error in get by id', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdAccountingParametersMovements(1)

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(store.accounting_parameters_movements_view).toBe(null)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('creates successfully', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const payload = { accounting_block_id: 2 }

    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Created' } })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAccountingParametersMovements(
      payload as IAccountingParametersMovementsForm
    )

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(true)

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Created',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error in create', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const payload = { accounting_block_id: 1 }
    const mockPost = jest.fn().mockRejectedValue(new Error('X'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAccountingParametersMovements(
      payload as IAccountingParametersMovementsForm
    )

    expect(result).toBe(false)
    expect(mockShowCatchError).toHaveBeenCalled()
  })

  it('updates successfully', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const payload = { accounting_block_id: 1 }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAccountingParametersMovements(
      payload as IAccountingParametersMovementsForm,
      10
    )

    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/10`, payload)
    expect(result).toBe(true)
  })

  it('handles error in update', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockPut = jest.fn().mockRejectedValue(new Error('e'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAccountingParametersMovements(
      {} as IAccountingParametersMovementsForm,
      99
    )

    expect(result).toBe(false)
    expect(mockShowCatchError).toHaveBeenCalled()
  })

  it('deletes successfully', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAccountingParametersMovements(7)

    expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH}/7`)
    expect(result).toBe(true)
  })

  it('handles error in delete', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockDelete = jest.fn().mockRejectedValue(new Error('bad'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAccountingParametersMovements(7)

    expect(result).toBe(false)
    expect(mockShowCatchError).toHaveBeenCalled()
  })

  it('sets form', () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    store._setAccountingParametersMovementsForm({
      accounting_block_id: 1,
    } as IAccountingParametersMovementsForm | null)
    expect(store.accounting_parameters_movements_form).toEqual({
      accounting_block_id: 1,
    })

    store._setAccountingParametersMovementsForm(null)
    expect(store.accounting_parameters_movements_form).toBe(null)
  })

  it('sets block selected', () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const block = { id: 99, business_group_id: 2 }
    store._setAccountingParametersMovementsBlockSelected(
      block as IAccountingParametersAccountingBlockList | null
    )

    expect(store.accounting_parameters_movements_block_selected).toEqual(block)

    store._setAccountingParametersMovementsBlockSelected(null)
    expect(store.accounting_parameters_movements_block_selected).toBe(null)
  })

  it('clears data', () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    store.accounting_parameters_movements_list = [
      { id: 1 },
    ] as IAccountingParametersMovementsList
    store.accounting_parameters_movements_form = {
      accounting_block_id: 1,
    } as IAccountingParametersMovementsForm | null
    store.accounting_parameters_movements_view = {
      id: 1,
    } as IAccountingParametersMovementsView | null

    store.accounting_parameters_movements_pages = {
      currentPage: 3,
      lastPage: 5,
      total_items: 100,
      per_page: 10,
    }

    store._clearDataAccountingParametersMovements()

    expect(store.accounting_parameters_movements_list).toEqual([])
    expect(store.accounting_parameters_movements_view).toBe(null)
    expect(store.accounting_parameters_movements_form).toBe(null)
    expect(store.accounting_parameters_movements_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
      total_items: 0,
      per_page: 0,
    })
  })
  it('fetches list with success = false', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockData = {
      data: {
        data: [],
        current_page: 0,
        last_page: 0,
        total: 0,
        per_page: 0,
      },
      message: 'List error',
      success: false,
    }

    const mockGet = jest.fn().mockResolvedValue({ data: mockData })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingParametersMovements('&x=1')

    expect(mockShowAlert).toHaveBeenCalledWith(
      'List error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('get by id with success = false', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockData = {
      data: null,
      message: 'Bad',
      success: false,
    }

    const mockGet = jest.fn().mockResolvedValue({ data: mockData })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdAccountingParametersMovements(5)

    expect(store.accounting_parameters_movements_view).toBe(null)

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Bad',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('create success = false', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail create' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAccountingParametersMovements(
      {} as IAccountingParametersMovementsForm
    )

    expect(result).toBe(false)

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Fail create',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('update success = false', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail update' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAccountingParametersMovements(
      {} as IAccountingParametersMovementsForm,
      9
    )

    expect(result).toBe(false)

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Fail update',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('delete success = false', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail delete' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAccountingParametersMovements(1)

    expect(result).toBe(false)

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Fail delete',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('handles list with success = false', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockData = {
      data: {
        data: [],
        current_page: 0,
        last_page: 0,
        total: 0,
        per_page: 0,
      },
      message: 'Error on list',
      success: false,
    }

    const mockGet = jest.fn().mockResolvedValue({ data: mockData })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingParametersMovements('&test=1')

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error on list',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('get by id handles success=false', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const response = {
      data: {
        data: null,
        message: 'Bad',
        success: false,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(response)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdAccountingParametersMovements(10)

    expect(store.accounting_parameters_movements_view).toBe(null)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Bad',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('create handles success=false', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail create' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAccountingParametersMovements(
      {} as IAccountingParametersMovementsForm
    )

    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Fail create',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('update handles success=false', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail update' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAccountingParametersMovements(
      {} as IAccountingParametersMovementsForm,
      1
    )

    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Fail update',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('delete handles success=false', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail delete' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAccountingParametersMovements(20)

    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Fail delete',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('fetches list with missing fields to trigger default values', async () => {
    const store = useAccountingParametersAccountingParametersMovementsStoreV1()

    const mockData = {
      data: {},
      message: 'No fields',
      success: true,
    }

    const mockGet = jest.fn().mockResolvedValue({ data: mockData })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingParametersMovements('&empty=1')

    expect(store.accounting_parameters_movements_list).toEqual([])

    expect(store.accounting_parameters_movements_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
      total_items: 0,
      per_page: 0,
    })

    expect(mockShowAlert).toHaveBeenCalledWith(
      'No fields',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
