import { setActivePinia, createPinia } from 'pinia'
import { useConsultIndividualListPreventionListStoreV1 } from './consult-individual-list-prevention-v1'
import { executeApi } from '@/apis/index'
import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    post: jest.fn(),
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

const URL_PATH = `${URL_PATH_SARLAFT}/prevention-list`

const mockConsultIndividualListPrevention = [
  {
    authorization_number: 37,
    identification_number: '1010',
    name: 'camilo',
    level_match_id: '3',
    level_match: 'Media',
    matching_system: 'Inspektor',
    response: {
      Inspektor: {
        message: 'Tercero con coincidencias, continuar con seguimiento.',
        priority: 3,
        name: 'camilo',
        document: '1010',
      },
      Vigia: {
        priority: null,
        raw: {
          found_ID: 'N',
          found_Name: 'N',
          lists: [],
        },
      },
      OwnList: [],
    },
  },
]

describe('useConsultIndividualListPreventionListStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_listAction', () => {
    it('should fetch prevention list successfully and return array', async () => {
      const store = useConsultIndividualListPreventionListStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          data: mockConsultIndividualListPrevention,
          message: 'Listado obtenido exitosamente.',
          success: true,
        },
      }
      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const { mockShowAlert } = require('@/composables/useAlert')
      const params = { identification_number: '1010', name: 'camilo' }

      const result = await store._listAction(params)

      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/consult-listings`, {
        ...params,
      })
      expect(result).toEqual(mockConsultIndividualListPrevention)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Listado obtenido exitosamente.',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should convert single object response to array', async () => {
      const store = useConsultIndividualListPreventionListStoreV1()
      const singleItem = mockConsultIndividualListPrevention[0]
      const mockResponse = {
        status: 200,
        data: {
          data: singleItem,
          message: 'Listado obtenido exitosamente.',
          success: true,
        },
      }
      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const { mockShowAlert } = require('@/composables/useAlert')
      const params = { identification_number: '1010', name: 'camilo' }

      const result = await store._listAction(params)

      expect(result).toEqual([singleItem])
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(1)

      expect(mockShowAlert).toHaveBeenCalledWith(
        'Listado obtenido exitosamente.',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle empty list response', async () => {
      const store = useConsultIndividualListPreventionListStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          data: [],
          message: 'No hubo coincidencias',
          success: true,
        },
      }
      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const { mockShowAlert } = require('@/composables/useAlert')

      const params = { identification_number: '1010', name: 'noexistente' }

      const result = await store._listAction(params)

      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/consult-listings`, {
        ...params,
      })
      expect(result).toEqual([])
      expect(mockShowAlert).toHaveBeenCalledWith(
        'No hubo coincidencias',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should show alert when success is false', async () => {
      const store = useConsultIndividualListPreventionListStoreV1()
      const mockResponse = {
        status: 422,
        data: {
          data: [],
          message: 'El campo identification number es requerido.',
          success: false,
        },
      }
      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const { mockShowAlert } = require('@/composables/useAlert')
      const params = { identification_number: '', name: 'camilo' }

      const result = await store._listAction(params)

      expect(result).toEqual([])
      expect(mockShowAlert).toHaveBeenCalledWith(
        'El campo identification number es requerido.',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle error when fetching finding list', async () => {
      const store = useConsultIndividualListPreventionListStoreV1()
      const mockError = new Error('Network Error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const { mockShowAlert } = require('@/composables/useAlert')
      const { mockShowCatchError } = require('@/composables/useShowError')
      const params = { identification_number: '1010', name: 'test' }

      const result = await store._listAction(params)

      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toEqual([])
    })
  })
})
