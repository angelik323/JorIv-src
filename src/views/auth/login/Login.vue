<template>
  <div class="container-login-title text-left">
    <p
      class="text-weight-medium text-left q-px-md"
      :class="$q.screen.width <= 607 ? 'text-h5' : 'text-h4'"
    >
      Acceso a Intranet Fiduprevisora
    </p>
    <p
      class="text-left q-px-md"
      :class="$q.screen.height <= 607 ? 'text-body2' : ''"
    >
      Ingrese sus credenciales para explorar todas las funcionalidades
      disponibles.
    </p>
  </div>
  <q-form
    ref="loginForm"
    class="container-login-form mb-2 mt-3 q-px-md"
    :class="$q.screen.height <= 607 ? 'px-3' : 'px-4'"
  >
    <div class="row q-col-gutter-sm">
      <div class="col-12 p-2">
        <GenericInput
          label="Usuario"
          placeholder="Ingrese su correo electrónico"
          :default_value="form.email"
          :prepend_icon="defaultIconsLucide.account"
          required
          :rules="[
            (v: string) => !!v || 'El usuario es requerido',
            (v: string) => 
              (v && v.length >= 4) || 'Ingrese minimo cuatro (4) caracteres',
          ]"
          @update:model-value="form.email = $event"
        />
      </div>

      <div class="col-12 p-2">
        <GenericInput
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          :default_value="form.password"
          :type="showPassword ? 'text' : 'password'"
          :prepend_icon="defaultIconsLucide.lock"
          :append_icon="
            showPassword ? defaultIconsLucide.eyeOff : defaultIconsLucide.eye
          "
          append_clickable
          :append_aria_label="
            showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
          "
          required
          :rules="[                                      
            (v: string) => !!v || 'La contraseña es requerida',
          ]"
          @click:append-icon="showPassword = !showPassword"
          @update:model-value="form.password = $event"
        />
      </div>

      <div class="col-12 flex justify-end q-pt-none">
        <a
          class="forgot-password-text"
          href="#"
          @click="modalPropertiesRecovery.open = true"
        >
          ¿Ha olvidado la contraseña?
        </a>
      </div>

      <div class="col-12 col-md-5 col-lg-5 q-mt-lg">
        <Button
          class="full-width btn__login custom"
          label="Ingresar"
          color="orange"
          size="md"
          no-caps
          unelevated
          :outline="false"
          @click="loginAction(false)"
        />
      </div>
      <div class="col-12 col-md-7 col-lg-7 q-mt-lg">
        <Button
          class="full-width btn__login"
          label="Ingresar directorio activo"
          size="md"
          no-caps
          unelevated
          :outline="false"
          @click="loginAction(true)"
        />
      </div>
    </div>
  </q-form>

  <Modal
    :title="''"
    :class-title="clasTitleModal"
    :openDialog="modalProperties.open"
    :minWidth="$q.screen.width <= 607 ? '100%' : modalProperties.minWidth"
    @update:openDialog="closeModal()"
  >
    <template #content-modal>
      <LogoMain />
      <p
        class="text-center text-weight-bold mb-0"
        :class="$q.screen.width <= 607 ? 'text-h5' : 'text-h4'"
      >
        Cambio de contraseña
      </p>
      <p
        class="text-center text-body2 text-weight-medium"
        :class="$q.screen.width <= 607 ? 'text-body2' : 'text-body'"
      >
        Ingrese su nueva contraseña
      </p>
      <q-form ref="changePasswordForm">
        <div class="row justify-center q-col-gutter-sm">
          <div class="col-12 p-2">
            <p class="text-weight-medium mb-0 mx-2">Contraseña nueva</p>
            <GenericInput
              required
              placeholder="Contraseña nueva"
              :default_value="formModal.password"
              :prepend_icon="defaultIconsLucide.lock"
              :type="showPasswordModal.pass ? 'text' : 'password'"
              :append_icon="
                showPasswordModal.pass
                  ? defaultIconsLucide.eyeOff
                  : defaultIconsLucide.eye
              "
              append_clickable
              @click:append-icon="
                showPasswordModal.pass = !showPasswordModal.pass
              "
              @update:model-value="formModal.password = $event"
              :rules="[
                (v: string) => !!v || 'La contraseña es requerida',
                (v: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\W{2,})[\w\W]{8,16}$/.test(
                    v
                  ) || 'La contraseña no cumple con las políticas establecidas',
              ]"
            />
          </div>
          <div class="col-12 p-2">
            <p class="text-weight-medium mb-0 mx-2">Confirmar contraseña</p>
            <GenericInput
              required
              placeholder="Confirmar contraseña"
              :default_value="formModal.password_confirmation"
              :prepend_icon="defaultIconsLucide.lock"
              :type="showPasswordModal.confirmation ? 'text' : 'password'"
              :append_icon="
                showPasswordModal.confirmation
                  ? defaultIconsLucide.eyeOff
                  : defaultIconsLucide.eye
              "
              append_clickable
              @click:append-icon="
                showPasswordModal.confirmation = !showPasswordModal.confirmation
              "
              @update:model-value="formModal.password_confirmation = $event"
              :rules="[
                (v: string) => v === formModal.password || 'La contraseña no coincide'
              ]"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <q-btn
              outline
              class="full-width btn__standart"
              color="indigo-10"
              label="Cancelar"
              no-caps
              unelevated
              @click="closeModal"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <q-btn
              class="full-width btn__standart"
              color="indigo-10"
              label="Continuar"
              no-caps
              unelevated
              @click="changePasswordAction"
            />
          </div>
        </div>
      </q-form>
    </template>
  </Modal>

  <Modal
    :title="''"
    :class-title="clasTitleModal"
    :openDialog="modalPropertiesRecovery.open"
    :minWidth="
      $q.screen.width <= 607 ? '100%' : modalPropertiesRecovery.minWidth
    "
    @update:openDialog="closeModalRecovery()"
  >
    <template #content-modal>
      <LogoMain />
      <p
        class="text-center text-weight-bold mb-0"
        :class="$q.screen.width <= 607 ? 'text-h5' : 'text-h4'"
      >
        {{
          noMethodAuth
            ? 'Verificación en correo electrónico'
            : modalPropertiesRecovery.title
        }}
      </p>
      <p
        v-if="!noMethodAuth"
        class="text-center text-body2 text-weight-medium"
        :class="$q.screen.width <= 607 ? 'text-body2' : 'text-body'"
      >
        {{ modalPropertiesRecovery.subtitle }}
      </p>
      <q-form class="modal-form" ref="recoveryPasswordForm">
        <div
          class="row justify-center q-col-gutter-sm"
          v-if="!security_question && !noMethodAuth"
        >
          <div class="col-12 p-2">
            <p class="text-weight-medium mb-0 mx-2">Correo electrónico</p>
            <GenericInput
              required
              placeholder="Ingrese su correo electrónico"
              :default_value="formModalRecovery.email"
              :prepend_icon="defaultIconsLucide.account"
              :rules="[
                (v: string) => !!v || 'El correo electrónico es requerido',
                (v: string) =>
                  (v && v.length >= 5) || 'Ingrese un correo electrónico válido',
                (v: string) =>
                  /^(?=.{5,100}$)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,63}\.[a-zA-Z]{2,}$/.test(
                    v
                  ) || 'Ingrese un correo electrónico válido',
              ]"
              @update:model-value="formModalRecovery.email = $event"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <q-btn
              outline
              class="full-width btn__standart"
              color="indigo-10"
              label="Cancelar"
              no-caps
              unelevated
              @click="modalPropertiesRecovery.open = false"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <q-btn
              class="full-width btn__standart"
              color="indigo-10"
              label="Continuar"
              no-caps
              unelevated
              @click="getDataSecurityAction"
            />
          </div>
        </div>
        <div
          class="row justify-center q-col-gutter-sm mt-4"
          v-if="security_question"
        >
          <div class="col-12 p-2">
            <p class="text-weight-medium text-h6 mb-0 mx-2">
              Pregunta de seguridad
            </p>
            <p class="text-weight-medium text-body2 text-grey-6 mb-0 mx-1">
              {{ question }}
            </p>

            <p class="text-weight-medium text-body2 text-grey-6 mb-0 mx-2 mt-6">
              Respuesta de seguridad
            </p>
            <GenericInput
              required
              placeholder=""
              :default_value="formModalRecovery.answer"
              :rules="[
                (v: string) => !!v || 'La respuesta es requerida'
              ]"
              @update:model-value="formModalRecovery.answer = $event"
            />
            <div class="row q-col-gutter-md items-center mb-4">
              <q-icon
                class="cursor-pointer"
                size="sm"
                name="mdi-information"
                color="indigo-10"
              />
              <p class="mb-0 text-caption text-grey-6">{{ reminder }}</p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <q-btn
              outline
              class="full-width btn__standart"
              color="indigo-10"
              label="Cancelar"
              no-caps
              unelevated
              @click="closeModalRecovery()"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <q-btn
              class="full-width btn__standart"
              color="indigo-10"
              label="Verificar"
              no-caps
              unelevated
              @click="recoveryPasswordAction(false)"
            />
          </div>
        </div>
        <div
          class="row justify-center q-col-gutter-sm mt-4"
          v-if="noMethodAuth"
        >
          <div class="col-12 p-2">
            <p class="text-weight-medium mb-0 mb-1 mx-2">
              Código de verificación
            </p>
            <div
              class="row inputs items-center place-content--center q-col-gutter-sm mb-4"
            >
              <q-input
                v-for="(_, index) in Array(6)"
                :ref="'input' + index"
                class="col-xs-3 col-sm-2 col-md-2 col-lg-2 code"
                v-model="formRecoveryEmail[index]"
                outlined
                dense
                placeholder="_"
                :maxlength="1"
                @keyup="handleKeyUp($event, index)"
                @keydown="checkDigit($event, '', 1)"
                :rules="[
                  (v: string) => !!v || '',
                ]"
              />
            </div>
            <p
              class="text-grey-6 text-caption mt-3"
              :class="$q.screen.height <= 607 ? 'text-body2' : ''"
            >
              Por favor ingresa el código de seis (6) digitos que enviamos a tu
              correo electrónico.
              <strong>Expira en {{ contador_sms }} segundos</strong>
            </p>
          </div>
          <div class="col-12">
            <q-btn
              class="full-width btn__standart"
              color="indigo-10"
              label="Verificar"
              no-caps
              unelevated
              @click="recoveryPasswordAction(true)"
              :disable="contador_sms === 0"
            />
          </div>
          <div class="col-12">
            <q-btn
              flat
              class="full-width btn__login mt-3"
              color="indigo-10"
              label="Reenviar código"
              no-caps
              unelevated
              :disable="contador_sms !== 0"
              @click="_restartCountdownVerifySMSOTP()"
            />
          </div>
        </div>
      </q-form>
    </template>
  </Modal>
</template>

<script setup lang="ts">
// Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Modal from '@/components/common/Modal/ModalComponent.vue'
import LogoMain from '@/components/main-logo/MainLogo.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic View
import useLogin from '@/views/auth/login/Login'

// Imports variables
import { defaultIconsLucide } from '@/utils'
const {
  form,
  formModal,
  showPassword,
  modalProperties,
  modalPropertiesRecovery,
  clasTitleModal,
  loginForm,
  changePasswordForm,
  showPasswordModal,
  recoveryPasswordForm,
  security_question,
  noMethodAuth,
  formModalRecovery,
  formRecoveryEmail,
  question,
  reminder,
  contador_sms,

  loginAction,
  changePasswordAction,
  closeModal,
  closeModalRecovery,
  recoveryPasswordAction,
  getDataSecurityAction,
  handleKeyUp,
  checkDigit,
  _restartCountdownVerifySMSOTP,
} = useLogin()
</script>

<style lang="scss">
.card-action {
  padding: 3%;
}

.forgot-password-text {
  color: $orange;
  font-size: 0.8125rem;
  font-weight: bold;
  line-height: 100%;
  letter-spacing: 0px;
  text-decoration: none;
}
</style>
