import { setActivePinia, createPinia } from 'pinia'
import { useInvestmentPlanParticipationModificationStore } from './investment-plan-participation-modification-v1'
import { executeApi } from '@/apis'
import { URL_PATH_FICS } from '@/constants/apis'
import {
  IInvestmentPlan,
  IInvestmentPlanParticipationModification,
} from '@/interfaces/customs/fics/InvestmentPlanParticipationModification'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
}))

describe('useInvestmentPlanParticipationModificationStore', () => {
  let store: ReturnType<typeof useInvestmentPlanParticipationModificationStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    store = useInvestmentPlanParticipationModificationStore()
  })

  it('fetches list successfully', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Fetched',
        data: { data: [{ id: 1 }], current_page: 1, last_page: 2 },
      },
    }
    const getMock = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: getMock })

    await store._getList({ type: 1 })

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/business-line-change-petitions`,
      { params: { type: 1, paginate: 1 } }
    )
    expect(store.investment_plan_participation_modification_list).toEqual([
      { id: 1 },
    ])
    expect(store.investment_plan_participation_modification_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('handles error in _getList', async () => {
    const getMock = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: getMock })

    await store._getList({ type: 1 })

    expect(store.investment_plan_participation_modification_list).toEqual([])
    expect(store.investment_plan_participation_modification_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('_bulkAuthorize success and error', async () => {
    const postMock = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Authorized' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: postMock })

    const result = await store._bulkAuthorize([1, 2])
    expect(result).toEqual({ success: true, message: 'Authorized' })

    const postFailMock = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: postFailMock })

    const resultFail = await store._bulkAuthorize([1])
    expect(resultFail).toEqual({ success: false, message: 'catch error' })
  })

  it('_bulkReject success and error', async () => {
    const postMock = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Rejected' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: postMock })

    const result = await store._bulkReject([1])
    expect(result).toEqual({ success: true, message: 'Rejected' })

    const postFailMock = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: postFailMock })

    const resultFail = await store._bulkReject([1])
    expect(resultFail).toEqual({ success: false, message: 'catch error' })
  })

  it('_toggleAuth success with different status_id and error', async () => {
    const putMock = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Toggled' } })
    ;(executeApi as jest.Mock).mockReturnValue({ put: putMock })

    const resultAuth = await store._toggleAuth([1], 69)
    expect(resultAuth).toEqual({ success: true, message: 'Toggled' })

    const resultNotAuth = await store._toggleAuth([1], 0)
    expect(resultNotAuth).toEqual({ success: true, message: 'Toggled' })

    const putFailMock = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: putFailMock })

    const resultFail = await store._toggleAuth([1], 69)
    expect(resultFail).toEqual({ success: false, message: 'catch error' })
  })

  it('_bulkDelete success and error', async () => {
    const deleteMock = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Deleted' } })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: deleteMock })

    const result = await store._bulkDelete([1])
    expect(result).toEqual({ success: true, message: 'Deleted' })

    const deleteFailMock = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: deleteFailMock })

    const resultFail = await store._bulkDelete([1])
    expect(resultFail).toEqual({ success: false, message: 'catch error' })
  })

  it('_getListCreate success and error', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Fetched',
        data: { data: [{ id: 1 }], current_page: 1, last_page: 1 },
      },
    }
    const getMock = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: getMock })

    await store._getListCreate({ type: 1 })
    expect(
      store.investment_plan_participation_modification_create_list
    ).toEqual([{ id: 1 }])
    expect(
      store.investment_plan_participation_modification_create_pages
    ).toEqual({ currentPage: 1, lastPage: 1 })

    const getFailMock = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: getFailMock })

    await store._getListCreate({ type: 1 })
    expect(
      store.investment_plan_participation_modification_create_list
    ).toEqual([])
    expect(
      store.investment_plan_participation_modification_create_pages
    ).toEqual({ currentPage: 0, lastPage: 0 })
  })

  it('_create success and error', async () => {
    const postMock = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Created' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: postMock })

    const plans = [
      {
        fund_id: 1,
        fiduciary_investment_plan_id: 1,
        business_line_id: 1,
        new_business_line_id: 2,
      },
    ]
    const result = await store._create(plans)
    expect(result).toEqual({ success: true, message: 'Created' })

    const postFailMock = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: postFailMock })

    const resultFail = await store._create(plans)
    expect(resultFail).toEqual({ success: false, message: 'catch error' })
  })

  it('_clearData resets state', () => {
    store.investment_plan_participation_modification_list = [
      { id: 1 },
    ] as IInvestmentPlanParticipationModification[]
    store.investment_plan_participation_modification_create_list = [
      { id: 2 },
    ] as IInvestmentPlan[]
    store.investment_plan_participation_modification_pages = {
      currentPage: 5,
      lastPage: 10,
    }
    store.investment_plan_participation_modification_create_pages = {
      currentPage: 3,
      lastPage: 6,
    }

    store._clearData()

    expect(store.investment_plan_participation_modification_list).toEqual([])
    expect(
      store.investment_plan_participation_modification_create_list
    ).toEqual([])
    expect(store.investment_plan_participation_modification_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(
      store.investment_plan_participation_modification_create_pages
    ).toEqual({ currentPage: 0, lastPage: 0 })
  })
})
