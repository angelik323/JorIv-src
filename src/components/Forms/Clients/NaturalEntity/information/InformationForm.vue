<template>
  <q-form ref="formInformation" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos generales e información laboral
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos generales e información laboral para crear su
          nuevo cliente como persona natural.
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
        <div v-if="['create'].includes(action)" class="col-12 col-md-3">
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
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-none">
        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
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
            :default_value="models.application_type"
            :auto_complete="true"
            @update:modelValue="models.application_type = $event"
            :rules="[(val: string) => !!val || 'El tipo de solicitante es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.application_type ?? 'No registrado' }}
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
            :default_value="models.document_type_id"
            :auto_complete="true"
            @update:modelValue="models.document_type_id = $event"
            :rules="[(val: string) => !!val || 'El tipo de documento es requerido']"
            :disabled="'edit'.includes(action)"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.document_type ?? 'No registrado' }}
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
            ref="documentNumberRef"
            :required="
              models.document_type_id !== null && models.document_type_id !== ''
            "
            :default_value="models.document ?? ''"
            :rules="models.document_type_id 
                ? rulesNaturalPersonDocumentType 
                : [
                  (v: string) => !!v || 'El número de documento es requerido'
              ]"
            @update:model-value="models.document = $event"
            @update:blur="validateExistPerson"
            :disabled="'edit'.includes(action)"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.document ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3 q-pa-none"></div>

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
            :default_value="models.natural_person.name"
            :rules="[
                (v: string) => !!v || 'El nombre es requerido',
                (v: string) =>
                  /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 100 || 'Debe contener como máximo 100 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
              ]"
            @update:model-value="models.natural_person.name = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.natural_person.name ?? 'No registrado' }}
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
            :required="models.natural_person.middle_name !== ''"
            :default_value="models.natural_person.middle_name"
            :rules="models.natural_person.middle_name !== '' && models.natural_person.middle_name !== null ? [
                (v: string) =>
                  /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 100 || 'Debe contener como máximo 100 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
              ] : []"
            @update:model-value="models.natural_person.middle_name = $event"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ models.natural_person.middle_name || 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Primer Apellido{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.natural_person.last_name"
            :rules="[
                (v: string) => !!v || 'El apellido es requerido',
                (v: string) =>
                  /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 100 || 'Debe contener como máximo 100 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
              ]"
            @update:model-value="models.natural_person.last_name = $event"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ models.natural_person.last_name ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Segundo Apellido
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :required="models.natural_person.second_last_name !== ''"
            :default_value="models.natural_person.second_last_name"
            :rules="models.natural_person.second_last_name !== '' && models.natural_person.second_last_name !== null ? [
                (v: string) => !!v || 'El segundo apellido es requerido',
                (v: string) =>
                  /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                (v: string) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 100 || 'Debe contener como máximo 100 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
              ]: []"
            @update:model-value="
              models.natural_person!.second_last_name = $event
            "
          />

          <p v-else class="text-grey-6 mb-0">
            {{ models.natural_person.second_last_name || 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha de nacimiento{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.natural_person.birth_date"
            :required="true"
            :option_calendar="getOptionsCalendar"
            @update:modelValue="models.natural_person.birth_date = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de nacimiento es requerida'),
            ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.natural_person.birth_date ?? 'No registrado' }}
          </p>
        </div>

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
            :manual_option="nationalities"
            :map_options="true"
            :first_filter_option="'label'"
            :second_filter_option="'code'"
            :required="true"
            :default_value="models.nacionality"
            :auto_complete="true"
            @update:modelValue="models.nacionality = $event"
            :rules="[(val: string) => !!val || 'La nacionalidad es requerida']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.nacionality ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4 col-lg-3">
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
            :default_value="models.contacts[0].contact_value"
            :rules=" [
                (v: string) => useRules().is_required(v), 
                (v: string) => useRules().email_validation(v), 
                (v: string) => useRules().max_length(v, 254)
              ]"
            @update:model-value="models.contacts[0].contact_value = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.contacts[0].contact_value ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4 col-lg-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Número de teléfono fijo
          </p>
          <GenericInput
            ref="fixedPhoneRef"
            v-if="['create', 'edit'].includes(action)"
            :required="!!models.contacts[1].contact_value"
            :default_value="models.contacts[1].contact_value"
            type="number"
            :rules="models.contacts[1].contact_value ? [
                  (v: string) =>
                    v.length === 10 || 'Debe contener 10 caracteres',
                  (v: string) =>
                  /^\d*$/.test(v) ||
                  'Solo se permiten numeros',
              ] : []"
            :max_length="'10'"
            @update:model-value="models.contacts[1].contact_value = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.contacts[1].contact_value || 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4 col-lg-3">
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
            :default_value="models.contacts[2]?.contact_value ?? ''"
            :rules="[(val: string) => useRules().is_required(val, 'El número de celular es requerido')]"
            @update:model-value="
                (val: string) => (models.contacts[2].contact_value = val)
              "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.contacts[2].contact_value ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4 col-lg-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Envío correspondencia{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="correspondence"
            :map_options="true"
            :required="true"
            :default_value="models.sending_correspondence"
            :auto_complete="true"
            @update:modelValue="models.sending_correspondence = $event"
            :rules="[(val: string) => !!val || 'El envío de correspondencia es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.sending_correspondence || 'No registrado' }}
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
            :default_value="models.addresses.country_id"
            :manual_option="countries"
            map_options
            auto_complete
            readonly
            required
            :rules="[(val: string) => !!val || 'El país es requerido']"
            @click="isAddressGeneratorOpen = true"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.addresses.country_id ?? 'No registrado' }}
          </p>
        </div>

        <template v-if="isCountry(models.addresses?.country_id, 'Colombia')">
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
              :default_value="models.addresses.department_id"
              :manual_option="departments"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => !!val || 'El departamento es requerido']"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.addresses.department_id ?? 'No registrado' }}
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
              :default_value="models.addresses.city_id"
              :manual_option="cities"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => !!val || 'La ciudad es requerida']"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.addresses.city_id ?? 'No registrado' }}
            </p>
          </div>
        </template>

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
            :model-value="models.addresses.address"
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
            {{ models.addresses.address ?? 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información laboral
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Ocupación y oficio{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="third_party_occupations"
            :map_options="true"
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :default_value="models.employment_info.occupation_id"
            :auto_complete="true"
            @update:modelValue="models.employment_info.occupation_id = $event"
            :rules="[(val: string) => !!val || 'La ocupación es requerida']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.employment_info.occupation_id ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Actividad económica"
            :manual_option="ciius"
            :map_options="true"
            first_filter_option="label"
            second_filter_option="label"
            :required="requiredJobFields"
            :default_value="models.employment_info.ciiu_code"
            :auto_complete="true"
            @update:modelValue="models.employment_info.ciiu_code = $event"
            :rules="requiredJobFields ? [(val: string) => useRules().is_required(val)] : []"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Actividad económica</p>
            <p class="text-weight-medium no-margin">
              {{ models.employment_info.ciiu_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Empresa donde labora"
            :required="requiredJobFields"
            :default_value="models.employment_info.company"
            :rules="requiredJobFields ? [
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().min_length(val, 2),
              (val: string) => useRules().max_length(val, 50),
              (val: string) => useRules().no_consecutive_spaces(val),
            ] : []"
            @update:model-value="models.employment_info.company = $event"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Empresa donde labora</p>
            <p class="text-weight-medium no-margin">
              {{ models.employment_info.company ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Dirección laboral
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País"
            :default_value="models.employment_info.country_id"
            :manual_option="countries"
            map_options
            auto_complete
            readonly
            :required="requiredJobFields"
            :rules="requiredJobFields ? [(val: string) => useRules().is_required(val)] : []"
            @click="isAddressEmploymentOpen = true"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">País</p>
            <p class="text-weight-medium no-margin">
              {{ models.employment_info.country_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <template
          v-if="isCountry(models.employment_info?.country_id, 'Colombia')"
        >
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Departamento/Estado"
              :default_value="models.employment_info.department_id"
              :manual_option="departments"
              map_options
              auto_complete
              readonly
              :required="requiredJobFields"
              :rules="requiredJobFields ? [(val: string) => useRules().is_required(val)] : []"
              @click="isAddressEmploymentOpen = true"
            />
            <div v-else class="text-black-90 q-mt-md">
              <p class="text-weight-bold no-margin">Departamento/Estado</p>
              <p class="text-weight-medium no-margin">
                {{ models.employment_info.department_id ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Ciudad"
              :default_value="models.employment_info.city_id"
              :manual_option="cities"
              map_options
              auto_complete
              readonly
              :required="requiredJobFields"
              :rules="requiredJobFields ? [(val: string) => useRules().is_required(val)] : []"
              @click="isAddressEmploymentOpen = true"
            />
            <div v-else class="text-black-90 q-mt-md">
              <p class="text-weight-bold no-margin">Ciudad</p>
              <p class="text-weight-medium no-margin">
                {{ models.employment_info.city_id ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>

        <div class="col-12 q-mt-sm">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Dirección"
            :default_value="models.employment_info.address"
            readonly
            :required="requiredJobFields"
            :rules="requiredJobFields ? [(val: string) => useRules().is_required(val)] : []"
            @click="isAddressEmploymentOpen = true"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Dirección</p>
            <p class="text-weight-medium no-margin">
              {{ models.employment_info.address ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Número de contacto{{
              ['create', 'edit'].includes(action) && requiredJobFields
                ? '*'
                : ''
            }}
          </p>
          <PhoneInput
            v-if="['create', 'edit'].includes(action)"
            :required="requiredJobFields"
            :rules="requiredJobFields ? [(val: string) => useRules().is_required(val)] : []"
            :default_value="models.employment_info.phone ?? ''"
            @update:model-value="
                (val: string) => (models.employment_info.phone = val)
              "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.employment_info!.phone ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Profesión"
            :manual_option="occupations"
            :map_options="true"
            :required="requiredJobFields"
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.employment_info.profession_id"
            :auto_complete="true"
            @update:modelValue="models.employment_info.profession_id = $event"
            :rules="requiredJobFields ? [(val: string) => useRules().is_required(val)] : []"
          />
          <div v-else class="text-black-90 q-mt-md">
            <p class="text-weight-bold no-margin">Profesión</p>
            <p class="text-weight-medium no-margin">
              {{ models.employment_info.profession_id ?? 'No registrado' }}
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
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :locationToEdit="{
      address: models.addresses.address || '',
      country: {
        id: models.addresses.country_id
          ? Number(models.addresses.country_id)
          : null,
      },
      department: { id: Number(models.addresses.department_id) },
      city: { id: Number(models.addresses.city_id) },
    }"
    @save="
      ($event: any) => {
        models.addresses.address = $event.address ?? null
        models.addresses.country_id = $event.country?.id ?? null
        models.addresses.department_id = $event.department?.id ?? null
        models.addresses.city_id = $event.city?.id ?? null
      }
    "
  />

  <AddressGenerator
    v-model:is-open="isAddressEmploymentOpen"
    required
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :locationToEdit="{
      address: models.employment_info.address || '',
      country: {
        id: models.employment_info.country_id
          ? Number(models.employment_info.country_id)
          : null,
      },
      department: { id: Number(models.employment_info.department_id) },
      city: { id: Number(models.employment_info.city_id) },
    }"
    @save="
      ($event: any) => {
        models.employment_info.address = $event.address ?? null
        models.employment_info.country_id = $event.country?.id ?? null
        models.employment_info.department_id = $event.department?.id ?? null
        models.employment_info.city_id = $event.city?.id ?? null
      }
    "
  />
</template>

<script setup lang="ts">
import { IClientNaturalPersonRequest } from '@/interfaces/customs/Clients'
import { ActionType } from '@/interfaces/global'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'
import useInformationForm from './InformationForm'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IClientNaturalPersonRequest | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formInformation,
  third_party_request_types,
  document_types_third_party_natural,
  correspondence,
  third_party_occupations,
  occupations,
  ciius,
  nationalities,
  countries,
  departments,
  cities,
  rulesNaturalPersonDocumentType,
  fixedPhoneRef,
  isAddressGeneratorOpen,
  isAddressEmploymentOpen,
  documentNumberRef,
  requiredJobFields,
  third_request,

  isCountry,
  getOptionsCalendar,
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
