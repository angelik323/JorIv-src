import { setActivePinia, createPinia } from 'pinia'
import { useContractClausesStoreV1 } from './contract-clauses-v1'
import { executeApi } from '@/apis'
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import { IContractClausesForm } from '@/interfaces/customs'

const URL_PATH_CONTRACT_CLAUSES = `${URL_PATH_DERIVATIVE_CONTRACTING}/contract-clauses`

const mockContractClauses = [
  {
    id: 1,
    name: 'prueba',
    description: 'prueba',
    status: { id: 1 },
  },
]

const mockContractClausesResponse = {
  id: 1,
  code: 123,
  name: 'prueba',
  clause_type_id: 1,
  clausule: 'prueba',
  type: { id: 1, name: 'prueba' },
  status: { id: 1 },
}

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))

describe('useContractClausesV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of contract clauses', async () => {
    const store = useContractClausesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockContractClauses,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getContractClausesList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_CONTRACT_CLAUSES}`, {
      params: { ...params, paginate: true },
    })
    expect(store.contract_clauses_list).toEqual(mockContractClauses)
    expect(store.contract_clauses_pages.currentPage).toBe(1)
    expect(store.contract_clauses_pages.lastPage).toBe(2)
  })

  it('should fetch contract clauses by ID', async () => {
    const store = useContractClausesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockContractClausesResponse,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdContractClauses(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_CONTRACT_CLAUSES}/1`)
    expect(store.contract_clauses_response).toEqual(mockContractClausesResponse)
  })

  it('should create a new contract clauses', async () => {
    const store = useContractClausesStoreV1()
    const formData: IContractClausesForm = {
      clause_type_id: 1,
      clausule: 'prueba',
      code: 123,
      name: 'prueba',
      status_id: 1,
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Rejection reason created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createContractClauses(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_CONTRACT_CLAUSES}`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should update a contract clauses', async () => {
    const store = useContractClausesStoreV1()
    const form: IContractClausesForm = {
      clause_type_id: 1,
      clausule: 'prueba',
      code: 123,
      name: 'prueba',
      status_id: 1,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateContractClauses(form, 1)

    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH_CONTRACT_CLAUSES}/1`, form)
    expect(result).toBe(true)
  })

  it('should clear all data in the store', () => {
    const store = useContractClausesStoreV1()

    store.contract_clauses_list = mockContractClauses

    store.contract_clauses_response = mockContractClausesResponse

    store.contract_clauses_pages = {
      currentPage: 2,
      lastPage: 3,
    }

    store._clearData()

    expect(store.contract_clauses_list).toEqual([])
    expect(store.contract_clauses_response).toBeNull()
    expect(store.contract_clauses_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
