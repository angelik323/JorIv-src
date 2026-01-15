import { setActivePinia, createPinia } from 'pinia'
import { useFiduciaryBusinessCommissionsV2 } from './fiduciary-business-commissions-v2'
import { executeApi } from '@/apis'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import {
  IFiduciaryBusinessCommissionsResponseV2,
  IFiduciaryBusinessCommissionsFormV2,
} from '@/interfaces/customs/settlement-commissions/FiduciaryBusinessCommissionsV2'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

const getMockFiduciaryBusinessCommissions = (): IFiduciaryBusinessCommissionsResponseV2 => ({
  business_trust_commission: {
    id: 39,
    business_id: 5034,
    billing_trust_id: 17,
    third_party_billings_id: 22,
    commission_type_id: 26,
    commission_type_catalog_id: 2,
    commission_class_catalog_id: 3,
    settlement_parameters_id: null,
    comission_settlement_statuses_id: 25,
    business_code_snapshot: '178',
    business_name_snapshot: 'Negocio prueba reportes contabilidad',
    business_start_date_snapshot: '2023-06-23',
    business_end_date_snapshot: '2025-12-31',
    business_status_snapshot: 56,
    description: 'descripcion de prueba',
    observation: 'observacion ed prueba',
    collection: 'Vencido',
    periodicity: null,
    count_transaction: null,
    snapshotted_at: '2026-01-06T16:13:28.282690Z',
    iva: false,
    calculation: {
      calculation_type: 'Salario minimo mensual legal vigente',
      minimum_wage_amount: '1423500.00',
      count_salaries: 3,
      base_commission_amount: '4270500.00',
      fixed_value: null,
      commission_percentage: null,
      commission_transaction: null,
      count_transaction: null,
    },
  },
  relationships: {
    status: null,
    billing_trust: {
      id: 17,
      business_id: 5034,
      code: '00006',
      business_code_snapshot: '178',
      business_name_snapshot: 'Negocio prueba reportes contabilidad',
      start_date: '2025-12-01',
      end_date: '2025-12-31',
      periodicity: 'Diario',
    },
    accounting_parameters: {
      id: 14,
      billing_trusts_id: 17,
      who_pays: 'fideicomiso',
      accounts: true,
      generates_iva: true,
      is_accounting: false,
      has_iva: false,
      iva: '4.00',
      has_retefuente: false,
      retefuente: '0.00',
      has_reteica: false,
      reteica: '0.00',
      has_reteiva: false,
      reteiva: '0.00',
      business_movement_code_snapshot: null,
      business_movement_name_snapshot: 'null - description',
      business_movement_id_snapshot: '8',
    },
    third_party_billing: {
      id: 22,
      third_party_id: 3460,
      third_party_name: 'dete',
      third_party_document_type: 'NIT',
      third_party_document: '89999',
      third_party_email: 'dev@dev.com',
      third_party_phone: '(+57)321 321 3132',
      third_party_address: 'AP',
      status: {
        id: 1,
        name: 'Activo',
      },
    },
    commission_type: {
      id: 26,
      code: '006',
      description: 'Estructuración Manual',
      commission_type_catalog_id: 2,
      commission_class_catalog_id: 3,
    },
    commission_type_catalog: {
      id: 2,
      name: 'Manual',
    },
    commission_class_catalog: {
      id: 3,
      name: 'Estructuración',
    },
    settlement_parameters: null,
    settlement_commissions: [],
  },
  audit: {
    created_by: 14451,
    updated_by: 14451,
    created_at: '2025-12-29T22:46:11.000000Z',
    updated_at: '2026-01-06T16:13:28.000000Z',
  },
})

const getMockFiduciaryBusinessCommissionsForm = (): IFiduciaryBusinessCommissionsFormV2 => ({
  business_id: 1,
  commission_type_id: 1,
  billing_trust_id: 20,
  third_party_billings_id: 20,
  accounting_parameters_id: 20,
  business_code: "78231923",
  colllection: "Anticipado",
  observation: "comisuion 1",
  description: "comisuion 1 prueba description",
  calculation_type: "Salario minimo mensual legal vigente",
  minimum_wage_amount: 1000,
  count_salaries: 1,
  base_commission_amount: 2000,
  fixed_value: 0,
  commission_percentage: 0,
  commission_transaction: 0,
  count_transaction: 0,
  business_trust_id: null,
  start_date: null
})

const mockFiduciaryBusinessCommissions = [
  {
    "id": 39,
    "business_id": 5034,
    "billing_trust_id": 17,
    "third_party_billings_id": 22,
    "commission_type_id": 26,
    "commission_type_catalog_id": 2,
    "commission_class_catalog_id": 3,
    "comission_settlement_statuses_id": 25,
    "accounting_parameters_id": null,
    "settlement_parameters_id": null,
    "business_code_snapshot": "178",
    "business_name_snapshot": "Negocio prueba reportes contabilidad",
    "business_start_date_snapshot": "2023-06-23",
    "business_end_date_snapshot": "2025-12-31",
    "business_status_snapshot": 56,
    "colllection": "Vencido",
    "description": "descripcion de prueba",
    "observation": "observacion ed prueba",
    "periodicity": null,
    "iva": false,
    "calculation_type": null,
    "minimum_wage_amount": null,
    "count_salaries": null,
    "base_commission_amount": null,
    "fixed_value": null,
    "commission_percentage": null,
    "commission_transaction": null,
    "count_transaction": null,
    "comission_settlement_statuses": null,
    "commission_type": {
      "id": 26,
      "description": "Estructuraci\u00f3n Manual",
      "code": "006",
      "full_label": "006 - Estructuraci\u00f3n Manual",
      "commission_type_catalog_id": 2,
      "commission_class_catalog_id": 3
    },
    "billing_trust": {
      "id": 17,
      "business_id": 5034,
      "code": "00006",
      "business_code_snapshot": "178",
      "business_name_snapshot": "Negocio prueba reportes contabilidad",
      "start_date": "2025-12-01",
      "end_date": "2025-12-31",
      "periodicity": "Diario",
      "accounting_parameters": {
        "id": 14,
        "business_id": 5034,
        "billing_trusts_id": 17,
        "business_movement_id_snapshot": "8",
        "business_movement_code_snapshot": null,
        "business_movement_name_snapshot": "null - description",
        "who_pays": "fideicomiso",
        "accounts": true,
        "generates_iva": true,
        "is_accounting": false,
        "has_iva": false,
        "has_retefuente": false,
        "has_reteica": false,
        "has_reteiva": false,
        "iva": "4.00",
        "retefuente": "0.00",
        "reteica": "0.00",
        "reteiva": "0.00"
      }
    },
    "third_party_billings": {
      "id": 22,
      "third_party_name": "dete",
      "third_party_document": "89999",
      "third_party_email": "dev@dev.com",
      "third_party_id": 3460,
      "third_party_document_type": "NIT",
      "third_party_phone": "(+57)321 321 3132",
      "third_party_address": "AP"
    },
    "commission_type_catalog": {
      "id": 2,
      "name": "Manual"
    },
    "commission_class_catalog": {
      "id": 3,
      "name": "Estructuraci\u00f3n"
    },
    "snapshotted_at": "2026-01-06",
    "created_by": 14451,
    "created_at": "2025-12-29T22:46:11.000000Z",
    "updated_at": null
  },
]

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))

describe('useFiduciaryBusinessCommissionsV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch fiduciary business commission by id', async () => {
    const store = useFiduciaryBusinessCommissionsV2()
    const mockResponse = getMockFiduciaryBusinessCommissions()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockResponse,
        message: 'Registro obtenido exitosamente.',
      },
      status: 200,
    })

      ; (executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getByIdFiduciaryBusinessCommissions(39)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/business-trust-commissions/39`
    )
    expect(result).toEqual(mockResponse)
  })

  it('should handle error when fetching fiduciary business commission by ID', async () => {
    const store = useFiduciaryBusinessCommissionsV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

      ; (executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdFiduciaryBusinessCommissions(39)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/business-trust-commissions/39`
    )
  })

  it('should update a fiduciary business commission', async () => {
    const store = useFiduciaryBusinessCommissionsV2()
    const form = getMockFiduciaryBusinessCommissionsForm()

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

      ; (executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateRFiduciaryBusinessCommissions(form, 1)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/1`,
      form
    )
    expect(result).toBe(true)
  })

  it('should return false if update fails', async () => {
    const store = useFiduciaryBusinessCommissionsV2()
    const form = getMockFiduciaryBusinessCommissionsForm()

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

      ; (executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateRFiduciaryBusinessCommissions(form, 1)

    expect(result).toBe(false)
  })

  it('should fetch list of fiduciary business commissions', async () => {
    const store = useFiduciaryBusinessCommissionsV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockFiduciaryBusinessCommissions,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

      ; (executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFiduciaryBusinessCommissionsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/business-trust-commissions`,
      {
        params: { ...params, paginate: 1 },
      }
    )
  })

  it('should handle error when fetching fiduciary business commissions', async () => {
    const store = useFiduciaryBusinessCommissionsV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

      ; (executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFiduciaryBusinessCommissionsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/business-trust-commissions`,
      {
        params: { ...params, paginate: 1 },
      }
    )
  })
})