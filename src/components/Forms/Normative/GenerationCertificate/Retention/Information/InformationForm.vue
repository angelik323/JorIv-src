<template>
  <q-form ref="formElementRef" aria-label="Formulario de datos básicos">
    <section>
      <div class="row items-end q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.person_types"
            label="Tipo de persona"
            auto_complete
            map_options
            :manual_option="personTypeOptions"
            required
            :rules="[
                (val: string) => useRules().is_required(val, 'El tipo de persona es requerido'),
                ]"
            @update:model-value="models.person_types = $event"
          />
        </div>
        <div class="col-12 col-md-2">
          <RadioYesNo
            v-model="models.massive"
            hasTitle
            title="Masivo"
            :is-radio-button="false"
            class-check=""
          />
        </div>
        <template v-if="models.massive">
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :default_value="models.start_client_id"
              label="Desde cliente"
              auto_complete
              map_options
              :manual_option="third_parties"
              required
              :rules="[
                  (val: string) => useRules().is_required(val, 'El cliente inicial es requerido'),
                  ]"
              @update:model-value="models.start_client_id = $event"
            />
          </div>
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :default_value="models.end_client_id"
              label="Hasta cliente"
              auto_complete
              map_options
              :manual_option="third_parties"
              required
              :rules="[
                  (val: string) => useRules().is_required(val, 'El cliente final es requerido'),
                  ]"
              @update:model-value="models.end_client_id = $event"
            />
          </div>
        </template>
        <template v-else>
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              :default_value="models.start_client_id"
              label="Cliente"
              auto_complete
              map_options
              :manual_option="third_parties"
              required
              :rules="[
                  (val: string) => useRules().is_required(val, 'El cliente es requerido'),
                  ]"
              @update:model-value="models.start_client_id = $event"
            />
          </div>
        </template>
        <div class="col-12 col-md-2">
          <RadioYesNo
            v-model="models.has_validity"
            hasTitle
            title="Vigencia"
            :is-radio-button="false"
            class-check=""
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            placeholder="AAAA"
            mask="YYYY"
            label="Año"
            required
            :disabled="!disableValiditySelectors"
            :default_value="models.validity"
            :rules="[(val: string) => useRules().is_required(val, 'El año de vigencia es requerido')]"
            @update:model-value="models.validity = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            placeholder="AAAA-MM"
            mask="YYYY-MM"
            label="Periodo desde"
            required
            :disabled="disableValiditySelectors"
            :default_value="models.start_period"
            :rules="[(val: string) => useRules().is_required(val, 'El periodo inicial es requerido')]"
            @update:model-value="models.start_period = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            placeholder="AAAA-MM"
            mask="YYYY-MM"
            label="Periodo hasta"
            required
            :disabled="disableValiditySelectors"
            :default_value="models.end_period"
            :rules="[(val: string) => useRules().is_required(val, 'El periodo final es requerido')]"
            @update:model-value="models.end_period = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// interfaces
import { IGenerationCertificateInformationForm } from '@/interfaces/customs/normative/GenerationCertificate'

import { WriteActionType } from '@/interfaces/global'
// composables
import { useRules } from '@/composables/useRules'
// logic
import useInformationForm from '@/components/Forms/Normative/GenerationCertificate/Retention/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    data: IGenerationCertificateInformationForm | null
    action: WriteActionType
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'update:data', value: IGenerationCertificateInformationForm): void
}>()

const {
  models,
  formElementRef,
  personTypeOptions,
  disableValiditySelectors,
  third_parties,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
