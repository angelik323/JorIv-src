<template>
  <q-form ref="informationFormRef" class="q-pa-lg">
    <section>
      <div
        class="row q-col-gutter-x-lg"
        :class="isView ? 'q-col-gutter-y-lg' : 'q-col-gutter-y-sm'"
      >
        <p class="col-12 text-black-10 text-weight-bold text-h6">
          {{ isView ? 'Datos básicos' : 'Información básica' }}
        </p>

        <div class="col-12 col-md-4">
          <template v-if="isView">
            <p class="q-mb-none text-black-10 text-weight-bold">Código fondo</p>
            <p class="mb-0 text-grey-9">
              {{ formData.fund_code || '-' }}
            </p>
          </template>
          <GenericInputComponent
            v-if="isEditable"
            :default_value="formData.fund_code"
            label="Código fondo"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El código es requerido'),
              (val: string) => useRules().min_length(val, 1),
              (val: string) => useRules().max_length(val, 4),
              (val: string) => useRules().only_number(val),
            ]"
            :disabled="isDisabled"
            @update:blur="validateFundCode"
            @update:model-value="formData.fund_code = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <template v-if="isView">
            <p class="q-mb-none text-black-10 text-weight-bold">
              Nombre de fondo
            </p>
            <p class="mb-0 text-grey-9">
              {{ formData.fund_name || '-' }}
            </p>
          </template>
          <GenericInputComponent
            v-if="isEditable"
            :default_value="formData.fund_name"
            label="Nombre de fondo"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El nombre es requerido'),
              (val: string) => useRules().only_alphanumeric(val),
              (val: string) => useRules().max_length(val, 150),
              (val: string) => useRules().min_length(val, 2),
            ]"
            @update:model-value="formData.fund_name = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <template v-if="isView">
            <p class="q-mb-none text-black-10 text-weight-bold">Negocio</p>
            <p class="mb-0 text-grey-9">
              {{
                business?.find(
                  (opt) => opt.value === formData.business_trust_id
                )?.label || '-'
              }}
            </p>
          </template>
          <GenericSelectorComponent
            v-if="isEditable"
            :key="businessSelectorKey"
            :default_value="formData.business_trust_id"
            label="Negocio"
            placeholder="Seleccione"
            map_options
            required
            :manual_option="business"
            :rules="[
              (val: string) => useRules().is_required(val, 'El negocio es requerido'),
            ]"
            :disabled="isDisabled"
            @update:modelValue="validateBusinessId"
          />
        </div>

        <div class="col-12" :class="isDisabled ? 'col-md-3' : 'col-md-4'">
          <template v-if="isView">
            <p class="q-mb-none text-black-10 text-weight-bold">
              Tipo de fondo
            </p>
            <p class="mb-0 text-grey-9">
              {{
                select_options['fund_type']?.find(
                  (opt) => opt.value === formData.fund_type_id
                )?.label || '-'
              }}
            </p>
          </template>
          <GenericSelectorComponent
            v-if="isEditable"
            :default_value="formData.fund_type_id"
            label="Tipo de fondo"
            placeholder="Seleccione"
            map_options
            required
            :manual_option="select_options['fund_type']"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El tipo de fondo es requerido'),
            ]"
            :disabled="isDisabled"
            @update:modelValue="handleFundTypeChange"
          />
        </div>

        <div class="col-12" :class="isDisabled ? 'col-md-3' : 'col-md-4'">
          <template v-if="isView">
            <p class="q-mb-none text-black-10 text-weight-bold">
              Opción consolidadora
            </p>
            <p class="mb-0 text-grey-9">
              {{ formData.consolidation_option_code || '-' }}
            </p>
          </template>
          <GenericSelectorComponent
            v-if="isEditable"
            :default_value="formData.consolidation_option_id"
            label="Opción consolidadora"
            placeholder="Seleccione"
            map_options
            required
            :manual_option="consolidation_options"
            :rules="[
              (val: string) => useRules().is_required(val, 'La opción consolidadora es requerida'),
            ]"
            :disabled="isDisabled"
            @update:modelValue="formData.consolidation_option_id = $event"
          />
        </div>

        <div
          class="col-12"
          :class="isDisabled ? 'col-md-3' : 'col-md-4'"
          v-if="isDisabled || isView"
        >
          <template v-if="isView">
            <p class="q-mb-none text-black-10 text-weight-bold">
              Último cierre
            </p>
            <p class="mb-0 text-grey-9">
              {{ formData.last_closing_date || '-' }}
            </p>
          </template>
          <GenericDateInputComponent
            v-if="isEditable"
            :default_value="formData.last_closing_date"
            label="Último cierre"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            :required="false"
            :rules="[]"
            disabled
          />
        </div>

        <div class="col-12" :class="isDisabled ? 'col-md-3' : 'col-md-4'">
          <template v-if="isView">
            <p class="q-mb-none text-black-10 text-weight-bold">
              Calificación FIC
            </p>
            <p class="mb-0 text-grey-9">
              {{ formData.fic_rating || '-' }}
            </p>
          </template>
          <GenericInputComponent
            v-if="isEditable"
            :default_value="formData.fic_rating"
            label="Calificación FIC"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'La calificación FIC es requerida'),
              (val: string) => useRules().max_length(val, 10),
              (val: string) => useRules().min_length(val, 1),
            ]"
            @update:model-value="formData.fic_rating = $event"
          />
        </div>

        <div class="col-12 col-md-4" v-if="isView">
          <p class="q-mb-none text-black-10 text-weight-bold">
            Maneja tipo de participación
          </p>
          <p class="mb-0 text-grey-9">
            {{
              formData?.has_participation_types === true
                ? 'Sí'
                : formData?.has_participation_types === false
                ? 'No'
                : '-'
            }}
          </p>
        </div>

        <div class="col-12 col-md-4" v-if="isView">
          <p class="q-mb-none text-black-10 text-weight-bold">
            Validación fondo
          </p>
          <p class="mb-0 text-grey-9">
            {{
              formData?.is_fund_validated === true
                ? 'Sí'
                : formData?.is_fund_validated === false
                ? 'No'
                : '-'
            }}
          </p>
        </div>
      </div>

      <div
        class="row col-12 items-center justify-between q-px-md"
        v-if="!isView"
      >
        <p class="q-mb-none mt-1 text-weight-medium">
          Maneja tipo de participación
        </p>
        <RadioYesNo
          v-model="formData.has_participation_types"
          class="q-mt-none"
          :titleRadioTrue="'Sí'"
          :titleRadioFalse="'No'"
          :is-disabled="participationHandlingDisabled || isDisabled"
          @update:modelValue="formData.has_participation_types = $event"
        />
      </div>

      <q-separator v-if="isEditable" class="q-my-lg" />

      <div
        class="row col-12 items-center justify-between q-px-md"
        v-if="!isView"
      >
        <p class="q-mb-none mt-1 text-weight-medium">Validación fondo</p>
        <RadioYesNo
          v-model="formData.is_fund_validated"
          class="q-mt-none"
          :titleRadioTrue="'Sí'"
          :titleRadioFalse="'No'"
          @update:modelValue="formData.is_fund_validated = $event"
          aria-label="Selector de validación del fondo"
        />
      </div>

      <q-separator :class="isView ? 'q-mt-lg' : 'q-my-lg'" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useInformationForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: {}
  }>(),
  {}
)

const {
  isView,
  business,
  formData,
  isEditable,
  isDisabled,
  select_options,
  validateFundCode,
  validateBusinessId,
  businessSelectorKey,
  informationFormRef,
  handleFundTypeChange,
  consolidation_options,
  participationHandlingDisabled,
} = useInformationForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
