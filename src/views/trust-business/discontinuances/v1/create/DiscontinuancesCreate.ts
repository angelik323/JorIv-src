// vue - quasar
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useAlert, useMainLoader, useS3Documents } from '@/composables'

// stores
import { useDiscontinuancesStore } from '@/stores/trust-business/discontinuances'
import { useResourceManagerStore } from '@/stores/resources-manager'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { IFile, ITabs } from '@/interfaces/global'
import { IDiscontinuances } from '@/interfaces/customs/trust-business/Discontinuances'
import { IDocumentRealStateProject } from '@/interfaces/customs/trust-business/RealStateProject'

const useDiscontinuancesCreate = () => {
  const router = useRouter()

  const { showAlert } = useAlert()

  // imports
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _createAction, _clearData, _addFile } = useDiscontinuancesStore('v1')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const { data_information_form } = storeToRefs(useDiscontinuancesStore('v1'))
  const keys = {
    trust_business: [
      'business_trusts_property_withdrawals_states',
      'means_of_payment',
    ],
  }

  const keys2 = {
    trust_business: ['business_trusts'],
  }

  const keysV2 = {
    treasury: ['banks'],
  }

  // props
  const headerProps = {
    title: 'Crear desistimiento',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Desistimientos',
        route: 'DiscontinuancesList',
      },
      {
        label: 'Crear',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)

  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  const makeDataRealSateProject = async (): Promise<IDiscontinuances> => {
    const docsEntries = await Promise.all(
      (data_information_form.value?.documents ?? []).map(
        async (doc): Promise<[string, string]> => {
          const aux = await handleDocumentsUpload([doc])
          return [doc.DbType ?? '', aux[0] ?? '']
        }
      )
    )

    const docsMap = new Map<string, string>(docsEntries)

    return {
      id: data_information_form.value?.id,
      business_trust_id: data_information_form.value?.business_trust_id ?? null,
      real_estate_project_id:
        data_information_form.value?.real_estate_project_id ?? null,
      project_stage_id: data_information_form.value?.project_stage_id ?? null,
      business_trust_property_id:
        data_information_form.value?.business_trust_property_id ?? null,
      status_id: data_information_form.value?.status_id ?? 63,
      date_register: data_information_form.value?.date_register ?? '',
      date_vinculation: data_information_form.value?.date_vinculation ?? '',
      property_value: data_information_form.value?.property_value ?? '',
      total_paid: data_information_form.value?.total_paid ?? '',
      balance_due: data_information_form.value?.balance_due ?? '',
      order_number: data_information_form.value?.order_number ?? '',
      refund_amount: `${data_information_form.value?.total_paid ?? '0'}`,
      retention_amount: data_information_form.value?.retention_amount ?? null,
      penalty_amount: data_information_form.value?.penalty_amount ?? null,
      net_refund_amount: data_information_form.value?.net_refund_amount ?? 0,
      refund_method_id: Number(data_information_form.value?.refund_method_id),

      refund_method_name:
        data_information_form.value?.refund_method_name ?? null,
      bank_id: data_information_form.value?.bank_id ?? null,
      bank_account_number:
        data_information_form.value?.bank_account_number ?? null,
      trust_account_number:
        data_information_form.value?.trust_account_number ?? null,
      support_bank_account: {
        id: (await Number(docsMap.get('support_bank_account'))) ?? 0,
        is_validated: true,
      },
      support_id_copy: {
        id: (await Number(docsMap.get('support_id_copy'))) ?? 0,
        is_validated: true,
      },
      support_withdrawal_instruction: {
        id: (await Number(docsMap.get('support_withdrawal_instruction'))) ?? 0,
        is_validated: true,
      },
    }
  }

  const handleDocumentsUpload = async (
    files: IDocumentRealStateProject[]
  ): Promise<string[]> => {
    const documentIds: string[] = []
    const uploadUrls: string[] = []
    const filesToUpload: IFile[] = []

    for (const fileField of files) {
      const file = fileField
      if (!file) continue
      const { success, documentId, uploadUrl } = await _addFile(
        file.name ?? '',
        getExtensionFromMimeType(file.type ?? ''),
        file.file.name
      )

      if (!success || !documentId || !uploadUrl) continue

      documentIds.push(documentId.toString())
      uploadUrls.push(uploadUrl)
      filesToUpload.push(file.file)
    }

    if (!uploadUrls.length || !filesToUpload.length) return []

    await _saveDocumentsS3(uploadUrls, filesToUpload, false)

    return documentIds
  }

  const goToList = () => {
    _clearData()
    router.push({ name: 'DiscontinuancesList', query: { reload: 1 } })
  }

  const onSubmit = async () => {
    if (!(await validateForm()))
      return showAlert(
        'Formulario incompleto. ¡Rellene todos los campos y documentos!',
        'error',
        undefined,
        3000
      )

    openMainLoader(true)

    const data: IDiscontinuances = await makeDataRealSateProject()
    await _createAction(data)

    openMainLoader(false)
    goToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const allKeys = [keys, keys2]

  // lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)
    await Promise.all(allKeys.map((k) => _getResources(k)))

    await _getResources(keysV2, '', 'v2')
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    await Promise.all(allKeys.map((k) => _resetKeys(k)))
  })

  return {
    headerProps,
    tabs,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    formInformation,

    onSubmit,
    goToList,
  }
}
export default useDiscontinuancesCreate
