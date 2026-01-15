<template>
  <q-form ref="informationFormRef" aria-label="Formulario de datos básicos">
    <section aria-label="Sección de formulario de datos básicos">
      <div
        class="row q-col-gutter-x-lg"
        :class="isView ? 'q-col-gutter-y-md' : 'q-col-gutter-y-sm'"
      >
        <div class="col-12 col-md-3 text-black-90" v-if="isView">
          <p class="text-weight-bold no-margin">Número de operación</p>
          <p class="text-weight-medium no-margin">
            {{ formData.operation_number || '-' }}
          </p>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.investment_portfolio_id"
            label="Código portafolio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.investment_portfolio"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de portafolio es requerido'),
            ]"
            @update:model-value="formData.investment_portfolio_id = $event"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Código portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ formData.investment_portfolio_id || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.investment_portfolio_description"
            label="Descripción"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Descripción portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ formData.investment_portfolio_description || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericDateInputComponent
            v-if="!isView"
            :default_value="formData.operation_date"
            label="Fecha operación"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            disabled
            :rules="[]"
            @update:model-value="formData.operation_date = $event"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Fecha operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_date || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.operation_type_id"
            label="Tipo operación"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.operation_type"
            :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de operación es requerido'),
            ]"
            @update:modelValue="formData.operation_type_id = $event"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Tipo de operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_type_id || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.operation_type_description"
            label="Descripción operación"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Descripción operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_type_description || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3 text-black-90" v-if="isView">
          <p class="text-weight-bold no-margin">Estado</p>
          <p class="text-weight-medium no-margin">
            {{ formData.status || '-' }}
          </p>
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>

        <p class="col-12 text-weight-bold text-black-90 text-h6">
          Condiciones de negociación
        </p>

        <div
          class="row col-12 items-center justify-between q-px-md"
          v-if="!isView"
        >
          <p class="q-mb-none mt-1 text-weight-medium q-ml-md">Operación*</p>
          <RadioYesNo
            class="q-mt-none"
            v-model="formData.operation"
            :options="equity_ops_options['operation']"
          />
        </div>

        <div class="col-3 col-md-4 text-black-90" v-else>
          <p class="text-weight-bold no-margin">Operación</p>
          <p class="text-weight-medium no-margin">
            {{ formData.operation || '-' }}
          </p>
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>

        <div
          class="col-12"
          :class="isView ? 'col-md-4' : 'col-md-6'"
          v-if="formData.operation === 'De Contado'"
        >
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.operation_number_days"
            label="Número días operación"
            placeholder="Inserte"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El número de días de operación es requerido'),
              (val: string) => useRules().max_value(val, 5),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().only_number(val),
            ]"
            @update:modelValue="formData.operation_number_days = $event"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Número días operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_number_days || '-' }}
            </p>
          </div>
        </div>

        <div
          class="row col-12 items-center justify-between q-px-md"
          v-if="!isView"
        >
          <p class="q-mb-none mt-1 text-weight-medium q-ml-md">Comisión*</p>
          <RadioYesNo
            class="q-mt-none"
            v-model="formData.has_commission"
            :titleRadioTrue="'Si'"
            :titleRadioFalse="'No'"
          />
        </div>

        <div class="col-12 col-md-4 text-black-90" v-else>
          <p class="text-weight-bold no-margin">Comisión</p>
          <p class="text-weight-medium no-margin">
            {{ formData.has_commission ? 'Si' : 'No' }}
          </p>
        </div>

        <template v-if="formData.has_commission">
          <div class="col-12">
            <q-separator class="q-my-lg" />
          </div>

          <div
            class="row col-12 items-center justify-between q-px-md"
            v-if="!isView"
          >
            <p class="q-mb-none mt-1 text-weight-medium q-ml-md">
              Base comisión*
            </p>
            <RadioYesNo
              class="q-mt-none"
              v-model="formData.commission_base"
              :options="equity_ops_options['radio_2']"
            />
          </div>

          <div class="col-12 col-md-4 text-black-90" v-else>
            <p class="text-weight-bold no-margin">Base comisión</p>
            <p class="text-weight-medium no-margin">
              {{ formData.commission_base || '-' }}
            </p>
          </div>

          <div class="col-12">
            <q-separator class="q-my-lg" />
          </div>

          <div class="col-12" :class="isView ? 'col-md-4' : 'col-md-6'">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.commission_value"
              label="Valor"
              placeholder="Inserte"
              required
              :rules="formData.commission_base === 'Valor Operación' 
              ? [
                  (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 3, 2),
                  (val: string) => useRules().is_required(val, 'El porcentaje es requerido'),
                ] : [
                    (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 2),
                    (val: string) => useRules().is_required(val, 'El valor es requerido'),
                  ]"
              @update:model-value="formData.commission_value = $event"
            />
            <div class="text-black-90" v-else>
              <p class="text-weight-bold no-margin">Valor</p>
              <p class="text-weight-medium no-margin">
                {{
                  useUtils().formatCurrencyString(formData.commission_value) ||
                  '-'
                }}
              </p>
            </div>
          </div>
        </template>

        <section
          v-if="isView"
          class="row col-12 q-col-gutter-x-lg q-col-gutter-y-md"
        >
          <p class="col-12 text-weight-bold text-black-90 text-h6 q-mt-md">
            Condiciones de cumplimiento
          </p>

          <div
            v-for="field in complianceConditions"
            :key="field.label"
            class="col-12 col-md-3 text-black-90"
          >
            <p class="text-weight-bold no-margin">{{ field.label }}</p>
            <p class="text-weight-medium no-margin">
              {{
                field.format
                  ? field.format(
                      typeof formData[field.key as keyof typeof formData] ===
                        'boolean'
                        ? null
                        : (formData[field.key as keyof typeof formData] as
                            | string
                            | number
                            | null
                            | undefined)
                    ) || '-'
                  : formData[field.key as keyof typeof formData] ?? '-'
              }}
            </p>
          </div>

          <div class="col-12">
            <q-separator class="q-my-lg" />
          </div>
        </section>

        <section
          v-if="isView"
          class="row col-12 q-col-gutter-x-lg q-col-gutter-y-md"
        >
          <p class="col-12 text-weight-bold text-black-90 text-h6">
            Valores de cumplimiento
          </p>

          <div
            v-for="field in complianceValues"
            :key="field.label"
            class="col-12 col-md-3 text-black-90"
          >
            <p class="text-weight-bold no-margin">{{ field.label }}</p>
            <p class="text-weight-medium no-margin">
              {{
                field.format
                  ? field.format(
                      typeof formData[field.key as keyof typeof formData] ===
                        'boolean'
                        ? null
                        : (formData[field.key as keyof typeof formData] as
                            | string
                            | number
                            | null
                            | undefined)
                    ) || '-'
                  : formData[field.key as keyof typeof formData] ?? '-'
              }}
            </p>
          </div>
        </section>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import { useRules, useUtils } from '@/composables'
import { equity_ops_options } from '@/constants'
import { ActionType } from '@/interfaces/global'

import useInformationForm from '@/components/Forms/InvestmentPortfolio/EquityOps/ETFForeignSell/InformationForm/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: {}
  }>(),
  {}
)

const {
  isView,
  formData,
  selectOptions,
  complianceValues,
  informationFormRef,
  complianceConditions,
} = useInformationForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
