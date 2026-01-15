<template>
  <div>
    <!-- Título -->
    <div class="text-start q-mb-lg">
      <h2 class="text-body1 text-dark text-bold q-my-none">Datos generales</h2>
    </div>

    <q-form ref="formElementRef">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12" :class="isLegalPerson ? 'col-md-4' : 'col-md-3'">
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
            :rules="[(val: string) => !!val || 'El tipo de documento es requerido']"
            @update:modelValue="formValues.document_type_id = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.document_type_id ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12" :class="isLegalPerson ? 'col-md-4' : 'col-md-3'">
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

        <div
          v-if="isNaturalPerson"
          class="col-12"
          :class="isLegalPerson ? 'col-md-4' : 'col-md-3'"
        >
          <p
            v-if="['view'].includes(formType)"
            class="text-weight-medium mb-0 text-black-10"
          >
            Fecha de expedición
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.expedition_date"
            label="Fecha de expedición"
            required
            :rules="[
              (val: string) => !!val || 'La fecha de expedición es requerida',
              (v: string) => date_before_or_equal_to_the_current_date(v)
            ]"
            @update:modelValue="formValues.expedition_date = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.expedition_date ?? 'No registrado' }}
          </p>
        </div>

        <div v-if="isNaturalPerson" class="col-12 col-md-3">
          <p
            v-if="['view'].includes(formType)"
            class="text-weight-medium mb-0 text-black-10"
          >
            País de nacimiento
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.birth_country"
            :manual_option="countries"
            label="País de nacimiento"
            :auto_complete="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            required
            :map_options="true"
            :rules="[(val: any) => !!val || 'El país de nacimiento es requerido']"
            @update:model-value="formValues.birth_country = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.birth_country ?? 'No registrado' }}
          </p>
        </div>

        <div v-else-if="isLegalPerson" class="col-12 col-md-4">
          <p
            v-if="['view'].includes(formType)"
            class="text-weight-medium mb-0 text-black-10"
          >
            País de constitución
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.incorporation_country"
            :manual_option="countries"
            label="País de constitución"
            :auto_complete="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            required
            :map_options="true"
            :rules="[(val: any) => !!val || 'El país de constitución es requerido']"
            @update:model-value="formValues.incorporation_country = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.incorporation_country ?? 'No registrado' }}
          </p>
        </div>

        <div v-if="isNaturalPerson" class="col-12 col-md-3">
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

        <div v-if="isNaturalPerson" class="col-12 col-md-3">
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

        <div v-if="isNaturalPerson" class="col-12 col-md-3">
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
            :default_value="formValues.first_last_name"
            required
            :rules=" [ 
                (v: string) => !!v || 'El primer apellido es requerido',
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ]"
            @update:model-value="formValues.first_last_name = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.first_last_name ?? 'No registrado' }}
          </p>
        </div>

        <div v-if="isNaturalPerson" class="col-12 col-md-3">
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
            :default_value="formValues.second_last_name"
            :required="formValues.second_last_name ? true : false"
            :rules="formValues.second_last_name ? [
                (v: string) => onlyLetters.test(v) || 'Debe tener solo letras', 
                (v: string) => v.length <= 60 || 'Debe tener máximo 60 caracteres'
              ] : []"
            @update:model-value="formValues.second_last_name = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.second_last_name ?? 'No registrado' }}
          </p>
        </div>

        <div v-if="isLegalPerson" class="col-12">
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
            :default_value="formValues.social_reason"
            required
            :rules=" [ 
              (v: string) => !!v || 'La razón social es requerida',
              (v: string) => v.length <= 50 || 'Debe tener máximo 50 caracteres'
            ]"
            @update:model-value="formValues.social_reason = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.social_reason ?? 'No registrado' }}
          </p>
        </div>

        <div v-if="isNaturalPerson" class="col-12 col-md-5">
          <p
            v-if="['view'].includes(formType)"
            class="text-weight-medium mb-0 text-black-10"
          >
            País de expedición del documento
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.expedition_country"
            :manual_option="countries"
            label="País de expedición del documento"
            :auto_complete="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            required
            :map_options="true"
            :rules="[(val: any) => !!val || 'El país de expedición es requerido']"
            @update:model-value="formValues.expedition_country = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.expedition_country ?? 'No registrado' }}
          </p>
        </div>

        <div v-if="isNaturalPerson" class="col-12 col-md-5">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha de nacimiento{{
              ['create', 'edit'].includes(formType) ? '*' : ''
            }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.birth_date"
            required
            :rules="[
              (val: string) => !!val || 'La fecha de nacimiento es requerida',
              (v: string) => date_before_or_equal_to_the_current_date(v),
              (v: string) => is_older_than(v)
            ]"
            :option_calendar="rule_older_than"
            @update:modelValue="formValues.birth_date = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.birth_date ?? 'No registrado' }}
          </p>
        </div>
      </div>

      <q-separator class="q-mt-xs" color="grey-4" />

      <div class="text-start q-my-lg">
        <h2 class="text-body1 text-dark text-bold q-my-none">Dirección</h2>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-xs">
        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium q-mb-none"
            :class="
              ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            País{{ ['create', 'edit'].includes(formType) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.country"
            :manual_option="countries"
            map_options
            auto_complete
            readonly
            required
            :rules="[(val: string) => !!val || 'El país es requerido']"
            @click="isAddressGeneratorOpen = true"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.country ?? 'No registrado' }}
          </p>
        </div>

        <template v-if="isCountry(formValues.country, 'Colombia')">
          <div class="col-12 col-md-3">
            <p
              class="text-weight-medium q-mb-none"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Departamento/Estado{{
                ['create', 'edit'].includes(formType) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.department"
              :manual_option="departments"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => !!val || 'El departamento es requerido']"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.department ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p
              class="text-weight-medium q-mb-none"
              :class="
                ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Ciudad{{ ['create', 'edit'].includes(formType) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(formType)"
              :default_value="formValues.city"
              :manual_option="cities"
              map_options
              auto_complete
              readonly
              required
              :rules="[(val: string) => !!val || 'La ciudad es requerida']"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ formValues.city ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <div class="col-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Código postal{{ ['create', 'edit'].includes(formType) ? '*' : '' }}
          </p>
          <GenericInputComponent
            v-if="['create', 'edit'].includes(formType)"
            type="number"
            :required="formValues.country === 41"
            :default_value="formValues.postal_code"
            :rules=" [ 
              (v: string) => formValues.country == 41 ? useRules().is_required(v, 'El código postal es requerido') : true,
              (v: string) => formValues.country == 41 || v ? useRules().only_number_greater_than_zero(v) : true,
              (v: string) => useRules().max_length(v, 10)
            ]"
            @update:model-value="formValues.postal_code = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.postal_code ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12">
          <p
            v-if="['view'].includes(formType)"
            class="text-weight-medium mb-0 text-black-10"
          >
            Dirección de residencia
          </p>
          <section v-if="['create', 'edit'].includes(formType)">
            <div class="row items-center q-col-gutter-x-sm">
              <div class="col-12 col-sm">
                <p class="text-grey-6 text-weight-medium q-ml-sm q-mb-none">
                  Dirección de residencia*
                </p>
                <q-input
                  :model-value="formValues.address"
                  placeholder="Inserte"
                  dense
                  outlined
                  readonly
                  required
                  :rules="[(val: string) => !!val || 'La dirección es requerida']"
                  class="full-width q-field--with-bottom"
                  @click="isAddressGeneratorOpen = true"
                />
              </div>

              <div class="col-12 col-sm-auto">
                <q-btn
                  class="q-py-sm q-px-lg"
                  size="md"
                  rounded
                  no-caps
                  outline
                  dense
                  label="Insertar dirección"
                  @click="isAddressGeneratorOpen = true"
                />
              </div>
            </div>
          </section>

          <p v-else class="text-grey-6 mb-0">
            {{ formValues.address ?? 'No registrado' }}
          </p>
        </div>
      </div>

      <q-separator class="q-mt-xs" color="grey-4" />

      <div class="text-start q-my-lg">
        <h2 class="text-body1 text-dark text-bold q-my-none">
          Datos de contacto
        </h2>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-xs">
        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Correo electrónico{{
              ['create', 'edit'].includes(formType) ? '*' : ''
            }}
          </p>
          <GenericInputComponent
            v-if="['create', 'edit'].includes(formType)"
            required
            :default_value="formValues.email_contact"
            :rules=" [ 
              (val: string) => useRules().email_validation(val),  
              (val: string) => useRules().max_length(val, 254),
            ]"
            @update:model-value="formValues.email_contact = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.email_contact ?? 'No registrado' }}
          </p>
        </div>

        <div v-if="isNaturalPerson" class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha desde la calidad del beneficiario final{{
              ['create', 'edit'].includes(formType) ? '*' : ''
            }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.beneficiary_date"
            required
            :rules="[
              (val: string) => !!val || 'La fecha es requerida',
              (v: string) => date_before_or_equal_to_the_current_date(v)
            ]"
            @update:modelValue="formValues.beneficiary_date = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.beneficiary_date ?? 'No registrado' }}
          </p>
        </div>

        <div v-if="isLegalPerson" class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Número de celular{{
              ['create', 'edit'].includes(formType) ? '*' : ''
            }}
          </p>
          <PhoneInput
            v-if="['create', 'edit'].includes(formType)"
            required
            :rules="[(val: string) => useRules().is_required(val, 'El número de celular es requerido') ]"
            :default_value="formValues.legal_phone_number ?? ''"
            @update:model-value="
                (val: string) => (formValues.legal_phone_number = val)
              "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.legal_phone_number ?? 'No registrado' }}
          </p>
        </div>

        <template v-if="isNaturalPerson">
          <div class="col-12">
            <q-separator class="q-mt-xs q-mb-lg" color="grey-4" />
            <RadioYesNo
              v-model="formValues.has_international_tax_responsibility"
              hasTitle
              title="¿Tiene nacionalidad y responsabilidad tributaria internacional en un país diferente a Colombia?"
              :hasSubtitle="false"
              :is-disabled="['view'].includes(formType)"
            />
          </div>

          <div class="col-12">
            <q-separator class="q-mt-xs q-mb-lg" color="grey-4" />
            <RadioYesNo
              v-model="formValues.has_only_foreign_tax_responsibility"
              hasTitle
              title="¿Tiene solo responsabilidad tributaria en un país diferente a Colombia?"
              :hasSubtitle="false"
              :is-disabled="['view'].includes(formType)"
            />
            <q-separator class="q-mt-xs q-mb-md" color="grey-4" />
          </div>

          <template
            v-if="
              formValues.has_international_tax_responsibility ||
              formValues.has_only_foreign_tax_responsibility
            "
          >
            <div class="col-12 col-md-3">
              <p
                class="text-weight-medium q-mb-none"
                :class="
                  ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
                "
              >
                País{{ ['create', 'edit'].includes(formType) ? '*' : '' }}
              </p>
              <GenericSelectorComponent
                v-if="['create', 'edit'].includes(formType)"
                :default_value="formValues.tax_country"
                :manual_option="countries"
                map_options
                auto_complete
                readonly
                required
                :rules="[(val: string) => !!val || 'El país es requerido']"
                @click="isAddressContactGeneratorOpen = true"
              />
              <p v-else class="text-grey-6 mb-0">
                {{ formValues.tax_country ?? 'No registrado' }}
              </p>
            </div>

            <div class="col-12 col-md-3">
              <p
                v-if="['view'].includes(formType)"
                class="text-weight-medium mb-0 text-black-10"
              >
                Nacionalidad
              </p>
              <GenericSelectorComponent
                v-if="['create', 'edit'].includes(formType)"
                :default_value="formValues.nationality"
                :manual_option="
                  nationalities.filter(
                    (nationality) =>
                      nationality.label.toLowerCase() !== 'colombiano'
                  )
                "
                label="Nacionalidad"
                :auto_complete="true"
                :first_filter_option="'label'"
                :second_filter_option="'label'"
                :map_options="true"
                required
                :rules="[(val: string) => !!val || 'La nacionalidad es requerida']"
                @update:modelValue="formValues.nationality = $event"
              />
              <p v-else class="text-grey-6 mb-0">
                {{ formValues.nationality ?? 'No registrado' }}
              </p>
            </div>

            <div class="col-12 col-md-6">
              <p
                class="text-weight-medium mb-0"
                :class="
                  ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
                "
              >
                Tin-Número de identificación del contribuyente{{
                  ['create', 'edit'].includes(formType) ? '*' : ''
                }}
              </p>
              <GenericInputComponent
                v-if="['create', 'edit'].includes(formType)"
                required
                :default_value="formValues.taxpayer_document_number"
                :rules="[
                (v: string) => !!v || 'El TIN o número de identificación del contribuyente es requerido',
                (v: string) => v.length <= 50 || 'Debe contener como máximo 50 caracteres',
              ]"
                @update:model-value="
                  formValues.taxpayer_document_number = $event
                "
              />
              <p v-else class="text-grey-6 mb-0">
                {{ formValues.taxpayer_document_number ?? 'No registrado' }}
              </p>
            </div>

            <div class="col-12">
              <p
                v-if="['view'].includes(formType)"
                class="text-weight-medium mb-0 text-black-10"
              >
                Dirección de residencia
              </p>
              <section v-if="['create', 'edit'].includes(formType)">
                <div class="row items-center q-col-gutter-x-sm">
                  <div class="col-12 col-sm">
                    <p class="text-grey-6 text-weight-medium q-ml-sm q-mb-none">
                      Dirección de residencia*
                    </p>
                    <q-input
                      :model-value="formValues.tax_address"
                      placeholder="Inserte"
                      dense
                      outlined
                      readonly
                      required
                      :rules="[(val: string) => !!val || 'La dirección es requerida']"
                      class="full-width q-field--with-bottom"
                      @click="isAddressContactGeneratorOpen = true"
                    />
                  </div>

                  <div class="col-12 col-sm-auto">
                    <q-btn
                      class="q-py-sm q-px-lg"
                      size="md"
                      rounded
                      no-caps
                      outline
                      dense
                      label="Insertar dirección"
                      @click="isAddressContactGeneratorOpen = true"
                    />
                  </div>
                </div>
              </section>

              <p v-else class="text-grey-6 mb-0">
                {{ formValues.tax_address ?? 'No registrado' }}
              </p>
            </div>
          </template>
        </template>
      </div>
    </q-form>
  </div>

  <AddressGenerator
    v-model:is-open="isAddressGeneratorOpen"
    required
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :locationToEdit="{
      address: formValues.address || '',
      country: {
        id: formValues.country ? Number(formValues.country) : null,
      },
      department: { id: Number(formValues.department) },
      city: { id: Number(formValues.city) },
    }"
    @save="
      ($event) => {
        formValues.address = $event.address ?? null
        formValues.country = $event.country?.id ?? null
        formValues.department = $event.department?.id ?? null
        formValues.city = $event.city?.id ?? null
      }
    "
  />

  <AddressGenerator
    v-model:is-open="isAddressContactGeneratorOpen"
    required
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :countries="
      countries.filter((country) => country.label.toLowerCase() !== 'colombia')
    "
    :locationToEdit="{
      address: formValues.tax_address || '',
      country: { id: Number(formValues.tax_country) },
      department: { id: Number(formValues.tax_department) },
      city: { id: Number(formValues.tax_city) },
    }"
    @save="
      ($event) => {
        formValues.tax_address = $event.address ?? null
        formValues.tax_country = $event.country?.id ?? null
        formValues.tax_department = $event.department?.id ?? null
        formValues.tax_city = $event.city?.id ?? null
      }
    "
  />
</template>

<script setup lang="ts">
import { IShareholder } from '@/interfaces/customs/Clients'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import { useProfileForm } from './ProfileForm'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    formType: 'create' | 'edit' | 'view'
    data?: IShareholder | null
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
  countries,
  departments,
  cities,
  nationalities,
  isAddressGeneratorOpen,
  isAddressContactGeneratorOpen,
  date_before_or_equal_to_the_current_date,
  is_older_than,
  isCountry,
  rule_older_than,
  onlyLetters,
} = useProfileForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
