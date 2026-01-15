<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <FiltersComponent
        show_actions
        ref="filtersRef"
        :search-icon="null"
        :fields="filterConfig"
        :search-label="'Continuar'"
        :filtersLocked="filtersLocked"
        @filter="handleFilter"
        @update:values="onChangeFilter"
        @clear-filters="handleClearFilters"
      />

      <section v-if="isTableEmpty" class="q-pt-lg q-mb-lg editable-table">
        <div class="flex justify-between items-center">
          <p class="text-h5 no-margin">
            {{ tableProps.title }}
          </p>

          <Button
            label="Agregar"
            :left-icon="defaultIconsLucide.plusCircle"
            color-icon="white"
            :outline="false"
            color="orange"
            @click="handleOptions('add')"
          />
        </div>

        <NoDataState v-if="hasTableData" type="empty" />

        <TableList
          v-else
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :custom-columns="customColumns"
          :rows-per-page-options="[0]"
          :hide-header="hasTableData"
          :hide-pagination="true"
        >
          <template #id="{ row }">
            {{ row.id }}
          </template>

          <template #year="{ row }">
            <GenericInputComponent
              :default_value="row.year"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
                (val) => useRules().is_required(val, 'El año es requerido'),
                (val) => useRules().length_between(val, 4, 4),
                (val) => useRules().only_number(val),
              ]"
              @update:model-value="row.year = $event"
            />
          </template>

          <template #month="{ row }">
            <GenericInputComponent
              :default_value="row.month"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
                (val) => useRules().is_required(val, 'El mes es requerido'),
                (val) => useRules().length_between(val, 2, 2),
                (val) => useRules().max_value(val, 12),
                (val) => useRules().only_number(val),
              ]"
              @update:model-value="row.month = $event"
            />
          </template>

          <template #day="{ row }">
            <GenericInputComponent
              :default_value="row.day"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
                (val) => useRules().is_required(val, 'El dia es requerido'),
                (val) => useRules().length_between(val, 2, 2),
                (val) => useRules().max_value(val, 31),
                (val) => useRules().only_number(val),
              ]"
              @update:model-value="row.day = $event"
            />
          </template>

          <template #areas_responsibility_id="{ row }">
            <GenericSelectorComponent
              :default_value="row.areas_responsibility_id"
              placeholder="Seleccione"
              map_options
              required
              :manual_option="areas"
              :rules="[
                (val: string) => useRules().is_required(val, 'El área es requerido'),
              ]"
              @update:modelValue="row.areas_responsibility_id = $event"
            />
          </template>

          <template #code_movements_source_destination_id="{ row }">
            <GenericSelectorComponent
              :default_value="row.code_movements_source_destination_id"
              placeholder="Seleccione"
              map_options
              required
              :manual_option="code_movements"
              :rules="[
                (val: string) => useRules().is_required(val, 'El código de movimiento es requerido'),
              ]"
              @update:modelValue="
                row.code_movements_source_destination_id = $event
              "
            />
          </template>

          <template #budget_item_id="{ row }">
            <GenericSelectorComponent
              :default_value="row.budget_item_id"
              placeholder="Seleccione"
              map_options
              required
              :manual_option="budget"
              :rules="[
                (val: string) => useRules().is_required(val, 'El rubro presupuestal es requerido'),
              ]"
              @update:modelValue="row.budget_item_id = $event"
            />
          </template>

          <template #budget_resource_id="{ row }">
            <GenericSelectorComponent
              :default_value="row.budget_resource_id"
              placeholder="Seleccione"
              map_options
              required
              :manual_option="resources"
              :rules="[
                (val: string) => useRules().is_required(val, 'El recurso es requerido'),
              ]"
              @update:modelValue="row.budget_resource_id = $event"
            />
          </template>

          <template #value="{ row }">
            <CurrencyInput
              v-model="row.value"
              placeholder="Inserte valor"
              currency="COP"
              required
              :precision="2"
              :rules="[
                (val: string) => useRules().is_required(val, 'El valor es requerido'),
                (val: string) => useRules().max_currency_value(val, Number(filtersFormat.total_value))
              ]"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="row.id"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleOptions('delete', row.id)"
            />
          </template>
        </TableList>

        <div class="row justify-end q-gutter-md q-mt-md">
          <Button
            :outline="false"
            label="Confirmar"
            color="orange"
            :disabled="!isTableValid"
            class="btn-filter custom"
            @click="handleOptions('confirm')"
          />
        </div>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.title"
        @confirm="onSubmit(alertModalConfig.action)"
      >
        <template #default-img>
          <q-img
            :src="alertModalConfig.img"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Composables
import { useRules } from '@/composables/useRules'

// Logic view
import useOperationLogsList from '@/views/budget/operation-logs/v1/list/BudgetOperationLogsList'

const {
  areas,
  budget,
  onSubmit,
  resources,
  filtersRef,
  tableProps,
  headerProps,
  handleFilter,
  filterConfig,
  hasTableData,
  isTableEmpty,
  isTableValid,
  filtersFormat,
  alertModalRef,
  handleOptions,
  customColumns,
  filtersLocked,
  code_movements,
  onChangeFilter,
  alertModalConfig,
  defaultIconsLucide,
  handleClearFilters,
} = useOperationLogsList()
</script>
