<template>
  <q-form ref="formLegalRepresentation" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Representante legal
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos generales del representante legal de su nuevo
          cliente como persona jurídica.
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Primer nombre{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.first_name_representation"
            :rules="[
                (v: string) => useRules().is_required(v, 'El primer nombre es requerido'),
                (v: string) => useRules().only_letters(v),
                (v: string) => useRules().min_length(v, 2),
                (v: string) => useRules().max_length(v, 50),
                (v: string) => useRules().no_consecutive_spaces(v),
            ]"
            @update:model-value="models.first_name_representation = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.first_name_representation ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Segundo nombre
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.second_name_representation"
            :required="models.second_name_representation ? true : false"
            :rules="
                models.second_name_representation
                  ? [
                      (v: string) =>
                        /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                      (v: string) =>
                        v.length >= 2 || 'Debe contener al menos 2 caracteres',
                      (v: string) =>
                        v.length <= 50 ||
                        'Debe contener como máximo 50 caracteres',
                      (v: string) =>
                        !/\s{2,}/.test(v) ||
                        'No debe contener espacios consecutivos',
                    ]
                  : []
              "
            @update:model-value="models.second_name_representation = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.second_name_representation ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Primer apellido{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.first_lastname_representation"
            :rules="[
                (v: string) => !!v || 'El primer apellido es requerido',
                (v: string) =>
                  /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 50 || 'Debe contener como máximo 50 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
              ]"
            @update:model-value="models.first_lastname_representation = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.first_lastname_representation ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Segundo apellido
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.second_lastname_representation"
            :required="models.second_lastname_representation ? true : false"
            :rules="
                models.second_lastname_representation
                  ? [
                      (v: string) =>
                        /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                      (v: string) =>
                        v.length >= 2 || 'Debe contener al menos 2 caracteres',
                      (v: string) =>
                        v.length <= 50 ||
                        'Debe contener como máximo 50 caracteres',
                      (v: string) =>
                        !/\s{2,}/.test(v) ||
                        'No debe contener espacios consecutivos',
                    ]
                  : []
              "
            @update:model-value="models.second_lastname_representation = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.second_lastname_representation ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
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
            :manual_option="document_types_third_party_natural"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.document_type_representation"
            :auto_complete="true"
            @update:modelValue="models.document_type_representation = $event"
            :rules="[(val: string) => !!val || 'El tipo de documento es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.document_type_representation ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Número de documento{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.document_number_representation"
            :rules="rulesNaturalPersonDocumentType"
            @update:model-value="models.document_number_representation = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.document_number_representation ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha de expedición{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.date_issue_representation"
            :required="true"
            :rules="[
                (val: string) => !!val || 'La fecha de expedición es requerida',
                (v: string) => date_before_or_equal_to_the_current_date(v)
              ]"
            @update:modelValue="models.date_issue_representation = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.date_issue_representation ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            País de nacimiento{{
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
            :default_value="models.country_birth_representation"
            :auto_complete="true"
            @update:modelValue="models.country_birth_representation = $event"
            :rules="[(val: string) => !!val || 'El país de nacimiento es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.country_birth_representation ?? 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section>
      <RadioYesNo
        v-model="models.different_nactionality_representation"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Tiene nacionalidad diferente a la colombiana?"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />

      <template v-if="models.different_nactionality_representation">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Nacionalidad{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="
                nationalities.filter(
                  (nationality) =>
                    nationality.label.toLowerCase() !== 'colombiano'
                )
              "
              :map_options="true"
              :required="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :default_value="models.nacionality_representation"
              :auto_complete="true"
              @update:modelValue="models.nacionality_representation = $event"
              :rules="[(val: string) => !!val || 'La nacionalidad es requerida']"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.nacionality_representation ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </template>

      <q-separator class="q-mt-sm" />

      <RadioYesNo
        v-model="models.different_tax_liability_representation"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Tiene responsabilidad tributaria internacional en un solo país diferente a Colombia?"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />

      <template v-if="models.different_tax_liability_representation">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12 col-md-6">
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
              :default_value="models.country_representation"
              :manual_option="countries"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => !!val || 'El país es requerido']"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.country_representation ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Tin-Número de identificación del contribuyente{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              required
              :default_value="models.nit_taxpayer_representation"
              :rules="[
                (v: string) => !!v || 'El TIN o número de identificación del contribuyente es requerido',
                (v: string) => v.length <= 50 || 'Debe contener como máximo 50 caracteres',
              ]"
              @update:model-value="models.nit_taxpayer_representation = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.nit_taxpayer_representation ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Dirección{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <q-input
              v-if="['create', 'edit'].includes(action)"
              :model-value="models.address_representation"
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
              {{ models.address_representation ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </template>
      <q-separator class="q-mt-sm" />
    </section>

    <section>
      <RadioYesNo
        v-model="models.is_pep"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Es una persona política expuesta?"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <template v-if="models.is_pep">
        <div class="q-mt-md q-ml-lg">
          <RadioYesNo
            v-model="models.is_politician_representation"
            class="q-pl-sm q-pr-lg"
            :isRadioButton="false"
            hasTitle
            title="Político (Según Decreto 830 de 2021)"
            :hasSubtitle="false"
            :is-disabled="['view'].includes(action)"
          />
          <q-separator class="q-mt-sm" />

          <RadioYesNo
            v-model="models.is_international_entity_representation"
            class="q-pl-sm q-pr-lg"
            :isRadioButton="false"
            hasTitle
            title="Representante legal de una organización internacional"
            :hasSubtitle="false"
            :is-disabled="['view'].includes(action)"
          />
          <q-separator class="q-mt-sm" />

          <RadioYesNo
            v-model="models.is_international_pep_representation"
            class="q-pl-sm q-pr-lg"
            :isRadioButton="false"
            hasTitle
            title="PEP Internacional"
            :hasSubtitle="false"
            :is-disabled="['view'].includes(action)"
          />
          <q-separator class="q-mt-sm" />
        </div>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Cargo y entidad{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="!!models.is_pep"
              :default_value="models.position_entity_representation"
              :rules="[
                  (v: string) => !!v || 'Este campo es requerido',
                  (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                  (v: string) =>
                    v.length <= 50 || 'Debe contener como máximo 50 caracteres',
                ]"
              @update:model-value="
                models.position_entity_representation = $event
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.position_entity_representation ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Fecha de ingreso al cargo{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.date_entry_position_representation"
              :required="!!models.is_pep"
              :rules="[
                (v: string) => !!v || 'La fecha de ingreso al cargo es requerida',
                (v: string) => date_before_or_equal_to_the_current_date(v)
              ]"
              @update:modelValue="(val: string) => {
                models.date_entry_position_representation = val
                if(!val) models.date_retirement_position_representation = null
              }"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.date_entry_position_representation ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Fecha de retiro del cargo (Cuando aplique)
            </p>
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.date_retirement_position_representation"
              :required="
                models.date_retirement_position_representation ? true : false
              "
              :disabled="!models.date_entry_position_representation"
              :rules="
                  models.date_retirement_position_representation ? [
                    (v: string) => date_after_or_equal_to_specific_date(v,models.date_entry_position_representation || '' ),
                  ]
                  : []
                "
              @update:modelValue="
                models.date_retirement_position_representation = $event
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                models.date_retirement_position_representation ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>
    </section>

    <section>
      <RadioYesNo
        v-model="models.family_member_second_degree_representation"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Es familiar, hasta segundo grado de consanguinidad, afininidad o civil de una persona expuesta politicamente?*"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <template v-if="models.family_member_second_degree_representation">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Nombre completo{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              required
              :default_value="models.name_family_representation"
              :rules="[
                    (v: string) => !!v || 'El nombre es requerido',
                    (v: string) =>
                      /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                    (v: string) =>
                      v.length >= 2 || 'Debe contener al menos 2 caracteres',
                    (v: string) =>
                      v.length <= 50 ||
                      'Debe contener como máximo 50 caracteres',
                    (v: string) =>
                      !/\s{2,}/.test(v) ||
                      'No debe contener espacios consecutivos',
                  ]"
              @update:model-value="models.name_family_representation = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.name_family_representation ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Parentesco{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              required
              :default_value="models.relationship_family_representation"
              :rules="[
                    (v: string) => !!v || 'El parentesco es requerido',
                    (v: string) =>
                      /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                    (v: string) =>
                      v.length >= 2 || 'Debe contener al menos 2 caracteres',
                    (v: string) =>
                      v.length <= 50 ||
                      'Debe contener como máximo 50 caracteres',
                    (v: string) =>
                      !/\s{2,}/.test(v) ||
                      'No debe contener espacios consecutivos',
                  ]"
              @update:model-value="
                models.relationship_family_representation = $event
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.relationship_family_representation ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Cargo que desempeña{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              required
              :default_value="models.position_family_representation"
              :rules="[
                    (v: string) => !!v || 'El cargo es requerido',
                    (v: string) =>
                      /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                    (v: string) =>
                      v.length >= 2 || 'Debe contener al menos 2 caracteres',
                    (v: string) =>
                      v.length <= 50 ||
                      'Debe contener como máximo 50 caracteres',
                    (v: string) =>
                      !/\s{2,}/.test(v) ||
                      'No debe contener espacios consecutivos',
                  ]"
              @update:model-value="
                models.position_family_representation = $event
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.position_family_representation ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>
    </section>
  </q-form>

  <AddressGenerator
    v-model:is-open="isAddressGeneratorOpen"
    required
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :countries="
      countries.filter((country) => country.label.toLowerCase() !== 'colombia')
    "
    :locationToEdit="{
      address: models.address_representation || '',
      country: {
        id: models.country_representation
          ? Number(models.country_representation)
          : null,
      },
      department: { id: Number(models.department_representation) },
      city: { id: Number(models.city_representation) },
    }"
    @save="
      ($event: any) => {
        models.address_representation = $event.address ?? null
        models.country_representation = $event.country?.id ?? null
        models.department_representation = $event.department?.id ?? null
        models.city_representation = $event.city?.id ?? null
      }
    "
  />
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import useLegalRepresentationForm from './LegalRepresentationForm'
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
  formLegalRepresentation,
  document_types_third_party_natural,
  countries,
  nationalities,
  rulesNaturalPersonDocumentType,
  isAddressGeneratorOpen,
  date_before_or_equal_to_the_current_date,
  date_after_or_equal_to_specific_date,
} = useLegalRepresentationForm(props)

defineExpose({
  validateForm: () => formLegalRepresentation.value?.validate(),
})
</script>
