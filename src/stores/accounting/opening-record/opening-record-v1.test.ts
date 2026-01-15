import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useOpeningRecordV1 } from './opening-record-v1'
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

jest.mock('@/composables', () => {
  const mockShowAlert = jest.fn()
  const mockShowCatchError = jest.fn().mockReturnValue('Error procesando')

  return {
    useAlert: () => ({ showAlert: mockShowAlert }),
    useShowError: () => ({ showCatchError: mockShowCatchError }),
    __esModule: true,
  }
})

describe('useOpeningRecordV1 store', () => {
  let mockShowAlert: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    const { useAlert } = require('@/composables')
    mockShowAlert = useAlert().showAlert
  })

  it('fetches list opening record successfully and updates state', async () => {
    const store = useOpeningRecordV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: { data: [{ id: 1, code: 'A', name: 'Registro A' }] },
        message: 'Lista cargada',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListOpeningRecord('&limit=10')

    expect(store.opening_record_list).toEqual([
      { id: 1, code: 'A', name: 'Registro A' },
    ])
    expect(store.opening_record_pages).toEqual({ currentPage: 1, lastPage: 1 })
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/accounting-period-opening/list-business-trusts?paginate=1&limit=10`
    )
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Lista cargada',
      'success',
      undefined,
      3000
    )
  })

  it('handles error in _getListOpeningRecord', async () => {
    const store = useOpeningRecordV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListOpeningRecord('&limit=10')

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error procesando',
      'error',
      undefined,
      3000
    )
  })

  it('fetches list successfully and updates state', async () => {
    const store = useOpeningRecordV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: { data: [{ id: 1, code: 'A', name: 'Registro A' }] },
        message: 'Lista cargada',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&limit=10')

    expect(store.opening_record_list).toEqual([
      { id: 1, code: 'A', name: 'Registro A' },
    ])
    expect(store.opening_record_pages).toEqual({ currentPage: 1, lastPage: 1 })
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/reportables/business-trust-reports?&limit=10`,
      {
        params: { paginate: 1 },
      }
    )
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Lista cargada',
      'success',
      undefined,
      3000
    )
  })

  it('handles error in _getListAction', async () => {
    const store = useOpeningRecordV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&limit=10')

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error procesando',
      'error',
      undefined,
      3000
    )
  })

  it('creates record successfully', async () => {
    const store = useOpeningRecordV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      accounting_structure_id: 1,
      from_business: 1,
      to_business: 2,
      leave_in_period: '2023-12',
      current_period: '2023-12',
      accounts_chart_id: 1,
      business_ids: [1],
    }

    const result = await store._createOpeningRecord(payload)

    expect(result).toEqual({ message: 'Creado', success: true })
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/accounting-period-opening/execute`,
      payload
    )
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Creado',
      'success',
      undefined,
      3000
    )
  })

  it('handles error in create', async () => {
    const store = useOpeningRecordV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createOpeningRecord({
      accounting_structure_id: 1,
      accounts_chart_id: 1,
      from_business: 1,
      to_business: 1,
      business_ids: [1],
    })

    expect(result).toBe(null)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error procesando',
      'error',
      undefined,
      3000
    )
  })

  it('updates record successfully', async () => {
    const store = useOpeningRecordV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateOpeningRecord(1, 1, {})

    expect(result).toBe(true)
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/accounting-period-opening/1/1`,
      {}
    )
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Actualizado',
      'success',
      undefined,
      3000
    )
  })

  it('returns false if update fails', async () => {
    const store = useOpeningRecordV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateOpeningRecord(1, 1, {})

    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error procesando',
      'error',
      undefined,
      3000
    )
  })

  it('gets record by id', async () => {
    const store = useOpeningRecordV1()
    const mockData = { id: 1, name: 'Uno' }
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, data: mockData, message: 'OK' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getOpeningRecord(1, 1)

    expect(result).toEqual(mockData)
    expect(mockShowAlert).toHaveBeenCalledWith('OK', 'success', undefined, 3000)
  })

  it('returns null if get by id fails', async () => {
    const store = useOpeningRecordV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getOpeningRecord(1, 1)

    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error procesando',
      'error',
      undefined,
      3000
    )
  })

  it('gets codes and names', async () => {
    const store = useOpeningRecordV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { data: [{ code: 'A1', name: 'Registro 1' }] },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getOpeningRecordCodesAndNames()

    expect(result).toEqual([{ code: 'A1', name: 'Registro 1' }])
  })

  it('returns [] if get codes and names fails', async () => {
    const store = useOpeningRecordV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getOpeningRecordCodesAndNames()

    expect(result).toEqual(null)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error procesando',
      'error',
      undefined,
      3000
    )
  })

  it('fetches eligible business list', async () => {
    const store = useOpeningRecordV1()
    const mockData = [{ id: 1, name: 'Negocio 1' }]
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, data: mockData, message: 'OK' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getOpeningRecordBusinessListing({
      accounting_structure_id: 1,
      period: '2023-10',
    })

    expect(store.opening_bussines_list).toEqual(mockData)
    expect(mockShowAlert).toHaveBeenCalledWith('OK', 'success', undefined, 3000)
  })

  it('handles error in business listing', async () => {
    const store = useOpeningRecordV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getOpeningRecordBusinessListing({
      accounting_structure_id: 1,
      period: '2023-10',
    })

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error procesando',
      'error',
      undefined,
      3000
    )
  })

  it('toggles status of selected record', async () => {
    const store = useOpeningRecordV1()
    store._selectOpeningRecord({ id: 10, status_id: 1 } as IOpeningRecord)

    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'OK' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._toggleOpeningRecordStatus()

    expect(result).toBe(true)
    expect(mockPatch).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/accounting-period-opening/10/status`,
      {
        status_id: 2,
      }
    )
    expect(mockShowAlert).toHaveBeenCalledWith('OK', 'success', undefined, 3000)
  })
})
