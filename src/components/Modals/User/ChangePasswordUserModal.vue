<script setup lang="ts">
import { computed } from 'vue';
import { defaultIcons } from '@/utils';
// Components
import { useChangePasswordUserModal } from '@/components/Modals/User/ChangePasswordUserModal'
import VCard from '@/components/common/VCard/VCard.vue';
// Assets:
import imageUrl from '@/assets/images/alert/caution-image.svg'

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const {
  isOpenModal,
  newPassword,
  passwordConfirmation,
  showPassword,
  showPasswordConfirmation,
  handleCancelButton,
  handleChangeUserPassword,
  suggestPassword
} = useChangePasswordUserModal(props, emit)

const isFormInvalid = computed(() => {
  if (newPassword.value === passwordConfirmation.value && newPassword.value !== '') return false
  else return true
})
</script>

<template>
  <div>
    <q-dialog v-model="isOpenModal" persistent>
      <VCard custom-style="width: 500px; max-width: 80vw">
        <template #content-card>
          <div class="q-pa-md">
            <div class="row justify-end">
              <q-btn
                :icon="defaultIcons.close"
                flat
                round
                dense
                class="text-grey-6"
                @click="handleCancelButton"
                v-close-popup
              />
            </div>
            <div class="q-my-sm q-pb-lg text-center">
              <img
                :src="imageUrl"
                alt="Advertencia"
                style="width: 180px; height: auto;"
              />
            </div>
            <q-form @submit="handleChangeUserPassword">
              <p style="font-size: 20px;" class="text-primary text-center">
                <b> Cambiar contraseña </b>
              </p>
              <div class="q-px-lg q-mt-lg">
                <p class="text-grey-7 text-weight-medium mb-0">
                  Contraseña nueva *
                </p>
                <q-input
                  autofocus
                  outlined
                  v-model="newPassword"
                  dense
                  :type="showPassword ? 'text' : 'password'"
                  class="q-mb-none"
                  :rules="[
                      (val) => !!val || 'La contraseña es obligatoria',
                      (val) => (val.match(/\d/g) || []).length >= 2 || 'Debe contener al menos 2 números',
                      (val) => val.length > 8 || 'Debe tener más de 8 caracteres',
                      (val) => val.length < 21 || 'Debe tener menos de 20 caracteres',
                      (val) => /[a-z]/.test(val) || 'Debe contener al menos una letra minúscula',
                      (val) => /[A-Z]/.test(val) || 'Debe contener al menos una letra mayúscula',
                      (val) => /[^a-zA-Z0-9]/.test(val) || 'Debe contener al menos un carácter especial',
                    ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? defaultIcons.eye : defaultIcons.eyeOff"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
              </div>
              <div class="q-px-lg q-my-md">
                <p class="text-grey-7 text-weight-medium mb-0">
                  Confirmar contraseña *
                </p>
                <q-input
                  outlined
                  v-model="passwordConfirmation"
                  dense
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  placeholder=""
                  class="q-mb-none"
                  :rules="[
                    (val) => !!val || 'La confirmación de contraseña es obligatoria',
                    (val) => val === newPassword || 'Las contraseñas no coinciden'
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="showPasswordConfirmation ? defaultIcons.eye : defaultIcons.eyeOff"
                      class="cursor-pointer"
                      @click="showPasswordConfirmation = !showPasswordConfirmation"
                    />
                  </template>
                </q-input>
              </div>

              <div class="row justify-center q-mb-lg">
                <q-btn
                  no-caps
                  unelevated
                  outline
                  class="back-btn"
                  text-color="indigo-10"
                  color="white"
                  dense
                  label="Sugerir contraseña"
                  :icon="defaultIcons.cached"
                  @click="suggestPassword"
                />
              </div>

              <div class="q-pb-lg q-px-lg">
                <div class="row justify-center">
                  <q-btn
                    size="md"
                    unelevated
                    flat
                    no-caps
                    class="btn__history-outline col-5 q-ma-sm"
                    color="indigo-10"
                    label="Cancelar"
                    @click="handleCancelButton()"
                    v-close-popup
                  />
                  <q-btn
                    size="md"
                    unelevated
                    no-caps
                    class="text-initial btn__history col-5 q-ma-sm"
                    color="indigo-10"
                    label="Aceptar"
                    :disable="isFormInvalid"
                    type="submit"
                  />
                </div>
              </div>
            </q-form>
          </div>
        </template>
      </VCard>
    </q-dialog>
  </div>
</template>
<style scoped lang="scss">
.back-btn {
  border-radius: 20px;
  width: 180px;
  height: 32px;
  font-size: 13px;
}
</style>
