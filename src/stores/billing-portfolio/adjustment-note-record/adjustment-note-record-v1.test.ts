import { setActivePinia, createPinia } from 'pinia'
import { useAdjustmentNoteRecordStoreV1 } from './adjustment-note-record-v1'
import { executeApi } from '@/apis'
import { URL_PATH_BILLING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn(
    (error) => `Mensaje de error: ${error.message}`
  )

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useAdjustmentNoteRecordStoreV1', () => {
  const URL_PATH = `${URL_PATH_BILLING}/invoices-commission-notes`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('_createInvoiceAdjustmentNote creates a note correctly', async () => {
    const store = useAdjustmentNoteRecordStoreV1()
    const mockResponse = { data: { success: true, message: 'Creada ok' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      note_type: 'X',
      affects: 'Y',
      amount: '1000',
      adjustment_date: '2025-01-01',
      observations: 'Obs',
    }
    const result = await store._createInvoiceAdjustmentNote(10, payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/10/create`, payload)
    expect(result).toBe(true)
  })

  it('_createInvoiceAdjustmentNote handle error', async () => {
    const store = useAdjustmentNoteRecordStoreV1()
    const { showAlertMock, showCatchErrorMock } = require('@/composables')

    const mockError = new Error('Error al crear')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      note_type: 'X',
      affects: 'Y',
      amount: '1000',
      adjustment_date: '2025-01-01',
      observations: 'Obs',
    }
    const result = await store._createInvoiceAdjustmentNote(20, payload)

    expect(result).toBe(false)
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Mensaje de error: Error al crear',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_listInvoicesCommissionsNote loads list correctly', async () => {
    const store = useAdjustmentNoteRecordStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Listado cargado',
        data: {
          data: [{ id: 1, invoice_number: 'F001' }],
          current_page: 1,
          last_page: 2,
          per_page: 20,
          total: 30,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { page: 1 }
    await store._listInvoicesCommissionsNote(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.list_invoices_comissions_note).toEqual([
      { id: 1, invoice_number: 'F001' },
    ])
    expect(store.list_invoices_comissions_note_pages.currentPage).toBe(1)
    expect(store.list_invoices_comissions_note_pages.lastPage).toBe(2)
  })

  it('_listInvoicesCommissionsNote handle error with catch', async () => {
    const store = useAdjustmentNoteRecordStoreV1()
    const { showAlertMock, showCatchErrorMock } = require('@/composables')

    const mockError = new Error('API rota')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listInvoicesCommissionsNote({ page: 1 })

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Mensaje de error: API rota',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_showAction returns data when success=true', async () => {
    const store = useAdjustmentNoteRecordStoreV1()
    const mockResponse = {
      data: { success: true, data: { id: 55, invoice_number: 'INV-55' } },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(55)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/55`)
    expect(result).toEqual({ id: 55, invoice_number: 'INV-55' })
  })

  it('_showAction returns null when it fails', async () => {
    const store = useAdjustmentNoteRecordStoreV1()
    const { showAlertMock } = require('@/composables')

    const mockResponse = { data: { success: false, message: 'No encontrado' } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(99)

    expect(showAlertMock).toHaveBeenCalledWith(
      'No encontrado',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(result).toBeUndefined()
  })

  it('_updateInvoiceAdjustmentNote actualiza correctamente', async () => {
    const store = useAdjustmentNoteRecordStoreV1()
    const mockResponse = { data: { success: true, message: 'Actualizada ok' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = {
      note_type: 'X',
      affects: 'Y',
      amount: '500',
      adjustment_date: '2025-01-02',
      observations: 'Obs',
    }
    const result = await store._updateInvoiceAdjustmentNote(10, 5, payload)

    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/10/edit/5`, payload)
    expect(result).toBe(true)
  })

  it('_updateInvoiceAdjustmentNote handles errors', async () => {
    const store = useAdjustmentNoteRecordStoreV1()
    const { showAlertMock, showCatchErrorMock } = require('@/composables')

    const mockError = new Error('Fallo al actualizar')
    const mockPut = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = {
      note_type: 'X',
      affects: 'Y',
      amount: '500',
      adjustment_date: '2025-01-02',
      observations: 'Obs',
    }
    const result = await store._updateInvoiceAdjustmentNote(10, 5, payload)

    expect(result).toBe(false)
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Mensaje de error: Fallo al actualizar',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
