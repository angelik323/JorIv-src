// vue - quasar - pinia
import { ref, onMounted, onUnmounted, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// composables
import { useMainLoader } from '@/composables'

// stores
import { useTrustBusinessMovementCodesStore } from '@/stores/trust-business/movement-codes'
import { useResourceStore } from '@/stores/resources-selects'
import { useResourceManagerStore } from '@/stores/resources-manager'

// intertaces
import { ITabs } from '@/interfaces/global'
import { ITrustBusinessMovementCodesCreate } from '@/interfaces/customs/trust-business/MovementCodes'

// utils
import { defaultIconsLucide } from '@/utils'

const useTrustBusinessMovementCodeEdit = () => {
  const router = useRouter()
  const route = useRoute()

  const trustBusinessMovementCodeId = +route.params.id

  const { openMainLoader } = useMainLoader()

  const { data_information_form, business_trust_movement_codes_request } =
    storeToRefs(useTrustBusinessMovementCodesStore('v1'))

  const {
    _setDataInformationForm,
    _updateTrustBusinessMovementCode,
    _getTrustBusinessResourcesById,
  } = useTrustBusinessMovementCodesStore('v1')

  const { _getTrustBusinessResources } = useResourceStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = [
    'movement_codes_natures',
    'movement_codes_types',
    'collection_shapes',
    'movement_codes',
    'movement_concept_invoice',
  ]

  const keys2 = { fics: ['movements_codes'] }

  const headerProps = {
    title: 'Editar código de movimiento de negocios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
      },
      {
        label: 'Código de movimiento de negocio',
      },
      {
        label: 'Editar',
        route: 'TrustBusinessMovementCodesEdit',
      },
      { label: `${trustBusinessMovementCodeId}` },
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

  const makeDataRequest = (): ITrustBusinessMovementCodesCreate => {
    return {
      description: data_information_form.value?.description ?? '',
      nature: data_information_form.value?.nature ?? '',
      movement: data_information_form.value?.movement ?? '',
      has_ganerate_accounting:
        data_information_form.value?.has_ganerate_accounting ?? false,
      has_cancellation_movement_code: data_information_form.value
        ?.has_ganerate_accounting
        ? data_information_form.value?.has_cancellation_movement_code
        : '',
      applies_to_goods: data_information_form.value?.applies_to_goods ?? false,
      good_type_code: data_information_form.value?.applies_to_goods
        ? data_information_form.value.good_type_code
        : '',
      has_iva: data_information_form.value?.has_iva ?? false,
      percentage_iva: data_information_form.value?.has_iva
        ? data_information_form.value?.percentage_iva
        : '',
      iva_movement_code: data_information_form.value?.iva_movement_code ?? '',
      has_affects_funds:
        data_information_form.value?.has_affects_funds ?? false,
      funds_movement_code: data_information_form.value?.has_affects_funds
        ? data_information_form.value?.funds_movement_code
        : '',
      collection_shape: data_information_form.value?.collection_shape ?? '',
      has_generate_invoice:
        data_information_form.value?.has_generate_invoice ?? false,
      billing_concept: data_information_form.value?.has_generate_invoice
        ? data_information_form.value?.billing_concept
        : '',
    }
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    data_information_form.value = null
    await _getTrustBusinessResources(`keys[]=${keys.join('&keys[]=')}`)
    await _getResources(keys2)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
    _resetKeys(keys2)
  })

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (
        await _updateTrustBusinessMovementCode(
          payload,
          trustBusinessMovementCodeId
        )
      ) {
        router.push({
          name: 'TrustBusinessMovementCodesList',
          query: { reload: 1 },
        })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    data_information_form.value = null
    await _getTrustBusinessResourcesById(trustBusinessMovementCodeId)
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    business_trust_movement_codes_request,
    formInformation,
    handlerGoTo,
    onSubmit,
  }
}

export default useTrustBusinessMovementCodeEdit
