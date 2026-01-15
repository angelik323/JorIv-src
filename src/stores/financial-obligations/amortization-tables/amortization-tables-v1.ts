// apis
import { executeApi } from '@/apis'

// pinia
import { defineStore } from 'pinia'

// composables
import { useShowError, useAlert } from '@/composables'

// interfaces
import { IErrors } from '@/interfaces/global'
import {
  IAmortizationList,
  IAmortizationObligationInfo,
  IAmortizationTablesDocumentsForm,
  IObligationsOptions,
} from '@/interfaces/customs/financial-obligations/AmortizationTables'
import { useShowEmptyScreen } from '@/components/ShowEmptyScreen/ShowEmptyScreen'

import { URL_PATH_FINANCIAL_OBLIGATION } from '@/constants/apis'

const { showCatchError } = useShowError()
const { openComponentLoader, resetSetLoaderComponent } = useShowEmptyScreen()
const { showAlert } = useAlert()

export const useAmortizationTablesStoreV1 = defineStore(
  'amortization-tables-v1',
  {
    state: () => ({
      showAmortizationData: false as boolean,
      data_documents_form: null as IAmortizationTablesDocumentsForm | null,
      currentAmortizationFilter: null as string | null,

      amortizationTableLoader: false as boolean,
      amortizationTableList: [] as IAmortizationList[],
      amortizationTablePages: {
        currentPage: 1,
        lastPage: 1,
      },

      obligationsOptions: [] as IObligationsOptions[],

      amortizationData: null as IAmortizationList | null,
    }),

    actions: {
      async _updateCurrentAmortizationFilter(urlKey: string | null) {
        this.currentAmortizationFilter = urlKey
      },

      async _resetSetAmortizationData() {
        this.showAmortizationData = false
        this.amortizationTableLoader = false
        this.amortizationTableList = []
        this.amortizationTablePages = {
          currentPage: 1,
          lastPage: 1,
        }
        this.obligationsOptions = []
        this.amortizationData = null
      },

      async _loadAmortizationList(params: string) {
        this.showAmortizationData = false
        openComponentLoader({
          setTitle: 'Cargando información',
          setDescription: 'Por favor espere un momento',
          setImage: 'default',
          setLoader: true,
        })

        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/get-financial-obligations?${params}`
          )
          .then((response) => {
            if (response.status) {
              const responseList: IAmortizationObligationInfo[] =
                response.data.data ?? []
              const responseMessage: string =
                response.data.message ?? 'Sin definir'

              const setObligationOptions: IObligationsOptions[] =
                responseList.map((item) => ({
                  label: item.obligation_number,
                  value: item.id,
                  payload: {
                    financialObligationNumber: item.obligation_number,
                    creditAmount: item.amount,
                    paymentQuotas: item.quotas,
                    loanRate: item.interest_rate,
                    documentFile: item.amortization_table_url,
                    financialPlanning: item.has_payment_plan,
                  },
                }))

              const setInfoData: IAmortizationList = {
                businessName: responseList[0].business_trust.name,
                businessId: responseList[0].business_trust.id,
                businessCode: responseList[0].business_trust.business_code,
                options: setObligationOptions,
              }

              this.amortizationData = setInfoData

              this.showAmortizationData = true
              resetSetLoaderComponent()

              showAlert(responseMessage, 'success')
            } else {
              openComponentLoader({
                setTitle: 'Lo sentimos',
                setDescription: `${response.data.message}`,
                setImage: 'default',
                setLoader: false,
              })
            }
          })
          .catch((e) => {
            const error = e as IErrors

            showAlert(showCatchError(error), 'error')
            this.showAmortizationData = false
            openComponentLoader({
              setTitle: 'Lo sentimos',
              setDescription: showCatchError(error),
              setImage: 'default',
              setLoader: false,
            })
          })
      },

      async _loadDocumentPDF(documentId: number) {
        let fileToView: File | null = null

        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/get-financial-obligation-by-id/${documentId}`
          )
          .then(async (response) => {
            const pdfFileUrl: string | undefined =
              response.data.data.amortization_table_url

            if (!pdfFileUrl) {
              showAlert('No se encontró la URL del documento', 'error')
              return
            }

            const blob = await fetch(pdfFileUrl).then((res) => res.blob())

            if (!blob.type.includes('pdf') || blob.type !== 'application/pdf') {
              showAlert('El archivo descargado no es un PDF válido', 'error')
              return
            }

            const getFileName =
              pdfFileUrl.split('/').pop()?.split('?')[0] || 'document'
            const decodedFileName = decodeURIComponent(getFileName)

            fileToView = new File([blob], decodedFileName, {
              type: 'application/pdf',
            })
          })
          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
          })

        return fileToView
      },

      async _loadDocumentURLPDF(documentId: number) {
        let fileURL: string | null = null

        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/get-financial-obligation-by-id/${documentId}`
          )
          .then((response) => {
            const pdfFileUrl: string | undefined =
              response.data.data.amortization_table_url

            if (pdfFileUrl) {
              fileURL = pdfFileUrl

              showAlert(response.data.message, 'success')
            } else {
              showAlert(response.data.message, 'error')

              fileURL = null
            }
          })
          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
          })

        return fileURL
      },

      async _createAmortization(obligationId: number, documentFile: File) {
        let success = false
        const formData = new FormData()
        formData.append('financial_obligation_id', String(obligationId))
        formData.append('amortization_table_file', documentFile)
        await executeApi()
          .post(
            `${URL_PATH_FINANCIAL_OBLIGATION}/upload-amortization-file`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          .then((response) => {
            const responseMessage: string =
              response.data.message ?? 'Sin definir'

            showAlert(responseMessage, 'success')
            success = response.data.success
          })
          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
            success = false
          })
          .finally(() => {
            this.amortizationTableLoader = false
          })

        return success
      },
    },
  }
)
