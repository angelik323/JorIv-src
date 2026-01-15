import { setActivePinia, createPinia } from 'pinia'
import { useCostCenterV1 } from '@/stores/accounting/cost-centers/cost-center-v1'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()
  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))
  return { useAlert, useShowError }
})

describe('useCostCenterV1 store', () => {
  const URL_PATH = 'accounting/api/accounting/cost-centers'

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list successfully and updates state', async () => {
    const store = useCostCenterV1()
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [
            {
              id: 42,
              code: 'X',
              name: 'Test',
              type: '',
              estructura: '',
              purpose: '',
              status_id: 1,
              status: { id: 1 },
            },
          ],
          current_page: 2,
          last_page: 5,
        },
        message: 'OK',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&foo=bar'
    await store._getListAction(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.cost_center_list).toEqual(mockResponse.data.data.data)
    expect(store.cost_center_pages.currentPage).toBe(1)
    expect(store.cost_center_pages.lastPage).toBe(1)
  })

  it('cleans data on fetch error', async () => {
    const store = useCostCenterV1()
    store.cost_center_list = [
      {
        id: 1,
        code: '',
        name: '',
        type: '',
        estructura: '',
        purpose: '',
        status_id: 1,
        status: { id: 1 },
      },
    ]
    store.cost_center_pages = { currentPage: 9, lastPage: 9 }

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&x=y')

    expect(mockGet).toHaveBeenCalled()
    expect(store.cost_center_list).toEqual([])
    expect(store.cost_center_pages.currentPage).toBe(0)
    expect(store.cost_center_pages.lastPage).toBe(0)
  })

  it('creates cost center successfully', async () => {
    const store = useCostCenterV1()
    const mockResponse = { data: { success: true, message: 'Created' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      account_structures_id: 1,
      accounts_chart_id: 1,
      centers: [{ code: 'CC1', name: 'Centro', type: 'T' }],
    }
    const result = await store._createCostCenter(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(true)
  })

  it('returns false when create fails', async () => {
    const store = useCostCenterV1()
    const mockError = new Error('fail')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      account_structures_id: 1,
      accounts_chart_id: 1,
      centers: [{ code: '', name: '', type: '' }],
    }
    const result = await store._createCostCenter(payload)

    expect(result).toBe(false)
  })

  it('updates cost center successfully', async () => {
    const store = useCostCenterV1()
    const mockResponse = { data: { success: true, message: 'Updated' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const partialPayload = {
      code_structure: 'new-struct',
      estructura: 'estructura',
      purpose: 'purpose',
      type: 'type',
      status_id: 1,
    }

    const result = await store._updateCostCenter(7, 1, partialPayload)
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/7/1`, partialPayload)
    expect(result).toBe(true)
  })

  it('returns false when update fails', async () => {
    const store = useCostCenterV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const partialPayload = {
      code_structure: 'fail',
    }

    const result = await store._updateCostCenter(7, 1, partialPayload)
    expect(result).toBe(false)
  })

  it('gets cost center by id successfully', async () => {
    const store = useCostCenterV1()
    const payload = {
      id: 13,
      code: 'C',
      name: 'Test',
      type: '',
      estructura: '',
      purpose: '',
      status_id: 1,
      status: { id: 1 },
    }
    const mockGet = jest.fn().mockResolvedValue({ data: { success: true, data: payload } })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const res = await store._getCostCenter(13, 20)
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/13/20`)
    expect(res).toEqual(payload)
  })

  it('returns null when get by id fails', async () => {
    const store = useCostCenterV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const res = await store._getCostCenter(13, 20)
    expect(res).toBeNull()
  })

  it('toggles status successfully', async () => {
    const store = useCostCenterV1()
    expect(await store._toggleCostCenterStatus()).toBe(false)

    store._selectCostCenter({
      id: 5,
      code: '',
      name: '',
      type: '',
      estructura: '',
      purpose: '',
      status_id: 1,
      status: { id: 1 },
    })
    const mockPatch = jest.fn().mockResolvedValue({ data: { success: true, message: '' } })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const ok = await store._toggleCostCenterStatus()
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/5/status`, { status_id: 2 })
    expect(ok).toBe(true)
  })

  it('returns false when toggle status fails', async () => {
    const store = useCostCenterV1()
    store._selectCostCenter({
      id: 5,
      code: '',
      name: '',
      type: '',
      estructura: '',
      purpose: '',
      status_id: 2,
      status: { id: 2 },
    })
    const mockPatch = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const ok = await store._toggleCostCenterStatus()
    expect(ok).toBe(false)
  })

  it('gets codes and names', async () => {
    const store = useCostCenterV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { data: [{ code: 'C1', name: 'Centro 1' }] },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    const res = await store._getCostCenterCodesAndNames()
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?fields=code,name`)
    expect(res).toEqual([{ code: 'C1', name: 'Centro 1' }])
  })

  it('gets codes and names (returns empty array on error)', async () => {
    const store = useCostCenterV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    const res = await store._getCostCenterCodesAndNames()
    expect(res).toEqual([])
  })
})
