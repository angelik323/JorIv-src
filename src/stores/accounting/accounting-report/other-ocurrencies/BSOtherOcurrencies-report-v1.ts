import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IOtherCurrenciesItem } from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { AxiosResponse } from 'axios'
import { TIMEOUT_ALERT } from '@/constants/alerts'

export const useOtherCurrenciesReportV1 = defineStore(
  'other-ocurrencies-report-store-v1',
  {
    state: () => ({
      version: 'v1',
      other_ocurrencies_list: [] as IOtherCurrenciesItem[],
      other_ocurrencies_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      report_pdf_url: '' as string,
      report_excel_url: '' as string,
      periodicBalancePdfBlob: null as Blob | null,
    }),

    actions: {
      _getTrialBalanceOtherCurrencies(params: Record<string, any>) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        const query = new URLSearchParams()
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null) {
            query.append(key, String(value))
          }
        }

        return executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/trial-balance-other-currencies?${query.toString()}`
          )
          .then((response) => {
            if (!response?.data?.success) {
              showAlert(
                response?.data?.message ||
                  'Error al obtener el balance de otras monedas',
                'error',
                undefined,
                TIMEOUT_ALERT
              )
              this.other_ocurrencies_list = []
              this.other_ocurrencies_pages = { currentPage: 1, lastPage: 1 }
              this.report_pdf_url = ''
              this.report_excel_url = ''
              return null
            }

            const pageData = response.data.data || {}
            const rows = Array.isArray(pageData.data) ? pageData.data : []

            this.other_ocurrencies_list = rows.map((item: any) => ({
              account: item?.account ?? '',
              auxiliary: item?.auxiliary ?? '',
              name: item?.name ?? '',
              initial_balance: Number(item?.initial_balance ?? 0),
              debit: Number(item?.debit ?? 0),
              credit: Number(item?.credit ?? 0),
              final_balance: Number(item?.final_balance ?? 0),
            })) as IOtherCurrenciesItem[]

            this.other_ocurrencies_pages = {
              currentPage: Number(pageData.current_page ?? 1),
              lastPage: Number(pageData.last_page ?? 1),
            }
            const rep = pageData.reportables || {}
            this.report_pdf_url = String(rep.report_pdf_url || '').replace(
              '/dev',
              '/accounting'
            )
            this.report_excel_url = String(rep.report_excel_url || '').replace(
              '/dev',
              '/accounting'
            )

            showAlert(
              response.data.message || 'Datos obtenidos correctamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )

            return this.other_ocurrencies_list
          })
          .catch((error) => {
            const message = showCatchError(error as IErrors)
            useAlert().showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            this.other_ocurrencies_list = []
            this.other_ocurrencies_pages = { currentPage: 1, lastPage: 1 }
            this.report_pdf_url = ''
            this.report_excel_url = ''
            return null
          })
      },

      downloadBlob(blob: Blob, fileName: string) {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      },

      downloadBSOtherOcurrenciesExcel(): void {
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
                a.download = 'Balance-General.xlsx'
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
              : 'Balance-General.xlsx'

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

      downloadBSOtherOcurrenciesPdf(): void {
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
            const maybeBlob = (err as { response?: { data?: unknown } })
              ?.response?.data
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

      _isBlobJson(b: Blob): boolean {
        return b.type.startsWith('application/json')
      },
    },
  }
)
