<template>
  <q-form ref="informationFormRef">
    <section aria-label="Datos básicos">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isViewMode && !isEdit"
            :default_value="formData.user"
            label="Usuario"
            disabled
            :rules="[]"
            :required="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Usuario</p>
            <p class="text-weight-medium no-margin">
              {{ formData.user ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="!isViewMode && !isEdit"
            :default_value="formData.operation_date"
            label="Fecha de operación"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            :required="true"
            :rules="[]"
            @update:model-value="formData.operation_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isViewMode && !isEdit"
            :default_value="formData.investment_portfolio_id"
            label="Código portafolio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.investment_portfolio"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'El código de portafolio es obligatorio'
                ),
            ]"
            @update:model-value="formData.investment_portfolio_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ formData.investment_portfolio_id ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isViewMode && !isEdit"
            :key="formData.description_portfolio_name"
            :default_value="formData.description_portfolio_name"
            label="Descripción portafolio"
            disabled
            required
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ formData.description_portfolio_name ?? '-' }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="action === 'view'"
        class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md"
      >
        <div class="col-12 col-md-3">
          <p class="text-grey-10 text-body2 text-weight-bold q-mb-xs">Estado</p>
          <div>{{ formData.status || '-' }}</div>
        </div>

        <div class="col-12 col-md-3">
          <p class="text-grey-10 text-body2 text-weight-bold q-mb-xs">
            Número de título
          </p>
          <div>{{ formData.title_number || '-' }}</div>
        </div>

        <div class="col-12 col-md-3">
          <p class="text-grey-10 text-body2 text-weight-bold q-mb-xs">
            Número de operación
          </p>
          <div>{{ formData.operation_number || '-' }}</div>
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <p class="text-subtitle2 text-bold q-mb-xs">Información de operación</p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          TTV’s *
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.ttv_type"
            label="TTV’s *"
            :options="TTV_TYPE_OPTIONS"
            required
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe seleccionar el tipo de TTV'),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin"></p>
            <p class="text-weight-medium no-margin">
              {{ formData.ttv_type ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          Posición *
          <RadioYesNo
            v-if="action !== 'view'"
            v-model="formData.position"
            label="Posición *"
            :options="POSITION_TTV_OPTIONS"
            required
            :rules="[
              (v) => useRules().is_required(v, 'Debe seleccionar una posición'),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin"></p>
            <p class="text-weight-medium no-margin">
              {{ formData.position ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            :default_value="formData.paper_type_id"
            label="Papel"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.paper"
            :rules="[
              (v) => useRules().is_required(v, 'Debe seleccionar un papel'),
            ]"
            @update:model-value="formData.paper_type_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Papel</p>
            <p class="text-weight-medium no-margin">
              {{ formData.paper_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            :default_value="formData.operation_type_id"
            label="Tipo operación"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.operation_type"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe seleccionar un tipo de operación'
                ),
            ]"
            @update:model-value="formData.operation_type_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_type_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="action !== 'view'"
            :default_value="formData.operation_date"
            label="Fecha inicio"
            mask="YYYY-MM-DD"
            disabled
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha inicio</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.number_days"
            label="Número días"
            placeholder="Inserte"
            type="number"
            required
            :hideIcon="true"
            :rules="[
      (v: string) => useRules().is_required(v, 'Debe ingresar el número de días'),
      (v: string) => useRules().only_number(v),
      (v: string) => useRules().only_positive_number(v),
      (v: string) => useRules().max_value(v, 365),
      (v: string) => useRules().min_value(v, 1),
      (v: string) => useRules().max_length(v, 3),
    ]"
            @update:modelValue="formData.number_days = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número días</p>
            <p class="text-weight-medium no-margin">
              {{ formData.number_days ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="action !== 'view'"
            :default_value="formData.end_date"
            label="Fecha fin"
            mask="YYYY-MM-DD"
            :disabled="true"
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha fin</p>
            <p class="text-weight-medium no-margin">
              {{ formData.end_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            :default_value="formData.counterparty_id"
            label="Contraparte"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.counterparty"
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe seleccionar una contraparte'),
            ]"
            @update:model-value="formData.counterparty_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Contraparte</p>
            <p class="text-weight-medium no-margin">
              {{ formData.counterparty_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="'COP'"
            label="Moneda"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda</p>
            <p class="text-weight-medium no-margin">COP</p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.currency_value"
            label="Valor moneda"
            placeholder="Inserte"
            currency="COP"
            required
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe ingresar el valor de la moneda'
                ),
            ]"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor moneda</p>
            <p class="text-weight-medium no-margin">
              {{ formData.currency_value ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.folio"
            label="Folio"
            placeholder="Inserte"
            type="number"
            :rules="[
      (v: string) => useRules().is_required(v, 'Debe ingresar un folio'),
      (v: string) => useRules().only_number(v),
      (v: string) => useRules().only_positive_number(v),
      (v: string) => useRules().max_length(v, 5),
    ]"
            :hideIcon="true"
            required
            @update:modelValue="formData.folio = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Folio</p>
            <p class="text-weight-medium no-margin">
              {{ formData.folio ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            :default_value="formData.compensation_system"
            label="Sistema compensación"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.compensation_systems"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe seleccionar un sistema de compensación'
                ),
            ]"
            @update:model-value="formData.compensation_system = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Sistema compensación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.compensation_system ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.negotiation_value"
            label="Valor negociación TTV"
            placeholder="Inserte"
            currency="COP"
            required
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe ingresar el valor de negociación TTV'
                ),
            ]"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor negociación TTV</p>
            <p class="text-weight-medium no-margin">
              {{ formData.negotiation_value ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.nominal_delivered"
            label="Valor nominal título entregado"
            placeholder="Inserte"
            currency="COP"
            required
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe ingresar el valor nominal título entregado'
                ),
            ]"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Valor nominal título entregado
            </p>
            <p class="text-weight-medium no-margin">
              {{ formData.nominal_delivered ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.market_delivered"
            label="Valor mercado título entregado"
            placeholder="Inserte"
            currency="COP"
            required
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe ingresar el valor mercado título entregado'
                ),
            ]"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Valor mercado título entregado
            </p>
            <p class="text-weight-medium no-margin">
              {{ formData.market_delivered ?? '-' }}
            </p>
          </div>
        </div>

        <div
          class="col-12 col-md-3"
          v-if="formData.ttv_type === 'Valores contra valores'"
        >
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.nominal_received"
            label="Valor nominal título recibido"
            placeholder="Inserte"
            currency="COP"
            required
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe ingresar el valor nominal título recibido'
                ),
            ]"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Valor nominal título recibido
            </p>
            <p class="text-weight-medium no-margin">
              {{ formData.nominal_received ?? '-' }}
            </p>
          </div>
        </div>

        <div
          class="col-12 col-md-3"
          v-if="formData.ttv_type === 'Valores contra valores'"
        >
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.market_received"
            label="Valor mercado título recibido"
            placeholder="Inserte"
            currency="COP"
            required
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe ingresar el valor mercado título recibido'
                ),
            ]"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Valor mercado título recibido
            </p>
            <p class="text-weight-medium no-margin">
              {{ formData.market_received ?? '-' }}
            </p>
          </div>
        </div>

        <div
          class="col-12 col-md-3"
          v-if="formData.ttv_type === 'Valores contra dinero'"
        >
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.money_value"
            label="Valor dinero"
            placeholder="Inserte"
            currency="COP"
            required
            :rules="[
              (v) => useRules().is_required(v, 'Debe ingresar el valor dinero'),
            ]"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor dinero</p>
            <p class="text-weight-medium no-margin">
              {{ formData.money_value ?? '-' }}
            </p>
          </div>
        </div>

        <div
          class="col-12 col-md-3"
          v-if="formData.ttv_type === 'Valores contra dinero'"
        >
          <template v-if="action !== 'view'">
            <p class="text-grey-8 text-body2 text-weight-medium no-margin">
              Rendimiento dinero
            </p>
            <RadioYesNo
              v-model="formData.money_yield"
              label="Rendimiento dinero"
              :options="MONEY_YIELD_OPTIONS"
            />
          </template>

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Rendimiento dinero</p>
            <p class="text-weight-medium no-margin">
              {{ formData.money_yield ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div
          class="col-12 col-md-3"
          v-if="
            formData.ttv_type === 'Valores contra dinero' &&
            formData.money_yield
          "
        >
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.yield_percentage"
            label="Porcentaje rendimiento"
            placeholder="Inserte"
            currency="COP"
            required
            :rules="[
      (v) =>
        useRules().is_required(
          v,
          'Debe ingresar el porcentaje rendimiento'
        ),
      (v: string) => useRules().max_value(v.replace(',', '.'), 100),
      (v: string) => useRules().min_value(v.replace(',', '.'), 0),
      (v: string) => useRules().only_positive_number(v.replace(',', '.')),
    ]"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Porcentaje rendimiento</p>
            <p class="text-weight-medium no-margin">
              {{ formData.yield_percentage ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.yield_value"
            label="Valor rendimiento"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor rendimiento</p>
            <p class="text-weight-medium no-margin">
              {{
                formData.yield_value === null ||
                formData.yield_value === undefined
                  ? '-'
                  : Number(formData.yield_value).toFixed(2)
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <template v-if="action !== 'view'">
            <p class="text-grey-8 text-body2 text-weight-medium no-margin">
              Base comisión *
            </p>
            <RadioYesNo
              v-model="formData.comission_base"
              label="Base comisión"
              :options="COMMISSION_BASE_OPTIONS"
              required
              :rules="[
                (v) =>
                  useRules().is_required(
                    v,
                    'Debe seleccionar una base de comisión'
                  ),
              ]"
            />
          </template>

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin"></p>
            <p class="text-weight-medium no-margin">
              {{ formData.comission_base ?? '-' }}
            </p>
          </div>
        </div>

        <div
          class="col-12 col-md-3"
          v-if="
            formData.comission_base === 'Valor fijo' ||
            formData.comission_base === 'Porcentaje'
          "
        >
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.commission_value"
            label="Valor"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
      (v: string) =>
        useRules().is_required(v, 'Debe ingresar el valor'),
      ...(formData.comission_base === 'Porcentaje'
        ? [
            (v: string) => useRules().max_value(v.replace(',', '.'), 100),
            (v: string) => useRules().min_value(v.replace(',', '.'), 0),
            (v: string) => useRules().only_positive_number(v.replace(',', '.')),
          ]
        : []),
    ]"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor</p>
            <p class="text-weight-medium no-margin">
              {{ formData.commission_value ?? '-' }}
            </p>
          </div>
        </div>

        <div
          class="col-12 col-md-3"
          v-if="
            formData.comission_base === 'Valor fijo' ||
            formData.comission_base === 'Porcentaje'
          "
        >
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.commission_result"
            label="Valor comisión"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor comisión</p>
            <p class="text-weight-medium no-margin">
              {{ formData.commission_result ?? '-' }}
            </p>
          </div>
        </div>

        <div
          class="col-12 col-md-3"
          v-if="
            formData.comission_base === 'Valor fijo' ||
            formData.comission_base === 'Porcentaje'
          "
        >
          <template v-if="action !== 'view'">
            <p class="text-grey-8 text-body2 text-weight-medium no-margin">
              Modalidad comisión *
            </p>
            <RadioYesNo
              v-model="formData.commission_modality"
              label="Modalidad comisión"
              :options="COMMISSION_MODALITY_OPTIONS"
              required
              :rules="[
                (v) =>
                  useRules().is_required(
                    v,
                    'Debe seleccionar una modalidad de comisión'
                  ),
              ]"
            />
          </template>

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Modalidad comisión</p>
            <p class="text-weight-medium no-margin">
              {{ formData.commission_modality ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            :default_value="formData.return_value"
            label="Valor regreso"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor regreso</p>
            <p class="text-weight-medium no-margin">
              {{ formData.return_value ?? '-' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator class="q-my-lg" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import useTtvInformationForm from './InformationForm'
import { ActionType } from '@/interfaces/global'
import { ITtvInformationFormData } from '@/interfaces/customs'
import {
  TTV_TYPE_OPTIONS,
  POSITION_TTV_OPTIONS,
  MONEY_YIELD_OPTIONS,
  COMMISSION_BASE_OPTIONS,
  COMMISSION_MODALITY_OPTIONS,
} from '@/constants'
import { useRules } from '@/composables'

const props = defineProps<{
  action: ActionType
  data?: ITtvInformationFormData
}>()

const {
  isViewMode,
  isEdit,
  formData,
  selectOptions,
  informationFormRef,
  resetForm,
} = useTtvInformationForm(props)

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
