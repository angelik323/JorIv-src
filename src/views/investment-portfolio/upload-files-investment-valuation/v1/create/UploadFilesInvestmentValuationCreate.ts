import { ref, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { ITabs } from '@/interfaces/global'
import { useUtils, useMainLoader, useAlert } from '@/composables'
import {
  useUploadFilesInvestmentValuationStore,
  useResourceManagerStore,
} from '@/stores'

const useUploadFilesInvestmentValuationCreate = () => {
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _createUploadFiles, _getCheckFileUploadStatus, _clearData } =
    useUploadFilesInvestmentValuationStore('v1')
  const {
    upload_files_investment_valuation_form,
    group_charging_id,
    check_file_upload_status_list,
  } = storeToRefs(useUploadFilesInvestmentValuationStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const keys = {
    investment_portfolio: ['price_provider_issuers'],
  }

  const MAX_ATTEMPTS_EMPTY_RESPONSE = 10
  const MAX_TOTAL_ATTEMPTS = 50

  const informationFormRef = ref()
  const progressTarget = ref(0)
  const completedUploads = ref(false)
  let pollingIntervalId: ReturnType<typeof setInterval> | null = null
  let progressAnimationInterval: ReturnType<typeof setInterval> | null = null

  const headerProps = {
    title: 'Cargue archivo valoración diaria',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Cargue archivo valoración diaria',
        route: 'UploadFilesInvestmentValuationCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const progressValue = computed(() => progressTarget.value / 100)

  const makeDataRequest = (): FormData => {
    const form = upload_files_investment_valuation_form.value
    const formData = new FormData()

    formData.append(
      'issuers_counterparty_id',
      String(form?.issuers_counterparty_id ?? '')
    )
    formData.append('upload_date', form?.upload_date ?? '')

    if (form?.files?.length) {
      form.files.forEach((fileObj, index) => {
        if (fileObj.file_structure_name instanceof File) {
          formData.append(
            `files[${index}][file_structure_name]`,
            fileObj.file_structure_name
          )
          formData.append(
            `files[${index}][label_name]`,
            fileObj.label_name || ''
          )
          formData.append(
            `files[${index}][method_name]`,
            fileObj.method_name || ''
          )
        }
      })
    }

    return formData
  }

  const cleanUp = () => {
    clearInterval(pollingIntervalId as unknown as number)
    if (progressAnimationInterval)
      clearInterval(progressAnimationInterval as unknown as number)
    progressAnimationInterval = null
    pollingIntervalId = null
  }

  const startPollingCheckStatus = () => {
    let emptyResponseCount = 0
    let totalAttempts = 0

    if (pollingIntervalId !== null) return

    const startProgressAnimation = () => {
      progressAnimationInterval = setInterval(() => {
        if (completedUploads.value || progressTarget.value >= 90) {
          if (progressAnimationInterval)
            clearInterval(progressAnimationInterval as unknown as number)
          progressAnimationInterval = null
          return
        }
        progressTarget.value = Math.min(progressTarget.value + 1, 90)
      }, 500)
    }

    const checkStatus = async () => {
      if (completedUploads.value || totalAttempts >= MAX_TOTAL_ATTEMPTS) {
        if (totalAttempts >= MAX_TOTAL_ATTEMPTS) {
          showAlert('El registro no pudo ser creado.', 'error')
        }
        cleanUp()
        return
      }

      totalAttempts++

      await _getCheckFileUploadStatus().then(() => {
        const list = check_file_upload_status_list.value
        if (!list || list.length === 0) {
          emptyResponseCount++
          if (emptyResponseCount >= MAX_ATTEMPTS_EMPTY_RESPONSE) {
            cleanUp()
            emptyResponseCount = 0
            showAlert('El registro no pudo ser creado.', 'error')
          }
          return
        }

        emptyResponseCount = 0
        const total = list.length
        const completed = list.filter((item) => {
          const statusNum = Number(item.status_id)
          return statusNum === 66 || statusNum === 67
        }).length

        const isCompleted = completed === total
        completedUploads.value = isCompleted

        if (isCompleted) {
          progressTarget.value = 100
          cleanUp()
          _clearData()
          return
        }
      })
    }

    startProgressAnimation()
    checkStatus()
    pollingIntervalId = setInterval(checkStatus, 3000)
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return

    const payload = makeDataRequest()
    openMainLoader(true)
    const success = await _createUploadFiles(payload)
    openMainLoader(false)

    if (success && group_charging_id.value) {
      startPollingCheckStatus()
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    if (pollingIntervalId) {
      cleanUp()
    }
    _resetKeys(keys)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    progressValue,
    onSubmit,
  }
}

export default useUploadFilesInvestmentValuationCreate
