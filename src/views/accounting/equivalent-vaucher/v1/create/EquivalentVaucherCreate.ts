import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader, useAlert } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import type { ITabs } from '@/interfaces/global'
import { useEquivalentVaucherStore } from '@/stores/accounting/equivalent-vaucher'
import { ISelectedSubtypeRow } from '@/interfaces/customs'

const useEquivalentVaucherCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _createEquivalentVaucher } = useEquivalentVaucherStore('v1')

  const equivalentVaucherForm = ref()

  const headerEquivalenVaucherCreate = {
    title: 'Crear comprobantes equivalentes',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      { label: 'Comprobantes equivalentes', route: 'EquivalentVaucherList' },
      { label: 'Crear', route: '' },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])
  const activeTab = ref<string>(tabs.value[0].name)
  const activeTabIdx = ref<number>(0)

  const { showAlert } = useAlert()

  const onCreate = async () => {
    if (await equivalentVaucherForm.value?.validate()) {
      openMainLoader(true)

      const selectedSubtypes =
        equivalentVaucherForm.value.getSelectedSubtypeRows()

      if (selectedSubtypes.length === 0) {
        openMainLoader(false)
        showAlert('Debe agregar al menos un subtipo de comprobante.', 'warning')
        return
      }

      const payload = {
        valid_vouchers: selectedSubtypes.map(
          (item: ISelectedSubtypeRow, index: number) => ({
            index,
            source_voucher_sub_type_id: item.subtype_receipt_origin,
            equivalent_voucher_sub_type_id: item.equivalent_voucher_subtype,
            fiscal_voucher_sub_type_id: item.tax_receipt_subtype,
          })
        ),
      }

      if (await _createEquivalentVaucher(payload)) {
        router.push({ name: 'EquivalentVaucherList' })
      }

      openMainLoader(false)
    }
  }

  return {
    headerEquivalenVaucherCreate,
    tabs,
    activeTab,
    activeTabIdx,
    equivalentVaucherForm,
    onCreate,
  }
}

export default useEquivalentVaucherCreate
