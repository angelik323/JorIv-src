import { setActivePinia, createPinia } from 'pinia'
import { useRiskDefinitionsStoreV1 } from '@/stores/derivative-contracting/risk-definition/risk-definition-v1'
import { executeApi } from '@/apis'
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import type { IRiskDefinitionForm, IRiskDefinitionResponse } from '@/interfaces/customs/derivative-contracting'

const URL_PATH = `${URL_PATH_DERIVATIVE_CONTRACTING}/risks`

const mockList: IRiskDefinitionResponse[] = [
  {
    id: 1,
    code: '001',
    name: 'Riesgo A',
    nature: 'Operacional',
    minimum_percentage: '10.00',
    maximum_percentage: '50.00',
    status_id: 1,
    status: { id: 1, name: 'Activo' },
    created_at: '2025-10-22 10:00:00',
    updated_at: '2025-10-22 10:00:00',
  },
]

const mockById: IRiskDefinitionResponse = {
  id: 2,
  code: '002',
  name: 'Riesgo B',
  nature: 'Financiero',
  minimum_percentage: '5.00',
  maximum_percentage: '40.00',
  status_id: 1,
  status: { id: 1, name: 'Activo' },
  created_at: '2025-10-22 11:00:00',
  updated_at: '2025-10-22 11:00:00',
}

const formPayload: IRiskDefinitionForm = {
  code: '003',
  name: 'Riesgo C',
  nature: 'Compliance',
  minimum_percentage: '1.00',
  maximum_percentage: '10.00',
  status_id: 1,
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

describe('useRiskDefinitionsStoreV1 (standardized)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches risk definitions list with paginate and params', async () => {
    const store = useRiskDefinitionsStoreV1()
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
    await store._getRiskDefinitions(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1&${params}`)
    expect(store.risk_definitions_list).toEqual(mockList)
    expect(store.risk_definitions_pages).toEqual({
      currentPage: 1,
      lastPage: 3,
      total_items: 1,
      per_page: 10,
    })
  })

  it('sets empty list if API returns non-array items', async () => {
    const store = useRiskDefinitionsStoreV1()
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

    await store._getRiskDefinitions('page=1')
    expect(store.risk_definitions_list).toEqual([])
    expect(store.risk_definitions_pages.currentPage).toBe(1)
  })

  it('handles getRiskDefinitions with success=false', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: false, data: { data: [] }, message: 'Fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getRiskDefinitions('page=1')
    expect(store.risk_definitions_list).toEqual([])
  })

  it('handles getRiskDefinitions catch error', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getRiskDefinitions('page=1')
    expect(store.risk_definitions_list).toEqual([])
  })

  it('fetches risk definition by ID and returns the entity', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, data: mockById, message: 'Detalle OK' },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const resp = await store._getByIdRiskDefinition(2)
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/2`)
    expect(store.risk_definition_received_request).toEqual(mockById)
    expect(resp).toEqual(mockById)
  })

  it('handles getByIdRiskDefinition with success=false', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: false, data: null, message: 'Fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const resp = await store._getByIdRiskDefinition(99)
    expect(store.risk_definition_received_request).toBeNull()
    expect(resp).toBeNull()
  })

  it('creates a risk definition', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado' },
      status: 201,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createRiskDefinition(formPayload)
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, formPayload)
    expect(result).toBe(true)
  })

  it('returns false on create when API success=false', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail' },
      status: 400,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createRiskDefinition(formPayload)
    expect(result).toBe(false)
  })

  it('updates a risk definition', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateRiskDefinition(5, formPayload)
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/5`, formPayload)
    expect(result).toBe(true)
  })

  it('returns false on update when API throws', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateRiskDefinition(1, formPayload)
    expect(result).toBe(false)
  })

  it('deletes a risk definition', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado' },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteRiskDefinition(7)
    expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH}/7`)
    expect(result).toBe(true)
  })

  it('returns false on delete when API throws', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteRiskDefinition(1)
    expect(result).toBe(false)
  })

  it('changes status using toggle-status (status_id payload)', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._changeRiskDefinitionStatus(9, 1)
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/9/toggle-status`, { status_id: 1 })
    expect(result).toBe(true)
  })

  it('returns false on _changeRiskDefinitionStatus when API success=false', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail' },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._changeRiskDefinitionStatus(1, 2)
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/1/toggle-status`, { status_id: 2 })
    expect(result).toBe(false)
  })

  it('returns false on _changeRiskDefinitionStatus when API throws', async () => {
    const store = useRiskDefinitionsStoreV1()
    const mockPatch = jest.fn().mockRejectedValue(new Error('Boom'))
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._changeRiskDefinitionStatus(1, 1)
    expect(result).toBe(false)
  })
})
