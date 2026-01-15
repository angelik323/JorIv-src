<template>
  <q-form ref="informationForm" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="models.currency_value"
            required
            disabled
            :label="'Valor moneda'"
            :manual_option="[]"
            map_options
            auto_complete
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="models.conversion_factor"
            required
            disabled
            :label="'Factor de conversión'"
            :manual_option="[]"
            map_options
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="models.compliance_date"
            required
            :label="'Fecha de cumplimiento'"
            :manual_option="[]"
            map_options
            :rules="[]"
            @update:model-value="(val) => (models.compliance_date = val)"
          />
        </div>

        <div class="col-12 col-md-4 q-mt-md">
          <GenericDateInputComponent
            :default_value="models.resource_placement_date"
            required
            :label="'Fecha colocación de recursos'"
            :manual_option="[]"
            map_options
            :rules="[]"
            @update:model-value="
              (val) => (models.resource_placement_date = val)
            "
          />
        </div>
        <div class="col-12 col-md-4 q-mt-md">
          <GenericInputComponent
          :default_value="models.compliance_value_origin_currency" required
          disabled :label="'Valor cumplimiento moneda origen'"
          :manual_option="[]" map_options :rules="[]" " />
        </div>
        <div class="col-12 col-md-4 q-mt-md">
          <GenericInputComponent
          :default_value="models.compliance_transfer_value_local_currency"
          required disabled :label="'Valor giro cumplimiento moneda local'"
          :manual_option="[]" map_options :rules="[]" " />
        </div>
      </div>
      <q-separator class="q-my-md" />
      <div class="flex justify-end">
        <Button
          :outline="true"
          label="Atrás"
          size="md"
          unelevated
          class-custom="q-mx-md"
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="_setReferenceTabs({ valuePosition: 1 })"
        />
        <Button
          :outline="false"
          label="Crear"
          size="md"
          unelevated
          :disabled="
            !models.currency_value ||
            !models.conversion_factor ||
            !models.compliance_date ||
            !models.resource_placement_date ||
            !models.compliance_value_origin_currency ||
            !models.compliance_transfer_value_local_currency
          "
          color="orange"
          @click="onSubmit"
          class="text-capitalize btn-filter custom"
        />
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import { useInformationFormForeignCondition } from './informationFormForeignCondition'
const { models, onSubmit, _setReferenceTabs } =
  useInformationFormForeignCondition()
</script>
