// vue - quasar
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useAlert, useMainLoader, useS3Documents } from '@/composables'

// stores
import { useSaleRealEstateStore } from '@/stores/trust-business/sale-real-estate'
import { useResourceManagerStore } from '@/stores/resources-manager'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { IFile, ITabs } from '@/interfaces/global'
import { ISaleRealEstate } from '@/interfaces/customs/trust-business/SaleRealEstate'
import { IDocumentRealStateProject } from '@/interfaces/customs/trust-business/RealStateProject'

const useSaleRealEstateCreate = () => {
  const router = useRouter()

  const { showAlert } = useAlert()

  // imports
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _createAction, _clearData, _addFile } = useSaleRealEstateStore('v1')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const { data_information_form } = storeToRefs(useSaleRealEstateStore('v1'))

  const keys = {
    trust_business: ['business_trust_real_estate_project'],
  }

  const keys2 = {
    trust_business: ['third_parties'],
  }

  // props
  const headerProps = {
    title: 'Crear venta de inmueble',
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
        label: 'Crear registro de proyecto inmobiliario',
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
        data_information_form.value?.has_extraordinary_paymentes ?? false,
      has_extraordinary_payment:
        data_information_form.value?.has_extraordinary_paymentes ?? false,
      fiduciary_mandate_id:
        data_information_form.value?.fiduciary_mandate_id ?? null,
      extraordinaryPayment:
        (data_information_form.value?.extraordinaryPayment?.length ?? 0) > 0
          ? data_information_form.value?.extraordinaryPayment
          : undefined,
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
    const idSale = await _createAction(data)

    if (idSale === 0) return openMainLoader(false)

    await handleDocumentsUpload(
      data_information_form.value?.documents ?? [],
      idSale
    )

    goToList()
    openMainLoader(false)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }
  const allKeys = [keys, keys2]

  // lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)

    await Promise.all(allKeys.map((k) => _getResources(k)))

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
export default useSaleRealEstateCreate
