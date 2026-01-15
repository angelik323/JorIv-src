// Vue - pinia
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import {
  IGenericInvestmentPlansLegalizationExportDetails,
  IGenericInvestmentPlansLegalizeContribution,
  IGenericInvestmentPlansLegalizeLegalization,
  IGenericInvestmentPlansLegalizeFormData,
  IGenericInvestmentPlans,
} from '@/interfaces/customs/fics/GenericInvestmentPlans'

// Utils
import { executeApi } from '@/apis'

// Constants
import { useGenericInvestmentPlansStoreV1 } from './generic-investment-plans-v1'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlert = jest.fn()
  const showCatchError = jest.fn()
  const getNameBlob = jest.fn()
  const downloadBlobXlxx = jest.fn()

  return {
    __esModule: true,
    useAlert: jest.fn(() => ({ showAlert })),
    useShowError: jest.fn(() => ({ showCatchError })),
    useUtils: jest.fn(() => ({ getNameBlob, downloadBlobXlxx })),
    __mocks: {
      showAlert,
      showCatchError,
      getNameBlob,
      downloadBlobXlxx,
    },
  }
})

describe('useGenericInvestmentPlansStoreV1', () => {
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    const composables = require('@/composables')
    if (composables.__mocks) {
      showAlertMock = composables.__mocks.showAlert
      showCatchErrorMock = composables.__mocks.showCatchError
    } else {
      showAlertMock = composables.useAlert().showAlert
      showCatchErrorMock = composables.useShowError().showCatchError
    }

    showCatchErrorMock.mockReturnValue('catch error')
  })

  describe('_listAction', () => {
    it('fetches list and sets state on success', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockResponse = {
        data: {
          data: { data: [{ id: 1 }], current_page: 2, last_page: 5 },
          message: 'List fetched',
          success: true,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listAction({ q: 'x' })

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_FICS}/generic-investment-plans`,
        {
          params: { q: 'x', paginate: 1 },
        }
      )
      expect(store.generic_investment_list).toEqual([{ id: 1 }])
      expect(store.generic_investment_pages).toEqual({
        currentPage: 2,
        lastPage: 5,
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'List fetched',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })
    it('treats non-boolean success as success branch', async () => {
      const store = useGenericInvestmentPlansStoreV1()

      const mockResponse = {
        data: {
          data: { data: [], current_page: 1, last_page: 1 },
          message: 'weird success',
          success: 'yes',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listAction({})

      expect(showAlertMock).toHaveBeenCalledWith(
        'weird success',
        'success', // porque 'yes' evalúa truthy
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('shows error alert when success is false', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockResponse = {
        data: {
          data: { data: [], current_page: 0, last_page: 0 },
          message: 'Err',
          success: false,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listAction({})

      expect(store.generic_investment_list).toEqual([])
      expect(store.generic_investment_pages.currentPage).toBe(0)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Err',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles request error (catch) and keeps defaults', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('network'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listAction({})

      expect(mockGet).toHaveBeenCalled()
      expect(showCatchErrorMock).toHaveBeenCalled()
      expect(showAlertMock).toHaveBeenCalledWith(
        'catch error',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(store.generic_investment_list).toEqual([])
      expect(store.generic_investment_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })

    it('uses default values when response.data.data is incomplete', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockResponse = {
        data: {
          // missing data fields
          data: {},
          message: 'OK',
          success: true,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listAction({})

      expect(store.generic_investment_list).toEqual([])
      expect(store.generic_investment_pages.currentPage).toBe(0)
      expect(store.generic_investment_pages.lastPage).toBe(0)
    })

    it('handles missing success and treats it as error', async () => {
      const store = useGenericInvestmentPlansStoreV1()

      const mockResponse = {
        data: {
          data: { data: [], current_page: 1, last_page: 1 },
          message: 'No success',
          // success is missing
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listAction({})

      expect(showAlertMock).toHaveBeenCalledWith(
        'No success',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_createAction', () => {
    it('creates record and returns true on success', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const payload = { id: 1 } as IGenericInvestmentPlans
      const mockPost = jest
        .fn()
        .mockResolvedValue({ data: { success: true, message: 'Created' } })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const res = await store._createAction(payload)

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_FICS}/generic-investment-plans`,
        payload
      )
      expect(res).toBe(true)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Created',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('returns false when API returns success false', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const payload = { id: 1 } as IGenericInvestmentPlans
      const mockPost = jest
        .fn()
        .mockResolvedValue({ data: { success: false, message: 'Failed' } })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const res = await store._createAction(payload)

      expect(res).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Failed',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles error in post and returns false', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const payload = { id: 1 } as IGenericInvestmentPlans
      const mockPost = jest.fn().mockRejectedValue(new Error('boom'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const res = await store._createAction(payload)

      expect(res).toBe(false)
      expect(showCatchErrorMock).toHaveBeenCalled()
      expect(showAlertMock).toHaveBeenCalledWith(
        'catch error',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_showGenericPlanById', () => {
    it('treats truthy non-boolean success as success', async () => {
      const store = useGenericInvestmentPlansStoreV1()

      const mockResponse = {
        data: { success: 1, data: { id: 9 }, message: 'ok' },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const res = await store._showGenericPlanById('9')

      expect(res).toEqual({ id: 9 })
    })

    it('returns data when success true', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockResponse = {
        data: { success: true, data: { id: '1' }, message: 'ok' },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const res = await store._showGenericPlanById('1')
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_FICS}/investment-resource-legalization/1`
      )
      expect(res).toEqual({ id: '1' })
      expect(showAlertMock).toHaveBeenCalledWith(
        'ok',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('shows alert and returns null when success false', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockResponse = {
        data: { success: false, data: null, message: 'no' },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const res = await store._showGenericPlanById('1')
      expect(res).toBeNull()
      expect(showAlertMock).toHaveBeenCalledWith(
        'no',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles catch and returns null', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('err'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const res = await store._showGenericPlanById('1')
      expect(res).toBeNull()
      expect(showAlertMock).toHaveBeenCalledWith(
        'catch error',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles missing success field and returns null via alert path', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockResponse = { data: { data: null, message: 'no success field' } }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const res = await store._showGenericPlanById('1')
      expect(res).toBeNull()
      expect(showAlertMock).toHaveBeenCalledWith(
        'no success field',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_listGenericPlanUnidentifiedContributionsById', () => {
    it('handles missing success as error (unidentified list)', async () => {
      const store = useGenericInvestmentPlansStoreV1()

      const mockResponse = {
        data: {
          data: { data: [], current_page: 0, last_page: 0 },
          message: 'no success',
          // success missing
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listGenericPlanUnidentifiedContributionsById('1')

      expect(showAlertMock).toHaveBeenCalledWith(
        'no success',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('fetches list and sets pages on success', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockResponse = {
        data: {
          data: { data: [{ id: 5 }], current_page: 3, last_page: 4 },
          message: 'ok',
          success: true,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listGenericPlanUnidentifiedContributionsById('1')

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_FICS}/investment-resource-legalization/1/contributions`,
        { params: { paginate: true } }
      )
      expect(
        store.generic_investment_plan_unidentified_contributions_list
      ).toEqual([{ id: 5 }])
      expect(
        store.generic_investment_plan_unidentified_contributions_pages
      ).toEqual({
        currentPage: 3,
        lastPage: 4,
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'ok',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles API error (catch) and shows alert', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('err'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listGenericPlanUnidentifiedContributionsById('1')
      expect(showCatchErrorMock).toHaveBeenCalled()
      expect(showAlertMock).toHaveBeenCalledWith(
        'catch error',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(
        store.generic_investment_plan_unidentified_contributions_list
      ).toEqual([])
      expect(
        store.generic_investment_plan_unidentified_contributions_pages
      ).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })
  })

  describe('_createInvestmentPlansLegalization', () => {
    it('returns true when API success true', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockPost = jest
        .fn()
        .mockResolvedValue({ data: { success: true, message: 'ok' } })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const res = await store._createInvestmentPlansLegalization(1, {
        operation_investment_plan_id: 1,
      } as IGenericInvestmentPlansLegalizeFormData)
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_FICS}/investment-resource-legalization/legalize/1`,
        { operation_investment_plan_id: 1 }
      )
      expect(res).toBe(true)
      expect(showAlertMock).toHaveBeenCalledWith(
        'ok',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('returns false when API success false or undefined', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockPost = jest
        .fn()
        .mockResolvedValue({ data: { success: false, message: 'no' } })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const res = await store._createInvestmentPlansLegalization(1, {
        operation_investment_plan_id: 1,
      } as IGenericInvestmentPlansLegalizeFormData)
      expect(res).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'no',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles catch and returns false', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockPost = jest.fn().mockRejectedValue(new Error('err'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const res = await store._createInvestmentPlansLegalization(1, {
        operation_investment_plan_id: 1,
      } as IGenericInvestmentPlansLegalizeFormData)
      expect(res).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'catch error',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('returns false when success is null', async () => {
      const store = useGenericInvestmentPlansStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: { success: null, message: 'null-case' },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const res = await store._createInvestmentPlansLegalization(
        1,
        {} as IGenericInvestmentPlansLegalizeFormData
      )

      expect(res).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'null-case',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_cancelInvestmentPlansLegalization', () => {
    it('returns true when success true', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockPut = jest
        .fn()
        .mockResolvedValue({ data: { success: true, message: 'ok' } })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const res = await store._cancelInvestmentPlansLegalization(10)
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH_FICS}/investment-resource-legalization/annul-legalization/10`
      )
      expect(res).toBe(true)
      expect(showAlertMock).toHaveBeenCalledWith(
        'ok',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('returns false when success false', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockPut = jest
        .fn()
        .mockResolvedValue({ data: { success: false, message: 'no' } })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const res = await store._cancelInvestmentPlansLegalization(10)
      expect(res).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'no',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles catch and returns false', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockPut = jest.fn().mockRejectedValue(new Error('err'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const res = await store._cancelInvestmentPlansLegalization(10)
      expect(res).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'catch error',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('returns false when success is null in cancel', async () => {
      const store = useGenericInvestmentPlansStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: { success: null, message: 'null-cancel' },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const res = await store._cancelInvestmentPlansLegalization(10)

      expect(res).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'null-cancel',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_listGenericPlanLegalizations', () => {
    it('shows error alert when success is false in list legalizations', async () => {
      const store = useGenericInvestmentPlansStoreV1()

      const mockResponse = {
        data: {
          data: { data: [], current_page: 9, last_page: 9 },
          message: 'failed!',
          success: false,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listGenericPlanLegalizations(5, {})

      expect(showAlertMock).toHaveBeenCalledWith(
        'failed!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(
        store.generic_investment_plan_legalizations_pages.currentPage
      ).toBe(9)
    })

    it('fetches legalizations and returns showAlert result when success', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockResponse = {
        data: {
          data: { data: [{ id: 2 }], current_page: 1, last_page: 2 },
          message: 'ok',
          success: true,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const res = await store._listGenericPlanLegalizations(5, { filter: 'x' })
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_FICS}/investment-resource-legalization/5/legalizations`,
        { params: { filter: 'x', paginate: true } }
      )
      expect(store.generic_investment_plan_legalizations_list).toEqual([
        { id: 2 },
      ])
      expect(store.generic_investment_plan_legalizations_pages).toEqual({
        currentPage: 1,
        lastPage: 2,
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'ok',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
      expect(res).toBeUndefined()
    })

    it('handles catch and returns false', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('err'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const res = await store._listGenericPlanLegalizations(5, {})
      expect(res).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'catch error',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('treats missing success as error in list legalizations', async () => {
      const store = useGenericInvestmentPlansStoreV1()

      const mockResponse = {
        data: {
          data: { data: [], current_page: 0, last_page: 0 },
          message: 'no success',
          // success missing
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listGenericPlanLegalizations(1, {})

      expect(showAlertMock).toHaveBeenCalledWith(
        'no success',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_listGenericPlanLegalizationExport', () => {
    it('fetches export items and sets state on success', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockResponse = {
        data: {
          data: { data: [{ id: 9 }], current_page: 7, last_page: 9 },
          message: 'ok',
          success: true,
        },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listGenericPlanLegalizationExport(3, { p: 1 })

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_FICS}/investment-resource-legalization/3/legalizations-to-export`,
        { params: { p: 1, paginate: true } }
      )
      expect(store.generic_investment_plan_legalization_export_list).toEqual([
        { id: 9 },
      ])
      expect(store.generic_investment_plan_legalization_export_pages).toEqual({
        currentPage: 7,
        lastPage: 9,
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'ok',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles catch and shows alert', async () => {
      const store = useGenericInvestmentPlansStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('err'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listGenericPlanLegalizationExport(3, {})
      expect(showCatchErrorMock).toHaveBeenCalled()
      expect(showAlertMock).toHaveBeenCalledWith(
        'catch error',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('handles missing success in export list', async () => {
      const store = useGenericInvestmentPlansStoreV1()

      const mockResponse = {
        data: {
          data: { data: [], current_page: 0, last_page: 0 },
          message: 'missing',
          // no success
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._listGenericPlanLegalizationExport(3, {})

      expect(showAlertMock).toHaveBeenCalledWith(
        'missing',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_downloadLegalizationList error', () => {
    let store: ReturnType<typeof useGenericInvestmentPlansStoreV1>
    let postMock: jest.Mock
    let showAlertMock: jest.Mock
    let showCatchErrorMock: jest.Mock

    beforeEach(() => {
      setActivePinia(createPinia())
      store = useGenericInvestmentPlansStoreV1()

      const composables = require('@/composables')
      showAlertMock = composables.__mocks.showAlert
      showCatchErrorMock = composables.__mocks.showCatchError

      postMock = jest.fn().mockRejectedValue({
        response: {
          data: new Blob([JSON.stringify({ message: 'json error' })], {
            type: 'application/json',
          }),
          headers: { 'content-type': 'application/json' },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({
        post: postMock,
      })
    })
    it('downloads with filename when getNameBlob returns a value', async () => {
      const store = useGenericInvestmentPlansStoreV1()

      const composables = require('@/composables')
      composables.__mocks.getNameBlob.mockReturnValue('file.xlsx')

      const mockPost = jest.fn().mockResolvedValue({
        data: new Blob(['123']),
        headers: { 'content-type': 'application/vnd.ms-excel' },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      await store._downloadLegalizationList(1, {})

      expect(composables.__mocks.downloadBlobXlxx).toHaveBeenCalledWith(
        expect.any(Blob),
        'file.xlsx'
      )
    })

    it('calls download even if getNameBlob returns undefined', async () => {
      const store = useGenericInvestmentPlansStoreV1()

      const composables = require('@/composables')
      composables.__mocks.getNameBlob.mockReturnValue(undefined)

      const postMock = jest.fn().mockResolvedValue({
        data: new Blob(['xx']),
        headers: { 'content-type': 'application/vnd.ms-excel' },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ post: postMock })

      await store._downloadLegalizationList(1, {})

      expect(composables.__mocks.downloadBlobXlxx).toHaveBeenCalled()
    })

    it('handles error blob and shows parsed message', async () => {
      showCatchErrorMock.mockReturnValue('catch message')

      await store._downloadLegalizationList(9, {})

      expect(postMock).toHaveBeenCalled()

      // captura de error
      expect(showCatchErrorMock).toHaveBeenCalled()
      expect(showAlertMock).toHaveBeenCalledWith(
        'catch message',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('clear helpers', () => {
    it('_clearGenericPlanLegalizations does not fail when state already default', () => {
      const store = useGenericInvestmentPlansStoreV1()

      store.generic_investment_plan_legalizations_list = []
      store.generic_investment_plan_legalizations_pages = {
        currentPage: 1,
        lastPage: 1,
      }

      store._clearGenericPlanLegalizations()

      expect(store.generic_investment_plan_legalizations_list).toEqual([])
    })
    it('_clearGenericPlanUnidentifedContributions resets state', () => {
      const store = useGenericInvestmentPlansStoreV1()
      store.generic_investment_plan_unidentified_contributions_list = [
        { id: 1 },
      ] as IGenericInvestmentPlansLegalizeContribution[]
      store.generic_investment_plan_unidentified_contributions_pages = {
        currentPage: 3,
        lastPage: 4,
      }

      store._clearGenericPlanUnidentifedContributions()

      expect(
        store.generic_investment_plan_unidentified_contributions_list
      ).toEqual([])
      expect(
        store.generic_investment_plan_unidentified_contributions_pages
      ).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })

    it('_clearGenericPlanLegalizations resets state', () => {
      const store = useGenericInvestmentPlansStoreV1()
      store.generic_investment_plan_legalizations_list = [
        { id: 1 },
      ] as IGenericInvestmentPlansLegalizeLegalization[]
      store.generic_investment_plan_legalizations_pages = {
        currentPage: 5,
        lastPage: 8,
      }

      store._clearGenericPlanLegalizations()

      expect(store.generic_investment_plan_legalizations_list).toEqual([])
      expect(store.generic_investment_plan_legalizations_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })

    it('_clearGenericPlanLegalizationsExport resets state', () => {
      const store = useGenericInvestmentPlansStoreV1()
      store.generic_investment_plan_legalization_export_list = [
        { id: 1 },
      ] as IGenericInvestmentPlansLegalizationExportDetails[]
      store.generic_investment_plan_legalization_export_pages = {
        currentPage: 5,
        lastPage: 8,
      }

      store._clearGenericPlanLegalizationsExport()

      expect(store.generic_investment_plan_legalization_export_list).toEqual([])
      expect(store.generic_investment_plan_legalization_export_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })

    it('_clearData resets generic list and pages', () => {
      const store = useGenericInvestmentPlansStoreV1()
      store.generic_investment_list = [{ id: 1 }] as IGenericInvestmentPlans[]
      store.generic_investment_pages = { currentPage: 9, lastPage: 10 }

      store._clearData()

      expect(store.generic_investment_list).toEqual([])
      expect(store.generic_investment_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })
  })
})
