import axios from 'axios'
import { useAlert } from '@/composables'
import { executeApi } from '@/apis'
import { IUploadedFile } from '@/interfaces/global'
import { FILE_MIME_TYPE_TO_EXTENSION_MAP } from '@/constants/files-map'

const TIMEOUT_ALERT = 5000
// const URL_PATH_ASSET = 'assets/api/assets/documents/presigned-url'
const URL_PATH = 'business-trust/api/business-trust/manage/file/2'
export const useS3Documents = () => {
  const { showAlert } = useAlert()

  const _saveDocumentsS3 = async (
    urls: string[],
    files: File[] | IUploadedFile[],
    showAlerts: boolean = true
  ) => {
    if (
      urls.length === 0 ||
      files.length === 0 ||
      urls.length !== files.length
    ) {
      if (showAlerts)
        showAlert(
          'La cantidad de URLs y archivos no coincide o no son válidos',
          'warning',
          undefined,
          TIMEOUT_ALERT
        )
      return
    }

    const uploadResults = await Promise.allSettled(
      files.map((file, index) => {
        const url = urls[index]
        return axios.put(url, file, {
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        })
      })
    )

    const results = uploadResults.map((result, index) => {
      const fileName = files[index].name
      if (result.status === 'fulfilled') {
        return { fileName, success: true }
      } else {
        return {
          fileName,
          success: false,
          error: result.reason?.message || 'Error desconocido',
        }
      }
    })

    const uploadsSuccesfully = results.filter((r) => r.success)
    const uploadsFailures = results.filter((r) => !r.success)

    if (uploadsSuccesfully.length > 0 && showAlerts) {
      showAlert(
        `${uploadsSuccesfully.length} archivo(s) enviado(s) correctamente`,
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    }

    if (uploadsFailures.length > 0 && showAlerts) {
      showAlert(
        `${uploadsFailures.length} archivo(s) no se pudieron enviar`,
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    }
  }

  const _getPresignedUrl = async (
    payload: Record<string, any>
  ): Promise<string | null> => {
    let url = null as string | null
    await executeApi()
      .post(URL_PATH, payload)
      .then((response) => {
        url = response.data.data.upload_url ?? null

        if (!response.data.success) {
          logError(
            {
              message: response.data.message,
              stack: 'Error en la respuesta',
              response: {
                data: response.data,
              },
            },
            '_getPresignedUrl'
          )
        }
      })
      .catch((error) => {
        logError(error, '_getPresignedUrl')
      })

    return url
  }

  const getExtensionFromMimeType = (mimeType: string): string => {
    const normalizedMimeType = mimeType.toLowerCase()
    return FILE_MIME_TYPE_TO_EXTENSION_MAP[normalizedMimeType] || 'bin'
  }

  return {
    _saveDocumentsS3,
    _getPresignedUrl,
    getExtensionFromMimeType,
  }
}
