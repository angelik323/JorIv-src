import { setActivePinia, createPinia } from 'pinia'
import { useUploadFilesInvestmentValuationStoreV1 } from '@/stores/investment-portfolio/upload-files-investment-valuation/upload-files-investment-valuation-v1'
import { executeApi } from '@/apis'
import type {
  IUploadFilesInvestmentValuationForm,
  IUploadFilesInvestmentValuationListFilesResponse,
} from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/upload-files-investment-valuation`

const mockUploadFilesInvestmentValuationForm: IUploadFilesInvestmentValuationForm =
  {
    id: 1,
    issuers_counterparty_id: 1,
    upload_date: '2022-01-01',
    description: 'Description',
    selected_files: [],
    files: [],
    documents: [],
  }

const mockUploadFilesInvestmentValuationListFilesResponse: IUploadFilesInvestmentValuationListFilesResponse[] =
  [
    {
      label_name: 'Label Name',
      method_name: 'Method Name',
      file_structure_name: 'File Structure Name',
    },
  ]

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

describe('useUploadFilesInvestmentValuationStoreV1', () => {
  let store: ReturnType<typeof useUploadFilesInvestmentValuationStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useUploadFilesInvestmentValuationStoreV1()
    jest.clearAllMocks()
  })

  describe('_getFilesTypesCheckbox', () => {
    it('should fetch definition upload files investment valuation list files types checkbox successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockUploadFilesInvestmentValuationListFilesResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getFilesTypesCheckbox('1')

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list-files/1`)
      expect(store.upload_files_investment_valuation_list_files).toEqual(
        mockUploadFilesInvestmentValuationListFilesResponse
      )
    })

    it('should fetch definition upload files investment valuation list files types checkbox successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: mockUploadFilesInvestmentValuationListFilesResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getFilesTypesCheckbox('1')

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list-files/1`)
      expect(store.upload_files_investment_valuation_list_files).toEqual(
        mockUploadFilesInvestmentValuationListFilesResponse
      )
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Failed',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getFilesTypesCheckbox('1')

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list-files/1`)
      expect(store.upload_files_investment_valuation_list_files).toEqual([])
    })

    it('handles error when fetching upload files investment valuation list files types checkbox fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getFilesTypesCheckbox('1')

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list-files/1`)
      expect(store.upload_files_investment_valuation_list_files).toEqual([])
    })
  })

  describe('_getCheckFileUploadStatus', () => {
    const mockCheckFileUploadStatusResponse = [
      {
        expected_file_name: 'test1.txt',
        uploaded_file_name: 'test1_uploaded.txt',
        group_charging_id: 1,
        status: 67,
        upload_date: '2025-09-07 10:00:00',
        update_date: '2025-09-07 10:05:00',
        duration_charging: '00:05:00',
      },
      {
        expected_file_name: 'test2.txt',
        uploaded_file_name: 'test2_uploaded.txt',
        group_charging_id: 1,
        status: 66,
        upload_date: '2025-09-07 10:00:00',
        update_date: '2025-09-07 10:03:00',
        duration_charging: '00:03:00',
      },
    ]

    beforeEach(() => {
      store.group_charging_id = 1
    })

    it('should get check file upload status successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockCheckFileUploadStatusResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getCheckFileUploadStatus()

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/check-file-upload-status/1`
      )
      expect(store.check_file_upload_status_list).toEqual(
        mockCheckFileUploadStatusResponse
      )
    })

    it('should handle response with success=false', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'No data',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getCheckFileUploadStatus()

      // Assert
      expect(store.check_file_upload_status_list).toEqual([])
    })

    it('should handle response with success=false', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error',
          data: null,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getCheckFileUploadStatus()

      // Assert
      expect(mockGet).toHaveBeenCalled()
      expect(store.check_file_upload_status_list).toEqual([])
    })

    it('should handle error in the request', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getCheckFileUploadStatus()

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/check-file-upload-status/1`
      )
      expect(store.check_file_upload_status_list).toEqual([])
    })
  })

  describe('_createUploadFiles', () => {
    const mockFormData = new FormData()
    mockFormData.append('file', new File(['test'], 'test.txt'))

    it('should upload files successfully and update group_charging_id', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Files uploaded successfully',
        data: { group_charging_id: 123 },
      }
      const mockPost = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createUploadFiles(mockFormData)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/upload-files`,
        mockFormData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(store.group_charging_id).toBe(123)
      expect(result).toBe(true)
    })

    it('should handle successful response without group_charging_id', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Files uploaded but no group ID',
        data: {},
      }
      const mockPost = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createUploadFiles(mockFormData)

      // Assert
      expect(result).toBe(true)
      expect(store.group_charging_id).toBeNull()
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        message: 'Upload failed',
        data: null,
      }
      const mockPost = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createUploadFiles(mockFormData)

      // Assert
      expect(result).toBe(false)
    })

    it('should handle network error', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createUploadFiles(mockFormData)

      // Assert
      expect(result).toBe(false)
    })

    it('should handle malformed response', async () => {
      // Arrange
      const mockPost = jest
        .fn()
        .mockResolvedValue({ data: { invalid: 'response' } })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createUploadFiles(mockFormData)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('_setUploadFilesInvestmentValuationListFiles', () => {
    it('should set the list files data', () => {
      // Arrange
      const listFilesData = mockUploadFilesInvestmentValuationListFilesResponse
      // Act
      store._setUploadFilesInvestmentValuationListFiles(listFilesData)

      // Assert
      expect(store.upload_files_investment_valuation_list_files).toEqual(
        listFilesData
      )
    })

    it('should set empty array when passed null', () => {
      store.upload_files_investment_valuation_list_files =
        {} as IUploadFilesInvestmentValuationListFilesResponse[]
      store._setUploadFilesInvestmentValuationListFiles(null)
      expect(store.upload_files_investment_valuation_list_files).toEqual([])
    })
  })

  describe('_setUploadFilesInvestmentValuationForm', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockUploadFilesInvestmentValuationForm

      // Act
      store._setUploadFilesInvestmentValuationForm(formData)

      // Assert
      expect(store.upload_files_investment_valuation_form).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.upload_files_investment_valuation_form =
        {} as IUploadFilesInvestmentValuationForm
      store._setUploadFilesInvestmentValuationForm(null)
      expect(store.upload_files_investment_valuation_form).toBeNull()
    })
  })

  describe('_clearData', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.upload_files_investment_valuation_form = null
      store.group_charging_id = null
      store.upload_files_investment_valuation_list_files = []
      store.check_file_upload_status_list = []

      // Act
      store._clearData()

      // Assert
      expect(store.upload_files_investment_valuation_list_files).toEqual([])
      expect(store.upload_files_investment_valuation_form).toBeNull()
      expect(store.group_charging_id).toBeNull()
    })
  })
})
