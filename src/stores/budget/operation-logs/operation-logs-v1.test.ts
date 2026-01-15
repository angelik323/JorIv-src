// Pinia
import { setActivePinia, createPinia } from 'pinia'

// Interfaces - Constants
import { IOperationLogsRequest } from '@/interfaces/customs/budget/OperationLogs'
import { URL_PATH_BUDGET } from '@/constants/apis'

// Utils
import { executeApi } from '@/apis'

// Stores
import { useBudgetOperationLogsStoreV1 } from './operation-logs-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
}))

describe('useBudgetOperationLogsStoreV1', () => {
  const payload: IOperationLogsRequest = {
    business_trust_id: 5,
    document_year: 2025,
    date: '2025-11-14',
    budget_document_type_id: 1,
    third_party_beneficiary_id: 1,
    total_value: '390000',
    observations: 'Pruebas de Observaciones',
    operation_log_details: [
      {
        id: 1,
        year: 2025,
        month: 11,
        day: 14,
        areas_responsibility_id: 1,
        code_movements_source_destination_id: 9,
        budget_item_id: 1,
        budget_resource_id: 8,
        value: '390000',
      },
      {
        id: 2,
        year: 2025,
        month: 11,
        day: 14,
        areas_responsibility_id: 4,
        code_movements_source_destination_id: 9,
        budget_item_id: 1,
        budget_resource_id: 8,
        value: '2000',
      },
    ],
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('creates a record successfully', async () => {
    const store = useBudgetOperationLogsStoreV1()
    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Created' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/operation-logs`,
      payload
    )
    expect(result).toBe(true)
  })

  it('returns false when create action fails', async () => {
    const store = useBudgetOperationLogsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(result).toBe(false)
  })

  it('returns false when success is false in response', async () => {
    const store = useBudgetOperationLogsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Failed' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(result).toBe(false)
  })
})
