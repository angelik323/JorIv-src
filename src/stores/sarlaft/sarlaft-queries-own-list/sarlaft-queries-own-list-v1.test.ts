import { setActivePinia, createPinia } from 'pinia'
import { useSarlaftQueriesOwnListStoreV1 } from './sarlaft-queries-own-list-v1'
import { executeApi } from '@/apis/index'
import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn(() => 'Error!')

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

const URL_QUERIES_OWN_LIST = `${URL_PATH_SARLAFT}/own-list`

const mockOwnListItems = [
  {
    id: 233,
    type_identification: 'NIT',
    identification_number: '13485149462',
    name: 'Camilo Candido',
    list: 'Lista 21',
    registration_date: '2025-12-05',
  },
  {
    id: 234,
    type_identification: 'CC',
    identification_number: '1234567890',
    name: 'María López',
    list: 'Lista 22',
    registration_date: '2025-12-06',
  },
]

describe('useSarlaftQueriesOwnListStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getConsultOwnList', () => {
    it('should fetch paginated list of own queries successfully', async () => {
      const store = useSarlaftQueriesOwnListStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          data: {
            data: mockOwnListItems,
            current_page: 1,
            last_page: 2,
          },
          message: 'Consulta exitosa',
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = { page: 1, filter: 'test' }
      const { showAlertMock } = require('@/composables')

      const result = await store._getConsultOwnList(params)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_QUERIES_OWN_LIST}/consult-listings`,
        {
          params,
        }
      )
      expect(result).toEqual({
        data: mockOwnListItems,
        pages: { currentPage: 1, lastPage: 2 },
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'Consulta exitosa',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle error when fetching own queries list', async () => {
      const store = useSarlaftQueriesOwnListStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = { page: 1 }
      const { showAlertMock, showCatchErrorMock } = require('@/composables')

      const result = await store._getConsultOwnList(params)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_QUERIES_OWN_LIST}/consult-listings`,
        {
          params,
        }
      )
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toEqual({
        data: [],
        pages: { currentPage: 1, lastPage: 1 },
      })
    })

    it('should handle empty list response', async () => {
      const store = useSarlaftQueriesOwnListStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          data: {
            data: [],
            current_page: 1,
            last_page: 1,
          },
          message: 'No hay resultados',
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = { filter: 'nonexistent' }
      const { showAlertMock } = require('@/composables')

      const result = await store._getConsultOwnList(params)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_QUERIES_OWN_LIST}/consult-listings`,
        {
          params,
        }
      )
      expect(result).toEqual({
        data: [],
        pages: { currentPage: 1, lastPage: 1 },
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'No hay resultados',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_getAllOwnList', () => {
    it('should fetch all own list items successfully', async () => {
      const store = useSarlaftQueriesOwnListStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          data: mockOwnListItems,
          message: 'Listado completo obtenido',
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { showAlertMock } = require('@/composables')

      const result = await store._getAllOwnList()

      expect(mockGet).toHaveBeenCalledWith(`${URL_QUERIES_OWN_LIST}`)
      expect(result).toEqual({
        data: mockOwnListItems,
        pages: { currentPage: 1, lastPage: 1 },
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'Listado completo obtenido',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle error when fetching all own list items', async () => {
      const store = useSarlaftQueriesOwnListStoreV1()
      const mockError = new Error('API Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { showAlertMock, showCatchErrorMock } = require('@/composables')

      const result = await store._getAllOwnList()

      expect(mockGet).toHaveBeenCalledWith(`${URL_QUERIES_OWN_LIST}`)
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toEqual({
        data: [],
        pages: { currentPage: 1, lastPage: 1 },
      })
    })

    it('should handle empty list response', async () => {
      const store = useSarlaftQueriesOwnListStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          data: [],
          message: 'No hay registros',
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { showAlertMock } = require('@/composables')

      const result = await store._getAllOwnList()

      expect(mockGet).toHaveBeenCalledWith(`${URL_QUERIES_OWN_LIST}`)
      expect(result).toEqual({
        data: [],
        pages: { currentPage: 1, lastPage: 1 },
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'No hay registros',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })
})
