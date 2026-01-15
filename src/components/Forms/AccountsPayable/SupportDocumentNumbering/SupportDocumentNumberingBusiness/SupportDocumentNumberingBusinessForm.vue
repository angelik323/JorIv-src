<template>
  <q-form ref="basicDataFormRef" class="q-px-xl q-py-md">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">NIT tributario</p>
          <p class="text-weight-medium no-margin">
            {{ models.nit ?? '' }}
          </p>
        </div>
        <div class="col-12 col-md-4 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">Negocio</p>
          <p class="text-weight-medium no-margin">
            {{ models.business_code ?? '' }}
          </p>
        </div>
        <div class="col-12 col-md-4 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">Resolución</p>
          <p class="text-weight-medium no-margin">
            {{ models.resolution ?? '' }}
          </p>
        </div>
      </div>
      <q-separator class="q-my-lg" />
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericInputComponent
            label="Prefijo"
            :default_value="models.prefix"
            required
            @update:model-value="models.prefix = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'El prefijo es obligatorio'),
                (val: string) => useRules().only_alphanumeric(val),
                (val: string) => useRules().max_length(val,8),
            ]"
          />
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1" v-else>
          <p class="text-weight-bold mb-3">Prefijo</p>
          <p class="text-weight-medium no-margin">
            {{ models.prefix }}
          </p>
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericInputComponent
            label="Rango inicial"
            :default_value="models.range_start"
            disabled
            required
          />
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1" v-else>
          <p class="text-weight-bold mb-3">Rango inicial</p>
          <p class="text-weight-medium no-margin">
            {{ models.range_start }}
          </p>
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericInputComponent
            label="Rango final"
            :default_value="models.range_end"
            required
            disabled
          />
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1" v-else>
          <p class="text-weight-bold mb-3">Rango final</p>
          <p class="text-weight-medium no-margin">
            {{ models.range_end }}
          </p>
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericInputComponent
            label="Numero siguiente disponible"
            type="number"
            :default_value="models.next_available_number"
            required
            disabled
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1" v-else>
          <p class="text-weight-bold mb-3">Numero siguiente disponible</p>
          <p class="text-weight-medium no-margin">
            {{ models.next_available_number }}
          </p>
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericDateInputComponent
            label="Fecha vigencia inicial"
            :default_value="models.validity_start_date"
            required
            disabled
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1" v-else>
          <p class="text-weight-bold mb-3">Fecha vigencia inicial</p>
          <p class="text-weight-medium no-margin">
            {{ models.validity_start_date }}
          </p>
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericDateInputComponent
            label="Fecha vigencia final"
            :default_value="models.validity_end_date"
            required
            disabled
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1" v-else>
          <p class="text-weight-bold mb-3">Fecha vigencia final</p>
          <p class="text-weight-medium no-margin">
            {{ models.validity_end_date }}
          </p>
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericSelectorComponent
            label="Estado"
            :default_value="models.status_id"
            :manual_option="default_statuses"
            :map_options="true"
            disabled
            required
            @update:model-value="models.status_id = $event"
            :rules="[(val: string) => useRules().is_required(val, 'El estado es requerido')]"
          />
        </div>
        <div class="col-12 col-md-3 text-black-90" v-else>
          <p class="text-weight-bold mb-3">Estado</p>
          <ShowStatus :type="models.status_id ?? 0" />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
//Componets
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

//Interfaces
import { ISupportDocumentNumberingBusinessForm } from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { ActionType } from '@/interfaces/global/Action'

//Composables
import { useRules } from '@/composables'

//Logic
import useSupportDocumenNumberingBusinessForm from '@/components/Forms/AccountsPayable/SupportDocumentNumbering/SupportDocumentNumberingBusiness/SupportDocumentNumberingBusinessForm'

const props = withDefaults(
  defineProps<{
    data?: ISupportDocumentNumberingBusinessForm | null
    action: ActionType
  }>(),
  {}
)

const emits =
  defineEmits<
    (
      e: 'update:data',
      value: ISupportDocumentNumberingBusinessForm | null
    ) => void
  >()

const { basicDataFormRef, models, default_statuses } =
  useSupportDocumenNumberingBusinessForm(props, emits)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
