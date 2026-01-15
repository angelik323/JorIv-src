import { setActivePinia, createPinia } from 'pinia'
import { useRegisterAdditionsStoreV1 } from './register-additions-v1'
import { executeApi } from '@/apis'
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import {
  IRegisterAdditionsForm,
  IRegisterAdditionsResponse,
  IRegisterContractsList,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'

const URL_PATH_REGISTER_ADDITIONS = `${URL_PATH_DERIVATIVE_CONTRACTING}/contract-additions`

const mockRegisterAdditions: IRegisterContractsList[] = [
  {
    id: 26,
    name: 'Contrato de Servicios Profesionales',
    description:
      'Contrato para la prestación de servicios de consultoría tecnológica.',
    status: { id: 56 }, // Registrado
    contract_number: 'CNS-2025-0026',
    contract_additions: [],
  },
]

const mockRegisterAdditionsResponse: IRegisterAdditionsResponse = {
  internal_contract_number: '123',
  contract_type: {
    id: 2,
    code: '23',
    description: 'dec',
    name: 'test',
  },
  business: {
    id: 2,
    code: '23',
    description: 'dec',
    name: 'test',
  },
  business_trust_id: 5034,
  document_type_id: 11,
  modification_type: {
    id: 2,
    code: '23',
    description: 'dec',
    name: 'test',
  },

  subscription_date: '2025-11-01',
  additional_number: '503411FIDEI-001',

  duration: 12,
  periodicity: 1, // mensual

  application_start_date: '2025-12-01',
  contract_end_date: '2026-11-30',

  additional_amount: 50000000,
  additional_value: 12000,

  justification:
    'Necesidad de ampliar alcance contractual por nuevos requerimientos.',
  contract_object:
    'Prestación de servicios profesionales asociados al proyecto',

  status: {
    id: 1,
    code: '123',
    description: 'desc',
    name: '123',
  }, // puede ser number o string
  internal_number: 'INT-2025-0099',
  contractor: 'Juan Pérez Asociados S.A.S.',

  has_stamp_tax: true,
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

describe('useRegisterAdditionsV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of register additions', async () => {
    const store = useRegisterAdditionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockRegisterAdditions,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getRegisterContractsList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_REGISTER_ADDITIONS}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.register_contracts_list).toEqual(mockRegisterAdditions)
    expect(store.register_contracts_pages.currentPage).toBe(1)
    expect(store.register_contracts_pages.lastPage).toBe(2)
  })

  it('should fetch register additions by ID', async () => {
    const store = useRegisterAdditionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockRegisterAdditionsResponse,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdRegisterAdditions(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_REGISTER_ADDITIONS}/1`)
    expect(store.register_additions_response).toEqual(
      mockRegisterAdditionsResponse
    )
  })

  it('should create a new register additions', async () => {
    const store = useRegisterAdditionsStoreV1()
    const formData: IRegisterAdditionsForm = {
      contract_id: 1,
      contract_type_id: 3,
      business_trust_id: 5034,
      document_type_id: 11,
      modification_type: 1,

      subscription_date: '2025-11-01',
      additional_number: '503411FIDEI-001',

      duration: 12,
      periodicity: 1, // mensual

      application_start_date: '2025-12-01',
      contract_end_date: '2026-11-30',

      additional_amount: 50000000,
      additional_value: 12000,

      justification:
        'Necesidad de ampliar alcance contractual por nuevos requerimientos.',
      contract_object:
        'Prestación de servicios profesionales asociados al proyecto',

      status: 56, // puede ser number o string
      internal_number: 'INT-2025-0099',
      contractor: 'Juan Pérez Asociados S.A.S.',

      has_stamp_tax: true,
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Rejection reason created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createRegisterAdditions(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_REGISTER_ADDITIONS}`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should update a register additions', async () => {
    const store = useRegisterAdditionsStoreV1()
    const form: IRegisterAdditionsForm = {
      contract_id: 1,
      contract_type_id: 3,
      business_trust_id: 5034,
      document_type_id: 11,
      modification_type: 1,

      subscription_date: '2025-11-01',
      additional_number: '503411FIDEI-001',

      duration: 12,
      periodicity: 1, // mensual

      application_start_date: '2025-12-01',
      contract_end_date: '2026-11-30',

      additional_amount: 50000000,
      additional_value: 12000,

      justification:
        'Necesidad de ampliar alcance contractual por nuevos requerimientos.',
      contract_object:
        'Prestación de servicios profesionales asociados al proyecto',

      status: 56, // puede ser number o string
      internal_number: 'INT-2025-0099',
      contractor: 'Juan Pérez Asociados S.A.S.',

      has_stamp_tax: true,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateRegisterAdditions(form, 1)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_REGISTER_ADDITIONS}/1`,
      form
    )
    expect(result).toBe(true)
  })

  it('should clear all data in the store', () => {
    const store = useRegisterAdditionsStoreV1()

    store.register_contracts_list = mockRegisterAdditions

    store.register_additions_response = mockRegisterAdditionsResponse

    store.register_contracts_pages = {
      currentPage: 2,
      lastPage: 3,
    }

    store._clearData()

    expect(store.register_contracts_list).toEqual([])
    expect(store.register_additions_response).toBeNull()
    expect(store.register_contracts_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
