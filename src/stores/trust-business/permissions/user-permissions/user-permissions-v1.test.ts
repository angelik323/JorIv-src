import { setActivePinia, createPinia } from 'pinia'
import { useUserPermissionsStoreV1 } from './user-permissions-v1'
import { executeApi } from '@/apis'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { IManagePermissionsByUser } from '@/interfaces/customs'

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

describe('useUserPermissionsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch business list by user ID', async () => {
    const store = useUserPermissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched successfully',
        data: {
          data: [
            { id: 1, code: '001', name: 'Business A', has_permission: true },
          ],
          current_page: 1,
          last_page: 2,
        },
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getBusinessListByUser(42, { page: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/permissions/by-user/42`,
      { params: { page: 1, paginate: 1 } }
    )

    expect(store.business_list_by_user).toEqual([
      { id: 1, code: '001', name: 'Business A', has_permission: true },
    ])
    expect(store.business_list_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('should handle error when fetching business list by user', async () => {
    const store = useUserPermissionsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getBusinessListByUser(42, { page: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/permissions/by-user/42`,
      { params: { page: 1, paginate: 1 } }
    )
    expect(store.business_list_by_user).toEqual([])
  })

  it('should manage permissions by user successfully', async () => {
    const store = useUserPermissionsStoreV1()
    const payload: IManagePermissionsByUser = {
      business: [
        { business_id: 1, has_permission: true },
        { business_id: 2, has_permission: false },
      ],
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Permissions updated successfully',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._managePermissionsByUser(42, payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/permissions/manage-by-user/42`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should return false if managing permissions fails', async () => {
    const store = useUserPermissionsStoreV1()
    const payload: IManagePermissionsByUser = {
      business: [
        { business_id: 1, has_permission: true },
        { business_id: 2, has_permission: false },
      ],
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Error updating permissions',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._managePermissionsByUser(42, payload)

    expect(result).toBe(false)
  })

  it('should return false if API throws an error when managing permissions', async () => {
    const store = useUserPermissionsStoreV1()
    const payload: IManagePermissionsByUser = {
      business: [
        { business_id: 1, has_permission: true },
        { business_id: 2, has_permission: false },
      ],
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._managePermissionsByUser(42, payload)

    expect(result).toBe(false)
  })

  it('should clear store data', () => {
    const store = useUserPermissionsStoreV1()

    store.business_list_by_user = [
      { id: 1, code: '001', name: 'Test', has_permission: false },
    ]
    store.business_list_pages = { currentPage: 2, lastPage: 5 }

    store._clearData()

    expect(store.business_list_by_user).toEqual([])
    expect(store.business_list_pages).toEqual({ currentPage: 0, lastPage: 0 })
  })

  it('should transfer permissions successfully and return true', async () => {
    const store = useUserPermissionsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Permisos transferidos correctamente',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._transferPermissionsByUser(1, 2)

    expect(mockPost).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/permissions/user-to-user/1?toUser=2`
    )
    expect(result).toBe(true)
  })

  it('should return false when transfer fails with success = false', async () => {
    const store = useUserPermissionsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'No se pudieron transferir los permisos',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._transferPermissionsByUser(10, 20)

    expect(result).toBe(false)
  })

  it('should handle exception and return false when transfer throws error', async () => {
    const store = useUserPermissionsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._transferPermissionsByUser(3, 4)

    expect(result).toBe(false)
  })
})
