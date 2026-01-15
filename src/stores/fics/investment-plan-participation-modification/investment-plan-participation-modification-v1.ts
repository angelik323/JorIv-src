// Apis - Pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import { IErrors } from '@/interfaces/global'
import {
  IInvestmentPlanParticipationModification,
  IInvestmentPlan,
} from '@/interfaces/customs/fics/InvestmentPlanParticipationModification'

// Composables
import { useAlert, useShowError } from '@/composables'

export const useInvestmentPlanParticipationModificationStore = defineStore(
  'investment-plan-participation-modification-store-v1',
  {
    state: () => ({
      version: 'v1',
      investment_plan_participation_modification_list:
        [] as IInvestmentPlanParticipationModification[],
      investment_plan_participation_modification_create_list:
        [] as IInvestmentPlan[],
      investment_plan_participation_modification_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      investment_plan_participation_modification_create_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getList(params: Record<string, string | number>) {
        this._clearData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/business-line-change-petitions`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page, last_page },
              message,
              success,
            } = response.data

            this.investment_plan_participation_modification_list = items.map(
              (item: IInvestmentPlanParticipationModification) => ({
                ...item,
              })
            )
            this.investment_plan_participation_modification_pages.currentPage =
              current_page ?? 0
            this.investment_plan_participation_modification_pages.lastPage =
              last_page ?? 0

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _bulkAuthorize(
        ids: number[]
      ): Promise<{ success: boolean; message: string }> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        const payload = { ids }

        try {
          const response = await executeApi().post(
            `${URL_PATH_FICS}/business-line-change-petitions/bulk-authorize`,
            payload
          )

          const { message, success } = response.data

          if (success) {
            showAlert(
              'La modificación del tipo de participación del plan de inversión ha sido autorizada con éxito.',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          }

          return { success, message }
        } catch (e) {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return { success: false, message }
        }
      },

      async _bulkReject(
        ids: number[]
      ): Promise<{ success: boolean; message: string }> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        const payload = { ids }

        try {
          const response = await executeApi().post(
            `${URL_PATH_FICS}/business-line-change-petitions/bulk-reject`,
            payload
          )

          const { message, success } = response.data

          if (success) {
            showAlert(
              'La modificación del tipo de participación del plan de inversión ha sido rechazada correctamente.',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          }

          return { success, message }
        } catch (e) {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return { success: false, message }
        }
      },

      async _toggleAuth(
        ids: number[],
        status_id: number
      ): Promise<{ success: boolean; message: string }> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        const payload = { petitions: ids, status_id }

        try {
          const response = await executeApi().put(
            `${URL_PATH_FICS}/business-line-change-petitions/toggle-auth`,
            payload
          )

          const { message, success } = response.data

          if (success) {
            const statusMessage =
              status_id === 69 ? 'autorizada' : 'no autorizada'
            showAlert(
              `La modificación del tipo de participación del plan de inversión ha sido ${statusMessage} correctamente.`,
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          }

          return { success, message }
        } catch (e) {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return { success: false, message }
        }
      },

      async _bulkDelete(
        ids: number[]
      ): Promise<{ success: boolean; message: string }> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        const payload = { petitions: ids }

        try {
          const response = await executeApi().delete(
            `${URL_PATH_FICS}/business-line-change-petitions/delete`,
            { data: payload }
          )

          const { message, success } = response.data

          if (success) {
            showAlert(
              'Las modificaciones han sido eliminadas exitosamente.',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          }

          return { success, message }
        } catch (e) {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return { success: false, message }
        }
      },

      async _getListCreate(params: Record<string, string | number>) {
        this._clearData()
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/business-line-change-petitions/list-plans`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page, last_page },
              message,
              success,
            } = response.data

            this.investment_plan_participation_modification_create_list =
              items.map((item: IInvestmentPlan) => ({
                ...item,
              }))
            this.investment_plan_participation_modification_create_pages.currentPage =
              current_page ?? 0
            this.investment_plan_participation_modification_create_pages.lastPage =
              last_page ?? 0

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _create(
        plans: {
          fund_id: number
          fiduciary_investment_plan_id: number
          business_line_id: number
          new_business_line_id: number
        }[]
      ): Promise<{ success: boolean; message: string }> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        const payload = { plans }

        try {
          const response = await executeApi().post(
            `${URL_PATH_FICS}/business-line-change-petitions`,
            payload
          )

          const { message, success } = response.data

          if (success) {
            showAlert(
              'Las modificaciones han sido creadas exitosamente.',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          }

          return { success, message }
        } catch (e) {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return { success: false, message }
        }
      },

      _clearData() {
        this.investment_plan_participation_modification_list = []
        this.investment_plan_participation_modification_create_list = []
        this.investment_plan_participation_modification_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.investment_plan_participation_modification_create_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
