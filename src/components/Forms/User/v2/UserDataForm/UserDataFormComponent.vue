<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import PhoneInput from '@/components/phone-selector/v2/PhoneInput.vue'

// Logic:
import { useUserDataFormComponent } from '@/components/Forms/User/v2/UserDataForm/UserDataFormComponent'
import { useRules } from '@/composables'

// Props
const props = defineProps({
  formType: {
    type: String,
    required: true,
  },
})

const {
  formValues,
  userDataForm,
  showPassword,
  defaultIcons,
  document_types_user,
  user_types,
  user_profile,
  user_roles,
  user_status,

  validateForm,
} = useUserDataFormComponent(props)

// Exposes validations to parent components
defineExpose({ validateForm })
</script>

<template>
  <q-form ref="userDataForm">
    <!-- General Data Section -->
    <section>
      <div class="q-mt-lg">
        <p class="text-black-10 text-weight-bold text-h6 mb-0 q-px-lg">
          Datos generales
        </p>

        <!-- 1 Section -->
        <div class="row q-px-sm q-pt-lg">
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericDateInputComponent
              label="Fecha de creación"
              :default_value="formValues.creation_date"
              :navigation_max_year_month="'3000/12'"
              :required="true"
              :rules="[]"
              :disabled="true"
              @update:modelValue="formValues.creation_date = $event"
            />
          </div>
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues?.user_type"
              :manual_option="user_types"
              label="Tipo de usuario"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              disabled
              :rules="[(val: string) => !!val || 'El tipo de usuario es requerido']"
              @update:modelValue="formValues.user_type = $event"
            />
          </div>
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericInputComponent
              :default_value="formValues.user_code"
              label="Usuario"
              :required="true"
              :disabled="true"
              :rules="[(val: string) => !!val || 'El usuario es requerido']"
              @update:modelValue="formValues.user_code = $event"
            />
          </div>
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-6 col-md-4 col-lg-4"
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
              disabled
              :rules="[(val: string) => !!val || 'El tipo de documento es requerido']"
              @update:modelValue="formValues.document_type_id = $event"
            />
          </div>
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericInputComponent
              :default_value="formValues.document"
              label="Número de documento"
              :required="true"
              :disabled="true"
              :rules="[(val: string) => !!val || 'El número de documento es requerido']"
              @update:modelValue="formValues.document = $event"
            />
          </div>
        </div>

        <!-- 2 Section -->
        <div class="row q-px-sm">
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-4 col-md-3 col-lg-3"
          >
            <GenericInputComponent
              :default_value="formValues.name"
              label="Primer nombre"
              :required="true"
              :rules="[
                (v: string) => useRules().is_required(v, 'El primer nombre es requerido'),
                (v: string) => useRules().only_letters(v),
                (v: string) => useRules().min_length(v, 2),
                (v: string) => useRules().max_length(v, 50),
                (v: string) => useRules().no_consecutive_spaces(v),
              ]"
              @update:modelValue="formValues.name = $event"
            />
          </div>
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-4 col-md-3 col-lg-3"
          >
            <GenericInputComponent
              :default_value="formValues.second_name"
              label="Segundo nombre"
              :required="!!formValues.second_name"
              :rules="formValues.second_name ? [
                (v: string) => useRules().only_letters(v),
                (v: string) => useRules().min_length(v, 2),
                (v: string) => useRules().max_length(v, 50),
                (v: string) => useRules().no_consecutive_spaces(v),
              ] : []"
              @update:modelValue="formValues.second_name = $event"
            />
          </div>
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-4 col-md-3 col-lg-3"
          >
            <GenericInputComponent
              :default_value="formValues.last_name"
              label="Primer apellido"
              :required="true"
              :rules="[
                (v: string) => useRules().is_required(v, 'El primer apellido es requerido'),
                (v: string) => useRules().only_letters(v),
                (v: string) => useRules().min_length(v, 2),
                (v: string) => useRules().max_length(v, 50),
                (v: string) => useRules().no_consecutive_spaces(v),
              ]"
              @update:modelValue="formValues.last_name = $event"
            />
          </div>
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-4 col-md-3 col-lg-3"
          >
            <GenericInputComponent
              :default_value="formValues.second_last_name"
              label="Segundo apellido"
              :rules="formValues.second_last_name ? [
                (v: string) => useRules().only_letters(v),
                (v: string) => useRules().min_length(v, 2),
                (v: string) => useRules().max_length(v, 50),
                (v: string) => useRules().no_consecutive_spaces(v),
              ] : []"
              @update:modelValue="formValues.second_last_name = $event"
            />
          </div>
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-4 col-md-3 col-lg-3"
          >
            <GenericInputComponent
              :default_value="formValues.email"
              label="Correo electrónico"
              type="email"
              :required="true"
              :rules=" [
                (v: string) => !!v || 'El correo electrónico es requerido', 
                (v: string) => useRules().email_validation(v),
              ]"
              @update:modelValue="formValues.email = $event"
            />
          </div>
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-4 col-md-3 col-lg-3"
          >
            <p class="text-weight-medium text-grey-6 mb-0">
              Número de contacto*
            </p>

            <PhoneInput
              ref="mobilePhone"
              :rules="[(val: string) => useRules().is_required(val, 'El número de contacto es requerido') ]"
              :default_value="formValues.phone"
              required
              @update:model-value="(val: string) => (formValues.phone  = val)"
            />
          </div>
        </div>

        <!-- 3 Section -->
        <div v-if="formType === 'create'" class="row q-px-sm">
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-6 col-md-6 col-lg-6"
          >
            <GenericInputComponent
              :default_value="formValues.password"
              label="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              :required="true"
              :append_icon="
                showPassword ? defaultIcons.eyeOff : defaultIcons.eye
              "
              :rules="[
                (v: string) => !!v || 'La contraseña es requerida', 
                (v: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\w\W]{8,20}$/.test(v) || 'La contraseña no cumple con las políticas establecidas'
              ]"
              append_clickable
              @click:append-icon="showPassword = !showPassword"
              @update:modelValue="formValues.password = $event"
            />
            <div class="row items-center q-mx-sm no-wrap">
              <q-checkbox
                v-model="formValues.password_check"
                dense
                class="q-mr-sm rounded-checkbox"
                color="primary_fiduciaria"
              />
              <span
                >Realizar cambio automático de contraseña para este
                usuario</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Profile data Section -->
    <section>
      <div>
        <p class="text-black-10 text-weight-bold text-h6 mb-0 q-px-lg">
          Datos perfil
        </p>

        <!-- 1 Section -->
        <div class="row q-px-sm q-pt-lg">
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-6 col-md-3 col-lg-3"
          >
            <GenericSelectorComponent
              :default_value="formValues.profile_type"
              :manual_option="user_profile"
              label="Perfil"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El perfil es requerido']"
              @update:modelValue="formValues.profile_type = $event"
            />
          </div>
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-6 col-md-3 col-lg-3"
          >
            <GenericSelectorComponent
              :default_value="formValues.role"
              :manual_option="user_roles"
              label="Rol"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El rol es requerido']"
              @update:modelValue="formValues.role = $event"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Status Section -->
    <section>
      <div>
        <p class="text-black-10 text-weight-bold text-h6 mb-0 q-px-lg">
          Estado
        </p>

        <!-- 1 Section -->
        <div class="row q-px-sm q-pt-lg">
          <div
            class="col-4 q-pb-md q-px-md col-xs-12 col-sm-6 col-md-6 col-lg-6"
          >
            <GenericSelectorComponent
              :default_value="formValues.status_id"
              :manual_option="
                formType === 'create'
                  ? user_status
                  : user_status.filter((status) => status.value != 3)
              "
              label="Estado"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El estado es requerido']"
              @update:modelValue="formValues.status_id = $event"
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>

  <div class="q-px-lg">
    <q-separator />
  </div>
</template>

<style>
.rounded-checkbox .q-checkbox__bg {
  border-radius: 5px !important;
}
</style>
