import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useQualificationsStoreV1 } from '@/stores/investment-portfolio/qualifications/qualifications-v1'
import {
  IQualificationsList,
  IQualificationsResponse,
} from '@/interfaces/customs/investment-portfolio/Qualifications'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()
  const defaultIconsLucide = { plusCircleOutline: jest.fn() }

  return {
    useAlert: jest.fn(() => ({ showAlert: showAlertMock })),
    useShowError: jest.fn(() => ({ showCatchError: showCatchErrorMock })),
    useUtils: jest.fn(() => ({ defaultIconsLucide })),
    showAlertMock,
    showCatchErrorMock,
  }
})

describe('useQualificationsStoreV1', () => {
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock
  })

  it('should handle error when fetching qualifications list', async () => {
    const store = useQualificationsStoreV1()
    const mockError = new Error('error')

    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction({})

    expect(mockGet).toHaveBeenCalled()
    expect(store.qualifications_list).toEqual([])
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
  })

  it('should fetch qualification by id and set qualifications_response', async () => {
    const store = useQualificationsStoreV1()
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
      `${URL_PATH_INVESTMENT_PORTFOLIO}/qualifications/99`
    )
    expect(store.qualifications_response).toEqual(mockData)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Encontrado',
      'success',
      undefined,
      3000
    )
  })

  it('should handle error when fetching qualification by ID', async () => {
    const store = useQualificationsStoreV1()
    const mockError = new Error('error')

    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdQualifications(100)

    expect(mockGet).toHaveBeenCalled()
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
  })

  it('should create qualification and return true on success', async () => {
    const store = useQualificationsStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Creado correctamente',
      },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createQualifications({ group: 22 })

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/qualifications`,
      { group: 22 }
    )
    expect(result).toBe(true)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Creado correctamente',
      'success',
      undefined,
      3000
    )
  })

  it('should return false when create qualification fails', async () => {
    const store = useQualificationsStoreV1()
    const mockError = new Error('fail')

    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createQualifications({ group: 22 })

    expect(result).toBe(false)
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
  })

  it('should update qualification and return true on success', async () => {
    const store = useQualificationsStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Actualizado correctamente',
      },
    }

    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateQualifications({ group: 22 }, 55)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/qualifications/55`,
      { group: 22 }
    )
    expect(result).toBe(true)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Actualizado correctamente',
      'success',
      undefined,
      3000
    )
  })

  it('should return false when update qualification fails', async () => {
    const store = useQualificationsStoreV1()
    const mockError = new Error('fail')

    const mockPut = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateQualifications({ group: 22 }, 99)

    expect(result).toBe(false)
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
  })

  it('should set qualifications_response when assigned directly', () => {
    const store = useQualificationsStoreV1()
    const data: IQualificationsResponse = {
      id: null,
      action_rating: '',
      group: 22,
      rating_code: '',
      history_qualification: {
        created_at: '',
        updated_at: null,
        creator_data: '',
        update_data: null,
      },
    }

    store.qualifications_response = data

    expect(store.qualifications_response).toEqual(data)
  })

  it('should clean qualifications data', () => {
    const store = useQualificationsStoreV1()
    const listItem: IQualificationsList = {
      id: 1,
      action_rating: '',
      group: null,
      rating_code: '',
    }
    store.qualifications_list = [listItem]
    store.qualifications_pages = { currentPage: 2, lastPage: 5 }
    const responseItem: IQualificationsResponse = {
      id: 9,
      action_rating: '',
      group: null,
      rating_code: '',
      history_qualification: {
        created_at: '',
        updated_at: null,
        creator_data: '',
        update_data: null,
      },
    }
    store.qualifications_response = responseItem

    store._clearData()

    expect(store.qualifications_list).toEqual([])
    expect(store.qualifications_pages).toEqual({ currentPage: 0, lastPage: 0 })
    expect(store.qualifications_response).toBeNull()
  })
})
