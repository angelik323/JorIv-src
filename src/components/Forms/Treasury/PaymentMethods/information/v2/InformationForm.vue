<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div
            v-show="['edit', 'view'].includes(action)"
            class="col-xs-12 col-sm-12 col-md-6"
          >
            <GenericInput
              v-if="['edit'].includes(action)"
              :default_value="models.code ?? ''"
              disabled
              label="Código"
              @update:model-value="models.code = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Código</p>
              <p class="text-weight-medium no-margin">
                {{ models.code || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="['create', 'edit'].includes(action)"
              label="Descripción"
              :default_value="models.description"
              :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().min_length(val, 2),
                (val: string) => useRules().max_length(val, 60),
                (val: string) => useRules().no_consecutive_spaces(val),
                (val: string) => useRules().only_alphanumeric(val),
              ]"
              @update:model-value="models.description = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Descripción</p>
              <p class="text-weight-medium no-margin">
                {{ models.description || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Tipo de formas de pago"
              :manual_option="type_means_of_payments"
              :map_options="true"
              :required="['create', 'edit'].includes(action)"
              :default_value="models.type_mean_of_payments"
              :auto_complete="true"
              @update:modelValue="models.type_mean_of_payments = $event"
              :rules="[(val: string) => useRules().is_required(val)]"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Tipo de formas de pago</p>
              <p class="text-weight-medium no-margin">
                {{ models.type_mean_of_payments || 'No registrado' }}
              </p>
            </div>
          </div>

          <div
            :class="
              ['create'].includes(action)
                ? 'col-xs-12 col-sm-12 col-md-12'
                : 'col-xs-12 col-sm-12 col-md-6'
            "
          >
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Tipo de dispersión"
              :manual_option="dispersion_types"
              :map_options="true"
              :required="true"
              :default_value="models.dispersion_type"
              :auto_complete="true"
              @update:modelValue="models.dispersion_type = $event"
              :rules="[(val: string) => useRules().is_required(val)]"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Tipo de dispersión</p>
              <p class="text-weight-medium no-margin">
                {{ models.dispersion_type || 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mt-1" />

    <section>
      <div class="q-px-lg q-mt-lg q-pb-lg q-mb-sm">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Transacciones de fondos
        </p>
      </div>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Tipo de transacción"
              :manual_option="transaction_types"
              :map_options="true"
              :required="['create', 'edit'].includes(action)"
              :default_value="models.transaction_type"
              :auto_complete="true"
              @update:modelValue="models.transaction_type = $event"
              :rules="[(val: string) => useRules().is_required(val)]"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Tipo de transacción</p>
              <p class="text-weight-medium no-margin">
                {{ models.transaction_type || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :disabled="isTypeFundsTransfersDisabled"
              :manual_option="type_funds_transfers"
              label="Tipo de traslado de fondos"
              :map_options="true"
              :required="
                ['create', 'edit'].includes(action) &&
                !isTypeFundsTransfersDisabled
              "
              :default_value="models.type_funds_transfer"
              :auto_complete="true"
              @update:modelValue="models.type_funds_transfer = $event"
              :rules="[(val: string) => useRules().is_required(val)]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Tipo de traslado de fondos
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  models.type_funds_transfer
                    ? models.type_funds_transfer
                    : 'No registrado'
                }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-12">
            <RadioYesNo
              v-model="models.request_registration_beneficiary"
              :isRadioButton="true"
              :hasTitle="true"
              :title="'¿Pide inscripción del beneficiario?'"
              :hasSubtitle="false"
              :isDisabled="
                ['view'].includes(action) || isTypeFundsTransfersDisabled
              "
            />
          </div>

          <div
            class="col-xs-12 col-sm-12 col-md-6"
            v-show="
              models.request_registration_beneficiary &&
              !isTypeFundsTransfersDisabled
            "
          >
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="type_registrations"
              :map_options="true"
              :required="['create', 'edit'].includes(action)"
              label="Tipo de inscripciones"
              :default_value="models.type_registrations"
              :auto_complete="true"
              @update:modelValue="models.type_registrations = $event"
              :rules="
                models.request_registration_beneficiary
                  ? [(val: string) => useRules().is_required(val)]
                  : []
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Tipo de inscripción</p>
              <p class="text-weight-medium no-margin">
                {{ models.type_registrations ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mt-1" />

    <section>
      <div class="q-px-lg q-mt-lg q-pb-lg q-mb-sm">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Transacciones de tesorería
        </p>
      </div>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <RadioYesNo
              v-model="models.payment_instructions"
              :isRadioButton="false"
              :hasTitle="true"
              :title="'Instrucciones de pago'"
              :hasSubtitle="false"
              :isDisabled="['view'].includes(action)"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-12">
            <RadioYesNo
              v-model="models.authorized_payment"
              :isRadioButton="false"
              :hasTitle="true"
              :title="'Autorizado de pago'"
              :hasSubtitle="false"
              :isDisabled="['view'].includes(action)"
            />
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mt-1" />

    <section>
      <div class="q-px-lg q-mt-lg q-pb-lg q-mb-sm">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Detalle cheques
        </p>
      </div>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <RadioYesNo
              v-model="models.crossed_check"
              :isRadioButton="false"
              :hasTitle="true"
              :title="'Cheque cruzado'"
              :hasSubtitle="false"
              :isDisabled="['view'].includes(action) || isDisabledCrossedCheck"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.message_check"
              :disabled="models.type_mean_of_payments !== 'Cheque de oficina'"
              label="Mensaje de cheque"
              :rules="
                models.crossed_check
                  ? [
                      (val: string) => useRules().is_required(val),
                      (val: string) => useRules().min_length(val, 2),
                      (val: string) => useRules().max_length(val, 80),
                      (val: string) => useRules().no_consecutive_spaces(val),
                    ]
                  : []
              "
              @update:model-value="models.message_check = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Mensaje de cheque</p>
              <p class="text-weight-medium no-margin">
                {{ models.message_check ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.exchange_days"
              label="Días de canje"
              :disabled="models.type_mean_of_payments !== 'Cheque de oficina'"
              :rules="
                models.exchange_days
                  ? [
                      (val: string) => useRules().no_consecutive_spaces(val),
                      (val: string) => useRules().max_length(val, 3),
                      (val: string) => useRules().min_length(val, 1),
                      (val: string) => useRules().only_number(val),
                    ]
                  : []
              "
              @update:model-value="models.exchange_days = $event"
            />

            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Días de canje</p>
              <p class="text-weight-medium no-margin">
                {{ models.exchange_days ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-12">
            <RadioYesNo
              v-model="models.request_bank_withdrawal"
              :isRadioButton="false"
              :hasTitle="true"
              :title="'Solicita banco y sucursal de retiro'"
              :hasSubtitle="false"
              :isDisabled="['view'].includes(action)"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              v-if="['edit'].includes(action)"
              label="Estado"
              :manual_option="reason_return_status"
              :map_options="true"
              :required="true"
              :default_value="models.status_id"
              :auto_complete="true"
              @update:modelValue="models.status_id = $event"
              :rules="[(val: string) => useRules().is_required(val)]"
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentMethodV2 | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Logic view
import useInformationForm from './InformationForm'

// Interfaces
import { IPaymentMethodV2 } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global/Action'

// Composables
import { useRules } from '@/composables'

const {
  models,
  formInformation,
  dispersion_types,
  transaction_types,
  type_funds_transfers,
  type_means_of_payments,
  type_registrations,
  reason_return_status,
  isTypeFundsTransfersDisabled,
  isDisabledCrossedCheck,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
