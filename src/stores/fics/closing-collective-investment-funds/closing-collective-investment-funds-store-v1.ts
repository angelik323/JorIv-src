// Vue - Pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import {
  ICollectiveInvesmentFund,
  IParticipationTypeTable,
  ITempArrMovements,
  IFundsIdUndoClosure,
} from '@/interfaces/customs/fics/ClosingCollectiveInvestmentFunds'
import { IErrors, IUploadedFile } from '@/interfaces/global'
import { IMovementCodesItemList } from '@/interfaces/customs/fics/MovementCodes'

// Composables
import { useUtils, useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_FICS, URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  collective_investment_funds: [] as ICollectiveInvesmentFund[],
  collective_funds_participation_type_table: [] as IParticipationTypeTable[],
  movement_codes_close_list: [] as IMovementCodesItemList[],
})

export const useClosingCollectiveInvestmentFundsStoreV1 = defineStore(
  'closing-collective-investment-funds-store-v1',
  {
    state: initialState,
    actions: {
      async _listFundsInterval(params: string) {
        let success = true
        await executeApi()
          .get(
            `${URL_PATH_FICS}/collective-investment-funds/for-closing?sort[]=fund_code${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.collective_investment_funds = response.data?.data ?? []
            }
            success = response.data.success
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            success = false
          })

        return success
      },

      async _getMovementCodesCloseList(forceReload = false) {
        if (forceReload || this.movement_codes_close_list.length === 0) {
          await executeApi()
            .get(
              `${URL_PATH_FICS}/movement-codes?&filter[movement_type_id]=17&filter[movement_class_id]=9`
            )
            .then((response) => {
              if (response.data?.data) {
                this.movement_codes_close_list = response.data?.data.map(
                  (item: IMovementCodesItemList) => ({
                    value: item.id,
                    code: item.code,
                    label: item.description,
                    value_label: `${item.code} - ${item.description}`,
                    movement_nature_description:
                      item.movement_nature_description,
                  })
                )
              } else {
                this.movement_codes_close_list = []
              }
              showAlert(
                response.data.message,
                response.data.success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            })
            .catch((e) => {
              const error = e
              const message = showCatchError(error)
              showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            })
        }
      },

      async _synchronize(operation_date: String) {
        return await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/operation-types/get-movements-fic/${operation_date}`
          )
          .then((response) => {
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return response.data.success
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },

      async _importBachMovements(file: IUploadedFile) {
        try {
          const response = await executeApi().post(
            `${URL_PATH_FICS}/closing-funds/import-movement-file`,
            { file },
            {
              ...CONFIG,
              headers: {
                ...(CONFIG?.headers || {}),
                'Content-Type': 'multipart/form-data',
              },
              responseType: 'blob',
              validateStatus: () => true,
            }
          )

          const contentType = response.headers['content-type'] || ''

          if (contentType.includes('application/json')) {
            const text = await response.data.text()
            const json = JSON.parse(text)

            showAlert(
              json.message ?? 'Proceso completado',
              json.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return json
          }

          const fileName = `Plantilla_Cargue_Cierre_Errores.xlsx`
          const blob = new Blob([response.data], { type: contentType })
          useUtils().downloadBlobXlxx(blob, fileName)

          showAlert(
            'Archivo con errores descargado',
            'warning',
            undefined,
            TIMEOUT_ALERT
          )

          return { success: false, data: [], message: 'Error en el archivo' }
        } catch (error) {
          showAlert(
            showCatchError(error as IErrors) ?? 'Error al importar el archivo',
            'error',
            undefined,
            TIMEOUT_ALERT
          )

          return { success: false, data: [], message: 'Error al importar' }
        }
      },

      async _getImportedMovements(importId: String) {
        return await executeApi()
          .get(
            `${URL_PATH_FICS}/closing-funds/imported-movements?include[]=details&filter[id]=${importId}`
          )
          .then((response) => {
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return { success: response.data.success, data: response.data.data }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return { success: false, data: [] }
          })
      },

      async _downloadTemplate(dateClose: string) {
        await executeApi()
          .get(
            `${URL_PATH_FICS}/closing-funds/export-movement-template?filter[closing_date]=${dateClose}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = `Plantilla_Cargue_Cierre_${dateClose}.xlsx`
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Archivo descargado correctamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _importBachMovementsErrors(exportId: string) {
        await executeApi()
          .get(
            `${URL_PATH_FICS}/closing-funds/imported-movements/export/${exportId}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = `Plantilla_Cargue_Cierre_Errores.xlsx`
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Archivo descargado correctamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _processClosure(jsonMovements: ITempArrMovements) {
        return await executeApi()
          .post(`${URL_PATH_FICS}/closing-funds/process-closing`, jsonMovements)
          .then((response) => {
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return response.data.success
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },

      async _undoClosure(jsonIdsFunds: IFundsIdUndoClosure) {
        return await executeApi()
          .post(
            `${URL_PATH_FICS}/closing-funds/undo-process-closing`,
            jsonIdsFunds
          )
          .then((response) => {
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return response.data.success
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },

      _cleanData() {
        this.collective_investment_funds = []
        this.collective_funds_participation_type_table = []
        this.movement_codes_close_list = []
      },
    },
    persist: true,
  }
)
