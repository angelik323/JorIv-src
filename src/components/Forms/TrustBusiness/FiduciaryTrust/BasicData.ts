import { ref, watch, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { IFiduciaryTrust } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import {
  useFicResourceStore,
  useResourceManagerStore,
  useTrustBusinessResourceStore,
} from '@/stores'

const useBasicDataForm = (props: {
  action: ActionType
  data?: IFiduciaryTrust
}) => {
  const { funds } = storeToRefs(useFicResourceStore('v1'))
  const {
    business_trust_real_estate_project: project,
    fiduciary_mandates_statuses: status,
    business_trusts: business,
    project_stage: stage,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const informationFormRef = ref()

  const formData = ref<IFiduciaryTrust>({
    name: '',
    business_trust_id: null,
    real_estate_project_id: null,
    stage_id: null,
    currency: 'COP',
    status_id: null,
    investment_fund_id: null,
  })

  const isEdit = computed(() => ['edit'].includes(props.action))
  const isView = computed(() => ['view'].includes(props.action))

  onMounted(() => {
    if (!isEdit.value && !isView.value) {
      formData.value = {
        name: '',
        business_trust_id: null,
        real_estate_project_id: null,
        stage_id: null,
        currency: 'COP',
        status_id: null,
        investment_fund_id: null,
      }
    }
  })
  watch(
    () => formData.value.business_trust_id,
    async (newId) => {
      if (!newId) return

      await _getResources(
        { trust_business: ['business_trust_real_estate_project'] },
        `filter[business_trust_id]=${newId}`
      )

      const keys = {
        fics: [`funds&filter[business_trust_id]=${newId}`],
      }

      await _getResources(keys)
    }
  )

  watch(
    () => formData.value.real_estate_project_id,
    async (val) => {
      if (val) {
        const keys_filter = {
          trust_business: [
            `project_stage&filter[business_trust_real_estate_project_id]=${val}`,
          ],
        }
        await _getResources(keys_filter)
      }
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) {
        formData.value = {
          ...formData.value,
          ...newVal,
          currency: formData.value.currency ?? 'COP',
          business_trust_id: newVal.business_trust?.id ?? null,
          real_estate_project_id: newVal.real_estate_project?.id ?? null,
          stage_id: newVal.stage?.id ?? null,
          investment_fund: newVal.investment_fund,
        }
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => formData.value.business_trust_id,
    (val) => {
      if (!val) {
        formData.value.real_estate_project_id = null
      }
    },
    { deep: true }
  )

  watch(
    () => formData.value.real_estate_project_id,
    (val) => {
      if (!val) {
        formData.value.stage_id = null
      }
    },
    { deep: true }
  )

  return {
    stage,
    funds,
    status,
    isView,
    isEdit,
    project,
    business,
    formData,
    informationFormRef,
  }
}

export default useBasicDataForm
