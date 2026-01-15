// Vue - pinia
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IAccountingParametersProcessCodesList,
  IAccountingParametersProcessCodes,
  IAccountingParametersProcessCodesForm,
  IAccountingParametersProcessCodesFormList,
} from '@/interfaces/customs/fics/ProcessCodes'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'

// Store
import { useAccountingParametersProcessCodesStoreV1 } from '@/stores/fics/accounting-parameters/process-codes/process-codes-v1'

const URL_PATH = `${URL_PATH_FICS}/process-codes`

const mockProcessCodeItem = {
  id: 1,
  code: '1',
  description: '001',
  movement_code_id: 1,
  classes_movement_type: {
    id: 1,
    code: '001',
  },
  classes_movement_nature: {
    id: 1,
    code: '001',
  },
  classes_movement_class: {
    id: 1,
    code: '001',
  },
  movement_code: {
    id: 1,
    code: '101',
  },
} as IAccountingParametersProcessCodes

const mockProcessCodeForm: IAccountingParametersProcessCodesForm = {
  id: 1,
  code: '001',
  description: '001',
  process_type_id: 1,
  process_nature_id: 1,
  process_class_id: 1,
  movement_code_id: 1,
}

const mockProcessCodesListResponse: IAccountingParametersProcessCodesList = [
  mockProcessCodeItem,
]

const mockProcessCodesFormList: IAccountingParametersProcessCodesFormList = {
  process_codes: [mockProcessCodeForm],
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

describe('useAccountingParametersProcessCodesStoreV1', () => {
  let store: ReturnType<typeof useAccountingParametersProcessCodesStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAccountingParametersProcessCodesStoreV1()
    jest.clearAllMocks()
  })

  describe('_getProcessCodes', () => {
    it('should fetch process codes successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockProcessCodesListResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getProcessCodes()

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`)
      expect(store.process_codes_list).toEqual(mockProcessCodesListResponse)
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Failed',
          data: {
            data: [],
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getProcessCodes()

      expect(mockGet).toHaveBeenCalled()
    })

    it('handles error when fetching process codes fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getProcessCodes()

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`)
      expect(store.process_codes_list).toEqual([])
    })
  })

  describe('_createProcessCode', () => {
    it('should create a new process code successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: mockProcessCodesFormList,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createProcessCode(mockProcessCodesFormList)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockProcessCodesFormList
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createProcessCode(mockProcessCodesFormList)
      expect(result).toBe(false)
    })

    it('handles error when creating process code fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createProcessCode(mockProcessCodesFormList)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockProcessCodesFormList
      )
      expect(result).toBe(false)
    })
  })

  describe('_clearDataProcessCodes', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.process_codes_list = [
        {
          ...mockProcessCodeItem,
        },
      ]

      // Act
      store._clearDataProcessCodes()

      // Assert
      expect(store.process_codes_list).toEqual([])
    })
  })
})
