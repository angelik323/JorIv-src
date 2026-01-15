<template>
  <q-form ref="informationFormRef">
    <section aria-label="Datos básicos">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.user"
            label="Usuario"
            :rules="[]"
            disabled
            :required="false"
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
            v-if="['create', 'edit'].includes(action)"
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
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.investment_portfolio_id"
            label="Código portafolio"
            placeholder="Seleccione"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe seleccionar un código de portafolio'
                ),
            ]"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.investment_portfolio"
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
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.description_portfolio_name"
            label="Descripción portafolio"
            disabled
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
          Simultánea *
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.position"
            label="Simultánea *"
            :options="POSITION_OPTIONS"
            :required="true"
            :rules="[
              (v) => useRules().is_required(v, 'Debe seleccionar una posición'),
            ]"
            @update:model-value="emit('update:position', $event)"
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
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.paper_id"
            label="Papel"
            placeholder="Seleccione"
            :rules="[
              (v) => useRules().is_required(v, 'Debe seleccionar un papel'),
            ]"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.paper"
            @update:model-value="formData.paper_id = $event"
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
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.operation_type_id"
            label="Tipo de operación"
            placeholder="Seleccione"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe seleccionar un tipo de operación'
                ),
            ]"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.operation_type"
            @update:model-value="formData.operation_type_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_type_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.start_date"
            label="Fecha inicio"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe seleccionar una fecha de inicio'
                ),
            ]"
            mask="YYYY-MM-DD"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha inicio</p>
            <p class="text-weight-medium no-margin">
              {{ formData.start_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.days_number"
            label="Número días"
            placeholder="Inserte"
            type="number"
            :rules="[
      (v: string) => useRules().is_required(v, 'Debe ingresar el número de días'),
      (v: string) => useRules().only_number(v),
      (v: string) => useRules().max_value(v, 365),
      (v: string) => useRules().min_value(v, 1),
      (v: string) => useRules().max_length(v, 3),
    ]"
            :hideIcon="true"
            required
            @update:modelValue="formData.days_number = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número días</p>
            <p class="text-weight-medium no-margin">
              {{ formData.days_number ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.end_date"
            label="Fecha fin"
            :rules="[]"
            mask="YYYY-MM-DD"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha fin</p>
            <p class="text-weight-medium no-margin">
              {{ formData.end_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.rate_value"
            label="Tasa pactada"
            placeholder="Inserte"
            :rules="[
              (v) => useRules().is_required(v, 'Debe ingresar la tasa pactada'),
            ]"
            :hideIcon="true"
            required
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tasa pactada</p>
            <p class="text-weight-medium no-margin">
              {{ formData.rate_value ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          Clase tasa *
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.rate_class"
            label="Clase tasa *"
            :options="RATE_CLASS_OPTIONS"
            required
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe ingresar la clase de tasa'),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin"></p>
            <p class="text-weight-medium no-margin">
              {{ formData.rate_class ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          Base días *
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.days_base"
            label="Base días *"
            :options="DAYS_BASE_OPTIONS"
            required
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe seleccionar una base de días'),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin"></p>
            <p class="text-weight-medium no-margin">
              {{ formData.days_base ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.nominal_value"
            label="Valor nominal"
            placeholder="Inserte"
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe seleccionar un valor nominal'),
            ]"
            :hideIcon="true"
            required
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor nominal</p>
            <p class="text-weight-medium no-margin">
              {{ formData.nominal_value ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
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
            v-if="['create', 'edit'].includes(action)"
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
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
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
            v-if="['create', 'edit'].includes(action)"
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
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.warranty_value"
            label="Valor garantía"
            placeholder="Inserte"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'Debe ingresar el valor de la garantía'
                ),
            ]"
            :hideIcon="true"
            required
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor garantía</p>
            <p class="text-weight-medium no-margin">
              {{ formData.warranty_value ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.warranty_percentage"
            label="Porcentaje garantía"
            placeholder="Inserte"
            type="text"
            :rules="[
      (v: string) =>
        useRules().is_required(v, 'Debe ingresar el porcentaje de la garantía'),
      (v: string) => useRules().max_value(v.replace(',', '.'), 100),
      (v: string) => useRules().min_value(v.replace(',', '.'), 0),
      (v: string) => useRules().only_positive_number(v.replace(',', '.')),
    ]"
            :hideIcon="true"
            required
            @update:modelValue="formData.warranty_percentage = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Porcentaje garantía</p>
            <p class="text-weight-medium no-margin">
              {{ formData.warranty_percentage ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
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
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import useSimultaneousInformationForm from './InformationForm'
import { ActionType } from '@/interfaces/global'
import { ISimultaneousInformationForm } from '@/interfaces/customs'
import {
  RATE_CLASS_OPTIONS,
  POSITION_OPTIONS,
  DAYS_BASE_OPTIONS,
} from '@/constants'
import { useRules } from '@/composables'

const props = defineProps<{
  action: ActionType
  data?: ISimultaneousInformationForm
}>()

const emit = defineEmits<{
  (e: 'update:position', value: 'Activa' | 'Pasiva'): void
}>()

const { formData, resetForm, selectOptions, informationFormRef } =
  useSimultaneousInformationForm(props)

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
