import { setActivePinia, createPinia } from 'pinia'
import { useTypeCommissionsStoreV1 } from './type-commissions-v1'
import { executeApi } from '@/apis'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { ITypeCommissionsInformationForm } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))

describe('useTypeCommissionsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of type commissions', async () => {
    const store = useTypeCommissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [
            {
              id: 1,
              commission_type_catalog: { id: 1, name: 'Type A' },
              commission_class_catalog: { id: 1, name: 'Class A' },
              description: 'Test',
            },
          ],
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getTypeCommissionsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.type_commissions_list).toEqual([
      {
        id: 1,
        commission_type_catalog: { id: 1, name: 'Type A' },
        commission_class_catalog: { id: 1, name: 'Class A' },
        description: 'Test',
      },
    ])
    expect(store.type_commissions_pages.currentPage).toBe(1)
    expect(store.type_commissions_pages.lastPage).toBe(2)
  })

  it('should handle error when fetching type commissions', async () => {
    const store = useTypeCommissionsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getTypeCommissionsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.type_commissions_list).toEqual([])
  })

  it('should fetch type commission by ID', async () => {
    const store = useTypeCommissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 1,
          commission_type_catalog: { id: 1, name: 'Type A' },
          commission_type_catalog_id: 1,
          commission_class_catalog: { id: 1, name: 'Class A' },
          commission_class_catalog_id: 1,
          description: 'Test',
        },
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdTypeCommissions(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types/1`
    )
    expect(store.type_commissions_response).toEqual({
      id: 1,
      commission_type_catalog: { id: 1, name: 'Type A' },
      commission_type_catalog_id: 1,
      commission_class_catalog: { id: 1, name: 'Class A' },
      commission_class_catalog_id: 1,
      description: 'Test',
    })
  })

  it('should handle error when fetching type commission by ID', async () => {
    const store = useTypeCommissionsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdTypeCommissions(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types/1`
    )
    expect(store.type_commissions_response).toBeNull()
  })

  it('should create a new type commission', async () => {
    const store = useTypeCommissionsStoreV1()
    const formData: ITypeCommissionsInformationForm = {
      description: 'Test',
      commission_type_catalog_id: 1,
      commission_class_catalog_id: 1,
      value: 0,
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Rejection reason created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createTypeCommissions(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if creation fails', async () => {
    const store = useTypeCommissionsStoreV1()
    const formData: ITypeCommissionsInformationForm = {
      description: 'Test',
      commission_type_catalog_id: 1,
      commission_class_catalog_id: 1,
      value: 0,
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createTypeCommissions(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should return false when API throws an error', async () => {
    const store = useTypeCommissionsStoreV1()
    const formData: ITypeCommissionsInformationForm = {
      description: 'Test',
      commission_type_catalog_id: 1,
      commission_class_catalog_id: 1,
      value: 0,
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createTypeCommissions(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should update a type commission', async () => {
    const store = useTypeCommissionsStoreV1()
    const form: ITypeCommissionsInformationForm = {
      description: 'Updated',
      commission_type_catalog_id: 1,
      commission_class_catalog_id: 1,
      value: 0,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateTypeCommissions(form, 1)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types/1`,
      form
    )
    expect(result).toBe(true)
  })

  it('should return false if update fails', async () => {
    const store = useTypeCommissionsStoreV1()
    const form: ITypeCommissionsInformationForm = {
      description: 'Updated',
      commission_type_catalog_id: 1,
      commission_class_catalog_id: 1,
      value: 0,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateTypeCommissions(form, 1)

    expect(result).toBe(false)
  })

  it('should clear all data in the store', () => {
    const store = useTypeCommissionsStoreV1()

    store.type_commissions_list = [
      {
        id: 1,
        description: 'Test',
        commission_class_catalog: {
          id: 1,
          name: 'Class A',
        },
        commission_type_catalog: {
          id: 1,
          name: 'Type A',
        },
        created_by: 1,
        updated_by: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ]

    store.type_commissions_response = {
      id: 1,
      commission_type_catalog: {
        id: 1,
        name: 'Type A',
      },
      commission_class_catalog: {
        id: 1,
        name: 'Class A',
      },
      value: 0,
      commission_type_catalog_id: 1,
      commission_class_catalog_id: 1,
      description: 'Test',
      created_by: 1,
      updated_by: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    }

    store.type_commissions_pages = {
      currentPage: 2,
      lastPage: 3,
    }

    store._clearData()

    expect(store.type_commissions_list).toEqual([])
    expect(store.type_commissions_response).toBeNull()
    expect(store.type_commissions_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
