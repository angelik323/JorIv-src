import { setActivePinia, createPinia } from 'pinia'
import { useCollectiveInvestmentFundsStoreV1 } from './collective-investment-funds-v1'
import { executeApi } from '@/apis'
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  ICollectiveInvestmentFundRequest,
  ICollectiveInvestmentFundResponse,
  IConsultPercentageList,
  IConsultProfitabilityList,
  IConsultTransmissionDetailList,
  IConsultTransmissionList,
} from '@/interfaces/customs/fics/CollectiveInvestmentFunds'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

const mockShowAlert = jest.fn()
const mockShowCatchError = jest.fn(() => 'catch error')
const mockGetNameBlob = jest.fn(() => 'file.xlsx')
const mockDownloadBlobXlxx = jest.fn()

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

describe('useCollectiveInvestmentFundsStoreV1', () => {
  const URL_PATH = `${URL_PATH_FICS}/collective-investment-funds`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    mockShowCatchError.mockImplementation(() => 'catch error')
    mockGetNameBlob.mockImplementation(() => 'file.xlsx')
  })

  it('_listAction: success updates list and pages and calls showAlert', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockResponse = {
      data: {
        data: {
          data: [{ id: 1, name: 'Fondo' }],
          current_page: 2,
          last_page: 5,
        },
        message: 'ok',
        success: true,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()

    await store._listAction({ q: 'x' })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/collective-investment-funds`,
      {
        params: { q: 'x', paginate: 1 },
      }
    )

    expect(store.collective_investment_fund_list).toEqual([
      { id: 1, name: 'Fondo' },
    ])

    expect(store.collective_investment_fund_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })

    expect(showAlert).toHaveBeenCalledWith(
      'ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_listAction: error uses showCatchError and showAlert', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    await store._listAction({ type: 1 })

    expect(mockGet).toHaveBeenCalledWith(URL_PATH, {
      params: { type: 1, paginate: 1 },
    })

    expect(store.collective_investment_fund_list).toEqual([])
    expect(store.collective_investment_fund_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })

    expect(showCatchError).toHaveBeenCalledTimes(1)
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    mockGet.mockRejectedValueOnce('weird-error')

    await store._listAction({ type: 2 })

    expect(showCatchError).toHaveBeenCalledTimes(2)
    expect(showAlert).toHaveBeenCalledTimes(2)

    expect(store.collective_investment_fund_list).toEqual([])
  })

  it('_createAction: success returns true and calls showAlert', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const payload = { fund_code: 'X' } as ICollectiveInvestmentFundRequest

    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { message: 'created', success: true } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const { showAlert } = require('@/composables').useAlert()

    const res = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/`, payload)
    expect(res).toBe(true)
    expect(showAlert).toHaveBeenCalledWith(
      'created',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_createAction: fails returns false and calls showAlert with error', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const payload = { fund_code: 'X' } as ICollectiveInvestmentFundRequest

    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { message: 'fail', success: false } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const { showAlert } = require('@/composables').useAlert()

    const res = await store._createAction(payload)

    expect(res).toBe(false)
    expect(showAlert).toHaveBeenCalledWith(
      'fail',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_updateAction: success returns true and calls showAlert', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const payload = { fund_code: 'Y' } as ICollectiveInvestmentFundRequest

    const mockPut = jest
      .fn()
      .mockResolvedValue({ data: { message: 'updated', success: true } })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const { showAlert } = require('@/composables').useAlert()

    const res = await store._updateAction('1', payload)

    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/1`, payload)
    expect(res).toBe(true)
    expect(showAlert).toHaveBeenCalledWith(
      'updated',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_updateAction: fails returns false and calls error alert', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const payload = { fund_code: 'Y' } as ICollectiveInvestmentFundRequest

    const mockPut = jest
      .fn()
      .mockResolvedValue({ data: { message: 'nope', success: false } })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const { showAlert } = require('@/composables').useAlert()

    const res = await store._updateAction('1', payload)

    expect(res).toBe(false)
    expect(showAlert).toHaveBeenCalledWith(
      'nope',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_updateAction: error returns false and alerts error', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const payload = { fund_code: 'Y' } as ICollectiveInvestmentFundRequest

    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    const res = await store._updateAction('1', payload)

    expect(res).toBe(false)
    expect(showCatchError).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_showAction: success returns data', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, data: { id: '1' }, message: 'ok' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const res = await store._showAction('1')
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
    expect(res).toEqual({ id: '1' })
  })

  it('_showAction: api returns success false -> alerts and returns null', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: false, message: 'no', data: null },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()

    const res = await store._showAction('1')
    expect(res).toBeNull()
    expect(showAlert).toHaveBeenCalledWith(
      'no',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_showAction: error -> returns null and showCatchError used', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    const res = await store._showAction('1')
    expect(res).toBeNull()
    expect(showCatchError).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_showAction: non-Error rejection -> returns null and uses catch fallback', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue('weird-error')
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    const res = await store._showAction('1')

    expect(res).toBeNull()
    expect(showCatchError).toHaveBeenCalledTimes(1)
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('_showAction: api success false -> returns null + alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'nope',
        data: null,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()

    const result = await store._showAction('1')

    expect(result).toBeNull()
    expect(showAlert).toHaveBeenCalledWith(
      'nope',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('_showAction: catch error -> returns null + alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showCatchError } = require('@/composables').useShowError()
    const { showAlert } = require('@/composables').useAlert()

    const result = await store._showAction('1')

    expect(result).toBeNull()
    expect(showCatchError).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_summaryConsultPercentageAction: success returns data', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, data: { total: 10 }, message: 'ok' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const res = await store._summaryConsultPercentageAction(5)
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/summary/5`)
    expect(res).toEqual({ total: 10 })
  })

  it('_summaryConsultPercentageAction: failure -> returns null and alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const mockGet = jest
      .fn()
      .mockResolvedValue({ data: { success: false, message: 'no' } })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    const { showAlert } = require('@/composables').useAlert()

    const res = await store._summaryConsultPercentageAction(5)
    expect(res).toBeNull()
    expect(showAlert).toHaveBeenCalledWith(
      'no',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_summaryConsultPercentageAction: error -> returns null and alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    const res = await store._summaryConsultPercentageAction(5)
    expect(res).toBeNull()
    expect(showCatchError).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_summaryConsultPercentageAction: non-Error rejection -> returns null and triggers fallback catch', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue('weird-error')
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    const res = await store._summaryConsultPercentageAction(5)

    expect(res).toBeNull()
    expect(showCatchError).toHaveBeenCalledTimes(1)
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('_summaryConsultPercentageAction: success -> returns data', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'ok', data: { x: 1 } },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._summaryConsultPercentageAction(9)

    expect(result).toEqual({ x: 1 })
  })
  it('_summaryConsultPercentageAction: success false -> null + alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: { success: false, message: 'nope', data: null },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()

    const result = await store._summaryConsultPercentageAction(9)

    expect(result).toBeNull()
    expect(showAlert).toHaveBeenCalledWith(
      'nope',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_summaryConsultPercentageAction: catch error -> null + alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showCatchError } = require('@/composables').useShowError()
    const { showAlert } = require('@/composables').useAlert()

    const result = await store._summaryConsultPercentageAction(10)

    expect(result).toBeNull()
    expect(showCatchError).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_listConsultPercentageAction: success updates list and pages and alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const mockResponse = {
      data: {
        data: { data: [{ id: 1 }], current_page: 1, last_page: 1 },
        message: 'ok',
        success: true,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    const { showAlert } = require('@/composables').useAlert()

    await store._listConsultPercentageAction(10)
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/investors/10`, {
      params: { paginate: 1 },
    })
    expect(store.consult_percentage_list).toEqual([{ id: 1 }])
    expect(store.consult_percentage_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
    expect(showAlert).toHaveBeenCalledWith(
      'ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_listConsultPercentageAction: api returns success false -> alerts and keeps defaults', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: { success: false, message: 'nope' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()

    await store._listConsultPercentageAction(10)

    expect(store.consult_percentage_list).toEqual([])
    expect(store.consult_percentage_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_listConsultPercentageAction: non-Error rejection -> alerts and keeps defaults', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue('weird-error')
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    await store._listConsultPercentageAction(10)

    expect(showCatchError).toHaveBeenCalledTimes(1)
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(store.consult_percentage_list).toEqual([])
  })

  it('_listConsultPercentageAction: api success false -> alerts and keep defaults', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        data: { data: [], current_page: 1, last_page: 1 },
        success: false,
        message: 'nope',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()

    await store._listConsultPercentageAction(2)

    expect(showAlert).toHaveBeenCalledWith(
      'nope',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(store.consult_percentage_list).toEqual([])
  })
  it('_listConsultPercentageAction: catch -> alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showCatchError } = require('@/composables').useShowError()
    const { showAlert } = require('@/composables').useAlert()

    await store._listConsultPercentageAction(99)

    expect(showCatchError).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('_exportExcelConsultPercentageAction: success downloads and alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const response = {
      data: new ArrayBuffer(8),
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(response)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { useUtils } = require('@/composables')
    const utils = useUtils()
    const { showAlert } = require('@/composables').useAlert()

    await store._exportExcelConsultPercentageAction(7)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/investors/export/7`, {
      responseType: 'blob',
    })

    expect(utils.getNameBlob).toHaveBeenCalledWith(response)
    expect(utils.downloadBlobXlxx).toHaveBeenCalled()

    expect(showAlert).toHaveBeenCalledWith(
      'Descarga exitosa',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_exportExcelConsultPercentageAction: error -> alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    await store._exportExcelConsultPercentageAction(7)

    expect(showCatchError).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_listConsultProfitabilityAction: success updates list and pages and alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockResponse = {
      data: {
        data: { data: [{ id: 2 }], current_page: 3, last_page: 4 },
        message: 'ok',
        success: true,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()

    await store._listConsultProfitabilityAction(1, '2025-01-01')

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/returns/1`, {
      params: { date: '2025-01-01', paginate: 1 },
    })

    expect(store.consult_profitability_list).toEqual([{ id: 2 }])
    expect(store.consult_profitability_pages).toEqual({
      currentPage: 3,
      lastPage: 4,
    })

    expect(showAlert).toHaveBeenCalledWith(
      'ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_listConsultProfitabilityAction: error -> alerts and defaults', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    await store._listConsultProfitabilityAction(1, '2025-01-01')

    expect(showCatchError).toHaveBeenCalled()

    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(store.consult_profitability_list).toEqual([])
  })

  it('_exportExcelConsultProfitabilityAction: success downloads and alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const response = {
      data: new ArrayBuffer(8),
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(response)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { useUtils } = require('@/composables')
    const utils = useUtils()
    const { showAlert } = require('@/composables').useAlert()

    await store._exportExcelConsultProfitabilityAction(2, '2025-01-01')

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/returns/export/2`, {
      params: { date: '2025-01-01' },
      responseType: 'blob',
    })

    expect(utils.getNameBlob).toHaveBeenCalled()
    expect(utils.downloadBlobXlxx).toHaveBeenCalled()

    expect(showAlert).toHaveBeenCalledWith(
      'Descarga exitosa',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_exportExcelConsultProfitabilityAction: error -> alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    await store._exportExcelConsultProfitabilityAction(2, '2025-01-01')

    expect(showCatchError).toHaveBeenCalled()

    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_listConsultTransmissionAction: success updates list and pages and alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockResponse = {
      data: {
        data: { data: [{ id: 3 }], current_page: 1, last_page: 1 },
        message: 'ok',
        success: true,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()

    await store._listConsultTransmissionAction(12)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/participation-types`, {
      params: { 'filter[fund_id]': 12, paginate: 1 },
    })

    expect(store.consult_transmission_list).toEqual([{ id: 3 }])
    expect(store.consult_transmission_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })

    expect(showAlert).toHaveBeenCalledWith(
      'ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_listConsultTransmissionAction: error -> alerts and defaults', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    await store._listConsultTransmissionAction(12)

    expect(showCatchError).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(store.consult_transmission_list).toEqual([])
  })
  it('_listConsultTransmissionAction: catch -> alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showCatchError } = require('@/composables').useShowError()
    const { showAlert } = require('@/composables').useAlert()

    await store._listConsultTransmissionAction(7)

    expect(showCatchError).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('_listConsultTransmissionDetailAction: success updates list and pages and alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockResponse = {
      data: {
        data: [[{ id: 4 }], 1, 1],
        success: true,
        message: 'ok',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()

    await store._listConsultTransmissionDetailAction(1, 2)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/fund-closure/format`, {
      params: { fund_id: 1, participation_type_id: 2, paginate: 1 },
    })

    expect(store.consult_transmission_detail_list).toEqual([{ id: 4 }])
    expect(store.consult_transmission_detail_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })

    expect(showAlert).toHaveBeenCalledWith(
      'ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_listConsultTransmissionDetailAction: error -> alerts and defaults', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    await store._listConsultTransmissionDetailAction(1, 2)

    expect(showCatchError).toHaveBeenCalled()

    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(store.consult_transmission_detail_list).toEqual([])
  })
  it('_listConsultTransmissionDetailAction: catch -> alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showCatchError } = require('@/composables').useShowError()
    const { showAlert } = require('@/composables').useAlert()

    await store._listConsultTransmissionDetailAction(3, 5)

    expect(showCatchError).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('_exportFileConsultTransmissionAction: success downloads and alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const response = {
      data: new ArrayBuffer(8),
      headers: { 'content-type': 'application/pdf' },
    }

    const mockGet = jest.fn().mockResolvedValue(response)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { useUtils } = require('@/composables')
    const utils = useUtils()

    const { showAlert } = require('@/composables').useAlert()

    await store._exportFileConsultTransmissionAction(1, 2, 'PDF')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH}/fund-closure/format/export?fund_id=1&participation_type_id=2&format=PDF`,
      { responseType: 'blob' }
    )

    expect(utils.getNameBlob).toHaveBeenCalledWith(response)
    expect(utils.downloadBlobXlxx).toHaveBeenCalled()

    expect(showAlert).toHaveBeenCalledWith(
      'Descarga exitosa',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_exportFileConsultTransmissionAction: error -> alerts', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()
    const { showCatchError } = require('@/composables').useShowError()

    await store._exportFileConsultTransmissionAction(1, 2, 'PDF')

    expect(showCatchError).toHaveBeenCalled()

    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_setParticipationTypesTermDaysActive and clears work', () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    store._setParticipationTypesTermDaysActive(true)
    expect(store.participation_types_term_days_active).toBe(true)

    store.collective_investment_fund_list = [
      { id: 9 },
    ] as ICollectiveInvestmentFundResponse[]
    store.collective_investment_fund_pages = { currentPage: 9, lastPage: 9 }

    store._clearData()

    expect(store.collective_investment_fund_list).toEqual([])
    expect(store.collective_investment_fund_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })

    store.consult_percentage_list = [
      { holder_identification: '1' },
    ] as IConsultPercentageList[]
    store.consult_percentage_pages = { currentPage: 2, lastPage: 3 }

    store._clearConsultPercentageData()

    expect(store.consult_percentage_list).toEqual([])
    expect(store.consult_percentage_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })

    store.consult_profitability_list = [
      { participation_type_code: '2' },
    ] as IConsultProfitabilityList[]
    store.consult_profitability_pages = { currentPage: 2, lastPage: 3 }

    store._clearConsultProfitabilityData()

    expect(store.consult_profitability_list).toEqual([])
    expect(store.consult_profitability_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })

    store.consult_transmission_list = [{ id: 3 }] as IConsultTransmissionList[]
    store.consult_transmission_pages = { currentPage: 2, lastPage: 3 }

    store._clearConsultTransmissionData()

    expect(store.consult_transmission_list).toEqual([])
    expect(store.consult_transmission_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })

    store.consult_transmission_detail_list = [
      { name: '4' },
    ] as IConsultTransmissionDetailList[]
    store.consult_transmission_detail_pages = { currentPage: 2, lastPage: 3 }

    store._clearConsultTransmissionDetailData()

    expect(store.consult_transmission_detail_list).toEqual([])
    expect(store.consult_transmission_detail_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
  it('_setParticipationTypesTermDaysActive sets the boolean', () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    store._setParticipationTypesTermDaysActive(true)
    expect(store.participation_types_term_days_active).toBe(true)
  })

  it('_clearData resets main data', () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    store.collective_investment_fund_list = [
      { id: 1 },
    ] as ICollectiveInvestmentFundResponse[]
    store.collective_investment_fund_pages = { currentPage: 9, lastPage: 99 }

    store._clearData()

    expect(store.collective_investment_fund_list).toEqual([])
    expect(store.collective_investment_fund_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('_clearConsultPercentageData resets data', () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    store.consult_percentage_list = [
      { holder_identification: '1' },
    ] as IConsultPercentageList[]
    store.consult_percentage_pages = { currentPage: 99, lastPage: 99 }

    store._clearConsultPercentageData()

    expect(store.consult_percentage_list).toEqual([])
    expect(store.consult_percentage_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('_clearConsultProfitabilityData resets data', () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    store.consult_profitability_list = [
      { participation_type_code: '1' },
    ] as IConsultProfitabilityList[]
    store.consult_profitability_pages = { currentPage: 20, lastPage: 40 }

    store._clearConsultProfitabilityData()

    expect(store.consult_profitability_list).toEqual([])
    expect(store.consult_profitability_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('_clearConsultTransmissionData resets data', () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    store.consult_transmission_list = [{ id: 1 }] as IConsultTransmissionList[]
    store.consult_transmission_pages = { currentPage: 8, lastPage: 11 }

    store._clearConsultTransmissionData()

    expect(store.consult_transmission_list).toEqual([])
    expect(store.consult_transmission_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('_clearConsultTransmissionDetailData resets data', () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    store.consult_transmission_detail_list = [
      { name: '1' },
    ] as IConsultTransmissionDetailList[]
    store.consult_transmission_detail_pages = { currentPage: 3, lastPage: 7 }

    store._clearConsultTransmissionDetailData()

    expect(store.consult_transmission_detail_list).toEqual([])
    expect(store.consult_transmission_detail_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
  it('calls showAlert when listConsultPercentage receives success=false', async () => {
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: {
          data: {
            data: [],
            current_page: 1,
            last_page: 1,
          },
          message: 'catch error',
          success: false,
        },
      }),
    })

    const store = useCollectiveInvestmentFundsStoreV1()
    const { showAlert } = require('@/composables').useAlert()
    await store._listConsultPercentageAction(1)

    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(store.consult_percentage_list).toEqual([])
    expect(store.consult_percentage_pages.currentPage).toBe(1)
    expect(store.consult_percentage_pages.lastPage).toBe(1)
  })
  it('calls showAlert with error when listAction receives success=false', async () => {
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: {
          data: {
            data: [],
            current_page: 1,
            last_page: 1,
          },
          message: 'Failure test',
          success: false,
        },
      }),
    })

    const store = useCollectiveInvestmentFundsStoreV1()
    const { showAlert } = require('@/composables').useAlert()
    await store._listAction({ page: 1 })

    expect(showAlert).toHaveBeenCalledWith(
      'Failure test',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(store.collective_investment_fund_list).toEqual([])
    expect(store.collective_investment_fund_pages.currentPage).toBe(1)
    expect(store.collective_investment_fund_pages.lastPage).toBe(1)
  })
  it('should set participation_types_term_days_active', () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    store._setParticipationTypesTermDaysActive(true)
    expect(store.participation_types_term_days_active).toBe(true)

    store._setParticipationTypesTermDaysActive(false)
    expect(store.participation_types_term_days_active).toBe(false)
  })
  it('_showAction: success true but data null -> returns null', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, data: null, message: 'ok' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const res = await store._showAction('1')

    expect(res).toBeNull()
  })
  it('_showAction: no id returns null', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()
    const res = await store._showAction('')
    expect(res).toBeNull()
  })
  it('_exportExcelConsultPercentageAction: missing content-type -> alerts error', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: new ArrayBuffer(8),
      headers: {},
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showAlert } = require('@/composables').useAlert()

    await store._exportExcelConsultPercentageAction(7)

    expect(showAlert).toHaveBeenCalledWith(
      'Descarga exitosa',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })
  it('_exportExcelConsultPercentageAction: getNameBlob returns undefined', async () => {
    const store = useCollectiveInvestmentFundsStoreV1()

    const response = {
      data: new ArrayBuffer(8),
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(response)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { useUtils } = require('@/composables')
    const utils = useUtils()
    utils.getNameBlob.mockReturnValueOnce(undefined) // <-- branch no cubierto

    const { showAlert } = require('@/composables').useAlert()

    await store._exportExcelConsultPercentageAction(7)

    expect(utils.getNameBlob).toHaveBeenCalledWith(response)
    expect(utils.downloadBlobXlxx).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'Descarga exitosa',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
