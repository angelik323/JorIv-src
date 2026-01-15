<template>
  <q-form ref="formInformation" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos generales
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos generales para crear su nuevo cliente como
          persona jurídica.
        </p>
      </div>

      <template v-if="!['create'].includes(action)">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mb-lg">
          <div class="col-12 col-md-3">
            <p class="text-weight-medium mb-0 text-grey-6">Fecha de creación</p>
            <p class="text-grey-6 mb-0">
              {{ models.creation_date ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-medium mb-0 text-grey-6">Creado por</p>
            <p class="text-grey-6 mb-0">
              {{ models.created_by ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-12 col-md-3"
            v-show="
              models.updated_date &&
              models.updated_date !== models.creation_date
            "
          >
            <p class="text-weight-medium mb-0 text-grey-6">
              Fecha de actualización
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.updated_date ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-12 col-md-3"
            v-show="
              models.updated_date &&
              models.updated_date !== models.creation_date
            "
          >
            <p class="text-weight-medium mb-0 text-grey-6">Actualizado por</p>
            <p class="text-grey-6 mb-0">
              {{ models.updated_by ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </template>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div v-if="['create'].includes(action)" class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha de creación{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <div
            v-if="['create', 'edit'].includes(action)"
            class="q-field--with-bottom"
          >
            <GenericInput
              :default_value="models.creation_date"
              :required="false"
              disabled
              :rules="[]"
              @update:modelValue="models.creation_date = $event"
            />
          </div>
          <p v-else class="text-grey-6 mb-0">
            {{ models.creation_date ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha de constitución{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.date_incorporation"
            :required="true"
            :rules="[
                  (val: string) => !!val || 'La fecha de constitución es requerida',
                  (v: string) => date_before_or_equal_to_the_current_date(v)
                ]"
            @update:modelValue="models.date_incorporation = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.date_incorporation ?? 'No registrado' }}
          </p>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-none">
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-10'
            "
          >
            Tipo de solicitante{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="third_party_request_types"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.application_type"
            :auto_complete="true"
            @update:modelValue="models.application_type = $event"
            :rules="[(val: string) => !!val || 'El tipo de solicitante es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.application_type ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Tipo de documento{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="document_types_third_legal"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.document_type"
            :auto_complete="true"
            @update:modelValue="models.document_type = $event"
            @update:blur="validateExistPerson"
            :rules="[(val: string) => !!val || 'El tipo de documento es requerido']"
            :disabled="'edit'.includes(action)"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.document_type ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Número de documento {{ models.document_type == 14 ? '- DV' : '' }}
            {{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            ref="documentNumberRef"
            required
            :default_value="models.document_number"
            :rules="rulesLegalPersonDocumentType"
            @update:model-value="models.document_number = $event"
            @update:blur="validateExistPerson"
            :disabled="'edit'.includes(action)"
          >
            <template v-if="models.document_type == 14" #after>
              <q-input
                outlined
                dense
                disable
                v-model="models.check_digit"
                style="max-width: 35px"
              />
            </template>
          </GenericInput>
          <p v-else class="text-grey-6 mb-0">
            {{ models.document_number ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Correo electrónico{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.email"
            type="email"
            :rules=" [
                (v: string) => useRules().is_required(v), 
                (v: string) => useRules().email_validation(v), 
                (v: string) => useRules().max_length(v, 254)
              ]"
            @update:model-value="models.email = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.email ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Número de celular{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <PhoneInput
            v-if="['create', 'edit'].includes(action)"
            :rules="[(val: string) => useRules().is_required(val, 'El número de celular es requerido') ]"
            :default_value="models.phone ?? ''"
            @update:model-value="
                (val: string) => (models.phone = val)
              "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.phone ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Envío correspondencia
            {{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="correspondence"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.sending_correspondence"
            :auto_complete="true"
            @update:modelValue="models.sending_correspondence = $event"
            :rules="[(val: string) => !!val || 'El envío de correspondencia es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.sending_correspondence ?? 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Razón social
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Nombre o razón social{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.name"
            required
            :rules="[
                (v: string) => useRules().is_required(v),
                (v: string) => useRules().max_length(v, 150)
              ]"
            @update:model-value="models.name = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.name ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Naturaleza{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="third_party_natures"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.nature"
            :auto_complete="true"
            @update:modelValue="models.nature = $event"
            :rules="[(val: string) => !!val || 'La naturaleza es requerida']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.nature ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            País de constitución{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="countries"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.constitution_country"
            :auto_complete="true"
            @update:modelValue="models.constitution_country = $event"
            :rules="[(val: string) => !!val || 'El país es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.constitution_country ?? 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Dirección
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium q-mb-none"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            País{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.country"
            :manual_option="countries"
            map_options
            auto_complete
            readonly
            required
            :rules="[(val: string) => !!val || 'El país es requerido']"
            @click="isAddressGeneratorOpen = true"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.country ?? 'No registrado' }}
          </p>
        </div>

        <template v-if="isCountry(models.country, 'Colombia')">
          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium q-mb-none"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Departamento/Estado{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.department"
              :manual_option="departments"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => !!val || 'El departamento es requerido']"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.department ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium q-mb-none"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Ciudad{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.city"
              :manual_option="cities"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => !!val || 'La ciudad es requerida']"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.city ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <div class="col-12">
          <p
            class="text-weight-medium q-mb-none"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Dirección{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <q-input
            v-if="['create', 'edit'].includes(action)"
            :model-value="models.address"
            placeholder="Inserte"
            dense
            outlined
            readonly
            required
            :rules="[(val: string) => !!val || 'La dirección es requerida']"
            class="full-width"
            @click="isAddressGeneratorOpen = true"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.address ?? 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>
  </q-form>

  <AddressGenerator
    v-model:is-open="isAddressGeneratorOpen"
    required
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :locationToEdit="{
      address: models.address || '',
      country: { id: models.country ? Number(models.country) : null },
      department: { id: Number(models.department) },
      city: { id: Number(models.city) },
    }"
    @save="
      ($event: any) => {
        models.address = $event.address ?? null
        models.country = $event.country?.id ?? null
        models.department = $event.department?.id ?? null
        models.city = $event.city?.id ?? null
      }
    "
  />
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'
import useInformationForm from './InformationForm'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formInformation,
  third_party_request_types,
  document_types_third_legal,
  correspondence,
  countries,
  departments,
  cities,
  rulesLegalPersonDocumentType,
  third_party_natures,
  isAddressGeneratorOpen,
  documentNumberRef,
  date_before_or_equal_to_the_current_date,
  third_request,

  isCountry,
  validateExistPerson,
  searchInCautionList,
} = useInformationForm(props)

defineExpose({
  validateForm: async () => {
    const isValid = await formInformation.value?.validate()

    if (props.action === 'create') {
      await validateExistPerson()

      if (!third_request.value) {
        const isValid = await formInformation.value?.validate()

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
