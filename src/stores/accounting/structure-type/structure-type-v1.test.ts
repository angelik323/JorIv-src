import { setActivePinia, createPinia } from 'pinia'
import { useStructureTypesStoreV1 } from './structure-type-v1'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { IStructureType } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  })),
}))

let mockShowAlert: jest.Mock
let mockShowCatchError: jest.Mock

jest.mock('@/composables', () => {
  mockShowAlert = jest.fn()
  mockShowCatchError = jest.fn().mockReturnValue('Error catch')

  return {
    useAlert: () => ({ showAlert: mockShowAlert }),
    useShowError: () => ({ showCatchError: mockShowCatchError }),
  }
})

describe('useStructureTypesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const structureTypeMock: IStructureType = {
    id: 1,
    code: 'EC001',
    name: 'Estructura contable',
    status: { id: 1, name: 'Activo' },
  }

  it('should fetch structure types list successfully', async () => {
    const store = useStructureTypesStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'List fetched',
        data: {
          current_page: 1,
          last_page: 1,
          data: [structureTypeMock],
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction()
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/structure-types?paginate=1`
    )
    expect(store.structure_types_list).toMatchObject([structureTypeMock])
    expect(store.structure_types_pages).toMatchObject({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('should handle error response in _getListAction', async () => {
    const store = useStructureTypesStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'Error',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction()
    expect(store.structure_types_list).toMatchObject([])
    expect(store.structure_types_pages).toMatchObject({
      currentPage: 0,
      lastPage: 0,
    })
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error',
      'error',
      undefined,
      3000
    )
  })

  it('should handle catch error in _getListAction', async () => {
    const store = useStructureTypesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should create structure type successfully', async () => {
    const store = useStructureTypesStoreV1()
    const payload = { name: 'Nueva estructura' }
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createStructureType(payload)
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/structure-types`,
      payload
    )
  })

  it('should fail to create structure type', async () => {
    const store = useStructureTypesStoreV1()
    const payload = { name: 'Nueva estructura' }
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Falló' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createStructureType(payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Falló',
      'error',
      undefined,
      3000
    )
  })

  it('should catch error in _createStructureType', async () => {
    const store = useStructureTypesStoreV1()
    const payload = { name: 'Error' }
    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createStructureType(payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should fetch structure type by ID successfully', async () => {
    const store = useStructureTypesStoreV1()
    const mockResponse = {
      data: { success: true, message: 'Encontrado', data: structureTypeMock },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getStructureType(1)
    expect(result).toMatchObject(structureTypeMock)
  })

  it('should return null if structure type not found', async () => {
    const store = useStructureTypesStoreV1()
    const mockResponse = {
      data: { success: false, message: 'No encontrado', data: null },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getStructureType(99)
    expect(result).toBeNull()
  })

  it('should catch error in _getStructureType', async () => {
    const store = useStructureTypesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getStructureType(1)
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should update structure type successfully', async () => {
    const store = useStructureTypesStoreV1()
    const payload = { name: 'Actualizado' }
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateStructureType(1, payload)
    expect(result).toBe(true)
  })

  it('should fail to update structure type', async () => {
    const store = useStructureTypesStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Falló' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateStructureType(1, {
      name: 'No se actualiza',
    })
    expect(result).toBe(false)
  })

  it('should catch error in _updateStructureType', async () => {
    const store = useStructureTypesStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateStructureType(1, { name: 'X' })
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should toggle structure type status', async () => {
    const store = useStructureTypesStoreV1()
    store.selected_structure_type = structureTypeMock

    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Estado cambiado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._toggleStructureTypeStatus()
    expect(result).toBe(true)
    expect(mockPatch).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/structure-types/1/status`,
      { status_id: 2 }
    )
  })

  it('should return false if no selected structure type', async () => {
    const store = useStructureTypesStoreV1()
    store.selected_structure_type = null

    const result = await store._toggleStructureTypeStatus()
    expect(result).toBe(false)
  })

  it('should catch error in _toggleStructureTypeStatus', async () => {
    const store = useStructureTypesStoreV1()
    store.selected_structure_type = structureTypeMock

    const mockPatch = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._toggleStructureTypeStatus()
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should select structure type', () => {
    const store = useStructureTypesStoreV1()
    store._selectStructureType(structureTypeMock)
    expect(store.selected_structure_type).toMatchObject(structureTypeMock)
  })
})
