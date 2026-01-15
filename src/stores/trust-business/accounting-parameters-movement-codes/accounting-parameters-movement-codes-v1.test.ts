import { setActivePinia, createPinia } from 'pinia'
import { useAccountingParametersMovementCodesStoreV1 } from '@/stores/trust-business/accounting-parameters-movement-codes/accounting-parameters-movement-codes-v1'
import { executeApi } from '@/apis'
import type {
  IAccountingParametersMovementCodes,
  IAccountingParametersMovementCodesParameter,
  ICodesBusinessTrust,
} from '@/interfaces/customs'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'

const URL_PATH = `${TRUST_BUSINESS_API_URL}`

const mockAccountingParametersMovementCode: IAccountingParametersMovementCodes =
  {
    id: 1,
    _uid: 1,
    business_type_id: 10,
    accounting_structure_id: 20,
    cost_center_structure_id: 30,
  }

const mockAccountingParametersMovementCodeParameter: IAccountingParametersMovementCodesParameter =
  {
    id: 1,
    _uid: 1,
    movement_code_id: 1,
    good_class: 'Clase A',
    good_type: 'Tipo X',
    split_nature: 'Débito',
    np_auxiliary_type: 'AuxTipo1',
    np_specific: 123,
    split_accounting_account_id: 456,
    np_cost_center_id: 789,
    counterpart_nature: 'Crédito',
    offsetting_accounting_account_id: 321,
    ncp_auxiliary_type: 'AuxTipo2',
    ncp_specific: 654,
    ncp_cost_center_id: 987,
    voucher_id: 111,
    sub_voucher_id: 222,
    accounting_block_id: 333,
  }

const mockBusinessTrustCode: ICodesBusinessTrust = {
  id: 1,
  business_code: 'BT-001',
  name: 'Fiducuenta',
  business_type_id: 99,
  status_id: 1,
  status: {
    id: 1,
    status: 'Activo',
  },
  account: {
    id: 1,
    business_trust_id: 1,
    accounting_structure_id: 10,
    cost_center_structure_id: 20,
  },
}

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
  useUtils: jest.fn(() => ({
    getMaxId: jest.fn((arr: any[], field: string) =>
      Math.max(...arr.map((item) => item[field]))
    ),
  })),
}))

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

describe('useAccountingParametersMovementCodesStoreV1', () => {
  let store: ReturnType<typeof useAccountingParametersMovementCodesStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAccountingParametersMovementCodesStoreV1()
    jest.clearAllMocks()
  })

  describe('_getListAction', () => {
    it('should fetch movement codes successfully', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: [mockAccountingParametersMovementCode],
            current_page: 1,
            last_page: 1,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getListAction()

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/accounting-block/list`)
      expect(store.accounting_parameters_movement_codes_list).toEqual([
        { ...mockAccountingParametersMovementCode, _uid: 1 },
      ])
      expect(store.accounting_parameters_movement_codes_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
      expect(store.max_id).toBe(1)
    })

    it('should handle error when fetching movement codes fails', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getListAction()

      expect(store.accounting_parameters_movement_codes_list).toEqual([])
    })
  })

  describe('_createAccountingParametersMovementCodes', () => {
    it('should create new movement codes successfully', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createAccountingParametersMovementCodes([
        mockAccountingParametersMovementCode,
      ])

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/accounting-block/new`,
        { accountig_blocks: [mockAccountingParametersMovementCode] }
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createAccountingParametersMovementCodes([
        mockAccountingParametersMovementCode,
      ])

      expect(result).toBe(false)
    })

    it('should handle error when creating movement codes fails', async () => {
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createAccountingParametersMovementCodes([
        mockAccountingParametersMovementCode,
      ])

      expect(result).toBe(false)
    })
  })

  describe('_getCodeDescription', () => {
    it('should fetch business trust codes successfully', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: [mockBusinessTrustCode],
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getCodeDescription('filter=search')

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/accounting-block/list-business-trusts?filter=search`
      )
      expect(store.codes_business_trust_list).toEqual([mockBusinessTrustCode])
    })

    it('should handle error when fetching business trust codes fails', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getCodeDescription('filter=search')

      expect(store.codes_business_trust_list).toEqual([])
    })
  })

  describe('_getParameters', () => {
    it('should fetch parameters successfully', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: [mockAccountingParametersMovementCodeParameter],
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getParameters(1)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/accounting-block/show/1`
      )
    })

    it('should handle error when fetching parameters fails', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getParameters(1)

      expect(
        store.accounting_parameters_movement_codes_parameters_list
      ).toEqual([])
    })
  })

  describe('_createAccountingParametersMovementCodesParameters', () => {
    it('should create parameters successfully', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result =
        await store._createAccountingParametersMovementCodesParameters(
          [mockAccountingParametersMovementCodeParameter],
          1
        )

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/accounting-params/new/1`,
        {
          parameters: [mockAccountingParametersMovementCodeParameter],
        }
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result =
        await store._createAccountingParametersMovementCodesParameters(
          [mockAccountingParametersMovementCodeParameter],
          1
        )

      expect(result).toBe(false)
    })

    it('should handle error when creating parameters fails', async () => {
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result =
        await store._createAccountingParametersMovementCodesParameters(
          [mockAccountingParametersMovementCodeParameter],
          1
        )

      expect(result).toBe(false)
    })
  })

  describe('_clearDataCodes', () => {
    it('should clear business trust list', () => {
      store.codes_business_trust_list = [mockBusinessTrustCode]
      store._clearDataCodes()
      expect(store.codes_business_trust_list).toEqual([])
    })
  })

  describe('_setMaxId', () => {
    it('should set max_id correctly', () => {
      store._setMaxId(99)
      expect(store.max_id).toBe(99)
    })
  })

  describe('_setMaxIdParameters', () => {
    it('should set max_id_parameters correctly', () => {
      store._setMaxIdParameters(88)
      expect(store.max_id_parameters).toBe(88)
    })
  })

  describe('_setRowSelected', () => {
    it('should set selected row', () => {
      store._setRowSelected(mockAccountingParametersMovementCode)
      expect(store.row_selected).toEqual(mockAccountingParametersMovementCode)
    })

    it('should clear selected row when null is passed', () => {
      store._setRowSelected(null)
      expect(store.row_selected).toBeNull()
    })
  })
})
