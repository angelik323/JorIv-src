import { setActivePinia, createPinia } from 'pinia'
import { useSarlaftParameterizationStoreV1 } from './sarlaft-parameterization-v1'
import { executeApi } from '@/apis/index'
import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

jest.mock('@/composables/useAlert', () => {
  const mockShowAlert = jest.fn()
  return {
    useAlert: jest.fn(() => ({ showAlert: mockShowAlert })),
    mockShowAlert,
  }
})

jest.mock('@/composables/useShowError', () => {
  const mockShowCatchError = jest.fn(() => 'Error!')
  return {
    useShowError: jest.fn(() => ({ showCatchError: mockShowCatchError })),
    mockShowCatchError,
  }
})

const URL_PARAMETERIZATION_LIST = `${URL_PATH_SARLAFT}/parameters`

const mockParameterizationListItems = [
  {
    id: 1,
    description: '% mínimo de registro de socios',
    value: '5',
    type: 'percentage',
  },
]

describe('useSarlaftParameterizationStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_listAction', () => {
    it('should fetch paginated list of parameterization successfully', async () => {
      const store = useSarlaftParameterizationStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          data: {
            data: mockParameterizationListItems,
            current_page: 1,
            last_page: 2,
          },
          message: 'Listado obtenido exitosamente.',
          success: true,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = { page: 1, paginate: 1 }

      const result = await store._listAction(params)

      expect(mockGet).toHaveBeenCalledWith(`${URL_PARAMETERIZATION_LIST}`, {
        params,
      })
      expect(result).toEqual({
        list: mockParameterizationListItems,
        pages: { currentPage: 1, lastPage: 2 },
      })
    })

    it('should handle empty list response', async () => {
      const store = useSarlaftParameterizationStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          data: {
            data: [],
            current_page: 1,
            last_page: 1,
          },
          message: 'No hay resultados',
          success: true,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = { page: 1, paginate: 1 }

      const result = await store._listAction(params)

      expect(mockGet).toHaveBeenCalledWith(`${URL_PARAMETERIZATION_LIST}`, {
        params,
      })
      expect(result).toEqual({
        list: [],
        pages: { currentPage: 1, lastPage: 1 },
      })
    })

    it('should handle error when fetching parameterization list', async () => {
      const store = useSarlaftParameterizationStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { mockShowAlert } = require('@/composables/useAlert')
      const { mockShowCatchError } = require('@/composables/useShowError')
      const params = { page: 1, paginate: 1 }

      const result = await store._listAction(params)

      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toBeUndefined()
    })
  })

  describe('_updateAction', () => {
    it('should update parameter successfully and return true', async () => {
      const store = useSarlaftParameterizationStoreV1()

      const mockResponse = {
        status: 200,
        data: {
          message: 'Registro actualizado exitosamente.',
          success: true,
        },
      }

      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const { mockShowAlert } = require('@/composables/useAlert')

      const payload = { id: 1, value: '11' }

      const result = await store._updateAction(payload)

      expect(mockPut).toHaveBeenCalledWith(`${URL_PARAMETERIZATION_LIST}/1`, {
        value: '11',
      })

      expect(mockShowAlert).toHaveBeenCalledWith(
        'Registro actualizado exitosamente.',
        'success',
        undefined,
        TIMEOUT_ALERT
      )

      expect(result).toBe(true)
    })

    it('should return false when API returns success false', async () => {
      const store = useSarlaftParameterizationStoreV1()

      const mockResponse = {
        status: 200,
        data: {
          message: 'El campo valor debe estar entre 1 y 36.',
          success: false,
        },
      }

      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const { mockShowAlert } = require('@/composables/useAlert')

      const payload = { id: 1, value: '37' }

      const result = await store._updateAction(payload)

      expect(mockPut).toHaveBeenCalledWith(`${URL_PARAMETERIZATION_LIST}/1`, {
        value: '37',
      })

      expect(mockShowAlert).toHaveBeenCalledWith(
        'El campo valor debe estar entre 1 y 36.',
        'error',
        undefined,
        TIMEOUT_ALERT
      )

      expect(result).toBe(false)
    })

    it('should handle error when update fails', async () => {
      const store = useSarlaftParameterizationStoreV1()

      const mockError = new Error('Server Error')
      const mockPut = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const { mockShowAlert } = require('@/composables/useAlert')
      const { mockShowCatchError } = require('@/composables/useShowError')

      const payload = { id: 1, value: '12' }

      const result = await store._updateAction(payload)

      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)

      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )

      expect(result).toBe(false)
    })
  })
})
