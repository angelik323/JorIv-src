import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IMergedTitleListItem,
  ITitlesMergingResponse,
  ITitlesToMerge,
  IMergedTitle,
} from '@/interfaces/customs/investment-portfolio/TitlesMerging'
import { IErrors } from '@/interfaces/global'

// Composables - Utils
import { useUtils, useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const INITIAL_ID_VALUE = 0

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTitlesMergingStoreV1 = defineStore('titles-merging-store-v1', {
  state: () => ({
    headerPropsDefault: {
      title: 'Englobe de títulos',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Portafolio de inversiones',
        },
        {
          label: 'Englobe de títulos',
          route: 'TitlesMergingList',
        },
      ],
      btn: {
        label: 'Crear',
        icon: useUtils().defaultIconsLucide.plusCircleOutline,
      },
    },
    merged_title_list: [] as IMergedTitleListItem[],
    titles_merging_response: null as ITitlesMergingResponse | null,
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  }),

  actions: {
    async _getMergedTitleList(params: Record<string, string | number>) {
      await executeApi()
        .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/fixed-rate-encompass/list`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          if (response.data.success) {
            this.merged_title_list =
              (response.data?.data?.data as IMergedTitleListItem[]) ?? []
            this.pages.currentPage = response.data?.data?.current_page ?? 1
            this.pages.lastPage = response.data?.data?.last_page ?? 1
          }

          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getByMergedTitleId(mergedTitleId: number) {
      await executeApi()
        .get(
          `${URL_PATH_INVESTMENT_PORTFOLIO}/fixed-rate-encompass/${mergedTitleId}/show`
        )
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.titles_merging_response = { ...responseData }
          }

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

    async _previewMergedTitle(
      data: Partial<ITitlesToMerge>
    ): Promise<IMergedTitle | null> {
      let success = false
      let dataResponse: IMergedTitle | null = null

      await executeApi()
        .post(
          `${URL_PATH_INVESTMENT_PORTFOLIO}/fixed-rate-encompass/preview`,
          data
        )
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false
          dataResponse = response.data?.data as IMergedTitle

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

      return dataResponse
    },

    async _createMergedTitle(data: Partial<ITitlesToMerge>) {
      let success = false
      let id = INITIAL_ID_VALUE

      await executeApi()
        .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/fixed-rate-encompass/new`, data)
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false
          id = response.data?.data?.id ?? INITIAL_ID_VALUE

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

      return id
    },

    _clearData() {
      this.merged_title_list = []
      this.titles_merging_response = null
      this.pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})
