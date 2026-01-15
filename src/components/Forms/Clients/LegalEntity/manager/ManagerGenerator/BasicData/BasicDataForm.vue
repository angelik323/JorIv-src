<template>
  <div>
    <!-- Título -->
    <div class="text-start q-mb-lg">
      <h2 class="text-body1 text-dark text-bold q-my-none">Datos Generales</h2>
    </div>

    <q-form ref="formElementRef">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-xs">
        <div class="col-12 col-md-6">
          <p
            v-if="['view'].includes(formType)"
            class="text-weight-medium mb-0 text-black-10"
          >
            Tipo de documento
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.document_type"
            :manual_option="
              isLegalPerson
                ? document_types_third_legal
                : document_types_third_party_natural
            "
            label="Tipo de documento"
            :auto_complete="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :map_options="true"
            required
            :rules="[(val) => !!val || 'El tipo de documento es requerido']"
            @update:modelValue="formValues.document_type = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.document_type ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Número de documento{{
              ['create', 'edit'].includes(formType) ? '*' : ''
            }}
          </p>
          <GenericInputComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.document_number"
            required
            :rules="
              isLegalPerson
                ? rulesLegalPersonDocumentType
                : rulesNaturalPersonDocumentType
            "
            @update:model-value="formValues.document_number = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.document_number ?? 'No registrado' }}
          </p>
        </div>

        <template v-if="isNaturalPerson">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Primer nombre{{
                ['create', 'edit'].includes(formType) ? '*' : ''
              }}
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.first_name"
              required
              :rules=" [ 
                (v: string) => !!v || 'El primer nombre es requerido',
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ]"
              @update:model-value="formValues.first_name = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.first_name ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Segundo nombre
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              ref="secondName"
              :default_value="formValues.second_name"
              :required="formValues.second_name ? true : false"
              :rules="formValues.second_name ? [
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ] : []"
              @update:model-value="formValues.second_name = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.second_name ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Primer apellido{{
                ['create', 'edit'].includes(formType) ? '*' : ''
              }}
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.first_lastname"
              required
              :rules=" [ 
                (v: string) => !!v || 'El primer apellido es requerido',
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ]"
              @update:model-value="formValues.first_lastname = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.first_lastname ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Segundo apellido
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              ref="secondLastName"
              :default_value="formValues.second_lastname"
              :required="formValues.second_lastname ? true : false"
              :rules="formValues.second_lastname ? [
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ] : []"
              @update:model-value="formValues.second_lastname = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.second_lastname ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template v-if="isLegalPerson">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Razón social{{ ['create', 'edit'].includes(formType) ? '*' : '' }}
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.business_name"
              required
              :rules=" [ 
                (v: string) => !!v || 'La razón social es requerida',
                (v: string) => v.length <= 50 || 'Debe de tener máximo 50 caracteres'
              ]"
              @update:model-value="formValues.business_name = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.business_name ?? 'No registrado' }}
            </p>
          </div>
        </template>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { IManager } from '@/interfaces/customs/Clients'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import { useManagerInfoForm } from './BasicDataForm'

const props = withDefaults(
  defineProps<{
    formType: 'create' | 'edit' | 'view'
    data?: IManager | null
    isNaturalPerson: boolean
    isLegalPerson: boolean
  }>(),
  {}
)

const {
  formValues,
  formElementRef,
  document_types_third_party_natural,
  document_types_third_legal,
  rulesLegalPersonDocumentType,
  rulesNaturalPersonDocumentType,
  onlyLetters,
} = useManagerInfoForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
