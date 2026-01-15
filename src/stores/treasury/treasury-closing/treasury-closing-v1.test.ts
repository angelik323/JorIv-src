import { setActivePinia, createPinia } from 'pinia'
import { useTreasuryClosingStoreV1 } from './treasury-closing-v1'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { ITreasuryClosingExecutionPayload } from '@/interfaces/customs/treasury/TreasuryClosing'

const URL_PATH = `${URL_PATH_TREASURIES}/treasury-closing`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useTreasuryClosingStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getTreasuryClosingList', () => {
    it('should fetch treasury closing list list and update state on success', async () => {
      // Arrange
      const store = useTreasuryClosingStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 25,
                business_code: '445',
                name: 'Proyecto vial del norte',
                type_closing: 'Diario',
              },
              {
                id: 35,
                business_code: '446',
                name: 'Proyecto vial del norte',
                type_closing: 'Diario',
              },
              {
                id: 36,
                business_code: '447',
                name: 'Proyecto vial del norte',
                type_closing: 'Diario',
              },
            ],
            current_page: 1,
            last_page: 1,
          },
          message: 'Listado obtenido exitosamente.',
          success: true,
        },
      }

      const filters = {
        paginate: 1,
        'filter[from_business]': 1,
        'filter[up_business]': 17,
        'filter[closing_type]': 'Diario',
        'filter[procces]': 'Generar cierre',
        'filter[closing_date]': '2025-07-21',
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getTreasuryClosingList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: {
          ...filters,
          paginate: 1,
        },
      })
      expect(store.treasury_closing_list).toEqual(mockResponse.data.data.data)
    })

    it('should handle error when fetching treasury closing list list', async () => {
      // Arrange
      const store = useTreasuryClosingStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const filters = {
        paginate: 1,
        'filter[from_business]': 1,
        'filter[up_business]': 17,
        'filter[closing_type]': 'Diario',
        'filter[procces]': 'Generar cierre',
        'filter[closing_date]': '2025-07-21',
      }
      // Act
      await store._getTreasuryClosingList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: {
          ...filters,
          paginate: 1,
        },
      })
      expect(store.treasury_closing_list).toEqual([])
    })

    it('should handle response.data as undefined when fetching treasury closing list list', async () => {
      // Arrange
      const store = useTreasuryClosingStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const filters = {
        paginate: 1,
        'filter[from_business]': 1,
        'filter[up_business]': 17,
        'filter[closing_type]': 'Diario',
        'filter[procces]': 'Generar cierre',
        'filter[closing_date]': '2025-07-21',
      }
      // Act
      await store._getTreasuryClosingList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: {
          ...filters,
          paginate: 1,
        },
      })
      expect(store.treasury_closing_list).toEqual([])
    })

    it('should handle response.data as null when fetching treasury closing list list', async () => {
      // Arrange
      const store = useTreasuryClosingStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const filters = {
        paginate: 1,
        'filter[from_business]': 1,
        'filter[up_business]': 17,
        'filter[closing_type]': 'Diario',
        'filter[procces]': 'Generar cierre',
        'filter[closing_date]': '2025-07-21',
      }
      // Act
      await store._getTreasuryClosingList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: {
          ...filters,
          paginate: 1,
        },
      })
      expect(store.treasury_closing_list).toEqual([])
    })
  })

  describe('_executeTreasuryClosing', () => {
    it('should create a new record individual income successfully', async () => {
      // Arrange
      const store = useTreasuryClosingStoreV1()
      const mockTreasuryClosingPayload: ITreasuryClosingExecutionPayload = {
        procces: 'Generar Cierre',
        date: '2024-07-07',
        business: [
          {
            id: 100,
          },
          {
            id: 2000,
          },
        ],
      }
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._executeTreasuryClosing(mockTreasuryClosingPayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockTreasuryClosingPayload
      )
      expect(mockPost).toHaveBeenCalledTimes(1)
    })
  })
})
