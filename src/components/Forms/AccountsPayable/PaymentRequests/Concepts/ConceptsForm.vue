<template>
  <q-form ref="conceptsFormFormRef" class="q-pa-md">
    <section>
      <div class="flex justify-between">
        <p class="text-h6">Conceptos</p>

        <div>
          <Button
            label="Agregar"
            unelevated
            color-icon="white"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            :outline="false"
            @click="addConcept"
          />
        </div>
      </div>

      <VCard class="full-width">
        <template #content-card>
          <div class="q-pa-md">
            <TableList
              ref="tableRef"
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :pages="tableProps.pages"
              :custom-columns="[
                'payment_concept_id',
                'concept_value',
                'budget_effect',
                'actions',
              ]"
              selection="single"
              :hide-pagination="true"
              @update:selected="handleSelectConcept"
            >
              <template #payment_concept_id="{ row }">
                <GenericSelectorComponent
                  :default_value="row.payment_concept_id"
                  :manual_option="payment_concept_codes_payment_block"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'El concepto de pago es requerido')]"
                  @update:model-value="row.payment_concept_id = $event"
                />
              </template>

              <template #concept_value="{ row }">
                <InputMoneyComponent
                  :model-value="String(row.concept_value ?? '')"
                  :required="true"
                  :disabled="false"
                  placeholder="0,00"
                  :rules="[
                    (val: string) => is_required(val, 'El valor total es requerido'),
                    (val: string) => only_number_with_max_integers_and_decimals_ignore_symbols(val, 15, 2),
                  ]"
                  @update:model-value="
                    ({ rawValue }) => (row.concept_value = rawValue ?? '')
                  "
                />
              </template>

              <template #budget_effect="{ row }">
                <InputMoneyComponent
                  :model-value="String(row.concept_value ?? '')"
                  :required="true"
                  :disabled="true"
                  placeholder="0,00"
                  :rules="[
                    (val: string) => is_required(val, 'El efecto presupuesto es requerido'),
                    (val: string) => only_number_with_max_integers_and_decimals_ignore_symbols(val, 15, 2),
                  ]"
                  @update:model-value="
                    ({ rawValue }) => (row.concept_value = rawValue ?? '')
                  "
                />
              </template>

              <template #actions="{ row }">
                <Button
                  :outline="false"
                  :left-icon="defaultIconsLucide.trash"
                  color="orange"
                  :flat="true"
                  :class-custom="'custom'"
                  tooltip="Eliminar"
                  @click="removeConcept(row.id)"
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>
    </section>

    <section v-if="has_budget">
      <div class="flex justify-between">
        <p class="text-h6">Presupuesto</p>

        <div>
          <Button
            label="Agregar"
            unelevated
            color-icon="white"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            :outline="false"
            :disabled="selectedConceptId === null"
            @click="addBudget"
          />
        </div>
      </div>

      <VCard class="full-width">
        <template #content-card>
          <div class="q-pa-md">
            <TableList
              ref="tableBudgetRef"
              :loading="tablePropsBudget.loading"
              :columns="tablePropsBudget.columns"
              :rows="tablePropsBudget.rows"
              :pages="tablePropsBudget.pages"
              :custom-columns="[
                'resource_id',
                'area_id',
                'budget_item_id',
                'budget_value',
                'actions',
              ]"
              selection="single"
              :hide-pagination="true"
              @update:selected="handleSelectConcept"
            >
              <template #resource_id="{ row }">
                <GenericSelectorComponent
                  :default_value="row.resource_id"
                  :manual_option="budget_transfer_details_resource"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'La cuenta contable es requerida')]"
                  @update:model-value="row.resource_id = $event"
                />
              </template>

              <template #area_id="{ row }">
                <GenericSelectorComponent
                  :default_value="row.area_id"
                  :manual_option="budget_transfer_details_responsibility_area"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'La cuenta contable es requerida')]"
                  @update:model-value="row.area_id = $event"
                />
              </template>

              <template #budget_item_id="{ row }">
                <GenericSelectorComponent
                  :default_value="row.budget_item_id"
                  :manual_option="budget_transfer_details_budget_item"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'La cuenta contable es requerida')]"
                  @update:model-value="row.budget_item_id = $event"
                />
              </template>

              <template #budget_value="{ row }">
                <div style="min-width: 15em">
                  <InputMoneyComponent
                    :model-value="String(row.budget_value ?? '')"
                    :required="true"
                    :disabled="false"
                    placeholder="0,00"
                    :rules="[
                      (val: string) => is_required(val, 'El valor es requerido'),
                      (val: string) => only_number_with_max_integers_and_decimals_ignore_symbols(val, 15, 2),
                    ]"
                    @update:model-value="
                      ({ rawValue }) => (row.budget_value = rawValue ?? '')
                    "
                  />
                </div>
              </template>

              <template #actions="{ row }">
                <Button
                  :outline="false"
                  :left-icon="defaultIconsLucide.trash"
                  color="orange"
                  :flat="true"
                  :class-custom="'custom'"
                  tooltip="Eliminar"
                  @click="removeBudget(row.id)"
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>
    </section>

    <q-separator />
  </q-form>
</template>

<script setup lang="ts">
// components
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// interfaces
import { IPaymentRequestConceptsForm } from '@/interfaces/customs/accounts-payable/PaymentRequests'
import { ActionType } from '@/interfaces/global'

// logic view
import useConceptsForm from '@/components/Forms/AccountsPayable/PaymentRequests/Concepts/ConceptsForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentRequestConceptsForm | null
  }>(),
  {}
)

const {
  conceptsFormFormRef,
  tableRef,
  tableBudgetRef,
  tableProps,
  tablePropsBudget,
  selectedConceptId,
  has_budget,

  // utils
  defaultIconsLucide,

  // selects
  payment_concept_codes_payment_block,
  budget_transfer_details_responsibility_area,
  budget_transfer_details_budget_item,
  budget_transfer_details_resource,

  // methods
  addConcept,
  removeConcept,
  handleSelectConcept,
  addBudget,
  removeBudget,

  // rules
  is_required,
  only_number_with_max_integers_and_decimals_ignore_symbols,
} = useConceptsForm(props, emit)

defineExpose({
  validateForm: () => conceptsFormFormRef.value?.validate(),
})
</script>
