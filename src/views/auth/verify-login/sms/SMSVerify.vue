<script setup lang="ts">
// Logic View
import useSMSVerify from '@/views/auth/verify-login/sms/SMSVerify'

const {
  form,
  contador_sms,
  handleKeyUp,
  checkDigit,
  _restartCountdownVerifySMSOTP,
} = useSMSVerify()
</script>

<template>
  <div class="container-login-title text-center px-1">
    <p
      class="text-weight-medium"
      :class="$q.screen.width <= 607 ? 'text-h5' : 'text-h4'"
    >
      Verificación en dos pasos
    </p>
    <p class="text-grey-6" :class="$q.screen.height <= 607 ? 'text-body2' : ''">
      Obtén un código de verificación desde tu correo o SMS
    </p>
  </div>

  <q-form
    ref="smsForm"
    class="container-login-form mb-2 mt-6"
    :class="$q.screen.height <= 607 ? 'px-3' : 'px-4'"
  >
    <p class="text-weight-medium mb-0 mb-1 mx-2">Código de verificación</p>
    <div class="row items-center place-content--center q-col-gutter-sm">
      <q-input
        v-for="(_, index) in Array(6)"
        :ref="'input' + index"
        class="col-xs-3 col-sm-2 col-md-2 col-lg-2 code"
        v-model="form[index]"
        outlined
        dense
        placeholder="_"
        :maxlength="1"
        @keyup="handleKeyUp($event, index)"
        @keydown="checkDigit($event, '', 1)"
      />
    </div>

    <p
      class="text-grey-6 text-caption mt-3"
      :class="$q.screen.height <= 607 ? 'text-body2' : ''"
    >
      Por favor ingresa el código de seis (6) digitos que enviamos a tu correo
      electrónico o a tu teléfono por SMS.
      <strong>Expira en {{ contador_sms }} segundos</strong>
    </p>
    <p
      class="text-grey-6 text-caption text-center mt-3"
      :class="$q.screen.height <= 607 ? 'text-body2' : ''"
    >
      {{ contador_sms <= 0 ? 'Reenviar el código nuevamente' : '' }}
    </p>

    <q-btn
      class="full-width btn__login"
      color="indigo-10"
      label="Verificar"
      no-caps
      unelevated
      :disable="contador_sms === 0"
    />

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
  </q-form>
</template>
