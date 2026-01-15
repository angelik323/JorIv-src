// Apis
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { ICalendarEvent } from '@/interfaces/customs/agenda/CalendarEvents'

// Constants
import { URL_PATH_SCHEDULES } from '@/constants/apis'

// Stores
import { useCalendarEventsStoreV1 } from './calendar-events-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

describe('useCalendarEventsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches calendar event list and updates state on success', async () => {
    const store = useCalendarEventsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Eventos obtenidos exitosamente.',
        data: {
          data: [
            {
              id: 1,
              title: 'Evento 1',
              description: 'Descripción evento 1',
            },
          ],
          current_page: 1,
          last_page: 2,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { page: 1 }

    await store._getCalendarEventList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SCHEDULES}/events/get-all-events`,
      {
        params: { page: 1, paginate: 1 },
      }
    )
    expect(store.calendar_event_list).toHaveLength(1)
    expect(store.calendar_event_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('handles error when fetching calendar event list', async () => {
    const store = useCalendarEventsStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { page: 1 }

    await store._getCalendarEventList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SCHEDULES}/events/get-all-events`,
      {
        params: { page: 1, paginate: 1 },
      }
    )
    expect(store.calendar_event_list).toEqual([])
  })

  it('creates a calendar event successfully', async () => {
    const store = useCalendarEventsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Evento creado exitosamente.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: ICalendarEvent = {
      id: 1,
      title: 'Evento inválido',
      description: 'Debería fallar',
      start_date: '2025-10-22',
      end_date: '2025-10-23',
      repeat: 'Daily',
      notifications: {
        users: [],
      },
    }

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_SCHEDULES}/events/`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error when creating a calendar event', async () => {
    const store = useCalendarEventsStoreV1()
    const mockError = new Error('Error al crear evento')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: ICalendarEvent = {
      id: 1,
      title: 'Evento inválido',
      description: 'Debería fallar',
      start_date: '2025-10-22',
      end_date: '2025-10-23',
      repeat: 'Daily',
      notifications: {
        users: [],
      },
    }

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_SCHEDULES}/events/`,
      payload
    )
    expect(result).toBe(false)
  })

  it('gets calendar event by ID and updates state on success', async () => {
    const store = useCalendarEventsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Evento obtenido exitosamente.',
        data: {
          id: '1',
          title: 'Evento 1',
          users: [{ id: 'u1', name: 'User 1' }],
          notifications: {
            users: [],
          },
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = '1'

    const result = await store._getByIdAction(id)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_SCHEDULES}/events/${id}`)
    expect(store.calendar_event_view).toEqual(mockResponse.data.data)
    expect(result).toEqual(mockResponse.data.data)
  })

  it('handles error when getting calendar event by ID', async () => {
    const store = useCalendarEventsStoreV1()
    const mockError = new Error('Error al obtener evento')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = '1'
    const result = await store._getByIdAction(id)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_SCHEDULES}/events/${id}`)
    expect(result).toBe(null)
    expect(store.calendar_event_view).toEqual(null)
  })

  it('updates a calendar event successfully', async () => {
    const store = useCalendarEventsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Evento actualizado exitosamente.',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload: ICalendarEvent = {
      id: 1,
      title: 'Evento inválido',
      description: 'Debería fallar',
      start_date: '2025-10-22',
      end_date: '2025-10-23',
      repeat: 'Daily',
      notifications: {
        users: [],
      },
    }
    const result = await store._updateAction(payload)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_SCHEDULES}/events/${payload.id}`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error when updating a calendar event', async () => {
    const store = useCalendarEventsStoreV1()
    const mockError = new Error('Error al actualizar evento')
    const mockPut = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload: ICalendarEvent = {
      id: 1,
      title: 'Evento inválido',
      description: 'Debería fallar',
      start_date: '2025-10-22',
      end_date: '2025-10-23',
      repeat: 'Daily',
      notifications: {
        users: [],
      },
    }

    const result = await store._updateAction(payload)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_SCHEDULES}/events/${payload.id}`,
      payload
    )
    expect(result).toBe(false)
  })

  it('deletes a calendar event', async () => {
    const store = useCalendarEventsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Evento eliminado exitosamente.',
      },
    }
    const mockDelete = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const id = 1

    await store._deleteAction(id)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_SCHEDULES}/events/${id}`
    )
  })

  it('handles response with success false in _getCalendarEventList', async () => {
    const store = useCalendarEventsStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'Error updating the event',
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCalendarEventList({ page: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SCHEDULES}/events/get-all-events`,
      {
        params: { page: 1, paginate: 1 },
      }
    )
    expect(store.calendar_event_list).toEqual([])
    expect(store.calendar_event_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('shows alert for unknown visualization type in _getCalendarAgendaByType', async () => {
    const store = useCalendarEventsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Agenda retrieved',
        data: {
          visualization_type: 'hourly',
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getCalendarAgendaByType('type=test')

    expect(result).toBe(null)
  })

  it('handles response with success false in _createAction', async () => {
    const store = useCalendarEventsStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'Error al crear el evento',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: ICalendarEvent = {
      id: 1,
      title: 'Evento inválido',
      description: 'Debería fallar',
      start_date: '2025-10-22',
      end_date: '2025-10-23',
      repeat: 'Daily',
      notifications: {
        users: [],
      },
    }

    const result = await store._createAction(payload)

    expect(result).toBe(false)
  })

  it('handles response with success false in _updateAction', async () => {
    const store = useCalendarEventsStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'La actualización falló',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload: ICalendarEvent = {
      id: 1,
      title: 'Evento inválido',
      description: 'Debería fallar',
      start_date: '2025-10-22',
      end_date: '2025-10-23',
      repeat: 'Daily',
      notifications: {
        users: [],
      },
    }
    const result = await store._updateAction(payload)

    expect(result).toBe(false)
  })
})
