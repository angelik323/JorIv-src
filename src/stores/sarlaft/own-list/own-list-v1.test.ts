import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { createPinia, setActivePinia } from 'pinia'
import useOwnListStoreV1 from './own-list-v1'
import { executeApi } from '@/apis'

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

describe('useOwnListStoreV1', () => {
  const URL_PATH = `${URL_PATH_SARLAFT}/own-list`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getOwnList', () => {
    it('loads own list correctly', async () => {
      const store = useOwnListStoreV1()
      const mockResponse = {
        data: {
          data: {
            data: [
              { id: 1, list_name: 'Lista 1', status: 'active' },
              { id: 2, list_name: 'Lista 2', status: 'inactive' },
            ],
            current_page: 1,
            last_page: 3,
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const queryParams = 'page=1&per_page=10'
      const result = await store._getOwnList(queryParams)

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?${queryParams}`)
      expect(result).toEqual({
        data: [
          { id: 1, list_name: 'Lista 1', status: 'active' },
          { id: 2, list_name: 'Lista 2', status: 'inactive' },
        ],
        pages: {
          currentPage: 1,
          lastPage: 3,
        },
      })
    })

    it('handles error and returns null', async () => {
      const store = useOwnListStoreV1()
      const { showAlertMock, showCatchErrorMock } = require('@/composables')

      const mockError = new Error('Error al cargar lista')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getOwnList('page=1')

      expect(result).toBeNull()
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Mensaje de error: Error al cargar lista',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles empty response data', async () => {
      const store = useOwnListStoreV1()
      const mockResponse = { data: {} }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getOwnList('page=1')

      expect(result).toEqual({
        data: [],
        pages: {
          currentPage: 1,
          lastPage: 1,
        },
      })
    })
  })

  describe('_importOwnList', () => {
    it('imports own list file correctly', async () => {
      const store = useOwnListStoreV1()
      const mockResponse = {
        data: {
          data: {
            key_data: 'abc123',
            list_loaded: [{ id: 1, name: 'Test' }],
          },
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const mockFile = new File(['content'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const payload = {
        file: mockFile,
        listName: 'Mi Lista',
      }

      const result = await store._importOwnList(payload)

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/import`,
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(result).toEqual({
        key_data: 'abc123',
        list_loaded: [{ id: 1, name: 'Test' }],
        errors: false,
      })
    })

    it('handles import error and returns errors: true', async () => {
      const store = useOwnListStoreV1()
      const { showAlertMock, showCatchErrorMock } = require('@/composables')

      const mockError = new Error('Network Error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const mockFile = new File(['content'], 'test.xlsx')
      const payload = {
        file: mockFile,
        listName: 'Mi Lista',
      }

      const result = await store._importOwnList(payload)

      expect(result).toEqual({
        key_data: null,
        errors: true,
      })

      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Mensaje de error: Network Error',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles response errors array and returns errors: true', async () => {
      const store = useOwnListStoreV1()
      const { showAlertMock } = require('@/composables')

      const mockResponse = {
        data: {
          data: {
            key_data: 'errorKey',
            errors: [{ campo: 'nombre', fila: 1 }],
          },
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const mockFile = new File(['content'], 'test.xlsx')
      const payload = { file: mockFile, listName: 'Lista' }

      const result = await store._importOwnList(payload)

      expect(result).toEqual({
        key_data: 'errorKey',
        errors: true,
      })

      expect(showAlertMock).toHaveBeenCalledWith(
        'Mensaje de error: Error al importar los registros',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_confirmImport', () => {
    it('confirms import successfully', async () => {
      const store = useOwnListStoreV1()
      const { showAlertMock } = require('@/composables')

      const mockResponse = {
        data: {
          data: { id: 10, list_name: 'Lista Confirmada' },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const keyData = 'abc123'
      const result = await store._confirmImport(keyData)

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/import/${keyData}`)
      expect(result).toEqual({ id: 10, list_name: 'Lista Confirmada' })
      expect(showAlertMock).toHaveBeenCalledWith(
        'Registro creado exitosamente',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles confirm import error and throws', async () => {
      const store = useOwnListStoreV1()
      const { showAlertMock, showCatchErrorMock } = require('@/composables')

      const mockError = new Error('Error al confirmar importación')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await expect(store._confirmImport('abc123')).rejects.toThrow(mockError)

      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Mensaje de error: Error al confirmar importación',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_getOwnListDetail', () => {
    it('gets own list detail successfully', async () => {
      const store = useOwnListStoreV1()
      const mockResponse = {
        data: {
          data: {
            id: 5,
            list_name: 'Lista Detallada',
            status: 'active',
            records: [{ id: 1, name: 'Tercero 1' }],
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getOwnListDetail('5')

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show/5`)
      expect(result).toEqual({
        id: 5,
        list_name: 'Lista Detallada',
        status: 'active',
        records: [{ id: 1, name: 'Tercero 1' }],
      })
    })

    it('handles get detail error and returns null', async () => {
      const store = useOwnListStoreV1()
      const { showAlertMock, showCatchErrorMock } = require('@/composables')

      const mockError = new Error('Error al obtener detalle')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getOwnListDetail('999')

      expect(result).toBeNull()
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Mensaje de error: Error al obtener detalle',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_updateOwnList', () => {
    it('updates own list successfully', async () => {
      const store = useOwnListStoreV1()
      const { showAlertMock } = require('@/composables')

      const mockResponse = {
        data: {
          message: 'Lista actualizada correctamente',
        },
      }

      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const payload = {
        list_name: 'Lista Actualizada',
        new_list: [
          {
            identification_number: '123456',
            name: 'Nuevo',
            type_identification: 'CC',
          },
        ],
        id_to_delete: [1, 2],
      }

      const result = await store._updateOwnList('10', payload)

      expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/update/10`, payload)
      expect(result).toBe(true)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Lista actualizada correctamente',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('uses default message when no message in response', async () => {
      const store = useOwnListStoreV1()
      const { showAlertMock } = require('@/composables')

      const mockResponse = { data: {} }

      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const payload = {
        list_name: 'Lista',
        new_list: [],
        id_to_delete: [],
      }

      const result = await store._updateOwnList('5', payload)

      expect(result).toBe(true)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Registro actualizado exitosamente',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles update error and returns false', async () => {
      const store = useOwnListStoreV1()
      const { showAlertMock, showCatchErrorMock } = require('@/composables')

      const mockError = new Error('Error al actualizar')
      const mockPut = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const payload = {
        list_name: 'Lista',
        new_list: [],
        id_to_delete: [],
      }

      const result = await store._updateOwnList('10', payload)

      expect(result).toBe(false)
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Mensaje de error: Error al actualizar',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_toggleOwnListStatus', () => {
    it('toggles own list status successfully', async () => {
      const store = useOwnListStoreV1()
      const { showAlertMock } = require('@/composables')

      const mockResponse = { data: { success: true } }

      const mockPatch = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

      await store._toggleOwnListStatus('15')

      expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/15/toggle-status`)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Registro actualizado correctamente',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles toggle status error and throws', async () => {
      const store = useOwnListStoreV1()
      const { showAlertMock, showCatchErrorMock } = require('@/composables')

      const mockError = new Error('Error al cambiar estado')
      const mockPatch = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

      await expect(store._toggleOwnListStatus('20')).rejects.toThrow(mockError)

      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Mensaje de error: Error al cambiar estado',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })
})
