// vue - quasar
import { onMounted, onBeforeUnmount, ref, watch, onBeforeMount } from 'vue'
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
import { useSaleRealEstateStore } from '@/stores/trust-business/sale-real-estate'
import { useResourceManagerStore } from '@/stores/resources-manager'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { IFile, ITabs } from '@/interfaces/global'
import { ISaleRealEstate } from '@/interfaces/customs/trust-business/SaleRealEstate'
import { IDocumentRealStateProject } from '@/interfaces/customs/trust-business/RealStateProject'
import { IAttachmentTableDiscontinuances } from '@/interfaces/customs/trust-business/Discontinuances'

const useSaleRealEstateEdit = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const saleRealEstateId = +route.params.id

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
  } = useSaleRealEstateStore('v1')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const { data_information_form, data_response } = storeToRefs(
    useSaleRealEstateStore('v1')
  )

  const response_map = ref<ISaleRealEstate>()

  const keys = {
    trust_business: ['business_trust_real_estate_project'],
  }

  const keys2 = {
    trust_business: ['third_parties'],
  }

  // props
  const headerProps = {
    title: 'Editar venta de inmueble',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Venta de inmueble',
        route: 'SaleRealEstateList',
      },
      {
        label: 'Editar registro de proyecto inmobiliario',
      },
      { label: `${saleRealEstateId}` },
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

  const makeDataRealSateProject = (): ISaleRealEstate => {
    return {
      creation_date: data_information_form.value?.creation_date,
      status_id: data_information_form.value?.status_id ?? null,
      buyers: data_information_form.value?.buyers,
      real_estate_project_id:
        data_information_form.value?.real_estate_project_id ?? null,
      real_estate_project_stage_id:
        data_information_form.value?.real_estate_project_stage_id ?? null,
      real_estate_project_nomenclature_id:
        data_information_form.value?.real_estate_project_nomenclature_id ??
        null,
      has_extraordinary_paymentes:
        data_information_form.value?.has_extraordinary_paymentes ?? null,
      has_extraordinary_payment:
        data_information_form.value?.has_extraordinary_paymentes ?? null,
      fiduciary_mandate_id:
        data_information_form.value?.fiduciary_mandate_id ?? null,
      extraordinaryPayment:
        (data_information_form.value?.extraordinaryPayment?.length ?? 0) > 0
          ? data_information_form.value?.extraordinaryPayment
          : undefined,
      payment_plan_list: data_information_form.value?.payment_plan_list,
      fiduciary_mandate: data_information_form.value?.fiduciary_mandate,
    }
  }

  const handleDocumentsUpload = async (
    files: IDocumentRealStateProject[],
    id: number
  ): Promise<string[]> => {
    const documentIds: string[] = []
    const uploadUrls: string[] = []
    const filesToUpload: IFile[] = []

    for (const fileField of files) {
      const file = fileField
      if (!file) continue
      const { success, documentId, uploadUrl } = await _addFile(
        file.name,
        getExtensionFromMimeType(file.type ?? ''),
        id,
        file.file.name.replace(/-/g, '_')
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
    router.push({ name: 'SaleRealEstateList', query: { reload: 1 } })
  }

  const handleDeleteFiles = async () => {
    const attachments = data_response.value?.attachments
    if (!attachments) return

    const keys_deep = [
      'sale_promise',
      'fiduciary_attachment',
      'preapproval_credit_letter',
      'assignment_letter',
      'adhesion_contract',
    ] as const

    for (const key of keys_deep) {
      const docs = attachments[key] ?? []
      for (const element of docs) {
        await _deleteActionFile(element.id, false)
      }
    }
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

    const data: ISaleRealEstate = makeDataRealSateProject()
    await _updateAction(saleRealEstateId, data)

    await handleDocumentsUpload(
      data_information_form.value?.documents ?? [],
      saleRealEstateId
    )
    await handleDeleteFiles()

    openMainLoader(false)
    goToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdAction(saleRealEstateId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  const allKeys = [keys, keys2]

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all(allKeys.map((k) => _getResources(k)))
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
        creation_date: data.created_at ?? '',
        status_id: data.status.id,
        buyers: data.buyers?.map((b) => ({
          buyer_id: b.third_party_id,
        })),
        real_estate_project_id: data.project_id,
        real_estate_project_stage_id: data.project_stage_id ?? null,
        real_estate_project_nomenclature_id: data.property_detail.id,
        type: data.type_property_text,
        area: data.property_detail.area,
        value: data.property_detail.value,
        date: data.property_detail.start_end,
        has_extraordinary_paymentes: data.has_extraordinary_payment ?? false,
        has_extraordinary_payment: data.has_extraordinary_payment ?? false,
        fiduciary_mandate_id: data.payment_plan?.fiduciary_mandate_id ?? null,
        fiduciary_mandate_name: data.payment_plan?.fiduciary_mandate ?? null,
        extraordinaryPayment: data.extraordinary_payments?.map((ep) => ({
          id: ep.id,
          extraordinary_payment_value: ep.amount,
          concept: ep.concept,
        })),
        payment_plan_list: data.payment_plan_list,
        financial_obligation: data.payment_plan?.financial_obligation,
        documents: await Promise.all(
          Object.values(data.attachments ?? {}).map(
            async (docs: IAttachmentTableDiscontinuances) => {
              if (Array.isArray(docs) && docs.length > 0) {
                const first = docs[0]
                const file = await useUtils().getFileFromS3(
                  first.s3_file_path,
                  `${
                    first.original_name_file
                      ? first.original_name_file
                      : first.name
                  }.${first.document_type}`
                )
                return {
                  file,
                  name: first.original_name_file,
                  DbType: first.original_name,
                  required: true,
                  id: first.id,
                  type: first.document_type,
                } as IDocumentRealStateProject
              }
              return null
            }
          )
        ).then((arr) => arr.filter((doc) => doc !== null)),
      } as ISaleRealEstate
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
export default useSaleRealEstateEdit
