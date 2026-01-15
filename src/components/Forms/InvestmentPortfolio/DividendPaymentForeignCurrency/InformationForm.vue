<template>
  <q-form
    role="form"
    ref="informationFormRef"
    aria-label="Formulario de información"
  >
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <p class="text-weight-bold text-h6" aria-level="2" role="heading">
            Emisores
          </p>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.emitter_id"
            label="Identificación"
            placeholder="Seleccione"
            :manual_option="selectOptions.issuers"
            map_options
            required
            auto_complete
            :rules="[
              (v: string) => useRules().is_required(v, 'La identificación es requerida'),
            ]"
            @update:modelValue="formData.emitter_id = $event"
          />
          <div class="text-black-90" v-else>
            <p id="lbl-document_emitter" class="text-weight-bold no-margin">
              Identificación
            </p>
            <p class="mb-0 text-grey-9" aria-labelledby="lbl-document_emitter">
              {{ formData.document_emitter || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.emitter_name || '-'"
            label="Descripción"
            placeholder="-"
            type="text"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p
              id="lbl-description_emitter_name"
              class="text-weight-bold no-margin"
            >
              Descripción
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-description_emitter_name"
            >
              {{ formData.description_emitter_name || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="!isView"
            :default_value="formData.operation_date"
            label="Fecha de operación"
            mask="YYYY-MM-DD"
            placeholder="-"
            disabled
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de operación es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="formData.operation_date = $event"
          />
          <div class="text-black-90" v-else>
            <p id="lbl-operation_date" class="text-weight-bold no-margin">
              Fecha de operación
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-operation_date"
            >
              {{ formData.operation_date || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.operation_code"
            label="Código de operación"
            placeholder="Seleccione"
            :manual_option="selectOptions.operationCode"
            auto_complete
            map_options
            required
            :rules="[
              (v: string) => useRules().is_required(v, 'El codigo de operación es requerido'),
            ]"
            @update:modelValue="formData.operation_code = $event"
          />
          <div class="text-black-90" v-else>
            <p id="lbl-operation_code" class="text-weight-bold no-margin">
              Código de operación
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-operation_code"
            >
              {{ formData.operation_type_code }} -
              {{ formData.operation_type_description }}
            </p>
          </div>
        </div>

        <div class="col-12">
          <q-separator class="q-my-md" />
        </div>

        <div class="col-12">
          <p class="text-weight-bold text-h6" aria-level="2" role="heading">
            Registro de dividendo
          </p>
        </div>

        <div
          class="row"
          :class="
            isView ? 'q-col-gutter-lg' : 'q-col-gutter-x-lg q-col-gutter-y-sm'
          "
        >
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-if="!isView"
              :default_value="formData.class_action"
              label="Clase acción"
              placeholder="Seleccione"
              :manual_option="selectOptions.classActions"
              auto_complete
              map_options
              required
              disabled
              :rules="[]"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-class_action" class="text-weight-bold no-margin">
                Clase acción
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-class_action"
              >
                {{ formData.class_action || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.unit_id_action"
              label="Id Unidad / Acción"
              placeholder="Inserte"
              type="text"
              required
              disabled
              :rules="[]"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-unit_id_action" class="text-weight-bold no-margin">
                Id Unidad / Acción
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-unit_id_action"
              >
                {{ formData.unit_id_action || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.number_of_shares"
              label="Cantidad de acciones"
              placeholder="Inserte"
              type="text"
              required
              disabled
              :rules="[]"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-number_of_shares" class="text-weight-bold no-margin">
                Cantidad de acciones
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-number_of_shares"
              >
                {{ formData.number_of_shares || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-if="!isView"
              :default_value="formData.dividend_type"
              label="Tipo de dividendo"
              placeholder="Seleccione"
              :manual_option="selectOptions.dividendTypes"
              auto_complete
              map_options
              required
              disabled
              :rules="[]"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-dividend_type" class="text-weight-bold no-margin">
                Tipo de dividendo
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-dividend_type"
              >
                {{ formData.dividend_type || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericDateInputComponent
              v-if="!isView"
              :default_value="formData.dividend_record_date"
              label="Fecha de registro dividendo"
              placeholder="YYYY-MM-DD"
              mask="YYYY-MM-DD"
              required
              :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de registro dividendo es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
              @update:model-value="formData.dividend_record_date = $event"
            />
            <div class="text-black-90" v-else>
              <p
                id="lbl-dividend_record_date"
                class="text-weight-bold no-margin"
              >
                Fecha de registro dividendo
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-dividend_record_date"
              >
                {{ formData.dividend_record_date || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericDateInputComponent
              v-if="!isView"
              :default_value="formData.ex_dividend_date"
              label="Fecha exdividendo"
              placeholder="YYYY-MM-DD"
              mask="YYYY-MM-DD"
              required
              :disabled="!isExDividend"
              :rules="[
              (val: string) => useRules().is_required(val, 'La fecha exdividendo es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
              @update:model-value="formData.ex_dividend_date = $event"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-ex_dividend_date" class="text-weight-bold no-margin">
                Fecha exdividendo
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-ex_dividend_date"
              >
                {{ formData.ex_dividend_date || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericDateInputComponent
              v-if="!isView"
              :default_value="formData.due_date"
              label="Fecha exigibilidad"
              placeholder="YYYY-MM-DD"
              mask="YYYY-MM-DD"
              required
              :rules="[
              (val: string) => useRules().is_required(val, 'La fecha exigibilidad es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
              @update:model-value="formData.due_date = $event"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-due_date" class="text-weight-bold no-margin">
                Fecha exigibilidad
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-due_date"
              >
                {{ formData.due_date || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericDateInputComponent
              v-if="!isView"
              :default_value="formData.payment_date"
              label="Fecha pago"
              mask="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              required
              :rules="[
              (val: string) => useRules().is_required(val, 'La fecha pago es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
              @update:model-value="formData.payment_date = $event"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-payment_date" class="text-weight-bold no-margin">
                Fecha pago
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-payment_date"
              >
                {{ formData.payment_date || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <RadioYesNo
              v-if="!isView"
              hasTitle
              required
              v-model="hasRecorded"
              title="Gravado*"
              :titleRadioTrue="'Si'"
              :titleRadioFalse="'No'"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-has_recorded" class="text-weight-bold no-margin">
                Gravado
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-has_recorded"
              >
                {{ hasRecorded ? 'Si' : 'No' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-if="!isView"
              :default_value="formData.currency_id"
              label="Moneda origen"
              placeholder="Seleccione"
              :manual_option="selectOptions.currency"
              map_options
              required
              auto_complete
              :rules="[
              (v: string) => useRules().is_required(v, 'La moneda origen es requerida'),
            ]"
              @update:modelValue="formData.currency_id = $event"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-type_of_currency" class="text-weight-bold no-margin">
                Moneda origen
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-type_of_currency"
              >
                {{ formData.type_of_currency || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.spot_rate"
              label="Tasa spot"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
              (v: string) => useRules().only_number_with_max_integers_and_decimals(v, 15, 2),
              (v: string) => useRules().is_required(v, 'La tasa spot es requerida'),
            ]"
              @update:modelValue="formData.spot_rate = $event"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-tasa-spot" class="text-weight-bold no-margin">
                Tasa spot
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-tasa-spot"
              >
                {{ useUtils().formatCurrencyString(formData.spot_rate) || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.dividend_value"
              label="Valor dividendo moneda origen"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
              (v: string) => useRules().is_required(v, 'El valor dividendo moneda origen es requerido'),
              (v: string) => useRules().only_number_with_max_integers_and_decimals(v, 15, 2),
            ]"
              @update:modelValue="formData.dividend_value = $event"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-dividend_value" class="text-weight-bold no-margin">
                Valor dividendo moneda origen
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-dividend_value"
              >
                {{
                  useUtils().formatCurrencyString(formData.dividend_value) ||
                  '-'
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.dividend_value_local_currency"
              label="Valor dividendo moneda local"
              placeholder="Inserte"
              type="text"
              :disabled="isGravedividend"
              required
              :rules="[
              (v: string) => useRules().is_required(v, 'El valor dividendo moneda origen es requerido'),
              (v: string) => useRules().only_number_with_max_integers_and_decimals(v, 15, 2),
            ]"
            />
            <div class="text-black-90" v-else>
              <p
                id="lbl-dividend_value_local_currency"
                class="text-weight-bold no-margin"
              >
                Valor dividendo moneda local
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-dividend_value_local_currency"
              >
                {{
                  useUtils().formatCurrencyString(
                    formData.dividend_value_local_currency
                  ) || '-'
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.tax_percentage"
              label="Porcentaje impuesto"
              placeholder="Inserte"
              type="text"
              :required="hasRecorded"
              :disabled="!hasRecorded"
              :rules="[
              (v: string) => useRules().is_required(v, 'El porcentaje impuesto es requerido'),
              (v: string) => useRules().only_number_with_max_integers_and_decimals(v, 15, 2),
            ]"
              @update:modelValue="formData.tax_percentage = $event"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-tax_percentage" class="text-weight-bold no-margin">
                Porcentaje impuesto
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-tax_percentage"
              >
                {{
                  useUtils().formatPercentageString(formData.tax_percentage) ||
                  '-'
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.tax_value"
              label="Valor impuesto moneda origen"
              placeholder="Inserte"
              type="text"
              :required="hasRecorded"
              :disabled="!hasRecorded || isGravedividend"
              :rules="[
              (v: string) => useRules().is_required(v, 'El valor impuesto moneda origen es requerido'),
              (v: string) => useRules().only_number_with_max_integers_and_decimals(v, 15, 2),
            ]"
              @update:modelValue="formData.tax_value = $event"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-tax_value" class="text-weight-bold no-margin">
                Valor impuesto moneda origen
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-tax_value"
              >
                {{ useUtils().formatCurrencyString(formData.tax_value) || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.tax_value_local_currency"
              label="Valor impuesto moneda local"
              placeholder="Inserte"
              type="text"
              :required="hasRecorded"
              :disabled="!hasRecorded || isGravedividend"
              :rules="[
                (v) =>
                  useRules().is_required(
                    v,
                    'El valor impuesto moneda local es requerido'
                  ),
                (v) =>
                  useRules().only_number_with_max_integers_and_decimals(
                    v,
                    15,
                    2
                  ),
              ]"
            />
            <div class="text-black-90" v-else>
              <p
                id="lbl-tax_value_local_currency"
                class="text-weight-bold no-margin"
              >
                Valor impuesto moneda local
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-tax_value_local_currency"
              >
                {{
                  useUtils().formatCurrencyString(
                    formData.tax_value_local_currency
                  ) || '-'
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.dividend_value_after_tax"
              label="Valor dividendo moneda origen después de impuesto"
              :disabled="!hasRecorded || isGravedividend"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
                (v) =>
                  useRules().is_required(
                    v,
                    'El valor dividendo moneda origen después de impuesto es requerido'
                  ),
                (v) =>
                  useRules().only_number_with_max_integers_and_decimals(
                    v,
                    15,
                    2
                  ),
              ]"
              @update:modelValue="formData.dividend_value_after_tax = $event"
            />
            <div class="text-black-90" v-else>
              <p
                id="lbl-dividend_value_after_tax"
                class="text-weight-bold no-margin"
              >
                Valor dividendo moneda origen después de impuesto
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-dividend_value_after_tax"
              >
                {{
                  useUtils().formatCurrencyString(
                    formData.dividend_value_after_tax
                  ) || '-'
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.dividend_value_local_currency_after_tax"
              label="Valor dividendo moneda local después de impuesto"
              :disabled="!hasRecorded || isGravedividend"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
                (v) =>
                  useRules().is_required(
                    v,
                    'El valor dividendo moneda local después de impuesto es requerido'
                  ),
                (v) =>
                  useRules().only_number_with_max_integers_and_decimals(
                    v,
                    15,
                    2
                  ),
              ]"
              @update:modelValue="
                formData.dividend_value_local_currency_after_tax = $event
              "
            />
            <div class="text-black-90" v-else>
              <p
                id="lbl-dividend_value_local_currency_after_tax"
                class="text-weight-bold no-margin"
              >
                Valor dividendo moneda local después de impuesto
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-dividend_value_local_currency_after_tax"
              >
                {{
                  useUtils().formatCurrencyString(
                    formData.dividend_value_local_currency_after_tax
                  ) || '-'
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.enforceability_value"
              label="Valor exigibilidad moneda origen"
              :disabled="!hasRecorded || isGravedividend"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
              (v: string) => useRules().is_required(v, 'El valor exigibilidad moneda origen es requerido'),
              (v: string) => useRules().only_number_with_max_integers_and_decimals(v, 15, 2),
            ]"
              @update:modelValue="formData.enforceability_value = $event"
            />
            <div class="text-black-90" v-else>
              <p
                id="lbl-enforceability_value"
                class="text-weight-bold no-margin"
              >
                Valor exigibilidad moneda origen
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-enforceability_value"
              >
                {{
                  useUtils().formatCurrencyString(
                    formData.enforceability_value
                  ) || '-'
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.demand_value_local_currency"
              label="Valor exigibilidad moneda local"
              :disabled="!hasRecorded || isGravedividend"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
              (v: string) => useRules().is_required(v, 'El valor exigibilidad moneda local es requerido'),
              (v: string) => useRules().only_number_with_max_integers_and_decimals(v, 15, 2),
            ]"
            />
            <div class="text-black-90" v-else>
              <p
                id="lbl-demand_value_local_currency"
                class="text-weight-bold no-margin"
              >
                Valor exigibilidad moneda local
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-demand_value_local_currency"
              >
                {{
                  useUtils().formatCurrencyString(
                    formData.demand_value_local_currency
                  ) || '-'
                }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-12">
          <q-separator :class="isView ? 'q-my-md' : 'q-mt-md q-mb-lg'" />
        </div>

        <div
          class="row col-12 q-col-gutter-x-md q-col-gutter-y-sm"
          v-if="isView"
        >
          <div class="col-12">
            <p class="text-weight-bold text-h6" aria-level="2" role="heading">
              Historial de cambios
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold no-margin">Fecha de creación</p>
            <p class="text-weight-medium no-margin">
              {{ createDate }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-creator_data" class="text-weight-bold no-margin">
              Creado por
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-creator_data"
            >
              {{ creatorData }}
            </p>
          </div>

          <div class="col-12">
            <q-separator class="q-my-md" />
          </div>
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

import { IEmitterDividend } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IEmitterDividend
  }>(),
  {}
)

const {
  isView,
  formData,
  hasRecorded,
  creatorData,
  createDate,
  isExDividend,
  selectOptions,
  informationFormRef,
  isGravedividend,
} = useInformationForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
