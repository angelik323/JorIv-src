<template>
  <q-form
    ref="formElementRef"
    aria-label="Formulario de datos básicos para tipo de papel"
  >
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.code"
            label="Código"
            required
            :rules="[
              (val: string) => is_required(val, 'El código es requerido'),
              (val: string) => max_length(val, 10),
            ]"
            @update:model-value="models.code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código</p>
            <p class="text-weight-medium no-margin">
              {{ models.code || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.description"
            label="Descripción"
            required
            :rules="[
              (val: string) => is_required(val, 'La descripción es requerida'),
              (val: string) => max_length(val, 50),
            ]"
            @update:model-value="models.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.description || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.currency"
            label="Moneda"
            auto_complete
            map_options
            :manual_option="coins"
            required
            :rules="[
              (val: string) => is_required(val, 'La moneda es requerida'),
            ]"
            @update:modelValue="models.currency = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda</p>
            <p class="text-weight-medium no-margin">
              {{ models.currency || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black text-weight-bold text-h6 q-mb-none">Inversiones</p>
      </div>

      <div class="row q-col-gutter-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.investment_type"
            label="Tipo de inversión"
            auto_complete
            map_options
            :manual_option="inversion_types"
            required
            :rules="[
              (val: string) => is_required(val, 'El Tipo de inversión es requerido'),
            ]"
            @update:model-value="models.investment_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ models.investment_type || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.investment_class"
            label="Clase de inversión"
            auto_complete
            map_options
            :manual_option="class_investment"
            required
            :rules="[
              (val: string) => is_required(val, 'La clase de inversión es requerida'),
            ]"
            @update:model-value="models.investment_class = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Clase de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ models.investment_class || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black text-weight-bold text-h6 q-mb-none">Tasas</p>
      </div>

      <div class="row q-col-gutter-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.rate_type"
            label="Tipo tasa"
            auto_complete
            map_options
            :manual_option="RATE_TYPE_OPTIONS"
            :required="isRateRequired"
            :disabled="!isRateRequired"
            :rules="[
              (val: string) => is_required(val, 'El tipo tasa es requerido'),
            ]"
            @update:model-value="models.rate_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo tasa</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_type || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.rate_class"
            label="Clase tasa"
            auto_complete
            map_options
            :manual_option="RATE_CLASS_OPTIONS"
            :required="isRateRequired"
            :disabled="!isRateRequired"
            :rules="[
              (val: string) => is_required(val, 'La clase tasa es requerida'),
            ]"
            @update:model-value="models.rate_class = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Clase tasa</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_class || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.rate"
            label="Tasa"
            auto_complete
            map_options
            :manual_option="interest_rates_code_as_value"
            :required="isRateRequired && models.rate_type === 'Variable'"
            :disabled="!isRateRequired || models.rate_type !== 'Variable'"
            :rules="[
              (val: string) => is_required(val, 'La tasa es requerida'),
            ]"
            @update:model-value="models.rate = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tasa</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.rate_mode"
            label="Modalidad de tasa"
            auto_complete
            map_options
            :manual_option="RATE_MODE_OPTIONS"
            :required="isRateRequired"
            :disabled="!isRateRequired"
            :rules="[
              (val: string) => is_required(val, 'La modalidad de tasa es requerida'),
            ]"
            @update:model-value="models.rate_mode = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Modalidad de tasa</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_mode || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black text-weight-bold text-h6 q-mb-none">Flujos</p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.base_flow_rate"
            label="Base tasa flujo"
            auto_complete
            map_options
            :manual_option="FLOW_RATE_BASE_OPTIONS"
            :required="isRateRequired"
            :disabled="!isRateRequired"
            :rules="[
              (val: string) => is_required(val, 'La base tasa flujo es requerida'),
            ]"
            @update:model-value="models.base_flow_rate = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Base tasa flujo</p>
            <p class="text-weight-medium no-margin">
              {{ models.base_flow_rate || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.flow_type"
            label="Tipo flujo"
            auto_complete
            map_options
            :manual_option="FLOW_TYPE_OPTIONS"
            :required="isRateRequired"
            :disabled="!isRateRequired"
            :rules="[
              (val: string) => is_required(val, 'El tipo flujo es requerido'),
            ]"
            @update:model-value="models.flow_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo flujo</p>
            <p class="text-weight-medium no-margin">
              {{ models.flow_type || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.payment_flow"
            label="Pago flujo"
            auto_complete
            map_options
            :manual_option="PAYMENT_FLOW_OPTIONS"
            :required="isRateRequired"
            :disabled="!isRateRequired"
            :rules="[
              (val: string) => is_required(val, 'El pago flujo es requerido'),
            ]"
            @update:model-value="models.payment_flow = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Pago flujo</p>
            <p class="text-weight-medium no-margin">
              {{ models.payment_flow || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div
            v-if="['create', 'edit'].includes(action)"
            class="row items-center q-gutter-sm full-width"
          >
            <div class="col grow">
              <GenericSelectorComponent
                :default_value="models.amortization_type"
                label="Tipo amortización"
                auto_complete
                map_options
                :manual_option="AMORTIZATION_TYPE_OPTIONS"
                :required="isRateRequired && !!models.hasAmortization"
                :disabled="!isRateRequired || !models.hasAmortization"
                :rules="[
                  (val: string) => isRateRequired ? is_required(val) : true,
                ]"
                @update:model-value="models.amortization_type = $event"
              />
            </div>

            <div class="col-auto">
              <q-toggle
                v-model="models.hasAmortization"
                color="orange"
                :disable="!isRateRequired"
              />
            </div>
          </div>
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo amortización</p>
            <p class="text-weight-medium no-margin">
              {{ models.amortization_type || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
    </section>

    <section v-if="action === 'view'" class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black text-weight-bold text-h6 q-mb-none">
          Historial del tipo de papel
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de creación</p>
            <p class="text-weight-medium no-margin">
              {{
                models.created_at
                  ? new Date(
                      models.created_at.replace(/-/g, '/')
                    ).toLocaleDateString()
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Creado por</p>
            <p class="text-weight-medium no-margin">
              {{ models.creator_data || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-lg" />
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import { NonEditActionType } from '@/interfaces/global'
import { IPaperTypeInformationForm } from '@/interfaces/customs/investment-portfolio/TypePaper'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: NonEditActionType
    data: IPaperTypeInformationForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IPaperTypeInformationForm | null): void
}>()

const { is_required, max_length } = useRules()

const {
  inversion_types,
  class_investment,
  interest_rates_code_as_value,
  coins,
  RATE_TYPE_OPTIONS,
  RATE_CLASS_OPTIONS,
  RATE_MODE_OPTIONS,
  FLOW_RATE_BASE_OPTIONS,
  FLOW_TYPE_OPTIONS,
  PAYMENT_FLOW_OPTIONS,
  AMORTIZATION_TYPE_OPTIONS,
  formElementRef,
  models,
  isRateRequired,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
