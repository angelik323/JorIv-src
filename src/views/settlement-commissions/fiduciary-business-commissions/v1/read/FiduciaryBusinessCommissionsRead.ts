import { ref, onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IFiduciaryBusinessCommissionsForm,
  IFiduciaryBusinessCommissionsResponse,
} from '@/interfaces/customs'

// Composables
import { useMainLoader } from '@/composables'

// Stores
import { useFiduciaryBusinessCommissionsStore } from '@/stores'

const useFiduciaryBusinessCommissionsRead = () => {
  const {
    _getByIdFiduciaryBusinessCommissions,
    _getByIdDescriptionsFiduciaryBusinessCommissions,
    _clearData,
  } = useFiduciaryBusinessCommissionsStore('v1')
  const { fiduciary_business_commissions_response } = storeToRefs(
    useFiduciaryBusinessCommissionsStore('v1')
  )

  // Referencias a formularios
  const basicDataFormRef = ref()
  const descriptionsFormRef = ref()

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()

  const basic_data = ref<IFiduciaryBusinessCommissionsForm | null>(null)

  const headerProps = {
    title: 'Ver comisión de negocios fiduciarios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Definir Comisiones de negocios fiduciarios',
        route: 'BusinessTrustCommissionsList',
      },
      {
        label: 'ver',
        route: 'FiduciaryBusinessCommissionsRead',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic-data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const setFormRead = (data: IFiduciaryBusinessCommissionsResponse) => {
    const {
      business_code_snapshot,
      business_name_snapshot,
      commission_class_catalog_id,
      commission_type_catalog_id,
      periodicity,
      colllection,
      iva,
      observation,
      commission_class_catalog,
      commission_type_catalog,
      commission_type,
      third_party_billings_id,
      third_party_billings,
    } = data

    basic_data.value = {
      business_code: business_code_snapshot ?? null,
      name: business_name_snapshot ?? null,
      commission_class_catalog_id: commission_class_catalog_id ?? null,
      commission_class_catalog_name: commission_class_catalog?.name ?? null,
      commission_type_catalog_id: commission_type_catalog_id ?? null,
      commission_type_catalog_name: commission_type_catalog?.name ?? null,
      commission_type_description: commission_type?.description ?? null,
      periodicity: periodicity ?? null,
      colllection: colllection ?? null,
      iva: iva ?? null,
      observation: observation ?? null,
      third_party_billings_id: third_party_billings_id ?? null,
      third_party_billings: third_party_billings ?? null,
    }
  }

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    router.push({ name: 'BusinessTrustCommissionsList' })
  }

  watch(
    () => fiduciary_business_commissions_response.value,
    (val) => {
      if (!val) return
      setFormRead(val)
    }
  )

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdFiduciaryBusinessCommissions(searchId)
    await _getByIdDescriptionsFiduciaryBusinessCommissions(searchId)
    openMainLoader(false)
  })

  return {
    fiduciary_business_commissions_response,
    basic_data,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    descriptionsFormRef,

    nextTab,
    backTab,
    onSubmit,
  }
}

export default useFiduciaryBusinessCommissionsRead
