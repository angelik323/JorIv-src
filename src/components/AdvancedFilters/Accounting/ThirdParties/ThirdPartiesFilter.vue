<template>
  <AlertModalComponent
    ref="advancedFiltersModalRef"
    styleModal="min-width: 70%"
    title-header="Búsqueda avanzada"
    margin-top-body="no-margin"
    text-btn-confirm="Confirmar"
    :show-img-default="false"
    @confirm="closeAdvancedFilters"
    @close="resetForm"
  >
    <template #default-body>
      <q-form ref="thirdPartiesFilterFormRef">
        <div class="row q-col-gutter-md ml-2 mr-3">
          <div class="col-12">
            <GenericSelectorComponent
              :default_value="filterData.type_person"
              label="Tipo de persona"
              placeholder="Seleccione"
              :manual_option="selectOptions.type_person"
              auto_complete
              map_options
              :required="false"
              :rules="[]"
              @update:model-value="
                ($event) => {
                  filterData.type_person = $event
                  handleAdvancedFilters()
                }
              "
            />
          </div>
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              :default_value="filterData.identification_operator"
              label="Identificación"
              placeholder="Seleccione"
              :manual_option="selectOptions.type_operators"
              auto_complete
              map_options
              :required="false"
              :rules="[]"
              @update:model-value="onIdentificationOperatorChange"
            />
          </div>

          <div class="col-12 col-md-6 mt-2">
            <GenericInputComponent
              :default_value="filterData.identification_value"
              placeholder="Inserte"
              type="text"
              :disabled="filterData.identification_operator ? false : true"
              :rules="[
                (val: string) => filterData.identification_operator ? useRules().is_required(val) : true,
                (val: string) => !val || useRules().only_number(val)
            ]"
              :debounce="500"
              @update:model-value="
                ($event) => {
                  filterData.identification_value = $event
                  handleAdvancedFilters()
                }
              "
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              :default_value="filterData.name_operator"
              label="Nombre o razón social"
              placeholder="Seleccione"
              :manual_option="selectOptions.type_operators"
              auto_complete
              map_options
              :required="false"
              :rules="[]"
              @update:model-value="onNameOperatorChange"
            />
          </div>

          <div class="col-12 col-md-6 mt-2">
            <GenericInputComponent
              :default_value="filterData.name_value"
              placeholder="Inserte"
              type="text"
              :disabled="filterData.name_operator ? false : true"
              :rules="[
                (val: string) => filterData.name_operator ? useRules().is_required(val) : true,
                (val: string) => !val || useRules().only_alphanumeric(val)
            ]"
              :debounce="500"
              @update:model-value="
                ($event) => {
                  filterData.name_value = $event
                  handleAdvancedFilters()
                }
              "
            />
          </div>
          <div class="col-12">
            <q-separator class="q-mt-lg" />
          </div>
          <div v-if="tableProps.rows.length > 0" class="col-12">
            <TableList
              :title="tableProps.title"
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows ?? []"
              :pages="tableProps.pages"
              @update-page="updatePage"
              @update-rows-per-page="updatePerPage"
              dense
              selection="single"
              @selected="handleSelectedThirdparty"
            >
            </TableList>
          </div>

          <div v-if="tableProps.rows.length > 0" class="col-12">
            <q-separator />
          </div>
        </div>
      </q-form>
    </template>
  </AlertModalComponent>
</template>
<script setup lang="ts">
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Logic component
import useThirdPartiesFilter from '@/components/AdvancedFilters/Accounting/ThirdParties/ThirdPartiesFilter'
import TableList from '@/components/table-list/TableList.vue'

const emits = defineEmits(['response:selectedThirdparty'])

const {
  filterData,
  selectOptions,
  advancedFiltersModalRef,
  thirdPartiesFilterFormRef,
  tableProps,
  useRules,
  openAdvancedFilters,
  handleAdvancedFilters,
  resetForm,
  updatePage,
  updatePerPage,
  handleSelectedThirdparty,
  onIdentificationOperatorChange,
  onNameOperatorChange,
  closeAdvancedFilters,
} = useThirdPartiesFilter(emits)

defineExpose({
  openFilter: () => openAdvancedFilters(),
})
</script>
