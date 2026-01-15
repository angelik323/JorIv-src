import { setActivePinia, createPinia } from 'pinia'
import { useBusinessPermissionsStoreV1 } from './business-permissions-v1'
import { executeApi } from '@/apis'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { IManagePermissionsByBusiness } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))

describe('useBusinessPermissionsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch user list by business', async () => {
    const store = useBusinessPermissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          data: [
            {
              id: 1,
              name: 'Test',
              last_name: 'User',
              document: '123',
              has_permission: true,
            },
          ],
          current_page: 1,
          last_page: 2,
        },
      },
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getUserListByBusiness(1, params)

    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/permissions/by-business/1`,
      { params: { ...params, paginate: 1 } }
    )
    expect(store.user_list_by_business).toEqual([
      {
        id: 1,
        name: 'Test',
        last_name: 'User',
        document: '123',
        has_permission: true,
      },
    ])
    expect(store.user_list_pages).toEqual({ currentPage: 1, lastPage: 2 })
  })

  it('should handle error when fetching user list', async () => {
    const store = useBusinessPermissionsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getUserListByBusiness(1, { page: 1 })

    expect(store.user_list_by_business).toEqual([])
    expect(store.user_list_pages).toEqual({ currentPage: 0, lastPage: 0 })
  })

  it('should manage permissions by business', async () => {
    const store = useBusinessPermissionsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Permissions updated' },
    })
    const payload: IManagePermissionsByBusiness = {
      users: [
        { user_id: 1, has_permission: true },
        { user_id: 2, has_permission: false },
      ],
    }

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._managePermissionsByBusiness(1, payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/permissions/manage-by-business/1`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should return false if manage permissions fails', async () => {
    const store = useBusinessPermissionsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Failed' },
    })

    const payload: IManagePermissionsByBusiness = {
      users: [{ user_id: 1, has_permission: true }],
    }

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._managePermissionsByBusiness(1, payload)

    expect(result).toBe(false)
  })

  it('should clear the store data', () => {
    const store = useBusinessPermissionsStoreV1()
    store.user_list_by_business = [
      {
        id: 1,
        name: 'A',
        last_name: 'B',
        document: '123',
        has_permission: false,
      },
    ]
    store.user_list_pages = { currentPage: 5, lastPage: 10 }

    store._clearData()

    expect(store.user_list_by_business).toEqual([])
    expect(store.user_list_pages).toEqual({ currentPage: 0, lastPage: 0 })
  })
})
