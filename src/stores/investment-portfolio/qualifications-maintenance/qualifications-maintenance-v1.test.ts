import { setActivePinia, createPinia } from 'pinia'
import { useQualificationsMaintenanceStoreV1 } from './qualifications-maintenance-v1'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  return {
    useAlert: jest.fn(() => ({ showAlert: showAlertMock })),
    useShowError: jest.fn(() => ({ showCatchError: showCatchErrorMock })),
    showAlertMock,
    showCatchErrorMock,
  }
})

describe('useQualificationsMaintenanceStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch qualifications list and update state on success', async () => {
    const store = useQualificationsMaintenanceStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Datos obtenidos',
        data: {
          data: [{ id: 1 }],
          current_page: 1,
          last_page: 2,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&filter[name]=test', 1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/issuers-counter-party/get?paginate=1&page=1&filter[name]=test`
    )
    expect(store.qualifications_list).toEqual([{ id: 1 }])
    expect(store.qualifications_pages).toEqual({ currentPage: 1, lastPage: 2 })
  })

  it('should handle error when fetching qualifications list', async () => {
    const store = useQualificationsMaintenanceStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('', 1)

    expect(mockGet).toHaveBeenCalled()
    expect(store.qualifications_list).toEqual([])
  })

  it('should fetch qualification by id and set data_information_form', async () => {
    const store = useQualificationsMaintenanceStoreV1()
    const mockData = { id: 99 }

    const mockResponse = {
      data: {
        success: true,
        message: 'Encontrado',
        data: mockData,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdQualifications(99)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/issuers-counter-party/show/99`
    )
    expect(store.data_information_form).toEqual(mockData)
  })

  it('should handle error when fetching qualification by ID', async () => {
    const store = useQualificationsMaintenanceStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdQualifications(100)

    expect(mockGet).toHaveBeenCalled()
    expect(store.data_information_form).toEqual({})
  })

  it('should update qualification and return true on success', async () => {
    const store = useQualificationsMaintenanceStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Actualizado correctamente',
      },
    }

    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateQualifications({ cp_issuer_rating: 'A1' }, 55)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/maintenance-qualification/update/55`,
      { cp_issuer_rating: 'A1' }
    )
    expect(result).toBe(true)
  })

  it('should handle error when updating qualification', async () => {
    const store = useQualificationsMaintenanceStoreV1()

    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateQualifications({ cp_issuer_rating: 'B2' }, 99)

    expect(mockPut).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('should clean qualifications data', () => {
    const store = useQualificationsMaintenanceStoreV1()
    store.qualifications_list = [{ id: 1 }]
    store.qualifications_pages = { currentPage: 2, lastPage: 5 }

    store._cleanQualificationsData()

    expect(store.qualifications_list).toEqual([])
    expect(store.qualifications_pages).toEqual({ currentPage: 0, lastPage: 0 })
  })

  it('should set data information form', () => {
    const store = useQualificationsMaintenanceStoreV1()
    const data = { cp_issuer_rating: 'A+' }

    store._setDataInformationForm(data)

    expect(store.data_information_form).toEqual(data)
  })
})
