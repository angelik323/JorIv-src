import { executeApi } from '@/apis'
import { URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION } from '@/constants/apis'
import { defineStore } from 'pinia'
import { useAlert, useShowError } from '@/composables'
import {
  IPaymentMilestonesModificationList,
  IPaymentMilestonesModificationList2,
  IPaymentMilestonesModificationForm,
  IPaymentMilestonesModificationResponseData,
  IContractMilestoneModification,
  IMilestoneDetail,
  IContractFutureValidityMilestone,
  IBudgetRecord,
  IDistributedMilestoneRequest,
} from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'
import { IErrors } from '@/interfaces/global'

const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePaymentMilestonesModificationStoreV1 = defineStore(
  'payment-milestones-modification-store-v1',
  {
    state: () => ({
      version: 'v1',
      payment_milestones_modification_list:
        [] as IPaymentMilestonesModificationList[],
      payment_contract_modification_milestones:
        {} as IContractMilestoneModification,
      payment_milestones_modification_total:
        {} as IPaymentMilestonesModificationList2,
      payment_milestones_modification_new_distribution:
        [] as IMilestoneDetail[],
      contract_future_validity: [] as IContractFutureValidityMilestone[],
      budget_records: [] as IBudgetRecord[],
      general_contract_information:
        null as IPaymentMilestonesModificationResponseData | null,
      payment_milestones_modification_response:
        null as IPaymentMilestonesModificationForm | null,
      payment_milestones_modification_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      payment_milestones_modification_view:
        null as IPaymentMilestonesModificationResponseData | null,
    }),
    actions: {
      /**
       * Obtener modificacion lista de hitos de pago
       * @param params - Parámetros de filtrado (ej: 'page=1&search=test')
       */
      async _getPaymentMilestonesModification(
        params: Record<string, string | number>
      ) {
        this.payment_milestones_modification_list = []
        await executeApi()
          .get(
            `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}/`,
            {
              params: { ...params, paginate: 1 },
            }
          )
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.payment_milestones_modification_list = items.map(
              (item: IPaymentMilestonesModificationList) => ({
                ...item,
              })
            )
            this.payment_milestones_modification_pages.currentPage =
              current_page
            this.payment_milestones_modification_pages.lastPage = last_page

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

      /**
       * Obtener un hito de pago por ID
       * @param id - ID del hito de pago
       */
      async _getPaymentMilestonesModificationById(
        contract_id: number,
        params: string = '',
        pages: number = 20
      ) {
        await executeApi()
          .get(
            `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}/${contract_id}?paginate=1&rows=${pages}${params}`
          )
          .then((response) => {
            if (response.data.success) {
              const res: IContractMilestoneModification = response.data?.data
              if (res) {
                this.payment_contract_modification_milestones =
                  response.data.data
              }
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      /**
       * Obtener un hito de pago por ID
       * @param id - ID del hito de pago
       */
      async _getPaymentMilestonesModificationEdit(
        x_id: number,
        params: string = '',
        pages: number = 20
      ) {
        await executeApi()
          .get(
            `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}/edit/${x_id}?paginate=1&rows=${pages}${params}`
          )
          .then((response) => {
            if (response.data.success) {
              const res: IPaymentMilestonesModificationList2 =
                response.data?.data
              if (res) {
                this.payment_milestones_modification_total = response.data.data
              }
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      /** TODO: Validar si este método se utiliza en otros componentes o se puede eliminar
       * Obtener lista de hitos de pago de nuevos hitos de la vista de editar
       * @param params - 23/edit/1
       */
      // async _getPaymentMilestonesModificationEditNewDistribution(
      //   milestone_id: number,
      //   params: Record<string, string | number>
      // ) {
      //   this.payment_milestones_modification_new_distribution = []
      //   await executeApi()
      //     .get(
      //       `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}/${milestone_id}`,
      //       {
      //         params: { ...params },
      //       }
      //     )
      //     .then((response) => {
      //       const {
      //         data: { milestones = [] },
      //         message,
      //         success,
      //       } = response.data

      //       this.payment_milestones_modification_new_distribution = milestones

      //       showAlert(
      //         message,
      //         success ? 'success' : 'error',
      //         undefined,
      //         TIMEOUT_ALERT
      //       )
      //     })
      //     .catch((e) => {
      //       const error = e as IErrors
      //       const message = showCatchError(error)
      //       showAlert(message, 'error', undefined, TIMEOUT_ALERT)
      //     })
      // },

      /**
       * Obtener lista de vigencias futuras
       */
      async _getContractFutureValidity(
        milestones_Id: number,
        params: Record<string, string | number>
      ) {
        this.contract_future_validity = []
        await executeApi()
          .get(
            `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}/show-contract-future-validity/${milestones_Id}`,
            {
              params: { ...params, paginate: 1 },
            }
          )
          .then((response) => {
            const {
              data: {
                contract_future_validity_milestone: items = [],
                current_page = 0,
                last_page = 0,
              },
              message,
              success,
            } = response.data

            this.contract_future_validity = items
            this.payment_milestones_modification_pages.currentPage =
              current_page
            this.payment_milestones_modification_pages.lastPage = last_page

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

      /**
       * Obtener lista de registros presupuestales
       */
      async _getContractBudgetDocument(
        milestones_id: number,
        params: Record<string, string | number>
      ) {
        this.budget_records = []
        await executeApi()
          .get(
            `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}/show-contract-budget-document/${milestones_id}`,
            {
              params: { ...params, paginate: 1 },
            }
          )
          .then((response) => {
            const {
              data: {
                budget_records: items = [],
                current_page = 0,
                last_page = 0,
              },
              message,
              success,
            } = response.data

            this.budget_records = items
            this.payment_milestones_modification_pages.currentPage =
              current_page
            this.payment_milestones_modification_pages.lastPage = last_page

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

      /**
       * Obtener campos de datos no editables
       * @param params - Parámetros de filtrado (ej: 'page=1&search=test')
       */
      async _getGeneralContractInformation(
        contract_id: number,
        adition_id: number,
        params: Record<string, string | number>
      ) {
        this.general_contract_information = null
        await executeApi()
          .get(
            `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}/${contract_id}/edit/${adition_id}`,
            {
              params: { ...params },
            }
          )
          .then((response) => {
            const { data: item, message, success } = response.data

            this.general_contract_information = {
              ...item,
              business_trust: item.businessTrust,
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

      /**
       * Obtener informacion para la vista ver
       * @param params - Parámetros de filtrado
       */
      async _getPaymentMilestonesModificationView(
        contract_id: number,
        milestone_id: number,
        params: Record<string, string | number>
      ) {
        this.payment_milestones_modification_view = null
        await executeApi()
          .get(
            `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}/${contract_id}/edit/${milestone_id}?type=1`,
            {
              params: { ...params },
            }
          )
          .then((response) => {
            const { data: item, message, success } = response.data

            this.payment_milestones_modification_view = {
              ...item,
              business_trust: item.businessTrust,
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


      /**
       * Actualizar un hito de pago distribuido
       * @param id - ID del hito de pago
       * @param payload - Datos actualizados
       * @returns boolean - true si fue exitoso
       */
      async _updatePaymentMilestonesModificationDistributed(
        id_x: number,
        payload: IDistributedMilestoneRequest
      ) {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}/modify-distribution/${id_x}`,
            payload
          )
          .then((response) => {
            success = response.data.success
            const message = response.data.message
            const data_message =
              response.data.data?.milestones &&
              response.data.data?.milestones?.length > 0
                ? response.data.data.milestones[0]
                : ''

            return showAlert(
              data_message || message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      /**
       * Crear un nuevo hito de pago
       * @param payload - Datos del hito de pago (code, name_payment_milestones_modification, stage)
       * @returns boolean - true si fue exitoso
       */
      async _createPaymentMilestonesModification(
        payload: IPaymentMilestonesModificationForm
      ) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}`,
            payload
          )
          .then((response) => {
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
          })
        return success
      },

      /**
       * Cambiar estado de un hito de pago
       * @param id - ID del hito de pago
       * @param status_id - Nuevo estado
       */
      async _changeStatus(id: number, status: string) {
        await executeApi()
          .patch(
            `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}/${id}/${status}`
          )
          .then((response) => {
            return showAlert(
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

      /**
       * Eliminar un hito de pago
       * @param id - ID del hito de pago
       */
      async _deletePaymentMilestonesModification(id: number) {
        await executeApi()
          .delete(
            `${URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION}/${id}`
          )
          .then((response) => {
            //this._getPaymentMilestonesModification('')
            return showAlert(
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

      /**
       * Establecer datos del formulario de información
       * @param data - Datos del formulario o null para limpiar
       */
      _setDataInformationForm(data: IPaymentMilestonesModificationForm | null) {
        this.payment_milestones_modification_response = data
          ? { ...data }
          : null
      },

      _clearData() {
        this.payment_milestones_modification_list = []
        this.payment_milestones_modification_pages.currentPage = 0
        this.payment_milestones_modification_pages.lastPage = 0
      },
    },
  }
)
