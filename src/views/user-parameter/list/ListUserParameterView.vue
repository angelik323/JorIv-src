<script setup lang="ts">
// Components
import Icon from '@/components/common/Icon/Icon.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
// Logic
import { useUserParamaterView } from '@/views/user-parameter/list/ListUserParameterView'

// utils
import { defaultIconsLucide } from '@/utils'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

const {
  headerProps,
  handleEditFields,
  validateForms,
  formParameter,
  alertModalRef,
  handleSave,
  data_parameters,
  validateRouter,
  login_types,
  default_yes_no,
} = useUserParamaterView()
defineExpose({
  validateForm: () => formParameter.value?.validate(),
})
</script>

<template>
  <q-form ref="formParameter" class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :subtitle="headerProps.subtitle"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <template #addBefore>
        <div class="row q-gutter-sm">
          <q-btn
            v-if="validateRouter('Users', 'UserParametersList', 'edit')"
            no-caps
            unelevated
            class="btn-header"
            label="Editar"
            icon="mdi-pencil"
            text-color="white"
            @click="handleEditFields(headerProps.editFields.value)"
          />
        </div>
      </template>

      <section class="q-my-md">
        <div class="q-mx-md">
          <q-separator />
        </div>

        <div class="q-mx-md q-mt-lg">
          <div class="row q-pb-lg q-col-gutter-md">
            <div class="col-12">
              <p class="text-black-10 text-weight-bold text-h6 mb-0">
                Configuración de Seguridad de Contraseña
              </p>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <p class="text-grey-6 text-weight-medium mb-1">
                Días de caducidad (contraseña)*
              </p>

              <GenericInput
                v-if="headerProps.editFields.value"
                :required="false"
                :default_value="data_parameters.password_expiry_days"
                type="number"
                :rules="[
                  (v: string) => !!v || 'Días de caducidad es requerido',
                  (v: string) => !isNaN(Number(v)) || 'Solo se permiten números',
                  (v: string) => Number(v) > 0 || 'Debe ser mayor a 0',
                  (v: string) => Number(v) <= 1000 || 'Debe ser menor o igual a 1000',
                ]"
                @update:model-value="
                  data_parameters.password_expiry_days = $event
                "
              />
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom"
              >
                {{ data_parameters.password_expiry_days }} días
              </p>
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom mb-0"
              >
                <Icon
                  :styleCustom="{
                    backgroundColor: '#762344',
                    borderRadius: '10px',
                    marginBottom: '-5px',
                    marginRight: '5px',
                  }"
                  :name="defaultIconsLucide.info"
                  :size="20"
                  color="#fff"
                />
                <a>Dato generado automáticamente por el sistema</a>
              </p>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <p class="text-grey-6 text-weight-medium mb-1">
                Número de intentos fallidos permitidos*
              </p>
              <GenericInput
                v-if="headerProps.editFields.value"
                :required="true"
                :default_value="data_parameters.max_failed_attempts"
                type="number"
                :rules="[
                  (v: string) => !!v || 'Número de intentos fallidos permitidos  es requerido',
                  (v: string) => !isNaN(Number(v)) || 'Solo se permiten números',
                  (v: string) => Number(v) > 0 || 'Debe ser mayor a 0',
                  (v: string) => Number(v) <= 1000 || 'Debe ser menor o igual a 1000',
                ]"
                @update:model-value="
                  data_parameters.max_failed_attempts = $event
                "
              />
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom"
              >
                {{ data_parameters.max_failed_attempts }}
              </p>
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom mb-0"
              >
                <Icon
                  :styleCustom="{
                    backgroundColor: '#762344',
                    borderRadius: '10px',
                    marginBottom: '-5px',
                    marginRight: '5px',
                  }"
                  :name="defaultIconsLucide.info"
                  :size="20"
                  color="#fff"
                />
                <a>Dato generado automáticamente por el sistema</a>
              </p>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <p class="text-grey-6 text-weight-medium mb-1">
                Claves historicas*
              </p>
              <GenericInput
                v-if="headerProps.editFields.value"
                :required="false"
                :default_value="data_parameters.password_history_count"
                type="number"
                :rules="[
                  (v: string) => !!v || 'Claves historicas  es requerido',
                  (v: string) => !isNaN(Number(v)) || 'Solo se permiten números',
                  (v: string) => Number(v) > 0 || 'Debe ser mayor a 0',
                  (v: string) => Number(v) <= 1000 || 'Debe ser menor o igual a 1000',
                ]"
                @update:model-value="
                  data_parameters.password_history_count = $event
                "
              />
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom"
              >
                {{ data_parameters.password_history_count }}
              </p>
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom mb-0"
              >
                <Icon
                  :styleCustom="{
                    backgroundColor: '#762344',
                    borderRadius: '10px',
                    marginBottom: '-5px',
                    marginRight: '5px',
                  }"
                  :name="defaultIconsLucide.info"
                  :size="20"
                  color="#fff"
                />
                <a>Dato generado automáticamente por el sistema</a>
              </p>
            </div>
          </div>
          <div class="q-mx-md">
            <q-separator />
          </div>
          <div class="row q-pt-lg q-pb-lg q-col-gutter-md">
            <div class="col-12">
              <p class="text-black-10 text-weight-bold text-h6 mb-0">
                Gestión de Inactividad y Sesiones
              </p>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <p class="text-grey-6 text-weight-medium mb-1">
                Inactivar cuentas automáticamente por no uso
              </p>
              <GenericSelectorComponent
                v-if="headerProps.editFields.value"
                :manual_option="default_yes_no"
                :map_options="true"
                :display_label="'label'"
                :display_value="'value'"
                :required="true"
                :default_value="data_parameters.auto_deactivate_unused ?? false"
                :auto_complete="false"
                :rules="[(val: boolean) => val !== null && val !== undefined || 'Inactivar cuenta es Requerido']"
                @update:model-value="
                  data_parameters.auto_deactivate_unused = $event
                "
              />

              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom"
              >
                {{ data_parameters.auto_deactivate_unused ? 'Si' : 'No' }}
              </p>

              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom mb-0"
              >
                <Icon
                  :styleCustom="{
                    backgroundColor: '#762344',
                    borderRadius: '10px',
                    marginBottom: '-5px',
                    marginRight: '5px',
                  }"
                  :name="defaultIconsLucide.info"
                  :size="20"
                  color="#fff"
                />
                <a>Dato generado automáticamente por el sistema</a>
              </p>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <p class="text-grey-6 text-weight-medium mb-1">
                Tiempo máximo de inactividad (días)*
              </p>
              <GenericInput
                v-if="headerProps.editFields.value"
                :required="false"
                :default_value="data_parameters.max_inactivity_days"
                type="number"
                :rules="[
                  (v: string) => !!v || 'Tiempo máximo de inactividad  es requerido',
                  (v: string) => !isNaN(Number(v)) || 'Solo se permiten números',
                  (v: string) => Number(v) > 0 || 'Debe ser mayor a 0',
                  (v: string) => Number(v) <= 1000 || 'Debe ser menor o igual a 1000',
                ]"
                @update:model-value="
                  data_parameters.max_inactivity_days = $event
                "
              />
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom"
              >
                {{ data_parameters.max_inactivity_days }} días
              </p>
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom mb-0"
              >
                <Icon
                  :styleCustom="{
                    backgroundColor: '#762344',
                    borderRadius: '10px',
                    marginBottom: '-5px',
                    marginRight: '5px',
                  }"
                  :name="defaultIconsLucide.info"
                  :size="20"
                  color="#fff"
                />
                <a>Dato generado automáticamente por el sistema</a>
              </p>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <p class="text-grey-6 text-weight-medium mb-1">
                Cerrar sesión por inactividad en minutos*
              </p>
              <GenericInput
                v-if="headerProps.editFields.value"
                :required="false"
                :default_value="data_parameters.session_timeout_minutes"
                type="number"
                :rules="[
                  (v: string) => !!v || 'Cerrar sesión por inactividad es requerido',
                  (v: string) => !isNaN(Number(v)) || 'Solo se permiten números',
                  (v: string) => Number(v) > 0 || 'Debe ser mayor a 0',
                  (v: string) => Number(v) <= 5 || 'Debe ser menor o igual a 5'
                ]"
                @update:model-value="
                  data_parameters.session_timeout_minutes = $event
                "
              />
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom"
              >
                {{ data_parameters.session_timeout_minutes }} minutos
              </p>
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom mb-0"
              >
                <Icon
                  :styleCustom="{
                    backgroundColor: '#762344',
                    borderRadius: '10px',
                    marginBottom: '-5px',
                    marginRight: '5px',
                  }"
                  :name="defaultIconsLucide.info"
                  :size="20"
                  color="#fff"
                />
                <a>Dato generado automáticamente por el sistema</a>
              </p>
            </div>
          </div>
          <div class="q-mx-md">
            <q-separator />
          </div>
          <div class="row q-pt-lg q-pb-lg q-col-gutter-md">
            <div class="col-12">
              <p class="text-black-10 text-weight-bold text-h6 mb-0">
                Administración de sesiones y acceso
              </p>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <p class="text-grey-6 text-weight-medium mb-1">
                Sesiones activas permitidas*
              </p>
              <GenericInput
                v-if="headerProps.editFields.value"
                :required="false"
                :default_value="data_parameters.max_active_sessions"
                type="number"
                :rules="[
                  (v: string) => !!v || 'Sesiones activas permitidas es requerido',
                  (v: string) => !isNaN(Number(v)) || 'Solo se permiten números',
                  (v: string) => Number(v) > 0 || 'Debe ser mayor a 0',
                  (v: string) => Number(v) <= 1000 || 'Debe ser menor o igual a 1000',
                ]"
                @update:model-value="
                  data_parameters.max_active_sessions = $event
                "
              />
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom"
              >
                {{ data_parameters.max_active_sessions }} sesiones activas
              </p>
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom mb-0"
              >
                <Icon
                  :styleCustom="{
                    backgroundColor: '#762344',
                    borderRadius: '10px',
                    marginBottom: '-5px',
                    marginRight: '5px',
                  }"
                  :name="defaultIconsLucide.info"
                  :size="20"
                  color="#fff"
                />
                <a>Dato generado automáticamente por el sistema</a>
              </p>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <p class="text-grey-6 text-weight-medium mb-1">Tipo de login*</p>

              <GenericSelectorComponent
                v-if="headerProps.editFields.value"
                :manual_option="login_types"
                :map_options="true"
                :display_label="'label'"
                :display_value="'value'"
                :required="true"
                :default_value="data_parameters.login_type ?? ''"
                :auto_complete="false"
                :rules="[(val: string) => !!val || 'Aplicación es Requerido']"
                @update:model-value="data_parameters.login_type = $event"
              />
              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom"
              >
                {{
                  login_types.find(
                    (option) => option.value === data_parameters.login_type
                  )?.label || 'No registrado'
                }}
              </p>

              <p
                v-if="!headerProps.editFields.value"
                class="text-black-10 text-weight-medium text__wrap-custom mb-0"
              >
                <Icon
                  :styleCustom="{
                    backgroundColor: '#762344',
                    borderRadius: '10px',
                    marginBottom: '-5px',
                    marginRight: '5px',
                  }"
                  :name="defaultIconsLucide.info"
                  :size="20"
                  color="#fff"
                />
                <a>Dato generado automáticamente por el sistema</a>
              </p>
            </div>
          </div>
        </div>
        <div class="row q-gutter-sm justify-end">
          <q-btn
            v-if="headerProps.editFields.value"
            unelevated
            class="text-capitalize btn-filter custom"
            color="orange"
            label="Actualizar información"
            text-color="white"
            @click="validateForms"
          />
        </div>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 470px"
      title="¿Desea guardar la información?"
      description_message=""
      @confirm="handleSave"
    />
  </q-form>
</template>

<style lang="scss" src="./ListUserParameterView.scss" />
