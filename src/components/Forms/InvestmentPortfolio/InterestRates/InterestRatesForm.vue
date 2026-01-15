<template>
  <div>
    <q-form ref="formRef" class="q-pa-lg">
      <div class="form-section q-mb-md">
        <p class="text-subtitle1 text-bold q-mb-sm">Tasa de interés</p>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4 q-mt-md">
            <template v-if="isViewMode">
              <p class="text-subtitle2 text-bold q-mb-xs">Código</p>
              <div>{{ models.code || '-' }}</div>
            </template>
            <template v-else>
              <GenericInput
                label="Código"
                :required="true"
                :default_value="models.code"
                :rules="codeRules"
                @update:model-value="models.code = $event"
                placeholder="Inserte"
              />
            </template>
          </div>

          <div class="col-12 col-md-4 q-mt-md">
            <template v-if="isViewMode">
              <p class="text-subtitle2 text-bold q-mb-xs">
                Descripción tasa de interés
              </p>
              <div>{{ models.interest_rate_description || '-' }}</div>
            </template>
            <template v-else>
              <GenericInput
                label="Descripción tasa de interés"
                :required="action === 'create'"
                :default_value="models.interest_rate_description"
                :rules="descriptionRules"
                @update:model-value="models.interest_rate_description = $event"
                placeholder="Inserte"
              />
            </template>
          </div>
        </div>
      </div>

      <q-separator spaced />

      <div class="form-section q-mb-md">
        <p class="text-subtitle1 text-bold q-mb-sm">Periodicidad de pago</p>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4 q-mt-md">
            <template v-if="isViewMode">
              <p class="text-subtitle2 text-bold q-mb-xs">Código</p>
              <div>{{ models.payment_frequency_code || '-' }}</div>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="Código"
                :default_value="models.payment_frequency_code"
                :manual_option="interest_rate_payment_code_options"
                :map_options="true"
                :clearable="false"
                :required="action !== 'edit'"
                :rules="[]"
                placeholder="Seleccione"
                @update:model-value="models.payment_frequency_code = $event"
              />
            </template>
          </div>

          <div class="col-12 col-md-4 q-mt-md">
            <template v-if="isViewMode">
              <p class="text-subtitle2 text-bold q-mb-xs">Descripción</p>
              <div>{{ models.payment_frequency || '-' }}</div>
            </template>
            <template v-else>
              <GenericInput
                label="Descripción"
                :required="true"
                :disabled="true"
                :default_value="models.payment_frequency"
                :rules="descriptionRules"
                @update:model-value="models.payment_frequency = $event"
                placeholder="Inserte"
              />
            </template>
          </div>

          <div class="col-12 col-md-4 q-mt-md">
            <template v-if="isViewMode">
              <p class="text-subtitle2 text-bold q-mb-xs">Número de meses</p>
              <div>{{ models.number_months || '-' }}</div>
            </template>
            <template v-else>
              <GenericInput
                label="Número de meses"
                type="number"
                :required="true"
                :disabled="true"
                :default_value="models.number_months"
                :rules="[]"
                @update:model-value="models.number_months = $event"
                placeholder="0"
              />
            </template>
          </div>
        </div>
      </div>

      <q-separator spaced />

      <div class="form-section q-mb-md">
        <p class="text-subtitle1 text-bold q-mb-sm">Modalidad de pago</p>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4 q-mt-md">
            <template v-if="isViewMode">
              <p class="text-subtitle2 text-bold q-mb-xs">Código</p>
              <div>{{ models.mode_code || '-' }}</div>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="Código"
                :key="models.mode_code"
                :default_value="models.mode_code"
                :manual_option="interest_rate_mode_code_options"
                :map_options="true"
                :required="true"
                :rules="[]"
                placeholder="Seleccione"
                @update:model-value="models.mode_code = $event"
              />
            </template>
          </div>

          <div class="col-12 col-md-4 q-mt-md">
            <template v-if="isViewMode">
              <p class="text-subtitle2 text-bold q-mb-xs">Modalidad de pago</p>
              <div>{{ models.mode || '-' }}</div>
            </template>
            <template v-else>
              <GenericInput
                label="Modalidad de pago"
                :default_value="models.mode || '-'"
                :rules="descriptionRules"
                :required="true"
                :disabled="true"
              />
            </template>
          </div>
        </div>
      </div>

      <q-separator spaced />

      <div class="q-mt-md">
        <p class="text-subtitle1 text-weight-bold q-mb-sm">Valor de la tasa</p>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4 q-mt-md">
            <template v-if="isViewMode">
              <p class="text-subtitle2 text-bold q-mb-xs">Fecha</p>
              <div>{{ models.date || '-' }}</div>
            </template>
            <template v-else>
              <GenericDateInput
                label="Fecha"
                :default_value="models.date"
                :required="true"
                :disabled="true"
                placeholder="AAAA-MM-DD"
                :rules="dateRules"
                @update:model-value="onChangeDate"
              />
            </template>
          </div>

          <div class="col-12 col-md-4 q-mt-md">
            <template v-if="isViewMode">
              <p class="text-subtitle2 text-bold q-mb-xs">Valor tasa</p>
              {{ models.rate_value ? models.rate_value + ' %' : '-' }}
            </template>
            <template v-else>
              <GenericInput
                label="Valor tasa"
                type="text"
                inputmode="decimal"
                placeholder="Inserte"
                :default_value="
                  props.action === 'edit'
                    ? models.rate_value
                      ? String(models.rate_value) + ' %'
                      : ''
                    : models.rate_value
                "
                :disabled="props.action === 'edit'"
                :required="true"
                :rules="rateValueRules"
                @update:model-value="(val) => (models.rate_value = val)"
              />
            </template>
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import useInterestRateSForm from './InterestRatesForm'
import { ActionType } from '@/interfaces/global'
import { IInterestRateModel } from '@/interfaces/customs'

const props = defineProps<{
  action: ActionType
  data?: IInterestRateModel
}>()

const emits = defineEmits(['submit', 'update'])

const {
  formRef,
  models,
  isValid,
  isViewMode,
  codeRules,
  descriptionRules,
  dateRules,
  rateValueRules,
  interest_rate_payment_code_options,
  interest_rate_mode_code_options,
  validateForm,
  onChangeDate,
} = useInterestRateSForm(props)

defineExpose({
  validate: validateForm,
  getFormData: () => models.value,
  isValid,
})
</script>
