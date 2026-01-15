// Vue - pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IMovementGroup } from '@/interfaces/customs/fics/SettingMovementClasses'
import { IErrors } from '@/interfaces/global/errorMessage'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_FICS}/classes-movements`

export const useSettingMovementClassesV1 = defineStore(
  'setting-movement-classes-v1',
  {
    state: () => ({
      version: 'v1',
      setting_movement_classes_list: [] as IMovementGroup[],
      setting_movement_classes_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getListAction() {
        this._cleanData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        try {
          const response = await executeApi().get(`${URL_PATH}?paginate=1`)
          const {
            data: { data: items, current_page, last_page },
            message,
            success,
          } = response.data
          if (success) {
            this.setting_movement_classes_list = items ?? []
            this.setting_movement_classes_pages.currentPage = current_page ?? 0
            this.setting_movement_classes_pages.lastPage = last_page ?? 0
          }

          showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )

          return response
        } catch (error) {
          showAlert(
            showCatchError(error as IErrors),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        }
      },

      _cleanData() {
        this.setting_movement_classes_list = []
        this.setting_movement_classes_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
