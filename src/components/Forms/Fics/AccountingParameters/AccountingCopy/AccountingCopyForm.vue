<template>
  <section class="q-my-md">
    <VCard>
      <template #content-card>
        <q-form ref="accountingCopyFormElementRef" class="q-pa-lg">
          <p class="text-subtitle1 text-weight-bold">
            {{ headerProps.title }}
          </p>
          <p class="text-weight-medium text-grey-6">
            {{ headerProps.description }}
          </p>
          <div class="row q-col-gutter-md">
            <div class="col-xs-12 col-sm-12 col-md-6">
              <GenericSelectorComponent
                label="Bloque origen"
                :default_value="models.origin_accounting_block_id"
                :manual_option="accounting_blocks_origin"
                map_options
                first_filter_option="label"
                second_filter_option="label"
                auto_complete
                :required="true"
                :rules="[
                (v: string) => useRules().is_required(v, 'El campo Bloque origen es requerido'),
                (v: string) => useRules().min_length(v, 1),
                (v: string) => useRules().max_length(v, 4),
              ]"
                @update:model-value="models.origin_accounting_block_id = $event"
              />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-6">
              <GenericSelectorComponent
                label="Bloque destino"
                :default_value="models.destination_accounting_block_id"
                :manual_option="accounting_blocks_destination"
                map_options
                first_filter_option="label"
                second_filter_option="label"
                auto_complete
                :required="true"
                :rules="[
                (v: string) => useRules().is_required(v, 'El campo Bloque destino es requerido'),
                (v: string) => useRules().min_length(v, 1),
                (v: string) => useRules().max_length(v, 4),
              ]"
                @update:model-value="
                  models.destination_accounting_block_id = $event
                "
              />
            </div>
          </div>
          <div class="flex justify-end q-mt-sm q-gutter-md">
            <Button
              label="Generar copia"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="onSubmit"
            />
          </div>
        </q-form>
      </template>
    </VCard>
  </section>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Composables
import { useRules } from '@/composables'

// Logic view
import useAccountingCopyForm from '@/components/Forms/Fics/AccountingParameters/AccountingCopy/AccountingCopyForm'

const {
  headerProps,
  models,
  accountingCopyFormElementRef,
  onSubmit,
  accounting_blocks_origin,
  accounting_blocks_destination,
} = useAccountingCopyForm()
</script>
