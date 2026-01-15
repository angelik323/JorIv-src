import { useTreasuryCancellationsStoreV1 } from './treasury-cancellations-v1'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error') })),
}))

describe('useTreasuryCancellationsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches treasury cancellations list and updates state on success', async () => {
    const store = useTreasuryCancellationsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Success',
        data: [{ id: 1, description: 'Ingreso' }],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('page=2')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/treasury-cancellation/all?page=2`
    )

    expect(store.treasury_cancellations_list).toEqual([
      { id: 1, description: 'Ingreso' },
    ])
  })

  it('returns data on _showAction success', async () => {
    const store = useTreasuryCancellationsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Found',
        data: { id: 1, description: 'Egreso' },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction('1', 'param=value')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/treasury-cancellation/show/1?param=value`
    )
    expect(result).toEqual(mockResponse.data.data)
  })

  it('returns null and shows alert on _showAction failure', async () => {
    const store = useTreasuryCancellationsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction('99', '')

    expect(mockGet).toHaveBeenCalled()
    expect(result).toBe(null)
  })

  it('creates a treasury cancellation and returns success true', async () => {
    const store = useTreasuryCancellationsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Creado',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      id: 1,
      description: 'Nuevo movimiento',
      type: 'ingreso',
      annulate_date: '2024-06-01',
      period: '2024-06',
      observations: 'Test observation',
      annulate_code_id: 123,
      cancellation_code_id: 456,
      bank_id: 10,
      bank_account_id: 20,
    }
    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/treasury-cancellation/annulate/${payload.id}`,
      payload
    )
    expect(result).toBe(true)
  })

  it('returns false on _createAction error', async () => {
    const store = useTreasuryCancellationsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction({
      id: '',
      annulate_date: '',
      period: '',
      observations: '',
      annulate_code_id: 0,
      cancellation_code_id: 0,
      bank_id: '',
      bank_account_id: '',
    })

    expect(result).toBe(false)
  })

  it('deletes checks successfully and returns true', async () => {
    const store = useTreasuryCancellationsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Checks deleted',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = { consecutives: [1, 2, 3] }
    const result = await store._deleteChecksAction(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/treasury-cancellation/annulate-inexistent-checks`,
      payload
    )
    expect(result).toBe(true)
  })

  it('returns false on _deleteChecksAction error', async () => {
    const store = useTreasuryCancellationsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._deleteChecksAction({ consecutives: [99] })

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('shows error alert when _listAction fails', async () => {
    const store = useTreasuryCancellationsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('page=1')

    expect(mockGet).toHaveBeenCalled()
    expect(store.treasury_cancellations_list).toEqual([])
  })
})
