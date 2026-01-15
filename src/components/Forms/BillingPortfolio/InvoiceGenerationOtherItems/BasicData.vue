<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <p class="text-black-10 text-weight-bold text-h6">Emisor</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Nombre del emisor"
            :default_value="models.issuer_business_id_snapshot"
            :manual_option="business_trusts"
            map_options
            auto_complete
            required
            return_object
            :rules="[
              (val: string) =>
                is_required(val, 'El nombre del emisor es requerido'),
            ]"
            @update:modelValue="handleIssuerBusiness"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Nombre del emisor</p>
            <p class="text-weight-medium no-margin">
              {{
                models.issuer_business_code_snapshot
                  ? models.issuer_business_code_snapshot +
                    ' - ' +
                    models.issuer_business_name_snapshot
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Tipo de identificación"
            :default_value="models.business_document_type_snapshot"
            disabled
            :rules="[]"
            @update:model-value="
              models.business_document_type_snapshot = $event
            "
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Tipo de identificación</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_document_type_snapshot ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Número de documento"
            :default_value="models.business_document_snapshot"
            :rules="[]"
            disabled
            @update:model-value="models.business_document_snapshot = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Número de documento</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_document_snapshot ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-mt-md">
      <p class="text-black-10 text-weight-bold text-h6">
        Datos básicos de factura
      </p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Nombre del negocio"
            :default_value="models.business_id_snapshot"
            :manual_option="
              business_trusts.filter((item) => item.business_subtype_id !== 20)
            "
            map_options
            return_object
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El nombre del negocio es requerido'),
            ]"
            @update:model-value="(val) => handleBusinessTrust(val)"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{
                models.business_code_snapshot
                  ? models.business_code_snapshot +
                    ' - ' +
                    models.business_name_snapshot
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Nombre del cliente"
            :default_value="models.third_party_billing_id"
            :manual_option="third_party_billings"
            map_options
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El nombre del cliente es requerido'),
            ]"
            @update:modelValue="handleThirdParty"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Nombre del cliente</p>
            <p class="text-weight-medium no-margin">
              {{
                models.third_party_billing_name_snapshot
                  ? (models.third_party_billing_document_type_snapshot ?? '') +
                    ' - ' +
                    (models.third_party_billing_document_snapshot ?? '') +
                    ' - ' +
                    (models.third_party_billing_name_snapshot ?? '')
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create'].includes(action)"
            label="Fecha de emisión"
            clearable
            :placeholder="'Seleccione'"
            required
            disabled
            :default_value="models.snapshotted_at"
            :rules="[
              (val: string) =>
                is_required(val, 'La fecha de emisión es requerida'),
            ]"
            @update:modelValue="models.snapshotted_at = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Fecha de emisión</p>
            <p class="text-weight-medium no-margin">
              {{
                utils.formatDate(models.snapshotted_at ?? '', 'YYYY-MM-DD') ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3" v-if="['view'].includes(action)">
          <div class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Número de factura</p>
            <p class="text-weight-medium no-margin">
              {{ models.number_invoice ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            v-if="['create'].includes(action)"
            type="textarea"
            label="Concepto factura"
            :default_value="models.invoice_description"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El concepto de la factura es requerido'),
              (val: string) => max_length(val, 400),
            ]"
            @update:model-value="models.invoice_description = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Concepto factura</p>
            <p class="text-weight-medium no-margin">
              {{ models.invoice_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Código movimiento"
            :default_value="models.movement_code_id_snapshot"
            :manual_option="movement_codes_parameters"
            map_options
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El código movimiento es requerido'),
            ]"
            @update:modelValue="handleMovementCode"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Código movimiento</p>
            <p class="text-weight-medium no-margin">
              {{
                models.movement_code_code_snapshot
                  ? models.movement_code_code_snapshot +
                    ' - ' +
                    models.movement_code_descriptions_snapshot
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="¿Genera IVA?"
            :default_value="models.movement_code_has_iva_snapshot"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            required
            disabled
            :rules="[]"
            @update:modelValue="models.movement_code_has_iva_snapshot = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">¿Genera IVA?</p>
            <p class="text-weight-medium no-margin">
              {{ models.movement_code_has_iva_snapshot ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="IVA (%)"
            :default_value="models.movement_code_percentage_iva_snapshot"
            disabled
            :rules="[]"
            @update:model-value="
              models.movement_code_percentage_iva_snapshot = $event
            "
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">IVA (%)</p>
            <p class="text-weight-medium no-margin">
              {{
                models.movement_code_percentage_iva_snapshot ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="¿Genera rete fuente?"
            :default_value="models.is_source_network"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            required
            disabled
            :rules="[]"
            @update:modelValue="models.is_source_network = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">¿Genera rete fuente?</p>
            <p class="text-weight-medium no-margin">
              {{ models.is_source_network ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Rete fuente (%)"
            :default_value="models.source_network_percentage"
            disabled
            :rules="[]"
            @update:model-value="models.source_network_percentage = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete fuente (%)</p>
            <p class="text-weight-medium no-margin">
              {{ models.source_network_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="¿Genera rete ICA?"
            :default_value="models.is_ica"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            required
            disabled
            :rules="[]"
            @update:modelValue="models.is_ica = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">¿Genera rete ICA?</p>
            <p class="text-weight-medium no-margin">
              {{ models.is_ica ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Rete ICA (%)"
            :default_value="models.ica_percentage"
            disabled
            :rules="[]"
            @update:model-value="models.ica_percentage = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete ICA (%)</p>
            <p class="text-weight-medium no-margin">
              {{ models.ica_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="¿Genera rete IVA?"
            :default_value="models.is_source_iva"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            required
            disabled
            :rules="[]"
            @update:modelValue="models.is_source_iva = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">¿Genera rete IVA?</p>
            <p class="text-weight-medium no-margin">
              {{ models.is_source_iva ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Rete IVA (%)"
            :default_value="models.source_iva_percentage"
            disabled
            :rules="[]"
            @update:model-value="models.source_iva_percentage = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete IVA (%)</p>
            <p class="text-weight-medium no-margin">
              {{ models.source_iva_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create'].includes(action)"
            currencyLabel="Valor base"
            :currency="'COP'"
            v-model="models.base_amount"
            required
            :rules="[
              (val: string) => is_required(val, 'El valor base es requerido'),
              (val: string) => max_length(val, 30),
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
            currencyLabel="IVA"
            :currency="'COP'"
            v-model="models.iva_amount"
            disabled
            :rules="[(val: string) => max_length(val, 30)]"
            @update:model-value="models.iva_amount = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">IVA</p>
            <p class="text-weight-medium no-margin">
              {{
                utils.formatCurrencyString(models.iva_amount) ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create'].includes(action)"
            currencyLabel="Rete fuente"
            :currency="'COP'"
            v-model="models.source_network_amount"
            disabled
            :rules="[]"
            @update:model-value="models.source_network_amount = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete fuente</p>
            <p class="text-weight-medium no-margin">
              {{
                utils.formatCurrencyString(models.source_network_amount) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create'].includes(action)"
            currencyLabel="Rete ICA"
            :currency="'COP'"
            v-model="models.source_ica_amount"
            disabled
            :rules="[]"
            @update:model-value="models.source_ica_amount = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete ICA</p>
            <p class="text-weight-medium no-margin">
              {{
                utils.formatCurrencyString(models.source_ica_amount) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create'].includes(action)"
            currencyLabel="Rete IVA"
            :currency="'COP'"
            v-model="models.source_iva_amount"
            disabled
            :rules="[]"
            @update:model-value="models.source_iva_amount = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete IVA</p>
            <p class="text-weight-medium no-margin">
              {{
                utils.formatCurrencyString(models.source_iva_amount) ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="['create'].includes(action)"
            currencyLabel="Valor total"
            :currency="'COP'"
            v-model="models.total_amount"
            disabled
            :rules="[]"
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
            label="Forma de pago"
            :default_value="models.method_payment"
            :manual_option="pay_methods"
            map_options
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'La forma de pago es requerida'),
            ]"
            @update:modelValue="models.method_payment = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Forma de pago</p>
            <p class="text-weight-medium no-margin">
              {{ models.method_payment ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Días de pago"
            :default_value="models.payday"
            :manual_option="[]"
            map_options
            auto_complete
            required
            disabled
            :rules="[]"
            @update:modelValue="models.payday = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Días de pago</p>
            <p class="text-weight-medium no-margin">
              {{ models.payday ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            type="textarea"
            label="Observaciones"
            :default_value="models.observations"
            :rules="[(val: string) => max_length(val, 400)]"
            @update:model-value="models.observations = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Observaciones</p>
            <p class="text-weight-medium no-margin">
              {{ models.observations ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3" v-if="['view'].includes(action)">
          <div class="text-black-90 q-my-md">
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
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

import { business_trust_yes_no, pay_methods } from '@/constants'

import { IInvoiceGenerationOtherItemsForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import useBasicDataForm from '@/components/Forms/BillingPortfolio/InvoiceGenerationOtherItems/BasicData'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IInvoiceGenerationOtherItemsForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IInvoiceGenerationOtherItemsForm | null): void
}>()

const {
  formElementRef,
  models,
  is_required,
  max_length,
  business_trusts,
  third_party_billings,
  movement_codes_parameters,
  utils,

  handleIssuerBusiness,
  handleBusinessTrust,
  handleThirdParty,
  handleMovementCode,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
