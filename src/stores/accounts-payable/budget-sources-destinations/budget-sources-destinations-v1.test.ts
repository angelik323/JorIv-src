import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { useBudgetSourcesDestinationsStore } from '@/stores/accounts-payable/budget-sources-destinations'
import { IBudgetSourceDestination } from '@/interfaces/customs/accounts-payable/BudgetSourcesDestinations'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
}))

describe('useBudgetSourcesDestinationsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('lists sources and destinations successfully', async () => {
    const store = useBudgetSourcesDestinationsStore('v1')
    store.budget_sources_destinations_list = [
      { id: 999 } as IBudgetSourceDestination,
    ]
    store.budget_sources_destinations_pages = { currentPage: 5, lastPage: 10 }

    const mockResponse = {
      data: {
        success: true,
        message: 'List',
        data: {
          data: [{ id: 1, source_module: 'CXP', destination_module: 'TES' }],
          current_page: 1,
          last_page: 2,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ page: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTS_PAYABLE}/sources-destinations`,
      { params: { page: 1, paginate: 1 } }
    )
    expect(store.budget_sources_destinations_list).toEqual(
      mockResponse.data.data.data
    )
    expect(store.budget_sources_destinations_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('handles error on list', async () => {
    const store = useBudgetSourcesDestinationsStore('v1')
    store.budget_sources_destinations_list = [
      { id: 999 } as IBudgetSourceDestination,
    ]
    store.budget_sources_destinations_pages = { currentPage: 5, lastPage: 10 }

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ page: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTS_PAYABLE}/sources-destinations`,
      { params: { page: 1, paginate: 1 } }
    )
    expect(store.budget_sources_destinations_list).toEqual([])
    expect(store.budget_sources_destinations_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('creates a source/destination successfully', async () => {
    const store = useBudgetSourcesDestinationsStore('v1')
    const payload = {
      source_module: 'CXP',
      source_process: 'Compromiso',
      source_reference_id: 1,
      source_description: 'Fuente 1',
      destination_module: 'TES',
      destination_process: 'Giro',
      destination_reference_id: 2,
      destination_description: 'Destino 2',
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTS_PAYABLE}/sources-destinations`,
      payload
    )
  })

  it('handles error on create', async () => {
    const store = useBudgetSourcesDestinationsStore('v1')
    const payload = {
      source_module: 'CXP',
      source_process: 'Compromiso',
      source_reference_id: 1,
      source_description: 'Fuente 1',
      destination_module: 'TES',
      destination_process: 'Giro',
      destination_reference_id: 2,
      destination_description: 'Destino 2',
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(result).toBe(false)
  })

  it('deletes a source/destination successfully', async () => {
    const store = useBudgetSourcesDestinationsStore('v1')
    const id = 1
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteAction(id)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTS_PAYABLE}/sources-destinations/${id}`
    )
  })

  it('handles error on delete', async () => {
    const store = useBudgetSourcesDestinationsStore('v1')
    const id = 1
    const mockDelete = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteAction(id)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTS_PAYABLE}/sources-destinations/${id}`
    )
  })

  it('clears data with _clearData', () => {
    const store = useBudgetSourcesDestinationsStore('v1')
    store.budget_sources_destinations_list = [
      { id: 1 },
    ] as Array<IBudgetSourceDestination>
    store.budget_sources_destinations_pages = { currentPage: 3, lastPage: 4 }

    store._clearData()

    expect(store.budget_sources_destinations_list).toEqual([])
    expect(store.budget_sources_destinations_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
