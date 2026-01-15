<template>
  <AlertModalComponent
    ref="advancedFiltersModalRef"
    styleModal="min-width: 70%"
    title-header="Búsqueda avanzada"
    margin-top-body="no-margin"
    text-btn-confirm="Confirmar"
    :show-img-default="false"
    @confirm="closeAdvancedFilters"
  >
    <template #default-body>
      <q-form ref="accountingAccountFilterFormRef">
        <div class="row q-col-gutter-md ml-2 mr-3">
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              :default_value="filterData.account_code"
              label="Código de cuenta contable"
              placeholder="Seleccione"
              :manual_option="selectOptions.type_operators"
              auto_complete
              map_options
              :required="false"
              :rules="[]"
              @update:model-value="onAccountCodeChange"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericInputComponent
              :default_value="filterData.account_code_text"
              label="Código de cuenta contable"
              label_class="hide-label"
              :placeholder="filterData.account_code ? 'Inserte' : '-'"
              type="text"
              :disabled="filterData.account_code ? false : true"
              :rules="[
                (val: string) => filterData.account_code ? useRules().is_required(val) : true,
                (val: string) => !val || useRules().only_number(val)
              ]"
              :debounce="500"
              @update:model-value="
                ($event) => {
                  filterData.account_code_text = $event
                  handleAdvancedFilters()
                }
              "
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              :default_value="filterData.account_name"
              label="Nombre de cuenta contable"
              placeholder="Seleccione"
              :manual_option="selectOptions.type_operators"
              auto_complete
              map_options
              :required="false"
              :rules="[]"
              @update:model-value="onAccountNameChange"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericInputComponent
              :default_value="filterData.account_name_text"
              label="Nombre de cuenta contable"
              label_class="hide-label"
              :placeholder="filterData.account_name ? 'Inserte' : '-'"
              type="text"
              :disabled="filterData.account_name ? false : true"
              :rules="[
                (val: string) => filterData.account_name ? useRules().is_required(val) : true,
                (val: string) => !val || useRules().only_alphanumeric(val)
              ]"
              :debounce="500"
              @update:model-value="
                ($event) => {
                  filterData.account_name_text = $event
                  handleAdvancedFilters()
                }
              "
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="filterData.nature"
              label="Naturaleza"
              placeholder="Seleccione"
              :manual_option="selectOptions.type_nature"
              auto_complete
              map_options
              :required="false"
              :rules="[]"
              @update:model-value="onNatureChange"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="filterData.type"
              label="Tipo"
              placeholder="Seleccione"
              :manual_option="selectOptions.types"
              auto_complete
              map_options
              :required="false"
              :rules="[]"
              @update:model-value="onTypeChange"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="filterData.group"
              label="Grupo"
              placeholder="Seleccione"
              :manual_option="
                selectedGroupType ? selectOptions.groups[selectedGroupType] : []
              "
              auto_complete
              map_options
              :required="false"
              :disabled="!selectedGroupType"
              :rules="[]"
              @update:model-value="
                ($event) => {
                  filterData.group = $event
                  handleAdvancedFilters()
                }
              "
            />
          </div>

          <div class="col-12">
            <q-separator class="q-my-lg" />

            <p v-if="accountsTree.length" class="text-weight-bold text-h6">
              Coincidencias de cuentas contables
            </p>
          </div>

          <div
            class="col-12 accounts-scroll-container q-pt-none"
            v-if="accountsTree.length"
          >
            <component
              v-for="account in accountsTree"
              :key="account.id"
              :is="renderAccountNode(account)"
            />
          </div>

          <div class="col-12" v-if="accountsTree.length">
            <q-separator />
          </div>
        </div>
      </q-form>
    </template>
  </AlertModalComponent>
</template>
<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic component
import useAccountingAccountFilter from '@/components/AdvancedFilters/Accounting/AccountingAccount/AccountingAccountFilter'

const props = defineProps<{
  accounting_structure_id: string | number | null
}>()

const emits = defineEmits(['response:selectorAccounts'])

const {
  useRules,
  filterData,
  accountsTree,
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
} = useAccountingAccountFilter(props.accounting_structure_id, emits)

defineExpose({
  openFilter: () => openAdvancedFilters(),
})
</script>

<style scoped src="./AccountingAccountFilter.scss" lang="scss"></style>
