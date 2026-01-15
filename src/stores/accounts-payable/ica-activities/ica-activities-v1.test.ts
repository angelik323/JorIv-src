// core
import { executeApi } from '@/apis'
import { setActivePinia, createPinia } from 'pinia'

// interfaces
import {
  IIcaActivitiesCreatePayload,
  IIcaActivitiesFileErrorJsonRow,
  IIcaActivitiesUpdatePayload,
  IIcaRelationsForm,
  IIcaRelationsPayload,
} from '@/interfaces/customs/accounts-payable/IcaActivities'

// constans
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// store
import { useIcaActivitiesStoreV1 } from '@/stores/accounts-payable/ica-activities/ica-activities-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({
    showAlert: jest.fn(),
  })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(),
  })),
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useIcaActivitiesStoreV1', () => {
  let store: ReturnType<typeof useIcaActivitiesStoreV1>
  const url = `${URL_PATH_ACCOUNTS_PAYABLE}/ica/activities`
  const urlRelation = `${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations`
  const filters = { 'filter[search]': 'ABC123' }
  const isFormData = (value: unknown): value is FormData =>
    value instanceof FormData

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useIcaActivitiesStoreV1()
    jest.clearAllMocks()
  })

  it('fetches activity management list successfully', async () => {
    // Arrange
    const mockList = [{ id: 1, code: 'XYZ', description: 'Registro de prueba' }]
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Lista obtenida',
        data: { data: mockList, current_page: 1, last_page: 2 },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const activity = await store._getActivityList(filters)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(url, {
      params: { 'filter[search]': 'ABC123', paginate: 1 },
    })
    expect(activity.data).toEqual(mockList)
    expect(activity.pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('handles error when fetching activity list', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const activity = await store._getActivityList(filters)

    // Assert
    expect(activity.data).toEqual([])
  })

  it('fetches relation management list successfully', async () => {
    // Arrange
    const mockList = [{ id: 1, code: 'XYZ', description: 'Registro de prueba' }]
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Lista obtenida',
        data: { data: mockList, current_page: 1, last_page: 2 },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const relation = await store._getRelationsList(filters)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(urlRelation, {
      params: { 'filter[search]': 'ABC123', paginate: 1 },
    })
    expect(relation.data).toEqual(mockList)
    expect(relation.pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('handles error when fetching relation list', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const relation = await store._getRelationsList(filters)

    // Assert
    expect(relation.data).toEqual([])
  })

  it('toggles activity status successfully', async () => {
    // Arrange
    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Estado cambiado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    // Act
    const result = await store._toggleStatusActivity(5)

    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${url}/5/toggle-status`)
    expect(result).toBe(true)
  })

  it('handles error when toggling activity status', async () => {
    // Arrange
    const mockPatch = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    // Act
    const result = await store._toggleStatusActivity(1)

    // Assert
    expect(result).toBe(false)
  })

  it('creates activity successfully', async () => {
    // Arrange
    const payload = {
      city_id: 1,
      third_party_nit: '123',
      periodicity: 'Mensual',
      ica_relation_id: 1,
      economic_activity_id: 1,
      activity_type: 'Industrial',
      fiscal_charge_id: 1,
      applies_to_third_party: true,
      third_party_type: 'Naturales',
      account_structure_id: 1,
      account_chart_id: 1,
      minimum_base_pesos: 100,
      minimum_base_uvt: 0,
      percentage: 10,
      settlement_concept_id: 1,
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createActivity(
      payload as IIcaActivitiesCreatePayload
    )

    // Assert
    expect(mockPost).toHaveBeenCalledWith(url, payload)
    expect(result).toBe(true)
  })

  it('handles error when creating activity', async () => {
    // Arrange
    const mockPost = jest.fn().mockRejectedValue(new Error('Error al crear'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createActivity(
      {} as IIcaActivitiesCreatePayload
    )

    // Assert
    expect(result).toBe(false)
  })

  it('deletes activity successfully', async () => {
    // Arrange
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteActivity(7)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(`${url}/7`)
    expect(result).toBe(true)
  })

  it('handles error when deleting activity', async () => {
    // Arrange
    const mockDelete = jest
      .fn()
      .mockRejectedValue(new Error('Error al eliminar'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteActivity(99)

    // Assert
    expect(result).toBe(false)
  })

  it('gets activity by ID successfully', async () => {
    // Arrange
    const mockData = { id: 1, name: 'Movimiento' }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Obtenido correctamente',
        data: mockData,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getActivityById(1)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${url}/1`)
    expect(result).toEqual(mockData)
  })

  it('handles error when getting activity by ID', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error al obtener'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getActivityById(1)

    // Assert
    expect(result).toBeNull()
  })

  it('updates activity successfully', async () => {
    // Arrange
    const payload = {
      city_id: 1,
      third_party_nit: '123',
      periodicity: 'Mensual',
      ica_relation_id: 1,
      economic_activity_id: 1,
      activity_type: 'Industrial',
      fiscal_charge_id: 1,
      applies_to_third_party: true,
      third_party_type: 'Naturales',
      account_structure_id: 1,
      account_chart_id: 1,
      minimum_base_pesos: 100,
      minimum_base_uvt: 0,
      percentage: 10,
      settlement_concept_id: 1,
    }
    0
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateActivity(
      payload as IIcaActivitiesUpdatePayload,
      1
    )

    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${url}/1`, payload)
    expect(result).toBe(true)
  })

  it('handles error when updating activity', async () => {
    // Arrange
    const mockPut = jest
      .fn()
      .mockRejectedValue(new Error('Error al actualizar'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateActivity(
      {} as IIcaActivitiesUpdatePayload,
      1
    )

    // Assert
    expect(result).toBe(false)
  })

  it('creates bulk activities successfully', async () => {
    // Arrange
    const payload = [{ id: 1 }]
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Importación exitosa' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createBulkActivity(
      payload as IIcaActivitiesFileErrorJsonRow[]
    )

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${url}/import`, payload)
    expect(result).toBe(true)
  })

  it('handles error when creating bulk activities', async () => {
    // Arrange
    const mockPost = jest.fn().mockRejectedValue(new Error('Error importando'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createBulkActivity(
      [] as IIcaActivitiesFileErrorJsonRow[]
    )

    // Assert
    expect(result).toBe(false)
  })

  it('downloads Excel template successfully', async () => {
    // Arrange
    const mockBlob = new Blob(['data'], { type: 'application/vnd.ms-excel' })
    const mockResponse = {
      data: mockBlob,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    const mockUtils = {
      getNameBlob: jest.fn().mockReturnValue('template.xlsx'),
      downloadBlobXlxx: jest.fn(),
    }

    jest.spyOn(require('@/composables'), 'useUtils').mockReturnValue(mockUtils)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._downloadExcelActivitiesTemplate()

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${url}/download-template`, {
      responseType: 'blob',
    })
    expect(mockUtils.downloadBlobXlxx).toHaveBeenCalledWith(
      mockBlob,
      'template.xlsx'
    )
  })

  it('handles error when downloading Excel template', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error al descargar'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._downloadExcelActivitiesTemplate()

    // Assert
    expect(mockGet).toHaveBeenCalled()
  })

  it('downloads Excel with errors successfully', async () => {
    // Arrange
    const file = new File(['data'], 'errores.xlsx', {
      type: 'application/vnd.ms-excel',
    })
    const mockBlob = new Blob(['data'], { type: 'application/vnd.ms-excel' })
    const mockResponse = {
      data: mockBlob,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    const mockUtils = {
      getNameBlob: jest.fn().mockReturnValue('errores.xlsx'),
      downloadBlobXlxx: jest.fn(),
    }

    jest.spyOn(require('@/composables'), 'useUtils').mockReturnValue(mockUtils)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    await store._downloadExcelActivityErrors(file)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${url}/check-import?download-errors=true`,
      expect.objectContaining({}),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      })
    )
    expect(isFormData(mockPost.mock.calls[0][1])).toBe(true)
    expect(mockUtils.downloadBlobXlxx).toHaveBeenCalledWith(
      mockBlob,
      'errores.xlsx'
    )
  })

  it('handles error when downloading Excel with errors', async () => {
    // Arrange
    const file = new File(['data'], 'error.xlsx')
    const mockPost = jest
      .fn()
      .mockRejectedValue(new Error('Error al descargar errores'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    await store._downloadExcelActivityErrors(file)

    // Assert
    expect(mockPost).toHaveBeenCalled()
  })

  it('downloads Excel error JSON successfully', async () => {
    // Arrange
    const file = new File(['data'], 'errores.xlsx')
    const mockData = {
      summary: { total: 1, success: 0, errors: 1, has_errors: true },
      validated_rows: [],
      error_rows: [],
    }
    const mockPost = jest.fn().mockResolvedValue({ data: { data: mockData } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._downloadExcelIcaActivitiesErrorsJson(file)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${url}/check-import`,
      expect.objectContaining({}),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
    expect(isFormData(mockPost.mock.calls[0][1])).toBe(true)
    expect(result).toEqual(mockData)
  })

  it('handles error when downloading Excel error JSON', async () => {
    // Arrange
    const file = new File(['data'], 'errores.xlsx')
    const mockPost = jest.fn().mockRejectedValue(new Error('Error JSON'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._downloadExcelIcaActivitiesErrorsJson(file)

    // Assert
    expect(result).toEqual({
      validated_rows: [],
      failed_records: 0,
      filename: '',
      status: {
        id: 0,
        name: '',
      },
      successful_records: 0,
      total_records: 0,
    })
  })

  it('gets available cities successfully', async () => {
    // Arrange
    const mockData = [
      {
        id: 1,
        label: '11001 - Bogotá',
        value: 1,
        code: '11001',
        name: 'Bogotá',
      },
    ]
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'OK', data: mockData },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getAvalibleCities({ country_id: 1 })

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations/available-cities`,
      { params: { country_id: 1 } }
    )
    expect(result).toEqual([
      {
        id: 1,
        label: '11001 - Bogotá',
        value: 1,
        code: '11001',
        name: 'Bogotá',
      },
    ])
  })

  it('handles error when getting available cities', async () => {
    // Arrange
    const mockGet = jest
      .fn()
      .mockRejectedValue(new Error('Error al cargar ciudades'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getAvalibleCities({ country_id: 1 })

    // Assert
    expect(result).toBeNull()
  })

  it('creates relation successfully', async () => {
    // Arrange
    const payload = { periodicity: 'monthly', city_id: 1, third_party_id: 2 }
    const mockPost = jest.fn().mockResolvedValue({
      data: { message: 'Creado', success: true },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createRelation(payload)

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations`,
      payload
    )
  })

  it('handles error when creating relation', async () => {
    // Arrange
    const payload = { periodicity: 'monthly', city_id: 1, third_party_id: 2 }
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createRelation(payload)

    // Assert
    expect(result).toBe(false)
  })

  it('gets relation by id successfully', async () => {
    // Arrange
    const mockData: IIcaRelationsForm = {
      id: 1,
      periodicity: 'monthly',
      city: { id: 1, name: 'Bogotá', code: '11001' },
      third_party: {
        id: 10,
        document: '123',
        validator_digit: '',
        legal_person: { third_party_id: 10, id: 1, business_name: 'Empresa' },
        natural_person: { third_party_id: null, id: null, full_name: '' },
      },
    }
    const mockGet = jest.fn().mockResolvedValue({
      data: { data: mockData, message: 'OK', success: true },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getRelationById(1)

    // Assert
    expect(result).toEqual(mockData)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations/1`
    )
  })

  it('handles error when getting relation by id', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getRelationById(1)

    // Assert
    expect(result).toBeDefined()
  })

  it('updates relation successfully', async () => {
    // Arrange
    const payload = { periodicity: 'monthly', city_id: 1, third_party_id: 2 }
    const mockPut = jest.fn().mockResolvedValue({
      data: { message: 'Actualizado', success: true },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateRelation(payload, 1)

    // Assert
    expect(result).toBe(true)
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations/1`,
      payload
    )
  })

  it('handles error when updating relation', async () => {
    // Arrange
    const mockPut = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateRelation(
      { periodicity: 'monthly' } as IIcaRelationsPayload,
      1
    )

    // Assert
    expect(result).toBe(false)
  })

  it('deletes relation successfully', async () => {
    // Arrange
    const mockDelete = jest.fn().mockResolvedValue({
      data: { message: 'Eliminado', success: true },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteRelation(1)

    // Assert
    expect(result).toBe(true)
    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations/1`
    )
  })

  it('handles error when deleting relation', async () => {
    // Arrange
    const mockDelete = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteRelation(1)

    // Assert
    expect(result).toBe(false)
  })
})
