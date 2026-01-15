<template>
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
          :default_value="formValues.document_type_id"
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
          @update:modelValue="formValues.document_type_id = $event"
        />
        <p v-else class="text-grey-6 mb-0">
          {{ formValues.document_type_id ?? 'No registrado' }}
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
          :default_value="formValues.document"
          required
          :rules="
            isLegalPerson
              ? rulesLegalPersonDocumentType
              : rulesNaturalPersonDocumentType
          "
          @update:model-value="formValues.document = $event"
        />
        <p v-else class="text-grey-6 mb-0">
          {{ formValues.document ?? 'No registrado' }}
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
            Primer nombre{{ ['create', 'edit'].includes(formType) ? '*' : '' }}
          </p>
          <GenericInputComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.natural_person?.name"
            required
            :rules=" [ 
                (v: string) => !!v || 'El primer nombre es requerido',
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ]"
            @update:model-value="
              formValues.natural_person &&
                (formValues.natural_person.name = $event)
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.natural_person?.name ?? 'No registrado' }}
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
            :default_value="formValues.natural_person?.middle_name"
            :required="formValues.natural_person?.middle_name ? true : false"
            :rules="formValues.natural_person?.middle_name ? [
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ] : []"
            @update:model-value="
              formValues.natural_person &&
                (formValues.natural_person.middle_name = $event)
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.natural_person?.middle_name ?? 'No registrado' }}
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
            :default_value="formValues.natural_person?.last_name"
            required
            :rules=" [ 
                (v: string) => !!v || 'El primer apellido es requerido',
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ]"
            @update:model-value="
              formValues.natural_person &&
                (formValues.natural_person.last_name = $event)
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.natural_person?.last_name ?? 'No registrado' }}
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
            :default_value="formValues.natural_person?.second_last_name"
            :required="
              formValues.natural_person?.second_last_name ? true : false
            "
            :rules="formValues.natural_person?.second_last_name ? [
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ] : []"
            @update:model-value="
              formValues.natural_person &&
                (formValues.natural_person.second_last_name = $event)
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.natural_person?.second_last_name ?? 'No registrado' }}
          </p>
        </div>

        <template v-if="isLegalPersonIndirect">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(formType)"
              label="País de nacimiento"
              :manual_option="countries"
              :map_options="true"
              :required="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :default_value="formValues.natural_person?.birth_country_id"
              :auto_complete="true"
              @update:modelValue="
                formValues.natural_person &&
                  (formValues.natural_person.birth_country_id = $event)
              "
              :rules="[(val: string) => !!val || 'El país de nacimiento es requerido']"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">País de nacimiento</p>
              <p class="text-weight-medium no-margin">
                {{
                  formValues.natural_person?.birth_country_id ?? 'No registrado'
                }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericInputComponent
              v-if="['create', 'edit'].includes(formType)"
              label="Cargo"
              :required="true"
              :default_value="formValues.position"
              :rules="[
                  (v: string) => !!v || 'Este campo es requerido',
                  (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                  (v: string) =>
                    v.length <= 50 || 'Debe contener como máximo 50 caracteres',
                ]"
              @update:model-value="formValues.position = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Cargo</p>
              <p class="text-weight-medium no-margin">
                {{ formValues.position ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(formType)"
              label="Fecha de retiro"
              :default_value="formValues.date_exit"
              :required="formValues.date_exit ? true : false"
              :rules="[
                (v) => useRules().date_before_or_equal_to_the_current_date(v),
              ]"
              @update:modelValue="formValues.date_exit = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha de retiro</p>
              <p class="text-weight-medium no-margin">
                {{ formValues.date_exit ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>
      </template>

      <template v-if="isLegalPerson">
        <div class="col-xs-12 col-sm-12 col-md-6">
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
            :default_value="formValues.legal_person?.business_name"
            required
            :rules=" [
                (v: string) => !!v || 'La razón social es requerida',
                (v: string) => v.length <= 50 || 'Debe de tener máximo 50 caracteres'
              ]"
            @update:model-value="
              formValues.legal_person &&
                (formValues.legal_person.business_name = $event)
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.legal_person?.business_name ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(formType)"
            label="Fecha de constitución"
            :default_value="formValues.legal_person?.constitution_date"
            :required="true"
            :rules="[
                  (val: string) => useRules().is_required(val, 'La fecha de constitución es requerida'),
                  (val: string) => useRules().date_before_or_equal_to_the_current_date(val)
                ]"
            @update:modelValue="
              formValues.legal_person &&
                (formValues.legal_person.constitution_date = $event)
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.legal_person?.constitution_date ?? 'No registrado' }}
          </p>
        </div>
      </template>

      <div class="col-xs-12 col-sm-12 col-md-12">
        <GenericInputComponent
          v-if="['create', 'edit'].includes(formType)"
          label="Dirección"
          :default_value="formValues.address"
          placeholder="Inserte"
          required
          readonly
          :rules="[(val: string) => !!val || 'La dirección es requerida']"
          @click="isAddressGeneratorOpen = true"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Dirección</p>
          <p class="text-weight-medium no-margin">
            {{ formValues.address ?? 'No registrado' }}
          </p>
        </div>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-3">
        <GenericSelectorComponent
          v-if="['create', 'edit'].includes(formType)"
          label="País de ubicación"
          :default_value="formValues.country_id"
          :manual_option="countries"
          map_options
          auto_complete
          readonly
          required
          :rules="[(val: string) => !!val || 'El país es requerido']"
          @click="isAddressGeneratorOpen = true"
        />
        <p v-else class="text-grey-6 mb-0">
          {{ formValues.country_id ?? 'No registrado' }}
        </p>
      </div>

      <template v-if="isCountry(formValues.country_id, 'Colombia')">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(formType)"
            label="Departamento/Estado"
            :default_value="formValues.department_id"
            :manual_option="departments"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :disabled="formType === 'edit'"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El departamento/estado es requerido')]"
            @click="isAddressGeneratorOpen = true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Departamento/Estado</p>
            <p class="text-weight-medium no-margin">
              {{ formValues.department_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(formType)"
            label="Ciudad"
            :default_value="formValues.city_id"
            :manual_option="cities"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :disabled="formType === 'edit'"
            :required="true"
            :rules="[(val: string) => !!val || 'La ciudad es requerida']"
            @click="isAddressGeneratorOpen = true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Ciudad</p>
            <p class="text-weight-medium no-margin">
              {{ formValues.city_id ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </template>

      <div class="col-xs-12 col-sm-12 col-md-4">
        <label class="text-weight-medium break-word q-ml-sm text-grey-7 col-12">
          Número de teléfono<span aria-hidden="true">*</span>
        </label>
        <PhoneInput
          v-if="['create', 'edit'].includes(formType)"
          label="Número de teléfono"
          :rules="[(val: string) => useRules().is_required(val, 'El número de teléfono es requerido') ]"
          :default_value="formValues.phone ?? ''"
          @update:model-value="
                (val: string) => (formValues.phone = val)
              "
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Número de teléfono</p>
          <p class="text-weight-medium no-margin">
            {{ formValues.phone ?? 'No registrado' }}
          </p>
        </div>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-6">
        <GenericInputComponent
          v-if="['create', 'edit'].includes(formType)"
          label="Correo electrónico"
          type="email"
          :default_value="formValues.email"
          required
          :rules="[
            (v: string) => useRules().is_required(v, 'El correo electrónico es requerido'),
            (v: string) => useRules().is_email_all_domain_extension(v),
            (v: string) => useRules().max_length(v, 50)
          ]"
          @update:model-value="formValues.email = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Correo electrónico</p>
          <p class="text-weight-medium no-margin">
            {{ formValues.email ?? 'No registrado' }}
          </p>
        </div>
      </div>

      <template v-if="isLegalPersonIndirect && isNaturalPerson">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(formType)"
            label="Fecha desde la calidad de beneficiario final"
            :default_value="formValues.beneficiary_date"
            :required="true"
            :rules="[ 
              (val: string) => useRules().is_required(val, 'La fecha desde la calidad de beneficiario final es requerida'),
              (val: string) => useRules().date_after_or_equal_to_specific_date(val, formValues.beneficiary_date || '' ),
            ]"
            @update:modelValue="formValues.beneficiary_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Fecha desde la calidad de beneficiario final
            </p>
            <p class="text-weight-medium no-margin">
              {{ formValues.beneficiary_date ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </template>

      <div class="col-xs-12 col-sm-12 col-md-6">
        <GenericSelectorComponent
          v-if="['edit'].includes(formType)"
          label="Estado"
          :default_value="formValues.status_id"
          :manual_option="default_statuses"
          map_options
          first_filter_option="label"
          second_filter_option="label"
          :disabled="formType === 'edit'"
          :required="true"
          :rules="[(val: string) => useRules().is_required(val, 'El estado es requerido')]"
          @update:modelValue="formValues.status_id = $event"
        />
        <div v-else-if="['view'].includes(formType)" class="text-black-90">
          <p class="text-weight-bold no-margin">Estado</p>
          <p class="text-weight-medium no-margin">
            {{ formValues.status_id ?? 'No registrado' }}
          </p>
        </div>
      </div>
    </div>
  </q-form>

  <AddressGenerator
    v-model:is-open="isAddressGeneratorOpen"
    required
    :departments="departments"
    :countries="countries"
    :rules="[(val: string) => useRules().is_required(val, 'La dirección es requerida')]"
    :locationToEdit="{
      address: formValues.address || '',
      country: {
        id: formValues.country_id ? Number(formValues.country_id) : null,
      },
      department: { id: Number(formValues.department_id) },
      city: { id: Number(formValues.city_id) },
    }"
    @save="handleAddressSave"
  />
</template>

<script setup lang="ts">
// Components
import { IManager } from '@/interfaces/customs/clients/Clients'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'

// Logic Form
import { useManagerInfoForm } from '@/components/Forms/Clients/v2/LegalPerson/Manager/ManagerGenerator/BasicData/BasicDataForm'

// Constants
import { default_statuses } from '@/constants'

// Composables
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    formType: 'create' | 'edit' | 'view'
    data: IManager | null
    isNaturalPerson: boolean
    isLegalPerson: boolean
  }>(),
  {}
)

const {
  formValues,
  formElementRef,
  isAddressGeneratorOpen,
  rulesLegalPersonDocumentType,
  rulesNaturalPersonDocumentType,
  isLegalPersonIndirect,
  onlyLetters,
  isCountry,

  document_types_third_party_natural,
  document_types_third_legal,
  countries,
  departments,
  cities,

  handleAddressSave,
} = useManagerInfoForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
