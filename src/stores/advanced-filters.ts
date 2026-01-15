import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IErrors, IResource } from '@/interfaces/global'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH_ADVANCED_FILTERS = '/utils/advance-filters'

export const useAdvancedFiltersStore = defineStore('advanced-filters', {
  state: () => ({
    advancedFilters: [] as IResource[],
  }),
  actions: {
    async getAdvancedFilters(key: string) {
      this.advancedFilters = []
      try {
        const { data } = await executeApi().get(
          `${URL_PATH_ADVANCED_FILTERS}/${key}`
        )
        this.advancedFilters = data.data
        const responseMessage: string = data.message
        showAlert(responseMessage, 'success')
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
      }
    },
  },
})
