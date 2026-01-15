<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="headerProps.btnBack"
    >
      <section class="q-my-md">
        <TabsComponent
          tab-active="information"
          :tabs="tabs"
          :tab-active-idx="0"
        />
        <VCard class="movements-table">
          <template #content-card>
            <q-form ref="formRef">
              <div class="q-ma-lg catalog-limit-table">
                <TableList
                  :title="tableOrigin.title"
                  :loading="tableOrigin.loading"
                  :columns="tableOrigin.columns"
                  :rows="tableOrigin.rows ?? []"
                  :pages="isOneToOne ? undefined : tableOrigin.pages"
                  :custom-columns="customColumns"
                  :hide-pagination="isOneToOne"
                >
                  <template #custom-header-action>
                    <Button
                      v-if="!isOneToOne"
                      :outline="false"
                      label="Agregar"
                      left-icon="PlusCircle"
                      color-icon="white"
                      @click="addOriginRow"
                    />
                  </template>
                  <template #id="{ index }">
                    <span>{{ index + 1 }}</span>
                  </template>
                  <template #business="{ row }">
                    <GenericSelectorComponent
                      return_object
                      :manual_option="business_trust_from_to ?? []"
                      display_label="label_description"
                      custom_selection_label="label"
                      first_filter_option="label_description"
                      map_options
                      auto_complete
                      required
                      :clearable="false"
                      :rules="[(val:string)=> useRules().is_required(val, 'El negocio es requerido')]"
                      :default_value="row.business || undefined"
                      @update:model-value="handleBusinessUpdate(row, $event)"
                    />
                  </template>
                  <template #businessDescription="{ row }">
                    <GenericInputComponent
                      placeholder="-"
                      :default_value="row.businessDescription"
                      disabled
                    />
                  </template>
                  <template #budgetItem="{ row }">
                    <GenericSelectorComponent
                      return_object
                      :manual_option="budget_item_codes ?? []"
                      map_options
                      custom_selection_label="label_code"
                      display_label="label"
                      auto_complete
                      required
                      :clearable="false"
                      :rules="[(val:string)=> useRules().is_required(val, 'El rubro presupuestal es requerido')]"
                      :default_value="row.budgetItems || undefined"
                      @update:model-value="handleBudgetItemUpdate(row, $event)"
                    />
                  </template>
                  <template #budgetItemDescription="{ row }">
                    <GenericInputComponent
                      placeholder="-"
                      :default_value="row.budgetItemDescription"
                      disabled
                    />
                  </template>
                  <template #resource="{ row }">
                    <GenericSelectorComponent
                      return_object
                      :manual_option="budget_resource_codes ?? []"
                      custom_selection_label="label_code"
                      display_label="label"
                      map_options
                      auto_complete
                      required
                      :clearable="false"
                      :rules="[(val:string)=> useRules().is_required(val, 'El recurso es requerido')]"
                      :default_value="row.resource || undefined"
                      @update:model-value="handleResourceUpdate(row, $event)"
                    />
                  </template>
                  <template #resourceDescription="{ row }">
                    <GenericInputComponent
                      placeholder="-"
                      :default_value="row.resourceDescription"
                      disabled
                    />
                  </template>
                  <template #area="{ row }">
                    <GenericSelectorComponent
                      return_object
                      :manual_option="areas_responsabilities_selector ?? []"
                      map_options
                      custom_selection_label="label"
                      display_label="label_description"
                      auto_complete
                      first_filter_option="label_description"
                      required
                      :clearable="false"
                      :rules="[(val:string)=> useRules().is_required(val, 'El área es requerida')]"
                      :default_value="row.area || undefined"
                      @update:model-value="handleAreaUpdate(row, $event)"
                    />
                  </template>
                  <template #areaDescription="{ row }">
                    <GenericInputComponent
                      placeholder="-"
                      :default_value="row.areaDescription"
                      disabled
                    />
                  </template>
                  <template #third="{ row }">
                    <GenericSelectorComponent
                      return_object
                      :manual_option="third_parties ?? []"
                      custom_selection_label="label"
                      display_label="label_description"
                      first_filter_option="label_description"
                      map_options
                      auto_complete
                      :required="false"
                      :clearable="true"
                      :rules="[(val:string)=> useRules().is_required(val, 'El solicitante es requerido')]"
                      :default_value="row.third || undefined"
                      @update:model-value="handleThirdPartyUpdate(row, $event)"
                    />
                  </template>
                  <template #thirdName="{ row }">
                    <GenericInputComponent
                      placeholder="-"
                      :default_value="row.thirdName"
                      disabled
                    />
                  </template>
                  <template #month="{ row }">
                    <GenericSelectorComponent
                      :manual_option="month_list"
                      map_options
                      required
                      :rules="[(val:string)=> useRules().is_required(val, 'El mes es requerido')]"
                      class_name="month-input-width"
                      :default_value="row.month"
                      @update:model-value="row.month = $event"
                    />
                  </template>
                  <template #value="{ row }">
                    <InputMoneyComponent
                      :model-value="row.value > 0 ? String(row.value) : null"
                      placeholder="-"
                      hide_symbol
                      class_name="currency-input-width"
                      :rules="[]"
                      disabled
                      readonly
                      :max_decimal_digits="2"
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
                      @click="removeOriginRow(row.id)"
                    />
                  </template>
                </TableList>
              </div>
              <div class="q-ma-lg catalog-limit-table">
                <TableList
                  :title="tableDestination.title"
                  :loading="tableDestination.loading"
                  :columns="tableDestination.columns"
                  :rows="tableDestination.rows ?? []"
                  :pages="isOneToOne ? undefined : tableDestination.pages"
                  :custom-columns="customColumns"
                  :hide-pagination="isOneToOne"
                >
                  <template #custom-header-action>
                    <Button
                      v-if="!isOneToOne"
                      :outline="false"
                      label="Agregar"
                      left-icon="PlusCircle"
                      color-icon="white"
                      @click="addDestinationRow"
                    />
                  </template>
                  <template #id="{ index }">
                    <span>{{ index + 1 + tableOrigin.rows.length }}</span>
                  </template>
                  <template #business="{ row }">
                    <GenericSelectorComponent
                      return_object
                      :manual_option="business_trust_from_to ?? []"
                      display_label="label_description"
                      custom_selection_label="label"
                      first_filter_option="label_description"
                      map_options
                      auto_complete
                      required
                      :clearable="false"
                      :rules="[(val:string)=> useRules().is_required(val, 'El negocio es requerido')]"
                      :default_value="row.business || undefined"
                      @update:model-value="handleBusinessUpdate(row, $event)"
                    />
                  </template>
                  <template #businessDescription="{ row }">
                    <GenericInputComponent
                      placeholder="-"
                      :default_value="row.businessDescription"
                      disabled
                    />
                  </template>
                  <template #budgetItem="{ row }">
                    <GenericSelectorComponent
                      return_object
                      :manual_option="budget_item_codes ?? []"
                      map_options
                      custom_selection_label="label_code"
                      display_label="label"
                      auto_complete
                      required
                      :clearable="false"
                      :rules="[(val:string)=> useRules().is_required(val, 'El rubro presupuestal es requerido')]"
                      :default_value="row.budgetItems || undefined"
                      @update:model-value="handleBudgetItemUpdate(row, $event)"
                    />
                  </template>
                  <template #budgetItemDescription="{ row }">
                    <GenericInputComponent
                      placeholder="-"
                      :default_value="row.budgetItemDescription"
                      disabled
                    />
                  </template>
                  <template #resource="{ row }">
                    <GenericSelectorComponent
                      return_object
                      :manual_option="budget_resource_codes ?? []"
                      custom_selection_label="label_code"
                      display_label="label"
                      map_options
                      auto_complete
                      required
                      :clearable="false"
                      :rules="[(val:string)=> useRules().is_required(val, 'El recurso es requerido')]"
                      :default_value="row.resource || undefined"
                      @update:model-value="handleResourceUpdate(row, $event)"
                    />
                  </template>
                  <template #resourceDescription="{ row }">
                    <GenericInputComponent
                      placeholder="-"
                      :default_value="row.resourceDescription"
                      disabled
                    />
                  </template>
                  <template #area="{ row }">
                    <GenericSelectorComponent
                      return_object
                      :manual_option="areas_responsabilities_selector ?? []"
                      map_options
                      custom_selection_label="label"
                      display_label="label_description"
                      auto_complete
                      first_filter_option="label_description"
                      required
                      :clearable="false"
                      :rules="[(val:string)=> useRules().is_required(val, 'El área es requerida')]"
                      :default_value="row.area || undefined"
                      @update:model-value="handleAreaUpdate(row, $event)"
                    />
                  </template>
                  <template #areaDescription="{ row }">
                    <GenericInputComponent
                      placeholder="-"
                      :default_value="row.areaDescription"
                      disabled
                    />
                  </template>
                  <template #third="{ row }">
                    <GenericSelectorComponent
                      return_object
                      :manual_option="third_parties ?? []"
                      custom_selection_label="label"
                      display_label="label_description"
                      first_filter_option="label_description"
                      map_options
                      auto_complete
                      :required="false"
                      :clearable="true"
                      :rules="[]"
                      :default_value="row.third || undefined"
                      @update:model-value="handleThirdPartyUpdate(row, $event)"
                    />
                  </template>
                  <template #thirdName="{ row }">
                    <GenericInputComponent
                      placeholder="-"
                      :default_value="row.thirdName"
                      disabled
                    />
                  </template>
                  <template #month="{ row }">
                    <GenericSelectorComponent
                      :manual_option="month_list"
                      map_options
                      required
                      class_name="month-input-width"
                      :rules="[(val:string)=> useRules().is_required(val, 'El mes es requerido')]"
                      :default_value="row.month"
                      @update:model-value="row.month = $event"
                    />
                  </template>
                  <template #value="{ row }">
                    <InputMoneyComponent
                      :model-value="row.value > 0 ? String(row.value) : null"
                      placeholder="-"
                      hide_symbol
                      class_name="currency-input-width"
                      :rules="[]"
                      disabled
                      readonly
                      :max_decimal_digits="2"
                    />
                  </template>
                  <template #actions="{ row }">
                    <Button
                      v-if="
                        validateRouter(
                          'Budget',
                          'BudgetTransferList',
                          'delete'
                        ) && row.id
                      "
                      :left-icon="defaultIconsLucide.trash"
                      color="orange"
                      :outline="false"
                      flat
                      colorIcon="#f45100"
                      tooltip="Eliminar"
                      @click="removeDestinationRow(row.id)"
                    />
                  </template>
                </TableList>
              </div>
              <div class="row justify-end q-ma-lg">
                <Button
                  :outline="false"
                  :label="buttonLabel"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="createBudgetTransfer"
                />
              </div>
            </q-form>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
//Core
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
//Logic view
import useBudgetTransferCreate from '@/views/budget/budget-transfers/v1/create/BudgetTransferCreate'

const {
  headerProps,
  tabs,
  tableOrigin,
  tableDestination,
  customColumns,
  defaultIconsLucide,
  buttonLabel,
  business_trust_from_to,
  budget_resource_codes,
  areas_responsabilities_selector,
  third_parties,
  budget_item_codes,
  isOneToOne,
  month_list,
  formRef,
  addOriginRow,
  addDestinationRow,
  removeOriginRow,
  removeDestinationRow,
  createBudgetTransfer,
  useRules,
  validateRouter,

  handleThirdPartyUpdate,
  handleBusinessUpdate,
  handleBudgetItemUpdate,
  handleResourceUpdate,
  handleAreaUpdate,
} = useBudgetTransferCreate()
</script>

<style
  lang="scss"
  src="@/views/budget/budget-transfers/v1/create/BudgetTransferCreate.scss"
></style>
