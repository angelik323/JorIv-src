// vue
import { onBeforeMount, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/global/Tabs'
import {
  IAccountingInformation,
  IAddressHistory,
  IDepreciationHistory,
  IDocumentsRegister,
  IEntryInfomation,
  INoveltyHistory,
  IRegisterForm,
  IRegisterResponse,
} from '@/interfaces/customs/fixed-assets/v1/Register'

// composables
import { useGoToUrl, useMainLoader } from '@/composables'
import { useUtils } from '@/composables/useUtils'

// stores
import { useRegisterStore } from '@/stores/fixed-assets/register'

const useRegisterRead = () => {
  //imports
  const route = useRoute()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { _getRegisterById, _downloadExcelById, _downloadPdfById } =
    useRegisterStore('v1')

  // stores
  const { headerPropsDefault } = storeToRefs(useRegisterStore('v1'))

  // breadcrumb
  const searchId = +route.params.id
  const headerPropsRead = {
    title: `Ver ${headerPropsDefault.value.title.toLowerCase()}`,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Ver',
          route: 'RegisterRead',
        },
        {
          label: `${searchId}`,
        },
      ],
    ],
  }

  // refs
  const responseData = ref()

  // data children
  const informationFormData = ref<IRegisterForm | null>(null)
  const documentsFormData = ref<IDocumentsRegister[] | null>(null)
  const entryInformationFormData = ref<IEntryInfomation | null>(null)
  const accountingInformationFormData = ref<IAccountingInformation | null>(null)
  const noveltyHistoryFormData = ref<INoveltyHistory[] | null>(null)
  const depreciationHistoryFormData = ref<IDepreciationHistory[] | null>(null)
  const addressHistoryFormData = ref<IAddressHistory[] | null>(null)

  // methods
  const setInformationFormData = (data: IRegisterForm | null) => {
    informationFormData.value = data
  }
  const setDocumentsFormData = (data: IDocumentsRegister[] | null) => {
    documentsFormData.value = data
  }
  const setEntryInformationFormData = (data: IEntryInfomation | null) => {
    entryInformationFormData.value = data
  }
  const setAccountingInformationFormData = (
    data: IAccountingInformation | null
  ) => {
    accountingInformationFormData.value = data
  }
  const setNoveltyHistoryFormData = (data: INoveltyHistory[] | null) => {
    noveltyHistoryFormData.value = data
  }
  const setDepreciationHistoryFormData = (
    data: IDepreciationHistory[] | null
  ) => {
    depreciationHistoryFormData.value = data
  }
  const setAddressHistoryFormData = (data: IAddressHistory[] | null) => {
    addressHistoryFormData.value = data
  }

  // tabs

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'entryInformation',
      label: 'Información de entrada',
      icon: defaultIconsLucide.filePlusCorner,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'accountingInformation',
      label: 'Información contable',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'noveltyHistory',
      label: 'Historial de novedades',
      icon: defaultIconsLucide.clipboardClock,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'depreciationHistory',
      label: 'Historial de depreciación',
      icon: defaultIconsLucide.banknoteArrowDown,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'addressHistory',
      label: 'Historial de direcciones',
      icon: defaultIconsLucide.mapPinned,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'documents',
      label: 'Documentos',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)

  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  // actions

  const onSubmit = async () => {
    openMainLoader(true)
    goToURL('RegisterList')
    openMainLoader(false)
  }

  const downloadExcelById = async () => {
    _downloadExcelById(searchId)
    return
  }
  const downloadPdfById = async () => {
    await _downloadPdfById(searchId)
    return
  }

  // lifecycles
  onBeforeMount(async () => {
    openMainLoader(true)

    const registerData: IRegisterResponse = await _getRegisterById(searchId)

    if (registerData) {
      const transformedData: IRegisterForm = {
        ...registerData,

        asset_transaction: registerData.transaction,
        transaction: {
          ...registerData.transaction,
          description:
            (registerData.transaction?.id ?? '') +
            ' - ' +
            registerData.configuration_subtype?.description,
        },
        asset_documents: registerData.documents.map((doc) => ({
          ...doc,
          name: doc.original_name,
        })),
        measurement_model: registerData.measurement_model ?? null,

        configuration_type_id: registerData.configuration_type?.id ?? null,
        configuration_subtype_id:
          registerData.configuration_subtype?.id ?? null,
        business_trust_id: registerData.business_trust?.id ?? null,
        status_id: registerData.status?.id ?? null,
        responsible_id: registerData.responsible?.id ?? null,
        responsible_document: registerData.responsible?.document ?? null,
        location_id: registerData.location?.location_type_id ?? null,
        cash_generating_unit_id: registerData.uge?.id ?? null,

        transaction_value: registerData.transaction?.transaction_value ?? null,
        created_by_name: registerData.created_by?.name ?? null,
        updated_by_name: registerData.updated_by?.name ?? null,

        asset_contributors: (registerData.contributors ?? []).map(
          (contributor) => ({
            id: contributor.id ?? null,
            nit: String(contributor.nit ?? ''),
            description: contributor.description ?? null,
            guarantee_percentage: contributor.percentage
              ? Number(contributor.percentage)
              : null,
            distribution_type: contributor.distribution_type ?? null,
          })
        ),
      }

      setInformationFormData(transformedData)
      setDocumentsFormData(transformedData.asset_documents ?? [])
      const entryInformationData: IEntryInfomation = {
        record_type: transformedData?.record_type,
        third_party_name:
          transformedData?.responsible?.document +
          ' - ' +
          (transformedData?.responsible?.full_name
            ? transformedData?.responsible?.full_name
            : transformedData?.responsible?.commercial_registration),
        transaction_value:
          transformedData?.asset_transaction?.transaction_value,
        purchase_order_number:
          transformedData?.asset_transaction?.purchase_order_number,
        asset_type: `${transformedData?.configuration_type?.code} - ${transformedData?.configuration_type?.description}`,
        asset_subtype: `${transformedData?.configuration_subtype?.code} - ${transformedData?.configuration_subtype?.description}`,
        transaction_date: transformedData?.asset_transaction?.transaction_date,
        license_plate: transformedData?.license_plate,
      }
      setEntryInformationFormData(entryInformationData)
      const accountingInformationData: IAccountingInformation = {
        accounting: {
          transaction_value:
            transformedData?.asset_transaction?.transaction_value,
          license_plate: transformedData?.license_plate,
          books_value:
            transformedData?.asset_accounting?.accounting.books_value, // pendiente
          depreciation_rate:
            transformedData?.asset_accounting?.accounting.depreciation_rate ||
            '', // pendiente
        },
        depreciation: {
          // pendiente
          useful_life_in_years:
            transformedData?.asset_accounting?.depreciation
              ?.useful_life_in_years || 0,
          annual_depreciation:
            transformedData?.asset_accounting?.depreciation
              ?.annual_depreciation || 0,
          useful_life_depreciation:
            transformedData?.asset_accounting?.depreciation
              ?.useful_life_depreciation || 0,
          accumulated_depreciation:
            transformedData?.asset_accounting?.depreciation
              ?.accumulated_depreciation || 0,
        },
        impairment: {
          // pendiente
          impairment_value:
            transformedData?.asset_accounting?.impairment?.impairment_value,
          impairment_residual_value:
            transformedData?.asset_accounting?.impairment
              ?.impairment_residual_value,
        },
      }
      setAccountingInformationFormData(accountingInformationData)

      const noveltyHistoryData: INoveltyHistory[] = [
        ...(transformedData?.novelty_history || []),
      ]
      setNoveltyHistoryFormData(noveltyHistoryData)

      const depreciationHistoryData: IDepreciationHistory[] = [
        ...(transformedData?.depreciation_history || []),
      ]
      setDepreciationHistoryFormData(depreciationHistoryData)

      const addressHistoryData: IAddressHistory[] = [
        ...(transformedData?.address_history || []),
      ]
      setAddressHistoryFormData(addressHistoryData)
    }

    openMainLoader(false)
  })

  onUnmounted(() => {
    responseData.value = null
    informationFormData.value = null
    documentsFormData.value = null
    entryInformationFormData.value = null
    accountingInformationFormData.value = null
    noveltyHistoryFormData.value = null
    depreciationHistoryFormData.value = null
    addressHistoryFormData.value = null
  })

  return {
    defaultIconsLucide,

    headerPropsRead,
    tabs,
    tabActive,
    tabActiveIdx,

    informationFormData,
    documentsFormData,
    entryInformationFormData,
    accountingInformationFormData,
    noveltyHistoryFormData,
    depreciationHistoryFormData,
    addressHistoryFormData,

    nextTab,
    backTab,
    onSubmit,
    goToURL,

    downloadExcelById,
    downloadPdfById,
  }
}

export default useRegisterRead
