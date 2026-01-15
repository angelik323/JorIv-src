<template>
  <div>
    <q-form ref="informationForm" class="q-pa-lg">
      <section>
        <div class="q-mb-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Datos generales
          </p>
        </div>
        <div
          class="row q-col-gutter-x-lg q-col-gutter-y-sm"
          :class="{ 'items-end': !isView }"
        >
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Descripción portafolio
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  investment_portfolio?.name ||
                  investment_portfolio?.description
                }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Descripción portafolio"
                ref="descriptionRef"
                placeholder="Inserte"
                required
                :default_value="investment_portfolio?.name ?? ''"
                :rules="[
                  (val: string) => useRules().is_required(val,'La descripción del portafolio es requerida'),
                  (val: string) => useRules().max_length(val, 80),
                ]"
                @update:modelValue="investment_portfolio.name = $event"
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Código portafolio
              </p>
              <p class="text-weight-medium no-margin">
                {{ investment_portfolio?.code }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Código portafolio"
                ref="portfolioCodeRef"
                placeholder="Inserte"
                required
                :default_value="investment_portfolio?.code ?? ''"
                :rules="[
                  (val: string) => useRules().is_required(val,'El código portafolio es requerido'),
                  (val: string) => useRules().max_length(val, 10),
                  (val: string) => useRules().only_alphanumeric(val),
                ]"
                @update:modelValue="investment_portfolio.code = $event"
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Código negocio
              </p>
              <p class="text-weight-medium no-margin">
                {{ investment_portfolio?.business_code }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Código negocio"
                ref="businessCodeRef"
                placeholder="Inserte"
                type="number"
                required
                :default_value="investment_portfolio?.business_code ?? ''"
                :rules="[
                  (val: string) => useRules().is_required(val,'El código negocio es requerido'),
                  (val: string) => useRules().max_length(val, 15),
                  (val: string) => useRules().only_number_greater_than_zero(val),
                  () => isValidBusiness || 'El código negocio no es válido',
                ]"
                @update:modelValue="handleBusinessCode($event)"
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">Código FIC</p>
              <p class="text-weight-medium no-margin">
                {{ investment_portfolio?.fic_code || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="Código FIC"
                :manual_option="funds"
                map_options
                required
                :disabled="!funds.length"
                :default_value="investment_portfolio?.fic_code ?? ''"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[(val: string) => useRules().is_required(val, 'El código FIC es requerido')]"
                @update:modelValue="investment_portfolio.fic_code = $event"
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">Moneda</p>
              <p class="text-weight-medium no-margin">
                {{ investment_portfolio?.currency }}
              </p>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="Moneda"
                :manual_option="coins"
                map_options
                required
                :default_value="investment_portfolio?.currency ?? ''"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[(val: string) => useRules().is_required(val, 'La moneda es requerida')]"
                @update:modelValue="investment_portfolio.currency = $event"
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Centro de costo
              </p>
              <p class="text-weight-medium no-margin">
                {{ investment_portfolio?.cost_center || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="Centro de costo"
                :manual_option="cost_center"
                map_options
                :required="false"
                :default_value="investment_portfolio?.cost_center_id ?? ''"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[() => true]"
                @update:modelValue="
                  investment_portfolio.cost_center_id = $event
                "
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Fecha última valoración
              </p>
              <p class="text-weight-medium no-margin">
                {{ investment_portfolio?.last_valuation_date }}
              </p>
            </template>
            <template v-else>
              <GenericDateInput
                label="Fecha de última valoración"
                ref="lastAssessmentRef"
                placeholder="AAAA-MM-DD"
                mask="YYYY-MM-DD"
                required
                :default_value="investment_portfolio.last_valuation_date"
                :disabled="isEdit"
                :rules="[
                  (val: string) => useRules().is_required(val,'La fecha de última valoración es requerida'),
                  (val: string) => useRules().date_before_or_equal_to_the_current_date(val),
                ]"
                @update:modelValue="
                  investment_portfolio.last_valuation_date = $event
                "
              />
            </template>
          </div>
        </div>
      </section>

      <q-separator class="q-my-md" />

      <section>
        <div class="q-mb-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Cuentas bancarias del portafolio
          </p>
        </div>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Código de banco
              </p>
              <div
                v-if="investment_portfolio.bank_accounts"
                v-for="bank in investment_portfolio.bank_accounts"
              >
                {{ bank.bank_code }}
              </div>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="Código de banco"
                :manual_option="banks"
                map_options
                multiple
                show_as_checkbox
                required
                :default_value="defaultBankIds"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[(val: number[]) => useRules().is_required_array(val,'Los bancos son requeridos')]"
                @update:modelValue="selectBanks($event)"
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Cuenta bancaria
              </p>
              <div
                v-if="investment_portfolio.bank_accounts"
                v-for="bank in investment_portfolio.bank_accounts"
              >
                <div
                  v-if="bank.bank_accounts"
                  v-for="bankAccount in bank.bank_accounts"
                >
                  {{ bankAccount.account_number }}
                </div>
              </div>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="Cuenta bancaria"
                :manual_option="bankAccounts"
                map_options
                multiple
                show_as_checkbox
                required
                :default_value="defaultBankAccountIds"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[(val: number[]) => useRules().is_required_array(val,'Las cuentas bancarias son requeridas')]"
                @update:modelValue="investment_portfolio.bank_account = $event"
              />
            </template>
          </div>
        </div>
      </section>

      <q-separator class="q-my-md" />

      <section>
        <div class="q-mb-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Forma de cumplimiento
          </p>
        </div>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Formas de recaudo
              </p>
              <div
                v-if="investment_portfolio.forms_compliance"
                v-for="receive_method in investment_portfolio.forms_compliance
                  .method_receives"
              >
                {{ receive_method.value }}
              </div>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="Formas de recaudo"
                :manual_option="type_receive"
                map_options
                multiple
                show_as_checkbox
                required
                :default_value="defaultCollectionMethods"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[(val: number[]) => useRules().is_required_array(val,'Las formas de recaudo son requeridas')]"
                @update:modelValue="
                  investment_portfolio.collection_method = $event
                "
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Formas de pago
              </p>
              <div
                v-if="investment_portfolio.forms_compliance"
                v-for="payment_method in investment_portfolio.forms_compliance
                  .method_payment"
              >
                {{ payment_method.value }}
              </div>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="Formas de pago"
                :manual_option="means_of_payments"
                map_options
                multiple
                show_as_checkbox
                required
                :default_value="defaultPaymentMethods"
                auto_complete
                clearable
                :placeholder="'Seleccione'"
                :rules="[(val: number[]) => useRules().is_required_array(val,'Las formas de pago son requeridas')]"
                @update:modelValue="
                  investment_portfolio.method_payment = $event
                "
              />
            </template>
          </div>
        </div>
      </section>

      <template v-if="isView && investment_portfolio.history">
        <q-separator class="q-my-md" />
        <section>
          <div class="q-mb-lg">
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              Historial del portafolio
            </p>
          </div>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">Fecha de creación</p>
              <div>{{ investment_portfolio.history.created_at }}</div>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">Creado por</p>
              <div>{{ investment_portfolio.history.creator_data }}</div>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">Modificación</p>
              <div>{{ investment_portfolio.history.updated_at }}</div>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-bold mb-0 text-black-10">Modificado por</p>
              <div>{{ investment_portfolio.history.updated_data }}</div>
            </div>
          </div>
        </section>
      </template>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import useInformationForm from './InformationForm'
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: number
    hasLoadedData?: boolean
  }>(),
  { hasLoadedData: false }
)

defineExpose({
  validateForm: () => validateInvestmentPortfolio(),
  getFormData: () => getPayloadData(),
})

const {
  investment_portfolio,
  informationForm,
  isView,
  isEdit,
  handleBusinessCode,
  coins,
  cost_center,
  banks,
  bankAccounts,
  type_receive,
  means_of_payments,
  isValidBusiness,
  funds,
  selectBanks,
  getPayloadData,
  validateInvestmentPortfolio,
  defaultBankIds,
  defaultBankAccountIds,
  defaultCollectionMethods,
  defaultPaymentMethods,
} = useInformationForm(props)
</script>
