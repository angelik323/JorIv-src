<script setup lang="ts">
// Components:
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import { useBasicDataForm } from './BasicDataForm'
import { IThirdParty } from '@/interfaces/global'
import { useRules } from '@/composables'

// Props
const props = withDefaults(
  defineProps<{
    formType: 'create' | 'edit' | 'view'
    data?: IThirdParty | null
  }>(),
  {}
)

// Handle emits to view:
const emit = defineEmits(['onContinue', 'onBack'])

const {
  formValues,
  formElementRef,
  document_types_third_party_natural,
  document_types_third_legal,
  occupations,
  options_boolean,
  naturesData,
  isLegalPerson,
  isNaturalPerson,
  third_party_type,
  fiscal_responsability,
  third_party_identity_types,
  rulesLegalPersonDocumentType,
  rulesNaturalPersonDocumentType,
  secondLastName,
  secondName,
  acronymRef,
  documentNumberRef,
  third_request,
  document_types_third_party_fideicomiso,

  // Methods
  searchInCautionList,
  validateExistPerson,
} = useBasicDataForm(props)
defineExpose({
  validateForm: async () => {
    const isValid = await formElementRef.value?.validate()

    if (props.formType === 'create') {
      await validateExistPerson(false)

      if (!third_request.value) {
        const isValid = await formElementRef.value?.validate()
        if (isValid) {
          const isIncludedCautelarList = await searchInCautionList(true)
          if (isIncludedCautelarList) return false
        }
        return !!isValid
      }

      return false
    }

    return !!isValid
  },
})
</script>

<template>
  <div class="q-pa-lg">
    <q-form @submit.prevent="" ref="formElementRef">
      <section class="q-mb-lg">
        <div class="row items-center q-col-gutter-sm">
          <div class="col-12 col-md-3">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Creación{{ ['create', 'edit'].includes(formType) ? '*' : '' }}
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              disabled
              :default_value="formValues.creation_date"
              @update:model-value="formValues.creation_date = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.creation_date ?? 'No registrado' }}
            </p>
          </div>
          <div
            v-if="['edit', 'view'].includes(formType)"
            class="col-12 col-md-3"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Creado por
            </p>
            <GenericInputComponent
              v-if="['edit'].includes(formType)"
              disabled
              :default_value="formValues.created_by"
              @update:model-value="formValues.created_by = $event"
            />

            <p v-else class="text-grey-6 mb-0">
              {{ formValues.created_by ?? 'No registrado' }}
            </p>
          </div>
          <div
            v-if="formValues.updated_by && ['view'].includes(formType)"
            class="col-12 col-md-3"
          >
            <p class="text-weight-medium mb-0" :class="'text-black-10 '">
              Modificación
            </p>
            <p class="text-grey-6 mb-0">
              {{ formValues.updated_at ?? 'No registrado' }}
            </p>
          </div>
          <div
            v-if="formValues.updated_by && ['view'].includes(formType)"
            class="col-12 col-md-3"
          >
            <p class="text-weight-medium mb-0 text-black-10">Modificado por</p>

            <p class="text-grey-6 mb-0">
              {{ formValues.updated_by ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </section>

      <section>
        <p class="text-black text-weight-medium text-h6 q-mb-md">
          Datos del tercero
        </p>

        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-3">
            <p
              v-if="['view'].includes(formType)"
              class="text-weight-medium mb-0 text-black-10"
            >
              Tipo de persona
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.person_type_id"
              :manual_option="naturesData"
              label="Tipo de persona*"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              disabled
              :required="false"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El tipo de persona es requerido']"
              @update:modelValue="formValues.person_type_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.person_type ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p
              v-if="['view'].includes(formType)"
              class="text-weight-medium mb-0 text-black-10"
            >
              Tipo de documento
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.document_type_id"
              :manual_option="
                isLegalPerson
                  ? document_types_third_legal
                  : isNaturalPerson
                  ? document_types_third_party_natural
                  : document_types_third_party_fideicomiso
              "
              label="Tipo de documento"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :map_options="true"
              required
              :disabled="['edit'].includes(formType)"
              :rules="[(val: string) => !!val || 'El tipo de documento es requerido']"
              @update:modelValue="formValues.document_type_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.document_type ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Número de identificación{{
                formValues.document_type_id == 14 ? ' - DV*' : '*'
              }}
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              ref="documentNumberRef"
              required
              :default_value="formValues.document_number"
              :rules="
                isLegalPerson
                  ? rulesLegalPersonDocumentType
                  : rulesNaturalPersonDocumentType
              "
              :disabled="['edit'].includes(formType)"
              @update:model-value="formValues.document_number = $event"
            >
              <template
                v-if="formValues.person_type_id && isLegalPerson && ![15].includes(formValues.document_type_id as number)"
                #after
              >
                <q-input
                  outlined
                  dense
                  disable
                  v-model="formValues.check_digit"
                  style="max-width: 35px"
                />
              </template>
            </GenericInputComponent>
            <p v-else class="text-grey-6 mb-0">
              {{
                formValues.document_number
                  ? formValues.document_type_id == 14
                    ? formValues.document_number +
                      ' - ' +
                      formValues.check_digit
                    : formValues.document_number
                  : 'No registrado'
              }}
            </p>
          </div>

          <div class="col-12 col-md-3 q-pa-none"></div>

          <div
            v-if="formValues.person_type_id && isLegalPerson"
            class="col-12"
            :class="['view'].includes(formType) ? 'col-md-3 ' : 'col-md-9'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Razón social
              {{ ['create', 'edit'].includes(formType) ? '*' : '' }}
            </p>
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              required
              :default_value="formValues.social_reason"
              :rules=" [ 
                (v: string) => useRules().is_required(v),
                (v: string) => useRules().max_length(v, 150)
              ]"
              @update:model-value="formValues.social_reason = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.social_reason ?? 'No registrado' }}
            </p>
          </div>

          <div
            v-if="formValues.person_type_id && isNaturalPerson"
            class="col-12 col-md-3"
          >
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
              required
              :default_value="formValues.first_name"
              :rules=" [ 
                (v: string) => !!v || 'El primer nombre es requerido',
                (v: string) => /^(?! )[A-Za-zÁÉÍÓÚÜÑñáéíóúü]+(?: [A-Za-zÁÉÍÓÚÜÑñáéíóúü]+)*$/.test(v) || 'Debe tener solo letras',
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ]"
              @update:model-value="formValues.first_name = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.first_name ?? 'No registrado' }}
            </p>
          </div>

          <div
            v-if="formValues.person_type_id && isNaturalPerson"
            class="col-12 col-md-3"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Segundo nombre
            </p>
            <GenericInputComponent
              ref="secondName"
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.second_name"
              :required="formValues.second_name ? true : false"
              @update:model-value="formValues.second_name = $event"
              :rules="formValues.second_name ? [
                (v: string) => /^(?! )[A-Za-zÁÉÍÓÚÜÑñáéíóúü]+(?: [A-Za-zÁÉÍÓÚÜÑñáéíóúü]+)*$/.test(v) || 'Debe tener solo letras',
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ] : []"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.second_name ?? 'No registrado' }}
            </p>
          </div>
          <div
            v-if="formValues.person_type_id && isNaturalPerson"
            class="col-12 col-md-3"
          >
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
              required
              :default_value="formValues.first_last_name"
              :rules=" [ 
                (v: string) => !!v || 'El primer apellido es requerido',
                (v: string) => /^(?! )[A-Za-zÁÉÍÓÚÜÑñáéíóúü]+(?: [A-Za-zÁÉÍÓÚÜÑñáéíóúü]+)*$/.test(v) || 'Debe tener solo letras',
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ]"
              @update:model-value="formValues.first_last_name = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.first_last_name ?? 'No registrado' }}
            </p>
          </div>

          <div
            v-if="formValues.person_type_id && isNaturalPerson"
            class="col-12 col-md-3"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Segundo apellido
            </p>
            <GenericInputComponent
              ref="secondLastName"
              v-if="['create', 'edit'].includes(formType)"
              :required="formValues.second_last_name ? true : false"
              :default_value="formValues.second_last_name"
              :rules="formValues.second_last_name ? [
                (v: string) => /^(?! )[A-Za-zÁÉÍÓÚÜÑñáéíóúü]+(?: [A-Za-zÁÉÍÓÚÜÑñáéíóúü]+)*$/.test(v) || 'Debe tener solo letras',
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ] : []"
              @update:model-value="formValues.second_last_name = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.second_last_name ?? 'No registrado' }}
            </p>
          </div>

          <div
            v-if="formValues.person_type_id && isLegalPerson"
            class="col-12 col-md-3"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Siglas
            </p>
            <GenericInputComponent
              ref="acronymRef"
              v-if="['create', 'edit'].includes(formType)"
              :required="formValues.initials ? true : false"
              :default_value="formValues.initials"
              :rules="formValues.initials ? [
                (v: string) => /^[A-Za-zÁÉÍÓÚÜáéíóúü]*$/.test(v) || 'Debe tener solo letras',
              ] : []"
              @update:model-value="formValues.initials = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.initials ?? 'No registrado' }}
            </p>
          </div>
          <div
            class="col-12 col-md-3"
            v-if="['view'].includes(formType) &&  [14, 15].includes(formValues.document_type_id as number)"
          >
            <p class="text-weight-medium mb-0 text-black-10">Tipo de entidad</p>
            <p class="text-grey-6 mb-0">
              {{ formValues.identity_type ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-3">
            <p
              v-if="['view'].includes(formType)"
              class="text-weight-medium mb-0 text-black-10"
            >
              Tipo de tercero
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.third_type_id"
              :manual_option="third_party_type"
              label="Tipo de tercero"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :map_options="true"
              required
              :rules="[(val: string) => !!val || 'El tipo de tercero es requerido']"
              @update:modelValue="formValues.third_type_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.third_type ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p
              v-if="['view'].includes(formType)"
              class="text-weight-medium mb-0 text-black-10"
            >
              Calidad tributaria
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.tax_manager_id"
              :manual_option="fiscal_responsability"
              label="Calidad tributaria"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :map_options="true"
              required
              :rules="[(val: string) => useRules().is_required(val)]"
              @update:modelValue="formValues.tax_manager_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.tax_manager ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p
              v-if="['view'].includes(formType)"
              class="text-weight-medium mb-0 text-black-10"
            >
              Responsabilidad de IVA
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.iva_manager_id"
              :manual_option="options_boolean"
              label="Responsabilidad de IVA"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :map_options="true"
              required
              :rules="[(val: string) => !!val || 'Responsabilidad de IVA es requerida']"
              @update:modelValue="formValues.iva_manager_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.iva_manager ?? 'No registrado' }}
            </p>
          </div>

          <div v-if="isLegalPerson" class="col-12 col-md-3">
            <p
              v-if="['view'].includes(formType)"
              class="text-weight-medium mb-0 text-black-10"
            >
              Tipo de entidad
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.identity_type_id"
              :manual_option="third_party_identity_types"
              label="Tipo de entidad"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :map_options="true"
              required
              :rules="[(val: string) => !!val || 'El tipo de entidad es requerido']"
              @update:modelValue="formValues.identity_type_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.identity_type ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-3" v-if="isNaturalPerson">
            <p
              v-if="['view'].includes(formType)"
              class="text-weight-medium mb-0 text-black-10"
            >
              Profesión
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.profession_id"
              :manual_option="occupations"
              label="Profesión"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              required
              :map_options="true"
              :rules="[(val: string) => !!val || 'La profesión es requerida']"
              @update:modelValue="formValues.profession_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.profession ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-3" v-if="['view'].includes(formType)">
            <p class="text-weight-medium mb-0 text-black-10">Estado</p>
            <ShowStatus
              :type="Number(data?.status_id ?? 1)"
              classCustom="q-px-md q-py-md"
            />
          </div>
        </div>
      </section>

      <q-separator class="q-mb-md q-mt-md" color="grey-4" />
    </q-form>
  </div>
</template>
