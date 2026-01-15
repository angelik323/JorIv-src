import { setActivePinia, createPinia } from 'pinia'
import { useGroundsBlockingInvestmentPlanListV1 } from './grounds-blocking-investment-plan-v1'
import { executeApi } from '@/apis'
import { URL_PATH_FICS } from '@/constants/apis'

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
  const showCatchErrorMock = jest.fn((err) => err.message || 'error')

  return {
    useAlert: jest.fn(() => ({ showAlert: showAlertMock })),
    useShowError: jest.fn(() => ({ showCatchError: showCatchErrorMock })),
    showAlertMock,
    showCatchErrorMock,
  }
})

describe('useGroundsBlockingInvestmentPlanListV1', () => {
  let store: ReturnType<typeof useGroundsBlockingInvestmentPlanListV1>
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGroundsBlockingInvestmentPlanListV1()
    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock
    jest.clearAllMocks()
  })

  it('should fetch list with status=all and update state', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: [{ id: 1 }],
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getGroundsBlockingInvestment('status=all')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/blocking-reason-investment/get-index?status=all`
    )
    expect(store.rounds_blocking_investment_plan_list).toEqual([{ id: 1 }])
    expect(showAlertMock).toHaveBeenCalledWith(
      'ok',
      'success',
      undefined,
      expect.any(Number)
    )
  })

  it('should fetch list with status=all and show error on failure', async () => {
    const mockResponse = {
      data: {
        success: false,
        message: 'error',
        data: [{ id: 1 }],
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getGroundsBlockingInvestment('status=all')

    expect(showAlertMock).toHaveBeenCalledWith(
      'error',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('should fetch list with pagination params and update pages', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'list loaded',
        data: { data: [{ id: 2 }], current_page: 3, last_page: 5 },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getGroundsBlockingInvestment('&filter=test')

    expect(store.rounds_blocking_investment_plan_list).toEqual([{ id: 2 }])
    expect(store.rounds_blocking_investment_plan_pages).toEqual({
      currentPage: 3,
      lastPage: 5,
    })
    expect(showAlertMock).toHaveBeenCalled()
  })

  it('should fetch list with pagination and show error on failure', async () => {
    const mockResponse = {
      data: {
        success: false,
        message: 'failed to load',
        data: { data: [{ id: 2 }], current_page: 1, last_page: 1 },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getGroundsBlockingInvestment('&filter=test')

    expect(showAlertMock).toHaveBeenCalledWith(
      'failed to load',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('should call showCatchError on get list error', async () => {
    const mockError = new Error('fail')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getGroundsBlockingInvestment('&filter=test')

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'fail',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('should fetch by id and set response', async () => {
    const mockData = { id: 99 }
    const mockResponse = {
      data: {
        success: true,
        message: 'found',
        data: mockData,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdGroundsBlockingInvestment(99)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/blocking-reason-investment/get-by-id/99`
    )
    expect(store.rounds_blocking_investment_plan_response).toEqual(mockData)
    expect(showAlertMock).toHaveBeenCalled()
  })

  it('should handle error on fetch by id', async () => {
    const mockError = new Error('not found')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdGroundsBlockingInvestment(99)

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'not found',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('should fetch by id with success false', async () => {
    const mockResponse = {
      data: {
        success: false,
        message: 'not found',
        data: null,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdGroundsBlockingInvestment(99)

    expect(showAlertMock).toHaveBeenCalledWith(
      'not found',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('should fetch by id when responseData is null', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'no data',
        data: null,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdGroundsBlockingInvestment(99)

    expect(store.rounds_blocking_investment_plan_response).toBeNull()
    expect(showAlertMock).toHaveBeenCalled()
  })

  it('should create item and return id', async () => {
    const mockResponse = {
      data: { success: true, message: 'created', data: { id: 10 } },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const id = await store._createGroundsBlockingInvestment({
      status_id: 'test',
    })

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/blocking-reason-investment`,
      { status_id: 'test' }
    )
    expect(id).toBe(10)
    expect(showAlertMock).toHaveBeenCalled()
  })

  it('should handle error on create', async () => {
    const mockError = new Error('create failed')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const id = await store._createGroundsBlockingInvestment({
      status_id: 'test',
    })

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'create failed',
      'error',
      undefined,
      expect.any(Number)
    )
    expect(id).toBe(0)
  })

  it('should create item with success false', async () => {
    const mockResponse = {
      data: { success: false, message: 'creation failed', data: null },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const id = await store._createGroundsBlockingInvestment({
      status_id: 'test',
    })

    expect(showAlertMock).toHaveBeenCalledWith(
      'creation failed',
      'error',
      undefined,
      expect.any(Number)
    )
    expect(id).toBe(0)
  })

  it('should update item and return true', async () => {
    const mockResponse = { data: { success: true, message: 'updated' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateGroundsBlockingInvestment(
      { status_id: 'x' },
      5
    )

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/blocking-reason-investment/5`,
      { status_id: 'x' }
    )
    expect(result).toBe(true)
  })

  it('should handle error on update', async () => {
    const mockError = new Error('update failed')
    const mockPut = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateGroundsBlockingInvestment(
      { status_id: 'x' },
      5
    )

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'update failed',
      'error',
      undefined,
      expect.any(Number)
    )
    expect(result).toBe(false)
  })

  it('should update item with success false', async () => {
    const mockResponse = { data: { success: false, message: 'update denied' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateGroundsBlockingInvestment(
      { status_id: 'x' },
      5
    )

    expect(showAlertMock).toHaveBeenCalledWith(
      'update denied',
      'error',
      undefined,
      expect.any(Number)
    )
    expect(result).toBe(false)
  })

  it('should update status and return true', async () => {
    const mockResponse = { data: { success: true, message: 'status changed' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateStatus(7)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/blocking-reason-investment/switch-status/7`
    )
    expect(result).toBe(true)
  })

  it('should handle error on update status', async () => {
    const mockError = new Error('status update failed')
    const mockPut = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateStatus(7)

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'status update failed',
      'error',
      undefined,
      expect.any(Number)
    )
    expect(result).toBe(false)
  })

  it('should update status with success false', async () => {
    const mockResponse = {
      data: { success: false, message: 'status change denied' },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateStatus(7)

    expect(showAlertMock).toHaveBeenCalledWith(
      'status change denied',
      'error',
      undefined,
      expect.any(Number)
    )
    expect(result).toBe(false)
  })

  it('should set data_information_form', () => {
    store._setDataInformationForm({ id: 1 })
    expect(store.rounds_blocking_investment_plan_response).toEqual({ id: 1 })

    store._setDataInformationForm(null)
    expect(store.rounds_blocking_investment_plan_response).toBeNull()
  })

  it('should clear data', () => {
    store.rounds_blocking_investment_plan_list = [{ id: 1 }]
    store.rounds_blocking_investment_plan_pages = {
      currentPage: 2,
      lastPage: 5,
    }

    store._clearData()

    expect(store.rounds_blocking_investment_plan_list).toEqual([])
    expect(store.rounds_blocking_investment_plan_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.rounds_blocking_investment_plan_response).toBeNull()
  })
})
