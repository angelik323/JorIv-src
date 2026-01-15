import { setActivePinia, createPinia } from 'pinia'
import { useAnnualPeriodClosingv1 } from './annual-period-closing-v1'
import { IAnnualPeriodClosingModel } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(),
}))

jest.mock('@/composables', () => ({
  useAlert: () => ({
    showAlert: jest.fn(),
  }),
  useShowError: () => ({
    showCatchError: jest.fn(() => 'Error'),
  }),
}))

import { executeApi } from '@/apis'

describe('useAnnualPeriodClosingv1 store', () => {
  let store: ReturnType<typeof useAnnualPeriodClosingv1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAnnualPeriodClosingv1()
    jest.clearAllMocks()
  })

  describe('_getListAction', () => {
    it('Updates the pages and shows an alert if the request is successful', async () => {
      ;(executeApi as any).mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: {
            success: true,
            message: 'OK',
            data: {
              current_page: 3,
              last_page: 7,
            },
          },
        }),
      })

      await store._getListAction('&page=3')

      expect(store.validation_vouchers_pages.currentPage).toBe(3)
      expect(store.validation_vouchers_pages.lastPage).toBe(7)
    })

    it('Shows an alert if the request fails', async () => {
      ;(executeApi as any).mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('error')),
      })

      await store._getListAction('&page=1')

      expect(store.validation_vouchers_pages.currentPage).toBe(0)
      expect(store.validation_vouchers_pages.lastPage).toBe(0)
    })
  })

  describe('_executeAnnualClosure', () => {
    const params: IAnnualPeriodClosingModel = {
      accounting_structure_id: 1,
      from_account_code: '101',
      from_business_trust_id: '2',
      from_third_party_id: 1,
      to_account_code: '202',
      to_business_trust_id: '4',
      to_third_party_id: 2,
    }

    it('Returns success and data if the request is successful', async () => {
      const responseMock = {
        success: true,
        message: 'Closure executed',
        data: [[{ id: 10, status: 'closed' }]],
      }

      ;(executeApi as any).mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: responseMock }),
      })

      const result = await store._executeAnnualClosure(params)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(responseMock.data)
    })

    it('Returns success as false if an error occurs', async () => {
      ;(executeApi as any).mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('error')),
      })

      const result = await store._executeAnnualClosure(params)

      expect(result.success).toBe(false)
      expect(result.data).toEqual([])
    })
  })

  describe('_createAnnualClosing', () => {
    const payload: IAnnualPeriodClosingModel = {
      accounting_structure_id: 1,
      from_account_code: '101',
      from_business_trust_id: '5',
      from_third_party_id: 1,
      to_account_code: '202',
      to_business_trust_id: '8',
      to_third_party_id: 2,
    }

    it('Returns true if the creation was successful', async () => {
      ;(executeApi as any).mockReturnValue({
        post: jest.fn().mockResolvedValue({
          data: {
            success: true,
            message: 'Successfully created',
          },
        }),
      })

      const result = await store._createAnnualClosing(payload)

      expect(result).toBe(true)
    })

    it('Returns false if an error occurs during creation', async () => {
      ;(executeApi as any).mockReturnValue({
        post: jest.fn().mockRejectedValue(new Error('error')),
      })

      const result = await store._createAnnualClosing(payload)

      expect(result).toBe(false)
    })
  })
})
