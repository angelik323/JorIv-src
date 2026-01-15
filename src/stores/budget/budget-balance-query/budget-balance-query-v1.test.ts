// Pinia
import { setActivePinia, createPinia } from 'pinia'

// Constants
import { URL_PATH_BUDGET } from '@/constants/apis'

// Crear mocks antes de cualquier import que los use
const mockShowAlert = jest.fn()
const mockShowCatchError = jest.fn((error) => `Error: ${error.message}`)
const mockGetNameBlob = jest.fn(() => 'test.xlsx')
const mockDownloadBlobXlxx = jest.fn()

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: () => ({
    showAlert: mockShowAlert,
  }),

  useShowError: () => ({
    showCatchError: mockShowCatchError,
  }),

  useUtils: () => ({
    getNameBlob: mockGetNameBlob,
    downloadBlobXlxx: mockDownloadBlobXlxx,
  }),
}))

// Apis
import { executeApi } from '@/apis'

// Stores
import { useBudgetBalanceQueryStoreV1 } from './budget-balance-query-v1'

describe('useBudgetBalanceQueryStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_listAction', () => {
    it('fetches list successfully and returns data', async () => {
      const store = useBudgetBalanceQueryStoreV1()

      const mockResponse = {
        data: {
          success: true,
          message: 'Fetched successfully',
          data: {
            data: [{ id: 1, balance: 500 }],
            current_page: 1,
            last_page: 3,
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._listAction({ year: 2025 })

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_BUDGET}/balances`, {
        params: { year: 2025, paginate: 1 },
      })

      expect(result).toEqual({
        list: [{ id: 1, balance: 500 }],
        pages: { currentPage: 1, lastPage: 3 },
      })
    })

    it('fetches empty list successfully', async () => {
      const store = useBudgetBalanceQueryStoreV1()

      const mockResponse = {
        data: {
          success: true,
          message: 'Fetched successfully',
          data: {
            data: [],
            current_page: 1,
            last_page: 1,
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._listAction({ year: 2025, page: 1 })

      expect(result).toEqual({
        list: [],
        pages: { currentPage: 1, lastPage: 1 },
      })
    })

    it('handles response with missing data fields using defaults', async () => {
      const store = useBudgetBalanceQueryStoreV1()

      const mockResponse = {
        data: {
          success: true,
          message: 'Fetched successfully',
          data: {},
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._listAction({ year: 2025 })

      expect(result).toEqual({
        list: [],
        pages: { currentPage: 0, lastPage: 0 },
      })
    })

    it('handles response with missing current_page', async () => {
      const store = useBudgetBalanceQueryStoreV1()

      const mockResponse = {
        data: {
          success: true,
          message: 'Fetched successfully',
          data: {
            data: [{ id: 1 }],
            last_page: 5,
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._listAction({ year: 2025 })

      expect(result).toEqual({
        list: [{ id: 1 }],
        pages: { currentPage: 0, lastPage: 5 },
      })
    })

    it('handles response with missing last_page', async () => {
      const store = useBudgetBalanceQueryStoreV1()

      const mockResponse = {
        data: {
          success: true,
          message: 'Fetched successfully',
          data: {
            data: [{ id: 2 }],
            current_page: 3,
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._listAction({ year: 2025 })

      expect(result).toEqual({
        list: [{ id: 2 }],
        pages: { currentPage: 3, lastPage: 0 },
      })
    })

    it('shows alert when success is false', async () => {
      const store = useBudgetBalanceQueryStoreV1()

      const mockResponse = {
        data: {
          success: false,
          message: 'Error fetching data',
          data: {
            data: [],
            current_page: 0,
            last_page: 0,
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listAction({ year: 2024 })

      expect(mockGet).toHaveBeenCalled()
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error fetching data',
        'error',
        undefined,
        expect.any(Number)
      )
    })

    it('handles error in list action', async () => {
      const store = useBudgetBalanceQueryStoreV1()
      const mockError = new Error('fail')
      const mockGet = jest.fn().mockRejectedValue(mockError)

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._listAction({ year: 2024 })

      expect(mockGet).toHaveBeenCalled()
      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error: fail',
        'error',
        undefined,
        expect.any(Number)
      )
      expect(result).toBeUndefined()
    })

    it('returns showAlert result when success is false', async () => {
      const store = useBudgetBalanceQueryStoreV1()

      const mockAlertResult = { shown: true }
      mockShowAlert.mockReturnValue(mockAlertResult)

      const mockResponse = {
        data: {
          success: false,
          message: 'Error message',
          data: {
            data: [],
            current_page: 0,
            last_page: 0,
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._listAction({ year: 2024 })

      expect(result).toBe(mockAlertResult)
    })
  })

  describe('_exportExcelAction', () => {
    it('exports excel successfully', async () => {
      const store = useBudgetBalanceQueryStoreV1()

      const mockBlob = new Blob(['excel data'], {
        type: 'application/vnd.ms-excel',
      })

      const mockResponse = {
        data: mockBlob,
        headers: {
          'content-type': 'application/vnd.ms-excel',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)

      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      await store._exportExcelAction({ vigencia: 2025 })

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET}/balances/export`,
        {},
        {
          params: { vigencia: 2025 },
          responseType: 'blob',
        }
      )

      expect(mockGetNameBlob).toHaveBeenCalledWith(mockResponse)
      expect(mockDownloadBlobXlxx).toHaveBeenCalledWith(
        expect.any(Blob),
        'test.xlsx'
      )
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Archivo descargado con éxito',
        'success',
        undefined,
        expect.any(Number)
      )
    })

    it('handles error in export excel', async () => {
      const store = useBudgetBalanceQueryStoreV1()
      const mockError = new Error('fail')
      const mockPost = jest.fn().mockRejectedValue(mockError)

      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      await store._exportExcelAction({ vigencia: 2025 })

      expect(mockPost).toHaveBeenCalled()
      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error: fail',
        'error',
        undefined,
        expect.any(Number)
      )
    })
  })
})
