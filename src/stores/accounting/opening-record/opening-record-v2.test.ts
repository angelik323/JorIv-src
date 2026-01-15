import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useOpeningRecordV2 } from './opening-record-v2'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { IOpeningRecord } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error procesando'),
  })),
  useMainLoader: jest.fn(() => ({ openMainLoader: jest.fn() })),
}))

jest.mock('@/composables/useUtils', () => ({
  useUtils: () => ({
    defaultIconsLucide: {},
  }),
}))

describe('useOpeningRecordV2 store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches opening records successfully', async () => {
    const store = useOpeningRecordV2()

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'OK',
        data: {
          data: [{ id: 1, code: 'A', name: 'Registro A' }],
          current_page: 1,
          last_page: 1,
        },
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&limit=10')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/reportables/business-trust-reports?&limit=10`,
      { params: { paginate: 1 } }
    )

    expect(store.opening_record_list).toEqual([
      { id: 1, code: 'A', name: 'Registro A' },
    ])
    expect(store.opening_record_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('handles error when fetching opening records', async () => {
    const store = useOpeningRecordV2()

    const mockGet = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&limit=10')

    expect(store.opening_record_list).toEqual([])
  })

  it('updates opening record successfully', async () => {
    const store = useOpeningRecordV2()

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateOpeningRecord(1, 1, {})

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/accounting-period-opening/1/1`,
      {}
    )
    expect(result).toBe(true)
  })

  it('returns false when update fails', async () => {
    const store = useOpeningRecordV2()

    const mockPut = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateOpeningRecord(1, 1, {})

    expect(result).toBe(false)
  })

  it('gets opening record by id successfully', async () => {
    const store = useOpeningRecordV2()

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: { id: 1, name: 'Uno' },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getOpeningRecord(1, 1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/accounting-period-opening/1/1`
    )
    expect(result).toEqual({ id: 1, name: 'Uno' })
  })

  it('returns null when get by id fails', async () => {
    const store = useOpeningRecordV2()

    const mockGet = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getOpeningRecord(1, 1)

    expect(result).toBeNull()
  })

  it('toggles opening record status successfully', async () => {
    const store = useOpeningRecordV2()

    store._selectOpeningRecord({ id: 10, status_id: 1 } as IOpeningRecord)

    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._toggleOpeningRecordStatus()

    expect(mockPatch).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/accounting-period-opening/10/status`,
      { status_id: 2 }
    )
    expect(result).toBe(true)
  })
})
