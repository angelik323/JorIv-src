// Vue - pinia
import { executeApi } from '@/apis'
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import { IFundsThatParticipateInOtherInvestmentMovementsPayload } from '@/interfaces/customs/fics/FundsThatParticipateInOtherInvestmentFunds'

// Store
import { useFundsThatParticipateInOtherInvestmentFundsStoreV1 } from './funds-that-participate-in-other-investment-funds-v1'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'

const URL_PATH = `${URL_PATH_FICS}/fund-participations`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const mockShowAlert = jest.fn()
  const mockShowCatchError = jest.fn(() => 'Error message')
  const mockGetNameBlob = jest.fn(() => 'test_file.xlsx')
  const mockDownloadBlobXlxx = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: mockShowAlert }))
  const useShowError = jest.fn(() => ({ showCatchError: mockShowCatchError }))
  const useUtils = jest.fn(() => ({
    getNameBlob: mockGetNameBlob,
    downloadBlobXlxx: mockDownloadBlobXlxx,
  }))

  return {
    useAlert,
    useShowError,
    useUtils,
    mockShowAlert,
    mockShowCatchError,
    mockGetNameBlob,
    mockDownloadBlobXlxx,
  }
})

const { mockShowAlert } = jest.requireMock('@/composables')

describe('useFundsThatParticipateInOtherInvestmentFundsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getFundsThatParticipateInOtherInvestmentFundsList', () => {
    it('should fetch funds that participate in other investment funds list and update state on success', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockResponse = {
        data: {
          success: true,
          data: {
            origin_fund: {
              id: 20,
              name: 'FONDO DE PRUEBAS',
              business_trust: {
                id: 2,
                business_code: '9393',
                name: 'Proyecto testing',
              },
            },
            plans: {
              current_page: 1,
              last_page: 1,
              data: [
                {
                  id: 4,
                  code: 528,
                  collective_investment_fund_id: 14,
                  operation_office_id: 1,
                  user_created_id: 1,
                  status_id: 1,
                  created_at: '2025-08-11T20:54:16.000000Z',
                  updated_at: '2025-08-25T17:19:56.000000Z',
                  blocking_reason: null,
                  status_observation: 'test',
                  status: {
                    id: 1,
                    status: 'Activo',
                    comments: null,
                  },
                  collective_investment_fund: {
                    id: 14,
                    fund_code: 100,
                    fund_name: 'Prueba',
                    business_trust_id: 2,
                    consolidation_option_id: 1,
                    fic_rating: 'ABC',
                    has_participation_types: true,
                    is_fund_validated: true,
                    status_id: 1,
                    created_at: '2025-07-28 20:21',
                    updated_at: '2025-07-28 20:21',
                    fund_type_id: 1,
                    last_closing_date: null,
                  },
                },
              ],
            },
          },
          message: 'Listado obtenido exitosamente.',
          current_page: 1,
          last_page: 1,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const fundId = 4
      const filters = {
        paginate: 1,
      }

      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsList(
        fundId,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${fundId}`, {
        params: {
          paginate: 1,
        },
      })
      expect(
        store.funds_that_participate_in_other_investment_funds_list
      ).toEqual(mockResponse.data.data.plans.data)
      expect(store.fund_origin_info).toEqual(mockResponse.data.data.origin_fund)
    })

    it('should handle error when fetching funds that participate in other investment funds list', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const fundId = 4
      const filters = {
        paginate: 1,
      }
      const initialFundOrigin = JSON.parse(
        JSON.stringify(store.fund_origin_info)
      )

      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsList(
        fundId,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${fundId}`, {
        params: {
          paginate: 1,
        },
      })

      expect(
        store.funds_that_participate_in_other_investment_funds_list
      ).toEqual([])
      expect(store.fund_origin_info).toEqual(initialFundOrigin)
    })

    it('should handle response.data as undefined when fetching funds that participate in other investment funds list', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const fundId = 4
      const filters = {
        paginate: 1,
      }
      const initialFundOrigin = JSON.parse(
        JSON.stringify(store.fund_origin_info)
      )

      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsList(
        fundId,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${fundId}`, {
        params: {
          paginate: 1,
        },
      })

      expect(
        store.funds_that_participate_in_other_investment_funds_list
      ).toEqual([])
      expect(store.fund_origin_info).toEqual(initialFundOrigin)
    })

    it('should handle response.data as null when fetching funds that participate in other investment funds list', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const fundId = 4
      const filters = {
        paginate: 1,
      }
      const initialFundOrigin = JSON.parse(
        JSON.stringify(store.fund_origin_info)
      )

      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsList(
        fundId,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${fundId}`, {
        params: {
          paginate: 1,
        },
      })

      expect(
        store.funds_that_participate_in_other_investment_funds_list
      ).toEqual([])
      expect(store.fund_origin_info).toEqual(initialFundOrigin)
    })

    it('should handle success false response when fetching funds that participate in other investment funds list', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockResponse = {
        data: {
          success: false,
          data: {
            origin_fund: {
              id: 20,
              name: 'FONDO DE PRUEBAS',
              business_trust: {
                id: 2,
                business_code: '9393',
                name: 'Proyecto testing',
              },
            },
            plans: {
              current_page: 1,
              last_page: 1,
              data: [],
            },
          },
          message: 'Error en la operación.',
          current_page: 1,
          last_page: 1,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const fundId = 4
      const filters = {
        paginate: 1,
      }

      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsList(
        fundId,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${fundId}`, {
        params: {
          paginate: 1,
        },
      })
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error en la operación.',
        'error',
        undefined,
        expect.any(Number)
      )
    })
  })

  describe('_getFundsThatParticipateInOtherInvestmentFundsMovementsList', () => {
    it('should fetch funds that participate in other investment funds list and update state on success', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockResponse = {
        data: {
          data: {
            success: true,
            data: [
              {
                id: 1,
                code: '001',
                fund: {
                  id: 10,
                  code: '2222',
                  name: 'TEST 2',
                },
                plan: {
                  id: 5,
                  code: '003',
                },
                operationType: {
                  id: 1,
                  description: 'Aportes',
                },
                balance: 0,
                value: '134444.00',
                created_at: '2025-09-17 01:04:22',
              },
            ],
            message: 'Listado obtenido exitosamente.',
            current_page: 1,
            last_page: 1,
          },
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const payload = <IFundsThatParticipateInOtherInvestmentMovementsPayload>{
        'filter[fiduciary_investment_plan_id]': 2,
        'filter[from_date]': null,
        'filter[to_date]': null,
        sort: '-operation_date,-id',
      }
      const filters = {
        paginate: 1,
      }

      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsMovementsList(
        payload,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/movements`, {
        params: {
          'filter[fiduciary_investment_plan_id]': 2,
          'filter[from_date]': null,
          'filter[to_date]': null,
          paginate: 1,
          sort: '-operation_date,-id',
        },
      })
      expect(
        store.funds_that_participate_in_other_investment_funds_movements_list
      ).toEqual(mockResponse.data.data.data)
    })

    it('should handle error when fetching funds that participate in other investment funds list', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const payload = <IFundsThatParticipateInOtherInvestmentMovementsPayload>{
        'filter[fiduciary_investment_plan_id]': 2,
        'filter[from_date]': null,
        'filter[to_date]': null,
      }
      const filters = {
        paginate: 1,
        sort: '-operation_date,-id',
      }
      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsMovementsList(
        payload,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/movements`, {
        params: {
          'filter[fiduciary_investment_plan_id]': 2,
          'filter[from_date]': null,
          'filter[to_date]': null,
          paginate: 1,
          sort: '-operation_date,-id',
        },
      })

      expect(
        store.funds_that_participate_in_other_investment_funds_movements_list
      ).toEqual([])
    })

    it('should handle response.data as undefined when fetching funds that participate in other investment funds list', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const payload = <IFundsThatParticipateInOtherInvestmentMovementsPayload>{
        'filter[fiduciary_investment_plan_id]': 2,
        'filter[from_date]': null,
        'filter[to_date]': null,
      }
      const filters = {
        paginate: 1,
        sort: '-operation_date,-id',
      }
      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsMovementsList(
        payload,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/movements`, {
        params: {
          'filter[fiduciary_investment_plan_id]': 2,
          'filter[from_date]': null,
          'filter[to_date]': null,
          paginate: 1,
          sort: '-operation_date,-id',
        },
      })

      expect(
        store.funds_that_participate_in_other_investment_funds_movements_list
      ).toEqual([])
    })

    it('should handle response.data as null when fetching funds that participate in other investment funds list', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const payload = <IFundsThatParticipateInOtherInvestmentMovementsPayload>{
        'filter[fiduciary_investment_plan_id]': 2,
        'filter[from_date]': null,
        'filter[to_date]': null,
      }
      const filters = {
        paginate: 1,
        sort: '-operation_date,-id',
      }

      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsMovementsList(
        payload,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/movements`, {
        params: {
          'filter[fiduciary_investment_plan_id]': 2,
          'filter[from_date]': null,
          'filter[to_date]': null,
          paginate: 1,
          sort: '-operation_date,-id',
        },
      })

      expect(
        store.funds_that_participate_in_other_investment_funds_movements_list
      ).toEqual([])
    })

    it('should handle success false response when fetching funds that participate in other investment funds movements list', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockResponse = {
        data: {
          success: false,
          data: {
            data: [],
            current_page: 1,
            last_page: 1,
          },
          message: 'Error en la operación.',
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const payload = <IFundsThatParticipateInOtherInvestmentMovementsPayload>{
        'filter[fiduciary_investment_plan_id]': 2,
        'filter[from_date]': null,
        'filter[to_date]': null,
      }
      const filters = {
        paginate: 1,
        sort: '-operation_date,-id',
      }

      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsMovementsList(
        payload,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/movements`, {
        params: {
          'filter[fiduciary_investment_plan_id]': 2,
          'filter[from_date]': null,
          'filter[to_date]': null,
          paginate: 1,
          sort: '-operation_date,-id',
        },
      })
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error en la operación.',
        'error',
        undefined,
        expect.any(Number)
      )
    })

    it('should handle response with missing data properties using defaults', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockResponse = {
        data: {
          success: true,
          data: {},
          message: 'Operación exitosa.',
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const payload = <IFundsThatParticipateInOtherInvestmentMovementsPayload>{
        'filter[fiduciary_investment_plan_id]': 2,
        'filter[from_date]': null,
        'filter[to_date]': null,
      }
      const filters = {
        paginate: 1,
        sort: '-operation_date,-id',
      }

      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsMovementsList(
        payload,
        filters
      )

      // Assert
      expect(
        store.funds_that_participate_in_other_investment_funds_movements_list
      ).toEqual([])
      expect(
        store.funds_that_participate_in_other_investment_funds_movements_pages
      ).toEqual({
        currentPage: 0,
        lastPage: 0,
      })
    })

    it('should handle response with partial data properties using defaults', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [{ id: 1 }],
          },
          message: 'Operación exitosa.',
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      const payload = <IFundsThatParticipateInOtherInvestmentMovementsPayload>{
        'filter[fiduciary_investment_plan_id]': 2,
        'filter[from_date]': null,
        'filter[to_date]': null,
      }
      const filters = {
        paginate: 1,
        sort: '-operation_date,-id',
      }

      // Act
      await store._getFundsThatParticipateInOtherInvestmentFundsMovementsList(
        payload,
        filters
      )

      // Assert
      expect(
        store.funds_that_participate_in_other_investment_funds_movements_list
      ).toEqual([{ id: 1 }])
      expect(
        store.funds_that_participate_in_other_investment_funds_movements_pages
      ).toEqual({
        currentPage: 0,
        lastPage: 0,
      })
    })
  })

  describe('_downloadExcelFundsThatParticipateInOtherInvestmentFundsMovements', () => {
    const payload = <IFundsThatParticipateInOtherInvestmentMovementsPayload>{
      'filter[fiduciary_investment_plan_id]': 2,
      'filter[from_date]': null,
      'filter[to_date]': null,
    }
    it('fetches Excel data and triggers download', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()

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
        sort: '-operation_date,-id',
      }

      // Act
      await store._downloadExcelFundsThatParticipateInOtherInvestmentFundsMovements(
        payload,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/export`, {
        params: {
          'filter[fiduciary_investment_plan_id]': 2,
          'filter[from_date]': null,
          'filter[to_date]': null,
          paginate: 1,
          sort: '-operation_date,-id',
        },
        responseType: 'blob',
      })
    })

    it('handles error when fetching Excel data fails', async () => {
      // Arrange
      const store = useFundsThatParticipateInOtherInvestmentFundsStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const filters = {
        paginate: 1,
        sort: '-operation_date,-id',
      }

      // Act
      await store._downloadExcelFundsThatParticipateInOtherInvestmentFundsMovements(
        payload,
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/export`, {
        params: {
          'filter[fiduciary_investment_plan_id]': 2,
          'filter[from_date]': null,
          'filter[to_date]': null,
          paginate: 1,
          sort: '-operation_date,-id',
        },
        responseType: 'blob',
      })
    })
  })
})
