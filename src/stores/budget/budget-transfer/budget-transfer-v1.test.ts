import { setActivePinia, createPinia } from 'pinia'
import { useBudgetTransferStoreV1 } from './budget-transfer-v1'
import { executeApi } from '@/apis'
import type {
  IBudgetTransferCreatePayload,
  IBudgetTransferModel,
  IBudgetTransferList,
} from '@interfaces/customs/budget/BudgetTransfer'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    post: jest.fn(),
  })),
}))

jest.mock('@/composables/useAlert', () => ({
  __esModule: true,
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
}))

jest.mock('@/composables/useShowError', () => ({
  __esModule: true,
  useShowError: jest.fn(() => ({
    showCatchError: () => 'Error!',
  })),
}))

describe('useBudgetTransferStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const createRow = (
    overrides: Partial<IBudgetTransferModel> = {}
  ): IBudgetTransferModel => ({
    id: 1,
    nature: '',
    business: 1,
    budgetItems: 2,
    resource: 3,
    area: 4,
    third: 5,
    month: 6,
    value: 1000,
    adjustedValue: 0,
    ...overrides,
  })

  const createFormData = (
    overrides: Partial<IBudgetTransferList> = {}
  ): IBudgetTransferList => ({
    id: 0,
    fiscal_year: 2024,
    date: '2024-01-02',
    budget_document_type_id: 0,
    budget_document_type_id_description: '',
    code_movement_id: 0,
    code_movement_id_description: '',
    third_party_requester_id: 0,
    third_party_requester_id_description: '',
    description: '',
    resolution_number: '',
    total_amount: 0,
    status_id: 0,
    details: [],
    ...overrides,
  })

  const basePayload: IBudgetTransferCreatePayload = {
    fiscal_year: 2024,
    date: '2024-01-02',
    budget_document_type_id: 10,
    code_movement_id: 20,
    third_party_requester_id: 30,
    description: 'Transfer description',
    resolution_number: 'RES-1',
    total_amount: 1000,
    details: {
      origins: [
        {
          type: 'ORIGEN',
          business_id: 1,
          budget_item_id: 2,
          budget_resource_id: 3,
          area_id: 4,
          third_party_id: null,
          month: 1,
          value: 500,
        },
      ],
      destinations: [
        {
          type: 'DESTINO',
          business_id: 5,
          budget_item_id: 6,
          budget_resource_id: 7,
          area_id: 8,
          third_party_id: null,
          month: 1,
          value: 500,
        },
      ],
    },
  }

  describe('State', () => {
    it('initializes with empty state', () => {
      const store = useBudgetTransferStoreV1()

      expect(store.version).toBe('v1')
      expect(store.models).toBeNull()
      expect(store.models_origin).toEqual([])
      expect(store.models_destination).toEqual([])
      expect(store.budget_selected_business).toBe(0)
      expect(store.resetTrigger).toBe(0)
    })
  })

  describe('setBudgetTransferCreate', () => {
    it('sets budget transfer create data', () => {
      const store = useBudgetTransferStoreV1()
      const formData = createFormData({ description: 'Test description' })

      store.setBudgetTransferCreate(formData)

      expect(store.models).toEqual(formData)
    })

    it('replaces existing data when called again', () => {
      const store = useBudgetTransferStoreV1()
      const formData1 = createFormData({ description: 'First' })
      const formData2 = createFormData({ description: 'Second' })

      store.setBudgetTransferCreate(formData1)
      store.setBudgetTransferCreate(formData2)

      expect(store.models).toEqual(formData2)
      expect(store.models?.description).toBe('Second')
    })
  })

  describe('setBudgetSelectedBusiness', () => {
    it('sets budget selected business', () => {
      const store = useBudgetTransferStoreV1()

      store.setBudgetSelectedBusiness(15)

      expect(store.budget_selected_business).toBe(15)
    })

    it('updates budget selected business', () => {
      const store = useBudgetTransferStoreV1()
      store.setBudgetSelectedBusiness(10)

      store.setBudgetSelectedBusiness(20)

      expect(store.budget_selected_business).toBe(20)
    })
  })

  describe('setModelsOrigin', () => {
    it('sets origin models', () => {
      const store = useBudgetTransferStoreV1()
      const rows = [createRow({ id: 1 }), createRow({ id: 2 })]

      store.setModelsOrigin(rows)

      expect(store.models_origin).toEqual(rows)
      expect(store.models_origin).toHaveLength(2)
    })

    it('replaces existing origin models', () => {
      const store = useBudgetTransferStoreV1()
      store.setModelsOrigin([createRow({ id: 1 })])
      const newRows = [createRow({ id: 2 }), createRow({ id: 3 })]

      store.setModelsOrigin(newRows)

      expect(store.models_origin).toHaveLength(2)
      expect(store.models_origin[0].id).toBe(2)
    })
  })

  describe('setModelsDestination', () => {
    it('sets destination models', () => {
      const store = useBudgetTransferStoreV1()
      const rows = [createRow({ id: 1 }), createRow({ id: 2 })]

      store.setModelsDestination(rows)

      expect(store.models_destination).toEqual(rows)
      expect(store.models_destination).toHaveLength(2)
    })

    it('replaces existing destination models', () => {
      const store = useBudgetTransferStoreV1()
      store.setModelsDestination([createRow({ id: 1 })])
      const newRows = [createRow({ id: 2 }), createRow({ id: 3 })]

      store.setModelsDestination(newRows)

      expect(store.models_destination).toHaveLength(2)
      expect(store.models_destination[0].id).toBe(2)
    })
  })

  describe('resetAll', () => {
    it('cleans all data and increments resetTrigger', () => {
      const store = useBudgetTransferStoreV1()
      store.setBudgetTransferCreate(createFormData())
      store.setModelsOrigin([createRow()])
      store.setModelsDestination([createRow()])
      store.setBudgetSelectedBusiness(5)
      const initialTrigger = store.resetTrigger

      store.resetAll()

      expect(store.models).toBeNull()
      expect(store.models_origin).toEqual([])
      expect(store.models_destination).toEqual([])
      expect(store.budget_selected_business).toBe(0)
      expect(store.resetTrigger).toBe(initialTrigger + 1)
    })

    it('increments resetTrigger on each call', () => {
      const store = useBudgetTransferStoreV1()

      store.resetAll()
      expect(store.resetTrigger).toBe(1)

      store.resetAll()
      expect(store.resetTrigger).toBe(2)

      store.resetAll()
      expect(store.resetTrigger).toBe(3)
    })
  })

  describe('createAction', () => {
    it('creates budget transfer through API and returns true on success', async () => {
      const store = useBudgetTransferStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Creado exitosamente' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store.createAction(basePayload)

      expect(result).toBe(true)
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('budget-transfers'),
        basePayload
      )
    })

    it('returns false when API response has success false', async () => {
      const store = useBudgetTransferStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error en la creación' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store.createAction(basePayload)

      expect(result).toBe(false)
      expect(mockPost).toHaveBeenCalled()
    })

    it('handles API exceptions gracefully and returns false', async () => {
      const store = useBudgetTransferStoreV1()
      const mockPost = jest.fn().mockRejectedValue(new Error('API error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store.createAction(basePayload)

      expect(result).toBe(false)
      expect(mockPost).toHaveBeenCalled()
    })

    it('calls API with correct URL path', async () => {
      const store = useBudgetTransferStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Success' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      await store.createAction(basePayload)

      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('/budget-transfers'),
        basePayload
      )
    })
  })
})
