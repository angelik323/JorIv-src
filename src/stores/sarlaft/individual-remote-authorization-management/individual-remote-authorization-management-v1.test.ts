import { setActivePinia, createPinia } from 'pinia'
import { useIndividualRemoteAuthorizationManagementStoreV1 } from './individual-remote-authorization-management-v1'
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

const URL_FINDING_LIST = `${URL_PATH_SARLAFT}/finding-list`

const mockFindingListItems = [
  {
    id: 36,
    name: 'Alejandro Ramirez',
    identification_number: '34939899',
    request_date: '2025-12-15',
    match_level: '1',
    watchlist: 'Lista propia',
    response:
      '{"own_list_id":28,"own_list_detail_id":308,"own_list_name":"Lista clinton","match_level":1,"match_level_label":"Alta","evidence":{"identification":true,"full_name":true,"partial_name":false}}',
    origin_module: 21,
    justification: null,
    status_id: 3,
    created_at: '2025-12-16T01:40:30.000000Z',
    updated_at: '2025-12-16T01:40:30.000000Z',
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null,
    authorized_by: null,
    authorized_at: null,
    client_id: 14,
    own_list: null,
    own_list_id: 28,
  },
  {
    id: 35,
    name: 'camilo torres',
    identification_number: '40',
    request_date: '2025-12-15',
    match_level: '3',
    watchlist: 'Inspektor',
    response:
      '{"message":"Tercero con coincidencias, continuar con seguimiento.","priority":3,"name":"camilo torres","document":"40"}',
    origin_module: 20,
    justification: null,
    status_id: 3,
    created_at: '2025-12-15T23:28:24.000000Z',
    updated_at: '2025-12-15T23:28:24.000000Z',
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null,
    authorized_by: null,
    authorized_at: null,
    client_id: 39,
    own_list: null,
    own_list_id: null,
  },
]

describe('useIndividualRemoteAuthorizationManagementStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getFindingList', () => {
    it('should fetch paginated finding list successully', async () => {
      const store = useIndividualRemoteAuthorizationManagementStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          data: {
            data: mockFindingListItems,
            current_page: 1,
            last_page: 2,
          },
          message: 'Listado completo obtenido',
          success: true,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = { page: 1, name: 'camilo torres' }

      const result = await store._getFindingList(params)

      expect(mockGet).toHaveBeenCalledWith(`${URL_FINDING_LIST}`, {
        params: { ...params, paginate: 1 },
      })
      expect(result).toEqual({
        list: mockFindingListItems,
        pages: { currentPage: 1, lastPage: 2 },
      })
    })

    it('should handle empty list response', async () => {
      const store = useIndividualRemoteAuthorizationManagementStoreV1()
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

      const params = { name: 'nonexistent' }

      const result = await store._getFindingList(params)

      expect(mockGet).toHaveBeenCalledWith(`${URL_FINDING_LIST}`, {
        params: { ...params, paginate: 1 },
      })
      expect(result).toEqual({
        list: [],
        pages: { currentPage: 1, lastPage: 1 },
      })
    })

    it('should show alert when success is false', async () => {
      const store = useIndividualRemoteAuthorizationManagementStoreV1()
      const mockResponse = {
        data: {
          data: {
            data: [],
            current_page: 0,
            last_page: 0,
          },
          message: 'Error en la consulta',
          success: false,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { showAlertMock } = require('@/composables')
      const params = { page: 1 }

      await store._getFindingList(params)

      expect(showAlertMock).toHaveBeenCalledWith(
        'Error en la consulta',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle error when fetching finding list', async () => {
      const store = useIndividualRemoteAuthorizationManagementStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { showAlertMock, showCatchErrorMock } = require('@/composables')
      const params = { page: 1 }

      const result = await store._getFindingList(params)

      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toEqual({
        list: [],
        pages: { currentPage: 0, lastPage: 0 },
      })
    })
  })

  describe('_updateFindingList', () => {
    it('should update finding list item successully with action authorize(true)', async () => {
      const store = useIndividualRemoteAuthorizationManagementStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          message: 'Autorización registrada exitosamente.',
          success: true,
        },
      }
      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const findingId = 36
      const payload = { justification: 'Aprobado por revisión', action: true }

      const result = await store._updateFindingList(findingId, payload)

      expect(mockPut).toHaveBeenCalledWith(
        `${URL_FINDING_LIST}/${findingId}`,
        payload
      )
      expect(result).toEqual({
        success: true,
      })
    })

    it('should update finding list item successully with action reject(false)', async () => {
      const store = useIndividualRemoteAuthorizationManagementStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          message: 'Autorización registrada exitosamente.',
          success: true,
        },
      }
      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const findingId = 36
      const payload = { justification: 'Aprobado por revisión', action: false }

      const result = await store._updateFindingList(findingId, payload)

      expect(mockPut).toHaveBeenCalledWith(
        `${URL_FINDING_LIST}/${findingId}`,
        payload
      )
      expect(result).toEqual({
        success: true,
      })
    })

    it('should return success false when API returns success false', async () => {
      const store = useIndividualRemoteAuthorizationManagementStoreV1()
      const mockResponse = {
        status: 200,
        data: {
          message: 'Error al registrar',
          success: false,
        },
      }
      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const findingId = 36
      const payload = { justification: 'Aprobado por revisión', action: false }

      const result = await store._updateFindingList(findingId, payload)

      expect(mockPut).toHaveBeenCalledWith(
        `${URL_FINDING_LIST}/${findingId}`,
        payload
      )
      expect(result).toEqual({
        success: false,
      })
    })

    it('should handle error when update fails', async () => {
      const store = useIndividualRemoteAuthorizationManagementStoreV1()
      const mockError = new Error('Server Error')

      const mockPut = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const { showAlertMock, showCatchErrorMock } = require('@/composables')
      const findingId = 36
      const payload = { justification: 'Test', action: true }

      const result = await store._updateFindingList(findingId, payload)

      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toEqual({
        success: false,
      })
    })
  })
})
