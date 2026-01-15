<template>
  <div class="q-mx-xl">
    <q-form @submit.prevent="() => {}">
      <section>
        <div class="q-px-lg q-mt-lg">
          <p class="text-black-10 text-weight-bold text-h6 mb-0">
            Datos personales
          </p>
          <div class="row">
            <div
              class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
            >
              <p class="text-grey-6 text-weight-medium mb-0">
                Dirección de residencia
              </p>
              <AddressGeneratorForm
                v-model="formData.address"
                icon="mdi-map-marker-outline"
              />
            </div>
          </div>
        </div>
      </section>
    </q-form>
    <p class="text-grey-6 text-weight-medium mb-0">
      formData.address: {{ formData.address }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AddressGeneratorForm from '@/components/Forms/AddressGenerator/AddressGeneratorForm.vue'

const formData = ref({} as { address: string })
</script>
