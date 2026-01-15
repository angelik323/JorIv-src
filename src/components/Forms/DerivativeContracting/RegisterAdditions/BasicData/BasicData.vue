<template>
  <q-form ref="formElementRef">
    <section class="q-pa-lg">
      <div class="q-mb-lg">
        <p class="text-weight-bold text-h6 q-mb-none">
          Información del contrato
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Negocio"
            :manual_option="contract_addition_business_trust"
            :map_options="false"
            :required="true"
            :default_value="models?.business_trust_id"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[
              (val: string) => useRules().is_required(val)
            ]"
            @update:modelValue="models.business_trust_id = $event"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_trust_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de contrato"
            :manual_option="contract_type_for_addition"
            :map_options="false"
            :required="true"
            :default_value="models?.contract_type_id"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.contract_type_id = $event"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Tipo de contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.contract_type_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Estado"
            :required="false"
            :default_value="contractData?.status?.name"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              {{ contractData?.status?.name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Etapa"
            :default_value="contractData?.stage?.name"
            :required="false"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Etapa</p>
            <p class="text-weight-medium no-margin">
              {{ contractData?.stage?.name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Fecha del registro"
            :default_value="contractData?.registration_date"
            :required="false"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Fecha del registro</p>
            <p class="text-weight-medium no-margin">
              {{ contractData?.registration_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Número de contrato"
            :default_value="contractData?.contract_number"
            :required="false"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Número de contrato</p>
            <p class="text-weight-medium no-margin">
              {{ contractData?.contract_number ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Contratista"
            :default_value="models.contractor_name"
            :required="false"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Contratista</p>
            <p class="text-weight-medium no-margin">
              {{ models.contractor_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Valor de contrato"
            :default_value="formatCurrencyString(contractData?.contract_value)"
            :required="false"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Valor de contrato</p>
            <p class="text-weight-medium no-margin">
              {{
                formatCurrencyString(contractData?.contract_value) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información de la adición
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de documento"
            :manual_option="contract_type_id_name"
            :map_options="false"
            :required="true"
            :default_value="models?.document_type_id"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.document_type_id = $event"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Tipo de documento</p>
            <p class="text-weight-medium no-margin">
              {{ models.document_type_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de modificación"
            :manual_option="modify_types_formatted"
            :map_options="false"
            :required="true"
            :default_value="models?.modification_type"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.modification_type = $event"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Tipo de modificación</p>
            <p class="text-weight-medium no-margin">
              {{
                contract_modification_type.find(
                  (e) => e.value === models.modification_type
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Número de la adición"
            required
            :default_value="models?.additional_number"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().only_alphanumeric(val),
              (val: string) => useRules().max_length(val, 20),
            ]"
            @update:modelValue="models.additional_number = $event"
            :disabled="!manual_document_type"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Número de la adición</p>
            <p class="text-weight-medium no-margin">
              {{ models.additional_number ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Número interno del contrato"
            :required="false"
            :default_value="models?.internal_number"
            :rules="[
              (val: string) => useRules().only_alphanumeric(val),
              (val: string) => useRules().max_length(val, 20),
              ]"
            @update:modelValue="models.internal_number = $event"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">
              Número interno del contrato
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.internal_number ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de suscripción"
            required
            :option_calendar="
              useCalendarRules().only_until(moment().format('YYYY-MM-DD'))
            "
            :default_value="models.subscription_date"
            :rules="[
              (val: string) => useRules().is_required(val)
            ]"
            @update:modelValue="(val) => (models.subscription_date = val)"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Fecha de suscripción</p>
            <p class="text-weight-medium no-margin">
              {{ formatDate(models.subscription_date ?? '', 'YYYY-MM-DD') }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Duración"
            required
            :default_value="models?.duration"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().max_length(val, models.periodicity == 3 ? 2 : 4),
              (val: string) => useRules().only_positive_value(val),
            ]"
            @update:modelValue="models.duration = $event"
            :disabled="!isEnabled(fieldRules.duration)"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Duración</p>
            <p class="text-weight-medium no-margin">
              {{ models.duration ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodicidad"
            :manual_option="contract_periodicity"
            :map_options="false"
            :required="true"
            :default_value="models?.periodicity"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:modelValue="models.periodicity = $event"
            :disabled="!isEnabled(fieldRules.duration)"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Periodicidad</p>
            <p class="text-weight-medium no-margin">
              {{
                contract_periodicity.find((e) => e.value === models.periodicity)
                  ?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de inicio de aplicación"
            :option_calendar="
              useCalendarRules().only_until(moment().format('YYYY-MM-DD'))
            "
            required
            :default_value="models.application_start_date"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => isEnabled(fieldRules.start_date) ? useRules().date_after_or_equal_to_specific_date(val, models.subscription_date ?? '') : true,
            ]"
            @update:modelValue="(val) => (models.application_start_date = val)"
            :disabled="!isEnabled(fieldRules.start_date)"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">
              Fecha de inicio de aplicación
            </p>
            <p class="text-weight-medium no-margin">
              {{
                formatDate(models.application_start_date ?? '', 'YYYY-MM-DD')
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de finalización de contrato"
            required
            :default_value="models.contract_end_date"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().date_after_or_equal_to_specific_date(val, models.application_start_date ?? ''),
            ]"
            @update:modelValue="(val) => (models.contract_end_date = val)"
            :disabled="!isEnabled(fieldRules.end_date)"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">
              Fecha de finalización de contrato
            </p>
            <p class="text-weight-medium no-margin">
              {{ formatDate(models.contract_end_date ?? '', 'YYYY-MM-DD') }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Monto adicional"
            :required="false"
            type="number"
            :default_value="models?.additional_amount"
            :rules="[
              (val: string) => useRules().max_integer_decimal(val, 12, 2),
            ]"
            @update:modelValue="models.additional_amount = $event"
            :disabled="
              contractData?.currency_id === 'COP' ||
              !isEnabled(fieldRules.additional_amount)
            "
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Monto adicional</p>
            <p class="text-weight-medium no-margin">
              {{ models.additional_amount ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="TRM"
            :required="false"
            type="number"
            :default_value="contractData?.trm"
            :rules="[]"
            :disabled="!isEnabled(fieldRules.trm)"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">TRM</p>
            <p class="text-weight-medium no-margin">
              {{ contractData?.trm ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Valor adicional"
            required
            :default_value="models?.additional_value"
            :rules="[
              (val: string) => useRules().is_required(val), 
              (val: string) => useRules().max_integer_decimal(val, 15, 2)
            ]"
            @update:modelValue="models.additional_value = $event"
            :disabled="
              (contractData?.currency_id !== 'COP' &&
                contractData?.currency_id !== 'SMLV') ||
              !isEnabled(fieldRules.additional_value)
            "
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Valor adicional</p>
            <p class="text-weight-medium no-margin">
              {{
                formatCurrencyString(models.additional_value) ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Justificación"
            required
            type="textarea"
            :default_value="models?.justification"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().max_length(val, 500),
            ]"
            @update:modelValue="models.justification = $event"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Justificación</p>
            <p class="text-weight-medium no-margin">
              {{ models.justification ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <q-checkbox
            v-model="models.has_stamp_tax"
            color="orange"
            label="¿Aplica impuesto de timbre?"
            :disable="!isEnabled(fieldRules.stamp_duty_tax)"
          />
        </div>

        <div class="col-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Objeto del contrato"
            required
            type="textarea"
            :default_value="models?.contract_object"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().max_length(val, 500),
            ]"
            @update:modelValue="models.contract_object = $event"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Objeto del contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.contract_object ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { IBasicDataFormAdditions } from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ActionType } from '@/interfaces/global'

import { useCalendarRules, useRules } from '@/composables'

import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useBasicDataForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/BasicData/BasicData'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import moment from 'moment'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IBasicDataFormAdditions | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IBasicDataFormAdditions | null): void
}>()

const {
  formElementRef,
  models,
  contractData,
  contract_addition_business_trust,
  contract_modification_type,
  contract_type_id_name,
  contract_periodicity,
  contract_type_for_addition,
  modify_types_formatted,
  manual_document_type,
  fieldRules,
  formatCurrencyString,
  formatDate,
  isEnabled,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
