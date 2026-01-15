import { setActivePinia, createPinia } from 'pinia'
import { useAccountingParametersCollection } from './types-accounting-parameters'
import { executeApi } from '@/apis'

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
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

describe('Accounting Parameters Store', () => {
  let store: ReturnType<typeof useAccountingParametersCollection>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAccountingParametersCollection()
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    expect(store.accounting_parameters_list).toEqual([])
    expect(store.accounting_parameters_pages).toEqual({
      current_page: 0,
      lastpage: 0,
    })
    expect(store.idSelected).toBe(0)
    expect(store.perPage).toBe(20)
    expect(store.data_information_form).toBe
    expect(store.cash_flow_structure).toBeNull()
    expect(store.id_selected_edit).toBeNull()
  })

  it('should set data_information_form with _setDataInformationForm', () => {
    const data = {
      accounting_blocks_collection_id: 1,
      account_chart_id: 1,
      cost_center_id: 2,
      aux_type: 'X',
      third_party_id: 3,
      cash_flow_structure_id: 4,
      contra_account_chart_id: 5,
      contra_cost_center_id: null,
      contra_aux_type: null,
      contra_third_party_id: null,
      contra_cash_flow_structure_id: 6,
    }
    store._setDataInformationForm(data)
    expect(store.data_information_form).toEqual(data)
    store._setDataInformationForm(null)
    expect(store.data_information_form).toBeNull()
  })

  it('should set idSelected with _setDataIds', () => {
    store._setDataIds(123)
    expect(store.idSelected).toBe(123)
  })

  it('should set id_selected_edit with _setIdSelectedEdit', () => {
    store._setIdSelectedEdit(55)
    expect(store.id_selected_edit).toBe(55)
    store._setIdSelectedEdit(undefined)
    expect(store.id_selected_edit).toBeUndefined()
  })

  it('fetches account parameters list', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [
            {
              accounting_blocks_collection_id: 1,
              cash_flow_structure: { name: 'Test', id: 1 },
            },
          ],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAccountParameters(1)
    expect(mockGet).toHaveBeenCalled()
    expect(store.accounting_parameters_list.length).toBe(1)
    expect(store.accounting_parameters_pages.current_page).toBe(1)
    expect(store.accounting_parameters_pages.lastpage).toBe(1)
    expect(store.cash_flow_structure).toEqual({ name: 'Test', id: 1 })
  })

  it('handles error when fetching account parameters fails', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAccountParameters(1)
    expect(mockGet).toHaveBeenCalled()
    expect(store.accounting_parameters_list.length).toBe(0)
  })

  it('creates accounting parameter', async () => {
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, data: { id: 1 }, message: 'ok' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._createAccountingParameter({
      accounting_blocks_collection_id: 1,
      account_chart_id: 1,
      cost_center_id: 2,
      aux_type: 'X',
      third_party_id: 3,
      cash_flow_structure_id: 4,
      contra_account_chart_id: 5,
      contra_cost_center_id: null,
      contra_aux_type: null,
      contra_third_party_id: null,
      contra_cash_flow_structure_id: 6,
    })
    expect(mockPost).toHaveBeenCalled()
    expect(store.data_information_form).toEqual({ id: 1 })
    expect(result).toBe(true)
  })

  it('handles error when creating accounting parameter fails', async () => {
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._createAccountingParameter({
      accounting_blocks_collection_id: 1,
      account_chart_id: 1,
      cost_center_id: 2,
      aux_type: 'X',
      third_party_id: 3,
      cash_flow_structure_id: 4,
      contra_account_chart_id: 5,
      contra_cost_center_id: null,
      contra_aux_type: null,
      contra_third_party_id: null,
      contra_cash_flow_structure_id: 6,
    })
    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('updates accounting parameter', async () => {
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, data: { id: 2 }, message: 'ok' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })
    const result = await store._updateAccountingParameter(2, {
      accounting_blocks_collection_id: 1,
      account_chart_id: 1,
      cost_center_id: 2,
      aux_type: 'X',
      third_party_id: 3,
      cash_flow_structure_id: 4,
      contra_account_chart_id: 5,
      contra_cost_center_id: null,
      contra_aux_type: null,
      contra_third_party_id: null,
      contra_cash_flow_structure_id: 6,
    })
    expect(mockPut).toHaveBeenCalled()
    expect(store.data_information_form).toEqual({ id: 2 })
    expect(result).toBe(true)
  })

  it('handles error when updating accounting parameter fails', async () => {
    const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })
    const result = await store._updateAccountingParameter(2, {
      accounting_blocks_collection_id: 1,
      account_chart_id: 1,
      cost_center_id: 2,
      aux_type: 'X',
      third_party_id: 3,
      cash_flow_structure_id: 4,
      contra_account_chart_id: 5,
      contra_cost_center_id: null,
      contra_aux_type: null,
      contra_third_party_id: null,
      contra_cash_flow_structure_id: 6,
    })
    expect(mockPut).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('fetches a single accounting parameter and sets data_information_form', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: { id: 99, account_chart_id: 1 },
        message: 'ok',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingParameter(99)
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/commission-accounting-parameters/99')
    )
    expect(store.data_information_form).toEqual({ id: 99, account_chart_id: 1 })
  })

  it('handles error when fetching a single accounting parameter fails', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingParameter(99)
    expect(store.data_information_form).toBeNull()
  })
})
