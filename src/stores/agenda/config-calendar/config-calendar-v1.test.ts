// Apis
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Stores
import { useConfigCalendarV1 } from './config-calendar-v1'

const URL = 'schedules/api/schedules/marked-calendars'

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
  const useShowError = jest.fn(() => ({ showCatchError: jest.fn() }))
  return { useAlert, useShowError }
})

describe('Store: useConfigCalendarV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('Method _getConfigCalendarList', () => {
    it('Given calendar list endpoint returns success, When calling _getConfigCalendarList, Then it should update state correctly', async () => {
      const store = useConfigCalendarV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: [{ id: 1 }],
            current_page: 1,
            last_page: 1,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getConfigCalendarList({ year: 2025 })

      expect(mockGet).toHaveBeenCalledWith(`${URL}`, {
        params: { year: 2025, paginate: 1 },
      })
      expect(store.config_calendar_list).toEqual([{ id: 1 }])
      expect(store.config_calendar_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })

    it('Given API returns success=false, When calling _getConfigCalendarList, Then list should remain empty', async () => {
      const store = useConfigCalendarV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error',
          data: { data: [], current_page: 1, last_page: 1 },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getConfigCalendarList({ year: 2025 })

      expect(store.config_calendar_list).toEqual([])
      expect(store.config_calendar_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })

    it('Given API throws error, When calling _getConfigCalendarList, Then it should keep list empty', async () => {
      const store = useConfigCalendarV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getConfigCalendarList({})

      expect(mockGet).toHaveBeenCalledWith(`${URL}`, {
        params: { paginate: 1 },
      })
      expect(store.config_calendar_list).toEqual([])
    })
  })

  describe('Method _createAction', () => {
    it('Given valid payload, When calling _createAction, Then it should return true on success', async () => {
      const store = useConfigCalendarV1()
      const payload = {
        id: 1,
        marked_day: '2025-06-01',
        marking_reason: 'Feriado',
      }
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Creado' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createAction(payload)

      expect(mockPost).toHaveBeenCalledWith(URL, payload)
      expect(result).toBe(true)
    })

    it('Given API fails, When calling _createAction, Then it should return false', async () => {
      const store = useConfigCalendarV1()
      const payload = {
        id: 1,
        marked_day: '2025-01-01',
        marking_reason: 'Holiday test',
      }
      const mockPost = jest.fn().mockRejectedValue(new Error('API error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createAction(payload)

      expect(result).toBe(false)
      expect(mockPost).toHaveBeenCalledWith(URL, payload)
    })
  })

  describe('Method _updateAction', () => {
    it('Given valid payload, When calling _updateAction, Then it should return true on success', async () => {
      const store = useConfigCalendarV1()
      const payload = {
        id: 2,
        marked_day: '2025-07-20',
        marking_reason: 'Independencia',
      }
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Actualizado' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateAction(payload)

      expect(mockPut).toHaveBeenCalledWith(`${URL}/2`, {
        marked_day: '2025-07-20',
        marking_reason: 'Independencia',
      })
      expect(result).toBe(true)
    })

    it('Given API fails, When calling _updateAction, Then it should return false', async () => {
      const store = useConfigCalendarV1()
      const payload = {
        id: 1,
        marked_day: '2025-08-01',
        marking_reason: 'Otro',
      }
      const mockPut = jest.fn().mockRejectedValue(new Error('Update failed'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateAction(payload)

      expect(result).toBe(false)
    })
  })

  describe('Method _deleteAction', () => {
    it('Given valid ID, When calling _deleteAction, Then it should call DELETE', async () => {
      const store = useConfigCalendarV1()
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Eliminado' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      await store._deleteAction(3)

      expect(mockDelete).toHaveBeenCalledWith(`${URL}/3`)
    })

    it('Given API fails, When calling _deleteAction, Then it should still attempt DELETE', async () => {
      const store = useConfigCalendarV1()
      const mockDelete = jest.fn().mockRejectedValue(new Error('Delete failed'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      await store._deleteAction(99)

      expect(mockDelete).toHaveBeenCalledWith(`${URL}/99`)
    })
  })

  describe('Method _getByIdAction', () => {
    it('Given valid ID, When calling _getByIdAction, Then it should populate request state', async () => {
      const store = useConfigCalendarV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Encontrado',
          data: { id: 3, marked_day: '2025-12-25', marking_reason: 'Navidad' },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getByIdAction('3')

      expect(store.config_calendar_request).toEqual({
        id: 3,
        marked_day: '2025-12-25',
        marking_reason: 'Navidad',
      })
    })
  })

  describe('Method _clearConfigCalendarList', () => {
    it('Given store has data, When calling _clearConfigCalendarList, Then it should reset lists and pages', async () => {
      const store = useConfigCalendarV1()
      store.config_calendar_list = [
        { id: 1, marked_day: '2025-06-01', marking_reason: 'Importante' },
      ]
      store.config_calendar_pages = { currentPage: 2, lastPage: 5 }

      await store._clearConfigCalendarList()

      expect(store.config_calendar_list).toEqual([])
      expect(store.config_calendar_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
      })
    })
  })

  describe('Method _clearRequestConfigCalendar', () => {
    it('Given request has data, When calling _clearRequestConfigCalendar, Then it should reset to null', async () => {
      const store = useConfigCalendarV1()
      store.config_calendar_request = {
        id: 1,
        marked_day: '2025-10-12',
        marking_reason: 'Raza',
      }

      await store._clearRequestConfigCalendar()

      expect(store.config_calendar_request).toBeNull()
    })
  })

  describe('Method _setCalendarDataForm', () => {
    it('Given new form data, When calling _setCalendarDataForm, Then it should update the state', () => {
      const store = useConfigCalendarV1()
      const data = {
        id: 4,
        marked_day: '2025-11-01',
        marking_reason: 'Todos los Santos',
      }

      store._setCalendarDataForm(data)

      expect(store.config_calendar_request).toEqual(data)
    })

    it('Given null, When calling _setCalendarDataForm, Then it should reset state to null', () => {
      const store = useConfigCalendarV1()

      store._setCalendarDataForm(null)

      expect(store.config_calendar_request).toBeNull()
    })
  })

  describe('Method _getConfigCalendar', () => {
    it('Given API returns success, When calling _getConfigCalendar, Then it should update list correctly', async () => {
      const store = useConfigCalendarV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido',
          data: [
            { id: 10, marked_day: '2025-10-01', marking_reason: 'Feriado' },
          ],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getConfigCalendar({ year: 2025 })

      expect(mockGet).toHaveBeenCalledWith(`${URL}`, {
        params: { year: 2025 },
      })
      expect(store.config_calendar_list).toEqual([
        { id: 10, marked_day: '2025-10-01', marking_reason: 'Feriado' },
      ])
    })

    it('Given API returns success=false, When calling _getConfigCalendar, Then it should keep list empty', async () => {
      const store = useConfigCalendarV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error al obtener listado',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getConfigCalendar({ year: 2025 })

      expect(store.config_calendar_list).toEqual([])
    })

    it('Given API throws an error, When calling _getConfigCalendar, Then it should keep list empty', async () => {
      const store = useConfigCalendarV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('API error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getConfigCalendar({ year: 2025 })

      expect(mockGet).toHaveBeenCalled()
      expect(store.config_calendar_list).toEqual([])
    })
  })
})
