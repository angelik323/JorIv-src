import { setActivePinia, createPinia } from 'pinia'
import { useRecordIndividualIncomeStoreV1 } from '@/stores/treasury/record-individual-income/record-individual-income-v1'
import { executeApi } from '@/apis'
import type {
  IRecordIndividualIncomeFilterForm,
  IRecordIndividualIncomeDetailForm,
  IRecordIndividualIncomeDetailView,
  IRecordIndividualIncomeDetailList,
  IRecordIndividualIncomeToCreate,
  IRecordIndividualIncomeResponse,
  IRecordIndividualIncomeToConfirm,
  ISelectorResources,
} from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'

const URL_PATH = `${URL_PATH_TREASURIES}/income-records`

const mockRecordIndividualIncomeFilterForm: IRecordIndividualIncomeFilterForm =
  {
    id: null,
    income_record_id: 1,
    office_id: 1,
    name_office: 'Oficina',
    business_trust_id: 1,
    name_business: 'Empresa',
    date: '2025-06-26',
    movement_id: 1,
    voucher: 'voucher',
    sub_voucher: 'sub_voucher',
  }

const mockRecordIndividualIncomeDetailForm: IRecordIndividualIncomeDetailForm =
  {
    nit_third_party_id: 1,
    type_receive_id: 1,
    cost_center_id: 1,
    cash_flow_id: 1,
    concept: 'concept',
    bank_id: 1,
    bank_account_id: 1,
    foreign_currency_value: 1,
    coin: 'extranjera',
    trm: 100,
    value: 200,
    checkbook: 'checkbook',
    bank_checkbook_id: 1,
    effective_date: '2025-06-26',
    investment_plans_id: 1,
  }

const mockRecordIndividualIncomeDetailView: IRecordIndividualIncomeDetailView =
  {
    id: 1,
    third_party: {
      id: 1,
      document: 'document',
      name: 'name',
    },
    type_receive: {
      id: 1,
      code: 'code',
      description: 'description',
      type_receive: 'type_receive',
    },
    cost_center: {
      id: 1,
      code: 'code',
      name: 'name',
    },
    cash_flow: {
      id: 1,
      code: 'code',
      name: 'name',
    },
    concept: 'concept',
    bank: {
      id: 1,
      description: 'description',
      bank_code: ''
    },
    bank_account: {
      id: 1,
      account_name: 'account_name',
      account_number: 'account_number',
    },
    foreign_currency_value: 1,
    coin: 'extranjera',
    trm: 100,
    value: 200,
    checkbook: 'checkbook',
    bank_checkbook: {
      id: 1,
      description: 'description',
    bank_code: 'code'

    },
    effective_date: '2025-06-26',
    investment_plans: {
      id: 1,
      description: 'description',
    },
  }

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

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

describe('useRecordIndividualIncomeStoreV1', () => {
  let store: ReturnType<typeof useRecordIndividualIncomeStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useRecordIndividualIncomeStoreV1()
    jest.clearAllMocks()
  })

  describe('_getRecordIndividualIncomeList', () => {
    const filters = '&page=1&income_record_id=1'
    const filtersEmpty = ''

    const mockRecordIndividualIncomeResponse: IRecordIndividualIncomeResponse =
      {
        foreign_currency_value_total: 100,
        local_currency_value_total: 200,
        calculated_foreign_total: 100,
        calculated_local_total: 200,
        state: null,
        details: [mockRecordIndividualIncomeDetailView],
      }

    it('should fetch record individual income list successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: [mockRecordIndividualIncomeResponse],
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getRecordIndividualIncomeList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.data_response).toEqual(mockRecordIndividualIncomeResponse)
      expect(store.data_list).toEqual(
        mockRecordIndividualIncomeResponse.details
      )
      expect(store.data_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
        total_items: 1,
        per_page: 10,
      })
    })

    it('should handle error when fetching without filters', async () => {
      // Arrange
      const error422 = {
        response: {
          status: 422,
          data: {
            message: 'El campo income_record_id es requerido',
          },
        },
      }

      const mockGet = jest.fn().mockRejectedValue(error422)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getRecordIndividualIncomeList(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}?paginate=1${filtersEmpty}`
      )
      expect(store.data_list).toEqual([])
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error',
          data: {
            data: { details: [] },
            current_page: 0,
            last_page: 0,
            total: 0,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getRecordIndividualIncomeList(filters)

      expect(mockGet).toHaveBeenCalled()
      expect(store.data_list).toEqual([])
    })

    it('should handle error when fetching record individual income fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getRecordIndividualIncomeList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.data_list).toEqual([])
    })
  })

  describe('_getByIdRecordIndividualIncomeDetail', () => {
    it('should fetch record individual income by ID successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockRecordIndividualIncomeDetailView,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdRecordIndividualIncomeDetail(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/detail/1`)
      expect(store.data_detail_view).toEqual(
        mockRecordIndividualIncomeDetailView
      )
    })

    it('should handle API success=false or no data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Not found', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdRecordIndividualIncomeDetail(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/detail/1`)
      expect(store.data_detail_view).toBeNull()
    })

    it('handles error when fetching record individual income by ID fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdRecordIndividualIncomeDetail(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/detail/1`)
      expect(store.data_detail_view).toBeNull()
    })
  })

  describe('_validateRecordIndividualIncomeFilter', () => {
    it('should validate record individual income successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'validated',
          data: mockRecordIndividualIncomeFilterForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validateRecordIndividualIncomeFilter(
        mockRecordIndividualIncomeFilterForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/validate`,
        mockRecordIndividualIncomeFilterForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on validate', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._validateRecordIndividualIncomeFilter(
        mockRecordIndividualIncomeFilterForm
      )
      expect(result).toBe(false)
    })

    it('handles error when validate record individual income fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validateRecordIndividualIncomeFilter(
        mockRecordIndividualIncomeFilterForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/validate`,
        mockRecordIndividualIncomeFilterForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_createRecordIndividualIncome', () => {
    const mockRecordIndividualIncomeToCreate: IRecordIndividualIncomeToCreate =
      {
        ...mockRecordIndividualIncomeFilterForm,
        details: [mockRecordIndividualIncomeDetailForm],
      }

    it('should create a new record individual income successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: mockRecordIndividualIncomeToCreate,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createRecordIndividualIncome(
        mockRecordIndividualIncomeToCreate
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockRecordIndividualIncomeToCreate
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createRecordIndividualIncome(
        mockRecordIndividualIncomeToCreate
      )
      expect(result).toBe(false)
    })

    it('handles error when creating record individual income fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createRecordIndividualIncome(
        mockRecordIndividualIncomeToCreate
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockRecordIndividualIncomeToCreate
      )
      expect(result).toBe(false)
    })
  })

  describe('_updateRecordIndividualIncomeDetail', () => {
    const recordIndividualIncomeDetailId = 1

    it('should update an existing record individual income detail successfully', async () => {
      // Arrange
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Updated',
          data: {
            id: recordIndividualIncomeDetailId,
            ...mockRecordIndividualIncomeDetailForm,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateRecordIndividualIncomeDetail(
        mockRecordIndividualIncomeDetailForm,
        recordIndividualIncomeDetailId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/detail/${recordIndividualIncomeDetailId}`,
        mockRecordIndividualIncomeDetailForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on update', async () => {
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateRecordIndividualIncomeDetail(
        mockRecordIndividualIncomeDetailForm,
        recordIndividualIncomeDetailId
      )
      expect(result).toBe(false)
    })

    it('handles error when updating record individual income detail fails', async () => {
      // Arrange
      const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateRecordIndividualIncomeDetail(
        mockRecordIndividualIncomeDetailForm,
        recordIndividualIncomeDetailId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/detail/${recordIndividualIncomeDetailId}`,
        mockRecordIndividualIncomeDetailForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_confirmRecordIndividualIncome', () => {
    const recordIndividualIncomeId = 1
    const mockRecordIndividualIncomeToConfirm: IRecordIndividualIncomeToConfirm =
      {
        ...mockRecordIndividualIncomeFilterForm,
        foreign_currency_value_total: 100,
        local_currency_value_total: 200,
        state: null,
      }

    it('should confirm record individual income successfully', async () => {
      // Arrange
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Confirmed successfully',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._confirmRecordIndividualIncome(
        mockRecordIndividualIncomeToConfirm,
        recordIndividualIncomeId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/confirm/${recordIndividualIncomeId}`,
        mockRecordIndividualIncomeToConfirm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Confirmation failed',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._confirmRecordIndividualIncome(
        mockRecordIndividualIncomeToConfirm,
        recordIndividualIncomeId
      )

      // Assert
      expect(mockPut).toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should handle error when confirming record individual income fails', async () => {
      // Arrange
      const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._confirmRecordIndividualIncome(
        mockRecordIndividualIncomeToConfirm,
        recordIndividualIncomeId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/confirm/${recordIndividualIncomeId}`,
        mockRecordIndividualIncomeToConfirm
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteRecordIndividualIncomeDetail', () => {
    const recordIndividualIncomeDetailId = 1

    it('should delete an record individual income successfully', async () => {
      // Arrange
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Deleted',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteRecordIndividualIncomeDetail(
        recordIndividualIncomeDetailId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/detail/${recordIndividualIncomeDetailId}`
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on delete', async () => {
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      const result = await store._deleteRecordIndividualIncomeDetail(
        recordIndividualIncomeDetailId
      )
      expect(result).toBe(false)
    })

    it('handles error when deleting record individual income fails', async () => {
      // Arrange
      const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteRecordIndividualIncomeDetail(
        recordIndividualIncomeDetailId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/detail/${recordIndividualIncomeDetailId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_setDataFilterForm', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockRecordIndividualIncomeFilterForm

      // Act
      store._setDataFilterForm(formData)

      // Assert
      expect(store.data_filter_form).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.data_filter_form = {} as IRecordIndividualIncomeFilterForm
      store._setDataFilterForm(null)
      expect(store.data_filter_form).toBeNull()
    })
  })

  describe('_setDataDetailForm', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockRecordIndividualIncomeDetailForm

      // Act
      store._setDataDetailForm(formData)

      // Assert
      expect(store.data_detail_form).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.data_detail_form = {} as IRecordIndividualIncomeDetailForm
      store._setDataDetailForm(null)
      expect(store.data_detail_form).toBeNull()
    })
  })

  describe('_setDataDetailView', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockRecordIndividualIncomeDetailView

      // Act
      store._setDataDetailView(formData)

      // Assert
      expect(store.data_detail_view).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.data_detail_view = {} as IRecordIndividualIncomeDetailView
      store._setDataDetailView(null)
      expect(store.data_detail_view).toBeNull()
    })
  })

  describe('_clearData', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.data_filter_form = {} as IRecordIndividualIncomeFilterForm
      store.data_detail_form = {} as IRecordIndividualIncomeDetailForm
      store.data_detail_view = {} as IRecordIndividualIncomeDetailView
      store.data_list = [] as IRecordIndividualIncomeDetailList
      store.business_selected = {} as ISelectorResources
      store.data_response = {} as IRecordIndividualIncomeResponse
      store.income_record_id = null
      store.data_pages = {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      }

      // Act
      store._clearData()

      // Assert
      expect(store.data_filter_form).toEqual(null)
      expect(store.data_detail_form).toEqual(null)
      expect(store.data_detail_view).toEqual(null)
      expect(store.business_selected).toEqual(null)
      expect(store.data_response).toEqual(null)
      expect(store.income_record_id).toEqual(null)
      expect(store.data_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      })
    })
  })
})
