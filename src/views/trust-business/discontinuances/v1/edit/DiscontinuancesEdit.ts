// vue - quasar
import { onMounted, onBeforeUnmount, ref, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import {
  useAlert,
  useMainLoader,
  useS3Documents,
  useUtils,
} from '@/composables'

// stores
import { useDiscontinuancesStore } from '@/stores/trust-business/discontinuances'
import { useResourceManagerStore } from '@/stores/resources-manager'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { IFile, ITabs } from '@/interfaces/global'
import {
  IAttachmentTableDiscontinuances,
  IDiscontinuances,
  IDiscontinuancesExtraDataResponse,
} from '@/interfaces/customs/trust-business/Discontinuances'
import { IDocumentRealStateProject } from '@/interfaces/customs/trust-business/RealStateProject'

const useDiscontinuancesEdit = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const discontinuancesId = +route.params.id

  const { showAlert } = useAlert()

  // imports
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _updateAction,
    _clearData,
    _addFile,
    _getByIdAction,
    _deleteActionFile,
  } = useDiscontinuancesStore('v1')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const { data_information_form, data_response, data_tables } = storeToRefs(
    useDiscontinuancesStore('v1')
  )
  const response_map = ref<IDiscontinuances>()

  const keys = {
    trust_business: [
      'business_trusts_property_withdrawals_states',
      'project_stage',
      'business_trust_properties',
      'means_of_payment',
    ],
  }

  const keys2 = {
    trust_business: ['business_trusts'],
  }

  const keys3 = {
    trust_business: ['business_trust_real_estate_project'],
  }

  const keysV2 = {
    treasury: ['banks'],
  }

  // props
  const headerProps = {
    title: 'Editar desistimiento',
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
        label: 'Editar',
      },
      {
        label: `${discontinuancesId}`,
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

  const handleDeleteFiles = async () => {
    data_response.value?.attachments_table.forEach(async (element) => {
      await _deleteActionFile(element.id)
    })
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
    await _updateAction(discontinuancesId, data)
    await handleDeleteFiles()

    await openMainLoader(false)
    goToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdAction(discontinuancesId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  const allKeys = [keys, keys2, keys3]

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all(allKeys.map((k) => _getResources(k)))
    await _getResources(keysV2, '', 'v2')
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    await Promise.all(allKeys.map((k) => _resetKeys(k)))
  })

  watch(
    () => data_response.value,
    async () => {
      const data = data_response.value
      if (!data) return

      response_map.value = {
        id: data.id,
        business_trust_id: data.business_trust?.id ?? null,
        business_trust_name: data.business_trust?.name ?? null,
        real_estate_project_id: data.real_estate_project.id ?? null,
        real_estate_project_name: data.real_estate_project?.name ?? '',
        project_stage_id: data.project_stage.id ?? null,
        project_stage_name: `${data.project_stage?.stage_number} - ${data.project_stage?.observations}`,
        business_trust_property_id: data.property_nomenclature?.id ?? null,
        business_trust_property_name:
          data.property_nomenclature?.nomenclature ?? '',
        status_id: data.status_id ?? null,
        date_register: data.registration_date ?? '',
        date_vinculation: data.date_vinculation ?? '',
        property_value: data.property_value ?? '',
        total_paid: data.total_paid ?? '',
        balance_due: data.balance_due ?? '',
        order_number: data.order_number ?? '',
        refund_amount: data.order_of_payment?.refund_amount ?? null,
        retention_amount: data.order_of_payment?.retention_amount
          ? Number(data.order_of_payment.retention_amount)
          : null,
        penalty_amount: data.order_of_payment?.penalty_amount
          ? Number(data.order_of_payment.penalty_amount)
          : null,
        net_refund_amount: data.order_of_payment?.net_refund_amount
          ? Number(data.order_of_payment.net_refund_amount)
          : null,
        refund_method_id:
          Number(data.order_of_payment?.refund_method?.id) ?? null,

        refund_method_name:
          data.order_of_payment.refund_method?.type_mean_of_payments,
        bank_id: data.order_of_payment?.bank?.id ?? null,
        bank_name: data.order_of_payment?.bank?.description ?? '',
        bank_account_number: data.order_of_payment?.bank_account_number ?? null,
        bank_account_number_name:
          data.order_of_payment?.bank_account_number ?? null,

        documents: await Promise.all(
          (data.attachments_table ?? []).map(
            async (doc: IAttachmentTableDiscontinuances) => {
              const file = await useUtils().getFileFromS3(
                doc.actions.download_url,
                `${doc.original_name_file ? doc.original_name_file : doc.item}`
              )

              return {
                file,
                name: doc.original_name_file,
                DbType: doc.item,
                required: true,
                id: doc.id,
                type: doc.original_name_file
                  ? doc.original_name_file.split('.').pop() ?? 'unknown'
                  : 'unknown',
              } as IDocumentRealStateProject
            }
          )
        ).then((arr) => arr.filter((doc) => doc !== null)),
      } as IDiscontinuances

      data_tables.value = {
        owner: {
          id: data.main_owner.id,
          status_id: data.main_owner.status_id,
          status: data.main_owner.status,
          document_type_id: data.main_owner.document_type_id,
          document_type: data.main_owner.document_type,
          email: data.main_owner.email,
          phone: data.main_owner.phone,
          address: data.main_owner.address,
          document: data.main_owner.document,
          name: data.main_owner.name,
          type: data.main_owner.type,
        },
        payment_plans:
          data.payment_plans?.map((item) => ({
            id: item.id ?? 0,
            installment_number: item.installment_number ?? '',
            initial_balance: item.initial_balance ?? '',
            total_value: item.total_value ?? '',
            late_interest: item.late_interest ?? '',
            capital_fee: item.capital_fee ?? '',
            final_balance: item.final_balance ?? '',
            payment_date: item.payment_date ?? '',
            status_id: Number(item.status_id),
          })) ?? [],
      } as IDiscontinuancesExtraDataResponse
    },
    { deep: true }
  )

  return {
    headerProps,
    tabs,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    formInformation,
    response_map,

    onSubmit,
    goToList,
  }
}
export default useDiscontinuancesEdit
