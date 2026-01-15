<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div
            v-show="['edit', 'view'].includes(action)"
            class="col-xs-12 col-sm-12 col-md-6"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código
            </p>
            <GenericInput
              v-if="['edit'].includes(action)"
              :default_value="models.code ?? ''"
              disabled
              @update:model-value="models.code = $event"
            />

            <p v-else class="text-grey-6 mb-0">
              {{ models.code ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Descripción{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              required
              :default_value="models.description"
              :rules="[
                (v: string) => !!v || 'La descripción es requerida',
                (v: string) =>
                  v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) =>
                  v.length <= 60 || 'Debe contener como máximo 60 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
                (v: string) =>
                  /^[ A-Za-zÀ-ÖØ-öø-ÿ0-9]*$/.test(v) ||
                  'Debe de tener solo letras y numeros',
              ]"
              @update:model-value="models.description = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Tipo de formas de pago{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="type_means_of_payments"
              :map_options="true"
              :required="true"
              :default_value="models.type_mean_of_payments"
              :auto_complete="true"
              @update:modelValue="models.type_mean_of_payments = $event"
              :rules="[
                (val: string) =>
                  !!val || 'El tipo de formas de pago es requerido',
              ]"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.type_mean_of_payments ?? 'No registrado' }}
            </p>
          </div>

          <div
            :class="
              ['create'].includes(action)
                ? 'col-xs-12 col-sm-12 col-md-12'
                : 'col-xs-12 col-sm-12 col-md-6'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Tipo de dispersión{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="dispersion_types"
              :map_options="true"
              :required="true"
              :default_value="models.dispersion_type"
              :auto_complete="true"
              @update:modelValue="models.dispersion_type = $event"
              :rules="[
                (val: string) => !!val || 'El tipo de dispersión es requerido',
              ]"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.dispersion_type ?? 'No registrado' }}
            </p>
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
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Tipo de transacción{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="transaction_types"
              :map_options="true"
              :required="true"
              :default_value="models.transaction_type"
              :auto_complete="true"
              @update:modelValue="models.transaction_type = $event"
              :rules="[
                (val: string) => !!val || 'El tipo de transacción es requerido',
              ]"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.transaction_type ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Tipo de traslado de fondos{{
                ['create', 'edit'].includes(action) &&
                !isTypeFundsTransfersDisabled
                  ? '*'
                  : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :disabled="isTypeFundsTransfersDisabled"
              :manual_option="type_funds_transfers"
              :map_options="true"
              :required="true"
              :default_value="models.type_funds_transfer"
              :auto_complete="true"
              @update:modelValue="models.type_funds_transfer = $event"
              :rules="[
                (val: string) => !!val || 'El tipo de traslado es requerido',
              ]"
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                models.type_funds_transfer
                  ? models.type_funds_transfer
                  : 'No registrado'
              }}
            </p>
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
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Tipo de inscripciones{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="type_registrations"
              :map_options="true"
              :required="true"
              :default_value="models.type_registrations"
              :auto_complete="true"
              @update:modelValue="models.type_registrations = $event"
              :rules="
                models.request_registration_beneficiary
                  ? [
                      (val: string) =>
                        !!val || 'El tipo de inscripción es requerido',
                    ]
                  : []
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.type_registrations ?? 'No registrado' }}
            </p>
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

          <div
            class="col-xs-12 col-sm-12 col-md-12"
            v-show="models.type_mean_of_payments == 'Cheque de oficina'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Mensaje de cheque{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              required
              :default_value="models.message_check"
              :rules="
                models.crossed_check
                  ? [
                      (v: string) => !!v || 'La descripción es requerida',
                      (v: string) =>
                        v.length >= 2 || 'Debe contener al menos 2 caracteres',
                      (v: string) =>
                        v.length <= 80 ||
                        'Debe contener como máximo 80 caracteres',
                      (v: string) =>
                        !/\s{2,}/.test(v) ||
                        'No debe contener espacios consecutivos',
                    ]
                  : []
              "
              @update:model-value="models.message_check = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.message_check ?? 'No registrado' }}
            </p>
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
              :rules="[
                (val: string) =>
                  val !== null || 'El tipo de formas de pago es requerido',
              ]"
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
    action: 'create' | 'edit' | 'view'
    data?: IPaymentMethod | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import useInformationForm from './InformationForm'
import { IPaymentMethod } from '@/interfaces/customs'

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
