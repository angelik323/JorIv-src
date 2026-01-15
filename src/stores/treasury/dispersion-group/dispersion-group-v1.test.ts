import { setActivePinia, createPinia } from 'pinia'
import { useDispersionGroupStoreV1 } from './dispersion-group-v1'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

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
  const showCatchErrorMock = jest
    .fn()
    .mockImplementation((err) => err.message || 'error')
  const getNameBlobMock = jest.fn(() => 'file.xlsx')
  const downloadBlobXlxxMock = jest.fn()

  return {
    useAlert: jest.fn(() => ({ showAlert: showAlertMock })),
    useShowError: jest.fn(() => ({ showCatchError: showCatchErrorMock })),
    useUtils: jest.fn(() => ({
      getNameBlob: getNameBlobMock,
      downloadBlobXlxx: downloadBlobXlxxMock,
    })),
    showAlertMock,
    showCatchErrorMock,
    getNameBlobMock,
    downloadBlobXlxxMock,
  }
})

describe('useDispersionGroupStoreV1', () => {
  let store: ReturnType<typeof useDispersionGroupStoreV1>
  let showAlertMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useDispersionGroupStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock

    jest.clearAllMocks()
  })

  it('should fetch list and update state', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { data: [{ id: 1 }], current_page: 2, last_page: 4 },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&filter=test')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/dispersion-group-consultation/list-dispersion-group?paginate=1&filter=test`
    )
    expect(store.dispersion_group_list).toEqual([{ id: 1 }])
    expect(store.dispersion_group_pages).toEqual({
      currentPage: 2,
      lastPage: 4,
    })
    expect(showAlertMock).toHaveBeenCalledWith(
      'ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should fetch by id and set data_information_table', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { data: [{ turn: 1 }] },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdDispersionGroup(5, '&rows=20&page=1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/dispersion-group-consultation/list-turns?paginate=1&rows=20&page=1&filter[id_group]=5`
    )
    expect(store.dispersion_group_details_list).toEqual([{ turn: 1 }])
    expect(store.dispersion_group_details_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(showAlertMock).toHaveBeenCalled()
  })

  it('should set data_information_form', () => {
    store._setDataInformationForm({ id: 1 })
    expect(store.data_information_form).toEqual({ id: 1 })
  })

  it('should set data_filters', () => {
    store._setDataFilters({ a: 1 })
    expect(store.data_filters).toEqual({ a: 1 })
  })

  it('should set group selected', () => {
    store._setGroupSelected({ id: 5 })
    expect(store.data_information_form).toEqual({ id: 5 })
  })

  it('should clean data', () => {
    store.dispersion_group_list = [{ id: 1 }]
    store.dispersion_group_pages = { currentPage: 2, lastPage: 5 }
    store._cleanDispersionGroupData()
    expect(store.dispersion_group_list).toEqual([])
    expect(store.dispersion_group_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('should download excel and call utils', async () => {
    const mockResponse = {
      data: new ArrayBuffer(10),
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const filters = 'filter[id_group]=1&rows=20'
    await store._downloadExcelDispersionGroup(filters)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/dispersion-group-consultation/export?paginate=1&${filters}`,
      { responseType: 'blob' }
    )
  })
})
