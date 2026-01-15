<template>
  <q-page class="login" :padding="!$q.screen.lt.sm">
    <div v-if="!$q.screen.lt.md" class="login__banner">
      <h1>
        Bienvenido a nuestra
        <span class="text-orange">intranet</span> Fiduprevisora
      </h1>

      <p>
        Aquí es donde se fusiona tu dedicación con la eficiencia. <br />
        ¡Ingresa y sé parte del cambio!
      </p>

      <div class="row q-col-gutter-md">
        <div class="col-6">
          <ul>
            <li>Lleva un control de tus clientes</li>
            <li>Accede a datos en tiempo real</li>
            <li>Personaliza tus reportes</li>
          </ul>
        </div>

        <div class="col-6">
          <ul>
            <li>Optimiza la gestión de documentos</li>
            <li>Mejora la eficiencia operativa</li>
            <li>Mantén la seguridad de la información</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="login__form">
      <LogoMain size="14.375rem" />

      <h1>Acceso a Intranet Fiduprevisora</h1>

      <p>
        Ingrese sus credenciales para explorar todas las funcionalidades
        disponibles.
      </p>

      <q-form ref="loginForm">
        <div class="row q-col-gutter-sm q-mb-xl">
          <div class="col-12">
            <GenericInput
              label="Correo electrónico"
              placeholder="Ingrese"
              :default_value="form.email"
              required
              :rules="[
                (v: string) => !!v || 'El correo electrónico es requerido',
                (v: string) => (v && v.length >= 4) || 'Ingrese minimo cuatro (4) caracteres',
              ]"
              @update:model-value="form.email = $event"
            />
          </div>

          <div class="col-12">
            <GenericInput
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              :default_value="form.password"
              :type="showPassword ? 'text' : 'password'"
              :prepend_icon="defaultIconsLucide.lock"
              :append_icon="
                showPassword
                  ? defaultIconsLucide.eyeOff
                  : defaultIconsLucide.eye
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

          <div class="col-12 flex justify-end">
            <a
              class="forgot-password-text"
              href="#"
              aria-label="Olvidé mi contraseña"
              @click="modalPropertiesRecovery.open = true"
            >
              ¿Ha olvidado la contraseña?
            </a>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
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

          <div class="col-12 col-md-6">
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Components
import LogoMain from '@/components/main-logo/MainLogo.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'

// Utils
import { defaultIconsLucide } from '@/utils'

// Logic view
import useLogin from '@/views/auth/login/Login'

const { form, showPassword, modalPropertiesRecovery, loginForm, loginAction } =
  useLogin()
</script>

<style lang="scss" src="./Login.scss" />
