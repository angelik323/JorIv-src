import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { replaceDevWithAccounting } from '@/utils'
import type { AxiosResponse } from 'axios'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IErrors } from '@/interfaces/global'
import { QueryParams } from '@/interfaces/customs'

export const useQuarterlyReportV1 = defineStore('quarterly-report-store-v1', {
  state: () => ({
    version: 'v1' as const,

    quarterly_balance_list: [] as Array<Record<string, unknown>>,
    quarterly_balance_pages: {
      currentPage: 0,
      lastPage: 0,
    },

    periodicBalanceExcelBlob: null as Blob | null,
    periodicBalancePdfBlob: null as Blob | null,

    isExcelReady: false,
    isPdfReady: false,

    report_excel_url: '' as string,
    report_pdf_url: '' as string,
  }),

  actions: {
    _getQuarterlyStatementBalance(params: QueryParams) {
      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()

      const query = this._toQueryString(params)
      const finalUrl = `${URL_PATH_ACCOUNTING}/quarterly-general-balance?${query}&paginate=1`

      return executeApi()
        .get<{
          success: boolean
          message?: string
          data: {
            data: Array<Record<string, unknown>>
            current_page: number
            last_page: number
            reportables?: {
              report_excel_url?: string | null
              report_pdf_url?: string | null
            }
          }
        }>(finalUrl)
        .then((response) => {
          const payload = response.data
          if (payload.success) {
            showAlert(
              payload.message ?? 'Consulta exitosa',
              'success',
              undefined,
              TIMEOUT_ALERT
            )

            const page = payload.data
            this.quarterly_balance_list = page.data ?? []

            this.quarterly_balance_pages.currentPage = page.current_page ?? 1
            this.quarterly_balance_pages.lastPage = page.last_page ?? 1

            this.report_excel_url = replaceDevWithAccounting(
              page.reportables?.report_excel_url ?? ''
            )
            this.report_pdf_url = replaceDevWithAccounting(
              page.reportables?.report_pdf_url ?? ''
            )

            return page
          }

          showAlert(
            payload.message || 'Error al obtener el balance general',
            'error',
            undefined,
            TIMEOUT_ALERT
          )
          return null
        })
        .catch((error) => {
          const message = showCatchError(error as IErrors)
          useAlert().showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    downloadBlob(blob: Blob, fileName: string): void {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },

    downloadPeriodicBalanceExcel(): void {
      const { showAlert } = useAlert()

      if (!this.report_excel_url) {
        showAlert('No hay archivo Excel generado aún', 'error')
        return
      }

      const authData = JSON.parse(
        localStorage.getItem('login-auth') || '{}'
      ) as { token?: string }
      const token = authData?.token || ''
      const fixedUrl = this.report_excel_url.replace(
        'https://internal-microservices-alb-629888295.us-east-1.elb.amazonaws.com/uat/api/accounting',
        URL_PATH_ACCOUNTING
      )
      executeApi()
        .get(fixedUrl, {
          responseType: 'blob',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then(async (response) => {
          const blob: Blob = response.data
          const ct = String(
            response.headers?.['content-type'] || ''
          ).toLowerCase()

          if (ct.includes('application/json')) {
            const text = await blob.text()
            try {
              const json = JSON.parse(text) as {
                success?: boolean
                message?: string
                data?: { report_url?: string }
              }

              if (json?.success === false) {
                showAlert(
                  json?.message || 'El reporte no está disponible aún',
                  'error'
                )
                return
              }

              const reportUrl = json?.data?.report_url
              if (!reportUrl) {
                showAlert('El servidor no envió la URL del reporte.', 'error')
                return
              }
              const a = document.createElement('a')
              a.href = reportUrl
              a.target = '_blank'
              a.rel = 'noopener noreferrer'
              a.download = 'Balance-Trimestral.xlsx'
              document.body.appendChild(a)
              a.click()
              a.remove()

              return
            } catch {
              showAlert(
                'Error inesperado al interpretar respuesta del servidor.',
                'error'
              )
              return
            }
          }

          const cd = String(response.headers?.['content-disposition'] || '')
          const match = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(cd)
          const suggestedName = match
            ? decodeURIComponent(match[1])
            : 'Balance-Trimestral.xlsx'

          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = suggestedName
          document.body.appendChild(a)
          a.click()
          a.remove()
          setTimeout(() => window.URL.revokeObjectURL(url), 2000)
        })
        .catch((error: unknown) => {
          const res = (
            error as {
              response?: { data?: unknown; headers?: Record<string, unknown> }
            }
          )?.response
          if (res && res.data instanceof Blob) {
            const ctErr = String(
              res.headers?.['content-type'] || ''
            ).toLowerCase()
            if (ctErr.includes('application/json')) {
              res.data.text().then((text: string) => {
                try {
                  const json = JSON.parse(text) as { message?: string }
                  showAlert(
                    json?.message || 'Error desconocido al descargar Excel.',
                    'error'
                  )
                } catch {
                  showAlert(
                    'Error inesperado al interpretar respuesta del servidor.',
                    'error'
                  )
                }
              })
              return
            }
          }
          showAlert('Error al descargar el Excel', 'error')
        })
    },

    downloadPeriodicBalancePdf(): void {
      const { showAlert } = useAlert()

      if (!this.report_pdf_url) {
        showAlert('No hay archivo PDF generado aún', 'error')
        return
      }

      const authData = JSON.parse(
        localStorage.getItem('login-auth') || '{}'
      ) as { token?: string }
      const token = authData.token ?? ''
      const fixedUrl = this.report_pdf_url.replace(
        'https://internal-microservices-alb-629888295.us-east-1.elb.amazonaws.com/uat/api/accounting',
        URL_PATH_ACCOUNTING
      )
      executeApi()
        .get(fixedUrl, {
          responseType: 'blob',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then(async (response: AxiosResponse<Blob>) => {
          const blob = response.data

          if (this._isBlobJson(blob)) {
            const text = await blob.text()
            try {
              const json = JSON.parse(text) as {
                success?: boolean
                message?: string
                data?: { report_url?: string }
              }

              if (json.success === false) {
                showAlert(
                  json.message || 'No se puede descargar el archivo aún.',
                  'error'
                )
                return
              }

              const reportUrl = json.data?.report_url
              if (!reportUrl) {
                showAlert('El servidor no envió la URL del reporte.', 'error')
                return
              }

              const a = document.createElement('a')
              a.href = reportUrl
              a.target = '_blank'
              a.rel = 'noopener noreferrer'
              document.body.appendChild(a)
              a.click()
              a.remove()

              return
            } catch {
              showAlert(
                'Error inesperado al interpretar respuesta del servidor.',
                'error'
              )
              return
            }
          }
          this.periodicBalancePdfBlob = blob
          const blobUrl = URL.createObjectURL(blob)

          setTimeout(() => URL.revokeObjectURL(blobUrl), 4000)
        })
        .catch((err: unknown) => {
          const maybeBlob = (err as { response?: { data?: unknown } })?.response
            ?.data
          if (maybeBlob instanceof Blob && this._isBlobJson(maybeBlob)) {
            maybeBlob.text().then((text) => {
              try {
                const json = JSON.parse(text) as { message?: string }
                showAlert(
                  json.message || 'Error desconocido al descargar PDF.',
                  'error'
                )
              } catch {
                showAlert(
                  'Error inesperado al interpretar respuesta del servidor.',
                  'error'
                )
              }
            })
            return
          }

          showAlert('Error al descargar el PDF', 'error')
        })
    },

    _toQueryString(params: QueryParams): string {
      return Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
        )
        .join('&')
    },

    _isBlobJson(b: Blob): boolean {
      return b.type.startsWith('application/json')
    },
  },
})
