<template>
  <q-form ref="formBasicInformation" class="q-pa-lg">
    <section>
      <p class="text-black-10 text-weight-bold text-h6">Datos generales</p>

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
        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericInput
            v-if="['edit', 'create'].includes(action)"
            label="Fecha de creación"
            :default_value="models.creation_date"
            :required="false"
            disabled
            :rules="[]"
            @update:model-value="models.creation_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de creación</p>
            <p class="text-weight-medium no-margin">
              {{ models.creation_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericInput
            v-if="['edit'].includes(action)"
            label="Tipo de cliente"
            :default_value="models.type_client"
            required
            disabled
            @update:model-value="models.type_client = $event"
          />
          <div v-else-if="['view'].includes(action)" class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de cliente</p>
            <p class="text-weight-medium no-margin">
              {{ models.type_client ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-none">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de solicitante"
            :default_value="models.request_type"
            :manual_option="indirect_third_party_request_types"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El tipo de solicitante es requerido')]"
            @update:modelValue="models.request_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de solicitante</p>
            <p class="text-weight-medium no-margin">
              {{ models.request_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de documento"
            :default_value="models.document_type"
            :manual_option="document_types_third_legal"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :disabled="action === 'edit'"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El tipo de documento es requerido')]"
            @update:modelValue="models.document_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de documento</p>
            <p class="text-weight-medium no-margin">
              {{
                document_types_third_legal.find(
                  (item) => item.value === models.document_type
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :label="`Número de documento${
              models.document_type == 14 ? ' - DV' : ''
            }`"
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
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Número de documento{{ models.document_type == 14 ? ' - DV' : '' }}
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.document_number ?? 'No registrado' }}
              <span v-if="models.document_type == 14">
                - {{ models.check_digit }}</span
              >
            </p>
          </div>
        </div>

        <div v-if="!clientLegalTypeDirect" class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Clasificación de la empresa"
            :default_value="(models as IClientIndirectBasicForm).classification_company"
            :manual_option="legal_people_company_classification"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'La clasificación de la empresa es requerida')]"
            @update:modelValue="
              ;(models as IClientIndirectBasicForm).classification_company =
                $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Clasificación de la empresa
            </p>
            <p class="text-weight-medium no-margin">
              {{
                (models as IClientIndirectBasicForm).classification_company ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Razón social"
            :default_value="models.name"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La razón social es requerida'),
            ]"
            @update:model-value="models.name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Razón social</p>
            <p class="text-weight-medium no-margin">
              {{ models.name ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <p class="text-black-10 text-weight-bold text-h6">Detalle</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Naturaleza"
            :default_value="models.nature_third_party"
            :manual_option="third_party_natures"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'La naturaleza es requerida')]"
            @update:modelValue="models.nature_third_party = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Naturaleza</p>
            <p class="text-weight-medium no-margin">
              {{ models.nature_third_party ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País de constitución"
            :default_value="models.constitution_country"
            :manual_option="countries"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El país de constitución es requerido')]"
            @update:modelValue="models.constitution_country = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">País de constitución</p>
            <p class="text-weight-medium no-margin">
              {{ models.constitution_country ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de constitución"
            :default_value="models.date_incorporation"
            :required="true"
            :rules="[
                  (val: string) => useRules().is_required(val, 'La fecha de constitución es requerida'),
                  (v: string) => useRules().date_before_or_equal_to_the_current_date(v)
                ]"
            @update:modelValue="models.date_incorporation = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de constitución</p>
            <p class="text-weight-medium no-margin">
              {{ models.date_incorporation ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <p class="text-black-10 text-weight-bold text-h6">Datos de contacto</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País"
            :default_value="models.country"
            :manual_option="countries"
            map_options
            auto_complete
            readonly
            required
            :rules="[(val: string) => useRules().is_required(val, 'El país es requerido')]"
            @click="isAddressGeneratorOpen = true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">País</p>
            <p class="text-weight-medium no-margin">
              {{
                countries.find((item) => item.value === models.country)
                  ?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <template v-if="isCountry(models.country, 'Colombia')">
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Departamento/Estado"
              :default_value="models.department"
              :manual_option="departments"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => useRules().is_required(val, 'El departamento es requerido')]"
              @click="isAddressGeneratorOpen = true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Departamento/Estado</p>
              <p class="text-weight-medium no-margin">
                {{
                  departments.find((item) => item.value === models.department)
                    ?.label ?? 'No registrado'
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Ciudad"
              :default_value="models.city"
              :manual_option="cities"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => useRules().is_required(val, 'La ciudad es requerida')]"
              @click="isAddressGeneratorOpen = true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Ciudad</p>
              <p class="text-weight-medium no-margin">
                {{
                  cities.find((item) => item.value === models.city)?.label ??
                  'No registrado'
                }}
              </p>
            </div>
          </div>
        </template>

        <div class="col-xs-12 col-sm-12 col-md-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Dirección"
            :default_value="models.address"
            placeholder="Inserte"
            required
            :rules="[(val: string) => useRules().is_required(val, 'La dirección es requerida')]"
            @click="isAddressGeneratorOpen = true"
            readonly
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Dirección</p>
            <p class="text-weight-medium no-margin">
              {{ models.address ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Correo electrónico"
            type="email"
            :default_value="models.email"
            required
            :rules="[
              (v: string) => useRules().is_required(v, 'El correo electrónico es requerido'),
              (v: string) => useRules().is_email_all_domain_extension(v),
              (v: string) => useRules().max_length(v, 50)
            ]"
            @update:model-value="models.email = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Correo electrónico</p>
            <p class="text-weight-medium no-margin">
              {{ models.email ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <label
            v-if="['create', 'edit'].includes(action)"
            class="text-weight-medium break-word q-ml-sm text-grey-7 col-12"
          >
            Número de celular
          </label>
          <PhoneInput
            v-if="['create', 'edit'].includes(action)"
            :required="false"
            :rules="[
              (val: string) => useRules().max_length(val, 10),
              (val: string) => useRules().min_length(val, 10)
            ]"
            :default_value="models.mobile ?? ''"
            @update:model-value="
                (val: string) => (models.mobile = val)
              "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de celular</p>
            <p class="text-weight-medium no-margin">
              {{ models.mobile ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div v-if="!clientLegalTypeDirect" class="col-xs-12 col-sm-12 col-md-4">
          <label
            v-if="['create', 'edit'].includes(action)"
            class="text-weight-medium break-word q-ml-sm text-grey-7 col-12"
          >
            Número de teléfono fijo
          </label>
          <PhoneInput
            v-if="['create', 'edit'].includes(action)"
            :required="false"
            :rules="[
              (val: string) => useRules().max_length(val, 10),
              (val: string) => useRules().min_length(val, 10)
            ]"
            :default_value="models.phone ?? ''"
            @update:model-value="
                (val: string) => (models.phone = val)
              "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de teléfono fijo</p>
            <p class="text-weight-medium no-margin">
              {{ models.phone ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Envío de correspondencia"
            :default_value="models.sending_correspondence"
            :manual_option="correspondence"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El envío de correspondencia es requerido')]"
            @update:modelValue="models.sending_correspondence = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Envío de correspondencia</p>
            <p class="text-weight-medium no-margin">
              {{ models.sending_correspondence ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div v-if="!clientLegalTypeDirect" class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estado"
            :default_value="(models as IClientIndirectBasicForm).status_id"
            :manual_option="default_statuses"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :disabled="action === 'edit'"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El estado es requerido')]"
            @update:modelValue="
              ;(models as IClientIndirectBasicForm).status_id = $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              {{
                default_statuses.find(
                  (item) =>
                    item.value ===
                    (models as IClientIndirectBasicForm).status_id
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>
  </q-form>

  <AddressGenerator
    v-model:is-open="isAddressGeneratorOpen"
    required
    :departments="departments"
    :countries="countries"
    :rules="[(val: string) => useRules().is_required(val, 'La dirección es requerida')]"
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
//Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'

//Logic Form
import useBasicInformationForm from '@/components/Forms/Clients/v2/LegalPerson/BasicInformation/BasicInformationForm'

//Interfaces
import { ActionType } from '@/interfaces/global'
import { IClientIndirectBasicForm } from '@/interfaces/customs/clients/ClientIndirectLegalPerson'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IClientIndirectBasicForm | null
  }>(),
  {}
)

const emits = defineEmits(['update:basic-data-form'])

const {
  models,
  formBasicInformation,
  documentNumberRef,
  isAddressGeneratorOpen,
  rulesLegalPersonDocumentType,
  clientLegalTypeDirect,

  correspondence,
  default_statuses,
  document_types_third_legal,
  legal_people_company_classification,
  third_party_natures,
  countries,
  cities,
  departments,
  indirect_third_party_request_types,
  third_request,

  useRules,
  isCountry,
  validateExistPerson,
  searchInCautionList,
} = useBasicInformationForm(props, emits)

defineExpose({
  validateForm: async () => {
    const isValid = await formBasicInformation.value?.validate()

    if (props.action === 'create') {
      await validateExistPerson()

      if (!third_request.value) {
        const isValid = await formBasicInformation.value?.validate()

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
