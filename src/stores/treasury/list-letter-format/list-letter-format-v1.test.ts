import { setActivePinia, createPinia } from 'pinia'
import { useLetterFormatStoreV1 } from './list-letter-format-v1'
import { executeApi } from '@/apis'
import {
  ICreateLetterFormatPayload,
  ILetterFormat,
  ILetterFormatResponse,
} from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

let mockShowAlert: jest.Mock
let mockShowCatchError: jest.Mock

jest.mock('@/composables', () => {
  mockShowAlert = jest.fn()
  mockShowCatchError = jest.fn().mockReturnValue('Error catch')

  return {
    useAlert: () => ({ showAlert: mockShowAlert }),
    useShowError: () => ({ showCatchError: mockShowCatchError }),
  }
})

describe('useLetterFormatStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const letterFormatPayload: ILetterFormat = {
    id: 1,
    format_code: 'F001',
    bank_code: '001',
    bank_name: 'Banco A',
    format: '',
    format_name: 'Carta prueba',
    name: 'Carta prueba',
    status: {
      id: 1,
      status: 'Activo',
    },
    created_at: '2025-08-06',
    updated_at: '2025-08-06',
    definition: '',
    variables: [],
    tables: [],
    creator_data: '',
    update_data: '',
  }

  const createLetterFormatPayload: ICreateLetterFormatPayload = {
    format_code: 'F001',
    name: 'Carta prueba',
    bank_id: 1,
    status_id: 1,
    format_definition: '<p>Hola</p>',
  }

  const letterFormatResponse: ILetterFormatResponse = {
    id: 1,
    format_code: 'F001',
    format_name: 'Carta prueba',
    bank_code: '001',
    bank_name: 'Banco A',
    definition: '',
    variables: [],
    tables: [],
  }

  it('should fetch letter format list successfully', async () => {
    const store = useLetterFormatStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: [letterFormatPayload],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/letter-formats`
    )
    expect(store.letter_format_list).toMatchObject([letterFormatPayload])
    expect(store.letter_format_pages).toMatchObject({
      currentPage: 1,
      lastPage: 1,
    })
    expect(mockShowAlert).toHaveBeenCalledWith('OK', 'success', undefined, 3000)
  })

  it('should handle failure when fetching list', async () => {
    const store = useLetterFormatStoreV1()
    const mockResponse = {
      data: { success: false, message: 'Error', data: null },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')
    expect(store.letter_format_list).toEqual([])
    expect(store.letter_format_pages).toMatchObject({
      currentPage: 0,
      lastPage: 0,
    })
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error',
      'error',
      undefined,
      3000
    )
  })

  it('should handle catch error on _getListAction', async () => {
    const store = useLetterFormatStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('get error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should create letter format successfully', async () => {
    const store = useLetterFormatStoreV1()
    const mockResponse = { data: { success: true, message: 'Creado' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createLetterFormat(createLetterFormatPayload)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/letter-formats`,
      createLetterFormatPayload
    )
    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Creado',
      'success',
      undefined,
      3000
    )
  })

  it('should handle failure when creating', async () => {
    const store = useLetterFormatStoreV1()
    const mockResponse = { data: { success: false, message: 'Error' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createLetterFormat(createLetterFormatPayload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error',
      'error',
      undefined,
      3000
    )
  })

  it('should handle catch error on _createLetterFormat', async () => {
    const store = useLetterFormatStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('post error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createLetterFormat(createLetterFormatPayload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should update letter format successfully', async () => {
    const store = useLetterFormatStoreV1()
    const mockResponse = { data: { success: true, message: 'Actualizado' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateLetterFormat(1, { format_name: 'Nuevo' })
    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Actualizado',
      'success',
      undefined,
      3000
    )
  })

  it('should get letter format by id successfully', async () => {
    const store = useLetterFormatStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Encontrado',
        data: letterFormatResponse,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getLetterFormat(1)
    expect(result).toMatchObject(letterFormatResponse)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Encontrado',
      'success',
      undefined,
      3000
    )
  })

  it('should return null if not found', async () => {
    const store = useLetterFormatStoreV1()
    const mockResponse = {
      data: { success: false, message: 'No encontrado', data: null },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getLetterFormat(999)
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'No encontrado',
      'error',
      undefined,
      3000
    )
  })

  it('should handle catch error on _getLetterFormat', async () => {
    const store = useLetterFormatStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getLetterFormat(1)
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should delete letter format successfully', async () => {
    const store = useLetterFormatStoreV1()
    const mockResponse = { data: { success: true, message: 'Eliminado' } }
    const mockDelete = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteLetterFormat(1)
    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Eliminado',
      'success',
      undefined,
      3000
    )
  })

  it('should handle failure when deleting letter format', async () => {
    const store = useLetterFormatStoreV1()
    const mockResponse = {
      data: { success: false, message: 'Error al eliminar' },
    }
    const mockDelete = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteLetterFormat(99)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error al eliminar',
      'error',
      undefined,
      3000
    )
  })

  it('should handle catch error on _deleteLetterFormat', async () => {
    const store = useLetterFormatStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('delete error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteLetterFormat(1)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should export letter format successfully', async () => {
    const store = useLetterFormatStoreV1()
    const mockBlob = new Blob(['test'], { type: 'application/pdf' })
    const mockGet = jest.fn().mockResolvedValue({ data: mockBlob })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._exportLetterFormat(1)
    expect(result).toBeInstanceOf(Blob)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/letter-formats/1/download`,
      { responseType: 'blob' }
    )
  })

  it('should handle catch error on _exportLetterFormat', async () => {
    const store = useLetterFormatStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('export error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._exportLetterFormat(1)
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should select letter format', () => {
    const store = useLetterFormatStoreV1()
    store._selectLetterFormat(letterFormatPayload)
    expect(store.selected_letter_format).toMatchObject(letterFormatPayload)
  })

  it('should fetch filter options successfully', async () => {
    const store = useLetterFormatStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Opciones cargadas',
        data: {
          status_id: [
            { label: 'Activo', value: 1 },
            { label: 'Inactivo', value: 0 },
          ],
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getFilterOptions()
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/letter-format/filter-options`
    )
    expect(store.filter_options).toEqual(mockResponse.data.data)
    expect(result).toEqual(mockResponse.data.data)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Opciones cargadas',
      'success',
      undefined,
      3000
    )
  })

  it('should handle error in _getFilterOptions', async () => {
    const store = useLetterFormatStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail options'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getFilterOptions()
    expect(result).toEqual({})
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should toggle letter format status successfully', async () => {
    const store = useLetterFormatStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Estado actualizado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    store.selected_letter_format = {
      ...letterFormatPayload,
      status: {
        id: 1,
        status: 'Activo',
      },
    }

    await store._toggleLetterFormatStatus()

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/letter-formats/1/status`,
      { status_id: 2 }
    )

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Estado actualizado',
      'success',
      undefined,
      3000
    )
  })

  it('should handle catch error on _toggleLetterFormatStatus', async () => {
    const store = useLetterFormatStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('toggle error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    store.selected_letter_format = {
      ...letterFormatPayload,
      status: {
        id: 1,
        status: 'Activo',
      },
    }

    await store._toggleLetterFormatStatus()

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should handle failure when updating letter format', async () => {
    const store = useLetterFormatStoreV1()
    const mockResponse = {
      data: { success: false, message: 'No actualizado' },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateLetterFormat(1, { name: 'Otro nombre' })

    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'No actualizado',
      'error',
      undefined,
      3000
    )
  })

  it('should handle catch error on _updateLetterFormat', async () => {
    const store = useLetterFormatStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('put error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateLetterFormat(1, { name: 'Fallo' })

    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })
})
