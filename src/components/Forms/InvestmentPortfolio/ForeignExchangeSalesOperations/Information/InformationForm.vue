<template>
  <div>
    <q-form ref="foreignExchangeForm" class="q-pa-lg">
      <!-- ====== Datos básicos ====== -->
      <section>
        <div class="q-mb-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Datos básicos
          </p>
        </div>

        <!-- Modo crear/editar -->
        <div
          v-if="!isView"
          class="row q-col-gutter-x-lg q-col-gutter-y-sm"
          :class="{ 'items-start': !isView }"
        >
          <!-- Fecha de operación -->
          <div class="col-12 col-md-3">
            <GenericDateInput
              label="Fecha de operación "
              mask="YYYY-MM-DD"
              placeholder="AAAA-MM-DD"
              required
              disabled
              :default_value="defaultOperationDate"
              :rules="[
                (v) =>
                  useRules().is_required(
                    v,
                    'La fecha de operación es requerida'
                  ),
                (v) => useRules().date_before_or_equal_to_the_current_date(v),
              ]"
              @update:modelValue="form.operation_date = $event"
            />
          </div>

          <!-- Código de portafolio -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Código de portafolio "
              :manual_option="investment_portfolio"
              map_options
              auto_complete
              clearable
              required
              :disabled="isView"
              :default_value="form.investment_portfolio_id ?? ''"
              :rules="[
                (v) =>
                  useRules().is_required(
                    v,
                    'El código de portafolio es requerido'
                  ),
              ]"
              @update:modelValue="form.investment_portfolio_id = $event"
            />
          </div>

          <!-- Descripción portafolio -->
          <div class="col-12 col-md-3">
            <GenericInput
              label="Descripción portafolio"
              :default_value="form.investment_description"
              disabled
              placeholder="-"
              :disable="true"
            />
          </div>

          <!-- Tipo de operación -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Tipo de operación "
              :manual_option="operation_type"
              map_options
              auto_complete
              clearable
              required
              :disabled="isView"
              :default_value="form.operation_type_id ?? ''"
              :rules="[
                (v) =>
                  useRules().is_required(
                    v,
                    'El tipo de operación es requerido'
                  ),
              ]"
              @update:modelValue="form.operation_type_id = $event"
            />
          </div>

          <!-- Descripción operación -->
          <div class="col-12 col-md-3">
            <GenericInput
              label="Descripción operación"
              placeholder="-"
              :default_value="form.operation_type_description"
              disabled
              :rules="[(v) => useRules().max_length(v, 180)]"
              @update:modelValue="form.description = $event"
            />
          </div>

          <!-- Papel -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Papel "
              :manual_option="paper_types_form_parameters"
              map_options
              auto_complete
              clearable
              required
              :disabled="isView"
              :default_value="form.paper_type_id ?? ''"
              :rules="[
                (v) => useRules().is_required(v, 'El papel es requerido'),
              ]"
              @update:modelValue="form.paper_type_id = $event"
            />
          </div>
        </div>

        <!-- Modo ver -->
        <div v-else class="q-pa-sm">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">Fecha de operación</p>
              <p class="no-margin">{{ form.operation_date }}</p>
            </div>

            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">Código de portafolio</p>
              <p class="no-margin">
                {{
                  (form.investment_portfolio_code || investment_portfolio,
                  form.investment_portfolio_id)
                }}
              </p>
            </div>

            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">Descripción portafolio</p>
              <p class="no-margin">{{ form.investment_description || '-' }}</p>
            </div>

            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">Tipo de operación</p>
              <p class="no-margin">
                {{
                  (form.operation_type_description || operation_type,
                  form.operation_type_id)
                }}
              </p>
            </div>

            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">Descripción operación</p>
              <p class="no-margin">{{ form.description || '-' }}</p>
            </div>

            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">Papel</p>
              <p class="no-margin">
                {{ (paper_types_form_parameters, form.paper_type_id) }}
              </p>
            </div>

            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">Estado</p>
              <p class="no-margin">{{ form.status }}</p>
            </div>

            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">Número de operación</p>
              <p class="no-margin">{{ form.operation_number || '-' }}</p>
            </div>
          </div>
        </div>
      </section>

      <q-separator class="q-my-md" />

      <!-- ====== Detalle operación ====== -->
      <section>
        <div class="q-mb-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Detalle operación
          </p>
        </div>

        <!-- Modo crear/editar -->
        <div v-if="!isView" class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <!-- Moneda origen -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Moneda origen "
              :manual_option="coins"
              map_options
              auto_complete
              clearable
              required
              :disabled="isView"
              :default_value="form.origin_currency_id ?? ''"
              :rules="[
                (v) =>
                  useRules().is_required(v, 'La moneda origen es requerida'),
              ]"
              @update:modelValue="form.origin_currency_id = $event"
            />
          </div>

          <!-- Monto origen -->
          <div class="col-12 col-md-3">
            <CurrencyInput
              :model-value="form.origin_amount"
              label="Monto origen"
              placeholder="-"
              disabled
              required
              :hideIcon="true"
            />
          </div>

          <!-- Tasa oficial -->
          <div class="col-12 col-md-3">
            <GenericInput
              label="Tasa oficial "
              type="number"
              placeholder="#"
              required
              :disable="isView"
              :default_value="form.official_rate ?? ''"
              :rules="[
                (v) =>
                  useRules().is_required(v, 'La tasa oficial es requerida'),
                (v) => useRules().only_number_greater_than_zero(v),
              ]"
              @update:modelValue="form.official_rate = Number($event)"
            />
          </div>

          <!-- Tasa negociada -->
          <div class="col-12 col-md-3">
            <GenericInput
              label="Tasa negociada"
              type="number"
              placeholder="#"
              :disable="isView"
              :default_value="form.negotiated_rate ?? ''"
              :rules="[]"
              @update:modelValue="form.negotiated_rate = Number($event)"
            />
          </div>

          <!-- Banco origen -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Código banco origen "
              :manual_option="investment_portfolio_banks"
              map_options
              auto_complete
              clearable
              required
              :disabled="isView"
              :default_value="form.origin_bank_id ?? ''"
              :rules="[
                (v) =>
                  useRules().is_required(v, 'El banco origen es requerido'),
              ]"
              @update:modelValue="form.origin_bank_id = $event"
            />
          </div>

          <!-- Cuenta bancaria origen -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Cuenta bancaria origen "
              :manual_option="bank_account"
              map_options
              auto_complete
              clearable
              required
              :default_value="form.origin_bank_account_id ?? ''"
              :rules="[
                (v) =>
                  useRules().is_required(v, 'La cuenta origen es requerida'),
              ]"
              @update:modelValue="form.origin_bank_account_id = $event"
            />
          </div>

          <!-- Banco destino -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Código banco destino "
              :manual_option="investment_portfolio_banks"
              map_options
              auto_complete
              clearable
              required
              :disabled="isView"
              :default_value="form.destination_bank_id ?? ''"
              :rules="[
                (v) =>
                  useRules().is_required(v, 'El banco destino es requerido'),
              ]"
              @update:modelValue="form.destination_bank_id = $event"
            />
          </div>

          <!-- Cuenta bancaria destino -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Cuenta bancaria destino "
              :manual_option="bank_account"
              map_options
              auto_complete
              clearable
              required
              :default_value="form.destination_bank_account_id ?? ''"
              :rules="[
                (v) =>
                  useRules().is_required(v, 'La cuenta destino es requerida'),
              ]"
              @update:modelValue="form.destination_bank_account_id = $event"
            />
          </div>

          <!-- ID contraparte -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="ID contraparte "
              :manual_option="issuer_counterparty_all"
              map_options
              auto_complete
              clearable
              required
              :disabled="isView"
              :default_value="form.issuer_counterparty_id ?? ''"
              :rules="[
                (v) => useRules().is_required(v, 'La contraparte es requerida'),
              ]"
              @update:modelValue="form.issuer_counterparty_id = $event"
            />
          </div>

          <!-- Descripción contraparte -->
          <div class="col-12 col-md-3">
            <GenericInput
              label="Descripción contraparte"
              :default_value="form.issuer_counterparty_description"
              placeholder="-"
              disabled
            />
          </div>

          <!-- Moneda destino -->
          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              label="Moneda destino "
              :manual_option="coins"
              map_options
              auto_complete
              clearable
              required
              :disabled="isView"
              :default_value="form.destination_currency_id ?? ''"
              :rules="[
                (v) =>
                  useRules().is_required(v, 'La moneda destino es requerida'),
              ]"
              @update:modelValue="form.destination_currency_id = $event"
            />
          </div>

          <!-- BUY: Monto destino -->
          <div class="col-12 col-md-3" v-if="isBuy">
            <CurrencyInput
              :model-value="destinationAmountDisplay"
              label="Monto destino"
              placeholder="-"
              disabled
              required
              :hideIcon="true"
            />
          </div>

          <!-- SELL: Utilidad / Pérdida -->
          <div class="col-12 col-md-3" v-else>
            <GenericInput
              label="Utilidad / Pérdida en venta"
              :default_value="form.profit_loss_sale"
              disabled
              required
            />
          </div>
        </div>

        <!-- Modo ver -->
        <div v-else class="row q-col-gutter-lg">
          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Moneda origen</p>
            <p class="no-margin">
              {{
                (form.origin_currency_code || coins, form.origin_currency_id)
              }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Monto origen</p>
            <p class="no-margin">{{ form.origin_amount }}</p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Tasa oficial</p>
            <p class="no-margin">{{ form.official_rate }}</p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Tasa negociada</p>
            <p class="no-margin">{{ form.negotiated_rate }}</p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Código banco origen</p>
            <p class="no-margin">
              {{
                (form.origin_bank_name || investment_portfolio_banks,
                form.origin_bank_id)
              }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Cuenta bancaria origen</p>
            <p class="no-margin">
              {{
                (form.origin_bank_account_name || bank_account,
                form.origin_bank_account_id)
              }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Código banco destino</p>
            <p class="no-margin">
              {{
                (form.destination_bank_name || investment_portfolio_banks,
                form.destination_bank_id)
              }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Cuenta bancaria destino</p>
            <p class="no-margin">
              {{
                (form.destination_bank_account_name || bank_account,
                form.destination_bank_account_id)
              }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">ID contraparte</p>
            <p class="no-margin">
              {{ (issuer_counterparty_all, form.issuer_counterparty_id) }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Descripción contraparte</p>
            <p class="no-margin">
              {{
                form.issuer_counterparty_description ||
                form.issuer_counterparty_name ||
                '-'
              }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Moneda destino</p>
            <p class="no-margin">
              {{ form.destination_currency_code }}
            </p>
          </div>

          <div class="col-12 col-md-3" v-if="isBuy">
            <p class="text-weight-bold no-margin">Monto destino</p>
            <p class="no-margin">{{ destinationAmountDisplay }}</p>
          </div>

          <div class="col-12 col-md-3" v-else>
            <p class="text-weight-bold no-margin">Utilidad / Pérdida venta</p>
            <p class="no-margin">
              {{ form.profit_loss_sale ?? form.profit_loss }}
            </p>
          </div>
        </div>
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import useForeignExchangeForm from './InformationForm'
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: number
    hasLoadedData?: boolean
    opType?: 'BUY' | 'SELL'
  }>(),
  { hasLoadedData: false }
)

const {
  // state
  form,
  isView,
  defaultOperationDate,

  // catálogos/selectores
  investment_portfolio,
  operation_type,
  paper_types_form_parameters,
  coins,
  investment_portfolio_banks,

  issuer_counterparty_all,
  bank_account,

  // actions
  foreignExchangeForm,

  isBuy,
  destinationAmountDisplay,
} = useForeignExchangeForm(props)

defineExpose({
  validateForm: () => foreignExchangeForm.value?.validate?.(),
  getFormData: () => form.value,
})
</script>
