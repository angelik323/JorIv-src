import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IErrors } from '@/interfaces/global'
import { AxiosResponse } from 'axios'
import { replaceDevWithAccounting } from '@/utils'

const buildQuery = (
  params: Record<string, string | number | boolean | null | undefined>
) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') q.append(k, String(v))
  })
  return q.toString()
}

const isBlobJson = (b: Blob): boolean => {
  return b.type.startsWith('application/json')
}
export const useCostCenterReportV1 = defineStore(
  'cost-center-report-store-v1',
  {
    state: () => ({
      version: 'v1',
      cost_center_list: [] as Array<{
        account: string
        cost_center: string
        name: string
        initial_balance: number
        debit: number
        credit: number
        final_balance: number
      }>,
      cost_center_pages: { currentPage: 1, lastPage: 1 },
      loading: false,
      costCenterBalanceExcelBlob: null as Blob | null,
      costCenterBalancePdfBlob: null as Blob | null,
      isExcelReady: false,
      isPdfReady: false,
      report_excel_url: '' as string,
      report_pdf_url: '' as string,
    }),

    actions: {
      _normalizeItem(it: Record<string, unknown>) {
        const num = (v: unknown) =>
          Number(typeof v === 'string' || typeof v === 'number' ? v : 0)
        const str = (v: unknown) => (typeof v === 'string' ? v : '')

        return {
          account: str(it?.account ?? it?.cuenta),
          cost_center: str(it?.cost_center ?? it?.centro_costo),
          name: str(it?.name ?? it?.nombre),
          initial_balance: num(it?.initial_balance ?? it?.saldo_inicial),
          debit: num(it?.debit ?? it?.debitos),
          credit: num(it?.credit ?? it?.creditos),
          final_balance: num(it?.final_balance ?? it?.saldo_final),
        }
      },

      async _getCostCenterBalance(
        params: Record<string, string | number | boolean | null | undefined>
      ): Promise<boolean> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        this.loading = true

        try {
          const url = `${URL_PATH_ACCOUNTING}/balance-by-cost-center?${buildQuery(
            params
          )}`
          const { data } = await executeApi().get(url)

          const resp = (data ?? {}) as {
            success?: boolean
            message?: string
            data?: unknown
          }

          if (!resp?.success) {
            showAlert(
              resp?.message ||
                'Error al obtener el balance por centro de costo',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
            this.cost_center_list = []
            this.cost_center_pages = { currentPage: 1, lastPage: 1 }
            this.report_excel_url = ''
            this.report_pdf_url = ''
            return false
          }

          const payload: unknown = resp.data
          let items: unknown[] = []

          if (Array.isArray(payload)) {
            items = payload
          } else if (payload && typeof payload === 'object') {
            const p = payload as Record<string, unknown>
            if (Array.isArray(p.items)) {
              items = p.items as unknown[]
            } else {
              items = Object.keys(p)
                .filter((k) => /^\d+$/.test(k))
                .sort((a, b) => Number(a) - Number(b))
                .map((k) => p[k]) as unknown[]
            }

            const reportables = (p.reportables ?? {}) as Record<string, unknown>
            const excelUrl =
              typeof reportables.report_excel_url === 'string'
                ? reportables.report_excel_url
                : ''
            const pdfUrl =
              typeof reportables.report_pdf_url === 'string'
                ? reportables.report_pdf_url
                : ''
            this.report_excel_url = replaceDevWithAccounting(excelUrl ?? '')
            this.report_pdf_url = replaceDevWithAccounting(pdfUrl ?? '')
          }

          this.cost_center_list = (items ?? [])
            .filter(
              (it): it is Record<string, unknown> =>
                !!it && typeof it === 'object'
            )
            .map((it) => this._normalizeItem(it))

          this.cost_center_pages = { currentPage: 1, lastPage: 1 }

          showAlert(
            resp.message || 'Balance por centro de costo cargado',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
          return true
        } catch (error) {
          const message = showCatchError(error as IErrors)
          useAlert().showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          this.cost_center_list = []
          this.cost_center_pages = { currentPage: 1, lastPage: 1 }
          this.report_excel_url = ''
          this.report_pdf_url = ''
          return false
        } finally {
          this.loading = false
        }
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
                a.download = 'Balance-Centro-Costo.xlsx'
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
              : 'Balance-Canetro-Costo.xlsx'

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

            if (isBlobJson(blob)) {
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
            this.costCenterBalancePdfBlob = blob
            const blobUrl = URL.createObjectURL(blob)

            setTimeout(() => URL.revokeObjectURL(blobUrl), 4000)
          })
          .catch((err: unknown) => {
            const maybeBlob = (err as { response?: { data?: unknown } })
              ?.response?.data
            if (maybeBlob instanceof Blob && isBlobJson(maybeBlob)) {
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
    },
  }
)
