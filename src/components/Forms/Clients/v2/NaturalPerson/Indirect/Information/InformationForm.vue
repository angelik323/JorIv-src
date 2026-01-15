<template>
  <q-form ref="formInformation" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos generales e información laboral
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de creación"
            :default_value="models.creation_date"
            :required="false"
            disabled
            :rules="[]"
            @update:modelValue="models.creation_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de creación</p>
            <p class="text-weight-medium no-margin">
              {{ models.creation_date ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
        <div class="col-12 col-md-3" v-if="['edit', 'view'].includes(action)">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de cliente"
            :default_value="clientPersonTypeLabel"
            :required="false"
            disabled
            :rules="[]"
            @update:modelValue="models.client_type_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de cliente</p>
            <p class="text-weight-medium no-margin">
              {{ client_person_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de solicitante"
            :manual_option="indirectThirdPartyRequestTypes"
            :map_options="true"
            :required="true"
            :default_value="models.request_type"
            :auto_complete="true"
            @update:modelValue="models.request_type = $event"
            :rules="[(val: string) => useRules().is_required(val)]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de solicitante</p>
            <p class="text-weight-medium no-margin">
              {{ models.request_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="document_types_third_party_natural"
            label="Tipo de documento"
            :map_options="true"
            :required="true"
            :default_value="models.document_type_id"
            :auto_complete="true"
            @update:modelValue="models.document_type_id = $event"
            :rules="[(val: string) => !!val || 'El tipo de documento es requerido']"
            :disabled="'edit'.includes(action)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de documento</p>
            <p class="text-weight-medium no-margin">
              {{ models.document_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Número de documento"
            ref="documentNumberRef"
            :required="
              models.document_type_id !== null && models.document_type_id !== ''
            "
            :default_value="models.document ?? ''"
            :rules="models.document_type_id 
                ? rulesNaturalPersonDocumentType 
                : [
                  (val: string) => useRules().is_required(val)
              ]"
            @update:model-value="models.document = $event"
            @update:blur="validateExistPerson"
            :disabled="'edit'.includes(action)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de documento</p>
            <p class="text-weight-medium no-margin">
              {{ models.document ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Primer nombre"
            required
            :default_value="models.natural_person.name"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().only_letters(val),
              (val: string) => useRules().min_length(val, 2),
              (val: string) => useRules().max_length(val, 100),
              (val: string) => useRules().no_consecutive_spaces(val),
            ]"
            @update:model-value="models.natural_person.name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Primer nombre</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person.name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Segundo nombre"
            :required="models.natural_person.middle_name !== ''"
            :default_value="models.natural_person.middle_name"
            :rules="models.natural_person.middle_name !== '' && models.natural_person.middle_name !== null ? [
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().only_letters(val),
              (val: string) => useRules().min_length(val, 2),
              (val: string) => useRules().max_length(val, 100),
              (val: string) => useRules().no_consecutive_spaces(val),
            ] : []"
            @update:model-value="models.natural_person.middle_name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Segundo nombre</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person.middle_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Primer apellido"
            required
            :default_value="models.natural_person.last_name"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().only_letters(val),
              (val: string) => useRules().min_length(val, 2),
              (val: string) => useRules().max_length(val, 100),
              (val: string) => useRules().no_consecutive_spaces(val),
            ]"
            @update:model-value="models.natural_person.last_name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Primer apellido</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person.last_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Segundo apellido"
            :required="models.natural_person.second_last_name !== ''"
            :default_value="models.natural_person.second_last_name"
            :rules="models.natural_person.second_last_name !== '' && models.natural_person.second_last_name !== null ? [
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().only_letters(val),
              (val: string) => useRules().min_length(val, 2),
              (val: string) => useRules().max_length(val, 100),
              (val: string) => useRules().no_consecutive_spaces(val),
            ]: []"
            @update:model-value="
              models.natural_person!.second_last_name = $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Segundo apellido</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person.second_last_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de expedición"
            :default_value="models.natural_person.expedition_date"
            :required="true"
            @update:modelValue="models.natural_person.expedition_date = $event"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().date_before_or_equal_to_the_current_date(val)
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de expedición</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person.expedition_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de nacimiento"
            :default_value="models.natural_person.birth_date"
            :required="true"
            :option_calendar="getOptionsCalendar"
            @update:modelValue="models.natural_person.birth_date = $event"
            :rules="[
              (val: string) => useRules().is_required(val),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de nacimiento</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person.birth_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País de nacimiento"
            :default_value="models.natural_person.birth_country_id"
            @update:modelValue="models.natural_person.birth_country_id = $event"
            :manual_option="countries"
            first_filter_option="label"
            second_filter_option="label"
            map_options
            auto_complete
            required
            :rules="[
              (val: string) => useRules().is_required(val),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">País de nacimiento</p>
            <p class="text-weight-medium no-margin">
              {{
                countries.find(
                  (e) => e.value === models.natural_person.birth_country_id
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País de ubicación"
            :default_value="models.natural_person.location_country_id"
            @update:modelValue="
              models.natural_person.location_country_id = $event
            "
            :manual_option="countries"
            first_filter_option="label"
            second_filter_option="label"
            map_options
            auto_complete
            required
            :rules="[
              (val: string) => useRules().is_required(val),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">País de ubicación</p>
            <p class="text-weight-medium no-margin">
              {{
                countries.find(
                  (e) => e.value === models.natural_person.location_country
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
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
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País"
            :default_value="models.addresses.country_id"
            :manual_option="countries"
            map_options
            auto_complete
            readonly
            required
            :rules="[(val: string) => useRules().is_required(val)]"
            @click="isAddressGeneratorOpen = true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">País</p>
            <p class="text-weight-medium no-margin">
              {{
                countries.find((e) => e.value === models.addresses.country_id)
                  ?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <template v-if="isCountry(models.addresses?.country_id, 'Colombia')">
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Departamento/Estado"
              :default_value="models.addresses.department_id"
              :manual_option="departments"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => useRules().is_required(val)]"
              @click="isAddressGeneratorOpen = true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Departamento/Estado</p>
              <p class="text-weight-medium no-margin">
                {{ models.addresses.department_id ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Ciudad"
              :default_value="models.addresses.city_id"
              :manual_option="cities"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => useRules().is_required(val)]"
              @click="isAddressGeneratorOpen = true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Ciudad</p>
              <p class="text-weight-medium no-margin">
                {{ models.addresses.city_id ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código postal"
            type="number"
            :required="false"
            :default_value="models.addresses.postal_code"
            :rules="[
              (val: string) => useRules().max_length(val, 16),
            ]"
            @update:model-value="models.addresses.postal_code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código postal</p>
            <p class="text-weight-medium no-margin">
              {{ models.addresses.postal_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Dirección"
            required
            readonly
            :default_value="models.addresses.address"
            :rules="[
              (val: string) => useRules().is_required(val),
            ]"
            @click="isAddressGeneratorOpen = true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Dirección</p>
            <p class="text-weight-medium no-margin">
              {{ models.addresses.address ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Detalle</p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Correo electrónico"
            required
            :default_value="models.contacts[0].contact_value"
            :rules=" [
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().email_validation(val),
              (val: string) => useRules().max_length(val, 50)
            ]"
            @update:model-value="models.contacts[0].contact_value = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Correo electrónico</p>
            <p class="text-weight-medium no-margin">
              {{ models.contacts[0].contact_value ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Número de teléfono
          </p>
          <PhoneInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.contacts[1]?.contact_value"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:model-value="models.contacts[1].contact_value = $event"
          />
          <p v-else class="text-black-90">
            {{ models.contacts[1].contact_value || 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
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
            :default_value="models.contacts[2]?.contact_value"
            :rules="[(val: string) => useRules().is_required(val)]"
            @update:model-value="models.contacts[2].contact_value = $event"
          />
          <p v-else class="text-black-90">
            {{ models.contacts[2].contact_value ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Envío correspondencia"
            :manual_option="correspondence"
            :map_options="true"
            :required="true"
            :default_value="models.sending_correspondence"
            :auto_complete="true"
            @update:modelValue="models.sending_correspondence = $event"
            :rules="[(val: string) => useRules().is_required(val)]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Envío correspondencia</p>
            <p class="text-weight-medium no-margin">
              {{ models.sending_correspondence ?? 'No registrado' }}
            </p>
          </div>
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
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Ocupación y oficio"
            :manual_option="third_party_occupations"
            :map_options="true"
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :default_value="models.employment_info.occupation_id"
            :auto_complete="true"
            @update:modelValue="models.employment_info.occupation_id = $event"
            :rules="[(val: string) => useRules().is_required(val)]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Ocupación y oficio</p>
            <p class="text-weight-medium no-margin">
              {{
                third_party_occupations.find(
                  (e) => e.value === models.employment_info.occupation_id
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Profesión"
            :manual_option="occupations"
            :map_options="true"
            :required="true"
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.employment_info.profession_id"
            :auto_complete="true"
            @update:modelValue="models.employment_info.profession_id = $event"
            :rules="[(val: string) => useRules().is_required(val)]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Profesión</p>
            <p class="text-weight-medium no-margin">
              {{
                occupations.find(
                  (e) => e.value === models.employment_info.profession_id
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Actividad económica"
            :manual_option="ciius"
            :map_options="true"
            :required="true"
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.employment_info.ciiu_id"
            :auto_complete="true"
            @update:modelValue="models.employment_info.ciiu_id = $event"
            :rules="[(val: string) => useRules().is_required(val)]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Actividad económica</p>
            <p class="text-weight-medium no-margin">
              {{
                ciius.find((e) => e.value === models.employment_info.ciiu_id)
                  ?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Empresa donde labora"
            :required="true"
            :default_value="models.employment_info.company"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().min_length(val, 2),
              (val: string) => useRules().max_length(val, 50),
              (val: string) => useRules().no_consecutive_spaces(val),
            ]"
            @update:model-value="models.employment_info.company = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Empresa donde labora</p>
            <p class="text-weight-medium no-margin">
              {{ models.employment_info.company ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Numero de celular{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <PhoneInput
            v-if="['create', 'edit'].includes(action)"
            :rules="[(val: string) => useRules().is_required(val)]"
            :default_value="models.employment_info.phone ?? ''"
            @update:modelValue="models.employment_info.phone = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.employment_info.phone ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País"
            :default_value="models.employment_info.country_id"
            :manual_option="countries"
            map_options
            auto_complete
            readonly
            required
            :rules="[(val: string) => useRules().is_required(val)]"
            @click="isAddressEmploymentOpen = true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">País</p>
            <p class="text-weight-medium no-margin">
              {{
                countries.find(
                  (e) => e.value === models.employment_info.country_id
                )?.label ?? 'No registrado'
              }}
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
              required
              :rules="[(val: string) => useRules().is_required(val)]"
              @click="isAddressEmploymentOpen = true"
            />
            <div v-else class="text-black-90">
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
              required
              :rules="[(val: string) => useRules().is_required(val)]"
              @click="isAddressEmploymentOpen = true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Ciudad</p>
              <p class="text-weight-medium no-margin">
                {{ models.employment_info.city_id ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>

        <div class="col-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Dirección"
            required
            readonly
            :default_value="models.employment_info.address"
            :rules="[
              (val: string) => useRules().is_required(val),
            ]"
            @click="isAddressEmploymentOpen = true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Dirección</p>
            <p class="text-weight-medium no-margin">
              {{ models.employment_info.address ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
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
import { IClientIndirectNaturalBasicForm } from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'
import { ActionType } from '@/interfaces/global'

import { useRules } from '@/composables'

import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'
import useInformationForm from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IClientIndirectNaturalBasicForm | null
    client_person_type?: string
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IClientIndirectNaturalBasicForm | null): void
}>()

const {
  models,
  formInformation,
  document_types_third_party_natural,
  correspondence,
  third_party_occupations,
  occupations,
  countries,
  departments,
  cities,
  ciius,
  rulesNaturalPersonDocumentType,
  isAddressGeneratorOpen,
  isAddressEmploymentOpen,
  documentNumberRef,
  isCountry,
  getOptionsCalendar,
  validateExistPerson,
  searchInCautionList,
  clientPersonTypeLabel,
  client_person_type,
  indirectThirdPartyRequestTypes,
  third_request,
} = useInformationForm(props, emits)

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
