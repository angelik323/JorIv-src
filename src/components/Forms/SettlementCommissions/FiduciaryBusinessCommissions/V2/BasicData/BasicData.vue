<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Nombre del negocio"
            :default_value="models.business_trust_id"
            :manual_option="business_trusts_value_is_code"
            map_options
            auto_complete
            :disabled="'edit' === action"
            required
            :rules="[
              (val: string) => is_required(val, 'El nombre del negocio es requerido'),
            ]"
            @update:model-value="models.business_trust_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_trust_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha inicio de comisión"
            required
            disabled
            :default_value="models.start_date"
            :rules="[]"
            @update:modelValue="models.start_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha inicio de comisión</p>
            <p class="text-weight-medium no-margin">
              {{ models.start_date ?? 'No registrado' }}
            </p>
          </div>
        </div>
 
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Nombre de comisión"
            :default_value="models.commission_type_id"
            :manual_option="commission_types"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val,  'El nombre de comisión es requerido')]"
            @update:modelValue="models.commission_type_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre de comisión</p>
            <p class="text-weight-medium no-margin">
              {{ models.commission_type_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Clase de comisión"
            :default_value="models.commission_class_catalog_name"
            disabled
            @update:model-value="models.commission_class_catalog_name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Clase de comisión</p>
            <p class="text-weight-medium no-margin">
              {{ models.commission_class_catalog_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de comisión"
            :default_value="models.commission_type_catalog_name"
            disabled
            @update:model-value="models.commission_type_catalog_name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de comisión</p>
            <p class="text-weight-medium no-margin">
              {{ models.commission_type_catalog_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Base de cálculo"
            :default_value="models.calculation_type"
            :manual_option="opsCalculationTypes"
            map_options
            auto_complete
            required
            :disabled="!isViewBusiness"
            :rules="[(val: string) => is_required(val,  'La base del cálculo es requerida')]"
            @update:modelValue="models.calculation_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Base del cálculo</p>
            <p class="text-weight-medium no-margin">
              {{ models.calculation_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Salario mínimo legal vigente -->
        <template v-if="
          models.calculation_type === 'smmlv' ||
          models.calculation_type === 'Salario minimo mensual legal vigente'
        ">
          <div class="col-12 col-md-4">
            <InputMoneyComponent
              v-if="['create', 'edit'].includes(action)"
              label="Valor salario mínimo"
              :model-value="String(models.minimum_wage_amount)"
              disabled
              @update:model-value="
                ({ rawValue }) =>
                  (models.minimum_wage_amount = rawValue
                    ? Number(rawValue)
                    : null)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Valor salario mínimo</p>
              <p class="text-weight-medium no-margin">
                {{ formatCurrencyString(models.minimum_wage_amount) }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericInput
              :default_value="models.count_salaries"
              v-if="['create', 'edit'].includes(action)"
              label="Cantidad de salarios"
              required
              :disabled="!isViewBusiness"
              :rules="[
                (val: string) => is_required(val, 'La cantidad de salarios es requerida'),
                (val: string) => only_number_with_decimals(val),
              ]"
              @update:model-value="models.count_salaries = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Cantidad de salarios</p>
              <p class="text-weight-medium no-margin">
                {{ models.count_salaries ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>

        <!-- Valor fijo -->
        <template v-if="models.calculation_type === 'vf' || models.calculation_type === 'Valor fijo'">
          <div class="col-12 col-md-4">
            <InputMoneyComponent
              v-if="['create', 'edit'].includes(action)"
              :model-value="String(models.fixed_value ?? '')"
              label="Valor fijo"
              :disabled="!isViewBusiness"
              :rules="[
                (val: string) => is_required(val, 'El valor fijo es requerido'),
                (val: string) => max_length(val, 12),
              ]"
              @update:model-value="
                ({ rawValue }) =>
                  (models.fixed_value = rawValue ? Number(rawValue) : null)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Valor del pago</p>
              <p class="text-weight-medium no-margin">
                {{ formatCurrencyString(models.fixed_value) }}
              </p>
            </div>
          </div>
        </template>

        <template v-if="[
          'vf',
          'smmlv',
          'Salario minimo mensual legal vigente',
          'Valor fijo',
        ].includes(models.calculation_type ?? '')">
          <div class="col-12 col-md-4">
            <InputMoneyComponent
              v-if="['create', 'edit'].includes(action)"
              :model-value="String(models.base_commission_amount ?? '')"
              disabled
              label="Valor base de comisión"
              required
              @update:model-value="
                ({ rawValue }) =>
                  (models.base_commission_amount = rawValue
                    ? Number(rawValue)
                    : null)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Valor base de comisión
              </p>
              <p class="text-weight-medium no-margin">
                {{ formatCurrencyString(models.base_commission_amount) }}
              </p>
            </div>
          </div>
          
        </template>

        <!-- Porcentajes -->
        <template
          v-if="
            [
              'performance_percentage',
              'beneficiaries',
              'balances_percentage',
              'transactions_percentage',
              '% sobre el rendimiento',
              '% sobre el saldo',
              '% sobre transacciones',
              'Pago a beneficiarios'
            ].includes(models.calculation_type ?? '')
          "
        >
        <div class="col-12 col-md-4">
            <GenericInput
              :default_value="models.commission_percentage"
              v-if="['create', 'edit'].includes(action)"
              label="Porcentaje de comisión (%)"
              required
              :disabled="!isViewBusiness"
              :rules="[
                (val: string) => is_required(val, 'El porcentaje de comisión (%) es requerido'),
                (val: string) => percentage_between(val, 0, 100),
                (val: string) => only_number_with_max_integers_and_decimals(val, 3, 2),
              ]"
              @update:model-value="models.commission_percentage = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Porcentaje de comisión (%)</p>
              <p class="text-weight-medium no-margin">
                {{ models.commission_percentage }}
              </p>
            </div>
          </div>
        </template>

        <!-- Valor por transacción -->
        <template v-if="models.calculation_type === 'transactions_value' || models.calculation_type === 'Valor por transacción'">
          <div class="col-12 col-md-4">
            <InputMoneyComponent
              v-if="['create', 'edit'].includes(action)"
              :model-value="String(models.commission_transaction) ?? ''"
              label="Comisión por transacción"
              :rules="[
                (val: string) => is_required(val, 'La comisión por transacción es requerida'),
                (val: string) => max_length(val, 12),
              ]"
              :disabled="!isViewBusiness"
              @update:model-value="
                ({ rawValue }) =>
                  (models.commission_transaction = rawValue ? rawValue : null)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Comisión por transacción
              </p>
              <p class="text-weight-medium no-margin">
                {{ formatCurrencyString(models.commission_transaction) }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericInput
              :default_value="models.count_transaction"
              v-if="['create', 'edit'].includes(action)"
              label="Cantidad de transacciones"
              required
              :disabled="!isViewBusiness"
              :rules="[
                (val: string) => is_required(val, 'La cantidad de transacciones es requerida'),
                (val: string) => max_length(val, 9),
                (val: string) => only_number(val),
              ]"
              @update:model-value="models.count_transaction = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">Cantidad de transacciones</p>
              <p class="text-weight-medium no-margin">
                {{ formatCurrencyString(models.count_transaction) }}
              </p>
            </div>
          </div>
        </template>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Cobro"
            :default_value="models.colllection"
            :manual_option="collections_options"
            map_options
            auto_complete
            required
            :disabled="!isViewBusiness"
            :rules="[(val: string) => is_required(val,  'El cobro es requerido')]"
            @update:modelValue="models.colllection = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Cobro</p>
            <p class="text-weight-medium no-margin">
              {{ models.colllection ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tercero a facturar"
            :default_value="models.third_party_billings_id"
            :manual_option="third_party_billings"
            map_options
            auto_complete
            required
            :disabled="!isViewBusiness"
            :rules="[(val: string) => is_required(val,  'El tercero a facturar es requerido')]"
            @update:modelValue="models.third_party_billings_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tercero a facturar</p>
            <p class="text-weight-medium no-margin">
              {{ models.third_party_billings_id ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mt-1">
        <div class="col-4 col-md-4 ">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Descripción"
            :default_value="models.description"
            type="textarea"
            required
            :disabled="!isViewBusiness"
            :rules="[
              (val: string) => is_required(val, 'La descripción es requerida'),
              (val: string) => max_length(val, 400),
            ]"
            @update:model-value="models.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-4 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Observaciones"
            :default_value="models.observation"
            type="textarea"
            :disabled="!isViewBusiness"
            :rules="[
              (val: string) => max_length(val, 400),
            ]"
            @update:model-value="models.observation = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Observaciones</p>
            <p class="text-weight-medium no-margin">
              {{ models.observation ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-my-md" />
    <section>
      <p class="text-black-10 text-weight-bold text-h6">
        Periodo de facturación
      </p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código del periodo"
            :default_value="models.billing_trust_id"
            :manual_option="billing_trusts"
            map_options
            auto_complete
            required
            :disabled="action === 'edit'"
            :rules="[(val: string) => is_required(val,  'El código del periodo es requerido')]"
            @update:modelValue="models.billing_trust_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código del periodo</p>
            <p class="text-weight-medium no-margin">
                {{ models.billing_trust_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Periodicidad"
            :default_value="models.periodicity"
            required
            disabled
            @update:model-value="models.periodicity = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Periodicidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.periodicity ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código de movimiento"
            :default_value="models.code_movement"
            disabled
            @update:model-value="models.code_movement = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código de movimiento</p>
            <p class="text-weight-medium no-margin">
                {{ models.code_movement ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha inicial"
            required
            disabled
            :default_value="models.start_date_period"
            :rules="[]"
            @update:modelValue="models.start_date_period = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha inicial</p>
            <p class="text-weight-medium no-margin">
              {{ models.start_date_period ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha final"
            required
            disabled
            :default_value="models.end_date_period"
            :rules="[]"
            @update:modelValue="models.end_date_period = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha final</p>
            <p class="text-weight-medium no-margin">
              {{ models.end_date_period ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Genera IVA"
            :default_value="models.generate_iva"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            required
            disabled
            :rules="[]"
            @update:modelValue="models.generate_iva = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Genera IVA</p>
            <p class="text-weight-medium no-margin">
              {{ models.generate_iva ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Porcentaje (%) de IVA"
            :default_value="models.iva"
            disabled
            @update:model-value="models.iva = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Porcentaje (%) de IVA</p>
            <p class="text-weight-medium no-margin">
              {{ models.iva ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Retefuente"
            :default_value="models.generated_source"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            :required="false"
            disabled
            :rules="[]"
            @update:modelValue="models.generated_source = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Retefuente</p>
            <p class="text-weight-medium no-margin">
              {{ models.generated_source ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Porcentaje (%) de retefuente"
            :default_value="models.source_percentage"
            disabled
            @update:model-value="models.source_percentage = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Porcentaje (%) de retefuente
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.source_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="ReteICA"
            :default_value="models.generated_ica"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            :required="false"
            disabled
            :rules="[]"
            @update:modelValue="models.generated_ica = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">ReteICA</p>
            <p class="text-weight-medium no-margin">
              {{ models.generated_ica ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Porcentaje (%) de ReteICA"
            :default_value="models.ica_percentage"
            disabled
            @update:model-value="models.ica_percentage = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Porcentaje (%) de ReteICA</p>
            <p class="text-weight-medium no-margin">
              {{ models.ica_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Rete IVA"
            :default_value="models.generated_network_iva"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            :required="false"
            disabled
            :rules="[]"
            @update:modelValue="models.generated_network_iva = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Rete IVA</p>
            <p class="text-weight-medium no-margin">
              {{ models.generated_network_iva ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Porcentaje (%) de rete IVA"
            :default_value="models.network_iva_percentage"
            disabled
            @update:model-value="models.network_iva_percentage = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Porcentaje (%) de rete IVA</p>
            <p class="text-weight-medium no-margin">
              {{ models.network_iva_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// constants
import { business_trust_yes_no, collections_options } from '@/constants'

// interfaces
import { IFiduciaryBusinessCommissionsFormV2 } from '@/interfaces/customs/settlement-commissions/FiduciaryBusinessCommissionsV2'
import { ActionType } from '@/interfaces/global'

// logic
import useBasicDataForm from '@/components/Forms/SettlementCommissions/FiduciaryBusinessCommissions/V2/BasicData/BasicData'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IFiduciaryBusinessCommissionsFormV2 | null
    isViewBusiness?: boolean
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IFiduciaryBusinessCommissionsFormV2 | null): void
}>()

const {
  formElementRef,
  models,
  is_required,
  max_length,
  business_trusts_value_is_code,
  opsCalculationTypes,
  formatCurrencyString,
  commission_types,
  third_party_billings,
  billing_trusts,
  only_number,
  only_number_with_max_integers_and_decimals,
  percentage_between,
  only_number_with_decimals
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
