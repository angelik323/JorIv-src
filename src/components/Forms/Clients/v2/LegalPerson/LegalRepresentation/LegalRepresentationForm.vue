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
        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Primer nombre"
            required
            :default_value="models.natural_person?.name"
            :rules="[
              (v: string) => useRules().is_required(v, 'El primer nombre es requerido'),
              (v: string) => useRules().only_letters(v),
              (v: string) => useRules().min_length(v, 3),
              (v: string) => useRules().max_length(v, 60),
              (v: string) => useRules().no_consecutive_spaces(v),
            ]"
            @update:modelValue="
              models.natural_person && (models.natural_person.name = $event)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Primer nombre</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person?.name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Segundo nombre"
            :default_value="models.natural_person?.middle_name"
            :required="false"
            :rules="[
              (v: string) => useRules().only_letters(v),
              (v: string) => useRules().min_length(v, 3),
              (v: string) => useRules().max_length(v, 60),
              (v: string) => useRules().no_consecutive_spaces(v),
            ]"
            @update:modelValue="
              models.natural_person &&
                (models.natural_person.middle_name = $event)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Segundo nombre</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person?.middle_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Primer apellido"
            :default_value="models.natural_person?.last_name"
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El primer apellido es requerido'),
              (v: string) => useRules().only_letters(v),
              (v: string) => useRules().min_length(v, 3),
              (v: string) => useRules().max_length(v, 60),
              (v: string) => useRules().no_consecutive_spaces(v),
            ]"
            @update:modelValue="
              models.natural_person &&
                (models.natural_person.last_name = $event)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Primer apellido</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person?.last_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Segundo apellido"
            required
            :default_value="models.natural_person?.second_last_name"
            :rules="[
              (v: string) => useRules().is_required(v, 'El segundo apellido es requerido'),
              (v: string) => useRules().only_letters(v),
              (v: string) => useRules().min_length(v, 3),
              (v: string) => useRules().max_length(v, 60),
              (v: string) => useRules().no_consecutive_spaces(v),
            ]"
            @update:modelValue="
              models.natural_person &&
                (models.natural_person.second_last_name = $event)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Segundo apellido</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person?.second_last_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de documento"
            :manual_option="document_types_third_party_natural"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.document_type_id"
            :auto_complete="true"
            @update:modelValue="models.document_type_id = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'El tipo de documento es requerido'),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de documento</p>
            <p class="text-weight-medium no-margin">
              {{
                models.document_type_id
                  ? document_types_third_party_natural.find(
                      (d) => d.value === models.document_type_id
                    )?.label ?? 'No registrado'
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Número de documento"
            required
            :default_value="models.document"
            :rules="rulesNaturalPersonDocumentType"
            @update:modelValue="models.document = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de documento</p>
            <p class="text-weight-medium no-margin">
              {{ models.document ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de expedición"
            :default_value="models.natural_person?.issue_date"
            :option_calendar="useCalendarRules().only_until(currentDate)"
            :required="true"
            :rules="[
                (val: string) => useRules().is_required(val, 'La fecha de expedición es requerida'),
                (v: string) => useRules().date_before_or_equal_to_the_current_date(v)
              ]"
            @update:modelValue="
              models.natural_person &&
                (models.natural_person.issue_date = $event)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de expedición</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person?.issue_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País de nacimiento"
            :manual_option="countries"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.natural_person?.birth_country_id"
            :auto_complete="true"
            @update:modelValue="
              models.natural_person &&
                (models.natural_person.birth_country_id = $event)
            "
            :rules="[(v: string) => useRules().is_required(v, 'El país de nacimiento es requerido')]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">País de nacimiento</p>
            <p class="text-weight-medium no-margin">
              {{ models.natural_person?.birth_country_id ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="isLegalPersonIndirect">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Dirección"
            :default_value="models.address"
            placeholder="Inserte"
            required
            readonly
            :rules="[
              (v: string) => useRules().is_required(v, 'La dirección es requerida'),
              (v: string) => useRules().max_length(v, 50),
            ]"
            @click="isAddressRepresentationGeneratorOpen = true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Dirección</p>
            <p class="text-weight-medium no-margin">
              {{ models.address ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País de ubicación"
            :default_value="models.country_id"
            :manual_option="countries"
            map_options
            auto_complete
            readonly
            required
            :rules="[(v: string) => useRules().is_required(v, 'El país es requerido')]"
            @click="isAddressRepresentationGeneratorOpen = true"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.country_id ?? 'No registrado' }}
          </p>
        </div>

        <template v-if="isCountry(models.country_id, 'Colombia')">
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Departamento/Estado"
              :default_value="models.department_id"
              :manual_option="departments"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              :disabled="action === 'edit'"
              :required="true"
              :rules="[(val: string) => useRules().is_required(val, 'El departamento/estado es requerido')]"
              @click="isAddressRepresentationGeneratorOpen = true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Departamento/Estado</p>
              <p class="text-weight-medium no-margin">
                {{ models.department_id ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Ciudad"
              :default_value="models.city_id"
              :manual_option="cities"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              :disabled="action === 'edit'"
              :required="true"
              :rules="[(v: string) => useRules().is_required(v, 'La ciudad es requerida')]"
              @click="isAddressRepresentationGeneratorOpen = true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Ciudad</p>
              <p class="text-weight-medium no-margin">
                {{ models.city_id ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código postal"
            :default_value="models.postal_code"
            placeholder="Inserte"
            required
            :rules="[
              (v: string) => useRules().is_required(v, 'El código postal es requerido'),
              (v: string) => useRules().max_length(v, 16),
            ]"
            @update:model-value="models.postal_code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código postal</p>
            <p class="text-weight-medium no-margin">
              {{ models.postal_code ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-my-sm" />

    <section>
      <RadioYesNo
        v-model="models.tax_info.has_different_nationality"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Tiene nacionalidad diferente a la colombiana?*"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
        @update:model-value="handleHasDifferentNationality($event)"
      />

      <div
        v-if="models.tax_info?.has_different_nationality"
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
      >
        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País"
            :default_value="models.tax_info?.country_id"
            :manual_option="countries"
            map_options
            auto_complete
            required
            :rules="[(v: string) => useRules().is_required(v, 'El país es requerido')]"
            @update:model-value="
              models.tax_info && (models.tax_info.country_id = $event)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">País</p>
            <p class="text-weight-medium no-margin">
              {{ models.tax_info?.country_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Nacionalidad"
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
            :default_value="models.tax_info?.nationality_id"
            :auto_complete="true"
            @update:modelValue="
              models.tax_info && (models.tax_info.nationality_id = $event)
            "
            :rules="[(val: string) => useRules().is_required(val, 'La nacionalidad es requerida')]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nacionalidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.tax_info?.nationality_id ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-my-sm" />

    <section>
      <RadioYesNo
        v-model="models.tax_info.foreign_responsibility"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Tiene responsabilidad tributaria internacional en un país diferente a Colombia?*"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
        @update:model-value="handleForeignResponsibility($event)"
      />

      <div
        v-if="models.tax_info?.foreign_responsibility"
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
      >
        <div class="col-xs-12 col-sm-12 col-md-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Dirección"
            :default_value="models.tax_info?.branch_address"
            placeholder="Inserte"
            readonly
            required
            :rules="[
              (v: string) => useRules().is_required(v, 'La dirección es requerida'),
              (v: string) => useRules().max_length(v, 50),
            ]"
            @click="isAddressDifferentTaxGeneratorOpen = true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Dirección</p>
            <p class="text-weight-medium no-margin">
              {{ models.tax_info?.branch_address ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País tributario"
            :default_value="models.tax_info?.branch_country_id"
            :manual_option="countries"
            map_options
            auto_complete
            readonly
            required
            :rules="[(v: string) => useRules().is_required(v, 'El país es requerido')]"
            @click="isAddressDifferentTaxGeneratorOpen = true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">País tributario</p>
            <p class="text-weight-medium no-margin">
              {{ models.tax_info?.branch_country_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Tin-Número de identificación del contribuyente"
            required
            :default_value="models.tax_info?.tin"
            :rules="[
                (v: string) => useRules().is_required(v, 'El TIN o número de identificación del contribuyente es requerido'),
                (v: string) => useRules().min_length(v, 10),
                (v: string) => useRules().max_length(v, 50),
              ]"
            @update:model-value="
              models.tax_info && (models.tax_info.tin = $event)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Tin-Número de identificación del contribuyente
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.tax_info?.tin ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-mt-sm" />

    <section>
      <RadioYesNo
        v-model="models.pep_info.is_pep"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Es una persona política expuesta?*"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
        @update:model-value="handleIsPep($event)"
      />
      <q-separator class="q-mt-sm" />

      <template v-if="models.pep_info?.is_pep">
        <div class="q-mt-md q-ml-lg">
          <RadioYesNo
            v-model="models.pep_info.is_politician"
            class="q-pl-sm q-pr-lg"
            :isRadioButton="false"
            hasTitle
            title="Político (Según Decreto 830 de 2021)"
            :hasSubtitle="false"
            :is-disabled="['view'].includes(action)"
          />
          <q-separator class="q-mt-sm" />

          <RadioYesNo
            v-model="models.pep_info.is_international_pep"
            class="q-pl-sm q-pr-lg"
            :isRadioButton="false"
            hasTitle
            title="Representante legal de una organización internacional"
            :hasSubtitle="false"
            :is-disabled="['view'].includes(action)"
          />
          <q-separator class="q-mt-sm" />

          <RadioYesNo
            v-model="models.pep_info.is_pep_international"
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
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Cargo"
              :required="!!models.pep_info?.is_pep"
              :default_value="models.pep_info?.position"
              :rules="[
                  (v: string) => useRules().is_required(v, 'Este campo es requerido'),
                  (v: string) => useRules().min_length(v, 5),
                  (v: string) => useRules().max_length(v, 60),
                ]"
              @update:model-value="
                models.pep_info && (models.pep_info.position = $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Cargo</p>
              <p class="text-weight-medium no-margin">
                {{ models.pep_info?.position ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div
            v-if="isLegalPersonIndirect"
            class="col-xs-12 col-sm-12 col-md-3"
          >
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Entidad"
              :required="!!models.pep_info?.is_pep"
              :default_value="models.pep_info.entity"
              :rules="[
                  (v: string) => useRules().is_required(v, 'Este campo es requerido'),
                  (v: string) => useRules().min_length(v, 5),
                  (v: string) =>
                    useRules().max_length(v, 60),
                ]"
              @update:model-value="
                models.pep_info && (models.pep_info.entity = $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Entidad</p>
              <p class="text-weight-medium no-margin">
                {{ models.pep_info?.entity ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              label="Fecha de ingreso al cargo"
              :default_value="models.pep_info?.date_entry"
              :option_calendar="useCalendarRules().only_until(currentDate)"
              :required="!!models.pep_info.is_pep"
              :rules="[
                (v: string) => useRules().is_required(v, 'La fecha de ingreso al cargo es requerida'),
                (v: string) => useRules().date_before_or_equal_to_the_current_date(v)
              ]"
              @update:modelValue="(val: string) => {
                models.pep_info.date_entry = val
                if(!val) models.pep_info.date_exit = null
              }"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Fecha de ingreso al cargo
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.pep_info?.date_entry ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              label="Fecha de retiro del cargo"
              :default_value="models.pep_info?.date_exit"
              :option_calendar="useCalendarRules().only_until(currentDate)"
              :disabled="!models.pep_info?.date_entry"
              :required="models.pep_info?.date_exit ? true : false"
              :rules="
                  models.pep_info?.date_exit ? [
                    (v: string) => useRules().date_after_or_equal_to_specific_date(v,models.pep_info?.date_entry || ''),
                    (v: string) => useRules().date_before_or_equal_to_the_current_date(v),
                    (v: string) => useRules().valid_format_date(v, 'YYYY-MM-DD')
                  ]
                  : []
                "
              @update:modelValue="
                models.pep_info && (models.pep_info.date_exit = $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Fecha de retiro del cargo
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.pep_info?.date_exit ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>
    </section>

    <section>
      <RadioYesNo
        v-model="models.pep_info.has_pep_relatives"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Tiene parentesco con persona expuesta políticamente (PEP)?*"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
        @update:model-value="handleHasPepRelatives($event)"
      />
      <template v-if="models.pep_info.has_pep_relatives">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Nombre completo"
              required
              :default_value="models.pep_info?.relatives?.full_name"
              :rules="[
                    (v: string) => useRules().is_required(v, 'El nombre completo es requerido'),
                    (v: string) => useRules().only_letters(v),
                    (v: string) => useRules().min_length(v, 5),
                    (v: string) => useRules().max_length(v, 60),
                    (v: string) => useRules().no_consecutive_spaces(v),
                  ]"
              @update:model-value="
                models.pep_info?.relatives &&
                  (models.pep_info.relatives.full_name = $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Nombre completo</p>
              <p class="text-weight-medium no-margin">
                {{ models.pep_info?.relatives?.full_name ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Parentesco"
              required
              :default_value="models.pep_info?.relatives?.relationship"
              :rules="[
                    (v: string) => useRules().is_required(v, 'El campo parentesco es requerido'),
                    (v: string) => useRules().only_letters(v),
                    (v: string) => useRules().min_length(v, 5),
                    (v: string) => useRules().max_length(v, 60),
                    (v: string) => useRules().no_consecutive_spaces(v),
                  ]"
              @update:model-value="
                models.pep_info?.relatives &&
                  (models.pep_info.relatives.relationship = $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Parentesco</p>
              <p class="text-weight-medium no-margin">
                {{
                  models.pep_info?.relatives?.relationship ?? 'No registrado'
                }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Cargo que desempeña"
              required
              :default_value="models.pep_info.relatives?.position"
              :rules="[
                    (v: string) => useRules().is_required(v, 'El campo cargo que desempeña es requerido'),
                    (v: string) => useRules().only_letters(v),
                    (v: string) => useRules().min_length(v, 5),
                    (v: string) => useRules().max_length(v, 60),
                    (v: string) => useRules().no_consecutive_spaces(v),
                  ]"
              @update:model-value="
                models.pep_info?.relatives &&
                  (models.pep_info.relatives.position = $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Cargo que desempeña</p>
              <p class="text-weight-medium no-margin">
                {{ models.pep_info.relatives?.position ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div
            v-if="isLegalPersonIndirect"
            class="col-xs-12 col-sm-12 col-md-3"
          >
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Entidad"
              :required="true"
              :default_value="models.pep_info.relatives?.entity"
              :rules="[
                  (v: string) => useRules().is_required(v, 'El campo entidad es requerido'),
                  (v: string) => useRules().min_length(v, 5),
                  (v: string) => useRules().max_length(v, 60),
                ]"
              @update:model-value="
                models.pep_info?.relatives &&
                  (models.pep_info.relatives.entity = $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Entidad</p>
              <p class="text-weight-medium no-margin">
                {{ models.pep_info?.relatives?.entity ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
        <q-separator class="q-mt-sm" />
      </template>
    </section>

    <section v-if="isLegalPersonIndirect">
      <RadioYesNo
        v-model="models.has_beneficiary_treatment"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Tiene tratamiento de beneficiario final?*"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
        @update:model-value="handleHasBeneficiaryTreatment($event)"
      />

      <div
        v-if="models.has_beneficiary_treatment"
        class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md"
      >
        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha desde la calidad de beneficiario final"
            :default_value="models.beneficiary_date"
            :option_calendar="useCalendarRules().only_until(currentDate)"
            :required="true"
            :rules="[
              (v: string) =>
                useRules().date_before_or_equal_to_the_current_date(v),
              (v: string) => useRules().valid_format_date(v, 'YYYY-MM-DD')
              ]"
            @update:modelValue="models.beneficiary_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Fecha desde la calidad de beneficiario final
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.beneficiary_date ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['edit'].includes(action)"
            label="Estado"
            :default_value="models.status_id"
            :manual_option="default_statuses"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :disabled="true"
            :required="false"
            :rules="[]"
            @update:modelValue="models.status_id = $event"
          />
          <div v-else-if="['view'].includes(action)" class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              {{
                default_statuses.find((item) => item.value === models.status_id)
                  ?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <div
      v-if="isLegalPersonIndirect"
      class="flex justify-center q-mt-md q-gutter-md"
    >
      <Button
        label="Cancelar"
        size="md"
        unelevated
        :outline="true"
        color="orange"
        class="text-capitalize btn-filter custom"
        @click="$emit('close:modal')"
      />
      <Button
        label="Continuar"
        size="md"
        unelevated
        :outline="false"
        color="orange"
        class="text-capitalize btn-filter custom"
        @click="onSubmit"
      />
    </div>
  </q-form>

  <AddressGenerator
    v-model:is-open="isAddressRepresentationGeneratorOpen"
    required
    :departments="departments"
    :countries="countries"
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :location-to-edit="{
      address: models.address || '',
      country: {
        id: models.country_id ? Number(models.country_id) : null,
      },
      department: { id: Number(models.department_id) },
      city: { id: Number(models.city_id) },
    }"
    @save="handleAddressSave"
  />

  <AddressGenerator
    v-model:is-open="isAddressDifferentTaxGeneratorOpen"
    required
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :countries="
      countries.filter((country) => country.label.toLowerCase() !== 'colombia')
    "
    :location-to-edit="{
      address: models.tax_info?.branch_address || '',
      country: {
        id: models.tax_info?.branch_country_id
          ? Number(models.tax_info.branch_country_id)
          : null,
      },
    }"
    @save="handleTaxAddressSave"
  />
</template>

<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic form
import useLegalRepresentationForm from '@/components/Forms/Clients/v2/LegalPerson/LegalRepresentation/LegalRepresentationForm'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IBaseLegalRepresentationItem } from '@/interfaces/customs/clients/Clients'

// Constants
import { default_statuses } from '@/constants'

const props = defineProps<{
  action: ActionType
  legalRepresentationDataForm: IBaseLegalRepresentationItem | null
}>()

const emit = defineEmits<{
  (e: 'close:modal'): void
  (e: 'update:table', data: IBaseLegalRepresentationItem): void
  (
    e: 'update:legal-representation-data-form',
    data: IBaseLegalRepresentationItem
  ): void
}>()

const {
  models,
  formLegalRepresentation,
  isLegalPersonIndirect,
  isCountry,
  currentDate,
  useRules,
  useCalendarRules,

  document_types_third_party_natural,
  countries,
  departments,
  cities,
  nationalities,

  isAddressRepresentationGeneratorOpen,
  isAddressDifferentTaxGeneratorOpen,
  rulesNaturalPersonDocumentType,

  onSubmit,
  handleAddressSave,
  handleTaxAddressSave,
  handleHasDifferentNationality,
  handleForeignResponsibility,
  handleIsPep,
  handleHasPepRelatives,
  handleHasBeneficiaryTreatment,
} = useLegalRepresentationForm(props, emit)

defineExpose({
  validateForm: () => formLegalRepresentation.value?.validate(),
})
</script>
