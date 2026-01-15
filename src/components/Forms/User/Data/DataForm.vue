<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import { useDataForm } from '@/components/Forms/User/Data/DataForm'
import { defaultIcons } from '@/utils'

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

const {
  formValues,
  submit,
  searchUserByDocument,
  // Test data:
  sex,
  cities,
  roles,
  branches,
  document_types_user,
  isExpeditionPlaceRequired,
  isDateRequired,
} = useDataForm(props, emit)
</script>
<template>
  <q-form @submit.prevent="submit">
    <!-- User Data Section -->
    <section>
      <div class="q-px-lg q-mt-lg">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Datos del usuario
        </p>
        <div class="row">
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.role"
              :manual_option="roles"
              label="Rol*"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El rol es requerido']"
              :auto_focus="true"
              @update:modelValue="formValues.role = $event"
            />
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericDateInputComponent
              label="Fecha de vencimiento"
              :default_value="formValues.expiration_date"
              :navigation_max_year_month="'3000/12'"
              :required="isDateRequired"
              :rules="[
                (v: string) => !v || new Date(v) > new Date() || 'La fecha debe ser mayor a la fecha actual'
              ]"
              @update:modelValue="formValues.expiration_date = $event"
            />
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.branch_id"
              :manual_option="branches"
              label="Sede*"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'La sede es requerida']"
              @update:modelValue="formValues.branch_id = $event"
            />
          </div>
        </div>
        <q-separator />
      </div>
    </section>

    <!-- User Personal Data Section -->
    <section>
      <div class="q-px-lg q-mt-lg">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Datos personales
        </p>
        <div class="row">
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.document_type_id"
              :manual_option="document_types_user"
              label="Tipo de documento"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El tipo de documento es requerido']"
              @update:modelValue="
                ;(formValues.document_type_id = $event),
                  formValues.document_type_id !== 1
                    ? (formValues.expedition_place_id = null)
                    : ''
              "
            />
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <p class="text-grey-6 text-weight-medium mb-0">
              Número de documento*
            </p>
            <q-input
              outlined
              v-model="formValues.document"
              dense
              type="text"
              placeholder="Ingrese documento"
              :rules="[
                (v: string) => !!v || 'El documento es requerido',  
                (v: string) => v.length >= 6 || 'Debe tener mínimo 6 caracteres',  
                (v: string) => v.length <= 50 || 'Debe tener máximo 50 caracteres', 
                (v: string) => /^[a-zA-Z0-9]*$/.test(v) || 'No se permiten caracteres especiales', 
                (v: string) => !/^-\d/.test(v) || 'No se permiten números negativos'
              ]"
              @keydown.enter.prevent="
                searchUserByDocument({
                  document_type: formValues.document_type_id,
                  document: formValues.document,
                })
              "
            >
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  class="hover-primary"
                  color="gray"
                  :icon="defaultIcons.magnify"
                  @click="
                    searchUserByDocument({
                      document_type: formValues.document_type_id,
                      document: formValues.document,
                    })
                  "
                />
              </template>
            </q-input>
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <p class="text-grey-6 text-weight-medium mb-0">Nombre*</p>
            <q-input
              outlined
              v-model="formValues.name"
              dense
              type="text"
              placeholder="Ingrese nombre"
              :rules="[
                (v) => !!v || 'El nombre es requerido',
                (v) => /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                (v) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v) =>
                  v.length <= 50 || 'Debe contener como máximo 50 caracteres',
                (v) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
              ]"
            >
            </q-input>
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <p class="text-grey-6 text-weight-medium mb-0">Apellidos*</p>
            <q-input
              outlined
              v-model="formValues.last_name"
              dense
              type="text"
              placeholder="Ingrese apellidos"
              :rules="[
                (v) => !!v || 'El apellido es requerido',
                (v) => /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                (v) => v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v) =>
                  v.length <= 50 || 'Debe contener como máximo 50 caracteres',
                (v) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
              ]"
            >
            </q-input>
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
            v-show="isExpeditionPlaceRequired"
          >
            <GenericSelectorComponent
              :default_value="formValues.expedition_place_id"
              :manual_option="cities"
              label="Lugar de expedición*"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="isExpeditionPlaceRequired"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El lugar de expedición es requerido']"
              @update:modelValue="formValues.expedition_place_id = $event"
            />
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.sex"
              :manual_option="sex"
              label="Sexo*"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El sexo es requerido']"
              @update:modelValue="formValues.sex = $event"
            />
          </div>
        </div>
        <q-separator />
      </div>
    </section>

    <!-- Datos de contacto -->
    <section>
      <div class="q-px-lg q-my-lg">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Datos de contacto
        </p>
        <div class="row">
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <p class="text-grey-6 text-weight-medium mb-0">Teléfono*</p>
            <q-input
              outlined
              v-model="formValues.phone"
              dense
              type="number"
              placeholder="Ingrese número de teléfono"
              :rules="[
                (v: string) => !!v || 'El teléfono es requerido', 
                (v: string) => v.length >= 3 || 'Debe de tener mínimo 3 caracteres',  
                (v: string) => v.length <= 10 || 'Debe tener máximo 10 caracteres',  
                (v: string) => /^[a-zA-Z0-9]*$/.test(v) || 'No se permiten caracteres especiales', 
                (v: string) => !/^-\d/.test(v) || 'No se permiten números negativos'
              ]"
            />
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <p class="text-grey-6 text-weight-medium mb-0">
              Correo electrónico*
            </p>
            <q-input
              outlined
              v-model="formValues.email"
              dense
              type="email"
              placeholder="Ingrese correo electrónico"
              :rules=" [
                (v: string) => !!v || 'El correo electrónico es requerido', 
                (v: string) => /.+@.+\..+/.test(v) || 'Ingrese un correo electrónico válido', 
                (v: string) => !/[áéíóúÁÉÍÓÚñÑ]/.test(v) || 'El correo no debe contener acentos', 
                (v: string) => /^[a-zA-Z0-9@._-]+$/.test(v) || 'El correo contiene caracteres no permitidos'
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
