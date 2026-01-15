import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IErrors } from '@/interfaces/global'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { replaceDevWithAccounting } from '@/utils'
import { TIMEOUT_ALERT } from '@/constants/alerts'

import { QueryParams } from '@/interfaces/customs'
import { AxiosResponse } from 'axios'

const toQueryString = (obj: QueryParams) => {
  const sp = new URLSearchParams()
  Object.entries(obj).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((x) => x != null && sp.append(k, String(x)))
    else if (v != null) sp.append(k, String(v))
  })
  return sp.toString()
}

const isBlobJson = (b: Blob): boolean => {
  return b.type.startsWith('application/json')
}

export const useAccumulatedAuxiliaryV1 = defineStore(
  'accumulated-report-store-v1',
  {
    state: () => ({
      version: 'v1',
      accumulated_auxiliary_list: [] as Array<Record<string, unknown>>,
      accumulated_auxiliary_pages: {
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
      _getAccumulatedAuxiliaryBalance(params: Record<string, unknown>) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        const qs = toQueryString({
          ...(params as Record<
            string,
            string | number | boolean | null | undefined
          >),
        })
        const finalUrl = `${URL_PATH_ACCOUNTING}/accumulated-report-by-account?${qs}`

        return executeApi()
          .get<{ success: boolean; message?: string; data: unknown }>(finalUrl)
          .then((response) => {
            const resp = response.data
            if (!resp.success) {
              showAlert(
                resp.message || 'Error al obtener el balance general',
                'error',
                undefined,
                TIMEOUT_ALERT
              )
              this.accumulated_auxiliary_list = []
              this.accumulated_auxiliary_pages.currentPage = 1
              this.accumulated_auxiliary_pages.lastPage = 1
              this.report_excel_url = ''
              this.report_pdf_url = ''
              return null
            }

            showAlert(
              resp.message ?? 'Consulta exitosa',
              'success',
              undefined,
              TIMEOUT_ALERT
            )

            const toObj = (v: unknown) =>
              v && typeof v === 'object' ? (v as Record<string, unknown>) : {}

            const raw = resp.data

            let payload = toObj(raw)
            if (Array.isArray(raw)) {
              const firstObj = raw.find((x) => x && typeof x === 'object') as
                | Record<string, unknown>
                | undefined
              if (firstObj) payload = firstObj
            }

            const itemsFromData = Array.isArray(payload.data)
              ? (payload.data as Array<Record<string, unknown>>)
              : null
            const itemsFromSections = Array.isArray(payload.sections)
              ? (payload.sections as Array<Record<string, unknown>>)
              : null
            const itemsFromNumericKeys = Object.keys(payload)
              .filter((k) => /^\d+$/.test(k))
              .sort((a, b) => Number(a) - Number(b))
              .map((k) => payload[k])
              .filter(
                (v): v is Record<string, unknown> =>
                  !!v && typeof v === 'object'
              )

            let items: Array<Record<string, unknown>> = []
            if (itemsFromData) items = itemsFromData
            else if (itemsFromSections) items = itemsFromSections
            else if (itemsFromNumericKeys.length) items = itemsFromNumericKeys
            else if (Array.isArray(raw)) {
              items =
                (raw.filter((x) => x && typeof x === 'object') as Array<
                  Record<string, unknown>
                >) ?? []
            }

            const current =
              typeof payload.current_page === 'number'
                ? (payload.current_page as number)
                : items.length
                ? 1
                : 1
            const last =
              typeof payload.last_page === 'number'
                ? (payload.last_page as number)
                : items.length
                ? 1
                : 1

            const reportables = toObj(payload.reportables)
            const excelUrl =
              typeof reportables.report_excel_url === 'string'
                ? (reportables.report_excel_url as string)
                : ''
            const pdfUrl =
              typeof reportables.report_pdf_url === 'string'
                ? (reportables.report_pdf_url as string)
                : ''

            this.accumulated_auxiliary_list = items
            this.accumulated_auxiliary_pages.currentPage = current ?? 1
            this.accumulated_auxiliary_pages.lastPage = last ?? 1
            this.report_excel_url = replaceDevWithAccounting(excelUrl ?? '')
            this.report_pdf_url = replaceDevWithAccounting(pdfUrl ?? '')
            this.isExcelReady = !!this.report_excel_url
            this.isPdfReady = !!this.report_pdf_url

            return {
              data: items,
              current_page: this.accumulated_auxiliary_pages.currentPage,
              last_page: this.accumulated_auxiliary_pages.lastPage,
              reportables: {
                report_excel_url: this.report_excel_url,
                report_pdf_url: this.report_pdf_url,
              },
            }
          })
          .catch((error) => {
            const message = showCatchError(error as IErrors)
            useAlert().showAlert(message, 'error', undefined, TIMEOUT_ALERT)
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
                const opened = window.open(
                  reportUrl,
                  '_blank',
                  'noopener,noreferrer'
                )
                if (!opened) {
                  const a = document.createElement('a')
                  a.href = reportUrl
                  a.target = '_blank'
                  a.rel = 'noopener noreferrer'
                  a.download = 'Balance-Trimestral.xlsx'
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                }
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
            this.periodicBalancePdfBlob = blob
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
