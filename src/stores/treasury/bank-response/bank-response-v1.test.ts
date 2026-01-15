import { setActivePinia, createPinia } from 'pinia'
import { useBankResponseStoreV1 } from '@/stores/treasury/bank-response/bank-response-v1'
import { executeApi } from '@/apis'
import type {
  IBankResponseFilterForm,
  IBankResponseAssignForm,
  IBankResponseDescriptionForm,
  IBankResponseDetailRejectForm,
  IBankResponsePayment,
  IBankResponsePaymentList,
  IBankResponsePaymentPages,
  IBankResponseDocument,
  IBankResponseError,
} from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'
const composables = require('@/composables')

const URL_PATH = `${URL_PATH_TREASURIES}/response-banks`

const mockBankResponseAssignForm: IBankResponseAssignForm = {
  status: 1,
  reason_id: 1,
  reason_label: 'Test reason',
  observations: 'Test description',
}

const mockBankResponseDetailRejectForm: IBankResponseDetailRejectForm = {
  date: '2024-01-01',
  bank_structure_id: 1,
  observations: 'Test description',
  ids: {
    '1': {
      code: '123',
      status_id: 1,
    },
  },
}

const mockBankResponsePayment: IBankResponsePayment = {
  id: 1,
  consecutive: 1,
  movement_status: {
    id: 1,
    status: 'active',
    comments: 'test',
  },
  business: {
    id: 1,
    business_code: 'B001',
    name: 'Test Business',
    status: {
      id: 1,
      status: 'active',
      comments: 'test',
    },
  },
  value: '1000',
  voucher: {
    id: 1,
    code: 123,
    name: 'Test Voucher',
    status: {
      id: 1,
      status: 'active',
      comments: 'test',
    },
  },
  third_party: {
    id: 1,
    document: '123456789',
  },
  reason_for_return: 'Test reason',
  dispersion_group: {
    id: 1,
    dispersion_date: '2024-01-01',
    validity: '2024',
    value: '1000',
    status: {
      id: 1,
      status: 'active',
      comments: 'test',
    },
  },
  bank: {
    id: 1,
    code: '001',
    description: 'Test Bank',
    status: {
      id: 1,
      status: 'active',
      comments: 'test',
    },
  },
  bank_account: {
    id: 1,
    account_name: 'Test Account',
    account_number: '1234567890',
    status: {
      id: 1,
      status: 'active',
      comments: 'test',
    },
  },
}

const mockBankResponsePaymentList: IBankResponsePaymentList = [
  {
    id: 1,
    consecutive: 1,
    movement_status: {
      id: 1,
      status: 'active',
      comments: 'test',
    },
    business: {
      id: 1,
      business_code: 'B001',
      name: 'Test Business',
      status: {
        id: 1,
        status: 'active',
        comments: 'test',
      },
    },
    value: '1000',
    voucher: {
      id: 1,
      code: 123,
      name: 'Test Voucher',
      status: {
        id: 1,
        status: 'active',
        comments: 'test',
      },
    },
    third_party: {
      id: 1,
      document: '123456789',
    },
    reason_for_return: 'Test reason',
    dispersion_group: {
      id: 1,
      dispersion_date: '2024-01-01',
      validity: '2024',
      value: '1000',
      status: {
        id: 1,
        status: 'active',
        comments: 'test',
      },
    },
    bank: {
      id: 1,
      code: '001',
      description: 'Test Bank',
      status: {
        id: 1,
        status: 'active',
        comments: 'test',
      },
    },
    bank_account: {
      id: 1,
      account_name: 'Test Account',
      account_number: '1234567890',
      status: {
        id: 1,
        status: 'active',
        comments: 'test',
      },
    },
  },
  {
    id: 2,
    consecutive: 2,
    movement_status: {
      id: 1,
      status: 'active',
      comments: 'test',
    },
    business: {
      id: 2,
      business_code: 'B002',
      name: 'Test Business 2',
      status: {
        id: 1,
        status: 'active',
        comments: 'test',
      },
    },
    value: '2000',
    voucher: {
      id: 2,
      code: 456,
      name: 'Test Voucher 2',
      status: {
        id: 1,
        status: 'active',
        comments: 'test',
      },
    },
    third_party: {
      id: 2,
      document: '987654321',
    },
    reason_for_return: 'Test reason 2',
    dispersion_group: {
      id: 2,
      dispersion_date: '2024-01-02',
      validity: '2024',
      value: '2000',
      status: {
        id: 1,
        status: 'active',
        comments: 'test',
      },
    },
    bank: {
      id: 2,
      code: '002',
      description: 'Test Bank 2',
      status: {
        id: 1,
        status: 'active',
        comments: 'test',
      },
    },
    bank_account: {
      id: 2,
      account_name: 'Test Account 2',
      account_number: '9876543210',
      status: {
        id: 1,
        status: 'active',
        comments: 'test',
      },
    },
  },
]

const mockBankResponsePaymentPages: IBankResponsePaymentPages = {
  currentPage: 1,
  lastPage: 2,
  total_items: 20,
  per_page: 10,
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

describe('useBankResponseStoreV1', () => {
  let store: ReturnType<typeof useBankResponseStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBankResponseStoreV1()
    jest.clearAllMocks()
  })

  describe('_getBankResponsePaymentList', () => {
    const filters = '&page=1&filter[status]=active'
    const filtersEmpty = ''

    it('should fetch bank response payment list successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockBankResponsePaymentList,
            current_page: 1,
            last_page: 2,
            total: 20,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getBankResponsePaymentList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filters}`
      )
      expect(store.bank_response_payment_list).toEqual(
        mockBankResponsePaymentList
      )
      expect(store.bank_response_payment_pages).toEqual({
        currentPage: 1,
        lastPage: 2,
        total_items: 20,
        per_page: 10,
      })
    })

    it('should fetch bank response payment list successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockBankResponsePaymentList,
            current_page: 1,
            last_page: 1,
            total: 2,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getBankResponsePaymentList(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filtersEmpty}`
      )
      expect(store.bank_response_payment_list).toEqual(
        mockBankResponsePaymentList
      )
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Failed',
          data: {
            data: [],
            current_page: 0,
            last_page: 0,
            total: 0,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getBankResponsePaymentList(filters)

      expect(mockGet).toHaveBeenCalled()
      expect(store.bank_response_payment_list).toEqual([])
    })

    it('handles error when fetching bank response payment list fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getBankResponsePaymentList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filters}`
      )
      expect(store.bank_response_payment_list).toEqual([])
    })
  })

  describe('_validateBankResponseUploadFile', () => {
    const mockFormData = new FormData()

    it('should validate file upload successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'File validated successfully',
          data: {
            id: 1,
            file_name: 'test.txt',
            valid_records: 10,
            invalid_records: 0,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validateBankResponseUploadFile(mockFormData)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/validate-file`,
        mockFormData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      expect(store.bank_response_filter_form_response).toEqual({
        id: 1,
        file_name: 'test.txt',
        valid_records: 10,
        invalid_records: 0,
      })
      expect(result).toBe(true)
    })

    it('should handle API success=false on file validation', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Validation failed', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._validateBankResponseUploadFile(mockFormData)
      expect(result).toBe(false)
    })

    it('handles error when file validation fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validateBankResponseUploadFile(mockFormData)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/validate-file`,
        mockFormData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      expect(result).toBe(false)
    })
  })

  describe('_createBankResponseAssign', () => {
    it('should create bank response assignment successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Assignment created successfully',
          data: mockBankResponseAssignForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createBankResponseAssign(
        mockBankResponseAssignForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockBankResponseAssignForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create assignment', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Creation failed', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createBankResponseAssign(
        mockBankResponseAssignForm
      )
      expect(result).toBe(false)
    })

    it('handles error when creating assignment fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createBankResponseAssign(
        mockBankResponseAssignForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockBankResponseAssignForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_errorsBankResponseDetailReject', () => {
    it('downloads check treasury receipts', async () => {
      // Arrange
      const mockResponse = {
        data: 'blobdata',
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      }
      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Mock composables used inside the method
      const showAlertMock = jest.fn()
      const showCatchErrorMock = jest.fn()
      const getNameBlobMock = jest.fn().mockReturnValue('"test.xlsx"')
      const downloadBlobMock = jest.fn()

      composables.showAlert = showAlertMock
      composables.showCatchError = showCatchErrorMock
      composables.useUtils = jest.fn(() => ({
        getNameBlob: getNameBlobMock,
        downloadBlobXlxx: downloadBlobMock,
      }))

      const data: IBankResponseError[] = [
        { business_code: 1, detail: 1, field: 'test', message: 'test' },
      ]

      // Act
      await store._errorsBankResponseDetailReject(data)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/download-errors`,
        data,
        {
          responseType: 'blob',
        }
      )
      expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
      expect(downloadBlobMock).toHaveBeenCalled()
    })
  })

  describe('_processBankResponseDetailReject', () => {
    it('should process detail rejection successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Rejection processed successfully',
          data: mockBankResponseDetailRejectForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._processBankResponseDetailReject(
        mockBankResponseDetailRejectForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/process`,
        mockBankResponseDetailRejectForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on process rejection', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Processing failed', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._processBankResponseDetailReject(
        mockBankResponseDetailRejectForm
      )
      expect(result).toBe(false)
    })

    it('handles error when processing rejection fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._processBankResponseDetailReject(
        mockBankResponseDetailRejectForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/process`,
        mockBankResponseDetailRejectForm
      )
      expect(result).toBe(false)
    })
  })

  describe('Setters and Clear', () => {
    describe('_setBankResponseFilterForm', () => {
      it('should set the filter form data', () => {
        // Arrange
        const formData = {} as IBankResponseFilterForm

        // Act
        store._setBankResponseFilterForm(formData)

        // Assert
        expect(store.bank_response_filter_form).toEqual(formData)
      })

      it('should set filter form to null when passed null', () => {
        store.bank_response_filter_form = {} as IBankResponseFilterForm
        store._setBankResponseFilterForm(null)
        expect(store.bank_response_filter_form).toBeNull()
      })
    })

    describe('_setBankResponseDocument', () => {
      it('should set the document data', () => {
        // Arrange
        const documentData = {} as IBankResponseDocument

        // Act
        store._setBankResponseDocument(documentData)

        // Assert
        expect(store.bank_response_document).toEqual(documentData)
      })

      it('should set document to null when passed null', () => {
        store.bank_response_document = {} as IBankResponseDocument
        store._setBankResponseDocument(null)
        expect(store.bank_response_document).toBeNull()
      })
    })

    describe('_setBankResponseAssignForm', () => {
      it('should set the assign form data', () => {
        // Arrange
        const formData = mockBankResponseAssignForm

        // Act
        store._setBankResponseAssignForm(formData)

        // Assert
        expect(store.bank_response_assign_form).toEqual(formData)
      })
    })

    describe('_setBankResponseDescriptionForm', () => {
      it('should set description form when item exists', () => {
        // Arrange
        const item = mockBankResponsePaymentList[0]
        store.bank_response_description_form = null // Ensure initial state

        // Act
        store._setBankResponseDescriptionForm(item)

        // Assert
        expect(store.bank_response_description_form).toEqual(item)
      })
    })

    describe('_setBankResponseDetailRejectForm', () => {
      it('should set the detail reject form data', () => {
        // Arrange
        const formData = mockBankResponseDetailRejectForm

        // Act
        store._setBankResponseDetailRejectForm(formData)

        // Assert
        expect(store.bank_response_detail_reject_form).toEqual(formData)
      })
    })

    describe('_setBankResponsePaymentSelected', () => {
      it('should set the selected payments', () => {
        // Arrange
        const selectedPayments = [mockBankResponsePaymentList[0]]

        // Act
        store._setBankResponsePaymentSelected(selectedPayments)

        // Assert
        expect(store.bank_response_payment_selected).toEqual(selectedPayments)
      })
    })

    describe('_clearBankResponse', () => {
      it('should clear all bank response data from the store', () => {
        // Arrange
        store.bank_response_document = {} as IBankResponseDocument
        store.bank_response_assign_form = mockBankResponseAssignForm
        store.bank_response_description_form =
          {} as IBankResponseDescriptionForm
        store.bank_response_detail_reject_form =
          mockBankResponseDetailRejectForm
        store.bank_response_payment_list = mockBankResponsePaymentList
        store.bank_response_payment = mockBankResponsePayment
        store.bank_response_payment_pages = mockBankResponsePaymentPages

        // Act
        store._clearBankResponse()

        // Assert
        expect(store.bank_response_document).toBeNull()
        expect(store.bank_response_assign_form).toBeNull()
        expect(store.bank_response_description_form).toBeNull()
        expect(store.bank_response_detail_reject_form).toBeNull()
        expect(store.bank_response_payment_list).toEqual([])
        expect(store.bank_response_payment).toBeNull()
        expect(store.bank_response_payment_pages).toEqual({
          currentPage: 0,
          lastPage: 0,
          total_items: 0,
          per_page: 0,
        })
      })
    })
  })
})
