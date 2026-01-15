import { useBankStructureEquivalencesStoreV1 } from './banks-structure-equivalences-v1'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { IBankStructureEquivalence } from '@/interfaces/customs'

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
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error') })),
}))

describe('useBankStructureEquivalencesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of bank structure equivalences', async () => {
    const store = useBankStructureEquivalencesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          bank: {
            data: [
              {
                id: 1,
                bank_id: 1,
                typeable_type: 'document_type',
                typeable_id: 1,
                data_type: 'Numérico',
                equivalence_1: '123',
                equivalence_2: '456',
                equivalence_3: '',
              },
              {
                id: 2,
                bank_id: 1,
                typeable_type: 'document_type',
                typeable_id: 2,
                data_type: 'Texto',
                equivalence_1: 'abc',
                equivalence_2: 'def',
                equivalence_3: '',
              },
            ],
          },
        },
        current_page: 1,
        last_page: 2,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getList('param=test')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-structure-equivalences?param=test`
    )
    expect(store.equivalence_list.length).toBe(2)
    expect(store.equivalence_pages).toEqual({ currentPage: 1, lastPage: 2 })
  })

  it('handles error when fetching list of bank structure equivalences', async () => {
    const store = useBankStructureEquivalencesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getList('param=test')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-structure-equivalences?param=test`
    )
    expect(store.equivalence_list).toEqual([])
  })

  it('handles error when fetching bank structure equivalence by ID', async () => {
    const store = useBankStructureEquivalencesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getById(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-structure-equivalences/1`
    )
    expect(result).toEqual({})
    expect(store.equivalence_request).toBeNull()
  })

  it('creates a new bank structure equivalence', async () => {
    const store = useBankStructureEquivalencesStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      bank_id: 1,
      typeable_type: 'document_type',
      typeable_id: 2,
      data_type: 'Numérico',
      equivalence_1: '123456',
      equivalence_2: '123456',
      equivalence_3: '',
    }
    const result = await store._createAction(
      payload as IBankStructureEquivalence
    )

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-structure-equivalences`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error when creating bank structure equivalence', async () => {
    const store = useBankStructureEquivalencesStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      bank_id: 1,
      typeable_type: 'document_type',
      typeable_id: 2,
      data_type: 'Numérico',
      equivalence_1: '123456',
      equivalence_2: '123456',
      equivalence_3: '',
    }
    const result = await store._createAction(
      payload as IBankStructureEquivalence
    )

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-structure-equivalences`,
      payload
    )
    expect(result).toBe(false)
  })

  it('updates a bank structure equivalence', async () => {
    const store = useBankStructureEquivalencesStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = {
      id: 1,
      bank_id: 1,
      typeable_type: 'document_type',
      typeable_id: 2,
      data_type: 'Numérico',
      equivalence_1: '654321',
      equivalence_2: '654321',
      equivalence_3: '',
    }
    const result = await store._updateAction(
      payload as IBankStructureEquivalence
    )

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-structure-equivalences/1`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error when updating bank structure equivalence', async () => {
    const store = useBankStructureEquivalencesStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = {
      id: 1,
      bank_id: 1,
      typeable_type: 'document_type',
      typeable_id: 2,
      data_type: 'Numérico',
      equivalence_1: '654321',
      equivalence_2: '654321',
      equivalence_3: '',
    }
    const result = await store._updateAction(
      payload as IBankStructureEquivalence
    )

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-structure-equivalences/1`,
      payload
    )
    expect(result).toBe(false)
  })

  it('deletes a bank structure equivalence', async () => {
    const store = useBankStructureEquivalencesStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction(1)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-structure-equivalences/1`
    )
    expect(result).toBe(true)
  })

  it('handles error when deleting bank structure equivalence', async () => {
    const store = useBankStructureEquivalencesStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction(1)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/bank-structure-equivalences/1`
    )
    expect(result).toBe(false)
  })
})
