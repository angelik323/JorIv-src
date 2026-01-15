// Pinia - Axios
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import {
  IFicFiduciaryInvestmentPlansCanceledPlansItemsList,
  IIFicFiduciaryInvestmentPlansOpenPlansItemsList,
  IFiduciaryInvestmentPlanAdjustmentRequest,
  IFiduciaryInvestmentPlansToggleStatus,
  IFiduciaryInvestmentPlansAccountForm,
  IFiduciaryInvestmentPlansAccountList,
  IFiduciaryInvestmentPlansForm,
  IFicConsultUnitsDataBasicForm,
  IFiduciaryInvestmentPlanItem,
  IFicCheckBalancesView,
  IFicProfileOption,
} from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Utils
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useFiduciaryInvestmentPlanStoreV1 } from './fiduciary-investment-plan-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const getNameBlobMock = jest.fn().mockReturnValue('valid_file_name.xlsx')
  const showCatchErrorMock = jest.fn().mockReturnValue('Error message')
  const fileNameValidateMock = jest.fn((name: string) => name)
  const downloadBlobXlxxMock = jest.fn()
  const showAlertMock = jest.fn()

  return {
    useAlert: () => ({ showAlert: showAlertMock }),
    useShowError: () => ({ showCatchError: showCatchErrorMock }),
    useUtils: () => ({
      fileNameValidate: fileNameValidateMock,
      downloadBlobXlxx: downloadBlobXlxxMock,
      getNameBlob: getNameBlobMock,
    }),

    fileNameValidateMock,
    downloadBlobXlxxMock,
    showCatchErrorMock,
    getNameBlobMock,
    showAlertMock,
  }
})

describe('_getFiduciaryInvestmentPlanList', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let mockGet: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    mockGet = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      get: mockGet,
    })
  })

  it('fetches list successfully and updates state', async () => {
    const mockResponse = {
      data: {
        data: {
          data: [{ id: 1, code: 'X' }],
          current_page: 2,
          last_page: 5,
        },
        message: 'OK',
        success: true,
      },
    }

    mockGet.mockResolvedValue(mockResponse)

    await store._getFiduciaryInvestmentPlanList({ type: 7 })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-investment-plans`,
      { params: { type: 7, paginate: 1 } }
    )
    expect(store.fiduciary_investment_plan_list).toEqual([{ id: 1, code: 'X' }])
    expect(store.fiduciary_investment_plan_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
    expect(showAlertMock).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles success=false and still maps data + shows error alert', async () => {
    const mockResponse = {
      data: {
        data: {
          data: [{ id: 99 }],
          current_page: 1,
          last_page: 1,
        },
        message: 'Error loading',
        success: false,
      },
    }

    mockGet.mockResolvedValue(mockResponse)

    await store._getFiduciaryInvestmentPlanList({ search: 'A' })

    expect(store.fiduciary_investment_plan_list).toEqual([{ id: 99 }])
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error loading',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('uses default values when API returns incomplete data', async () => {
    const mockResponse = {
      data: {
        data: {},
        message: 'Empty',
        success: true,
      },
    }

    mockGet.mockResolvedValue(mockResponse)

    await store._getFiduciaryInvestmentPlanList({})

    expect(store.fiduciary_investment_plan_list).toEqual([])
    expect(store.fiduciary_investment_plan_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('handles request failure and shows catch error alert', async () => {
    mockGet.mockRejectedValue(new Error('Fail'))
    showCatchErrorMock.mockReturnValue('catch error')

    await store._getFiduciaryInvestmentPlanList({ type: 3 })

    expect(showCatchErrorMock).toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(store.fiduciary_investment_plan_list).toEqual([])
    expect(store.fiduciary_investment_plan_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})

describe('_getBankingAccountList', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let mockGet: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())

    jest.clearAllMocks()
    store = useFiduciaryInvestmentPlanStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    mockGet = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      get: mockGet,
    })

    store._clearData = jest.fn()
  })

  it('fetches list successfully and updates state', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: {
          data: [{ id: 1 }],
          current_page: 3,
          last_page: 10,
        },
        message: 'OK',
        success: true,
      },
    })

    await store._getBankingAccountList('filter=test')

    expect(store._clearData).toHaveBeenCalled()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fip-account-management?paginate=1&filter=test`
    )

    expect(store.banking_account_list).toEqual([{ id: 1 }])
    expect(store.fiduciary_investment_plan_pages.currentPage).toBe(3)
    expect(store.fiduciary_investment_plan_pages.lastPage).toBe(10)

    expect(showAlertMock).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles undefined items and pages', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: {
          data: undefined,
          current_page: undefined,
          last_page: undefined,
        },
        message: 'No items',
        success: false,
      },
    })

    await store._getBankingAccountList('')

    expect(store.banking_account_list).toEqual([])
    expect(store.fiduciary_investment_plan_pages.currentPage).toBeUndefined()
    expect(store.fiduciary_investment_plan_pages.lastPage).toBeUndefined()

    expect(showAlertMock).toHaveBeenCalledWith(
      'No items',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles API error', async () => {
    showCatchErrorMock.mockReturnValue('Custom error')

    mockGet.mockRejectedValue({ error: true })

    await store._getBankingAccountList('')

    expect(showCatchErrorMock).toHaveBeenCalled()

    expect(showAlertMock).toHaveBeenCalledWith(
      'Custom error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})

describe('_getByIdFiduciaryInvestmentPlan', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let mockGet: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    mockGet = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      get: mockGet,
    })
  })

  it('fetches data successfully using holder_identifications', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: {
          id: 1,
          holder_identifications: 'ABC123',
        },
        message: 'OK',
        success: true,
      },
    })

    await store._getByIdFiduciaryInvestmentPlan(10)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-investment-plans/10`
    )

    expect(store.fiduciary_investment_plan_response).toEqual({
      id: 1,
      holder_identifications: 'ABC123',
      holder_identification: 'ABC123',
    })

    expect(showAlertMock).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('fetches data successfully using holder_identification when holder_identifications is missing', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: {
          id: 1,
          holder_identification: 'XYZ999',
        },
        message: 'OK',
        success: true,
      },
    })

    await store._getByIdFiduciaryInvestmentPlan(20)

    expect(store.fiduciary_investment_plan_response).toEqual({
      id: 1,
      holder_identification: 'XYZ999',
    })

    expect(showAlertMock).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('sets response to null when data is undefined', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: undefined,
        message: 'No data',
        success: true,
      },
    })

    await store._getByIdFiduciaryInvestmentPlan(30)

    expect(store.fiduciary_investment_plan_response).toEqual({
      holder_identification: undefined,
    })

    expect(showAlertMock).toHaveBeenCalledWith(
      'No data',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles success=false and does NOT set response', async () => {
    mockGet.mockResolvedValue({
      data: {
        message: 'Error loading',
        success: false,
      },
    })

    await store._getByIdFiduciaryInvestmentPlan(40)

    expect(store.fiduciary_investment_plan_response).toBeNull()

    expect(showAlertMock).toHaveBeenCalledWith(
      'Error loading',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles API error', async () => {
    showCatchErrorMock.mockReturnValue('Custom error')
    mockGet.mockRejectedValue({ status: 500 })

    await store._getByIdFiduciaryInvestmentPlan(50)

    expect(showCatchErrorMock).toHaveBeenCalled()

    expect(showAlertMock).toHaveBeenCalledWith(
      'Custom error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})

describe('_createFiduciaryInvestmentPlan', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let mockPost: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    mockPost = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      post: mockPost,
    })
  })

  it('creates a plan successfully and returns true', async () => {
    mockPost.mockResolvedValue({
      data: {
        message: 'Created!',
        success: true,
      },
    })

    const data = { code: 'Plan test' }
    const result = await store._createFiduciaryInvestmentPlan(
      data as IFiduciaryInvestmentPlansForm
    )

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-investment-plans`,
      data
    )

    expect(result).toBe(true)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Created!',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('returns false when API responds with success=false', async () => {
    mockPost.mockResolvedValue({
      data: {
        message: 'Validation error',
        success: false,
      },
    })

    const data = { code: 'Plan test' }
    const result = await store._createFiduciaryInvestmentPlan(
      data as IFiduciaryInvestmentPlansForm
    )

    expect(result).toBe(false)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Validation error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles API error and returns false', async () => {
    mockPost.mockRejectedValue({ status: 500 })

    showCatchErrorMock.mockReturnValue('Server error')

    const data = { code: 'Plan test' }
    const result = await store._createFiduciaryInvestmentPlan(
      data as IFiduciaryInvestmentPlansForm
    )

    expect(showCatchErrorMock).toHaveBeenCalled()

    expect(showAlertMock).toHaveBeenCalledWith(
      'Server error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(result).toBe(false)
  })
})

describe('_createBankingAccount', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let mockPost: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    mockPost = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      post: mockPost,
    })
  })

  it('creates a banking account successfully and returns true', async () => {
    mockPost.mockResolvedValue({
      data: {
        message: 'Created!',
        success: true,
      },
    })

    const data = { plan_id: '123' }
    const result = await store._createBankingAccount(
      data as IFiduciaryInvestmentPlansAccountForm
    )

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fip-account-management`,
      data
    )

    expect(result).toBe(true)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Created!',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('returns false when API responds with success=false', async () => {
    mockPost.mockResolvedValue({
      data: {
        message: 'Validation failed',
        success: false,
      },
    })

    const data = { plan_id: '123' }
    const result = await store._createBankingAccount(
      data as IFiduciaryInvestmentPlansAccountForm
    )

    expect(result).toBe(false)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Validation failed',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles API error and returns false', async () => {
    mockPost.mockRejectedValue({ status: 500 })

    showCatchErrorMock.mockReturnValue('Server error')

    const data = { plan_id: '123' }
    const result = await store._createBankingAccount(
      data as IFiduciaryInvestmentPlansAccountForm
    )

    expect(showCatchErrorMock).toHaveBeenCalled()

    expect(showAlertMock).toHaveBeenCalledWith(
      'Server error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(result).toBe(false)
  })
})

describe('_editFiduciaryInvestmentPlan', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let mockPut: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    mockPut = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      put: mockPut,
    })
  })

  it('edits plan successfully and returns true', async () => {
    mockPut.mockResolvedValue({
      data: {
        message: 'Updated successfully',
        success: true,
      },
    })

    const payload = { code: 'Edited plan' }
    const result = await store._editFiduciaryInvestmentPlan(
      12,
      payload as IFiduciaryInvestmentPlansForm
    )

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-investment-plans/12`,
      payload
    )
    expect(result).toBe(true)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Updated successfully',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('returns false when API responds with success=false', async () => {
    mockPut.mockResolvedValue({
      data: {
        message: 'Validation failed',
        success: false,
      },
    })

    const payload = { code: 'Edited plan' }
    const result = await store._editFiduciaryInvestmentPlan(
      13,
      payload as IFiduciaryInvestmentPlansForm
    )

    expect(result).toBe(false)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Validation failed',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles API error and returns false', async () => {
    const error = new Error('Server down')
    mockPut.mockRejectedValue(error)

    showCatchErrorMock.mockReturnValue('Server error')

    const payload = { code: 'Edited plan' }
    const result = await store._editFiduciaryInvestmentPlan(
      14,
      payload as IFiduciaryInvestmentPlansForm
    )

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Server error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(result).toBe(false)
  })
})

describe('_updateStatus', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let mockPut: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    mockPut = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      put: mockPut,
    })
  })

  it('updates status successfully and returns true', async () => {
    mockPut.mockResolvedValue({
      data: {
        message: 'Status updated',
        success: true,
      },
    })

    const result = await store._updateStatus(55)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fip-account-management/55`
    )
    expect(result).toBe(true)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Status updated',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('returns false when API returns success=false', async () => {
    mockPut.mockResolvedValue({
      data: {
        message: 'Update failed',
        success: false,
      },
    })

    const result = await store._updateStatus(77)

    expect(result).toBe(false)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Update failed',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error and returns false', async () => {
    const error = new Error('Network error')
    mockPut.mockRejectedValue(error)

    showCatchErrorMock.mockReturnValue('Processed error')

    const result = await store._updateStatus(88)

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Processed error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(result).toBe(false)
  })
})

describe('_toggleStatusFiduciaryInvestmentPlan', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let mockPut: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    mockPut = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      put: mockPut,
    })
  })

  it('updates status successfully and returns true', async () => {
    mockPut.mockResolvedValue({
      data: {
        message: 'Status toggled',
        success: true,
      },
    })

    const body = { status_id: 1 }

    const result = await store._toggleStatusFiduciaryInvestmentPlan(
      10,
      body as IFiduciaryInvestmentPlansToggleStatus
    )

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-investment-plans/toggle-status/10`,
      body
    )
    expect(result).toBe(true)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Status toggled',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('returns false when API returns success=false', async () => {
    mockPut.mockResolvedValue({
      data: {
        message: 'Toggle failed',
        success: false,
      },
    })

    const body = { status_id: 1 }

    const result = await store._toggleStatusFiduciaryInvestmentPlan(
      20,
      body as IFiduciaryInvestmentPlansToggleStatus
    )

    expect(result).toBe(false)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Toggle failed',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error and returns false', async () => {
    const error = new Error('Network error')
    mockPut.mockRejectedValue(error)

    showCatchErrorMock.mockReturnValue('Processed error')

    const body = { status_id: 1 }

    const result = await store._toggleStatusFiduciaryInvestmentPlan(
      30,
      body as IFiduciaryInvestmentPlansToggleStatus
    )

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Processed error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(result).toBe(false)
  })
})

describe('_exportExcel', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let mockGet: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    mockGet = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      get: mockGet,
    })
  })

  it('exports Excel successfully and returns the file', async () => {
    const mockBuffer = new ArrayBuffer(8)

    mockGet.mockResolvedValue({
      data: mockBuffer,
      status: 200,
    })

    const result = await store._exportExcel('1,2,3')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fip-account-management/export-accounts?ids[]=1,2,3`,
      { responseType: 'arraybuffer' }
    )

    expect(result).toBe(mockBuffer)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Exportación exitosa',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles non-200 responses and still returns the file', async () => {
    const mockBuffer = new ArrayBuffer(4)

    mockGet.mockResolvedValue({
      data: { message: 'Warning export', content: mockBuffer },
      status: 400,
    })

    const result = await store._exportExcel('10')

    expect(result).toEqual({ message: 'Warning export', content: mockBuffer })

    expect(showAlertMock).toHaveBeenCalledWith(
      'Warning export',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles API error and returns null', async () => {
    const error = new Error('Network fail')
    mockGet.mockRejectedValue(error)

    showCatchErrorMock.mockReturnValue('Processed error')

    const result = await store._exportExcel('50')

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Processed error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(result).toBeNull()
  })
})

describe('_setDataSelection', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()
  })

  it('sets data_selection with a copied array when data is provided', () => {
    const input = [
      { id: 1, code: 123 },
      { id: 2, code: 123 },
    ]

    store._setDataSelection(input as IFiduciaryInvestmentPlanItem[] | null)

    expect(store.data_selection).toEqual(input)
    expect(store.data_selection).not.toBe(input)
  })

  it('sets data_selection to empty array when null is provided', () => {
    store._setDataSelection(null)

    expect(store.data_selection).toEqual([])
  })
})

describe('_setDataToggleStatus', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()
  })

  it('sets data_toggle_status with a copied object when data is provided', () => {
    const input = {
      status_id: 1,
    }

    store._setDataToggleStatus(
      input as IFiduciaryInvestmentPlansToggleStatus | null
    )

    expect(store.data_toggle_status).toEqual(input)
    expect(store.data_toggle_status).not.toBe(input)
  })

  it('sets data_toggle_status to null when null is provided', () => {
    store._setDataToggleStatus(null)

    expect(store.data_toggle_status).toBeNull()
  })
})

describe('_setDataForm', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()
  })

  it('sets data_form with a copied object when data is provided', () => {
    const input = {
      id: 1,
      code: 5000,
    }

    store._setDataForm(input as IFiduciaryInvestmentPlansForm | null)

    expect(store.data_form).toEqual(input)
    expect(store.data_form).not.toBe(input)
  })

  it('sets data_form to null when null is provided', () => {
    store._setDataForm(null)

    expect(store.data_form).toBeNull()
  })
})

describe('_createInvestmentPlanAdjustment', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let mockPost: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    mockPost = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      post: mockPost,
    })
  })

  it('creates investment plan adjustment successfully', async () => {
    mockPost.mockResolvedValue({
      data: {
        message: 'Created',
        success: true,
      },
    })

    const payload = { balance_type: '1500' }

    const result = await store._createInvestmentPlanAdjustment(
      payload as IFiduciaryInvestmentPlanAdjustmentRequest
    )

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-investment-plans/investment-plan-balance-adjustments`,
      payload
    )

    expect(result).toBe(true)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Created',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles success=false and returns false', async () => {
    mockPost.mockResolvedValue({
      data: {
        message: 'Error creating',
        success: false,
      },
    })

    const result = await store._createInvestmentPlanAdjustment({
      balance_type: '2000',
    } as IFiduciaryInvestmentPlanAdjustmentRequest)

    expect(result).toBe(false)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Error creating',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles API error and returns false', async () => {
    showCatchErrorMock.mockReturnValue('Custom error')

    mockPost.mockRejectedValue({ status: 500 })

    const result = await store._createInvestmentPlanAdjustment({
      balance_type: '999',
    } as IFiduciaryInvestmentPlanAdjustmentRequest)

    expect(result).toBe(false)

    expect(showCatchErrorMock).toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith(
      'Custom error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})

describe('_calculateAdjustment', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let mockPost: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    store = useFiduciaryInvestmentPlanStoreV1()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock

    mockPost = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({
      post: mockPost,
    })
  })

  it('calculates adjustment successfully with valid data', async () => {
    mockPost.mockResolvedValue({
      data: {
        success: true,
        data: 1500,
      },
    })

    const payload = {
      start_date: '2024-01-01',
      end_date: '2024-02-01',
      amount: 1000,
      fund_id: 5,
    }

    const result = await store._calculateAdjustment(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-investment-plans/adjustment-calculation`,
      payload
    )

    expect(result).toBe(1500)
  })

  it('returns 0 when success=true but data is undefined', async () => {
    mockPost.mockResolvedValue({
      data: {
        success: true,
        data: undefined,
      },
    })

    const result = await store._calculateAdjustment({
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      amount: 500,
      fund_id: 3,
    })

    expect(result).toBe(0)
  })

  it('returns 0 when success=false', async () => {
    mockPost.mockResolvedValue({
      data: {
        success: false,
        data: 9999,
      },
    })

    const result = await store._calculateAdjustment({
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      amount: 500,
      fund_id: 3,
    })

    expect(result).toBe(0)
  })

  it('handles API error and returns 0', async () => {
    showCatchErrorMock.mockReturnValue('Custom error')

    mockPost.mockRejectedValue({ status: 500 })

    const result = await store._calculateAdjustment({
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      amount: 100,
      fund_id: 1,
    })

    expect(result).toBe(0)

    expect(showCatchErrorMock).toHaveBeenCalled()

    expect(showAlertMock).toHaveBeenCalledWith(
      'Custom error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})

describe('_getAdjustmentDetail', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  const { showAlertMock, showCatchErrorMock } = require('@/composables')

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = jest.fn()
    api.executeApi.mockReturnValue({
      get: getMock,
    })

    showAlertMock.mockClear()
    showCatchErrorMock.mockClear()
  })

  it('returns detail on success (success = true)', async () => {
    const mockDetail = { id: 1, name: 'Detalle' }

    getMock.mockResolvedValue({
      data: {
        success: true,
        data: mockDetail,
      },
    })

    const result = await store._getAdjustmentDetail(1)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-investment-plans/adjustment-detail/1`
    )

    expect(result).toEqual(mockDetail)

    expect(showAlertMock).not.toHaveBeenCalled()
  })

  it('returns null when success = false (branch)', async () => {
    getMock.mockResolvedValue({
      data: {
        success: false,
        data: null,
      },
    })

    const result = await store._getAdjustmentDetail(5)

    expect(result).toBeNull()
    expect(showAlertMock).not.toHaveBeenCalled()
  })

  it('handles error path and returns null', async () => {
    const error = new Error('API error')

    getMock.mockRejectedValue(error)

    const msg = 'mapped-error'
    showCatchErrorMock.mockReturnValue(msg)

    const result = await store._getAdjustmentDetail(10)

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      msg,
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(result).toBeNull()
  })
})

describe('_loadFicProfilesByFund', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  const { showAlertMock, showCatchErrorMock } = require('@/composables')

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = jest.fn()

    api.executeApi.mockReturnValue({
      get: getMock,
    })

    showAlertMock.mockClear()
    showCatchErrorMock.mockClear()

    store.fic_manager_profiles = []
    store.fic_advisor_profiles = []
  })

  it('clears profiles and returns when fundId is falsy', async () => {
    await store._loadFicProfilesByFund('' as string | number)

    expect(store.fic_manager_profiles).toEqual([])
    expect(store.fic_advisor_profiles).toEqual([])

    expect(getMock).not.toHaveBeenCalled()
    expect(showAlertMock).not.toHaveBeenCalled()
  })

  it('loads manager and advisor profiles on success', async () => {
    const mockManagers = {
      data: {
        fic_profiles: [
          {
            id: 1,
            type_user: 1,
            users: [{ id: 10, name: 'Ana', last_name: 'Perez' }],
          },
        ],
      },
    }

    const mockAdvisors = {
      data: {
        fic_profiles: [
          {
            id: 2,
            type_user: 2,
            users: [{ id: 20, name: 'Luis', last_name: 'Gomez' }],
          },
        ],
      },
    }

    getMock
      .mockResolvedValueOnce({ data: mockManagers })
      .mockResolvedValueOnce({ data: mockAdvisors })

    await store._loadFicProfilesByFund(99)

    expect(getMock).toHaveBeenNthCalledWith(
      1,
      `${URL_PATH_FICS}/select-tables?filter[fund_id]=99&keys[]=fic_profiles&filter[type_user]=1`
    )

    expect(getMock).toHaveBeenNthCalledWith(
      2,
      `${URL_PATH_FICS}/select-tables?filter[fund_id]=99&keys[]=fic_profiles&filter[type_user]=2`
    )

    expect(store.fic_manager_profiles).toEqual([
      {
        value: 1,
        label: 'Ana  Perez',
        type_user: 1,
        profile_id: 1,
        user_id: 10,
      },
    ])

    expect(store.fic_advisor_profiles).toEqual([
      {
        value: 2,
        label: 'Luis  Gomez',
        type_user: 2,
        profile_id: 2,
        user_id: 20,
      },
    ])

    expect(showAlertMock).not.toHaveBeenCalled()
  })

  it('sets empty arrays if fic_profiles does not exist', async () => {
    getMock
      .mockResolvedValueOnce({ data: { data: {} } })
      .mockResolvedValueOnce({ data: { data: {} } })

    await store._loadFicProfilesByFund(50)

    expect(store.fic_manager_profiles).toEqual([])
    expect(store.fic_advisor_profiles).toEqual([])

    expect(showAlertMock).not.toHaveBeenCalled()
  })

  it('handles error path and clears arrays + shows alert', async () => {
    const error = new Error('API failed')
    getMock.mockRejectedValue(error)

    const msg = 'mapped-error'
    showCatchErrorMock.mockReturnValue(msg)

    await store._loadFicProfilesByFund(22)

    expect(store.fic_manager_profiles).toEqual([])
    expect(store.fic_advisor_profiles).toEqual([])

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)

    expect(showAlertMock).toHaveBeenCalledWith(
      msg,
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})

describe('_getByIdCheckBalancesBasicData', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  const { showAlertMock, showCatchErrorMock } = require('@/composables')

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = jest.fn()

    api.executeApi.mockReturnValue({
      get: getMock,
    })

    showAlertMock.mockClear()
    showCatchErrorMock.mockClear()

    store.check_balances_basic_data_form = null as IFicCheckBalancesView | null
  })

  it('loads data and shows success alert when success = true', async () => {
    const mockData = [{ a: 1 }]
    getMock.mockResolvedValue({
      data: {
        success: true,
        data: mockData,
        message: 'OK!',
      },
    })

    await store._getByIdCheckBalancesBasicData(5)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/5`
    )

    expect(store.check_balances_basic_data_form).toEqual(mockData)

    expect(showAlertMock).toHaveBeenCalledWith(
      'OK!',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('shows error alert and does NOT set data when success = false', async () => {
    getMock.mockResolvedValue({
      data: {
        success: false,
        data: null,
        message: 'Something failed',
      },
    })

    store.check_balances_basic_data_form = [
      { old: true },
    ] as IFicCheckBalancesView | null

    await store._getByIdCheckBalancesBasicData(10)

    expect(store.check_balances_basic_data_form).toEqual([{ old: true }])

    expect(showAlertMock).toHaveBeenCalledWith(
      'Something failed',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error path, shows catch alert, and does not modify data', async () => {
    const error = new Error('API error!!!')
    getMock.mockRejectedValue(error)

    const msg = 'mapped-error'
    showCatchErrorMock.mockReturnValue(msg)

    store.check_balances_basic_data_form = [
      { available_balance: 'a' },
    ] as IFicCheckBalancesView | null

    await store._getByIdCheckBalancesBasicData(99)

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)

    expect(showAlertMock).toHaveBeenCalledWith(
      msg,
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(store.check_balances_basic_data_form).toEqual([
      { available_balance: 'a' },
    ])
  })
})

describe('_getByIdCheckBalancesByDate', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let clearDataMock: jest.SpyInstance

  const { showAlertMock, showCatchErrorMock } = require('@/composables')

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = jest.fn()
    api.executeApi.mockReturnValue({
      get: getMock,
    })

    clearDataMock = jest.spyOn(store, '_clearData')

    store.check_balances_by_date_form = null as IFicCheckBalancesView | null

    showAlertMock.mockClear()
    showCatchErrorMock.mockClear()
  })

  it('loads data when success = true', async () => {
    const mockData = [{ id: 1, value: 999 }]

    getMock.mockResolvedValue({
      data: {
        success: true,
        data: mockData,
        message: 'OK',
      },
    })

    const id = 44
    const params = 'date=2025-01-01'

    await store._getByIdCheckBalancesByDate(id, params)

    expect(clearDataMock).toHaveBeenCalled()

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/detail/44?date=2025-01-01`
    )

    expect(store.check_balances_by_date_form).toEqual(mockData)

    expect(showAlertMock).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles success = false and still shows alert', async () => {
    getMock.mockResolvedValue({
      data: {
        success: false,
        data: null,
        message: 'No encontrado',
      },
    })

    await store._getByIdCheckBalancesByDate(5, 'x=1')

    expect(store.check_balances_by_date_form).toEqual(null)

    expect(showAlertMock).toHaveBeenCalledWith(
      'No encontrado',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error and shows alert', async () => {
    const error = new Error('API error')

    getMock.mockRejectedValue(error)

    const mapped = 'mapped-error'
    showCatchErrorMock.mockReturnValue(mapped)

    await store._getByIdCheckBalancesByDate(9, 'filter=a')

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)

    expect(showAlertMock).toHaveBeenCalledWith(
      mapped,
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(store.check_balances_by_date_form).toEqual(null)
  })
})

describe('_getByIdCheckBalancesControlTableByDate', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  const { showAlertMock, showCatchErrorMock } = require('@/composables')

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = api.executeApi().get as jest.Mock

    showAlertMock.mockClear()
    showCatchErrorMock.mockClear()
  })

  it('sets data and shows success alert when success = true', async () => {
    const mockRows = [{ id: 1 }]

    getMock.mockResolvedValue({
      data: {
        success: true,
        message: 'ok',
        data: {
          data: mockRows,
        },
      },
    })

    await store._getByIdCheckBalancesControlTableByDate(10, 'x=1')

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/detail-with-control/10?x=1&paginate=1`
    )

    expect(store.check_balances_control_table_by_date).toEqual(mockRows)

    expect(showAlertMock).toHaveBeenCalledWith(
      'ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('sets empty data and shows error alert when success = false (branch)', async () => {
    getMock.mockResolvedValue({
      data: {
        success: false,
        message: 'fail-msg',
        data: null,
      },
    })

    await store._getByIdCheckBalancesControlTableByDate(7, 'p=9')

    expect(store.check_balances_control_table_by_date).toEqual([])

    expect(showAlertMock).toHaveBeenCalledWith(
      'fail-msg',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error path, clears data and shows mapped error', async () => {
    const error = new Error('API error')

    getMock.mockRejectedValue(error)

    const msg = 'mapped-error'
    showCatchErrorMock.mockReturnValue(msg)

    await store._getByIdCheckBalancesControlTableByDate(3, 'z=1')

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)

    expect(showAlertMock).toHaveBeenCalledWith(
      msg,
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(store.check_balances_control_table_by_date).toEqual([])
  })
})

describe('_listCanceledFiduciaryInvestmentPlans', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = api.executeApi().get

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock
  })

  it('fetches data successfully and updates store', async () => {
    const mockResponse = {
      data: {
        data: [{ id: 1, name: 'Test' }],
        current_page: 5,
        last_page: 10,
      },
      message: 'OK',
      success: true,
    }

    getMock.mockResolvedValue({ data: mockResponse })

    await store._listCanceledFiduciaryInvestmentPlans({ page: 1 })

    expect(store.canceled_fiduciary_investment_plans_list).toEqual([
      { id: 1, name: 'Test' },
    ])
    expect(store.canceled_fiduciary_investment_plans_pages.currentPage).toBe(5)
    expect(store.canceled_fiduciary_investment_plans_pages.lastPage).toBe(10)

    expect(showAlertMock).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles success=false and shows error alert', async () => {
    const mockResponse = {
      data: {
        data: [],
        current_page: 1,
        last_page: 1,
      },
      message: 'Algo salió mal',
      success: false,
    }

    getMock.mockResolvedValue({ data: mockResponse })

    await store._listCanceledFiduciaryInvestmentPlans({})

    expect(store.canceled_fiduciary_investment_plans_list).toEqual([])
    expect(showAlertMock).toHaveBeenCalledWith(
      'Algo salió mal',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles undefined paging values', async () => {
    const mockResponse = {
      data: {
        data: [{ id: 99 }],
        current_page: undefined,
        last_page: undefined,
      },
      message: 'Partial data',
      success: true,
    }

    getMock.mockResolvedValue({ data: mockResponse })

    await store._listCanceledFiduciaryInvestmentPlans({})

    expect(store.canceled_fiduciary_investment_plans_pages.currentPage).toBe(0)
    expect(store.canceled_fiduciary_investment_plans_pages.lastPage).toBe(0)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Partial data',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles API error (catch)', async () => {
    const error = new Error('Fail')
    getMock.mockRejectedValue(error)
    showCatchErrorMock.mockReturnValue('Error message')

    await store._listCanceledFiduciaryInvestmentPlans({})

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error message',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})

describe('_exportCanceledFiduciaryInvestmentPlans', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let showAlertMock: jest.Mock
  let getNameBlobMock: jest.Mock
  let downloadBlobXlxxMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = api.executeApi().get

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    getNameBlobMock = composables.getNameBlobMock
    downloadBlobXlxxMock = composables.downloadBlobXlxxMock
  })

  it('should download Excel file successfully', async () => {
    const mockBinary = new ArrayBuffer(4)
    const mockResponse = {
      data: mockBinary,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    getMock.mockResolvedValue(mockResponse)
    getNameBlobMock.mockReturnValue('archivo.xlsx')

    await store._exportCanceledFiduciaryInvestmentPlans({ tipo: 1 })

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/cancellation-investment-plan-export`,
      { params: { tipo: 1 }, responseType: 'blob' }
    )

    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)

    const callArgs = downloadBlobXlxxMock.mock.calls[0]
    expect(callArgs[0]).toBeInstanceOf(Blob)
    expect(callArgs[1]).toBe('archivo.xlsx')
  })

  it('should show error alert when API fails', async () => {
    getMock.mockRejectedValue(new Error('fail'))

    await store._exportCanceledFiduciaryInvestmentPlans({})

    expect(showAlertMock).toHaveBeenCalledWith(
      'Error al descargar el archivo',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(getNameBlobMock).not.toHaveBeenCalled()
    expect(downloadBlobXlxxMock).not.toHaveBeenCalled()
  })
})

describe('_listOpenFiduciaryInvestmentPlans', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock
  let clearDataSpy: jest.SpyInstance

  const makeResponse = (override = {}) => ({
    data: {
      data: {
        data: [{ id: 1 }],
        current_page: 5,
        last_page: 9,
      },
      message: 'OK',
      success: true,
      ...override,
    },
  })

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    store = useFiduciaryInvestmentPlanStoreV1()

    clearDataSpy = jest.spyOn(store, '_clearData')

    const api = require('@/apis')
    getMock = api.executeApi().get

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock
  })

  it('should load list, pages and show success alert', async () => {
    const mockResponse = makeResponse()

    getMock.mockResolvedValue(mockResponse)

    await store._listOpenFiduciaryInvestmentPlans({ q: 1 })

    expect(clearDataSpy).toHaveBeenCalled()

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/plans-openings`,
      { params: { q: 1, paginate: true } }
    )

    expect(store.open_fiduciary_investment_plans_list).toEqual([{ id: 1 }])
    expect(store.open_fiduciary_investment_plans_pages.currentPage).toBe(5)
    expect(store.open_fiduciary_investment_plans_pages.lastPage).toBe(9)

    expect(showAlertMock).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should handle empty items and fallback pages', async () => {
    const mockResponse = makeResponse({
      data: {
        data: null,
        current_page: null,
        last_page: undefined,
      },
      message: 'No data',
      success: false,
    })

    getMock.mockResolvedValue(mockResponse)

    await store._listOpenFiduciaryInvestmentPlans({})

    expect(store.open_fiduciary_investment_plans_list).toEqual([])
    expect(store.open_fiduciary_investment_plans_pages.currentPage).toBe(0)
    expect(store.open_fiduciary_investment_plans_pages.lastPage).toBe(0)

    expect(showAlertMock).toHaveBeenCalledWith(
      'No data',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should show error alert when API fails', async () => {
    getMock.mockRejectedValue({ error: 'fail' })
    showCatchErrorMock.mockReturnValue('Custom error')

    await store._listOpenFiduciaryInvestmentPlans({})

    expect(showCatchErrorMock).toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith(
      'Custom error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})

describe('_exportOpenFiduciaryInvestmentPlans', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let showAlertMock: jest.Mock
  let getNameBlobMock: jest.Mock
  let downloadBlobXlxxMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = api.executeApi().get

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    getNameBlobMock = composables.getNameBlobMock
    downloadBlobXlxxMock = composables.downloadBlobXlxxMock
  })

  it('should download Excel file successfully', async () => {
    const mockBlobData = new ArrayBuffer(10)

    const mockResponse = {
      data: mockBlobData,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    getMock.mockResolvedValue(mockResponse)
    getNameBlobMock.mockReturnValue('archivo.xlsx')

    await store._exportOpenFiduciaryInvestmentPlans({ estado: 1 })

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/plans-openings-export`,
      { params: { estado: 1 }, responseType: 'blob' }
    )

    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)

    expect(downloadBlobXlxxMock).toHaveBeenCalledWith(
      expect.any(Blob),
      'archivo.xlsx'
    )
  })

  it('should show error alert when API fails', async () => {
    getMock.mockRejectedValue(new Error('fail'))

    await store._exportOpenFiduciaryInvestmentPlans({})

    expect(showAlertMock).toHaveBeenCalledWith(
      'Error al descargar el archivo',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})

describe('_getByIdConsultUnitsBasicData', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = api.executeApi().get

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock
  })

  it('returns data and shows success alert when API responds success=true', async () => {
    const id = 123
    const payload = { id, name: 'Unit A' }
    const mockResponse = {
      data: {
        data: payload,
        message: 'OK',
        success: true,
      },
    }

    getMock.mockResolvedValue(mockResponse)

    const result = await store._getByIdConsultUnitsBasicData(id)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/${id}`
    )

    expect(result).toEqual(payload)

    expect(showAlertMock).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('returns null and shows error alert when API responds success=false', async () => {
    const id = 456
    const mockResponse = {
      data: {
        data: null,
        message: 'Not found',
        success: false,
      },
    }

    getMock.mockResolvedValue(mockResponse)

    const result = await store._getByIdConsultUnitsBasicData(id)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/${id}`
    )

    expect(result).toBeNull()

    expect(showAlertMock).toHaveBeenCalledWith(
      'Not found',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('returns null and shows processed error when API throws', async () => {
    const id = 789
    const error = new Error('network fail')

    getMock.mockRejectedValue(error)
    showCatchErrorMock.mockReturnValue('Processed error')

    const result = await store._getByIdConsultUnitsBasicData(id)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/${id}`
    )

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Processed error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(result).toBeNull()
  })
})

describe('_getByIdConsultUnitsTable', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = api.executeApi().get

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock
  })

  it('returns data and shows success alert when API responds success=true', async () => {
    const id = 10
    const filters = 'a=1&b=2'
    const payload = { id, unit: 'Unit X' }
    const mockResponse = {
      data: {
        data: payload,
        message: 'OK',
        success: true,
      },
    }

    getMock.mockResolvedValue(mockResponse)

    const result = await store._getByIdConsultUnitsTable(id, filters)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/plan-balance-units/${id}?${filters}`
    )

    expect(result).toEqual(payload)
    expect(showAlertMock).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('returns null and shows error alert when API responds success=false', async () => {
    const id = 20
    const filters = 'q=xyz'
    const mockResponse = {
      data: {
        data: null,
        message: 'No encontrado',
        success: false,
      },
    }

    getMock.mockResolvedValue(mockResponse)

    const result = await store._getByIdConsultUnitsTable(id, filters)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/plan-balance-units/${id}?${filters}`
    )

    expect(result).toBeNull()
    expect(showAlertMock).toHaveBeenCalledWith(
      'No encontrado',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('returns null and shows processed error when API throws', async () => {
    const id = 30
    const filters = ''
    const error = new Error('network fail')

    getMock.mockRejectedValue(error)
    showCatchErrorMock.mockReturnValue('Processed error')

    const result = await store._getByIdConsultUnitsTable(id, filters)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/plan-balance-units/${id}?${filters}`
    )

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Processed error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(result).toBeNull()
  })
})

describe('_getByIdCheckBalancesPlan', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock
  let clearDataSpy: jest.SpyInstance

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    store = useFiduciaryInvestmentPlanStoreV1()

    clearDataSpy = jest.spyOn(store, '_clearData')

    const api = require('@/apis')
    getMock = api.executeApi().get

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock
  })

  it('fetches, maps items and updates pages then shows success alert', async () => {
    const id = 5
    const params = '&q=1'
    const items = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]
    const current_page = 3
    const last_page = 7

    const mockResponse = {
      data: {
        data: {
          data: items,
          current_page,
          last_page,
        },
        message: 'OK',
        success: true,
      },
    }

    getMock.mockResolvedValue(mockResponse)

    await store._getByIdCheckBalancesPlan(id, params)

    expect(clearDataSpy).toHaveBeenCalled()

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/plan-movements/${id}?paginate=1${params}`
    )

    expect(store.check_balances_plan_list).toEqual(
      items.map((it) => ({ ...it }))
    )

    expect(store.check_balances_plan_list_pages.currentPage).toBe(current_page)
    expect(store.check_balances_plan_list_pages.lastPage).toBe(last_page)

    expect(showAlertMock).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles success=false with empty items and shows error alert', async () => {
    const id = 6
    const params = '&filter=test'
    const items: [] = []

    const mockResponse = {
      data: {
        data: {
          data: items,
          current_page: 1,
          last_page: 1,
        },
        message: 'Algo falló',
        success: false,
      },
    }

    getMock.mockResolvedValue(mockResponse)

    await store._getByIdCheckBalancesPlan(id, params)

    expect(store.check_balances_plan_list).toEqual([])
    expect(store.check_balances_plan_list_pages.currentPage).toBe(1)
    expect(store.check_balances_plan_list_pages.lastPage).toBe(1)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Algo falló',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('uses fallback 0 when pages are undefined', async () => {
    const id = 7
    const params = ''
    const items = [{ id: 9 }]

    const mockResponse = {
      data: {
        data: {
          data: items,
          current_page: undefined,
          last_page: undefined,
        },
        message: 'Partial',
        success: true,
      },
    }

    getMock.mockResolvedValue(mockResponse)

    await store._getByIdCheckBalancesPlan(id, params)

    expect(store.check_balances_plan_list).toEqual(
      items.map((it) => ({ ...it }))
    )
    expect(store.check_balances_plan_list_pages.currentPage).toBe(0)
    expect(store.check_balances_plan_list_pages.lastPage).toBe(0)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Partial',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles API error (catch) and shows processed error alert', async () => {
    const id = 8
    const params = '&x=1'
    const error = new Error('network fail')

    getMock.mockRejectedValue(error)
    showCatchErrorMock.mockReturnValue('Processed error')

    const result = await store._getByIdCheckBalancesPlan(id, params)

    expect(result).toBeUndefined()

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Processed error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})

describe('_exportExcelCheckBalancesPlan', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let showAlertMock: jest.Mock
  let getNameBlobMock: jest.Mock
  let downloadBlobXlxxMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = api.executeApi().get

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    getNameBlobMock = composables.getNameBlobMock
    downloadBlobXlxxMock = composables.downloadBlobXlxxMock
  })

  it('should download Excel file successfully', async () => {
    const id = 11
    const params = 'a=1&b=2'
    const mockBinary = new ArrayBuffer(8)
    const mockResponse = {
      data: mockBinary,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    getMock.mockResolvedValue(mockResponse)
    getNameBlobMock.mockReturnValue('plan.xlsx')

    await store._exportExcelCheckBalancesPlan(id, params)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/plan-movements-export/${id}?${params}`,
      { responseType: 'blob' }
    )

    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)

    const callArgs = downloadBlobXlxxMock.mock.calls[0]
    expect(callArgs[0]).toBeInstanceOf(Blob)
    expect(callArgs[1]).toBe('plan.xlsx')

    expect(showAlertMock).toHaveBeenCalledWith(
      'Descarga exitosa',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should show error alert when API fails and not call utils', async () => {
    const id = 22
    const params = ''

    getMock.mockRejectedValue(new Error('network fail'))

    await store._exportExcelCheckBalancesPlan(id, params)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Error al descargar el archivo',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(getNameBlobMock).not.toHaveBeenCalled()
    expect(downloadBlobXlxxMock).not.toHaveBeenCalled()
  })
})

describe('_showBusinessTrustsByHolder', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = api.executeApi().get

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock
  })

  it('should return data when API succeeds with success=true', async () => {
    const id = 33
    const mockData = [{ id: 1, name: 'Trust 1' }]
    getMock.mockResolvedValue({
      data: { data: mockData, message: 'ok', success: true },
    })

    const result = await store._showBusinessTrustsByHolder(id)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-investment-plans/business-trusts-by-holder/${id}`
    )
    expect(result).toEqual(mockData)
    expect(showAlertMock).not.toHaveBeenCalled()
  })

  it('should show error alert and return undefined when API responds with success=false', async () => {
    const id = 44
    getMock.mockResolvedValue({
      data: { data: null, message: 'fail', success: false },
    })

    const result = await store._showBusinessTrustsByHolder(id)

    expect(showAlertMock).toHaveBeenCalledWith(
      'fail',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(result).toBeUndefined()
  })

  it('should show error alert and return null when API fails', async () => {
    const id = 55
    getMock.mockRejectedValue(new Error('network fail'))
    showCatchErrorMock.mockReturnValue('Error message')

    const result = await store._showBusinessTrustsByHolder(id)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Error message',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(result).toBeNull()
  })
})

describe('_clearData', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFiduciaryInvestmentPlanStoreV1()
  })

  it('resets all store fields to their default empty/null values', () => {
    store.fiduciary_investment_plan_list = [
      { id: 1 },
    ] as IFiduciaryInvestmentPlanItem[]
    store.banking_account_list = [
      { id: 2 },
    ] as IFiduciaryInvestmentPlansAccountList[]
    store.data_selection = [
      { id: 1, code: 2 },
    ] as IFiduciaryInvestmentPlanItem[]
    store.data_toggle_status = {
      status_id: 1,
    } as IFiduciaryInvestmentPlansToggleStatus | null
    store.fiduciary_investment_plan_response = {
      id: 3,
    } as IFiduciaryInvestmentPlansForm | null
    store.data_form = { code: 'bar' } as IFiduciaryInvestmentPlansForm | null
    store.fic_manager_profiles = [{ label: 'M' }] as IFicProfileOption[]
    store.fic_advisor_profiles = [{ label: 'A' }] as IFicProfileOption[]
    store.fiduciary_investment_plan_pages = { currentPage: 9, lastPage: 9 }
    store.canceled_fiduciary_investment_plans_list = [
      { fund_code: '4' },
    ] as IFicFiduciaryInvestmentPlansCanceledPlansItemsList[]
    store.canceled_fiduciary_investment_plans_pages = {
      currentPage: 8,
      lastPage: 8,
    }
    store.open_fiduciary_investment_plans_list = [
      { fund_code: '2' },
    ] as IIFicFiduciaryInvestmentPlansOpenPlansItemsList[]
    store.open_fiduciary_investment_plans_pages = {
      currentPage: 7,
      lastPage: 7,
    }
    store.consult_units_basic_data_form = {
      fund_code: 'data',
    } as IFicConsultUnitsDataBasicForm | null
    store.check_balances_by_date_form = {
      date: '2025-01-01',
    } as IFicCheckBalancesView | null

    store._clearData()

    expect(store.fiduciary_investment_plan_list).toEqual([])
    expect(store.banking_account_list).toEqual([])
    expect(store.data_selection).toEqual([])
    expect(store.data_toggle_status).toBeNull()
    expect(store.fiduciary_investment_plan_response).toBeNull()
    expect(store.data_form).toBeNull()
    expect(store.fic_manager_profiles).toEqual([])
    expect(store.fic_advisor_profiles).toEqual([])
    expect(store.fiduciary_investment_plan_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.canceled_fiduciary_investment_plans_list).toEqual([])
    expect(store.canceled_fiduciary_investment_plans_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.open_fiduciary_investment_plans_list).toEqual([])
    expect(store.open_fiduciary_investment_plans_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.consult_units_basic_data_form).toBeNull()
    expect(store.check_balances_by_date_form).toBeNull()
  })

  it('is idempotent: calling clear twice keeps defaults', () => {
    store.fiduciary_investment_plan_list = [
      { id: 1 },
    ] as IFiduciaryInvestmentPlanItem[]
    store._clearData()
    store._clearData()

    expect(store.fiduciary_investment_plan_list).toEqual([])
    expect(store.fiduciary_investment_plan_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})

describe('_dowlanloadReport', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let showAlertMock: jest.Mock
  let getNameBlobMock: jest.Mock
  let downloadBlobXlxxMock: jest.Mock
  let fileNameValidateMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    store = useFiduciaryInvestmentPlanStoreV1()

    const api = require('@/apis')
    getMock = api.executeApi().get

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    getNameBlobMock = composables.getNameBlobMock
    downloadBlobXlxxMock = composables.downloadBlobXlxxMock
    fileNameValidateMock = composables.fileNameValidateMock
  })

  it('downloads report successfully, validates filename and shows success alert', async () => {
    const id = 42
    const params = 'a=1&b=2'

    const mockBinary = new ArrayBuffer(16)
    const mockResponse = {
      data: mockBinary,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    getMock.mockResolvedValue(mockResponse)
    getNameBlobMock.mockReturnValue('raw_name.xlsx')
    fileNameValidateMock.mockReturnValue(
      'Detalle_consulta_unidades_raw_name.xlsx'
    )

    await store._dowlanloadReport(id, params)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/plan-balance-units-export/${id}?${params}`,
      { responseType: 'blob' }
    )

    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
    expect(fileNameValidateMock).toHaveBeenCalledWith(
      'raw_name.xlsx',
      'Detalle_consulta_unidades'
    )

    const callArgs = downloadBlobXlxxMock.mock.calls[0]
    expect(callArgs[0]).toBeInstanceOf(Blob)
    expect(callArgs[1]).toBe('Detalle_consulta_unidades_raw_name.xlsx')

    expect(showAlertMock).toHaveBeenCalledWith(
      'Descarga exitosa',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('shows error alert when API fails and does not call utils', async () => {
    const id = 7
    const params = 'x=1'

    getMock.mockRejectedValue(new Error('network fail'))

    await store._dowlanloadReport(id, params)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Error al descargar el archivo',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(getNameBlobMock).not.toHaveBeenCalled()
    expect(fileNameValidateMock).not.toHaveBeenCalled()
    expect(downloadBlobXlxxMock).not.toHaveBeenCalled()
  })
})

describe('_exportExcelCheckBalancesView', () => {
  let store: ReturnType<typeof useFiduciaryInvestmentPlanStoreV1>
  let getMock: jest.Mock
  let postMock: jest.Mock
  let showAlertMock: jest.Mock
  let getNameBlobMock: jest.Mock
  let downloadBlobXlxxMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    const api = require('@/apis')
    api.executeApi.mockReturnValue({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
    })

    const exec = api.executeApi()
    getMock = exec.get
    postMock = exec.post

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    getNameBlobMock = composables.getNameBlobMock
    downloadBlobXlxxMock = composables.downloadBlobXlxxMock

    store = useFiduciaryInvestmentPlanStoreV1()
  })

  it('downloads file successfully, calls utils and shows success alert', async () => {
    const id = 99
    const params = 'a=1&b=2'

    const mockBinary = new ArrayBuffer(12)
    const mockResponse = {
      data: mockBinary,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    getMock.mockResolvedValue(mockResponse)
    getNameBlobMock.mockReturnValue('balance_view.xlsx')

    await store._exportExcelCheckBalancesView(true, id, params)

    expect(getMock).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/detail-plan-balance-returns/balance-online-contribution-control-export?plan_id=${id}&${params}`,
      {
        responseType: 'blob',
      }
    )

    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
    expect(downloadBlobXlxxMock).toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith(
      'Descarga exitosa',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('shows error alert when API fails and does not call utils', async () => {
    postMock.mockRejectedValue(new Error('network fail'))

    await store._exportExcelCheckBalancesView(false, 7, 'x=9')

    expect(showAlertMock).toHaveBeenCalledWith(
      'Error al descargar el archivo',
      'error',
      undefined,
      TIMEOUT_ALERT
    )

    expect(getNameBlobMock).not.toHaveBeenCalled()
    expect(downloadBlobXlxxMock).not.toHaveBeenCalled()
  })
})
