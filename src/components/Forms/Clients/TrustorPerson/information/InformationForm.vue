<template>
  <q-form ref="formInformation">
    <section>
      <div class="q-px-lg q-mt-lg q-pb-lg q-mb-sm">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Datos generales
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-weight-medium mb-0 text-grey-6"
        >
          Proporcione los datos generales para crear su nuevo cliente como
          persona fideicomiso.
        </p>
      </div>
    </section>

    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Fecha de creación"
              :default_value="models.creation_date"
              disabled
              @update:modelValue="models.creation_date = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha de creación</p>
              <p class="text-weight-medium no-margin">
                {{ models.creation_date ?? 'No registrado' }}
              </p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Tipo de solicitante"
              :manual_option="third_party_request_types"
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
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Tipo de documento"
              :manual_option="document_types_third_party_fideicomiso"
              :map_options="true"
              :required="false"
              :default_value="models.document_type_id"
              :disabled="false"
              :rules="[]"
              @update:modelValue="models.document_type_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Tipo de documento</p>
              <p class="text-weight-medium no-margin">
                {{ models.document_type_id ?? 'No registrado' }}
              </p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Número de identificación"
              :manual_option="business_trusts"
              :map_options="true"
              :required="true"
              :default_value="models.fideicomiso_person.business_trust_id"
              :auto_complete="true"
              @update:modelValue="
                models.fideicomiso_person.business_trust_id = $event
              "
              :rules="[
                (val: string) => useRules().is_required(val),
              ]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Número de identificación</p>
              <p class="text-weight-medium no-margin">
                {{
                  models.fideicomiso_person.business_trust_id ?? 'No registrado'
                }}
              </p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Nombre del fideicomiso"
              required
              :default_value="models.name"
              :rules="[]"
              disabled
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Nombre del fideicomiso</p>
              <p class="text-weight-medium no-margin">
                {{ models.name ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>

        <q-separator class="mt-2" />
      </div>
    </section>

    <section class="mx-3 mt-0 mb-3">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="País"
            :default_value="models.country_id"
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
              {{ models.country_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <template
          v-if="
            isCountry(models?.country_id, 'Colombia') ||
            ['view'].includes(action)
          "
        >
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Departamento/Estado"
              :default_value="models.department_id"
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
                {{ models.department_id ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Ciudad"
              :default_value="models.city_id"
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
                {{ models.city_id ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </template>

        <div class="col-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Dirección"
            required
            :default_value="models.address"
            :rules="[(val: string) => useRules().is_required(val)]"
            readonly
            @click="isAddressGeneratorOpen = true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Dirección</p>
            <p class="text-weight-medium no-margin">
              {{ models.address ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="mt-2" />
    </section>

    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Correo electrónico"
              required
              :default_value="models.email"
              :rules=" [
                (v: string) => useRules().is_required(v),
                (v: string) => useRules().email_validation(v),
                (v: string) => useRules().max_length(v, 254),
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
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.phone_type"
              :manual_option="phone_types"
              label="Tipo de teléfono"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :clearable="false"
              :map_options="true"
              :rules="[(v: string) => useRules().is_required(v),]"
              @update:model-value="models.phone_type = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Tipo de teléfono</p>
              <p class="text-weight-medium no-margin">
                {{ models.phone_type === 'mobile' ? 'Celular' : 'Fijo' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action)
                  ? 'text-weight-bold no-margin'
                  : 'text-grey-6'
              "
            >
              Número de teléfono{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <PhoneInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.phone_number ?? ''"
              :rules="[(val: string) => useRules().is_required(val, 'El número de celular es requerido')]"
              @update:model-value="
                (val: string) => (models.phone_number = val)
              "
            />
            <p v-else class="text-weight-medium no-margin">
              {{ models.phone_number ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Envío correspondencia"
              :manual_option="correspondence"
              :map_options="true"
              :required="true"
              :default_value="models.fideicomiso_person.sending_correspondence"
              :auto_complete="true"
              @update:modelValue="
                models.fideicomiso_person.sending_correspondence = $event
              "
              :rules="[(val: string) => useRules().is_required(val)]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Envío correspondencia</p>
              <p class="text-weight-medium no-margin">
                {{
                  models.fideicomiso_person.sending_correspondence ??
                  'No registrado'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-form>

  <AddressGenerator
    v-model:is-open="isAddressGeneratorOpen"
    required
    :rules="[(val: string) => useRules().is_required(val)]"
    :locationToEdit="{
      address: models.address || '',
      country: {
        id: models.country_id ? Number(models.country_id) : null,
      },
      department: { id: Number(models.department_id) },
      city: { id: Number(models.city_id) },
    }"
    @save="
      ($event: ILocation) => {
        models.address = $event.address ?? null
        models.country_id = $event.country?.id ?? null
        models.department_id = $event.department?.id ?? null
        models.city_id = $event.city?.id ?? null
      }
    "
  />
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import useInformationForm from './InformationForm'
import { useRules } from '@/composables'
import { ILocation } from '@/interfaces/customs/AddressGenerator'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'
import { ActionType } from '@/interfaces/global'
import { ITrustorResponse } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITrustorResponse | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formInformation,
  third_party_request_types,
  correspondence,
  countries,
  isAddressGeneratorOpen,
  departments,
  cities,
  phone_types,
  business_trusts,
  document_types_third_party_fideicomiso,
  isCountry,
} = useInformationForm(props)
defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
