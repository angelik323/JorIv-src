<script setup lang="ts">
import { defaultIcons } from '@/utils'
import { useGeneralDataForm } from './GeneralDataForm'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AddressGeneratorForm from '@/components/Forms/AddressGenerator/AddressGeneratorForm.vue'
import { useValidator } from '@/composables/useValidator'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useResourcesStore, useThirdPartiesStore } from '@/stores'

// Props
const props = defineProps({
  formType: {
    type: String,
    required: true,
  },
  showBtn: {
    type: Boolean,
    required: false,
    default: false,
  },
  btnLabel: {
    type: String,
    required: false,
    default: 'Continuar',
  },
  btnIcon: {
    type: String,
    required: false,
    default: defaultIcons.next,
  },
})

// Handle emits to view:
const emit = defineEmits(['onContinue'])

const { formValues, formattedBranches, loadingCities, submit } =
  useGeneralDataForm(props, emit)
const { ciius, departments, cities, document_types_third_party } = storeToRefs(
  useResourcesStore()
)
const {
  classificationsData,
  naturesData,
  regimensData,
  responsableData,
  thirdPartyClassificationData,
  organData,
  jurisdictionData,
} = storeToRefs(useThirdPartiesStore())
const { validateAlphanumericMessage, validateEmail } = useValidator()

const form = ref()

defineExpose({
  validateForm: () => form.value?.validate(),
})
</script>
<template>
  <q-form ref="form" @submit.prevent="submit">
    <!-- General Data Third Party Section -->
    <section>
      <div class="q-px-lg">
        <div class="row">
          <div
            class="col-4 q-pt-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.classification"
              :manual_option="classificationsData"
              label="Clasificación"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'La clasificación es requerida']"
              @update:modelValue="formValues.classification = $event"
            />
          </div>

          <div
            class="col-4 q-pt-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.nature"
              :manual_option="naturesData"
              label="Naturaleza"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'La naturaleza es requerida']"
              @update:modelValue="formValues.nature = $event"
            />
          </div>

          <div
            class="col-4 q-pt-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.document_type_id"
              :manual_option="document_types_third_party"
              label="Tipo de documento"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El tipo de documento es requerido']"
              @update:modelValue="formValues.document_type_id = $event"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <p class="text-grey-6 text-weight-medium mb-0">
              Número identificación
            </p>
            <q-input
              outlined
              v-model="formValues.document"
              dense
              placeholder="Inserte"
              :rules="[
                (val: string) => validateAlphanumericMessage(val)
              ]"
            />
          </div>

          <div
            v-show="formValues.classification === 'Sede'"
            class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.branch_id"
              :manual_option="formattedBranches"
              label="Sede"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="formValues.classification === 'Sede'"
              :map_options="true"
              :rules="formValues.classification === 'Sede' ? [(val: string) => !!val || 'La sede es requerida'] : []"
              @update:modelValue="formValues.branch_id = $event"
            />
          </div>

          <div
            v-show="formValues.classification !== 'Sede'"
            class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <p class="text-grey-6 text-weight-medium mb-0">Nombre</p>
            <q-input
              outlined
              v-model="formValues.name"
              dense
              type="text"
              placeholder="Inserte"
              :rules="[
                formValues.classification !== 'Sede'
                  ? (val) => validateAlphanumericMessage(val)
                  : () => true,
              ]"
            />
          </div>

          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <GenericSelectorComponent
              :default_value="formValues.tax_regime"
              :manual_option="regimensData"
              label="Régimen fiscal"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El régimen fiscal es requerido']"
              @update:modelValue="formValues.tax_regime = $event"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <GenericSelectorComponent
              :default_value="formValues.tax_manager"
              :manual_option="responsableData"
              label="Responsable fiscal"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El responsable fiscal es requerido']"
              @update:modelValue="formValues.tax_manager = $event"
            />
          </div>

          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <p class="text-grey-6 text-weight-medium mb-0">
              Matrícula mercantil (Opcional)
            </p>
            <q-input
              outlined
              v-model="formValues.commercial_registration"
              dense
              type="text"
              placeholder="Inserte"
              :required="false"
              :rules="[
                (val: string) =>
                  !val || (val.length >= 1 && validateAlphanumericMessage(val)),
              ]"
            />
          </div>

          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <p class="text-grey-6 text-weight-medium mb-0">DV (Opcional)</p>
            <q-input
              outlined
              v-model="formValues.validator_digit"
              dense
              type="text"
              placeholder="Inserte"
              :required="false"
              :rules="[
                (val: string) =>
                  !val || (val.length >= 1 && validateAlphanumericMessage(val, 10)),
              ]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <p class="text-grey-6 text-weight-medium mb-0">
              Código IPS - REPS (Opcional)
            </p>
            <q-input
              outlined
              v-model="formValues.ips_code"
              dense
              type="text"
              placeholder="Inserte"
              :required="false"
              :rules="[
                (val: string) =>
                  !val || (val.length >= 1 && validateAlphanumericMessage(val, 20)),
              ]"
            />
          </div>

          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <GenericSelectorComponent
              :default_value="formValues.ciiu_id"
              :manual_option="ciius"
              label="Actividad CIIU (Opcional)"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[]"
              @update:modelValue="formValues.ciiu_id = $event"
            />
          </div>

          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <p class="text-grey-6 text-weight-medium mb-0">Observaciones</p>
            <q-input
              outlined
              v-model="formValues.observations"
              dense
              type="text"
              placeholder="Inserte"
              :rules="[
                (val: string) => {
                  if (!val) {
                    return 'El campo es obligatorio'
                  }
                  if (val.length > 100) {
                    return 'El campo debe tener un máximo de 100 caracteres'
                  }
                  return true
                },
              ]"
            />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <GenericSelectorComponent
              :default_value="formValues.third_party_classification"
              :manual_option="thirdPartyClassificationData"
              label="Clasificación de terceros"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[]"
              @update:modelValue="
                formValues.third_party_classification = $event
              "
            />
          </div>
          <div
            v-show="formValues.third_party_classification === 'Órgano Judicial'"
            class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.organ"
              :manual_option="organData"
              label="Órgano"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[]"
              @update:modelValue="formValues.organ = $event"
            />
          </div>
          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <GenericSelectorComponent
              :default_value="formValues.jurisdiction"
              :manual_option="jurisdictionData"
              label="Jurisdicción"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[]"
              @update:modelValue="formValues.jurisdiction = $event"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <q-checkbox
              v-model="formValues.manage_withholdings"
              label="Maneja retenciones"
              color="indigo-10"
            />
          </div>
        </div>

        <q-separator />
      </div>
    </section>

    <!-- Contact Data Section -->
    <section>
      <div class="q-px-lg q-mt-lg">
        <p class="text-black-10 text-weight-bold text-h6 mb-1">
          Datos de contacto y dirección
        </p>

        <div class="row">
          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <p class="text-grey-6 text-weight-medium mb-0">
              Correo electrónico
            </p>
            <q-input
              outlined
              v-model="formValues.email"
              dense
              type="email"
              placeholder="Inserte"
              :required="false"
              :rules="[
                (val: string) => validateEmail(val)
              ]"
            />
          </div>

          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <p class="text-grey-6 text-weight-medium mb-0">Teléfono</p>
            <q-input
              outlined
              v-model="formValues.phone"
              dense
              type="number"
              placeholder="Inserte"
              :rules="[
                (val: string) => validateAlphanumericMessage(val, 20),
              ]"
              :required="false"
            />
          </div>

          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <GenericSelectorComponent
              :default_value="formValues.department_id"
              :manual_option="departments"
              label="Departamento"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El departamento es requerido']"
              @update:modelValue="
                (val) => {
                  formValues.city_id = null
                  formValues.department_id = val
                }
              "
            />
          </div>
        </div>

        <div class="row">
          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <GenericSelectorComponent
              :default_value="!loadingCities ? formValues.city_id : null"
              :manual_option="
                formValues.department_id && !loadingCities ? cities : []
              "
              label="Municipio (Opcional)"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[]"
              :placeholder="loadingCities ? 'Cargando...' : 'Seleccione'"
              @update:modelValue="formValues.city_id = $event"
            />
          </div>

          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-8 col-lg-8">
            <p class="text-grey-6 text-weight-medium mb-0">
              Dirección (Opcional)
            </p>
            <AddressGeneratorForm
              v-model="formValues.address"
              dense
              placeholder="Inserte"
              :rules="[]"
            />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <p class="text-grey-6 text-weight-medium mb-0">
              Persona de contacto (Opcional)
            </p>
            <q-input
              outlined
              v-model="formValues.contact_name"
              dense
              type="text"
              placeholder="Inserte"
              :required="false"
              :rules="[
                (val) => {
                  const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
                  if (!val) {
                    return true
                  }
                  if (val.length >= 1 && !pattern.test(val)) {
                    return 'El campo es de tipo texto'
                  }

                  if (val.length > 200) {
                    return 'El campo debe tener un máximo de 200 caracteres'
                  }

                  return true
                },
              ]"
            />
          </div>
          <div class="col-4 q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <p class="text-grey-6 text-weight-medium mb-0 ellipsis">
              Teléfono persona de contacto (Opcional)
            </p>
            <q-input
              outlined
              v-model="formValues.contact_phone"
              dense
              type="number"
              placeholder="Inserte"
              :required="false"
              :rules="[
                (val) =>
                  !val ||
                  (val.length >= 1 && validateAlphanumericMessage(val, 20)),
              ]"
            />
          </div>
        </div>

        <q-separator />
      </div>
    </section>

    <!-- Submit Button -->
    <section v-if="showBtn === false">
      <div class="q-px-xl q-mt-xl q-mb-lg">
        <div class="row justify-end">
          <q-btn
            class="text-initial btn__history col-2"
            color="indigo-10"
            type="submit"
            size="md"
            unelevated
            no-caps
            :icon-right="btnIcon"
            :label="btnLabel"
            :style="{ width: '150px', height: '50px' }"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
