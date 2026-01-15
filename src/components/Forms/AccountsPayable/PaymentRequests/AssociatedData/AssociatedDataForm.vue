<template>
  <q-form ref="associatedDataFormRef" class="q-pa-md">
    <section>
      <p class="text-h6">Activos fijos / Bienes</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Fuente"
            :default_value="models.assets[0].asset_source"
            :manual_option="type"
            :auto_complete="true"
            :required="false"
            :map_options="true"
            :rules="[]"
            @update:model-value="models.assets[0].asset_source = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Tipo de activo"
            :default_value="models.assets[0].asset_type_id"
            :manual_option="configuration_type"
            :auto_complete="true"
            :required="false"
            :map_options="true"
            :rules="[]"
            @update:model-value="changeConfigurationType($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Número de bien"
            :default_value="models.assets[0].asset_number_id"
            :manual_option="asset_number"
            :auto_complete="true"
            :required="false"
            :map_options="true"
            :rules="[]"
            @update:model-value="models.assets[0].asset_number_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Placa / Matrícula"
            type="text"
            :default_value="models.assets[0].plate_or_register"
            :required="true"
            :disabled="true"
            placeholder="-"
            :rules="[]"
            @update:model-value="models.assets[0].plate_or_register = $event"
          />
        </div>
      </div>
    </section>

    <q-separator class="mb-3" />

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Obligación financiera"
            :default_value="
              models.financial_obligations[0].financial_obligation_id
            "
            :manual_option="financial_obligations"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'La obligación financiera es requerida')]"
            @update:model-value="changeFinancialObligation($event)"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Cuota"
            type="text"
            :default_value="models.financial_obligations[0].installment_number"
            :required="true"
            :disabled="true"
            placeholder="-"
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-4">
          <InputMoneyComponent
            :model-value="
              String(models.financial_obligations[0].capital_value ?? '')
            "
            label="Valor de capital"
            :required="true"
            :disabled="true"
            placeholder="0,00"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) =>
                (models.financial_obligations[0].capital_value = rawValue ?? '')
            "
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <InputMoneyComponent
            :model-value="
              String(models.financial_obligations[0].interest_value ?? '')
            "
            label="Valor de interés"
            :required="true"
            :disabled="true"
            placeholder="0,00"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) =>
                (models.financial_obligations[0].interest_value =
                  rawValue ?? '')
            "
          />
        </div>

        <div class="col-12 col-md-4">
          <InputMoneyComponent
            :model-value="
              String(
                models.financial_obligations[0].total_installment_value ?? ''
              )
            "
            label="Valor total"
            :required="true"
            :disabled="true"
            placeholder="0,00"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) =>
                (models.financial_obligations[0].total_installment_value =
                  rawValue ?? '')
            "
          />
        </div>
      </div>
    </section>

    <q-separator class="my-3" />

    <section>
      <p class="text-h6">Anticipos</p>

      <VCard class="full-width">
        <template #content-card>
          <div class="q-pa-md">
            <TableList
              ref="tableRef"
              v-model:selected="models.advances"
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :pages="tableProps.pages"
              :custom-columns="[
                'amortization_type',
                'amortization_percentage',
                'amortize_value',
              ]"
              selection="single"
              :hide-pagination="true"
              @update:selected="handleSelectAdvance"
            >
              <template #amortization_type="{ row }">
                <GenericSelectorComponent
                  :default_value="row.amortization_type"
                  :manual_option="advance_amortization_type"
                  :auto_complete="true"
                  :required="selectedItemId == row.id"
                  :disabled="selectedItemId != row.id"
                  :map_options="true"
                  :rules="[(val: string) => selectedItemId == row.id ? is_required(val, 'El tipo de amortización es requerido') : true]"
                  @update:model-value="changeAmortizationType(row, $event)"
                />
              </template>

              <template #amortization_percentage="{ row }">
                <InputMoneyComponent
                  :model-value="String(row.amortization_percentage ?? '')"
                  :required="row.amortization_type == 'porcentaje'"
                  :disabled="
                    row.amortization_type == 'manual' ||
                    row.amortization_type == null ||
                    row.amortization_type == ''
                  "
                  placeholder="0,00"
                  :hide_symbol="true"
                  :rules="[
                    (val: string) => is_required(val, 'El porcentaje es requerido'),
                    (val: string) => only_number_with_max_integers_and_decimals_ignore_symbols(val, 15, 2)
                  ]"
                  @update:model-value="
                    ({ rawValue }) =>
                      changeAmortizationPercentage(row, rawValue ?? '')
                  "
                />
              </template>

              <template #amortize_value="{ row }">
                <InputMoneyComponent
                  :model-value="String(row.amortize_value ?? '')"
                  :required="row.amortization_type == 'manual'"
                  :disabled="
                    row.amortization_type == 'porcentaje' ||
                    row.amortization_type == null ||
                    row.amortization_type == ''
                  "
                  placeholder="0,00"
                  :rules="[
                    (val: string) => is_required(val, 'El valor a amortizar es requerido'),
                    (val: string) => only_number_with_max_integers_and_decimals_ignore_symbols(val, 15, 2)
                  ]"
                  @update:model-value="
                    ({ rawValue }) => changeAmortizeValue(row, rawValue ?? '')
                  "
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
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// interfaces
import { IPaymentRequestAssociatedDataForm } from '@/interfaces/customs/accounts-payable/PaymentRequests'
import { ActionType } from '@/interfaces/global'

// logic view
import useAssociatedDataFormRef from '@/components/Forms/AccountsPayable/PaymentRequests/AssociatedData/AssociatedDataForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentRequestAssociatedDataForm | null
  }>(),
  {}
)

const {
  associatedDataFormRef,
  models,
  tableRef,
  tableProps,

  // selects
  type,
  configuration_type,
  asset_number,
  financial_obligations,
  advance_amortization_type,
  selectedItemId,

  // methods
  changeConfigurationType,
  changeFinancialObligation,
  handleSelectAdvance,
  changeAmortizationType,
  changeAmortizationPercentage,
  changeAmortizeValue,

  // rules
  is_required,
  only_number_with_max_integers_and_decimals_ignore_symbols,
} = useAssociatedDataFormRef(props, emit)

defineExpose({
  validateForm: () => associatedDataFormRef.value?.validate(),
})
</script>
