import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { createPinia, setActivePinia } from 'pinia'
import useRemoteMassAuthorizationStoreV1 from './remote-mass-authorization-v1'
import { executeApi } from '@/apis'
import { IRemoteMassAuthorizationUpdateRequest } from '@/interfaces/customs/sarlaft/RemoteMassAuthorization'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn(
    (error) => `Mensaje de error: ${error.message}`
  )

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useRemoteMassAuthorizationStoreV1', () => {
  const URL_PATH = `${URL_PATH_SARLAFT}/finding-massive-list`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getRemoteMassAuthorizations', () => {
    it('loads remote mass authorizations correctly', async () => {
      const store = useRemoteMassAuthorizationStoreV1()
      const { showAlertMock } = require('@/composables')
      const mockResponse = {
        data: {
          data: {
            data: [{ id: 1, name: 'Auth 1' }],
            current_page: 1,
            last_page: 2,
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const queryParams = 'page=1'
      const result = await store._getRemoteMassAuthorizations(queryParams)

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?${queryParams}`)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Registro obtenido exitosamente',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toEqual({
        data: [{ id: 1, name: 'Auth 1' }],
        pages: { currentPage: 1, lastPage: 2 },
      })
    })

    it('handles error and returns null', async () => {
      const store = useRemoteMassAuthorizationStoreV1()
      const { showAlertMock, showCatchErrorMock } = require('@/composables')
      const mockError = new Error('Error loading authorizations')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getRemoteMassAuthorizations('page=1')

      expect(result).toBeNull()
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Mensaje de error: Error loading authorizations',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles empty response and returns null', async () => {
      const store = useRemoteMassAuthorizationStoreV1()
      const { showAlertMock, showCatchErrorMock } = require('@/composables')
      const mockError = new Error('No se encontraron registros')
      const mockGet = jest
        .fn()
        .mockResolvedValue({ data: { data: { data: [] } } })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getRemoteMassAuthorizations('page=1')

      expect(result).toBeNull()
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Mensaje de error: No se encontraron registros',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_getRemoteMassAuthorizationDetail', () => {
    it('gets remote mass authorization detail correctly', async () => {
      const store = useRemoteMassAuthorizationStoreV1()
      const { showAlertMock } = require('@/composables')
      const mockResponse = {
        data: {
          data: [{ id: 1, detail: 'Detail 1' }],
          current_page: 1,
          last_page: 1,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getRemoteMassAuthorizationDetail(
        '1',
        'page=1'
      )

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1?page=1`)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Registro obtenido exitosamente',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toEqual({
        data: [{ id: 1, detail: 'Detail 1' }],
        pages: { currentPage: 1, lastPage: 1 },
      })
    })

    it('handles error on get detail and returns null', async () => {
      const store = useRemoteMassAuthorizationStoreV1()
      const { showAlertMock, showCatchErrorMock } = require('@/composables')
      const mockError = new Error('Error getting detail')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getRemoteMassAuthorizationDetail(
        '1',
        'page=1'
      )

      expect(result).toBeNull()
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Mensaje de error: Error getting detail',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles empty detail response and returns null', async () => {
      const store = useRemoteMassAuthorizationStoreV1()
      const { showAlertMock, showCatchErrorMock } = require('@/composables')
      const mockError = new Error('No se encontraron registros')
      const mockGet = jest.fn().mockResolvedValue({ data: { data: [] } })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getRemoteMassAuthorizationDetail(
        '1',
        'page=1'
      )

      expect(result).toBeNull()
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Mensaje de error: No se encontraron registros',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_putRemoteMassAuthorizationUpdate', () => {
    const payload: IRemoteMassAuthorizationUpdateRequest = {
      ids: [1, 2],
      action: 1,
      justification: 'Justificacion',
    }

    it('updates remote mass authorization correctly', async () => {
      const store = useRemoteMassAuthorizationStoreV1()
      const { showAlertMock } = require('@/composables')
      const mockResponse = {
        data: {
          success: true,
          message: 'Update successful',
        },
      }
      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._putRemoteMassAuthorizationUpdate(payload)

      expect(mockPut).toHaveBeenCalledWith(URL_PATH, payload)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Update successful, los cambios puden tardar en reflejarse',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('handles error on update and returns null', async () => {
      const store = useRemoteMassAuthorizationStoreV1()
      const { showAlertMock, showCatchErrorMock } = require('@/composables')
      const mockError = new Error('Error updating')
      const mockPut = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._putRemoteMassAuthorizationUpdate(payload)

      expect(result).toBeNull()
      expect(showCatchErrorMock).not.toHaveBeenCalled()
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error updating',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles update response with success: false', async () => {
      const store = useRemoteMassAuthorizationStoreV1()
      const { showAlertMock } = require('@/composables')
      const mockResponse = {
        data: {
          success: false,
          message: 'Update failed',
        },
      }
      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._putRemoteMassAuthorizationUpdate(payload)

      expect(result).toBeNull()
      expect(showAlertMock).toHaveBeenCalledWith(
        'Update failed',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })
})
