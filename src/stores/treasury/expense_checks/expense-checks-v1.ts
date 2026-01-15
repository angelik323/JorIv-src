import { executeApi } from '@/apis'
import {
  IExpenseCheckDetailInfo,
  IExpenseCheckDetailList,
  IExpenseCheckItem,
  TitleDescription,
} from '@/interfaces/customs'
import { defineStore } from 'pinia'

import { URL_PATH_TREASURIES } from '@/constants/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useExpenseChecksStoreV1 = defineStore('amortization-tables-v1', {
  state: () => ({
    version: 'v1',
    expenseChecksList: [] as IExpenseCheckItem[],
    check_info: null as TitleDescription[] | null,
    expense_checks_pages: {
      currentPage: 1,
      lastPage: 1,
    },
  }),
  actions: {
    async _resetExpenseChecksList() {
      this.expenseChecksList = []
    },

    async _loadExpenseChecksList(params: string, typePrint: number) {
      this.expenseChecksList = []
      await executeApi()
        .get(
          `${URL_PATH_TREASURIES}/check-expenses/all?paginate=1&typeCheck=${typePrint}${params}`
        )
        .then((response) => {
          const responseList: IExpenseCheckDetailList[] =
            response.data.data.data ?? []

          const responseListMap = responseList.map((item) => ({
            id: item.id,
            officeName: item.office.name,
            business: item.business.business_code,
            businessName: item.business.name,
            accountNumber: item.bank_account.account_number,
            registerDate: item.created_at,
            checks: `Cheque ${item.consecutive}`,
          }))

          this.expenseChecksList = responseListMap
          this.expense_checks_pages = {
            currentPage: response.data.data.current_page,
            lastPage: response.data.data.last_page,
          }
        })
        .catch((e) => {
          this.expenseChecksList = []
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },

    async _loadInfoCheckById(checkId: number) {
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/check-expenses/${checkId}`)
        .then((response) => {
          const responseData: IExpenseCheckDetailInfo = response.data.data

          const setInfoCard = [
            { title: '#', description: `${responseData.consecutive}` },
            {
              title: 'Beneficiario',
              description: `${responseData.beneficiary.document} - ${responseData.beneficiary.name}`,
            },
            {
              title: 'Valor',
              description: useUtils().formatCurrency(responseData.value),
            },
            {
              title: 'Valor en letras',
              description: `${responseData.valueLetters}`,
            },
            { title: 'Fecha', description: `${responseData.date}` },
            {
              title: 'Mensaje',
              description: `${responseData.message || 'No hay mensaje'}`,
            },
          ]

          this.check_info = setInfoCard
          const message = response.data.message

          showAlert(message, 'success')
        })
        .catch((e) => {
          const error = e as IErrors
          this.check_info = []
          showAlert(showCatchError(error), 'error')
        })
    },

    async _loadPrintCheckPDF(printType: number, checkId: number) {
      let fileToView: File | null = null

      await executeApi()
        .get(
          `${URL_PATH_TREASURIES}/check-expenses/print/${checkId}?typeCheck=${printType}`,
          {
            responseType: 'blob',
          }
        )
        .then((response) => {
          const blob = response.data

          if (!blob.type.includes('pdf')) {
            showAlert('El archivo descargado no es un PDF válido', 'error')
            return
          }

          const fileName = `check-${checkId}.pdf`

          fileToView = new File([blob], fileName, {
            type: 'application/pdf',
          })
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })

      return fileToView
    },

    async _loadPrintChecks(typePrint: number, checkIds: number[] = []) {
      await executeApi()
        .post(
          `${URL_PATH_TREASURIES}/check-expenses/many-prints?typeCheck=${typePrint}`,
          { checks: checkIds },
          { responseType: 'blob' }
        )
        .then((response) => {
          const blob = new Blob([response.data], { type: 'application/zip' })

          const fileName = useUtils().getNameBlob(response)
          useUtils().downloadBlobXlxx(blob, fileName)

          showAlert('Cheques descargados correctamente', 'success')
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },
  },
})
