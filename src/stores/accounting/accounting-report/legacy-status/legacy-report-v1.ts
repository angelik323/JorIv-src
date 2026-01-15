import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { ILegacyReportModel } from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { replaceDevWithAccounting } from '@/utils'
import { TIMEOUT_ALERT } from '@/constants/alerts'

import { QueryParams, ApiResponse } from '@/interfaces/customs'
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

export const useLegacyStatusV1 = defineStore('legacy-report-store-v1', {
  state: () => ({
    version: 'v1',
    legacy_status_list: [] as ILegacyReportModel[],
    legacy_status_pages: {
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
    _getLegacyStatusBalance(params: Record<string, unknown>) {
      const { showAlert } = useAlert()

      const qs = toQueryString({ ...(params as QueryParams), paginate: 1 })
      const finalUrl = `${URL_PATH_ACCOUNTING}/equity-change-report/generate?${qs}`

      return executeApi()
        .get<ApiResponse>(finalUrl)
        .then((response) => {
          if (!response.data.success) {
            showAlert(
              response.data.message || 'Error al obtener el balance general',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
            this.legacy_status_list = []
            this.legacy_status_pages.currentPage = 1
            this.legacy_status_pages.lastPage = 1
            this.report_excel_url = ''
            this.report_pdf_url = ''
            return null
          }

          showAlert(response.data.message, 'success', undefined, TIMEOUT_ALERT)

          const { data: body = {}, reportables: topRep } = response.data as {
            success: boolean
            message?: string
            data?: unknown
            reportables?: { report_pdf_url?: string; report_excel_url?: string }
          }

          const rep =
            (
              body as {
                reportables?: {
                  report_pdf_url?: string
                  report_excel_url?: string
                }
              }
            ).reportables ?? topRep

          this.legacy_status_list = body as ILegacyReportModel[]
          this.legacy_status_pages.currentPage = 1
          this.legacy_status_pages.lastPage = 1
          this.report_excel_url = replaceDevWithAccounting(
            rep?.report_excel_url
          )
          this.report_pdf_url = replaceDevWithAccounting(rep?.report_pdf_url)

          return body
        })
        .catch((e: unknown) => {
          const message = useShowError().showCatchError(e as IErrors)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
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
          const maybeBlob = (err as { response?: { data?: unknown } })?.response
            ?.data
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
})
