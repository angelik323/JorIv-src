<template>
  <q-form ref="formInformation" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          v-if="['edit'].includes(action)"
          class="col-xs-12 col-sm-12 col-md-2 mb-2"
        >
          <p class="text-weight-medium mb-0">{{ fieldCode.label }}</p>
          <p class="text-grey-8 mb-0">
            {{ fieldCode.value() ?? fieldCode.fallback }}
          </p>
        </div>
        <div :class="['col-12', 'col-md-' + (action === 'edit' ? '3' : '4')]">
          <p class="text-weight-medium text-grey-10 mb-0">Descripción *</p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.description"
            :placeholder="'Ingrese descripción'"
            required
            :rules="[
              (val) =>
                useRules().is_required(val, 'La descripción es requerida'),
              (val) => useRules().min_length(val, 3),
              (val) => useRules().max_length(val, 60),
              (val) => useRules().no_consecutive_spaces(val),
            ]"
            @update:model-value="(val) => (models.description = val)"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.description ?? 'No registrado' }}
          </p>
        </div>
        <div :class="['col-12', 'col-md-' + (action === 'edit' ? '3' : '4')]">
          <p class="text-weight-medium text-grey-10 mb-0">Naturaleza *</p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.nature"
            :manual_option="nature_movement_codes_list"
            map_options
            auto_complete
            required
            :rules="[
              (val) =>
                useRules().is_required(val, 'La naturaleza es requerida'),
            ]"
            @update:model-value="(val) => (models.nature = val)"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Operación"
            :default_value="models.operation"
            :manual_option="filteredOperations"
            auto_complete
            required
            :rules="[
              (val) => useRules().is_required(val, 'La operación es requerida'),
            ]"
            @update:model-value="(val) => (models.operation = val)"
          />
        </div>
      </div>

      <div class="col-12 q-w-full">
        <RadioYesNo
          v-model="models.generate_special_contribution"
          :isRadioButton="false"
          :hasTitle="true"
          :title="'¿Genera contribución especial?'"
          :hasSubtitle="false"
          :isDisabled="
            ['view'].includes(action) || generateEspecialContributionIsDisable
          "
        />
      </div>
      <q-separator class="q-mt-sm q-mb-lg" color="grey-4" />
      <div class="col-12">
        <RadioYesNo
          v-model="models.handles_accounting_offset"
          :isRadioButton="false"
          :hasTitle="true"
          :title="'¿Maneja contrapartida contable?'"
          :hasSubtitle="false"
          :isDisabled="['view'].includes(action)"
        />
      </div>
      <q-separator class="q-mt-sm q-mb-lg" color="grey-4" />
      <div class="col-12">
        <RadioYesNo
          v-model="models.conciliation_movement"
          :isRadioButton="false"
          :hasTitle="true"
          :title="'¿Movimiento de conciliación?'"
          :hasSubtitle="false"
          :isDisabled="['view'].includes(action)"
        />
      </div>
      <q-separator class="q-mt-sm q-mb-lg" color="grey-4" />
      <div class="col-12">
        <RadioYesNo
          v-model="models.transfer_investments"
          :isRadioButton="false"
          :hasTitle="true"
          :title="'¿Traslado de inversiones?'"
          :hasSubtitle="false"
          :isDisabled="models.operation !== 'Traslado'"
        />
      </div>
      <q-separator class="q-mt-sm q-mb-lg" color="grey-4" />
      <div class="col-12">
        <RadioYesNo
          v-model="models.transfer_accounts"
          :isRadioButton="false"
          :hasTitle="true"
          :title="'¿Cesión de cuentas?'"
          :hasSubtitle="false"
          :isDisabled="models.operation !== 'Traslado'"
        />
      </div>
      <q-separator class="q-mt-sm q-mb-lg" color="grey-4" />

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Comprobante contable"
            :default_value="models.receipt_types_id"
            :manual_option="receipt_type"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'El comprobante contable es requerido'
                ),
            ]"
            @update:model-value="(val) => (models.receipt_types_id = val)"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Sub comprobante"
            :default_value="models.sub_receipt_types_id"
            :manual_option="sub_receipt_type"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'El sub comprobante contable es requerido'
                ),
            ]"
            @update:model-value="(val) => (models.sub_receipt_types_id = val)"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Movimiento de anulación"
            :default_value="models.move_override"
            :manual_option="movement_code_override"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="false"
            :rules="[useRules().is_required]"
            @update:model-value="(val) => (models.move_override = val)"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { IMovementCodes } from '@/interfaces/customs/treasury/MovementCodes'
import { useRules } from '@/composables/useRules'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import useInformatioForm from '@/components/Forms/Treasury/MovementCodes/information/InformationForm'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: IMovementCodes[]
  }>(),
  {}
)
const emits = defineEmits(['validate:form'])

const {
  models,
  nature_movement_codes_list,
  formInformation,
  sub_receipt_type,
  receipt_type,
  movement_code_override,
  generateEspecialContributionIsDisable,
  fieldCode,
  filteredOperations,
} = useInformatioForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
