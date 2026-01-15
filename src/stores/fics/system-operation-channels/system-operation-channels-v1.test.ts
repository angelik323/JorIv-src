// Vue - Vue Router - Pinia - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Utils
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useSystemOperationChannelsStoreV1 } from './system-operation-channels-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
}))

describe('useSystemOperationChannelsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches system operation channels list successfully', async () => {
    const store = useSystemOperationChannelsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Fetched',
        data: [{ id: 5, code: 'CH-01' }],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getSystemOperationChannelsList()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/system-operation-channels/channels-list`
    )
    expect(store.system_operation_channels_list).toEqual(mockResponse.data.data)
  })

  it('handles error when fetching system operation channels list', async () => {
    const store = useSystemOperationChannelsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getSystemOperationChannelsList()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/system-operation-channels/channels-list`
    )

    expect(store.system_operation_channels_list).toEqual([])
  })
})
