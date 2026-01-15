import { setActivePinia, createPinia } from 'pinia'
import { useExtendTrustStorev1 } from './extend-trust-v1'
import { executeApi } from '@/apis'

const TRUST_BUSINESS_API_URL = 'business-trust/api/business-trust'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

describe('useExtendTrustStorev1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches extend trust requests by status', async () => {
    // Arrange
    const store = useExtendTrustStorev1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          data: [
            {
              id: 8,
              business_code: 'code102',
              name: 'test102',
              start_date: '2025-05-01',
              end_date: '2025-05-08',
              status_id: 56,
              status: {
                id: 56,
                status: 'Preoperativo',
              },
              last_extension: null,
            },
          ],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/extend/list?paginate=1`
    )
    expect(store.extend_trust_list).toHaveLength(1)
    expect(store.extend_trust_list[0].id).toEqual(8)
  })

  it('handles error when fetching extend trust requests', async () => {
    // Arrange
    const store = useExtendTrustStorev1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/extend/list?paginate=1`
    )
    expect(store.extend_trust_list).toHaveLength(0)
  })

  it('fetches extend trust request by ID', async () => {
    // Arrange
    const store = useExtendTrustStorev1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          id: 8,
          business_code: 'code102',
          name: 'test102',
          start_date: '2025-05-01',
          end_date: '2025-05-08',
          status_id: 56,
          status: {
            id: 56,
            status: 'Preoperativo',
          },
          last_extension: null,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getExtendById(8)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/extend/8`
    )
    expect(store.extend_trust_request).toEqual({
      id: 8,
      business_code: 'code102',
      name: 'test102',
      start_date: '2025-05-01',
      end_date: '2025-05-08',
      status_id: 56,
      status: {
        id: 56,
        status: 'Preoperativo',
      },
      last_extension: null,
    })
  })

  it('handles error when fetching extend trust request by ID', async () => {
    // Arrange
    const store = useExtendTrustStorev1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getExtendById(8)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/extend/8`
    )
    expect(store.extend_trust_request).toBeNull()
  })

  it('creates an extend trust request and returns true on success', async () => {
    // Arrange
    const store = useExtendTrustStorev1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createExtendTrustAction(
      {
        id: 8,
        extension_date: '2025-05-01',
        observation: 'Test reason',
      },
      'create'
    )

    // Assert
    expect(result).toBe(true)
  })

  it('handles error when creating extend trust request fails', async () => {
    // Arrange
    const store = useExtendTrustStorev1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createExtendTrustAction(
      {
        id: 8,
        extension_date: '2025-05-01',
        observation: 'Test reason',
      },
      'create'
    )

    // Assert
    expect(result).toBe(false)
  })
})
