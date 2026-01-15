import { setActivePinia, createPinia } from 'pinia'
import { useWorkPlansStoreV1 } from '@/stores/derivative-contracting/work-plans/work-plans-v1'
import { executeApi } from '@/apis'
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import type { ITypeWorkPlanForm, ITypesWorkPlanResponse } from '@/interfaces/customs/derivative-contracting/WorkPlans'

const BASE_PATH = `${URL_PATH_DERIVATIVE_CONTRACTING}/work-plan`

const mockList: ITypesWorkPlanResponse[] = [
  {
    id: 1,
    code: 'WP-001',
    name: 'Plan de obra A',
    description: 'Descripción A',
    status_id: 1,
    status: { id: 1, name: 'Activo' },
    created_at: '2025-10-22 10:00:00',
    updated_at: '2025-10-22 10:00:00',
  } as unknown as ITypesWorkPlanResponse,
]

const mockById: ITypesWorkPlanResponse = {
  id: 2,
  code: 'WP-002',
  name: 'Plan de obra B',
  description: 'Descripción B',
  status_id: 1,
  status: { id: 1, name: 'Activo' },
  created_at: '2025-10-22 11:00:00',
  updated_at: '2025-10-22 11:00:00',
} as unknown as ITypesWorkPlanResponse

const formPayload: ITypeWorkPlanForm = {
  code: 'WP-003',
  name: 'Plan de obra C',
  description: 'Descripción C',
  status_id: 1,
} as unknown as ITypeWorkPlanForm

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

describe('useWorkPlansStoreV1 (standardized paginate=1)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches work plans list with paginate=1 and params', async () => {
    const store = useWorkPlansStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Listado OK',
        data: {
          data: mockList,
          current_page: 1,
          last_page: 3,
          total: 1,
          per_page: 10,
        },
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = 'page=1&search=foo'
    await store._getWorkPlans(params)

    expect(mockGet).toHaveBeenCalledWith(`${BASE_PATH}?paginate=1&${params}`)
    expect(store.work_plans_list).toEqual(mockList)
    expect(store.work_plans_pages).toEqual({
      currentPage: 1,
      lastPage: 3,
      total_items: 1,
      per_page: 10,
    })
  })

  it('fetches work plans list with paginated payload and only page param', async () => {
    const store = useWorkPlansStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Listado OK',
        data: {
          data: mockList,
          current_page: 2,
          last_page: 5,
          total: 10,
          per_page: 2,
        },
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getWorkPlans('page=2')

    expect(mockGet).toHaveBeenCalledWith(`${BASE_PATH}?paginate=1&page=2`)
    expect(store.work_plans_list).toEqual(mockList)
    expect(store.work_plans_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
      total_items: 10,
      per_page: 2,
    })
  })

  it('sets empty list if API returns non-array items inside pagination', async () => {
    const store = useWorkPlansStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'OK',
        data: {
          data: { not: 'array' },
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: 10,
        },
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getWorkPlans('page=1')

    expect(store.work_plans_list).toEqual([])
    expect(store.work_plans_pages.currentPage).toBe(1)
  })

  it('handles getWorkPlans with success=false', async () => {
    const store = useWorkPlansStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: false, data: { data: [] }, message: 'Fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getWorkPlans('page=1')
    expect(store.work_plans_list).toEqual([])
  })

  it('handles getWorkPlans catch error', async () => {
    const store = useWorkPlansStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getWorkPlans('page=1')
    expect(store.work_plans_list).toEqual([])
  })

  it('fetches work plan by ID and returns the entity', async () => {
    const store = useWorkPlansStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, data: mockById, message: 'Detalle OK' },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const resp = await store._getByIdWorkPlan(2)
    expect(mockGet).toHaveBeenCalledWith(`${BASE_PATH}/2`)
    expect(store.work_plan_received_request).toEqual(mockById)
    expect(resp).toEqual(mockById)
  })

  it('handles getByIdWorkPlan with success=false', async () => {
    const store = useWorkPlansStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: false, data: null, message: 'Fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const resp = await store._getByIdWorkPlan(99)
    expect(store.work_plan_received_request).toBeNull()
    expect(resp).toBeNull()
  })

  it('handles getByIdWorkPlan catch error', async () => {
    const store = useWorkPlansStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const resp = await store._getByIdWorkPlan(99)
    expect(store.work_plan_received_request).toBeNull()
    expect(resp).toBeNull()
  })

  it('creates a work plan', async () => {
    const store = useWorkPlansStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado' },
      status: 201,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createWorkPlan(formPayload)
    expect(mockPost).toHaveBeenCalledWith(`${BASE_PATH}`, formPayload)
    expect(result).toBe(true)
  })

  it('returns false on create when API success=false', async () => {
    const store = useWorkPlansStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail' },
      status: 400,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createWorkPlan(formPayload)
    expect(result).toBe(false)
  })

  it('updates a work plan', async () => {
    const store = useWorkPlansStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateWorkPlan(5, formPayload)
    expect(mockPut).toHaveBeenCalledWith(`${BASE_PATH}/5`, formPayload)
    expect(result).toBe(true)
  })

  it('returns false on update when API throws', async () => {
    const store = useWorkPlansStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateWorkPlan(1, formPayload)
    expect(result).toBe(false)
  })

  it('deletes a work plan', async () => {
    const store = useWorkPlansStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado' },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteWorkPlan(7)
    expect(mockDelete).toHaveBeenCalledWith(`${BASE_PATH}/7`)
    expect(result).toBe(true)
  })

  it('returns false on delete when API throws', async () => {
    const store = useWorkPlansStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteWorkPlan(1)
    expect(result).toBe(false)
  })

  it('sets and clears basic data', () => {
    const store = useWorkPlansStoreV1()
    store._setDataBasicWorkPlan(formPayload)
    expect(store.data_information_form).toEqual(formPayload)

    store._clearData()
    expect(store.work_plans_list).toEqual([])
    expect(store.work_plans_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
      total_items: 0,
      per_page: 0,
    })
    expect(store.work_plan_received_request).toBeNull()
  })
})
