// pinia
import { setActivePinia, createPinia } from 'pinia'

// interfaces
import {
  ISettlementConceptsCreatePayload,
  ISettlementConceptsUpdatePayload,
  ISettlementConceptsForm,
  IBackendSettlementConcept,
} from '@/interfaces/customs/accounts-payable/SettlementConcepts'

// constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// store
import { useSettlementConceptsStoreV1 } from '@/stores/accounts-payable/settlement-concepts/settlement-concepts-v1'

// api
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({
    showAlert: jest.fn(),
  })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(),
  })),
}))

describe('useSettlementConceptsStoreV1', () => {
  let store: ReturnType<typeof useSettlementConceptsStoreV1>
  const url = `${URL_PATH_ACCOUNTS_PAYABLE}/settlement-concepts`
  const filters = { 'filter[search]': 'ABC123' }

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useSettlementConceptsStoreV1()
    jest.clearAllMocks()
  })

  it('fetches settlement concepts list successfully', async () => {
    const mockList = [
      {
        id: 1,
        structure_id: 1,
        concept_code: 'C001',
        description: 'Concepto test',
        type: 'Base',
        apply_iva: false,
        class: 'BAS',
        percentage: 10,
        has_minimum_uvt: false,
        expense_account_id: 1,
        fiscal_charge_id: 1,
        credit_notes_account_id: 1,
        status: { id: 1 },
      },
    ]

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Lista obtenida',
        data: { data: mockList, current_page: 2, last_page: 5 },
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getSettlementConceptsList(filters)

    expect(mockGet).toHaveBeenCalledWith(url, {
      params: { 'filter[search]': 'ABC123', paginate: 1, order_by: 'id,desc' },
    })
    expect(result.data).toEqual(mockList)
    expect(result.pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
  })

  it('handles error when fetching settlement concepts list', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('Error de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getSettlementConceptsList(filters)

    expect(result.data).toEqual([])
    expect(result.pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('toggles settlement concept status successfully', async () => {
    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Estado cambiado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._toggleStatusSettlementConcept(5)

    expect(mockPatch).toHaveBeenCalledWith(`${url}/5/toggle-status`)
    expect(result).toBe(true)
  })

  it('handles error when toggling settlement concept status', async () => {
    const mockPatch = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._toggleStatusSettlementConcept(1)

    expect(result).toBe(false)
  })

  it('creates settlement concept successfully', async () => {
    const payload: ISettlementConceptsCreatePayload = {
      structure_id: 1,
      concept_code: 'C001',
      description: 'Concepto test',
      type: 'Base',
      apply_iva: false,
      class: 'BAS',
      percentage: 10,
      has_minimum_uvt: false,
      expense_account_id: 1,
      fiscal_charge_id: 1,
      credit_notes_account_id: 1,
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createSettlementConcept(payload)

    expect(mockPost).toHaveBeenCalledWith(url, payload)
    expect(result).toBe(true)
  })

  it('handles error when creating settlement concept', async () => {
    const mockPost = jest.fn().mockRejectedValue(new Error('Error al crear'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createSettlementConcept(
      {} as ISettlementConceptsCreatePayload
    )

    expect(result).toBe(false)
  })

  it('deletes settlement concept successfully', async () => {
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteSettlementConcept(7)

    expect(mockDelete).toHaveBeenCalledWith(`${url}/7`)
    expect(result).toBe(true)
  })

  it('handles error when deleting settlement concept', async () => {
    const mockDelete = jest
      .fn()
      .mockRejectedValue(new Error('Error al eliminar'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteSettlementConcept(99)

    expect(result).toBe(false)
  })

  it('gets settlement concept by ID successfully', async () => {
    // Respuesta cruda simulada del backend
    const mockBackendData: IBackendSettlementConcept = {
      id: 1,
      structure: { id: 10, code: '001', structure: '0.0.0' },
      concept: 'C001',
      concept_description: 'Concepto test',
      type: 'Base',
      apply_iva: false,
      class: 'BAS',
      percentage: 10,
      has_minimum_uvt: false,
      min_withholding_uvt: null,
      min_withholding_iva_uvt: null,
      min_withholding_pesos: null,
      min_withholding_iva_pesos: null,
      plan_account: { id: 2, code: 'PA01', description: 'Cuenta plan' },
      liability_account: { id: 3, code: 'LA01', name: 'Cuenta pasivo' },
      expense_account: { id: 4, code: 'EA01', name: 'Cuenta gasto' },
      fiscal_charge: { id: 5, code: 'FC01', name: 'Cargo fiscal' },
      credit_notes_account: {
        id: 6,
        code: 'CN01',
        name: 'Cuenta notas',
      },
      status: { id: 1, name: 'Activo' },
      created_at: '2025-01-01',
      updated_at: '2025-01-02',
    }

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Obtenido correctamente',
        data: mockBackendData,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getSettlementConceptById(1)

    expect(mockGet).toHaveBeenCalledWith(`${url}/1`)

    const expected: ISettlementConceptsForm = {
      id: 1,
      structure_id: 10,
      structure_label: '001 - 0.0.0',
      concept_code: 'C001',
      description: 'Concepto test',
      type: 'Base',
      apply_iva: false,
      class: 'BAS',
      percentage: 10,
      has_minimum_uvt: false,
      min_withholding_uvt: null,
      min_withholding_iva_uvt: null,
      min_withholding_pesos: null,
      min_withholding_iva_pesos: null,
      plan_account_id: 2,
      plan_account_label: 'PA01 - Cuenta plan',
      liability_account_id: 3,
      liability_account_label: 'LA01 - Cuenta pasivo',
      expense_account_id: 4,
      expense_account_label: 'EA01 - Cuenta gasto',
      fiscal_charge_id: 5,
      fiscal_charge_label: 'FC01 - Cargo fiscal',
      credit_notes_account_id: 6,
      credit_notes_account_label: 'CN01 - Cuenta notas',
      status_id: 1,
      created_at: '2025-01-01',
      updated_at: '2025-01-02',
    }

    expect(result).toEqual(expected)
  })

  it('handles error when getting settlement concept by ID', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('Error al obtener'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getSettlementConceptById(1)

    expect(result).toBeNull()
  })

  it('updates settlement concept successfully', async () => {
    const payload: ISettlementConceptsUpdatePayload = {
      structure_id: 10,
      description: 'Concepto actualizado',
      percentage: 15,
      apply_iva: false,
      has_minimum_uvt: true,
      min_withholding_uvt: 10,
      min_withholding_iva_uvt: 5,
      min_withholding_pesos: null,
      min_withholding_iva_pesos: null,
      plan_account_id: 2,
      liability_account_id: 3,
      expense_account_id: 4,
      fiscal_charge_id: 5,
      credit_notes_account_id: 6,
      status_id: 1,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateSettlementConcept(payload, 1)

    expect(mockPut).toHaveBeenCalledWith(`${url}/1`, payload)
    expect(result).toBe(true)
  })

  it('handles error when updating settlement concept', async () => {
    const mockPut = jest
      .fn()
      .mockRejectedValue(new Error('Error al actualizar'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateSettlementConcept(
      {} as ISettlementConceptsUpdatePayload,
      1
    )

    expect(result).toBe(false)
  })
})
