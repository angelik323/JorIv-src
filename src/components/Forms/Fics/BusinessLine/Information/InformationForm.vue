<template>
  <q-form ref="informationForm">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Estado"
            :manual_option="status_business_line"
            map_options
            required
            :default_value="business_line?.status_id ?? StatusID.ACTIVE"
            auto_complete
            clearable
            :placeholder="'Seleccione'"
            :rules="[(val: string) => useRules().is_required(val, 'El estado es requerido')]"
            :disabled="props.action === 'create'"
            @update:modelValue="business_line.status_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            ref="codeRef"
            placeholder="Inserte"
            label="Código"
            required
            :default_value="business_line?.code ?? ''"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código requerido'),
              (val: string) => useRules().max_length(val, 4),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().only_number(val),
              ]"
            :disabled="props.action === 'edit'"
            @update:modelValue="business_line.code = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            ref="descriptionRef"
            placeholder="Inserte"
            label="Descripción"
            required
            :default_value="business_line?.description ?? ''"
            :rules="[(val: string) => useRules().is_required(val, 'La descripción es requerida')]"
            @update:modelValue="business_line.description = $event"
          />
        </div>

        <div
          v-if="business_line.status_id === BusinessLineStatusID.CANCELLED"
          class="col-12"
        >
          <GenericInput
            ref="descriptionRef"
            placeholder="Inserte"
            type="textarea"
            label="Motivo de cancelación"
            required
            :default_value="business_line?.cancellation_reason ?? ''"
            :rules="[
                (val: string) => useRules().is_required(val, 'La descripción es requerida'),
                (val: string) => useRules().max_length(val, 200),
                (val: string) => useRules().min_length(val, 6)
              ]"
            @update:modelValue="business_line.cancellation_reason = $event"
          />
        </div>

        <template v-if="selected_type === 'participation_types'">
          <div
            class="col-12 col-md-12 row items-center"
            v-if="props.action === 'edit'"
          >
            <p class="text-black-90 text-subtitle1 q-ma-none">
              Tipo de participacion consolidado:
            </p>
            <p class="text-black-90 text-bold text-subtitle1 q-ma-none q-ml-sm">
              {{ checkParticipationType ? 'Si' : 'No' }}
            </p>
          </div>
          <div
            class="col-12 col-md-12 flex items-center row reverse justify-end"
            v-else
          >
            <p class="text-black-90 text-subtitle1 q-ma-none">
              Tipo de participacion consolidado
            </p>
            <RadioYesNo
              v-model="checkParticipationType"
              :isRadioButton="false"
            />
          </div>
        </template>
      </div>

      <div class="col-12">
        <q-separator class="q-my-md q-mb-lg" />
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Utils
import { ActionType, BusinessLineStatusID, StatusID } from '@/interfaces/global'
import { useRules } from '@/composables'

// Logic view
import useInformationForm from '@/components/Forms/Fics/BusinessLine/Information/InformationForm'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: number
  }>(),
  {}
)

const {
  selected_type,
  business_line,
  informationForm,
  status_business_line,
  checkParticipationType,

  // Methods
  getPayloadData,
  validateBusinessLine,
} = useInformationForm()

defineExpose({
  getFormData: () => getPayloadData(),
  validateForm: () => validateBusinessLine(),
  checkParticipationType: checkParticipationType,
})
</script>
