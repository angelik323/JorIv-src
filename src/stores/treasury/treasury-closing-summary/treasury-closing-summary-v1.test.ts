import { setActivePinia, createPinia } from 'pinia'
import { useTreasuryClosingSummaryStoreV1 } from './treasury-closing-summary-v1'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'

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

describe('useTreasuryClosingSummaryStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getTreasuryClosingSummaryList', () => {
    it('should fetch treasury closing summary list and update state on success', async () => {
      // Arrange
      const store = useTreasuryClosingSummaryStoreV1()
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [
              {
                id: 6663,
                business_code: '1262560',
                status: 'Generado',
                type: 'Cierre diario',
                initial_balance: '0.00',
                income_local: '0.00',
                expense_local: '0.00',
                final_balance_local: '0.00',
                performance_value: null,
                reexpression_difference: '0.00',
              },
              {
                id: 6664,
                business_code: '1262560',
                status: 'Generado',
                type: 'Cierre diario',
                initial_balance: '0.00',
                income_local: '0.00',
                expense_local: '0.00',
                final_balance_local: '0.00',
                performance_value: null,
                reexpression_difference: '0.00',
              },
              {
                id: 6665,
                business_code: '1262560',
                status: 'Generado',
                type: 'Cierre diario',
                initial_balance: '0.00',
                income_local: '0.00',
                expense_local: '0.00',
                final_balance_local: '0.00',
                performance_value: null,
                reexpression_difference: '0.00',
              },
            ],
          },
          message: 'Listado obtenido exitosamente.',
          current_page: 1,
          last_page: 1,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const filters = {
        paginate: 1,
        'filter[closure_status]': 66,
        'filter[closure_type]': 'Todos',
      }

      // Act
      await store._getTreasuryClosingSummaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/resumen`, {
        params: {
          ...filters,
          paginate: 1,
        },
      })
      expect(store.treasury_closing_summary_list).toEqual(
        mockResponse.data.data.data
      )
    })

    it('should handle error when fetching treasury closing summary list', async () => {
      // Arrange
      const store = useTreasuryClosingSummaryStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const filters = {
        paginate: 1,
        'filter[closure_status]': 66,
        'filter[closure_type]': 'Todos',
      }
      // Act
      await store._getTreasuryClosingSummaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/resumen`, {
        params: {
          ...filters,
          paginate: 1,
        },
      })
      expect(store.treasury_closing_summary_list).toEqual([])
    })

    it('should handle response.data as undefined when fetching treasury closing summary list', async () => {
      // Arrange
      const store = useTreasuryClosingSummaryStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const filters = {
        paginate: 1,
        'filter[closure_status]': 66,
        'filter[closure_type]': 'Todos',
      }
      // Act
      await store._getTreasuryClosingSummaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/resumen`, {
        params: {
          ...filters,
          paginate: 1,
        },
      })
      expect(store.treasury_closing_summary_list).toEqual([])
    })

    it('should handle response.data as null when fetching treasury closing summary list', async () => {
      // Arrange
      const store = useTreasuryClosingSummaryStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const filters = {
        paginate: 1,
        'filter[closure_status]': 66,
        'filter[closure_type]': 'Todos',
      }
      // Act
      await store._getTreasuryClosingSummaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/resumen`, {
        params: {
          ...filters,
          paginate: 1,
        },
      })
      expect(store.treasury_closing_summary_list).toEqual([])
    })
  })

  describe('_downloadExcelTreasuryClosingSummaryList', () => {
    it('fetches Excel data and triggers download', async () => {
      // Arrange
      const store = useTreasuryClosingSummaryStoreV1()

      const mockData = new ArrayBuffer(8)
      const mockGet = jest.fn().mockResolvedValue({
        data: mockData,
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'content-disposition': 'attachment; filename="export_data.xlsx"',
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const filters = {
        paginate: 1,
        'filter[closure_status]': 66,
        'filter[closure_type]': 'Todos',
      }
      // Act
      await store._downloadExcelTreasuryClosingSummaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/export-resumen`, {
        responseType: 'blob',
        params: {
          ...filters,
          paginate: 1,
        },
      })
    })

    it('handles error when fetching Excel data fails', async () => {
      // Arrange
      const store = useTreasuryClosingSummaryStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const filters = {
        paginate: 1,
        'filter[closure_status]': 66,
        'filter[closure_type]': 'Todos',
      }

      // Act
      await store._downloadExcelTreasuryClosingSummaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/export-resumen`, {
        responseType: 'blob',
        params: {
          ...filters,
          paginate: 1,
        },
      })
    })
  })
})
