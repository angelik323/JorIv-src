import { onBeforeMount, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { defaultIconsLucide } from '@/utils'
import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useValidationVouchersStore } from '@/stores'

const useValidationVouchersView = () => {
  const route = useRoute()

  const validationVouchersId = +route.params.id

  const { _getByIdValidationVouchers, _setValidationVouchersView } =
    useValidationVouchersStore('v1')
  const { openMainLoader } = useMainLoader()

  const { validation_vouchers_view } = storeToRefs(
    useValidationVouchersStore('v1')
  )

  const headerProps = {
    title: 'Ver actualización de comprobante',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
      },
      {
        label: 'Validación de comprobantes',
        route: 'ValidationVoucherList',
      },
      {
        label: 'Ver',
        route: 'ValidationVouchersView',
      },
      {
        label: `${validationVouchersId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
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

  onUnmounted(async () => {
    _setValidationVouchersView(null)
  })

  onBeforeMount(async () => {
    openMainLoader(true)

    try {
      await _getByIdValidationVouchers(validationVouchersId)
    } finally {
      openMainLoader(false)
    }
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    validation_vouchers_view,
  }
}

export default useValidationVouchersView
