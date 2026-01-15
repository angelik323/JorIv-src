// Vue - Pinia
import { executeApi } from '@/apis'
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import { IInvestmentPlanOperationPayload } from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Stores
import { useInvestmentPlanOperationStoreV1 } from './investment-plan-operations-v1'

//Constants
import { URL_PATH_FICS } from '@/constants/apis'

const URL_PATH = `${URL_PATH_FICS}/operation-investment-plans`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useInvestmentPlanOperationStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should clean investment plan operation data', () => {
    const store = useInvestmentPlanOperationStoreV1()

    store.investment_plan_operations.list = []
    store.investment_plan_operations.pages.currentPage = 2
    store.investment_plan_operations.pages.lastPage = 3

    store._cleanInvestmentPlanOperationData()

    expect(store.investment_plan_operations.list).toEqual([])
    expect(store.investment_plan_operations.pages.currentPage).toBe(1)
    expect(store.investment_plan_operations.pages.lastPage).toBe(1)
  })

  it('should fetch investment plan operation list and update state on success', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [{ id: 1, value: 1000 }],
          current_page: 1,
          last_page: 1,
        },
        message: 'Listado obtenido exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { filter: 'test' }

    await store._getInvestmentPlanOperationList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.investment_plan_operations.list).toEqual(
      mockResponse.data.data.data
    )
    expect(store.investment_plan_operations.pages.currentPage).toBe(1)
    expect(store.investment_plan_operations.pages.lastPage).toBe(1)
  })

  it('should handle error when fetching investment plan operation list', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { filter: 'test' }

    await store._getInvestmentPlanOperationList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.investment_plan_operations.list).toEqual([])
  })

  it('should store an investment plan operation successfully', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1, value: 1000 },
        message: 'Operación registrada exitosamente.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IInvestmentPlanOperationPayload = {
      type: 'aporte',
      subtype: 'transaccional',
      value: 1234,
      operation_office_id: 1,
      fiduciary_investment_plan_id: 1,
      collective_investment_fund_id: 1,
      state_id: 25,
    }

    const result = await store._storeOperation(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(true)
    expect(store.stored_investment_plan_operation).toEqual(
      mockResponse.data.data
    )
  })

  it('should handle error when storing an investment plan operation', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const mockError = new Error('Network Error')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IInvestmentPlanOperationPayload = {
      type: 'aporte',
      subtype: 'transaccional',
      value: 1000,
      operation_office_id: 1,
      fiduciary_investment_plan_id: 1,
      collective_investment_fund_id: 1,
      state_id: 1,
    }

    const result = await store._storeOperation(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(false)
  })

  it('should store an investment plan operation detail successfully', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Detalle registrado exitosamente.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      operation_investment_plan_id: 1,
      treasury_collection_form_id: 1,
      total_operation: 1000,
      value: 1000,
      check: 0,
      check_bank_id: 1,
      observation: 'Test',
      treasury_collection_bank_id: 1,
      fic_account_bank_id: 1,
      account_bank_id: 1,
      state_id: 1,
    }

    const result = await store._storeOperationDetail(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH}/details-operation`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should handle error when storing an investment plan operation detail', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const mockError = new Error('Network Error')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      operation_investment_plan_id: 1,
      treasury_collection_form_id: 1,
      total_operation: 1000,
      value: 1000,
      check: 0,
      check_bank_id: 1,
      observation: 'Test',
      treasury_collection_bank_id: 1,
      fic_account_bank_id: 1,
      account_bank_id: 1,
      state_id: 1,
    }

    const result = await store._storeOperationDetail(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH}/details-operation`,
      payload
    )
    expect(result).toBe(false)
  })

  it('should fetch a single investment plan operation successfully', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Registro obtenido correctamente.',
        data: { id: 10, value: 5000 },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(10)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/10`)
    expect(result).toEqual(mockResponse.data.data)
  })

  it('should show alert when showAction response is not successful', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const { showAlertMock } = jest.requireMock('@/composables')
    const mockResponse = {
      data: {
        success: false,
        message: 'No se encontró el registro.',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._showAction(5)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/5`)
    expect(showAlertMock).toHaveBeenCalledWith(
      'No se encontró el registro.',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('should handle error in showAction and show alert', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const { showAlertMock, showCatchErrorMock } =
      jest.requireMock('@/composables')
    const mockGet = jest.fn().mockRejectedValue(new Error('Error de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(99)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/99`)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(),
      'error',
      undefined,
      expect.any(Number)
    )
    expect(result).toBeNull()
  })

  it('should fetch operation details successfully and update list', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const { showAlertMock } = jest.requireMock('@/composables')

    const mockResponse = {
      data: {
        success: true,
        message: 'Detalles obtenidos correctamente.',
        data: [{ id: 1, value: 1000 }],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._showDetailsAction(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1/details`)
    expect(store.monetary_operations_list).toEqual(mockResponse.data.data)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Detalles obtenidos correctamente.',
      'success',
      undefined,
      expect.any(Number)
    )
  })

  it('should show alert when showDetailsAction response is not successful', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const { showAlertMock } = jest.requireMock('@/composables')

    const mockResponse = {
      data: {
        success: false,
        message: 'No se encontraron detalles.',
        data: [],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._showDetailsAction(2)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/2/details`)
    expect(store.monetary_operations_list).toEqual([])
    expect(showAlertMock).toHaveBeenCalledWith(
      'No se encontraron detalles.',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('should handle error in showDetailsAction and show alert', async () => {
    const store = useInvestmentPlanOperationStoreV1()
    const { showAlertMock, showCatchErrorMock } =
      jest.requireMock('@/composables')

    const mockGet = jest.fn().mockRejectedValue(new Error('Falla inesperada'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showDetailsAction(3)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/3/details`)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(),
      'error',
      undefined,
      expect.any(Number)
    )
    expect(result).toBeNull()
  })
})
