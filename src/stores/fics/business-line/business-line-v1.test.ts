// Vue - Vue Router - Pinia - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import { BusinessLineType } from '@/interfaces/customs/fics/BusinessLine'

// Utils
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useBusinessLineV1 } from './business-line-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
  useUtils: jest.fn(() => ({
    formatParamsCustom: jest.fn((obj: object) => {
      return Object.entries(obj)
        .filter(([_, value]) => value !== null && value !== 0 && value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join('&')
    }),
  })),
}))

const URL_PATH = `${URL_PATH_FICS}/business-lines-participation-types`

describe('useBusinessLineV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list and updates state on success', async () => {
    const store = useBusinessLineV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'List fetched',
        data: {
          data: [{ id: 1, code: 'X', description: 'Desc', type: 1 }],
          current_page: 1,
          last_page: 2,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getBusinessLineList('filter[search]=test')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH}/get-index?paginate=1&filter[search]=test&filter[type]=1`
    )
    expect(store.business_line_list).toEqual(mockResponse.data.data.data)
    expect(store.business_line_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('handles error in list fetch', async () => {
    const store = useBusinessLineV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getBusinessLineList('filter[search]=test')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH}/get-index?paginate=1&filter[search]=test&filter[type]=1`
    )
    expect(store.business_line_list).toEqual([])
    expect(store.business_line_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('creates a record successfully', async () => {
    const store = useBusinessLineV1()
    const payload = {
      code: '001',
      description: 'Negocio Test',
      type: 1,
    }

    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Created' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createBusinessLine(payload)
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(typeof result).toBe('boolean')
  })

  it('handles error in create', async () => {
    const store = useBusinessLineV1()
    const payload = { code: '001', description: 'Negocio Test', type: 1 }

    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createBusinessLine(payload)
    expect(typeof result).toBe('boolean')
  })

  it('fetches single record successfully', async () => {
    const store = useBusinessLineV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Record fetched',
        data: {
          id: 5,
          code: 'B1',
          description: 'Linea Test',
          initial_status_id: 10,
          status_id: 10,
          type: 1,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getBusinessLine(5)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/get-by-id/5`)
    expect(typeof result).toBe('boolean')
    expect(store.business_line).toEqual(mockResponse.data.data)
    expect(store.selected_type).toBe(store.business_lines_name)
  })

  it('handles error in fetch by ID', async () => {
    const store = useBusinessLineV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getBusinessLine(99)
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/get-by-id/99`)
    expect(typeof result).toBe('boolean')
    expect(store.business_line).toEqual({})
  })

  it('updates a record successfully', async () => {
    const store = useBusinessLineV1()
    const mockPut = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Updated' } })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = { code: '002', description: 'Edit', type: 1 }
    const result = await store._updateBusinessLine(2, payload)

    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/2`, payload)
    expect(typeof result).toBe('boolean')
  })

  it('handles error in update', async () => {
    const store = useBusinessLineV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateBusinessLine(2, {
      code: '002',
      description: 'Error',
      type: 1,
    })

    expect(result).toBe(false)
  })

  it('clears data', () => {
    const store = useBusinessLineV1()
    store.business_line_list = [
      { id: 1, code: 'TST', description: 'Linea test', type: 1 },
    ]
    store.business_line_pages = { currentPage: 2, lastPage: 4 }

    store._cleanData()

    expect(store.business_line_list).toEqual([])
    expect(store.business_line_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.business_line).toEqual({})
  })

  it('returns correct typeName and typeId for participation type', () => {
    const store = useBusinessLineV1()
    store.selected_type = store.participation_types_name as BusinessLineType

    expect(store.typeName).toBe('tipo de participación')
    expect(store.typeId).toBe(2)
  })

  it('handles create with success=false', async () => {
    const store = useBusinessLineV1()
    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: false, message: 'Error create' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = { code: '003', description: 'Fail create', type: 1 }
    const result = await store._createBusinessLine(payload)
    expect(result).toBe(false)
  })

  it('sets selected_type to participation_types_name when type is 2', async () => {
    const store = useBusinessLineV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Record fetched',
        data: {
          id: 10,
          code: 'B2',
          description: 'Tipo participación',
          status_id: 5,
          type: 2,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getBusinessLine(10)
    expect(store.selected_type).toBe(store.participation_types_name)
  })

  it('handles update with success=false', async () => {
    const store = useBusinessLineV1()
    const mockPut = jest
      .fn()
      .mockResolvedValue({ data: { success: false, message: 'Update fail' } })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateBusinessLine(3, {
      code: '004',
      description: 'Bad update',
      type: 1,
    })
    expect(result).toBe(false)
  })
})
