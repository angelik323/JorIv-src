<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filters"
          @filter="handleFilter"
          @clear-filters="handleClear"
          @update:values="onFilterChange"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['status', 'to_transfer']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="row.status?.id" />
          </template>

          <template #to_transfer="{ row }">
            <RadioYesNo
              v-model="row.to_transfer"
              :required="true"
              :isRadioButton="false"
              :hasTitle="false"
              :hasSubtitle="false"
              :isDisabled="false"
            />
          </template>
        </TableList>
      </section>

      <q-separator spaced />

      <section v-if="tableProps.rows.length > 0">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12">
            <h6 class="text-weight-bold my-1">Detalle cesión</h6>
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :default_value="models.assigneeBusinessId"
              :manual_option="business_trust_cesion"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val, 'Negocio cesionario es requerido')]"
              @update:model-value="onAssigneeBusinessChange"
              label="Negocio cesionario"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              :default_value="models.assigneeBusinessName"
              @update:model-value="
                models.assigneeBusinessName = $event.toLowerCase()
              "
              placeholder="-"
              label="Nombre negocio cesionario"
              :disabled="true"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :default_value="models.expenseMovementCode"
              :manual_option="treasury_movement_codes_egresos"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val, 'El código movimiento egreso es requerido')]"
              @update:model-value="handleExpenseMovementChange"
              label="Código movimiento egreso"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              :default_value="models.expenseMovementName"
              @update:model-value="models.expenseMovementName = $event"
              placeholder="-"
              label="Nombre código movimiento egreso"
              :disabled="true"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :default_value="models.incomeMovementCode"
              :manual_option="treasury_movement_codes_ingresos"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val, 'El código movimiento ingreso es requerido')]"
              @update:model-value="handleIncomeMovementChange"
              label="Código movimiento ingreso"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericInput
              :default_value="models.incomeMovementName"
              @update:model-value="models.incomeMovementName = $event"
              placeholder="-"
              label="Nombre código movimiento ingreso"
              :disabled="true"
            />
          </div>
          <div class="col-12 col-md-6">
            <GenericDateInputComponent
              label="Fecha cierre"
              :default_value="models.grantorDate"
              :required="false"
              :rules="[]"
              @update:modelValue="models.grantorDate = $event"
              placeholder="DD/MM/AAAA"
              :disabled="true"
            />
          </div>
        </div>
        <br />
        <div
          v-if="tableProps.rows.length > 0"
          class="row justify-end q-gutter-md"
        >
          <Button
            :outline="false"
            class-custom="custom"
            label="Confirmar"
            size="md"
            @click="handleSubmit()"
            :color="disabledButtom ? 'orange' : 'grey'"
            :disabled="!disabledButtom"
          />
        </div>
        <br />
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.title"
        :description_message="''"
        @confirm="onSubmit()"
      >
        <template #default-body>
          <div class="text-center text-grey-6 mx-4 q-px-lg">
            <div v-html="alertModalConfig.description"></div>
          </div>
        </template>
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

//composables
import { useRules } from '@/composables'

// Vue Logic
import assignmentBankAccountsList from './assignmentBankAccountsList'

const {
  tableProps,
  filters,
  headerProps,
  alertModalRef,
  alertModalConfig,
  filtersRef,
  models,
  business_trust_cesion,
  treasury_movement_codes_ingresos,
  treasury_movement_codes_egresos,
  handleFilter,
  handleClear,
  updatePage,
  updatePerPage,
  onFilterChange,
  onAssigneeBusinessChange,
  handleSubmit,
  onSubmit,
  handleExpenseMovementChange,
  handleIncomeMovementChange,
  disabledButtom,
} = assignmentBankAccountsList()
</script>
