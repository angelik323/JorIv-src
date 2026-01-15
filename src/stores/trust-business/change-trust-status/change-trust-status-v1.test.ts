import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useChangeTrustStatusStoreV1 } from './change-trust-status-v1'

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
describe('useChangeTrustStatusStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of change trust status', async () => {
    // Arrange
    const store = useChangeTrustStatusStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          data: [
            {
              id: 17,
              business_code: '104001',
              name: 'TEST 104001',
              register_type: 'Fideicomiso',
              start_date: '2025-05-27',
              business_type_id: 10,
              business_subtype_id: 20,
              status_id: 57,
              status: {
                id: 57,
                status: 'Vigente',
              },
              last_status_history: null,
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
      expect.stringContaining('/manage/status/list?paginate=1')
    )
    expect(store.change_trust_status_list.length).toBe(1)
  })

  it('handles error when fetching list of change trust status', async () => {
    // Arrange
    const store = useChangeTrustStatusStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/manage/status/list?paginate=1')
    )
    expect(store.change_trust_status_list).toHaveLength(0)
  })

  it('fetches change trust status by ID', async () => {
    // Arrange
    const store = useChangeTrustStatusStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          id: 17,
          business_code: '104001',
          name: 'TEST 104001',
          register_type: 'Fideicomiso',
          start_date: '2025-05-27',
          business_type_id: 10,
          business_subtype_id: 20,
          status_id: 57,
          status: {
            id: 57,
            status: 'Vigente',
          },
          last_status_history: null,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdChangeTrustStatus(17)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/manage/status/17')
    )

    expect(store.change_trust_status_request?.id_business_trust).not.toBeNull()
  })

  it('handles error when fetching change trust status by ID', async () => {
    // Arrange
    const store = useChangeTrustStatusStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    // Act
    await store._getByIdChangeTrustStatus(17)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/manage/status/17')
    )
    expect(store.change_trust_status_request).toBeNull()
  })

  it('updates change trust status', async () => {
    // Arrange
    const store = useChangeTrustStatusStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Updated',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._updateChangeTrustStatus(
      {
        id_business_trust: 101,
        id_status_history: 55,
        business_code: 'TRUST-2025-001',
        name: 'Fideicomiso Ejemplo S.A.S.',
        status_id: 2,
        status: 'Activo',
        observation: 'Cambio de estado por actualización de documentos.',
        previous_status_id: 1,
        previous_status: null,
        created_at: null,
      },
      17
    )

    // Assert
    expect(result).toBe(true)
  })

  it('handles error when updating change trust status', async () => {
    // Arrange
    const store = useChangeTrustStatusStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._updateChangeTrustStatus(
      {
        id_business_trust: 101,
        id_status_history: 55,
        business_code: 'TRUST-2025-001',
        name: 'Fideicomiso Ejemplo S.A.S.',
        status_id: 2,
        status: 'Activo',
        observation: 'Cambio de estado por actualización de documentos.',
        previous_status_id: 1,
        previous_status: null,
        created_at: null,
      },
      17
    )

    // Assert
    expect(result).toBe(false)
  })
})
