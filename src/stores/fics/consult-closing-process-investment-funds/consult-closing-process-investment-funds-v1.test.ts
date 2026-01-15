// Apis - Pinia
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IFicFundBusinessLine } from '@/interfaces/customs/fics/ConsultClosingProcessInvestmentFunds'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useConsultClosingProcessInvestmentFundsStoreV1 } from './consult-closing-process-investment-funds-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(() => 'test.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useConsultClosingProcessInvestmentFundsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches participation types list successfully', async () => {
    const store = useConsultClosingProcessInvestmentFundsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Fetched successfully',
        data: {
          data: [{ id: 1, name: 'Type A' }],
          current_page: 1,
          last_page: 2,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ page: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/collective-investment-funds/participation-types`,
      { params: { page: 1, paginate: 1 } }
    )
    expect(store.participation_type_list).toEqual([{ id: 1, name: 'Type A' }])
    expect(store.participation_type_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('handles error in participation types fetch', async () => {
    const store = useConsultClosingProcessInvestmentFundsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ page: 1 })

    expect(mockGet).toHaveBeenCalled()
    expect(store.participation_type_list).toEqual([])
    expect(store.participation_type_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('fetches detailed movements list successfully', async () => {
    const store = useConsultClosingProcessInvestmentFundsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Details fetched',
        data: {
          data: [{ id: 5, description: 'Movement A' }],
          current_page: 2,
          last_page: 3,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listDetailAction({ fundId: 10 })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/closing-funds/detailed-movements?include[]=movement`,
      { params: { fundId: 10, paginate: 1 } }
    )
    expect(store.movements_list).toEqual([{ id: 5, description: 'Movement A' }])
    expect(store.movements_pages).toEqual({
      currentPage: 2,
      lastPage: 3,
    })
  })

  it('handles error in detailed movements fetch', async () => {
    const store = useConsultClosingProcessInvestmentFundsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listDetailAction({ fundId: 99 })

    expect(mockGet).toHaveBeenCalled()
    expect(store.movements_list).toEqual([])
    expect(store.movements_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('exports excel successfully', async () => {
    const store = useConsultClosingProcessInvestmentFundsStoreV1()
    const mockBlob = new Blob(['excel data'], {
      type: 'application/vnd.ms-excel',
    })
    const mockResponse = {
      data: mockBlob,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    const mockGetNameBlob = jest.fn(() => 'export.xlsx')
    const mockDownloadBlobXlxx = jest.fn()
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    ;(useUtils as jest.Mock).mockReturnValue({
      getNameBlob: mockGetNameBlob,
      downloadBlobXlxx: mockDownloadBlobXlxx,
    })

    await store._exportExcelAction('fundId=5')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/closing-funds/export-closure-process?fundId=5`,
      { responseType: 'blob' }
    )
    expect(mockGetNameBlob).toHaveBeenCalled()
    expect(mockDownloadBlobXlxx).toHaveBeenCalled()
  })

  it('handles error in excel export', async () => {
    const store = useConsultClosingProcessInvestmentFundsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportExcelAction('fundId=5')

    expect(mockGet).toHaveBeenCalled()
  })

  it('clears participation types data', () => {
    const store = useConsultClosingProcessInvestmentFundsStoreV1()
    store.participation_type_list = [{ id: 1 }] as IFicFundBusinessLine[]
    store.participation_type_pages = { currentPage: 3, lastPage: 5 }

    store._clearData()

    expect(store.participation_type_list).toEqual([])
    expect(store.participation_type_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('clears movements data', () => {
    const store = useConsultClosingProcessInvestmentFundsStoreV1()
    store.participation_type_list = [
      {
        id: 1,
        value: 1,
        movement: {
          code: '',
          description: '',
          movement_nature_description: '',
        },
      },
    ] as unknown as IFicFundBusinessLine[]

    store.movements_pages = { currentPage: 4, lastPage: 6 }

    store._clearDetailData()

    expect(store.movements_list).toEqual([])
    expect(store.movements_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
