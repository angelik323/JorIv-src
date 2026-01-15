// Vue - Pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import {
  BusinessLineType,
  IBusinessLine,
  IBusinessLineItem,
} from '@/interfaces/customs/fics/BusinessLine'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

const URL_PATH = `${URL_PATH_FICS}/business-lines-participation-types`
const PARTICIPATION_TYPES_NAME = 'participation_types'
const BUSINESS_LINES_NAME = 'business_lines'
const PARTICIPATION_TYPE_TYPE_ID = 2
const BUSINESS_LINE_TYPE_ID = 1

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { formatParamsCustom } = useUtils()

const initialState = () => ({
  version: 'v1',
  business_line_list: [] as IBusinessLineItem[],
  business_line_pages: {
    currentPage: 0,
    lastPage: 0,
  },
  business_line: {} as IBusinessLine,
  business_lines_name: BUSINESS_LINES_NAME,
  participation_types_name: PARTICIPATION_TYPES_NAME,
  selected_type: BUSINESS_LINES_NAME as BusinessLineType,
})

export const useBusinessLineV1 = defineStore('business-line-v1', {
  state: initialState,
  getters: {
    typeName(state) {
      return state.selected_type === state.business_lines_name
        ? 'línea de negocio'
        : 'tipo de participación'
    },
    typeId(state) {
      return state.selected_type === state.business_lines_name
        ? BUSINESS_LINE_TYPE_ID
        : PARTICIPATION_TYPE_TYPE_ID
    },
  },
  actions: {
    async _getBusinessLineList(params: string) {
      const typeFilterParam = formatParamsCustom({
        'filter[type]': this.typeId,
      })

      const query = [params, typeFilterParam].filter(Boolean).join('&')

      this._cleanData()
      await executeApi()
        .get(`${URL_PATH}/get-index?paginate=1&${query}`)
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.business_line_list = items.map((item: IBusinessLineItem) => ({
            ...item,
          }))
          this.business_line_pages.currentPage = current_page
          this.business_line_pages.lastPage = last_page

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
    async _createBusinessLine(payload: IBusinessLine) {
      let isSuccess = false
      payload.type = this.typeId

      await executeApi()
        .post(`${URL_PATH}`, payload)
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

    _cleanData() {
      this.business_line_list = []
      this.business_line_pages = {
        currentPage: 0,
        lastPage: 0,
      }
      this.business_line = initialState().business_line
    },
    async _getBusinessLine(id: number) {
      this._cleanData()

      let isSuccess = false
      await executeApi()
        .get(`${URL_PATH}/get-by-id/${id}`)
        .then((response) => {
          const { data, message, success } = response.data

          if (data) {
            this.business_line = { ...data }
            this.business_line.initial_status_id = data.status_id
            this.selected_type =
              data.type === BUSINESS_LINE_TYPE_ID
                ? BUSINESS_LINES_NAME
                : PARTICIPATION_TYPES_NAME
          }
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
    async _updateBusinessLine(id: number, payload: IBusinessLine) {
      let isSuccess = false

      await executeApi()
        .put(`${URL_PATH}/${id}`, payload)
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
  },
  persist: true,
})
