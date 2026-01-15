<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div
            v-show="['edit'].includes(action)"
            class="col-xs-12 col-sm-12 col-md-4"
          >
            <p class="text-weight-medium text-grey-6 mb-0">Código</p>
            <GenericInput
              :default_value="models.code ?? ''"
              disabled
              @update:model-value="models.code = $event"
            />
          </div>

          <div
            :class="
              ['create'].includes(action)
                ? 'col-xs-12 col-sm-12 col-md-6'
                : 'col-xs-12 col-sm-12 col-md-4'
            "
          >
            <p class="text-weight-medium text-grey-6 mb-0">
              Descripción{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              required
              :default_value="models.description"
              :rules="[
                (v: string) => !!v || 'La descripción es requerida',
                (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 100 || 'Debe contener como máximo 100 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
                (v: string) => /^[ A-Za-zÀ-ÖØ-öø-ÿ0-9]*$/.test(v) || 'Debe de tener solo letras y numeros',
              ]"
              @update:model-value="models.description = $event"
            />
          </div>

          <div
            :class="
              ['create'].includes(action)
                ? 'col-xs-12 col-sm-12 col-md-6'
                : 'col-xs-12 col-sm-12 col-md-4'
            "
          >
            <p class="text-weight-medium text-grey-6 mb-0">
              Tipo{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              :manual_option="treasury_cancellation_code_type"
              :map_options="true"
              :required="true"
              :default_value="models.type"
              :auto_complete="true"
              @update:modelValue="models.type = $event"
              :rules="[(val: string) => !!val || 'El tipo es requerido']"
            />
          </div>

          <div class="col-xs-3 col-sm-4 col-md-3 mt-2">
            <p class="text-weight-medium text-grey-6 mb-0">
              Revierte conciliación{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <RadioYesNo
              v-model="models.reverses_conciliation"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
            />
          </div>

          <div class="col-xs-3 col-sm-4 col-md-3 mt-2">
            <p class="text-weight-medium text-grey-6 mb-0">
              Conserva consecutivo cheque{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <RadioYesNo
              v-model="models.retains_consecutive_check"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
            />
          </div>
        </div>
        <q-separator class="mt-1" />
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: ICancellationCodes | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import useInformationForm from './InformationForm'
import { ICancellationCodes } from '@/interfaces/customs'

const { models, formInformation, treasury_cancellation_code_type } =
  useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
