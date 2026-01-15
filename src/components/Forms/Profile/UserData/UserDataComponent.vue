<script setup lang="ts">
// Components
import Card from '@/components/common/VCard/VCard.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Logic View
import useUserData from '@/components/Forms/Profile/UserData/UserDataComponent'

// Imports variables
const { models, execConfirmation } = useUserData()
</script>
<template>
  <Card>
    <template #content-card>
      <q-form ref="userDataForm" class="mx-3 mt-3 mb-3">
        <div class="col-12 mt-3 mb-3">
          <p class="text-h6 mb-0">Mi perfil</p>
        </div>
        <div class="row q-col-gutter-md p-3">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <GenericInput
              label="Nombre*"
              required
              :default_value="models.names"
              :rules="[
                  (v: string) => !!v || 'El nombre es requerido',
                  (v: string) => v.length >= 3 || 'Debe tener mínimo 3 caracteres',
                  (v: string) => v.length <= 50 || 'Debe tener máximo 50 caracteres',
                  (v: string) => /^[ A-Za-zÀ-ÖØ-öø-ÿ]*$/.test(v) || 'Debe tener solo letras'
              ]"
              @update:model-value="models.names = $event"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <GenericInput
              label="Apellidos*"
              required
              :default_value="models.lastnames"
              :rules="[
                  (v: string) => !!v || 'El apellido es requerido',
                  (v: string) => v.length >= 3 || 'Debe tener mínimo 3 caracteres',
                  (v: string) => v.length <= 50 || 'Debe tener máximo 50 caracteres',
                  (v: string) => /^[ A-Za-zÀ-ÖØ-öø-ÿ]*$/.test(v) || 'Debe tener solo letras'
              ]"
              @update:model-value="models.lastnames = $event"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <GenericInput
              label="Documento*"
              required
              :default_value="models.document"
              :rules=" [
                  (v: string) => !!v || 'El documento es requerido', 
                  (v: string) => /^[A-Za-z0-9]*$/.test(v) || 'Debe tener solo números y letras',
                  (v: string) => v.length >= 6 || 'Debe tener mínimo 6 caracteres',  
                  (v: string) => v.length <= 50 || 'Debe tener máximo 50 caracteres'
                ]"
              @update:model-value="models.document = $event"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <GenericInput
              label="Teléfono*"
              required
              :default_value="models.phone"
              type="number"
              :rules=" [
                  (v: string) => !!v || 'El teléfono es requerido', 
                  (v: string) => v.length >= 5 || 'Debe tener mínimo 5 caracteres',  
                  (v: string) => v.length <= 15 || 'Debe tener máximo 15 caracteres'
                ]"
              @update:model-value="models.phone = $event"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <GenericInput
              label="Correo electrónico*"
              required
              :default_value="models.email"
              :rules="[
                (v: string) => !!v || 'El correo electrónico es requerido',
                (v: string) =>
                  (v && v.length >= 5) || 'Ingrese un correo electrónico válido',
                (v: string) =>
                  /^(?=.{5,100}$)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,63}\.[a-zA-Z]{2,}$/.test(
                    v
                  ) || 'Ingrese un correo electrónico válido',
              ]"
              @update:model-value="models.email = $event"
            />
          </div>
        </div>
        <div class="row items-center justify-end mt-2">
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <q-btn
              class="full-width btn__standart"
              color="indigo-10"
              label="Actualizar"
              no-caps
              unelevated
              @click="execConfirmation"
            />
          </div>
        </div>
      </q-form>
    </template>
  </Card>
</template>

<style scoped>
* {
  box-sizing: border-box !important;
}
</style>
