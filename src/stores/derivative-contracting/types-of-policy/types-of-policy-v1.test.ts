import { setActivePinia, createPinia } from 'pinia'
import { useTypeOfPoliciesStoreV1 } from '@/stores/derivative-contracting/types-of-policy/types-of-policy-v1'
import { executeApi } from '@/apis'
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import type {
  ITypeOfPolicy,
  ITypeOfPolicyForm,
} from '@/interfaces/customs/derivative-contracting/TypesOfPolicy'

const BASE = `${URL_PATH_DERIVATIVE_CONTRACTING}/policies`

const mockList: ITypeOfPolicy[] = [
  {
    id: 1,
    code: 'POL-001',
    name: 'RC Extracontractual',
    stage: 'Ejecución',
    status_id: 1,
    status: { id: 1, name: 'Activo' },
    risks: [],
    created_at: '2025-10-22 10:00:00',
    updated_at: '2025-10-22 10:00:00',
  },
]

const mockById: ITypeOfPolicy = {
  id: 2,
  code: 'POL-002',
  name: 'Cumplimiento',
  stage: 'Precontractual',
  status_id: 1,
  status: { id: 1, name: 'Activo' },
  risks: [],
  created_at: '2025-10-22 11:00:00',
  updated_at: '2025-10-22 11:00:00',
}

const formPayload: ITypeOfPolicyForm = {
  name: 'Todo Riesgo Contratista',
  stage: 'Ejecución',
  status_id: 1,
  risk_ids: [1, 3],
}

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  })),
}))

jest.mock('@/composables/useAlert', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
}))

jest.mock('@/composables/useShowError', () => ({
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))

describe('useTypeOfPoliciesStoreV1 (estándar)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches type of policies list with paginate and params', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'OK',
        data: {
          data: mockList,
          current_page: 1,
          last_page: 1,
          total: 1,
          per_page: 20,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const qs = 'page=1&search=foo'
    await store._getTypeOfPolicies(qs)

    expect(mockGet).toHaveBeenCalledWith(`${BASE}?paginate=1&${qs}`)
    expect(store.type_of_policies_list).toEqual(mockList)
    expect(store.type_of_policies_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
      total_items: 1,
      per_page: 20,
    })
  })

  it('sets empty list when API returns non-array in data.data', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'OK',
        data: {
          data: { not: 'array' },
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: 20,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getTypeOfPolicies('page=1')

    expect(store.type_of_policies_list).toEqual([])
  })

  it('handles list with success=false', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Fail',
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: 20,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getTypeOfPolicies('page=1')

    expect(store.type_of_policies_list).toEqual([])
  })

  it('handles list catch error', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getTypeOfPolicies('page=1')

    expect(store.type_of_policies_list).toEqual([])
  })

  it('fetches a type of policy by id and returns the entity', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, data: mockById, message: 'OK' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const resp = await store._getByIdTypeOfPolicy(2)

    expect(mockGet).toHaveBeenCalledWith(`${BASE}/2`)
    expect(resp).toEqual(mockById)
    expect(store.type_of_policy_received_request).toEqual(mockById)
  })

  it('handles getById with success=false', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: false, data: null, message: 'Fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const resp = await store._getByIdTypeOfPolicy(99)

    expect(resp).toBeNull()
    expect(store.type_of_policy_received_request).toBeNull()
  })

  it('creates a type of policy', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const ok = await store._createTypeOfPolicy(formPayload)

    expect(mockPost).toHaveBeenCalledWith(`${BASE}`, formPayload)
    expect(ok).toBe(true)
  })

  it('returns false on create when success=false', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const ok = await store._createTypeOfPolicy(formPayload)
    expect(ok).toBe(false)
  })

  it('updates a type of policy', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const ok = await store._updateTypeOfPolicy(5, formPayload)

    expect(mockPut).toHaveBeenCalledWith(`${BASE}/5`, formPayload)
    expect(ok).toBe(true)
  })

  it('returns false on update when API throws', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const ok = await store._updateTypeOfPolicy(1, formPayload)
    expect(ok).toBe(false)
  })

  it('deletes a type of policy', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const ok = await store._deleteTypeOfPolicy(7)

    expect(mockDelete).toHaveBeenCalledWith(`${BASE}/7`)
    expect(ok).toBe(true)
  })

  it('returns false on delete when API throws', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const ok = await store._deleteTypeOfPolicy(7)
    expect(ok).toBe(false)
  })

  it('toggles type of policy status (changeStatus)', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Status Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const ok = await store._changeTypeOfPolicyStatus(9, 2)

    expect(mockPatch).toHaveBeenCalledWith(`${BASE}/9/toggle-status`, { status_id: 2 })
    expect(ok).toBe(true)
  })

  it('returns false when create fails (success=false)', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createTypeOfPolicy(formPayload)
    expect(result).toBe(false)
  })

  it('returns false when create throws error', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createTypeOfPolicy(formPayload)
    expect(result).toBe(false)
  })

  it('returns false when update returns success=false', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateTypeOfPolicy(10, formPayload)
    expect(result).toBe(false)
  })

  it('returns false when delete returns success=false', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteTypeOfPolicy(10)
    expect(result).toBe(false)
  })

  it('returns false when toggle-status fails (success=false)', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._changeTypeOfPolicyStatus(5, 2)
    expect(result).toBe(false)
  })

  it('returns false when toggle-status throws error', async () => {
    const store = useTypeOfPoliciesStoreV1()
    const mockPatch = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._changeTypeOfPolicyStatus(5, 2)
    expect(result).toBe(false)
  })

  it('clears all store state with _clearData', () => {
    const store = useTypeOfPoliciesStoreV1()

    store.type_of_policies_list = mockList
    store.type_of_policies_pages = { currentPage: 5, lastPage: 5, total_items: 10, per_page: 10 }
    store.type_of_policy_received_request = mockById

    store._clearData()

    expect(store.type_of_policies_list).toEqual([])
    expect(store.type_of_policies_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
      total_items: 0,
      per_page: 0,
    })
    expect(store.type_of_policy_received_request).toBeNull()
  })
})
