// stores/useAccountingBalanceMovements.ts
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { IAccountingBalanceMovementItem, IAccountingBalanceMovementResponse } from '@/interfaces/customs/accounting/checking-balances-and-transactions-by-account'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTING}/account-balance-movements`

const initialState = () => ({
    movements_list: [] as IAccountingBalanceMovementItem[],
    pagination: {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 20,
    },
})

export const useAccountingBalanceMovements = defineStore('accounting-balance-movements', {
    state: initialState,

    actions: {
        async fetchBalanceMovements(queryParams: URLSearchParams) {
            await executeApi()
                .get<IAccountingBalanceMovementResponse>(
                    `${URL_PATH}/get-movements-with-balance?${queryParams.toString()}`
                )
                .then((response) => {
                    if (response.data.success) {
                        const paginated = response.data.data

                        this.movements_list = paginated.data
                        this.pagination = {
                            currentPage: paginated.current_page,
                            lastPage: paginated.last_page,
                            total: paginated.total,
                            perPage: paginated.per_page,
                        }

                        showAlert(response.data.message, 'success', undefined, TIMEOUT_ALERT)
                    } else {
                        showAlert(response.data.message, 'error', undefined, TIMEOUT_ALERT)
                    }
                })
                .catch((error) => {
                    showAlert(showCatchError(error as any), 'error')
                })
        },

        async exportBalanceMovements(queryParams: URLSearchParams) {
            await executeApi()
                .get(`${URL_PATH}/export?${queryParams.toString()}`, {
                    responseType: 'blob',
                })
                .then((response) => {
                    const blob = new Blob([response.data], {
                        type: response.headers['content-type']
                    })

                    const name = useUtils().getNameBlob(response)
                    useUtils().downloadBlobXlxx(blob, name)

                    showAlert('Archivo exportado exitosamente', 'success', undefined, TIMEOUT_ALERT)
                })
                .catch((error) => {
                    showAlert(showCatchError(error as any), 'error')
                })
        },
    }
})