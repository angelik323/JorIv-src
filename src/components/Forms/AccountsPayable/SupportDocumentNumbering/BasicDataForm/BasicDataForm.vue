<template>
  <q-form ref="basicDataFormRef" class="q-px-xl q-py-md">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericInputComponent
            label="NIT tributario"
            :default_value="models.nit"
            disabled
            required
          />
        </div>
        <div
          :class="resolutionForm ? 'col-md-3' : 'col-md-4'"
          class="col-12 text-black-90 mb-1"
          v-else
        >
          <p class="text-weight-bold mb-3">NIT tributario</p>
          <p class="text-weight-medium no-margin">
            {{ models.nit }}
          </p>
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericInputComponent
            label="Nombre"
            :default_value="models.name"
            disabled
            required
          />
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericSelectorComponent
            label="Estado"
            :default_value="models.status"
            :manual_option="status"
            :map_options="true"
            required
            disabled
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericSelectorComponent
            label="NIT emisor"
            :default_value="models.delegate_third_party_id"
            :manual_option="third_parties"
            :map_options="true"
            required
            @update:model-value="models.delegate_third_party_id = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'El NIT emisor es obligatorio'),

              ]"
          />
        </div>
        <div
          :class="resolutionForm ? 'col-md-3' : 'col-md-4'"
          class="col-12 text-black-90 mb-1"
          v-else
        >
          <p class="text-weight-bold mb-3">NIT emisor</p>
          <p class="text-weight-medium no-margin">
            {{ models.delegate_third_party_nit ?? '' }}
          </p>
        </div>

        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericInputComponent
            label="Tipo de documento emisor"
            :default_value="models.delegate_third_party_document_type"
            disabled
            required
          />
        </div>
        <div
          :class="resolutionForm ? 'col-md-3' : 'col-md-4'"
          class="col-12 text-black-90"
          v-else
        >
          <p class="text-weight-bold mb-3">Tipo de documento emisor</p>
          <p class="text-weight-medium no-margin">
            {{ models.delegate_third_party_document_type }}
          </p>
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericInputComponent
            label="Nombre emisor"
            :default_value="models.delegate_third_party_name"
            disabled
            required
          />
        </div>
        <div
          :class="resolutionForm ? 'col-md-3' : 'col-md-4'"
          class="col-12 text-black-90"
          v-else
        >
          <p class="text-weight-bold mb-3">Nombre emisor</p>
          <p class="text-weight-medium no-margin">
            {{ models.delegate_third_party_name }}
          </p>
        </div>
        <div
          class="col-12 col-md-4 text-black-90"
          v-if="action === 'view' && !resolutionForm"
        >
          <p class="text-weight-bold mb-3">Estado</p>
          <ShowStatus :type="models.status ?? 0" />
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

//Interfaces
import { ISupportDocumentNumberingForm } from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { ActionType } from '@/interfaces/global/Action'

// Composables
import { useRules } from '@/composables'

//Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/SupportDocumentNumbering/BasicDataForm/BasicDataForm'

const props = withDefaults(
  defineProps<{
    data?: ISupportDocumentNumberingForm | null
    action: ActionType
    resolutionForm?: boolean
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:data', value: ISupportDocumentNumberingForm | null) => void
  >()

const { basicDataFormRef, models, third_parties, status } = useBasicDataForm(
  props,
  emits
)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
