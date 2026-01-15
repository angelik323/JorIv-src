// vue
import { computed } from 'vue'

// moment
import moment from 'moment'

// interfaces
import type { IAssetTypeForm } from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'
import type { ActionType } from '@/interfaces/global'

export const useAuditFields = (model: () => IAssetTypeForm | null, action: ActionType) => {
  const displayCreationDate = computed(() => {
    if (model()?.created_at) {
      return moment(model()!.created_at).format('YYYY-MM-DD hh:mm')
    }
    return moment().format('YYYY-MM-DD hh:mm')
  })

  const displayCreatedBy = computed(() => {
    return model()?.created_by || ''
  })

  const displayUpdatedAt = computed(() => {
    if (model()?.updated_at) {
      return moment(model()!.updated_at).format('YYYY-MM-DD hh:mm')
    }
    return null
  })

  const displayUpdatedBy = computed(() => {
    return model()?.updated_by || null
  })

  const showAuditFields = computed(() => {
    return action === 'edit' || action === 'view'
  })

  const showOnlyCreationDate = computed(() => {
    return action === 'create'
  })

  return {
    displayCreationDate,
    displayCreatedBy,
    displayUpdatedAt,
    displayUpdatedBy,
    showAuditFields,
    showOnlyCreationDate
  }
}
