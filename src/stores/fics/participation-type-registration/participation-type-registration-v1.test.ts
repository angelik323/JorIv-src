// Vue - Vue Router - Pinia - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import {
  IParticipationTypeRegistrationCreatePayload,
  IParticipationTypeRegistration,
} from '@/interfaces/customs/fics/ParticipationTypeRegistration'

// Utils
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useParticipationTypeRegistrationStoreV1 } from './participation-type-registration-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
}))

describe('useParticipationTypeRegistrationStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list successfully and sorts items', async () => {
    const store = useParticipationTypeRegistrationStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Fetched correctly',
        data: {
          data: [
            { id: 2, name: 'B' },
            { id: 5, name: 'C' },
            { id: 1, name: 'A' },
          ],
          current_page: 3,
          last_page: 10,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('type=2')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/participation-types?paginate=1&type=2`
    )

    expect(store.participation_type_registration_list).toEqual([
      { id: 5, name: 'C' },
      { id: 2, name: 'B' },
      { id: 1, name: 'A' },
    ])

    expect(store.participation_type_registration_pages).toEqual({
      currentPage: 3,
      lastPage: 10,
    })
  })

  it('handles error when fetching list', async () => {
    const store = useParticipationTypeRegistrationStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('type=1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/participation-types?paginate=1&type=1`
    )

    expect(store.participation_type_registration_list).toEqual([])
    expect(store.participation_type_registration_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('cleans data successfully', () => {
    const store = useParticipationTypeRegistrationStoreV1()

    store.participation_type_registration_list = [
      { id: 9 },
    ] as IParticipationTypeRegistration[]
    store.participation_type_registration_pages = {
      currentPage: 4,
      lastPage: 9,
    }

    store._cleanData()

    expect(store.participation_type_registration_list).toEqual([])
    expect(store.participation_type_registration_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('creates record successfully', async () => {
    const store = useParticipationTypeRegistrationStoreV1()

    const payload = {
      code: 123,
      description: 'Test',
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._create(
      payload as IParticipationTypeRegistrationCreatePayload
    )

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/participation-types`,
      payload
    )

    expect(result).toBe(true)
  })

  it('handles error when creating record', async () => {
    const store = useParticipationTypeRegistrationStoreV1()

    const payload = { code: 123, description: 'Test' }

    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._create(
      payload as IParticipationTypeRegistrationCreatePayload
    )

    expect(result).toBe(false)
  })

  it('updates record successfully', async () => {
    const store = useParticipationTypeRegistrationStoreV1()

    const payload = { description: 'Updated' }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._update(10, payload)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/participation-types/10`,
      payload
    )

    expect(result).toBe(true)
  })

  it('handles error when updating record', async () => {
    const store = useParticipationTypeRegistrationStoreV1()

    const payload = { description: 'Fail' }

    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._update(50, payload)

    expect(result).toBe(false)
  })
})
