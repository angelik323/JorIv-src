import { useQuotasIssuingPermitsStoreV1 } from './quotas-issuing-permits-v1'
import { IQuotasIssuingPermitsRequest } from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error capturado'),
  })),
}))

describe('useQuotasIssuingPermitsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('lists data correctly on _listAction', async () => {
    const store = useQuotasIssuingPermitsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Cargado correctamente',
        data: {
          data: [{ id: 1 }],
        },
        current_page: 2,
        last_page: 5,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('page=2')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/quotas-issuing-permits/list?page=2`
    )
    expect(store.quotas_issuing_permits_list).toEqual([{ id: 1 }])
    expect(store.quotas_issuing_permits_pages.currentPage).toBe(2)
    expect(store.quotas_issuing_permits_pages.lastPage).toBe(5)
  })

  it('handles error in _listAction', async () => {
    const store = useQuotasIssuingPermitsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Falló la petición'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('page=1')

    expect(mockGet).toHaveBeenCalled()
    expect(store.quotas_issuing_permits_list).toEqual([])
  })

  it('returns data correctly in _showAction', async () => {
    const store = useQuotasIssuingPermitsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1, description_emitter_name: 'Test' },
        message: 'Cargado',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction('1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/quotas-issuing-permits/show/1`
    )
    expect(result).toEqual({ id: 1, description_emitter_name: 'Test' })
  })

  it('returns null on error in _showAction', async () => {
    const store = useQuotasIssuingPermitsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error inesperado'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction('999')

    expect(mockGet).toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('creates data correctly on _createAction', async () => {
    const store = useQuotasIssuingPermitsStoreV1()
    const payload: IQuotasIssuingPermitsRequest = {
      emitter_id: 1,
      Papers: '',
      description_portfolio_name: 'Test',
      description_emitter_name: 'Test',
      investment_portfolio_id: 1,
      general_quota: 100,
      has_bank_accounts: 0,
      paper_type_id: 2,
      has_emission: 1,
      quota_generates: '',
      absolute_value_general_quota: '',
      issue_value: '1000',
      emission_percentage: '10',
      absolute_value_of_issue: '100',
      issuing_banks: [],
      portfolio_code: '',
      history_quotas_issuing_Permit: {
        created_at: '',
        creator_data: '',
        updated_at: '',
        update_data: '',
      },
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/quotas-issuing-permits/new`,
      payload
    )
    expect(result).toBe(true)
  })

  it('returns false on error in _createAction', async () => {
    const store = useQuotasIssuingPermitsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error en create'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IQuotasIssuingPermitsRequest = {
      emitter_id: 0,
      Papers: '',
      description_portfolio_name: '',
      description_emitter_name: '',
      investment_portfolio_id: 0,
      general_quota: 0,
      has_bank_accounts: 0,
      paper_type_id: 0,
      has_emission: 0,
      quota_generates: '',
      absolute_value_general_quota: '',
      issue_value: '',
      emission_percentage: '',
      absolute_value_of_issue: '',
      issuing_banks: [],
      portfolio_code: '',
      history_quotas_issuing_Permit: {
        created_at: '',
        creator_data: '',
        updated_at: '',
        update_data: '',
      },
    }

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('updates data correctly on _updateAction', async () => {
    const store = useQuotasIssuingPermitsStoreV1()
    const payload = {
      ...({ emitter_id: 1 } as IQuotasIssuingPermitsRequest),
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction('99', payload)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/quotas-issuing-permits/update/99`,
      payload
    )
    expect(result).toBe(true)
  })

  it('returns false on error in _updateAction', async () => {
    const store = useQuotasIssuingPermitsStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Error update'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload: IQuotasIssuingPermitsRequest = {
      emitter_id: 0,
      Papers: '',
      description_portfolio_name: '',
      description_emitter_name: '',
      investment_portfolio_id: 0,
      general_quota: 0,
      has_bank_accounts: 0,
      paper_type_id: 0,
      has_emission: 0,
      quota_generates: '',
      absolute_value_general_quota: '',
      issue_value: '',
      emission_percentage: '',
      absolute_value_of_issue: '',
      issuing_banks: [],
      portfolio_code: '',
      history_quotas_issuing_Permit: {
        created_at: '',
        creator_data: '',
        updated_at: '',
        update_data: '',
      },
    }

    const result = await store._updateAction('99', payload)

    expect(mockPut).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('deletes correctly in _deleteAction', async () => {
    const store = useQuotasIssuingPermitsStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteAction(5)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/quotas-issuing-permits/destroy/5`
    )
  })

  it('handles error in _deleteAction', async () => {
    const store = useQuotasIssuingPermitsStoreV1()
    const mockDelete = jest
      .fn()
      .mockRejectedValue(new Error('Error al eliminar'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteAction(999)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/quotas-issuing-permits/destroy/999`
    )
  })
})
