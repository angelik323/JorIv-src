<template>
  <q-form ref="informationFormRef">
    <section aria-label="Datos básicos">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.user"
            label="Usuario"
            disabled
            required
            :rules="[]"
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
            placeholder="AAAA-MM-DD"
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
            auto_complete
            map_options
            required
            :manual_option="selectOptions.investment_portfolio"
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe seleccionar un portafolio'),
            ]"
            @update:model-value="formData.investment_portfolio_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ formData.portfolio_code ?? '-' }}
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
          Tipo repo*
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.repo_type"
            :options="REPO_TYPE_OPTIONS"
            label="Tipo de repo*"
            required
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe seleccionar un tipo de repo'),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin"></p>
            <p class="text-weight-medium no-margin">
              {{ formData.repo_type ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          Repo*
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.repo"
            :options="REPO_POSITION_OPTIONS"
            label="Repo*"
            required
            :rules="[
              (v) => useRules().is_required(v, 'Debe seleccionar un repo'),
            ]"
            @update:model-value="emit('update:position', $event)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin"></p>
            <p class="text-weight-medium no-margin">
              {{ formData.repo ?? '-' }}
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
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.start_date"
            label="Fecha inicio"
            mask="YYYY-MM-DD"
            :rules="[]"
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
      (v: string) => useRules().only_positive_number(v),
      (v: string) => useRules().max_value(v, 365),
      (v: string) => useRules().min_value(v, 1),
      (v: string) => useRules().max_length(v, 3)
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
            mask="YYYY-MM-DD"
            :rules="[]"
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
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.rate_value"
            label="Tasa pactada"
            type="text"
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe ingresar una tasa pactada'),
            ]"
            @update:model-value="formData.rate_value = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tasa pactada</p>
            <p class="text-weight-medium no-margin">
              {{ formData.rate_value ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          Clase tasa*
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.rate_class"
            :options="RATE_CLASS_OPTIONS"
            label="Clase tasa*"
            required
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe seleccionar una clase de tasa'),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Clase tasa</p>
            <p class="text-weight-medium no-margin">
              {{ formData.rate_class ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          Base días*
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.days_base"
            :options="DAYS_BASE_OPTIONS"
            label="Base días*"
            required
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe seleccionar una base de días'),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Base días</p>
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
            currency="COP"
            :hideIcon="true"
            required
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe ingresar un valor nominal'),
            ]"
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
            <p class="text-weight-medium no-margin">
              {{ formData.currency_id ?? 'COP' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="formData.folio"
            label="Folio"
            placeholder="Inserte"
            type="number"
            :hideIcon="true"
            required
            :rules="[
      (v: string) => useRules().is_required(v, 'Debe ingresar un folio'),
      (v: string) => useRules().only_number(v),
      (v: string) => useRules().only_positive_number(v),
      (v: string) => useRules().max_length(v, 5)
    ]"
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
            currency="COP"
            :hideIcon="true"
            required
            :rules="[
              (v) =>
                useRules().is_required(v, 'Debe ingresar un valor garantía'),
            ]"
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
            suffix="%"
            :hideIcon="true"
            required
            :rules="[
      (v: string) => useRules().is_required(v, 'Debe ingresar el porcentaje de la garantía'),
      (v: string) => useRules().max_value(v.replace(',', '.'), 100),
      (v: string) => useRules().min_value(v.replace(',', '.'), 0),
      (v: string) => useRules().only_positive_number(v.replace(',', '.'))
    ]"
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
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="formData.return_value"
            label="Valor regreso"
            currency="COP"
            :hideIcon="true"
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
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import useRepoInformationForm from './InformationForm'
import { ActionType } from '@/interfaces/global'
import { IRepoInformationForm } from '@/interfaces/customs'
import { useRules } from '@/composables'
import {
  REPO_TYPE_OPTIONS,
  REPO_POSITION_OPTIONS,
  RATE_CLASS_OPTIONS,
  DAYS_BASE_OPTIONS,
} from '@/constants'

const emit = defineEmits(['update:position'])

const props = defineProps<{ action: ActionType; data?: IRepoInformationForm }>()

const { informationFormRef, formData, selectOptions, resetForm } =
  useRepoInformationForm(props)

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
