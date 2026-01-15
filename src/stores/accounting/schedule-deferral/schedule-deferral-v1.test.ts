import { setActivePinia, createPinia } from 'pinia'
import { useScheduleDeferralStoreV1 } from './schedule-deferral-v1'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { IScheduleDeferralModel } from '@/interfaces/customs'

const URL_PATH = `${URL_PATH_ACCOUNTING}/deferred-schedules`
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

describe('useScheduleDeferral', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch schedule deferral list and update state on success', async () => {
    // Arrange
    const store = useScheduleDeferralStoreV1()
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
    await store._getScheduleDeferralList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.schedule_deferral_list).toEqual(mockResponse.data.data.data)
  })

  it('should handle error when fetching schedule deferral list', async () => {
    // Arrange
    const store = useScheduleDeferralStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getScheduleDeferralList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.schedule_deferral_list).toEqual([])
  })

  it('should handle response.data as undefined when fetching the schedule deferral list', async () => {
    // Arrange
    const store = useScheduleDeferralStoreV1()
    const mockResponse = { data: undefined }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getScheduleDeferralList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.schedule_deferral_list).toEqual([])
    expect(store.schedule_deferral_pages.currentPage).toBe(0)
    expect(store.schedule_deferral_pages.lastPage).toBe(0)
  })

  it('should handle response.data as null when fetching the schedule deferral list', async () => {
    // Arrange
    const store = useScheduleDeferralStoreV1()
    const mockResponse = { data: null }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getScheduleDeferralList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.schedule_deferral_list).toEqual([])
    expect(store.schedule_deferral_pages.currentPage).toBe(0)
    expect(store.schedule_deferral_pages.lastPage).toBe(0)
  })
  it('should create a schedule deferral successfully', async () => {
    // Arrange
    const store = useScheduleDeferralStoreV1()
    const mockResponse = {
      data: {
        data: [],
        success: true,
        message: 'Registro creado exitosamente.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IScheduleDeferralModel = {
      voucher_data_id: 1,
      parameters: [
        {
          installments: 1,
          installment_amount: '1',
          start_period: '',
          receipt_type_id: 1,
          sub_receipt_type_id: 1,
          percentage: 1,
          counterpart_account_id: 1,
          counterpart_auxiliary_id: 1,
          counterpart_cost_center_id: 1,
        },
      ],
    }

    // Act
    const result = await store._saveParameter(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(true)
  })
  it('should update a schedule deferral successfully', async () => {
    // Arrange
    const store = useScheduleDeferralStoreV1()
    const mockResponse = {
      data: {
        data: [],
        success: true,
        message: 'Registro actualizado exitosamente.',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const scheduleDeferralId = 1

    const payload: IScheduleDeferralModel = {
      voucher_data_id: 1,
      parameters: [
        {
          installments: 1,
          installment_amount: '1',
          start_period: '',
          receipt_type_id: 1,
          sub_receipt_type_id: 1,
          percentage: 1,
          counterpart_account_id: 1,
          counterpart_auxiliary_id: 1,
          counterpart_cost_center_id: 1,
        },
      ],
    }

    // Act
    const result = await store._updateParameters(scheduleDeferralId, payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH}/${scheduleDeferralId}`,
      payload
    )
    expect(result).toBe(true)
  })
  it('should fetch a schedule deferral successfully', async () => {
    // Arrange
    const store = useScheduleDeferralStoreV1()
    const mockResponse = {
      data: {
        data: [],
        success: true,
        message: 'Registro obtenido exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const scheduleDeferralId = 1

    // Act
    const result = await store._getScheduleDeferral(scheduleDeferralId)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${scheduleDeferralId}`)
    expect(result).toBe(true)
  })
  it('should handle false when fetching a schedule deferral', async () => {
    // Arrange
    const store = useScheduleDeferralStoreV1()
    const mockResponse = {
      data: {
        data: [],
        success: false,
        message: 'Registro no encontrado.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const scheduleDeferralId = 1

    // Act
    const result = await store._getScheduleDeferral(scheduleDeferralId)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${scheduleDeferralId}`)
    expect(result).toBe(false)
  })
  it('should fetch the business list for the selected account structure successfully', async () => {
    // Arrange
    const store = useScheduleDeferralStoreV1()
    const mockResponse = {
      data: {
        data: [],
        success: true,
        message: 'Registro obtenido exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const structureId = 'filter[account_structure_id]=1'

    // Act
    const result = await store._getBusiness(structureId)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH}/getBusiness?${structureId}&paginate=1`
    )
    expect(result).toBe(true)
  })
  it('should fetch the voucher data list for the selected business successfully', async () => {
    // Arrange
    const store = useScheduleDeferralStoreV1()
    const mockResponse = {
      data: {
        data: [
          {
            period: '07/2025',
            voucher: 7491,
            consecutive: null,
            voucher_data_id: 7560,
            nature: 'Débito',
            register_detail:
              'Registro Diferencia en cambio 2025-07-21 00:00:00',
            debit: '484630999.50',
            credit: '484630999.50',
            foreign_currency: '-120633.00',
            total_debits: '484,630,999.50',
            total_credits: '-484,630,999.50',
            difference_amount: '0.00',
          },
        ],
        success: true,
        message: 'Registro obtenido exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const structureId = 'filter[business_trust_id]=1'

    // Act
    const result = await store._getVouchers(structureId)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH}/vouchers?${structureId}&paginate=1`
    )
    expect(result).toBe(true)
  })
  it('should update a parameter successfully', async () => {
    // Arrange
    const store = useScheduleDeferralStoreV1()
    const mockResponse = {
      data: {
        data: [],
        success: true,
        message: 'Registro actualizado exitosamente.',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = {
      parameters: [
        {
          installments: 1,
          installment_amount: '1',
          start_period: '',
          receipt_type_id: 1,
          sub_receipt_type_id: 1,
          percentage: 1,
          counterpart_account_id: 1,
          counterpart_auxiliary_id: 1,
          counterpart_cost_center_id: 1,
        },
      ],
    }

    // Act
    const result = await store._updateParameters(1, payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/1`, payload)
    expect(result).toBe(true)
  })
})
