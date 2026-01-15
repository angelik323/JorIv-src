// Pinia - apis
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

// Interfaces
import {
  IConsultPercentageList,
  IConsultTransmissionList,
  IConsultProfitabilityList,
  IConsultTransmissionDetailList,
  ICollectiveInvestmentFundRequest,
  ICollectiveInvestmentFundResponse,
  IParticipationTypeSequencesRequest,
} from '@/interfaces/customs/fics/CollectiveInvestmentFunds'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

const URL_PATH = `${URL_PATH_FICS}/collective-investment-funds`

export const useCollectiveInvestmentFundsStoreV1 = defineStore(
  'collective-investment-funds-store-v1',
  {
    state: () => ({
      version: 'v1',
      collective_investment_fund_list:
        [] as ICollectiveInvestmentFundResponse[],
      collective_investment_fund_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      consult_percentage_list: [] as IConsultPercentageList[],
      consult_percentage_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      consult_profitability_list: [] as IConsultProfitabilityList[],
      consult_profitability_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      consult_transmission_list: [] as IConsultTransmissionList[],
      consult_transmission_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      consult_transmission_detail_list: [] as IConsultTransmissionDetailList[],
      consult_transmission_detail_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      participation_types_term_days_active: false as boolean,
    }),

    actions: {
      async _listAction(params: Record<string, string | number>) {
        this._clearData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.collective_investment_fund_list = items.map(
              (item: ICollectiveInvestmentFundResponse) => ({
                ...item,
              })
            )
            this.collective_investment_fund_pages.currentPage = current_page
            this.collective_investment_fund_pages.lastPage = last_page

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _createAction(data: ICollectiveInvestmentFundRequest) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH}/`, data)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return isSuccess
      },

      async _updateAction(id: string, data: ICollectiveInvestmentFundRequest) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .put(`${URL_PATH}/${id}`, data)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return isSuccess
      },

      async _showAction(id: string | string[]) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { message, success, data } = response.data

            if (success) {
              return data
            }

            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      // Servicios de consulta porcentaje por inversionista
      async _summaryConsultPercentageAction(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .get(`${URL_PATH}/summary/${id}`)
          .then((response) => {
            const { message, success, data } = response.data

            if (success) return data

            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _listConsultPercentageAction(id: number) {
        this._clearConsultPercentageData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}/investors/${id}`, { params: { paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            if (!success) {
              return showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            }

            this.consult_percentage_list = items.map(
              (item: IConsultPercentageList) => ({
                ...item,
              })
            )
            this.consult_percentage_pages.currentPage = current_page
            this.consult_percentage_pages.lastPage = last_page

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _exportExcelConsultPercentageAction(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        const utils = useUtils()

        await executeApi()
          .get(`${URL_PATH}/investors/export/${id}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = utils.getNameBlob(response)
            utils.downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Descarga exitosa',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      // Servicios de consulta rentabilidad
      async _listConsultProfitabilityAction(id: number, date: string) {
        this._clearConsultProfitabilityData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}/returns/${id}`, { params: { date, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.consult_profitability_list = items.map(
              (item: IConsultProfitabilityList) => ({
                ...item,
              })
            )
            this.consult_profitability_pages.currentPage = current_page
            this.consult_profitability_pages.lastPage = last_page

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _exportExcelConsultProfitabilityAction(id: number, date: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        const utils = useUtils()

        await executeApi()
          .get(`${URL_PATH}/returns/export/${id}`, {
            params: { date },
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = utils.getNameBlob(response)
            utils.downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Descarga exitosa',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      // Servicios de consulta transmisión formato 523
      async _listConsultTransmissionAction(id: number) {
        this._clearConsultTransmissionData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}/participation-types`, {
            params: { 'filter[fund_id]': id, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.consult_transmission_list = items.map(
              (item: IConsultProfitabilityList) => ({
                ...item,
              })
            )
            this.consult_transmission_pages.currentPage = current_page
            this.consult_transmission_pages.lastPage = last_page

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _listConsultTransmissionDetailAction(
        fund_id: number,
        participation_type_id: number
      ) {
        this._clearConsultTransmissionDetailData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}/fund-closure/format`, {
            params: {
              fund_id: fund_id,
              participation_type_id: participation_type_id,
              paginate: 1,
            },
          })
          .then((response) => {
            const {
              data,
              message,
              success,
            } = response.data

            this.consult_transmission_detail_list = data[0].map(
              (item: IConsultProfitabilityList) => ({
                ...item,
              })
            )

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _exportFileConsultTransmissionAction(
        fund_id: number,
        participation_type_id: number,
        format: string
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        const utils = useUtils()

        await executeApi()
          .get(
            `${URL_PATH}/fund-closure/format/export?fund_id=${fund_id}&participation_type_id=${participation_type_id}&format=${format}`,
            { responseType: 'blob' }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = utils.getNameBlob(response)
            utils.downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Descarga exitosa',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      // Servicios de consecutivo de tipos de participación informe 77
      async _listConsecutiveParticipationTypesAction(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .get(`${URL_PATH}/participation-types/base/${id}`, {
            params: {
              paginate: 1,
            },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            if (success) {
              return {
                list: items,
                pages: { currentPage: current_page, lastPage: last_page },
              }
            }

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _updateConsecutiveParticipationTypesAction(
        data: IParticipationTypeSequencesRequest
      ) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .put(
            `${URL_PATH_FICS}/business-lines-participation-types/update-multiple`,
            data
          )
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return isSuccess
      },

      _setParticipationTypesTermDaysActive(
        participation_types_term_days_active: boolean
      ) {
        this.participation_types_term_days_active =
          participation_types_term_days_active
      },

      _clearData() {
        this.collective_investment_fund_list = []
        this.collective_investment_fund_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      _clearConsultPercentageData() {
        this.consult_percentage_list = []
        this.consult_percentage_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      _clearConsultProfitabilityData() {
        this.consult_profitability_list = []
        this.consult_profitability_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      _clearConsultTransmissionData() {
        this.consult_transmission_list = []
        this.consult_transmission_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      _clearConsultTransmissionDetailData() {
        this.consult_transmission_detail_list = []
        this.consult_transmission_detail_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
