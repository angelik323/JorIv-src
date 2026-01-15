<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <h2 class="text-h6 text-weight-bold text-black-90">
        Parámetros de liquidación
      </h2>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Tipo de calculo"
            :default_value="models.calculation_type"
            :manual_option="opsCalculationTypes"
            map_options
            auto_complete
            required
            :rules="[(val: string) => useRules().is_required(val,  'El tipo de cálculo es requerido')]"
            @update:modelValue="updateCalculationType"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">Tipo de cálculo</p>
            <p class="text-weight-medium no-margin">
              {{ models.calculation_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Salario mínimo legal vigente -->
        <template
          v-if="
            models.calculation_type?.toLocaleLowerCase() ===
            'salario minimo legal vigente'
          "
        >
          <div class="col-12 col-md-4">
            <CurrencyInput
              v-if="['create'].includes(action)"
              v-model="models.smlmv_amount"
              :currency="'COP'"
              currencyLabel="Salario mínimo legal vigente"
              disabled
              :rules="[
                (val: string) => useRules().is_required(val, 'El salario mínimo legal vigente es requerido'),
                (val: string) => useRules().max_length(val, 18),
              ]"
              @update:model-value="models.smlmv_amount = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">
                Salario mínimo legal vigente
              </p>
              <p class="text-weight-medium no-margin">
                {{ utils.formatCurrencyString(models.smlmv_amount) }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericInput
              :default_value="models.smlmv_quantity"
              v-if="['create'].includes(action)"
              label="Cantidad SMLMV"
              required
              :rules="[
                (val: string) => useRules().is_required(val, 'La cantidad SMLMV es requerida'),
                (val: string) => useRules().max_integer_decimal(val, 3, 2),
              ]"
              @update:model-value="models.smlmv_quantity = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">Cantidad SMLMV</p>
              <p class="text-weight-medium no-margin">
                {{ utils.formatCurrencyString(models.smlmv_quantity) }}
              </p>
            </div>
          </div>
        </template>

        <!-- Valor del pago -->
        <template
          v-if="
            models.calculation_type?.toLocaleLowerCase() === 'valor del pago'
          "
        >
          <div class="col-12 col-md-4">
            <CurrencyInput
              v-if="['create'].includes(action)"
              v-model="models.payment_amount"
              :currency="'COP'"
              currencyLabel="Valor del pago"
              :rules="[
                (val: string) => useRules().is_required(val, 'El valor del pago es requerido'),
                (val: string) => useRules().max_length(val, 18),
              ]"
              @update:model-value="models.payment_amount = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">Valor del pago</p>
              <p class="text-weight-medium no-margin">
                {{ utils.formatCurrencyString(models.payment_amount) }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericInput
              :default_value="models.payments_count"
              v-if="['create'].includes(action)"
              label="Cantidad de pagos"
              required
              :rules="[
                (val: string) => useRules().is_required(val, 'La cantidad de pagos es requerida'),
                (val: string) => useRules().max_length(val, 3),
                (val: string) => useRules().only_number(val),
              ]"
              @update:model-value="models.payments_count = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">Cantidad de pagos</p>
              <p class="text-weight-medium no-margin">
                {{ models.payments_count ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>

        <!-- % sobre el rendimiento -->
        <template
          v-if="
            models.calculation_type?.toLocaleLowerCase() ===
            '% sobre el rendimiento'
          "
        >
          <div class="col-12 col-md-4">
            <CurrencyInput
              v-if="['create'].includes(action)"
              v-model="models.returns_percentage"
              :currency="'COP'"
              currencyLabel="% sobre rendimientos"
              hideIcon
              :rules="[
                (val: string) => useRules().is_required(val, 'El % sobre rendimientos es requerido'),
                (val: string) => useRules().max_length(val, 7),
              ]"
              @update:model-value="models.returns_percentage = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">% sobre rendimientos</p>
              <p class="text-weight-medium no-margin">
                {{ models.returns_percentage ?? 'No registrado' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <CurrencyInput
              v-if="['create'].includes(action)"
              v-model="models.returns_amount"
              :currency="'COP'"
              currencyLabel="Rendimientos"
              :rules="[
                (val: string) => useRules().is_required(val, 'Los rendimientos son requeridos'),
                (val: string) => useRules().max_length(val, 23),
              ]"
              @update:model-value="models.returns_amount = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">Rendimientos</p>
              <p class="text-weight-medium no-margin">
                {{ models.returns_amount ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>

        <!-- % sobre el saldo -->
        <template
          v-if="
            models.calculation_type?.toLocaleLowerCase() === '% sobre el saldos'
          "
        >
          <div class="col-12 col-md-4">
            <CurrencyInput
              v-if="['create'].includes(action)"
              v-model="models.balances_percentage"
              :currency="'COP'"
              currencyLabel="% sobre saldos"
              hideIcon
              :rules="[
                (val: string) => useRules().is_required(val, 'El % sobre saldos es requerido'),
                (val: string) => useRules().max_length(val, 7),
              ]"
              @update:model-value="models.balances_percentage = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">% sobre saldos</p>
              <p class="text-weight-medium no-margin">
                {{ models.balances_percentage ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <CurrencyInput
              v-if="['create'].includes(action)"
              v-model="models.balances_amount"
              :currency="'COP'"
              currencyLabel="Saldos"
              :rules="[
                (val: string) => useRules().is_required(val, 'Los saldos son requeridos'),
                (val: string) => useRules().max_length(val, 23),
              ]"
              @update:model-value="models.balances_amount = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">Saldos</p>
              <p class="text-weight-medium no-margin">
                {{ models.balances_amount ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>

        <!-- Otros valores -->
        <template
          v-if="
            models.calculation_type?.toLocaleLowerCase() === 'otros valores'
          "
        >
          <div class="col-12 col-md-4">
            <CurrencyInput
              v-if="['create'].includes(action)"
              v-model="models.other_value_amount"
              :currency="'COP'"
              currencyLabel="Otro valor"
              :rules="[
                (val: string) => useRules().is_required(val, 'Los otro valor son requeridos'),
                (val: string) => useRules().max_length(val, 20),
              ]"
              @update:model-value="models.other_value_amount = $event"
            />
          </div>
        </template>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <CurrencyInput
            v-if="['create'].includes(action)"
            v-model="models.base_amount"
            :currency="'COP'"
            currencyLabel="Valor base"
            disabled
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor base es requerido'),
              (val: string) => useRules().max_length(val, 18),
            ]"
            @update:model-value="models.base_amount = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">Valor base</p>
            <p class="text-weight-medium no-margin">
              {{ utils.formatCurrencyString(models.base_amount) }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericInput
            :default_value="models.iva_percentage"
            v-if="['create'].includes(action)"
            label="IVA %"
            required
            disabled
            :rules="[
              (val: string) => useRules().is_required(val, 'El IVA % es requerido'),
              (val: string) => useRules().only_number(val),
            ]"
            @update:model-value="models.iva_percentage = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">IVA %</p>
            <p class="text-weight-medium no-margin">
              {{ models.iva_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <CurrencyInput
            v-if="['create'].includes(action)"
            v-model="models.total_amount"
            :currency="'COP'"
            currencyLabel="Valor total"
            disabled
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor total es requerido'),
              (val: string) => useRules().max_length(val, 18),
            ]"
            @update:model-value="models.total_amount = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-medium no-margin">Valor total</p>
            <p class="text-weight-medium no-margin">
              {{ utils.formatCurrencyString(models.total_amount) }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

import { useRules } from '@/composables'

import { IFiduciaryBusinessCommissionsCalculationForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import useBasicDataCalculationForm from '@/components/Forms/SettlementCommissions/FiduciaryBusinessCommissions/BasicDataCalculation/BasicDataCalculation'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IFiduciaryBusinessCommissionsCalculationForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (
    e: 'update:data',
    value: IFiduciaryBusinessCommissionsCalculationForm | null
  ): void
}>()

const {
  formElementRef,
  models,
  utils,
  opsCalculationTypes,
  updateCalculationType,
} = useBasicDataCalculationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
