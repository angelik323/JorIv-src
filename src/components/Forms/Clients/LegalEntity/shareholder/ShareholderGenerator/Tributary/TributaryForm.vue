<template>
  <div>
    <!-- Título -->
    <div class="text-start q-mb-lg">
      <h2 class="text-body1 text-dark text-bold q-my-none">
        Información accionaria
      </h2>
    </div>

    <q-form ref="formElementRef">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-xs">
        <div class="col-12">
          <RadioYesNo
            v-model="formValues.tributary_has_control_over_legal_entity"
            hasTitle
            title="¿Tiene responsabilidad tributaria internacional en un país diferente a Colombia?"
            :hasSubtitle="false"
            :is-disabled="['view'].includes(formType)"
          />
          <q-separator class="q-mt-xs q-mb-md" color="grey-4" />
        </div>

        <template v-if="formValues.tributary_has_control_over_legal_entity">
          <div class="col-12 col-md-6">
            <p
              v-if="['view'].includes(formType)"
              class="text-weight-medium mb-0 text-black-10"
            >
              País
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.tributary_country"
              :manual_option="
                countries.filter(
                  (country) => country.label.toLowerCase() !== 'colombia'
                )
              "
              label="País"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              required
              :map_options="true"
              :rules="[(val: any) => !!val || 'El país es requerido']"
              @update:model-value="formValues.tributary_country = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.tributary_country ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código GIIN{{ ['create', 'edit'].includes(formType) ? '*' : '' }}
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              required
              :default_value="formValues.giin_code"
              :rules="[
              (v: string) => !!v || 'El código GIIN es requerido',
              (v: string) => /^[\p{L}\d ]*$/u.test(v) || 'Solo caracteres alfanuméricos',
              (v: string) => v.length <= 20 || 'Debe contener como máximo 20 caracteres',
            ]"
              @update:model-value="formValues.giin_code = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.giin_code ?? 'No registrado' }}
            </p>
          </div>
        </template>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { IShareholder } from '@/interfaces/customs/Clients'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import { useTributaryForm } from './TributaryForm'

const props = withDefaults(
  defineProps<{
    formType: 'create' | 'edit' | 'view'
    data?: IShareholder | null
  }>(),
  {}
)

const { formValues, formElementRef, countries } = useTributaryForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
