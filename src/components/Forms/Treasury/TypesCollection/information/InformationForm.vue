<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div
            v-show="['edit'].includes(action)"
            class="col-xs-12 col-sm-12 col-md-4"
          >
            <GenericInput
              v-if="['edit'].includes(action)"
              :default_value="models.code ?? ''"
              disabled
              label="Código"
              @update:model-value="models.code = $event"
            />
          </div>

          <div
            v-if="['edit'].includes(action)"
            class="col-xs-12 col-sm-12 col-md-4"
          >
            <GenericSelectorComponent
              v-if="['edit'].includes(action)"
              :manual_option="status.filter((item) => item.value !== 0)"
              :map_options="true"
              label="Estado"
              :required="true"
              :default_value="models.status_id"
              :auto_complete="false"
              @update:modelValue="models.status_id = $event"
              :rules="[(v: string) => useRules().is_required(v)]"
            />
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['edit'].includes(action) ? 'col-md-4' : 'col-md-12'"
          >
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.description"
              :placeholder="'Ingrese descripción'"
              label="Descripción"
              :rules="[
                (v: string) => useRules().is_required(v),
                (v: string) => useRules().min_length(v, 3),
                (v: string) => useRules().max_length(v, 60),
                (v: string) => useRules().no_consecutive_spaces(v),
                (v: string) => useRules().no_special_characters(v),
              ]"
              @update:model-value="updateDescription($event)"
            />
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              selectedPaymentType === null || selectedPaymentType === ''
                ? 'col-md-6'
                : 'col-md-6'
            "
          >
            <GenericSelectorComponent
              :default_value="models.type_receive"
              :manual_option="paymentMethods"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              label="Tipo"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              @update:model-value="updatePaymentType($event)"
            />
          </div>

          <div
            class="col-xs-12 col-sm-12 col-md-6"
            v-if="
              models.type_receive === '' || models.type_receive === 'Cheque'
            "
          >
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Días de canje"
              :required="models.type_receive === 'Cheque'"
              :default_value="models.redemption_days ?? ''"
              :rules="[
                (v: string) => useRules().is_required(v),
                (v: string) => useRules().min_length(v, 1),
                (v: string) => useRules().max_length(v, 2),
                (v: string) => useRules().no_consecutive_spaces(v),
                (v: string) => useRules().no_special_characters(v),
                (v: string) => useRules().only_number(v),
              ]"
              @update:model-value="models.redemption_days = $event"
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
//Props
const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data?: ITypesCollectionDetail
  }>(),
  {}
)

//Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

//Logic
import useInformationForm from './InformationForm'
import { useRules } from '@/composables'

//Interfaces
import { WriteActionType } from '@/interfaces/global'
import { ITypesCollectionDetail } from '@/interfaces/customs/TypesCollection'

const updateDescription = (value: string) => {
  models.value.description = value.toUpperCase()
}

const {
  status,
  models,
  formInformation,
  paymentMethods,
  selectedPaymentType,
  updatePaymentType,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
