import { setActivePinia, createPinia } from 'pinia'
import { useTreasuryClosingErrorsSummaryStoreV1 } from './treasury-closing-errors-summary-v1'
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

describe('useTreasuryClosingErrorsSummaryStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getTreasuryClosingErrorsSummaryList', () => {
    it('should fetch treasury closing summary list and update state on success', async () => {
      // Arrange
      const store = useTreasuryClosingErrorsSummaryStoreV1()
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [
              {
                id: 115,
                business: '6709552 Minima soluta commodi dolore non illo.',
                bank_account: 'NU',
                process: 'movimiento',
                message: 'Reexpresión positiva registrada por 5783082966.28.',
              },
              {
                id: 1238,
                business: '565656 lorem impsut .',
                bank_account: 'test',
                process: 'movimiento',
                message: 'Reexpresión positiva registrada por 5783082966.28.',
              },
              {
                id: 1277,
                business: '3453535 savage commodi dolore non .',
                bank_account: 'test',
                process: 'movimiento',
                message: 'Reexpresión positiva registrada por 5783082966.28.',
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
        page: 1,
      }
      // Act
      await store._getTreasuryClosingErrorsSummaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/errores`, {
        params: {
          paginate: 1,
          page: 1,
        },
      })
      expect(store.treasury_closing_errors_summary_list).toEqual(
        mockResponse.data.data.data
      )
    })

    it('should handle error when fetching treasury closing summary list', async () => {
      // Arrange
      const store = useTreasuryClosingErrorsSummaryStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const filters = {
        paginate: 1,
        page: 1,
      }
      // Act
      await store._getTreasuryClosingErrorsSummaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/errores`, {
        params: filters,
      })
      expect(store.treasury_closing_errors_summary_list).toEqual([])
    })

    it('should handle response.data as undefined when fetching treasury closing summary list', async () => {
      // Arrange
      const store = useTreasuryClosingErrorsSummaryStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const filters = {
        paginate: 1,
        page: 1,
      }
      // Act
      await store._getTreasuryClosingErrorsSummaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/errores`, {
        params: filters,
      })
      expect(store.treasury_closing_errors_summary_list).toEqual([])
    })

    it('should handle response.data as null when fetching treasury closing summary list', async () => {
      // Arrange
      const store = useTreasuryClosingErrorsSummaryStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const filters = {
        paginate: 1,
        page: 1,
      }
      // Act
      await store._getTreasuryClosingErrorsSummaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/errores`, {
        params: filters,
      })
      expect(store.treasury_closing_errors_summary_list).toEqual([])
    })
  })

  describe('_downloadExcelTreasuryClosingSummaryList', () => {
    it('fetches Excel data and triggers download', async () => {
      // Arrange
      const store = useTreasuryClosingErrorsSummaryStoreV1()

      const mockData = new ArrayBuffer(8)
      const mockGet = jest.fn().mockResolvedValue({
        data: mockData,
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'content-disposition': 'attachment; filename="export_data.xlsx"',
        },
      })
      const filters = {
        paginate: 1,
        'filter[closing_id]': 22,
      }

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._downloadExcelTreasuryClosingErrorsSumaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/export-errors`, {
        responseType: 'blob',
        params: {
          paginate: 1,
          'filter[closing_id]': 22,
        },
      })
    })

    it('handles error when fetching Excel data fails', async () => {
      // Arrange
      const store = useTreasuryClosingErrorsSummaryStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))

      const filters = {
        paginate: 1,
        'filter[closing_id]': 22,
      }
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._downloadExcelTreasuryClosingErrorsSumaryList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/export-errors`, {
        responseType: 'blob',
        params: {
          paginate: 1,
          'filter[closing_id]': 22,
        },
      })
    })
  })
})
