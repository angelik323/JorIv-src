import { setActivePinia, createPinia } from 'pinia'
import { useBankStructuresV1 } from './bank-structures-v1'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import {
  IFormatDefinitionForm,
  IRecordTypeForm,
  IRecordColumnsForm,
} from '@/interfaces/customs/treasury/BankStructures'

const URL_PATH_FORMAT_DEFINITION = `${URL_PATH_TREASURIES}/bank-structures`
const URL_PATH_RECORD_COLUMNS = `${URL_PATH_TREASURIES}/record-columns`
const URL_PATH_RECORD_TYPE = `${URL_PATH_TREASURIES}/record-types`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const useAlert = jest.fn(() => ({ showAlert: jest.fn() }))
  const useShowError = jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error!'),
  }))
  return { useAlert, useShowError }
})

describe('useBankStructuresV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // --- FORMAT DEFINITION ---
  it('should fetch list of format definitions', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [{ id: 1, name: 'Format 1' }],
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = 'foo=bar'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListFormatDefinition(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FORMAT_DEFINITION}?paginate=1&${params}`
    )
    expect(store.data_format_definition_list).toEqual([
      { id: 1, name: 'Format 1' },
    ])
    expect(store.pages_format_definition.currentPage).toBe(1)
    expect(store.pages_format_definition.lastPage).toBe(2)
  })

  it('should handle error when fetching format definitions', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = 'foo=bar'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListFormatDefinition(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FORMAT_DEFINITION}?paginate=1&${params}`
    )
    expect(store.data_format_definition_list).toEqual([])
  })

  it('should create a new format definition', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const form: IFormatDefinitionForm = {
      bank_id: 1,
      origin_id: 1,
      description: 'desc',
      format_type_id: 1,
      validation_type_id: 1,
      generated_file_name: 'file.txt',
      dispersal_group: false,
      generation_time: false,
      date: false,
      file_extension_id: 1,
      path: '/tmp',
      applies_to_dispersal: false,
      equivalence_validation: false,
      file_type_id: 1,
      separator: ',',
      numeric_mask_id: 1,
      value_mask_id: 1,
      date_mask_id: 1,
    }
    store.data_format_definition_form = form
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createFormatDefinition()

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH_FORMAT_DEFINITION}`, form)
    expect(result).toBe(true)
    expect(store.data_format_definition_form).toEqual({})
  })

  it('should not clear form if creation fails', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const form: IFormatDefinitionForm = {
      bank_id: 1,
      origin_id: 1,
      description: 'desc',
      format_type_id: 1,
      validation_type_id: 1,
      generated_file_name: 'file.txt',
      dispersal_group: false,
      generation_time: false,
      date: false,
      file_extension_id: 1,
      path: '/tmp',
      applies_to_dispersal: false,
      equivalence_validation: false,
      file_type_id: 1,
      separator: ',',
      numeric_mask_id: 1,
      value_mask_id: 1,
      date_mask_id: 1,
    }
    store.data_format_definition_form = form
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createFormatDefinition()

    // Assert
    expect(result).toBe(false)
    expect(store.data_format_definition_form).toEqual(form)
  })

  it('should update a format definition', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const form: IFormatDefinitionForm = {
      bank_id: 1,
      origin_id: 1,
      description: 'desc',
      format_type_id: 1,
      validation_type_id: 1,
      generated_file_name: 'file.txt',
      dispersal_group: false,
      generation_time: false,
      date: false,
      file_extension_id: 1,
      path: '/tmp',
      applies_to_dispersal: false,
      equivalence_validation: false,
      file_type_id: 1,
      separator: ',',
      numeric_mask_id: 1,
      value_mask_id: 1,
      date_mask_id: 1,
    }
    store.data_format_definition_form = form
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateFormatDefinition(1)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FORMAT_DEFINITION}/1`,
      form
    )
    expect(result).toBe(true)
  })

  it('should delete a format definition', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteFormatDefinition(1)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH_FORMAT_DEFINITION}/1`)
    expect(result).toBe(true)
  })

  it('should fetch format definition by id', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Found',
        data: { id: 1, name: 'Format 1' },
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getFormatDefinitionById(1)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_FORMAT_DEFINITION}/1`)
    expect(result).toEqual({ id: 1, name: 'Format 1' })
  })

  it('should handle error when fetching format definition by id', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getFormatDefinitionById(1)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_FORMAT_DEFINITION}/1`)
    expect(result).toEqual({})
  })

  // --- RECORD TYPE ---
  it('should fetch list of record types', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [{ id: 2, name: 'Type 1' }],
          current_page: 1,
          last_page: 1,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = 'foo=bar'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListRecordType(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_RECORD_TYPE}?paginate=1&${params}`
    )
    expect(store.data_record_type_list).toEqual([{ id: 2, name: 'Type 1' }])
    expect(store.pages_record_type.currentPage).toBe(1)
    expect(store.pages_record_type.lastPage).toBe(1)
  })

  it('should handle error when fetching record types', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = 'foo=bar'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListRecordType(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_RECORD_TYPE}?paginate=1&${params}`
    )
    expect(store.data_record_type_list).toEqual([])
  })

  it('should create a new record type', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const form: IRecordTypeForm = {
      bank_structure_id: 1,
      order: 1,
      name: 'Type A',
      record_type_id: 1,
    }
    store.data_record_type_form = form
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createRecordType()

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH_RECORD_TYPE}`, form)
    expect(result).toBe(true)
    expect(store.data_record_type_form).toEqual({})
  })

  it('should not clear record type form if creation fails', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const form: IRecordTypeForm = {
      bank_structure_id: 1,
      order: 1,
      name: 'Type A',
      record_type_id: 1,
    }
    store.data_record_type_form = form
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createRecordType()

    // Assert
    expect(result).toBe(false)
    expect(store.data_record_type_form).toEqual(form)
  })

  it('should update a record type', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const form: IRecordTypeForm = {
      bank_structure_id: 1,
      order: 1,
      name: 'Type Updated',
      record_type_id: 1,
    }
    store.data_record_type_form = form
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateRecordType(2)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH_RECORD_TYPE}/2`, form)
    expect(result).toBe(true)
  })

  it('should delete a record type', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteRecordType(2)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH_RECORD_TYPE}/2`)
    expect(result).toBe(true)
  })

  it('should fetch record type by id', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Found',
        data: { id: 2, name: 'Type 2' },
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getRecordTypeById(2)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_RECORD_TYPE}/2`)
    expect(result).toEqual({ id: 2, name: 'Type 2' })
  })

  it('should handle error when fetching record type by id', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getRecordTypeById(2)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_RECORD_TYPE}/2`)
    expect(result).toEqual({})
  })

  // --- RECORD COLUMNS ---
  it('should fetch list of record columns', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [{ id: 3, name: 'Column 1' }],
          current_page: 1,
          last_page: 1,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = 'foo=bar'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListRecordColumns(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_RECORD_COLUMNS}?paginate=1&${params}`
    )
    expect(store.data_record_columns_list).toEqual([
      { id: 3, name: 'Column 1' },
    ])
    expect(store.pages_record_columns.currentPage).toBe(1)
    expect(store.pages_record_columns.lastPage).toBe(1)
  })

  it('should handle error when fetching record columns', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = 'foo=bar'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListRecordColumns(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_RECORD_COLUMNS}?paginate=1&${params}`
    )
    expect(store.data_record_columns_list).toEqual([])
  })

  it('should create a new record column', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const form: IRecordColumnsForm = {
      record_type_id: 1,
      variable_field_id: 1,
      structure_field_name: 'Column A',
      start_position: 1,
      dimension: 1,
      end_position: 1,
      data_type: 'string',
      justified_id: 1,
      mask_id: null,
      constant: '',
      filler_character: '',
      value: '',
    }
    store.data_record_columns_form = form
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createRecordColumns()

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH_RECORD_COLUMNS}`, form)
    expect(result).toBe(true)
    expect(store.data_record_columns_form).toEqual({})
  })

  it('should not clear record columns form if creation fails', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const form: IRecordColumnsForm = {
      record_type_id: 1,
      variable_field_id: 1,
      structure_field_name: 'Column A',
      start_position: 1,
      dimension: 1,
      end_position: 1,
      data_type: 'string',
      justified_id: 1,
      mask_id: null,
      constant: '',
      filler_character: '',
      value: '',
    }
    store.data_record_columns_form = form
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createRecordColumns()

    // Assert
    expect(result).toBe(false)
    expect(store.data_record_columns_form).toEqual(form)
  })

  it('should update a record column', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const form: IRecordColumnsForm = {
      record_type_id: 1,
      variable_field_id: 1,
      structure_field_name: 'Column Updated',
      start_position: 1,
      dimension: 1,
      end_position: 1,
      data_type: 'string',
      justified_id: 1,
      mask_id: null,
      constant: '',
      filler_character: '',
      value: '',
    }
    store.data_record_columns_form = form
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateRecordColumns(3)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH_RECORD_COLUMNS}/3`, form)
    expect(result).toBe(true)
  })

  it('should delete a record column', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteRecordColumns(3)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH_RECORD_COLUMNS}/3`)
    expect(result).toBe(true)
  })

  it('should fetch record column by id', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Found',
        data: { id: 3, name: 'Column 3' },
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getRecordColumnsById(3)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_RECORD_COLUMNS}/3`)
    expect(result).toEqual({ id: 3, name: 'Column 3' })
  })

  it('should handle error when fetching record column by id', async () => {
    // Arrange
    const store = useBankStructuresV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getRecordColumnsById(3)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_RECORD_COLUMNS}/3`)
    expect(result).toEqual({})
  })

  // --- MUTATORS ---
  it('should set filters format', () => {
    // Arrange
    const store = useBankStructuresV1()
    const filters = { foo: 'bar', num: 1 }

    // Act
    store._setFiltersFormat(filters)

    // Assert
    expect(store.filtersFormat).toEqual(filters)
  })

  it('should set select format definition', () => {
    // Arrange
    const store = useBankStructuresV1()
    // Act
    store._setSelectFormatDefinition(5)
    // Assert
    expect(store.selectIdFormatDefinition).toBe(5)
  })

  it('should set select id record type', () => {
    // Arrange
    const store = useBankStructuresV1()
    // Act
    store._setSelectIdRecordType(7)
    // Assert
    expect(store.selectIdRecordType).toBe(7)
  })

  it('should set data format definition form', () => {
    // Arrange
    const store = useBankStructuresV1()
    const data = { foo: 'bar' } as any
    // Act
    store._setDataFormatDefinitionForm(data)
    // Assert
    expect(store.data_format_definition_form).toEqual(data)
  })

  it('should set data record type form', () => {
    // Arrange
    const store = useBankStructuresV1()
    const data = { foo: 'bar' } as any
    // Act
    store._setDataRecordTypeForm(data)
    // Assert
    expect(store.data_record_type_form).toEqual(data)
  })

  it('should set data record columns form', () => {
    // Arrange
    const store = useBankStructuresV1()
    const data = { foo: 'bar' } as any
    // Act
    store._setDataRecordColumnsForm(data)
    // Assert
    expect(store.data_record_columns_form).toEqual(data)
  })
})
