<template>
  <q-form ref="InformationForm">
    <div class="q-pa-lg">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">

        <!-- Nombre del tipo de pago -->
        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="form.name"
            label="Nombre del tipo de pago"
            placeholder=""
            required
            :rules="[(val: string) => !!val || 'El nombre del tipo de pago es requerido']"
            @update:model-value="form.name = $event"
          />
        </div>

        <!-- Tipo de pago -->
        <div class="col-12 col-md-6">
         <GenericSelectorComponent
            label="Tipo de pago"
            :manual_option="typePaymentOptions"
            :map_options="true"
            :required="true"
            :default_value="form.payment_type"
            :rules="[(val: string) => !!val || 'El tipo de pago es requerido']"
            @update:model-value="form.payment_type = $event"
          />
        </div>

        <!-- ¿Pide autorización? (0/1) -->
        <div class="col-12">
           <RadioYesNo
            v-model="form.require_authorization"
            label="¿Pide autorización?"
            color="orange"
            :is-radio-button="false"
          />
        </div>

      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import useInformationFormPayment from '@/components/Forms/DerivativeContracting/InformationPayment/InformationFormPayment'
import { ActionType } from '@/interfaces/global'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

const props = defineProps<{ action: ActionType }>()

const {
  form,
  typePaymentOptions,
  validateForm,
  hydrateFromStoreIfNeeded,
} = useInformationFormPayment(props)

hydrateFromStoreIfNeeded()
defineExpose({ validateForm })
</script>
