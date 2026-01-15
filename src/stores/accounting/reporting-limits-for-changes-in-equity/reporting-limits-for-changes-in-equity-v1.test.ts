import { setActivePinia, createPinia } from 'pinia'
import { useReportingLimitsForChangesInEquityStoreV1 } from './reporting-limits-for-changes-in-equity-v1'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import {
  IEquityChangeReportLimitsResponse,
  IReportingLimitChangesInEquityCreatePayload,
  IReportingLimitsUpdatePayload,
  IEquityChangeReportLimit,
} from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(),
}))

jest.mock('@/composables', () => {
  const showAlert = jest.fn()
  const showCatchError = jest.fn().mockReturnValue('Ups')
  return {
    useAlert: () => ({ showAlert }),
    useShowError: () => ({ showCatchError }),
  }
})

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTING}/equity-change-report-limits`

describe('useReportingLimitsForChangesInEquityStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_createEquityChangeReportLimit', () => {
    const mockPayload: IReportingLimitChangesInEquityCreatePayload = {
      accounting_structure_id: 1,
      limit: [{ from_account: '111', to_account: '222', limit_type: 'MAX' }],
    }

    it('Returns true and displays alert on success', async () => {
      const apiResponse = { data: { success: true, message: 'Creado' } }

      ;(executeApi as jest.Mock).mockReturnValue({
        post: jest.fn().mockResolvedValue(apiResponse),
      })

      const store = useReportingLimitsForChangesInEquityStoreV1()
      const result = await store._createEquityChangeReportLimit(mockPayload)

      expect(result).toBe(true)
      expect(executeApi().post).toHaveBeenCalledWith(
        `${URL_PATH}/store`,
        mockPayload
      )
      expect(showAlert).toHaveBeenCalledWith(
        'Creado',
        'success',
        undefined,
        3000
      )
    })

    it('returns false on controlled error', async () => {
      const apiResponse = { data: { success: false, message: 'Error' } }

      ;(executeApi as jest.Mock).mockReturnValue({
        post: jest.fn().mockResolvedValue(apiResponse),
      })

      const store = useReportingLimitsForChangesInEquityStoreV1()
      const result = await store._createEquityChangeReportLimit(mockPayload)

      expect(result).toBe(false)
      expect(showAlert).toHaveBeenCalledWith('Error', 'error', undefined, 3000)
    })

    it('handles exception and returns false', async () => {
      const error = new Error('Falla')
      ;(executeApi as jest.Mock).mockReturnValue({
        post: jest.fn().mockRejectedValue(error),
      })

      const store = useReportingLimitsForChangesInEquityStoreV1()
      const result = await store._createEquityChangeReportLimit(mockPayload)

      expect(result).toBe(false)
      expect(showCatchError).toHaveBeenCalledWith(error)
      expect(showAlert).toHaveBeenCalledWith('Ups', 'error', undefined, 3000)
    })
  })

  describe('_getListReportingLimits', () => {
    it('update list and pages in success', async () => {
      const mockData: IEquityChangeReportLimit = {
        id: 1,
        business_trust: 'BT',
        account_structure: 'AS',
        from_account: '111',
        to_account: '222',
        limit_type: 'MAX',
        business_trust_id: 2,
      }

      const mockResponse: { data: IEquityChangeReportLimitsResponse } = {
        data: {
          success: true,
          message: 'Lista cargada',
          data: {
            current_page: 1,
            last_page: 2,
            total: 10,
            first_page_url: '',
            from: 1,
            last_page_url: '',
            links: [],
            next_page_url: null,
            path: '',
            per_page: 10,
            prev_page_url: null,
            to: 1,
            data: [mockData],
          },
        },
      }

      ;(executeApi as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      })

      const store = useReportingLimitsForChangesInEquityStoreV1()
      await store._getListReportingLimits('?test=1')

      expect(store.limits_list).toEqual([mockData])
      expect(store.limits_pages).toEqual({
        currentPage: 1,
        lastPage: 2,
        total: 10,
      })
      expect(showAlert).toHaveBeenCalledWith(
        'Lista cargada',
        'success',
        undefined,
        3000
      )
    })

    it('handle API error', async () => {
      const error = new Error('Falla')
      ;(executeApi as jest.Mock).mockReturnValue({
        get: jest.fn().mockRejectedValue(error),
      })

      const store = useReportingLimitsForChangesInEquityStoreV1()
      await store._getListReportingLimits('')

      expect(showCatchError).toHaveBeenCalledWith(error)
      expect(showAlert).toHaveBeenCalledWith('Ups', 'error', undefined, 3000)
    })
  })

  describe('_updateReportingLimits', () => {
    const payload: IReportingLimitsUpdatePayload = {
      limits: [
        {
          id: 1,
          from_account: '111',
          to_account: '222',
          limit_type: 'MAX',
        },
      ],
    }

    it('returns true on success', async () => {
      const apiResponse = { data: { success: true, message: 'Actualizado' } }

      ;(executeApi as jest.Mock).mockReturnValue({
        put: jest.fn().mockResolvedValue(apiResponse),
      })

      const store = useReportingLimitsForChangesInEquityStoreV1()
      const result = await store._updateReportingLimits(payload)

      expect(result).toBe(true)
      expect(showAlert).toHaveBeenCalledWith(
        'Actualizado',
        'success',
        undefined,
        3000
      )
    })

    it('returns false and displays an error', async () => {
      const apiResponse = { data: { success: false, message: 'Error' } }

      ;(executeApi as jest.Mock).mockReturnValue({
        put: jest.fn().mockResolvedValue(apiResponse),
      })

      const store = useReportingLimitsForChangesInEquityStoreV1()
      const result = await store._updateReportingLimits(payload)

      expect(result).toBe(false)
      expect(showAlert).toHaveBeenCalledWith('Error', 'error', undefined, 3000)
    })

    it('handle exception', async () => {
      const error = new Error('Falla')
      ;(executeApi as jest.Mock).mockReturnValue({
        put: jest.fn().mockRejectedValue(error),
      })

      const store = useReportingLimitsForChangesInEquityStoreV1()
      const result = await store._updateReportingLimits(payload)

      expect(result).toBe(false)
      expect(showCatchError).toHaveBeenCalledWith(error)
      expect(showAlert).toHaveBeenCalledWith('Ups', 'error', undefined, 3000)
    })
  })

  describe('_deleteReportingLimits', () => {
    it('returns true on success', async () => {
      const apiResponse = { data: { success: true, message: 'Eliminado' } }

      ;(executeApi as jest.Mock).mockReturnValue({
        delete: jest.fn().mockResolvedValue(apiResponse),
      })

      const store = useReportingLimitsForChangesInEquityStoreV1()
      const result = await store._deleteReportingLimits('id=1')

      expect(result).toBe(true)
      expect(showAlert).toHaveBeenCalledWith(
        'Eliminado',
        'success',
        undefined,
        3000
      )
    })

    it('returns false on controlled error', async () => {
      const apiResponse = { data: { success: false, message: 'Error' } }

      ;(executeApi as jest.Mock).mockReturnValue({
        delete: jest.fn().mockResolvedValue(apiResponse),
      })

      const store = useReportingLimitsForChangesInEquityStoreV1()
      const result = await store._deleteReportingLimits('id=1')

      expect(result).toBe(false)
      expect(showAlert).toHaveBeenCalledWith('Error', 'error', undefined, 3000)
    })

    it('handle exception', async () => {
      const error = new Error('Falla')
      ;(executeApi as jest.Mock).mockReturnValue({
        delete: jest.fn().mockRejectedValue(error),
      })

      const store = useReportingLimitsForChangesInEquityStoreV1()
      const result = await store._deleteReportingLimits('id=1')

      expect(result).toBe(false)
      expect(showCatchError).toHaveBeenCalledWith(error)
      expect(showAlert).toHaveBeenCalledWith('Ups', 'error', undefined, 3000)
    })
  })
})
