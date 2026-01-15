import { useOperatingOfficesStoreV1 } from './operating-offices-v1'
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IOperatingOfficeExtended } from '@/interfaces/customs/fics/OperatingOffices'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({
    showAlert: jest.fn(),
  })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
}))

describe('useOperatingOfficesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // -------------------------------------------------------------
  // LIST
  // -------------------------------------------------------------
  it('fetches list and updates state on success', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'List loaded',
        data: {
          data: [{ id: 1, name: 'Main' }],
          current_page: 2,
          last_page: 4,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getOperatingOfficesList({ type: 1 })

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_FICS}/operating-offices`, {
      params: { type: 1, paginate: 1 },
    })

    expect(store.operating_offices_list).toEqual([{ id: 1, name: 'Main' }])
    expect(store.operating_offices_pages).toEqual({
      currentPage: 2,
      lastPage: 4,
    })
  })

  it('handles error in list fetch', async () => {
    const store = useOperatingOfficesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getOperatingOfficesList({ type: 1 })

    expect(mockGet).toHaveBeenCalled()
    expect(store.operating_offices_list).toEqual([])
    expect(store.operating_offices_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  // -------------------------------------------------------------
  // SHOW BY ID
  // -------------------------------------------------------------
  it('fetches a record by ID successfully', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Found',
        data: { id: 1, name: 'Office A' },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdOperatingOffices(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_FICS}/operating-offices/1`)

    expect(store.operating_offices_response).toEqual({
      id: 1,
      name: 'Office A',
    })
  })

  it('handles error fetching record by ID', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdOperatingOffices(1)

    expect(mockGet).toHaveBeenCalled()
    expect(store.operating_offices_response).toEqual({})
  })

  // -------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------
  it('creates a record successfully', async () => {
    const store = useOperatingOfficesStoreV1()

    const payload = { id: 1, regional_code: 'New Office' }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createOperatingOffices(
      payload as IOperatingOfficeExtended
    )

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/operating-offices`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error in create', async () => {
    const store = useOperatingOfficesStoreV1()

    const payload = { id: 1, regional_code: 'Error Office' }

    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createOperatingOffices(
      payload as IOperatingOfficeExtended
    )

    expect(result).toBe(false)
  })

  // -------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------
  it('updates a record successfully', async () => {
    const store = useOperatingOfficesStoreV1()

    const payload = { id: 1, regional_code: 'Updated Office' }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateOperatingOffices(
      payload as IOperatingOfficeExtended,
      1
    )

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/operating-offices/1`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error in update', async () => {
    const store = useOperatingOfficesStoreV1()

    const payload = { id: 1, regional_code: 'Fail' }

    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateOperatingOffices(
      payload as IOperatingOfficeExtended,
      1
    )

    expect(result).toBe(false)
  })

  // -------------------------------------------------------------
  // PATCH (toggle-status)
  // -------------------------------------------------------------
  it('toggles status successfully', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Toggled' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._patchOperatingOffices(1)

    expect(mockPatch).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/operating-offices/1/toggle-status`
    )
    expect(result).toBe(true)
  })

  it('handles error in patch', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockPatch = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._patchOperatingOffices(1)
    expect(result).toBe(false)
  })

  // -------------------------------------------------------------
  // SET DATA
  // -------------------------------------------------------------
  it('sets data_information_form correctly', async () => {
    const store = useOperatingOfficesStoreV1()

    store._setDataOperatingOffices({
      id: 2,
      regional_code: 'Test',
    } as IOperatingOfficeExtended | null)
    expect(store.data_information_form).toEqual({
      id: 2,
      regional_code: 'Test',
    })

    store._setDataOperatingOffices(null)
    expect(store.data_information_form).toBe(null)
  })

  // -------------------------------------------------------------
  // CLEAR DATA
  // -------------------------------------------------------------
  it('clears data correctly', () => {
    const store = useOperatingOfficesStoreV1()

    store.operating_offices_list = [{ id: 1 }] as IOperatingOfficeExtended[]
    store.data_information_form = { id: 2 } as IOperatingOfficeExtended | null
    store.operating_offices_response = { id: 3 } as IOperatingOfficeExtended

    store._clearData()

    expect(store.operating_offices_list).toEqual([])
    expect(store.data_information_form).toBe(null)
    expect(store.operating_offices_response).toEqual({})
  })

  it('fetches list but backend returns success false', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockResponse = {
      data: {
        success: false,
        message: 'Failed but 200 OK',
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getOperatingOfficesList({ type: 1 })

    expect(store.operating_offices_list).toEqual([])
    expect(store.operating_offices_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('get by ID resolves but success is false', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockResponse = {
      data: {
        success: false,
        message: 'Not found',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdOperatingOffices(1)

    expect(store.operating_offices_response).toEqual({}) 
  })

  it('create resolves but success is false', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error creating' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createOperatingOffices({
      id: 1,
    } as IOperatingOfficeExtended)

    expect(result).toBe(false)
  })

  it('update resolves but success is false', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Update fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateOperatingOffices(
      { id: 1 } as IOperatingOfficeExtended,
      1
    )

    expect(result).toBe(false)
  })

  it('patch resolves but success is false', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Patch fail' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._patchOperatingOffices(1)

    expect(result).toBe(false)
  })

  it('calls showAlert on create success', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created!' },
    })

    const mockAlert = { showAlert: jest.fn() }

    // override composable
    jest.mocked(require('@/composables').useAlert).mockReturnValue(mockAlert)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._createOperatingOffices({ id: 1 } as IOperatingOfficeExtended)

    expect(mockAlert.showAlert).toHaveBeenCalledWith(
      'Created!',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('calls showCatchError when create throws error', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockPost = jest.fn().mockRejectedValue(new Error('boom'))

    const mockShowError = {
      showCatchError: jest.fn(),
    }

    jest
      .mocked(require('@/composables').useShowError)
      .mockReturnValue(mockShowError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._createOperatingOffices({ id: 1 } as IOperatingOfficeExtended)

    expect(mockShowError.showCatchError).toHaveBeenCalled()
  })

  it('calls showAlert on patch success', async () => {
    const store = useOperatingOfficesStoreV1()

    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Toggled!' },
    })

    const mockAlert = { showAlert: jest.fn() }

    jest.mocked(require('@/composables').useAlert).mockReturnValue(mockAlert)
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    await store._patchOperatingOffices(5)

    expect(mockAlert.showAlert).toHaveBeenCalledWith(
      'Toggled!',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
