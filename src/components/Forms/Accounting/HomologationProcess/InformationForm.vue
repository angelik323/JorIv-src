<template>
  <div v-if="!process_type">
    <VCard>
      <template #content-card>
        <q-form ref="informationForm" class="q-px-lg q-pt-lg">
          <section>
            <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  label="Proceso"
                  map_options
                  :required="false"
                  placeholder="Seleccione"
                  :clearable="false"
                  :manual_option="vouchers_mappings_process_name_types"
                  :default_value="process_type"
                  :rules="[]"
                  @update:modelValue="process_type = $event"
                />
              </div>
            </div>
          </section>
        </q-form>
        <q-separator class="q-ma-lg" />
      </template>
    </VCard>
  </div>
  <template v-else>
    <component :is="currentComponent" />
  </template>
</template>
<script setup lang="ts">
import VCard from '@/components/common/VCard/VCard.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

import useInformationForm from '@/components/Forms/Accounting/HomologationProcess/InformationForm'

const { vouchers_mappings_process_name_types, process_type, currentComponent } =
  useInformationForm()
</script>
