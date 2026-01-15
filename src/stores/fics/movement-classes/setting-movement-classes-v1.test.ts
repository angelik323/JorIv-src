// Vue - pinia
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import { IMovementGroup } from '@/interfaces/customs/fics/SettingMovementClasses'

// Stores
import { useSettingMovementClassesV1 } from './setting-movement-classes-v1'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn().mockReturnValue('Error message')
  return {
    useAlert: () => ({ showAlert: showAlertMock }),
    useShowError: () => ({ showCatchError: showCatchErrorMock }),
    showAlertMock,
    showCatchErrorMock,
  }
})

describe('useSettingMovementClassesV1 store', () => {
  let store: ReturnType<typeof useSettingMovementClassesV1>
  let getMock: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    const api = require('@/apis')
    api.executeApi.mockReturnValue({
      get: jest.fn(),
    })
    getMock = api.executeApi().get

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    store = useSettingMovementClassesV1()
  })

  it('should clean data correctly', () => {
    store.setting_movement_classes_list = [
      { id: 1, name: 'Test' },
    ] as IMovementGroup[]
    store.setting_movement_classes_pages = { currentPage: 5, lastPage: 10 }

    store._cleanData()

    expect(store.setting_movement_classes_list).toEqual([])
    expect(store.setting_movement_classes_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('should fetch list successfully and update state', async () => {
    const mockResponse = {
      data: {
        data: {
          data: [{ id: 1, name: 'Class A' }],
          current_page: 2,
          last_page: 5,
        },
        message: 'Success message',
        success: true,
      },
    }

    getMock.mockResolvedValue(mockResponse)

    const result = await store._getListAction()

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/classes-movements?paginate=1`
    )
    expect(store.setting_movement_classes_list).toEqual([
      { id: 1, name: 'Class A' },
    ])
    expect(store.setting_movement_classes_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
    expect(showAlertMock).toHaveBeenCalledWith(
      'Success message',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
    expect(result).toEqual(mockResponse)
  })

  it('should handle success=false and still show alert', async () => {
    const mockResponse = {
      data: {
        data: {
          data: [],
          current_page: null,
          last_page: null,
        },
        message: 'Error occurred',
        success: false,
      },
    }

    getMock.mockResolvedValue(mockResponse)

    await store._getListAction()

    expect(store.setting_movement_classes_list).toEqual([])
    expect(store.setting_movement_classes_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error occurred',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should show error alert when API fails', async () => {
    const error = new Error('Network fail')
    getMock.mockRejectedValue(error)

    await store._getListAction()

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error message',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(store.setting_movement_classes_list).toEqual([])
    expect(store.setting_movement_classes_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('should handle success=true but items and pages are null', async () => {
    const mockResponse = {
      data: {
        data: {
          data: null,
          current_page: null,
          last_page: null,
        },
        message: 'Partial success',
        success: true,
      },
    }

    getMock.mockResolvedValue(mockResponse)

    await store._getListAction()

    expect(store.setting_movement_classes_list).toEqual([]) // items ?? []
    expect(store.setting_movement_classes_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    }) // null ?? 0
    expect(showAlertMock).toHaveBeenCalledWith(
      'Partial success',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
