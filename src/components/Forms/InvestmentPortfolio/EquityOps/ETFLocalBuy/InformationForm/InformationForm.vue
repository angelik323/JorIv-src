<template>
  <q-form ref="informationFormRef" aria-label="Formulario de datos básicos">
    <section aria-label="Sección de formulario de datos básicos">
      <div
        class="row q-col-gutter-x-lg"
        :class="isView ? 'q-col-gutter-y-md' : 'q-col-gutter-y-sm'"
      >
        <div class="col-12 col-md-3 text-black-90" v-if="isView">
          <p class="text-weight-bold no-margin">Número de título</p>
          <p class="text-weight-medium no-margin">
            {{ formData.title_number || '-' }}
          </p>
        </div>

        <div class="col-12 col-md-3 text-black-90" v-if="isView">
          <p class="text-weight-bold no-margin">Número de operación</p>
          <p class="text-weight-medium no-margin">
            {{ formData.operation_number || '-' }}
          </p>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.investment_portfolio_id"
            label="Código portafolio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.investment_portfolio"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de portafolio es requerido'),
            ]"
            @update:model-value="formData.investment_portfolio_id = $event"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Código portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ formData.investment_portfolio_id || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.investment_portfolio_description"
            label="Descripción"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Descripción portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ formData.investment_portfolio_description || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericDateInputComponent
            v-if="!isView"
            :default_value="formData.operation_date"
            label="Fecha operación"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            disabled
            :rules="[]"
            @update:model-value="formData.operation_date = $event"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Fecha operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_date || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.operation_type_id"
            label="Tipo operación"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.operation_type"
            :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de operación es requerido'),
            ]"
            @update:modelValue="formData.operation_type_id = $event"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Tipo de operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_type_id || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.operation_type_description"
            label="Descripción operación"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Descripción operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_type_description || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3 text-black-90" v-if="isView">
          <p class="text-weight-bold no-margin">Estado</p>
          <p class="text-weight-medium no-margin">
            {{ formData.status || '-' }}
          </p>
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>

        <p class="col-12 text-weight-bold text-black-90 text-h6">
          Condiciones de negociación
        </p>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.exchange_traded_fund_id"
            label="Número ETF's"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.etfs"
            :rules="[
              (val: string) => useRules().is_required(val, 'El número de ETFs es requerido'),
            ]"
            @update:modelValue="onSelectETF"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Número ETF's</p>
            <p class="text-weight-medium no-margin">
              {{ formData.exchange_traded_fund_id || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.exchange_traded_fund_description"
            label="Descripción ETF's"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Descripción ETF's</p>
            <p class="text-weight-medium no-margin">
              {{ formData.exchange_traded_fund_description || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.exchange_traded_fund_isin"
            label="Código ISIN"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Código ISIN</p>
            <p class="text-weight-medium no-margin">
              {{ formData.exchange_traded_fund_isin || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.exchange_traded_fund_mnemonic"
            label="Nemotécnico"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Nemotécnico</p>
            <p class="text-weight-medium no-margin">
              {{ formData.exchange_traded_fund_mnemonic || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.exchange_traded_fund_transmitter_nit"
            label="NIT emisor"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">NIT emisor</p>
            <p class="text-weight-medium no-margin">
              {{ formData.exchange_traded_fund_transmitter_nit || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isView"
            :default_value="
              formData.exchange_traded_fund_transmitter_description
            "
            label="Descripción emisor"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Descripción emisor</p>
            <p class="text-weight-medium no-margin">
              {{ formData.exchange_traded_fund_transmitter_description || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.seller_id"
            label="NIT vendedor"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.sellers"
            :rules="[
              (val: string) => useRules().is_required(val, 'El NIT del vendedor es requerido'),
            ]"
            @update:modelValue="formData.seller_id = $event"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">NIT vendedor</p>
            <p class="text-weight-medium no-margin">
              {{ formData.seller_id || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.seller_description"
            label="Descripción vendedor"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Descripción vendedor</p>
            <p class="text-weight-medium no-margin">
              {{ formData.seller_description || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.exchange_traded_fund_administrator_nit"
            label="NIT administrador"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">NIT administrador</p>
            <p class="text-weight-medium no-margin">
              {{ formData.exchange_traded_fund_administrator_nit || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isView"
            :default_value="
              formData.exchange_traded_fund_administrator_description
            "
            label="Descripción administrador"
            placeholder="-"
            disabled
            required
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Descripción administrador</p>
            <p class="text-weight-medium no-margin">
              {{
                formData.exchange_traded_fund_administrator_description || '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.paper_type_id"
            label="Tipo de papel"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.paper_type"
            :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de papel es requerido'),
            ]"
            @update:modelValue="formData.paper_type_id = $event"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Papel</p>
            <p class="text-weight-medium no-margin">
              {{ formData.paper_type_id || '-' }}
            </p>
          </div>
        </div>

        <div v-if="!isView" class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.quantity_units"
            label="Cantidad unidades"
            placeholder="Inserte"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La cantidad de unidades es requerida'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 6),
            ]"
            @update:modelValue="formData.quantity_units = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.operation_number_days"
            label="Número días operación"
            placeholder="Inserte"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El número de días de la operación es requerido'),
              (val: string) => useRules().max_value(val, 5),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().only_number(val),
            ]"
            @update:modelValue="formData.operation_number_days = $event"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Número días operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_number_days || '-' }}
            </p>
          </div>
        </div>

        <div
          class="row col-12 items-center justify-between q-px-md"
          v-if="!isView"
        >
          <p class="q-mb-none mt-1 text-weight-medium q-ml-md">
            Base comisión*
          </p>
          <q-option-group
            v-model="formData.commission_base"
            :options="equity_ops_options['radio']"
            type="radio"
            color="orange"
            inline
          />
        </div>

        <div class="col-12 col-md-3 text-black-90" v-else>
          <p class="text-weight-bold no-margin">Base comisión</p>
          <p class="text-weight-medium no-margin">
            {{ formData.commission_base || '-' }}
          </p>
        </div>

        <div class="col-12 col-md-3 text-black-90" v-if="isView">
          <p class="text-weight-bold no-margin">Valor</p>
          <p class="text-weight-medium no-margin">
            {{
              useUtils().formatCurrencyString(formData.commission_value) || '-'
            }}
          </p>
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>

        <div class="col-12 col-md-3" v-if="!isView">
          <GenericInputComponent
            :default_value="formData.commission_value"
            label="Valor"
            placeholder="Inserte"
            required
            :rules="formData.commission_base === 'Valor Operación' 
              ? [
                  (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 4, 2),
                  (val: string) => useRules().is_required(val, 'El porcentaje es requerido'),
                ]
              : formData.commission_base === 'Número Unidades' 
                ? [
                    (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 6),
                    (val: string) => useRules().is_required(val, 'El número de unidades es requerido'),
                  ]
                : [
                    (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 2),
                    (val: string) => useRules().is_required(val, 'El valor es requerido'),
                  ]"
            @update:model-value="formData.commission_value = $event"
          />
        </div>

        <section
          v-if="isView"
          class="row col-12 q-col-gutter-x-lg q-col-gutter-y-md"
        >
          <p class="col-12 text-weight-bold text-black-90 text-h6">
            Condiciones de cumplimiento
          </p>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold no-margin">Cantidad unidades</p>
            <p class="text-weight-medium no-margin">
              {{ formData.compliance_quantity_units || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold no-margin">Valor unidad compra</p>
            <p class="text-weight-medium no-margin">
              {{
                useUtils().formatCurrencyString(
                  formData.compliance_value_unit_buy
                ) || '-'
              }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold no-margin">Valor cumplimiento</p>
            <p class="text-weight-medium no-margin">
              {{
                useUtils().formatCurrencyString(
                  formData.compliance_value_compliance
                ) || '-'
              }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold no-margin">Fecha de cumplimiento</p>
            <p class="text-weight-medium no-margin">
              {{ formData.compliance_operation_date || '-' }}
            </p>
          </div>
        </section>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

import { useRules, useUtils } from '@/composables'
import { equity_ops_options } from '@/constants'
import { ActionType } from '@/interfaces/global'

import useInformationForm from '@/components/Forms/InvestmentPortfolio/EquityOps/ETFLocalBuy/InformationForm/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: {}
  }>(),
  {}
)

const { isView, formData, onSelectETF, selectOptions, informationFormRef } =
  useInformationForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
