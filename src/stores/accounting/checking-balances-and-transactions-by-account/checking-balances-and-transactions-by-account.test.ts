import { setActivePinia, createPinia } from 'pinia'
import { useAccountingBalanceMovements } from '@/stores/accounting/checking-balances-and-transactions-by-account/checking-balances-and-transactions-by-account'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
    executeApi: jest.fn(() => ({
        get: jest.fn(),
    })),
}))

jest.mock('@/composables', () => {
    const showAlertMock = jest.fn()
    const showCatchErrorMock = jest.fn(error => `Mensaje de error: ${error.message}`)

    const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
    const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

    return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useAccountingBalanceMovements Store', () => {
    const URL = 'accounting/api/accounting/account-balance-movements'

    beforeEach(() => {
        setActivePinia(createPinia())
        jest.clearAllMocks()
    })

    it('fetchBalanceMovements successfully updates the status with a successful response', async () => {
        const store = useAccountingBalanceMovements()

        const mockResponse = {
            data: {
                success: true,
                message: 'Operación exitosa',
                data: {
                    data: [{ id: 1, account_code: '1010' }],
                    current_page: 1,
                    last_page: 2,
                    total: 1,
                    per_page: 20,
                },
            },
        }

        const mockGet = jest.fn().mockResolvedValue(mockResponse)
            ; (executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        const params = new URLSearchParams({
            'filter[from_business_id]': '1',
            'filter[account_id]': '2',
            'filter[from_period]': '2023-01',
            'filter[to_period]': '2023-06',
        })

        await store.fetchBalanceMovements(params)

        expect(mockGet).toHaveBeenCalledWith(
            expect.stringContaining(`${URL}/get-movements-with-balance?`)
        )
        expect(store.movements_list).toEqual([{ id: 1, account_code: '1010' }])
        expect(store.pagination.currentPage).toBe(1)
        expect(store.pagination.lastPage).toBe(2)
    })

    it('fetchBalanceMovements handles errors correctly', async () => {
        const store = useAccountingBalanceMovements()
        const mockError = new Error('API rota')
        const mockGet = jest.fn().mockRejectedValue(mockError)
            ; (executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        const { showAlertMock, showCatchErrorMock } = require('@/composables')

        const params = new URLSearchParams({
            'filter[from_business_id]': '1',
            'filter[account_id]': '2',
            'filter[from_period]': '2023-01',
            'filter[to_period]': '2023-06',
        })

        await store.fetchBalanceMovements(params)

        expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
        expect(showAlertMock).toHaveBeenCalledWith(
            'Mensaje de error: API rota',
            'error'
        )
    })

    it('fetchBalanceMovements returns an error if success is false', async () => {
        const store = useAccountingBalanceMovements()

        const mockResponse = {
            data: {
                success: false,
                message: 'Algo salió mal',
                data: {},
            },
        }

        const mockGet = jest.fn().mockResolvedValue(mockResponse)
            ; (executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        const { showAlertMock } = require('@/composables')

        const params = new URLSearchParams()

        await store.fetchBalanceMovements(params)

        expect(showAlertMock).toHaveBeenCalledWith(
            'Algo salió mal',
            'error',
            undefined,
            expect.any(Number)
        )
    })

    it('exportBalanceMovements generates and downloads file correctly', async () => {
        const store = useAccountingBalanceMovements()
        const clickMock = jest.fn()
        document.createElement = jest.fn(() => ({
            setAttribute: jest.fn(),
            click: clickMock,
            remove: jest.fn(),
        })) as any

        const mockResponse = {
            data: new Blob(['archivo'], { type: 'application/vnd.ms-excel' }),
        }
        const mockGet = jest.fn().mockResolvedValue(mockResponse)
            ; (executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        const params = new URLSearchParams({ page: '1' })

        await store.exportBalanceMovements(params)

        expect(mockGet).toHaveBeenCalledWith(
            expect.stringContaining(`${URL}/export?page=1`),
            { responseType: 'blob' }
        )
    })

    it('exportBalanceMovements handles errors correctly', async () => {
        const store = useAccountingBalanceMovements()
        const mockError = new Error('Fallo de exportación')

        const mockGet = jest.fn().mockRejectedValue(mockError)
            ; (executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        const { showCatchErrorMock, showAlertMock } = require('@/composables')

        const params = new URLSearchParams()

        await store.exportBalanceMovements(params)

        expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
        expect(showAlertMock).toHaveBeenCalledWith(
            'Mensaje de error: Fallo de exportación',
            'error'
        )
    })
})
