// vue - pinia - vue - router
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// composables
import { useMainLoader } from '@/composables'

// interfaces
import {
  IGuaranteesForm,
  IGuaranteesResponse,
} from '@/interfaces/customs/trust-business/Guarantees'
import { ITabs } from '@/interfaces/global'

// stores
import { useGuaranteesStore } from '@/stores/trust-business/guarantees'

// utils
import { defaultIconsLucide } from '@/utils'

const useGuaranteesRead = () => {
  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { _getByIdGuarantees, _clearData } = useGuaranteesStore('v1')
  const { guarantees_response } = storeToRefs(useGuaranteesStore('v1'))
  const { openMainLoader } = useMainLoader()

  const data_information_form = ref<IGuaranteesForm | null>(null)
  const observation = ref<string>('')

  const headerProps = {
    title: 'Ver garantía',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Garantías',
        route: 'GuaranteesList',
      },
      {
        label: 'Ver',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'auth',
      label: 'Autorizar*',
      icon: defaultIconsLucide.circleCheckBig,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const goToList = () => {
    const fromData = route.query.from

    if (typeof fromData === 'string') {
      const parsed = JSON.parse(fromData)
      router.push(parsed)
    } else {
      router.push({ name: 'GuaranteesList' })
    }
  }

  const setFormRead = (data: IGuaranteesResponse | null) => {
    if (!data) return
    data_information_form.value = {
      id: data.id,
      business_trust_id: data.business_trust?.id ?? null,
      business_trust_name: `${data.business_trust?.id} - ${data.business_trust?.name}`,
      currency_id: data.currency_id ?? null,
      currency_name: data.currency ? `${data.currency.code} - ${data.currency.description}` : null,
      description: data.description ?? null,
      expiration_date: data.expiration_date ?? null,
      guarantee_number: data.guarantee_number ?? null,
      guarantee_type: data.guarantee_type ?? null,
      guaranteed_value: data.guaranteed_value ?? null,
      linkage_type: data.linkage_type ?? null,
      observations: data.observations ?? null,
      registration_date: data.registration_date ?? null,
      specification: data.specification ?? null,
      secured_creditor_id: data.secured_creditor?.id ?? null,
      secured_creditor_name: `${data.secured_creditor?.document} - ${data.secured_creditor?.name} `,
      guarantee_status_id: data.guarantee_status?.id ?? null,
      registration_status: data.registration_status?.id ?? null,
      documents: data.attachments?.map((item) => ({
        id: item.id,
        is_new: true,
        url: item.s3_file_path,
        name: item.original_name,
      })),
    }
  }

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdGuarantees(searchId)
    openMainLoader(false)
  })

  const onSubmit = async () => {
    openMainLoader(true)

    goToList()
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  watch(
    () => guarantees_response.value,
    (val) => {
      if (!val) return
      setFormRead(val)
    },
    { deep: true, immediate: true }
  )

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    data_information_form,
    tabs,
    observation,
    guarantees_response,
    goToList,
    backTab,
    nextTab,
    onSubmit,
  }
}

export default useGuaranteesRead
