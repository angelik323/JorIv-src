import { setActivePinia, createPinia } from 'pinia'
import { useCollectionAccountingBlocksV1 } from './collection-accounting-blocks-v1'
import { executeApi } from '@/apis'
import { ICollectionAccountingBlocksResponse } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

describe('useCollectionAccountingBlocksV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of collection accounting blocks', async () => {
    const store = useCollectionAccountingBlocksV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [
            {
              id: 12,
              code: '002',
              description: 'Prueba 002',
              collection_structure: {
                id: 9,
                code: '009',
                structure: '0.0.00.00.00.00.00',
              },
              accounting_structure: {
                id: 33,
                code: '033',
                structure: 'Esto es un ejemplo',
              },
              cost_center_structure: {
                id: 35,
                code: '035',
                structure: 'struc1',
              },
              budget_structure: {
                id: 3,
                code: '003',
                structure: '0.0',
              },
              created_by: 14051,
              updated_by: 14051,
            },
          ],
          current_page: 1,
          last_page: 1,
        },
        message: 'Listado obtenido exitosamente.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingBlocksCollection()

    expect(mockGet).toHaveBeenCalled()
    expect(store.accounting_blocks_collections_list).toHaveLength(1)
  })

  it('fetches collection accounting block by ID', async () => {
    const store = useCollectionAccountingBlocksV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 12,
          code: '002',
          description: 'Prueba 002',
          collection_structure: {
            id: 9,
            code: '009',
            structure: '0.0.00.00.00.00.00',
          },
          accounting_structure: {
            id: 33,
            code: '033',
            structure: 'Esto es un ejemplo',
          },
          cost_center_structure: {
            id: 35,
            code: '035',
            structure: 'struc1',
          },
          budget_structure: {
            id: 3,
            code: '003',
            structure: '0.0',
          },
          business: [],
        },
        message: 'Registro obtenido exitosamente.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdCollectionAccountingBlocks(1)

    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/v2/accounting-blocks-collections/1?paginate=1&rows=20'
    )
    expect(store.type_accounting_blocks_collections_request).toBeDefined()
  })

  it('creates a collection accounting block', async () => {
    const store = useCollectionAccountingBlocksV1()
    const payload = {
      collection_structure_id: 1,
      accounting_structure_id: 1,
      cost_center_structure_id: 2,
      budget_structure_id: 3,
      description: 'Bloque mas ',
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: [],
        message: 'Registro creado exitosamente.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const success = await store._createCollectionAccountingBlocks(payload)

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/v2/accounting-blocks-collections',
      payload
    )
    expect(success).toBe(true)
  })

  it('updates a collection accounting block', async () => {
    const store = useCollectionAccountingBlocksV1()
    const payload = {
      collection_structure_id: 1,
      accounting_structure_id: 2,
      cost_center_structure_id: 3,
      budget_structure_id: 4,
      description: 'Bloque de prueba-2',
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: [],
        message: 'Registro actualizado exitosamente.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const success = await store._updateCollectionAccountingBlocks(payload, 1)

    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/v2/accounting-blocks-collections/1',
      payload
    )
    expect(success).toBe(true)
  })

  it('deletes a collection accounting block', async () => {
    const store = useCollectionAccountingBlocksV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: [],
        message: 'Registro eliminado exitosamente.',
      },
    })

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
        },
        message: 'Listado obtenido exitosamente.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({
      get: mockGet,
      post: jest.fn(),
      put: jest.fn(),
      delete: mockDelete,
    })

    await store._deleteCollectionAccountingBlock(1)

    expect(mockDelete).toHaveBeenCalledWith(
      'treasuries/api/treasuries/v2/accounting-blocks-collections/1'
    )
  })

  it('handles error when fetching list fails', async () => {
    const store = useCollectionAccountingBlocksV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingBlocksCollection()
    expect(mockGet).toHaveBeenCalled()
    expect(store.accounting_blocks_collections_list).toHaveLength(0)
  })

  it('handles error when fetching by ID fails', async () => {
    const store = useCollectionAccountingBlocksV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdCollectionAccountingBlocks(1)
    expect(mockGet).toHaveBeenCalled()
    expect(store.type_accounting_blocks_collections_request).toBeNull()
  })

  it('handles error when creating fails', async () => {
    const store = useCollectionAccountingBlocksV1()
    const payload = {}
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const success = await store._createCollectionAccountingBlocks(payload)
    expect(mockPost).toHaveBeenCalled()
    expect(success).toBe(false)
  })

  it('handles error when updating fails', async () => {
    const store = useCollectionAccountingBlocksV1()
    const payload = {}
    const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const success = await store._updateCollectionAccountingBlocks(payload, 1)
    expect(mockPut).toHaveBeenCalled()
    expect(success).toBe(false)
  })

  it('handles error when deleting fails', async () => {
    const store = useCollectionAccountingBlocksV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteCollectionAccountingBlock(1)
    expect(mockDelete).toHaveBeenCalled()
  })

  it('set data information form', () => {
    const store = useCollectionAccountingBlocksV1()
    const data: ICollectionAccountingBlocksResponse = {
      id: 1,
      code: '001',
    } as ICollectionAccountingBlocksResponse
    store._setDataInformationForm(data)
    expect(store.data_information_form).toEqual({ id: 1, code: '001' })
    store._setDataInformationForm(null)
    expect(store.data_information_form).toBeNull()
  })

  it('clean collection accounting blocks data', () => {
    const store = useCollectionAccountingBlocksV1()
    store.accounting_blocks_collections_list = [
      { id: 1 } as ICollectionAccountingBlocksResponse,
    ]
    store.accounting_blocks_collections_pages = { currentPage: 2, lastPage: 3 }
    store._cleanCollectionAccountingBlocksData()
    expect(store.accounting_blocks_collections_list).toEqual([])
    expect(store.accounting_blocks_collections_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('set collection accounting blocks request', async () => {
    const store = useCollectionAccountingBlocksV1()
    const data: ICollectionAccountingBlocksResponse = {
      id: 1,
      code: '001',
    } as ICollectionAccountingBlocksResponse
    await store._setCollectionAccountingBlocksRequest(data)
    expect(store.type_accounting_blocks_collections_request).toEqual({
      id: 1,
      code: '001',
    })
    await store._setCollectionAccountingBlocksRequest(null)
    expect(store.type_accounting_blocks_collections_request).toBeNull()
  })

  it('isValidMessageLike returns true for string', () => {
    const store = useCollectionAccountingBlocksV1()
    expect(store._isValidMessageLike('mensaje')).toBe(true)
  })

  it('isValidMessageLike returns false for non-string', () => {
    const store = useCollectionAccountingBlocksV1()
    expect(store._isValidMessageLike(123 as unknown as string)).toBe(false)
  })

  it('handles unsuccessful response in _getAccountingBlocksCollection', async () => {
    const store = useCollectionAccountingBlocksV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: {},
        message: 'Error',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAccountingBlocksCollection()
    expect(store.accounting_blocks_collections_list).toEqual([])
  })

  it('handles unsuccessful response in _getByIdCollectionAccountingBlocks', async () => {
    const store = useCollectionAccountingBlocksV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: {},
        message: 'Error',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getByIdCollectionAccountingBlocks(1)
  })

  it('handles unsuccessful response in _createCollectionAccountingBlocks', async () => {
    const store = useCollectionAccountingBlocksV1()
    const payload = {} as ICollectionAccountingBlocksResponse
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Error',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const success = await store._createCollectionAccountingBlocks(payload)
    expect(success).toBe(false)
  })

  it('handles unsuccessful response in _updateCollectionAccountingBlocks', async () => {
    const store = useCollectionAccountingBlocksV1()
    const payload = {} as ICollectionAccountingBlocksResponse
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Error',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })
    const success = await store._updateCollectionAccountingBlocks(payload, 1)
    expect(success).toBe(false)
  })

  it('handles _changeStatusAction', async () => {
    const store = useCollectionAccountingBlocksV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Eliminado',
      },
    })
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
        },
        message: 'Listado obtenido exitosamente.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({
      delete: mockDelete,
      get: mockGet,
    })
    await store._changeStatusAction(1)
    expect(mockDelete).toHaveBeenCalled()
  })

  it('should set error_information_form when _createCollectionAccountingBlocks receives error with valid message', async () => {
    const store = useCollectionAccountingBlocksV1()
    const payload = {} as ICollectionAccountingBlocksResponse
    const error = {
      response: { data: { message: 'Mensaje válido' } },
    }
    const mockPost = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._createCollectionAccountingBlocks(payload)
    expect(store.error_information_form).toBe('Mensaje válido')
    expect(result).toBe(false)
  })

  it('should set error_information_form to null when _createCollectionAccountingBlocks receives error with invalid message', async () => {
    const store = useCollectionAccountingBlocksV1()
    const payload = {} as ICollectionAccountingBlocksResponse
    const error = {
      response: { data: { message: 123 } },
    }
    const mockPost = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._createCollectionAccountingBlocks(payload)
    expect(store.error_information_form).toBeNull()
    expect(result).toBe(false)
  })

  it('should set error_information_form when _updateCollectionAccountingBlocks receives error with valid message', async () => {
    const store = useCollectionAccountingBlocksV1()
    const payload = {} as ICollectionAccountingBlocksResponse
    const error = {
      response: { data: { message: 'Mensaje válido' } },
    }
    const mockPut = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })
    const result = await store._updateCollectionAccountingBlocks(payload, 1)
    expect(store.error_information_form).toBe('Mensaje válido')
    expect(result).toBe(false)
  })

  it('should set error_information_form to null when _updateCollectionAccountingBlocks receives error with invalid message', async () => {
    const store = useCollectionAccountingBlocksV1()
    const payload = {} as ICollectionAccountingBlocksResponse
    const error = {
      response: { data: { message: 123 } },
    }
    const mockPut = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })
    const result = await store._updateCollectionAccountingBlocks(payload, 1)
    expect(store.error_information_form).toBeNull()
    expect(result).toBe(false)
  })

  it('should call _cleanCollectionAccountingBlocksData on _getAccountingBlocksCollection error', async () => {
    const store = useCollectionAccountingBlocksV1()
    const spy = jest.spyOn(store, '_cleanCollectionAccountingBlocksData')
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAccountingBlocksCollection()
    expect(spy).toHaveBeenCalled()
  })

  it('should call _cleanCollectionAccountingBlocksData on _getAccountingBlocksCollection unsuccessful', async () => {
    const store = useCollectionAccountingBlocksV1()
    const spy = jest.spyOn(store, '_cleanCollectionAccountingBlocksData')
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: {},
        message: 'Error',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAccountingBlocksCollection()
    expect(spy).toHaveBeenCalled()
  })

  it('should not set type_accounting_blocks_collections_request if response is not success in _getByIdCollectionAccountingBlocks', async () => {
    const store = useCollectionAccountingBlocksV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: null,
        message: 'Error',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getByIdCollectionAccountingBlocks(1)
    expect(store.type_accounting_blocks_collections_request).toBeNull()
  })

  it('should handle error in _getByIdCollectionAccountingBlocks', async () => {
    const store = useCollectionAccountingBlocksV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getByIdCollectionAccountingBlocks(1)
    expect(store.type_accounting_blocks_collections_request).toBeNull()
  })
})
