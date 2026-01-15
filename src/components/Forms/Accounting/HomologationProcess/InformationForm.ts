import { computed, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

import {
  useAccountingResourceStore,
  useHomologationProcessStore,
} from '@/stores'

import RevertBulkHomologationForm from '@/components/Forms/Accounting/HomologationProcess/RevertBulkHomologation/RevertBulkHomologationForm.vue'
import BulkHomologationForm from '@/components/Forms/Accounting/HomologationProcess/BulkHomologation/BulkHomologationForm.vue'
import HomologationForm from '@/components/Forms/Accounting/HomologationProcess/Homologation/HomologationForm.vue'
import RevertHomologationForm from '@/components/Forms/Accounting/HomologationProcess/RevertHomologation/RevertHomologationForm.vue'

const useInformationForm = () => {
  const { _cleanHomologationProcessData } = useHomologationProcessStore('v1')

  const { vouchers_mappings_process_name_types } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { process_type } = storeToRefs(useHomologationProcessStore('v1'))

  const currentComponent = computed(() => {
    switch (process_type.value) {
      case 1:
        return BulkHomologationForm
      case 2:
        return RevertBulkHomologationForm
      case 3:
        return HomologationForm
      case 4:
        return RevertHomologationForm
      default:
        return BulkHomologationForm
    }
  })

  onBeforeUnmount(() => {
    _cleanHomologationProcessData()
  })

  return {
    currentComponent,
    vouchers_mappings_process_name_types,
    process_type,
  }
}

export default useInformationForm
