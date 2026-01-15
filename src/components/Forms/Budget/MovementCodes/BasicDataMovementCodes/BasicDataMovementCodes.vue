<template>
  <q-form ref="movementCodesBasicData" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6 text-black-90" v-if="action === 'edit'">
          <GenericInputComponent
            :label="'Código'"
            :placeholder="'Inserte'"
            disabled
            required
            :rules="[
                (val: string) => 
                  is_required(val, 'El código de movimiento es requerido'),
              ]"
            :default_value="models.movement_code ?? ''"
            @update:model-value="models.movement_code = $event"
          />
        </div>
        <div class="col-12 col-md-6 text-black-90">
          <GenericInputComponent
            :label="'Descripción'"
            :placeholder="'Inserte'"
            required
            :rules="[
              (val: string) => no_special_characters_extended(val),
                (val: string) => 
                  is_required(val, 'La descripción del código de movimiento es requerida'),
              (val: string) => max_length(val, 100)
              ]"
            :default_value="models.movement_description"
            @update:model-value="
              models.movement_description = $event.toUpperCase()
            "
          />
        </div>
        <div class="col-12 col-md-6 text-black-90">
          <GenericSelectorComponent
            :manual_option="code_movement_validities"
            map_options
            :label="'Vigencia'"
            :default_value="models.validity"
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
                (val: string) => is_required(val, 'La vigencia es requerida'),
              ]"
            @update:model-value="models.validity = $event"
          />
        </div>
        <div
          class="col-12 q-mt-md"
          :class="action === 'create' ? '' : 'col-md-6'"
        >
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            :model-value="models.is_derived_contract"
            :has-title="false"
            :has-subtitle="false"
            label="¿Contratación derivada?"
            class-check="text-black-90"
            :required="false"
            :isRadioButton="false"
            :isDisabled="false"
            @update:model-value="models.is_derived_contract = $event"
          />
        </div>
        <div class="col-12 col-md-6 text-black-90">
          <GenericSelectorComponent
            label="Código de anulación"
            :default_value="models.cancellation_code"
            :manual_option="code_movements"
            map_options
            auto_complete
            :required="false"
            :rules="[]"
            @update:model-value="selectCancellationCode(models, $event)"
          />
        </div>
        <div class="col-12 col-md-6 text-black-90">
          <GenericInputComponent
            disabled
            :label="'Descripción'"
            :placeholder="'-'"
            :default_value="models.cancellation_code_description"
          />
        </div>
        <div class="col-12 col-md-6 text-black-90">
          <GenericSelectorComponent
            label="Código cancelación de saldos"
            :default_value="models.balance_cancellation_code"
            :manual_option="code_movements"
            map_options
            auto_complete
            :required="false"
            :rules="[]"
            @update:model-value="selectBallanceCancellationCode(models, $event)"
          />
        </div>
        <div class="col-12 col-md-6 text-black-90">
          <GenericInputComponent
            disabled
            :label="'Descripción'"
            :placeholder="'-'"
            :default_value="models.balance_cancellation_code_description"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Logic
import BasicDataMovementCodes from '@/components/Forms/Budget/MovementCodes/BasicDataMovementCodes/BasicDataMovementCodes'

// Interfaces
import { IMovementCodesBasicDataResponse } from '@/interfaces/customs/budget/MovementCodes'
import { WriteActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data?: IMovementCodesBasicDataResponse | null
  }>(),
  {}
)
const emit = defineEmits(['validate:form'])

const {
  models,
  movementCodesBasicData,
  code_movements,
  code_movement_validities,
  is_required,
  no_special_characters_extended,
  max_length,
  selectCancellationCode,
  selectBallanceCancellationCode,
} = BasicDataMovementCodes(props)

defineExpose({
  validateForm: () => movementCodesBasicData.value?.validate(),
})
</script>
