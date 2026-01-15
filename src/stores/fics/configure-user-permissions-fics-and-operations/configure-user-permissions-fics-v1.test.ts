// Vue - pinia
import { setActivePinia, createPinia } from 'pinia'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Utils
import { executeApi } from '@/apis'

// Stores
import { useConfigureUserPermissionsFicsStoreV1 } from './configure-user-permissions-fics-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(),
  useShowError: jest.fn(),
}))

describe('useConfigureUserPermissionsFicsStoreV1 — 100% branches', () => {
  let store: ReturnType<typeof useConfigureUserPermissionsFicsStoreV1>
  let postMock: jest.Mock
  let getMock: jest.Mock
  let deleteMock: jest.Mock
  let patchMock: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useConfigureUserPermissionsFicsStoreV1()

    postMock = jest.fn()
    getMock = jest.fn()
    deleteMock = jest.fn()
    patchMock = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      post: postMock,
      get: getMock,
      delete: deleteMock,
      patch: patchMock,
    })

    showAlertMock = jest.fn()
    showCatchErrorMock = jest.fn().mockReturnValue('error message')
    ;(useAlert as jest.Mock).mockReturnValue({
      showAlert: showAlertMock,
    })
    ;(useShowError as jest.Mock).mockReturnValue({
      showCatchError: showCatchErrorMock,
    })
  })

  // --------------------------------------------------------------
  // assignFundPermission
  // --------------------------------------------------------------
  describe('assignFundPermission', () => {
    it('success = true', async () => {
      postMock.mockResolvedValue({
        data: { message: 'ok', success: true },
      })

      const result = await store.assignFundPermission(1, [1])

      expect(result).toBe(true)
    })

    it('success = false', async () => {
      postMock.mockResolvedValue({
        data: { message: 'bad', success: false },
      })

      const result = await store.assignFundPermission(1, [1])

      expect(result).toBe(false)
    })

    it('success = undefined', async () => {
      postMock.mockResolvedValue({
        data: { message: undefined, success: undefined },
      })

      const result = await store.assignFundPermission(1, [1])

      expect(result).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Permiso asignado correctamente',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('error handler', async () => {
      postMock.mockRejectedValue({})

      const result = await store.assignFundPermission(1, [1])

      expect(result).toBe(false)
      expect(showCatchErrorMock).toHaveBeenCalled()
    })
  })

  // --------------------------------------------------------------
  // assignOfficePermission
  // --------------------------------------------------------------
  describe('assignOfficePermission', () => {
    it('success true', async () => {
      postMock.mockResolvedValue({
        data: { message: 'ok', success: true },
      })

      expect(await store.assignOfficePermission(1, [1])).toBe(true)
    })

    it('success false', async () => {
      postMock.mockResolvedValue({
        data: { message: 'x', success: false },
      })

      expect(await store.assignOfficePermission(1, [1])).toBe(false)
    })

    it('success undefined', async () => {
      postMock.mockResolvedValue({
        data: { message: undefined, success: undefined },
      })

      expect(await store.assignOfficePermission(1, [1])).toBe(false)
    })

    it('error handler', async () => {
      postMock.mockRejectedValue({})

      expect(await store.assignOfficePermission(1, [1])).toBe(false)
    })
  })

  // --------------------------------------------------------------
  // _listActionFundsPermission
  // --------------------------------------------------------------
  describe('_listActionFundsPermission', () => {
    it('success true with full data', async () => {
      getMock.mockResolvedValue({
        data: {
          data: {
            data: [{ id: 1 }],
            current_page: 2,
            last_page: 3,
            per_page: 10,
            total: 100,
          },
          message: 'ok',
          success: true,
        },
      })

      await store._listActionFundsPermission('x=1')

      expect(store.collective_investment_fund_list).toEqual([{ id: 1 }])
    })

    it('success true but values undefined (nullish branches)', async () => {
      getMock.mockResolvedValue({
        data: {
          data: {
            data: undefined,
            current_page: undefined,
            last_page: undefined,
            per_page: undefined,
            total: undefined,
          },
          message: undefined,
          success: true,
        },
      })

      await store._listActionFundsPermission('x=1')

      expect(store.collective_investment_fund_list).toEqual([])
      expect(store.collective_investment_fund_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
        rowsPerPage: 20,
        rowsNumber: 0,
      })
    })

    it('success false branch', async () => {
      getMock.mockResolvedValue({
        data: {
          data: { data: [] },
          message: 'err',
          success: false,
        },
      })

      await store._listActionFundsPermission('x=1')

      expect(showAlertMock).toHaveBeenCalledWith(
        'err',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('error handler', async () => {
      getMock.mockRejectedValue({})

      await store._listActionFundsPermission('x=1')

      expect(showCatchErrorMock).toHaveBeenCalled()
    })
  })

  // --------------------------------------------------------------
  // _listActionOfficesPermission
  // --------------------------------------------------------------
  describe('_listActionOfficesPermission', () => {
    it('success true', async () => {
      getMock.mockResolvedValue({
        data: {
          data: {
            data: [{ id: 7 }],
            current_page: 1,
            last_page: 2,
            per_page: 20,
            total: 40,
          },
          message: 'ok',
          success: true,
        },
      })

      await store._listActionOfficesPermission('x=1')

      expect(store.office_permission_list).toEqual([{ id: 7 }])
    })

    it('success false', async () => {
      getMock.mockResolvedValue({
        data: {
          data: { data: [] },
          message: 'bad',
          success: false,
        },
      })

      await store._listActionOfficesPermission('x=1')

      expect(showAlertMock).toHaveBeenCalledWith(
        'bad',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('undefined branches', async () => {
      getMock.mockResolvedValue({
        data: {
          data: { data: undefined },
          message: undefined,
          success: undefined,
        },
      })

      await store._listActionOfficesPermission('x=1')

      expect(showAlertMock).toHaveBeenCalledWith(
        undefined,
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('error', async () => {
      getMock.mockRejectedValue({})
      await store._listActionOfficesPermission('x=1')
      expect(showCatchErrorMock).toHaveBeenCalled()
    })
  })

  // --------------------------------------------------------------
  // _listActionOperationType
  // --------------------------------------------------------------
  describe('_listActionOperationType', () => {
    it('success', async () => {
      getMock.mockResolvedValue({
        data: {
          data: {
            data: [{ id: 9 }],
            current_page: 1,
            last_page: 2,
            per_page: 20,
            total: 40,
          },
          message: 'ok',
          success: true,
        },
      })

      await store._listActionOperationType('x=1')

      expect(store.operation_permission_list).toEqual([{ id: 9 }])
    })

    it('success false', async () => {
      getMock.mockResolvedValue({
        data: {
          data: { data: [] },
          message: 'x',
          success: false,
        },
      })

      await store._listActionOperationType('x=1')

      expect(showAlertMock).toHaveBeenCalledWith(
        'x',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('undefined', async () => {
      getMock.mockResolvedValue({
        data: {
          data: { data: undefined },
          message: undefined,
          success: undefined,
        },
      })

      await store._listActionOperationType('x=1')
    })

    it('error', async () => {
      getMock.mockRejectedValue({})
      await store._listActionOperationType('x=1')
      expect(showCatchErrorMock).toHaveBeenCalled()
    })
  })

  // --------------------------------------------------------------
  // _listOffices
  // --------------------------------------------------------------
  describe('_listOffices', () => {
    it('success', async () => {
      getMock.mockResolvedValue({
        data: {
          data: {
            data: [{ id: 20 }],
            current_page: 5,
            last_page: 5,
            per_page: 10,
            total: 10,
          },
          message: 'ok',
          success: true,
        },
      })

      await store._listOffices('&p=1')

      expect(store.offices_list).toEqual([{ id: 20 }])
    })

    it('success false', async () => {
      getMock.mockResolvedValue({
        data: {
          data: { data: [] },
          message: 'x',
          success: false,
        },
      })

      await store._listOffices('&p=1')

      expect(showAlertMock).toHaveBeenCalledWith(
        'x',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('undefined', async () => {
      getMock.mockResolvedValue({
        data: {
          data: { data: undefined },
          message: undefined,
          success: undefined,
        },
      })

      await store._listOffices('&p=1')
    })

    it('error', async () => {
      getMock.mockRejectedValue({})
      await store._listOffices('&p=1')
      expect(showCatchErrorMock).toHaveBeenCalled()
    })
  })

  // --------------------------------------------------------------
  // _deletePermission
  // --------------------------------------------------------------
  describe('_deletePermission', () => {
    it('success true', async () => {
      deleteMock.mockResolvedValue({
        data: { message: 'ok', success: true },
      })

      expect(await store._deletePermission(1)).toBe(true)
    })

    it('success false', async () => {
      deleteMock.mockResolvedValue({
        data: { message: 'bad', success: false },
      })

      expect(await store._deletePermission(1)).toBe(false)
    })

    it('error', async () => {
      deleteMock.mockRejectedValue({})
      expect(await store._deletePermission(1)).toBe(false)
      expect(showCatchErrorMock).toHaveBeenCalled()
    })
  })

  // --------------------------------------------------------------
  // _updateStatus
  // --------------------------------------------------------------
  describe('_updateStatus', () => {
    it('success true', async () => {
      patchMock.mockResolvedValue({
        data: { message: 'ok', success: true },
      })

      expect(await store._updateStatus(1)).toBe(true)
    })

    it('success undefined', async () => {
      patchMock.mockResolvedValue({
        data: { message: 'xx', success: undefined },
      })

      expect(await store._updateStatus(1)).toBe(false)
    })

    it('error', async () => {
      patchMock.mockRejectedValue({})
      expect(await store._updateStatus(1)).toBe(false)
      expect(showCatchErrorMock).toHaveBeenCalled()
    })
  })
})
