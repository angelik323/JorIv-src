<template>
  <q-form ref="formElementRef">
    <section class="q-my-md">
      <p class="text-black-10 text-weight-bold text-h6">1. Emisor</p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Nombre del emisor"
            :default_value="models.business_trust_id"
            :manual_option="business_trusts"
            map_options
            auto_complete
            required
            :rules="[(val: string) => useRules().is_required(val,  'El nombre del emisor es requerido')]"
            @update:modelValue="handleIssuerBusiness"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Nombre del emisor</p>
            <p class="text-weight-medium no-margin">
              {{
                models.business_code_snap
                  ? (models.business_code_snap ?? '') +
                    ' - ' +
                    (models.business_name_snap ?? '')
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Tipo de documento"
            :default_value="models.type_document"
            disabled
            :rules="[]"
            @update:model-value="models.type_document = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Tipo de documento</p>
            <p class="text-weight-medium no-margin">
              {{ models.type_document ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Número de documento"
            :default_value="models.document_number"
            disabled
            :rules="[]"
            @update:model-value="models.document_number = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Número de documento</p>
            <p class="text-weight-medium no-margin">
              {{ models.document_number ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-my-md">
      <p class="text-black-10 text-weight-bold text-h6">
        2. Información básica
      </p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Tercero"
            :default_value="models.third_party_billing_id"
            :manual_option="third_parties"
            map_options
            auto_complete
            required
            :rules="[(val: string) => useRules().is_required(val,  'El tercero es requerido')]"
            @update:modelValue="handleThirdParty"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Tercero</p>
            <p class="text-weight-medium no-margin">
              {{ models.third_party_billing_name ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Dirección"
            :default_value="models.third_party_address_snap"
            disabled
            :rules="[]"
            @update:model-value="models.third_party_address_snap = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Dirección</p>
            <p class="text-weight-medium no-margin">
              {{ models.third_party_address_snap ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Teléfono"
            :default_value="models.third_party_phone_snap"
            disabled
            :rules="[]"
            @update:model-value="models.third_party_phone_snap = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Teléfono</p>
            <p class="text-weight-medium no-margin">
              {{ models.third_party_phone_snap ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Correo electrónico"
            :default_value="models.third_party_email_snap"
            disabled
            :rules="[]"
            @update:model-value="models.third_party_email_snap = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Correo electrónico</p>
            <p class="text-weight-medium no-margin">
              {{ models.third_party_email_snap ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-my-md">
      <p class="text-black-10 text-weight-bold text-h6">
        3. Información del documento soporte
      </p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3" v-if="['view'].includes(action)">
          <div class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">
              Número de documento soporte
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.supporting_document_number ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create'].includes(action)"
            label="Fecha de elaboración"
            :default_value="models.production_date"
            required
            disabled
            :rules="[]"
            @update:modelValue="models.production_date = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Fecha de elaboración</p>
            <p class="text-weight-medium no-margin">
              {{ models.production_date ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Forma de pago"
            :default_value="models.payment_methods"
            :manual_option="payment_methods"
            map_options
            auto_complete
            required
            :rules="[
                (val: string) => useRules().is_required(val,  'La forma de pago es requerida'),
              ]"
            @update:modelValue="models.payment_methods = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Forma de pago</p>
            <p class="text-weight-medium no-margin">
              {{ models.payment_methods ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-my-md">
      <p class="text-black-10 text-weight-bold text-h6">
        4. Detalle de la operación
      </p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Descripción del bien/servicio"
            :default_value="models.description"
            required
            :rules="[
                (val: string) => useRules().is_required(val,  'La descripción del bien/servicio es requerida'),
                (val: string) => useRules().max_length(val, 250),
            ]"
            @update:model-value="models.description = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">
              Descripción del bien/servicio
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Codigo movimiento"
            :default_value="models.movement_code_id"
            :manual_option="movement_codes_parameters"
            map_options
            auto_complete
            required
            :rules="[
                (val: string) => useRules().is_required(val,  'El código de movimiento es requerido'),
              ]"
            @update:modelValue="handleMovementCode"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Código movimiento</p>
            <p class="text-weight-medium no-margin">
              {{
                models.movement_code_snap
                  ? models.movement_code_snap +
                    ' - ' +
                    models.movement_code_description
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="¿Genera IVA?"
            :default_value="models.generate_iva"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            disabled
            :required="false"
            :rules="[]"
            @update:modelValue="models.generate_iva = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">¿Genera IVA?</p>
            <p class="text-weight-medium no-margin">
              {{ models.generate_iva ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="IVA (%)"
            :default_value="models.iva_percentage"
            disabled
            :rules="[]"
            @update:model-value="models.iva_percentage = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">IVA (%)</p>
            <p class="text-weight-medium no-margin">
              {{ models.iva_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="¿Genera rete fuente?"
            :default_value="models.generate_source_rete"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            :required="false"
            disabled
            :rules="[]"
            @update:modelValue="models.generate_source_rete = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">¿Genera rete fuente?</p>
            <p class="text-weight-medium no-margin">
              {{ models.generate_source_rete ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Rete fuente (%)"
            :default_value="models.rete_source_percentage"
            disabled
            :rules="[]"
            @update:model-value="models.rete_source_percentage = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete fuente (%)</p>
            <p class="text-weight-medium no-margin">
              {{ models.rete_source_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="¿Genera rete ICA?"
            :default_value="models.generate_source_ica"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            :required="false"
            disabled
            :rules="[]"
            @update:modelValue="models.generate_source_ica = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">¿Genera rete ICA?</p>
            <p class="text-weight-medium no-margin">
              {{ models.generate_source_ica ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Rete ICA (%)"
            :default_value="models.rete_ica_percentage"
            disabled
            :rules="[]"
            @update:model-value="models.rete_ica_percentage = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete ICA (%)</p>
            <p class="text-weight-medium no-margin">
              {{ models.rete_ica_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="¿Genera rete IVA?"
            :default_value="models.generate_rete_iva"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            :required="false"
            disabled
            :rules="[]"
            @update:modelValue="models.generate_rete_iva = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">¿Genera rete IVA?</p>
            <p class="text-weight-medium no-margin">
              {{ models.generate_rete_iva ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Rete IVA (%)"
            :default_value="models.rete_iva_percentage"
            disabled
            :rules="[]"
            @update:model-value="models.rete_iva_percentage = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete IVA (%)</p>
            <p class="text-weight-medium no-margin">
              {{ models.rete_iva_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create'].includes(action)"
            v-model="models.base_amount"
            :currency="'COP'"
            currencyLabel="Valor base"
            required
            :rules="[
                (val: string) => useRules().is_required(val, 'El valor base es requerido'),
                (val: string) => useRules().max_length(val, 30),
              ]"
            @update:model-value="models.base_amount = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Valor base</p>
            <p class="text-weight-medium no-margin">
              {{
                utils.formatCurrencyString(models.base_amount) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create'].includes(action)"
            v-model="models.base_iva"
            :currency="'COP'"
            currencyLabel="IVA"
            disabled
            :rules="[
                (val: string) => useRules().max_length(val, 18),
              ]"
            @update:model-value="models.base_iva = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">IVA</p>
            <p class="text-weight-medium no-margin">
              {{
                utils.formatCurrencyString(models.base_iva) ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create'].includes(action)"
            v-model="models.rete_source"
            :currency="'COP'"
            currencyLabel="Rete fuente"
            disabled
            :rules="[]"
            @update:model-value="models.rete_source = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete fuente</p>
            <p class="text-weight-medium no-margin">
              {{
                utils.formatCurrencyString(models.rete_source) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create'].includes(action)"
            v-model="models.rete_ica"
            :currency="'COP'"
            currencyLabel="Rete ICA"
            disabled
            :rules="[]"
            @update:model-value="models.rete_ica = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete ICA</p>
            <p class="text-weight-medium no-margin">
              {{
                utils.formatCurrencyString(models.rete_ica) ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create'].includes(action)"
            v-model="models.rete_iva"
            :currency="'COP'"
            currencyLabel="Rete IVA"
            disabled
            :rules="[]"
            @update:model-value="models.rete_iva = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete IVA</p>
            <p class="text-weight-medium no-margin">
              {{
                utils.formatCurrencyString(models.rete_iva) ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create'].includes(action)"
            v-model="models.total_amount"
            :currency="'COP'"
            currencyLabel="Valor total"
            disabled
            :rules="[
                (val: string) => useRules().max_length(val, 30),
              ]"
            @update:model-value="models.total_amount = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Valor total</p>
            <p class="text-weight-medium no-margin">
              {{
                utils.formatCurrencyString(models.total_amount) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Días para pago"
            :default_value="models.days_for_pays"
            :manual_option="[]"
            map_options
            auto_complete
            required
            disabled
            :rules="[]"
            @update:modelValue="models.days_for_pays = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Días para pago</p>
            <p class="text-weight-medium no-margin">
              {{ models.days_for_pays ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90 q-my-md" v-if="['view'].includes(action)">
            <p class="text-weight-bold no-margin">Estado</p>
            <div class="no-margin q-mt-md">
              <ShowStatus
                :type="Number(models.status_id ?? 1)"
                status-type="billingPortfolio"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

import { ActionType } from '@/interfaces/global'
import { ISupportingDocumentForm } from '../../../../interfaces/customs/billing-portfolio/SupportingDocument'
import { business_trust_yes_no } from '@/constants'
import { useRules } from '@/composables'

import useBasicDataForm from '@/components/Forms/BillingPortfolio/SupportingDocuments/BasicDataForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: ISupportingDocumentForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ISupportingDocumentForm | null): void
}>()

const {
  formElementRef,
  models,
  utils,
  third_parties,
  business_trusts,
  movement_codes_parameters,
  payment_methods,

  handleIssuerBusiness,
  handleThirdParty,
  handleMovementCode,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
