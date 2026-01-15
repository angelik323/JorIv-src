// Vue
import { ref, computed, watch } from 'vue'

// Quasar
import { QForm } from 'quasar'

// Pinia
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IFixedAssetNoveltyFormData } from '@/interfaces/customs/fixed-assets/v1/Register-Authorization-Changes'
import { default_yes_no } from '@/constants/resources/index'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'

const useFixedAssetNoveltyForm = (props: {
  action: ActionType
  data?: IFixedAssetNoveltyFormData
}) => {
  const formRef = ref<QForm | null>(null)

  const isViewMode = computed(() => props.action === 'view')
  const isEditMode = computed(() => props.action === 'edit')
  const isCreateMode = computed(() => props.action === 'create')

  const resourcesStore = useFixedAssetsResourceStore('v1')
  const { fixed_assets, fixed_assets_configuration_subtypes, novelty } =
    storeToRefs(resourcesStore)

  const { formatDate } = useUtils()

  const resolveAssetLabel = (assetId?: number | null): string => {
    if (!assetId) return '-'

    return (
      fixed_assets_configuration_subtypes.value.find(
        (item) => item.id === assetId
      )?.label ?? String(assetId)
    )
  }

  const fixedAssetLabel = computed(() =>
    resolveAssetLabel(formData.value.fixed_asset_id)
  )

  const formData = ref<IFixedAssetNoveltyFormData>({
    creation_date: formatDate(new Date().toString(), 'YYYY-MM-DD'),
    fixed_asset_id: null,
    novelty_type_id: null,
    novelty_type_description: '',
    generates_accounting: null,
    asset_affectation: undefined,
    estimated_solution_date: null,
    cost: null,
    description: '',
    additional_observation: '',
  })

  watch(
    [() => formData.value.novelty_type_id, novelty],
    ([typeId, noveltyList]) => {
      if (!typeId || !noveltyList?.length) return

      const selected = noveltyList.find((n) => n.value === typeId)

      if (!selected) return

      formData.value.asset_affectation = selected.affectation_type ?? undefined
    },
    { immediate: true }
  )

  watch(
    [() => props.data, novelty],
    ([data, noveltyList]) => {
      if (!data) return

      formData.value = { ...formData.value, ...data }

      if (!data.novelty_type_id || !noveltyList.length) return

      const selected = noveltyList.find((n) => n.value === data.novelty_type_id)

      if (selected) {
        formData.value.asset_affectation =
          selected.affectation_type ?? undefined
      }
    },
    { immediate: true }
  )

  watch(
    novelty,
    (list) => {
      if (!list.length) return
      if (!formData.value.novelty_type_id) return

      // fuerza refresh del selector
      formData.value.novelty_type_id = Number(formData.value.novelty_type_id)
    },
    { immediate: true }
  )

  const resetForm = () => {
    formData.value = {
      creation_date: formatDate(new Date().toString(), 'YYYY-MM-DD'),
      fixed_asset_id: null,
      novelty_type_id: null,
      novelty_type_description: '',
      generates_accounting: null,
      asset_affectation: undefined,
      estimated_solution_date: null,
      cost: null,
      description: '',
      additional_observation: '',
    }
  }

  return {
    formRef,
    formData,
    fixed_assets,
    isViewMode,
    isEditMode,
    isCreateMode,
    default_yes_no,
    fixed_assets_configuration_subtypes,
    novelty,
    fixedAssetLabel,
    resetForm,
  }
}

export default useFixedAssetNoveltyForm
