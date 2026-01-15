import { setActivePinia, createPinia } from 'pinia'
import { useConfigurationTypesSubtypesStoreV1 } from '@/stores/fixed-assets/configuration-types-subtypes/configuration-types-subtypes-v1'
import { executeApi } from '@/apis'
import type { IAssetTypeRequest } from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn()
  }))
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn(() => 'Error message')
  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))
  return { useAlert, useShowError }
})

describe('useConfigurationTypesSubtypesStoreV1', () => {
  const URL_PATH = 'fixed-assets/api/fixed-assets/types'

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getConfigurationTypesSubtypesList', () => {
    it('fetches list successfully and returns data', async () => {
      const store = useConfigurationTypesSubtypesStoreV1()
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [
              {
                id: 1,
                code: 101,
                type: 'activo fijo',
                asset_class: 'Mueble (MUB)'
              }
            ],
            current_page: 2,
            last_page: 5
          },
          message: 'Lista obtenida exitosamente'
        }
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = 'page=1&per_page=20'
      const result = await store._getConfigurationTypesSubtypesList(params)

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?${params}`)
      expect(result.list).toEqual(mockResponse.data.data.data)
      expect(result.pages.currentPage).toBe(2)
      expect(result.pages.lastPage).toBe(5)
    })

    it('returns empty data on fetch failure', async () => {
      const store = useConfigurationTypesSubtypesStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getConfigurationTypesSubtypesList('page=1')

      expect(mockGet).toHaveBeenCalled()
      expect(result.list).toEqual([])
      expect(result.pages.currentPage).toBe(0)
      expect(result.pages.lastPage).toBe(0)
    })
  })

  describe('_createConfigurationTypesSubtypes', () => {
    it('creates configuration successfully', async () => {
      const store = useConfigurationTypesSubtypesStoreV1()
      const mockResponse = {
        data: {
          success: true,
          message: 'Tipo creado exitosamente',
          data: {
            id: 10,
            code: 102,
            type: 'activo fijo'
          }
        }
      }
      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const payload: IAssetTypeRequest = {
        code: 102,
        type: 'activo fijo',
        description: 'Nuevo tipo',
        asset_class: 'Inmueble (INM)',
        subtypes: [
          {
            code: '001',
            description: 'Subtipo 1',
            life_span: 120,
            depreciation: 10
          }
        ]
      }

      const result = await store._createConfigurationTypesSubtypes(payload)

      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
      expect(result).toEqual(mockResponse.data)
    })

    it('returns null when create fails', async () => {
      const store = useConfigurationTypesSubtypesStoreV1()
      const mockError = new Error('Validation error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const payload: IAssetTypeRequest = {
        code: 102,
        type: 'activo fijo',
        description: '',
        asset_class: 'Mueble (MUB)',
        subtypes: []
      }

      const result = await store._createConfigurationTypesSubtypes(payload)

      expect(result).toBeNull()
    })
  })

  describe('_getByIdConfigurationTypesSubtypes', () => {
    it('fetches configuration by id successfully', async () => {
      const store = useConfigurationTypesSubtypesStoreV1()
      const mockData = {
        id: 5,
        code: 105,
        type: 'bien',
        description: 'Tipo de bien',
        asset_class: 'Mueble (MUB)',
        subtypes: [
          {
            id: 1,
            code: '001',
            description: 'Subtipo 1',
            life_span: 60,
            depreciation: 5
          }
        ],
        created_at: '2024-01-01',
        created_by: 'admin'
      }
      const mockResponse = {
        data: {
          success: true,
          data: mockData,
          message: 'Configuración obtenida'
        }
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getByIdConfigurationTypesSubtypes(5)

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/5`)
      expect(result).toEqual(mockData)
    })

    it('returns null when fetch by id fails', async () => {
      const store = useConfigurationTypesSubtypesStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Not found'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getByIdConfigurationTypesSubtypes(999)

      expect(result).toBeNull()
    })

    it('returns null when success is false', async () => {
      const store = useConfigurationTypesSubtypesStoreV1()
      const mockResponse = {
        data: {
          success: false,
          data: null,
          message: 'No se encontró la configuración'
        }
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getByIdConfigurationTypesSubtypes(5)

      expect(result).toBeNull()
    })
  })

  describe('_updateConfigurationTypesSubtypes', () => {
    it('updates configuration successfully', async () => {
      const store = useConfigurationTypesSubtypesStoreV1()
      const mockResponse = {
        data: {
          success: true,
          message: 'Configuración actualizada'
        }
      }
      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const payload: IAssetTypeRequest = {
        code: 105,
        type: 'activo fijo',
        description: 'Tipo actualizado',
        asset_class: 'Inmueble (INM)',
        subtypes: [
          {
            id: 1,
            code: '001',
            description: 'Subtipo actualizado',
            life_span: 150,
            depreciation: 8
          },
          {
            id: 2,
            delete: true
          }
        ]
      }

      const result = await store._updateConfigurationTypesSubtypes(5, payload)

      expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/5`, payload)
      expect(result).toBe(true)
    })

    it('returns false when update fails', async () => {
      const store = useConfigurationTypesSubtypesStoreV1()
      const mockPut = jest.fn().mockRejectedValue(new Error('Update failed'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const payload: IAssetTypeRequest = {
        code: 105,
        type: 'activo fijo',
        description: 'Test',
        asset_class: 'Mueble (MUB)',
        subtypes: []
      }

      const result = await store._updateConfigurationTypesSubtypes(5, payload)

      expect(result).toBe(false)
    })

    it('returns false when response success is false', async () => {
      const store = useConfigurationTypesSubtypesStoreV1()
      const mockResponse = {
        data: {
          success: false,
          message: 'Validación fallida'
        }
      }
      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const payload: IAssetTypeRequest = {
        code: 105,
        type: 'activo fijo',
        description: 'Test',
        asset_class: 'Mueble (MUB)',
        subtypes: []
      }

      const result = await store._updateConfigurationTypesSubtypes(5, payload)

      expect(result).toBe(false)
    })
  })
})
