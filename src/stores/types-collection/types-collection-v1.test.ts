import { setActivePinia, createPinia } from 'pinia'
import { useTypesCollection } from './types-collection-v1'
import { executeApi } from '@/apis'
import { ITypesCollectionDetail } from '@/interfaces/customs/TypesCollection'
const URL_PATH_TREASURIES = 'treasuries/api/treasuries'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const useAlert = jest.fn(() => ({ showAlert: jest.fn() }))
  const useShowError = jest.fn(() => ({ showCatchError: jest.fn() }))
  return { useAlert, useShowError }
})

describe('useTypesCollection', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch types collection', async () => {
    // Arrange
    const store = useTypesCollection()
    const mockGet: jest.Mock = jest.fn().mockResolvedValue({
      data: [],
      message: 'Listado obtenido exitosamente.',
      success: true,
    })
    const payload = '&page=1'

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTypeCollection(payload)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/type-receives?paginate=1${payload}`
    )
  })

  it('should create a new type collection', async () => {
    // Arrange
    const store = useTypesCollection()
    const mockPost = jest.fn().mockResolvedValue({})
    const payload = { name: 'test' }

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    await store._createTypeCollection(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/type-receives`,
      payload
    )
  })

  it('should update types collection', async () => {
    // Arrange
    const store = useTypesCollection()
    const mockPut = jest.fn().mockResolvedValue({})
    const id = 1
    const payload = {
      id: 1,
      code: '001',
      description: 'Descripción del tipo',
      type_receive: 'consignacion',
      redemption_days: '30',
      status_id: 1,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: null,
      deleted_at: null,
    }

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    await store._updateTypeCollection(payload, id)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/type-receives/${id}`,
      payload
    )
  })

  it('should delete types collection', async () => {
    // Arrange
    const store = useTypesCollection()
    const mockDelete = jest.fn().mockResolvedValue({})
    const mockGet = 54

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    await store._deleteTypeCollection(mockGet)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/type-receives/${mockGet}`
    )
  })

  it('should fetch types collection successfully', async () => {
    // Arrange
    const store = useTypesCollection()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Listado obtenido exitosamente.',
        data: {
          data: [{ id: 1, name: 'Tipo 1' }],
          current_page: 1,
          last_page: 2,
        },
      },
    })
    const payload = '&page=1'

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTypeCollection(payload)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/type-receives?paginate=1${payload}`
    )
    expect(store.types_collection_list).toEqual([{ id: 1, name: 'Tipo 1' }])
    expect(store.types_collection_pages.currentPage).toBe(1)
    expect(store.types_collection_pages.lastPage).toBe(2)
  })

  it('should handle errors when fetching types collection', async () => {
    // Arrange
    const store = useTypesCollection()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error de API'))
    const payload = '&page=1'

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTypeCollection(payload)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/type-receives?paginate=1${payload}`
    )
    expect(store.types_collection_list).toEqual([])
  })

  it('should fetch type collection by ID successfully', async () => {
    // Arrange
    const store = useTypesCollection()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Tipo obtenido exitosamente.',
        data: { id: 1, name: 'Tipo 1' },
      },
    })
    const id = 1

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdTypeCollection(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/type-receives/${id}`
    )
    expect(store.type_received_request).toEqual({ id: 1, name: 'Tipo 1' })
  })

  it('should handle errors when fetching type collection by ID', async () => {
    // Arrange
    const store = useTypesCollection()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error de API'))
    const id = 1

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdTypeCollection(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/type-receives/${id}`
    )
    expect(store.type_received_request).toBeNull()
  })
  it('should handle errors when deleting type collection', async () => {
    // Arrange
    const store = useTypesCollection()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Error de API'))
    const params = 1

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    await store._deleteTypeCollection(params)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/type-receives/${params}`
    )
  })

  it('should set data_information_form with provided data', () => {
    // Arrange
    const store = useTypesCollection()
    const mockData: ITypesCollectionDetail = {
      id: 1,
      code: '001',
      description: 'Descripción del tipo',
      type_receive: 'consignacion',
      redemption_days: '30',
      status_id: '1',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: null,
      deleted_at: null,
    }

    // Act
    store._setDataBasicCollection(mockData)

    // Assert
    expect(store.data_information_form).toEqual(mockData)
  })

  it('should set data_information_form to null when no data is provided', () => {
    // Arrange
    const store = useTypesCollection()

    // Act
    store._setDataBasicCollection(null)

    // Assert
    expect(store.data_information_form).toBeNull()
  })
  it('should set data_information_form with provided data', () => {
    // Arrange
    const store = useTypesCollection()
    const mockData: ITypesCollectionDetail = {
      id: 1,
      code: '001',
      description: 'Descripción del tipo',
      type_receive: 'consignacion',
      redemption_days: '30',
      status_id: '1',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: null,
      deleted_at: null,
    }

    // Act
    store._setDataBasicCollection(mockData)

    // Assert
    expect(store.data_information_form).toEqual(mockData)
  })

  it('should set data_information_form to null when no data is provided', () => {
    // Arrange
    const store = useTypesCollection()

    // Act
    store._setDataBasicCollection(null)

    // Assert
    expect(store.data_information_form).toBeNull()
  })
})
