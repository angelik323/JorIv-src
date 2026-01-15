// Vue - Pinia
import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Components
import AccordeonComponent from '@/components/Accordeon/Accordeon.vue'

// Interfaces
import { IAccountingAccountFilter } from '@/interfaces/customs/accounting/AccountingAccount'
import {
  CatalogGroupType,
  IAccountStructureResource,
} from '@/interfaces/customs/accounting/AccountStructure'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useRules } from '@/composables/useRules'
import { useAlert } from '@/composables/useAlert'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useAccountingAccountFilterStore } from '@/stores/advanced-filters/accounting/accounting-account'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAccountingAccountFilter = (
  accounting_structure_id: string | number | null,
  emits: Function
) => {
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { isEmptyOrZero } = useUtils()
  const { _advancedFiltersAccounts } = useAccountingAccountFilterStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    type_nature,
    type_operators,
    catalog_limit_types,
    catalog_limit_groups,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const accountsTree = ref<IAccountStructureResource[]>([])
  const selectedAccount = ref<IAccountStructureResource | null>(null)
  const accountingAccountFilterFormRef = ref()
  const advancedFiltersModalRef = ref()

  const keysV1 = {
    accounting: ['catalog_limit_types', 'catalog_limit_groups'],
  }

  const keysV2 = {
    accounting: ['type_nature', 'type_operators'],
  }

  const filterData = ref<IAccountingAccountFilter>({
    account_code: null,
    account_code_text: null,
    account_name: null,
    account_name_text: null,
    nature: null,
    type: null,
    group: null,
  })

  const selectOptions = computed(() => ({
    groups: catalog_limit_groups.value,
    type_operators: type_operators.value,
    types: catalog_limit_types.value,
    type_nature: type_nature.value,
  }))

  const selectedGroupType = computed<CatalogGroupType | null>(() => {
    const type = filterData.value.type
    if (!type) return null

    const lower = type.toLowerCase() as CatalogGroupType

    return lower in selectOptions.value.groups ? lower : null
  })

  const resetAdvancedFilters = () => {
    filterData.value = {
      account_code: null,
      account_code_text: null,
      account_name: null,
      account_name_text: null,
      nature: null,
      type: null,
      group: null,
    }

    accountsTree.value = []
    selectedAccount.value = null

    accountingAccountFilterFormRef.value?.resetValidation?.()
  }

  const onAccountCodeChange = (value: string) => {
    filterData.value.account_code = value

    if (!value) {
      filterData.value.account_code_text = null
      accountsTree.value = []
    }
  }

  const onAccountNameChange = (value: string) => {
    filterData.value.account_name = value

    if (!value) {
      filterData.value.account_name_text = null
      accountsTree.value = []
    }
  }

  const onNatureChange = (value: string) => {
    filterData.value.nature = value

    if (!value) {
      filterData.value.type = null
      filterData.value.group = null
      accountsTree.value = []
    }

    handleAdvancedFilters()
  }

  const onTypeChange = (value: string) => {
    filterData.value.type = value

    if (!value) {
      filterData.value.group = null
      accountsTree.value = []
    }

    handleAdvancedFilters()
  }

  const openAdvancedFilters = () => {
    resetAdvancedFilters()
    advancedFiltersModalRef.value?.openModal?.()
  }

  const closeAdvancedFilters = () => {
    if (!selectedAccount.value) {
      showAlert('Debe seleccionar una cuenta contable válida', 'warning')
      return
    }

    emits('response:selectorAccounts', {
      accountsTree: accountsTree.value,
      selectedAccount: selectedAccount.value,
    })
    advancedFiltersModalRef.value?.closeModal?.()
  }

  const validateForm = async () =>
    accountingAccountFilterFormRef?.value?.validate()

  const handleAdvancedFilters = async () => {
    if (isEmptyOrZero(filterData.value)) {
      accountsTree.value = []
      return
    }

    if (await validateForm()) {
      openMainLoader(true)

      const formattedFilters = {
        'filter[code][operator]': filterData.value.account_code || '',
        'filter[code][value]': filterData.value.account_code_text || '',
        'filter[name][operator]': filterData.value.account_name || '',
        'filter[name][value]': filterData.value.account_name_text || '',
        'filter[nature]': filterData.value.nature || '',
        'filter[group]': filterData.value.group || '',
        'filter[type]': filterData.value.type || '',
      }

      const response = await _advancedFiltersAccounts(
        accounting_structure_id,
        formattedFilters
      )

      if (response.succes) accountsTree.value = response.accountsSelector
      else accountsTree.value = []

      openMainLoader(false)
    }
  }

  const onSelectAccount = (account: IAccountStructureResource) => {
    selectedAccount.value = account
  }

  const renderAccountNode = (account: IAccountStructureResource) => {
    const hasChildren =
      Array.isArray(account.children) && account.children.length > 0
    const isSelected = selectedAccount.value?.id === account.id

    if (hasChildren) {
      return h(
        AccordeonComponent,
        {
          label: `${account.code} - ${account.name}`,
        },
        {
          default: () =>
            account.children!.map((child) => renderAccountNode(child)),
        }
      )
    }

    return h(
      'div',
      {
        class: [
          'row items-center q-pa-sm bordered cursor-pointer',
          {
            'bg-blue-1': isSelected,
          },
        ],
        onClick: () => onSelectAccount(account),
      },
      [
        h(
          'div',
          { class: 'col-12 text-weight-medium' },
          `${account.code} - ${account.name}`
        ),
      ]
    )
  }

  onMounted(() => {
    _getResources(keysV1)
    _getResources(keysV2, '', 'v2')
  })

  onBeforeUnmount(() => {
    _resetKeys(keysV1)
    _resetKeys(keysV2)
  })

  return {
    useRules,
    filterData,
    accountsTree,
    selectedAccount,
    selectOptions,
    onNatureChange,
    renderAccountNode,
    selectedGroupType,
    onAccountNameChange,
    onAccountCodeChange,
    onTypeChange,
    openAdvancedFilters,
    closeAdvancedFilters,
    handleAdvancedFilters,
    advancedFiltersModalRef,
    accountingAccountFilterFormRef,
  }
}
export default useAccountingAccountFilter
