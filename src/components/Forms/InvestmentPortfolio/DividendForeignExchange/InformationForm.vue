<template>
  <div>
    <q-form ref="informationForm" class="q-pa-lg">
      <section class="q-mb-lg">
        <div class="text-subtitle1 text-weight-bold q-mb-md">Parámetros</div>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">ID emisor</p>
              <p class="text-weight-medium no-margin">
                {{
                  emitter_anna_codes_by_id.find(
                    (emitter) =>
                      Number(emitter.value) ===
                      Number(dividend_local.parameters.emitter_id)
                  )?.label || '-'
                }}
              </p>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="ID emisor"
                :manual_option="emitter_anna_codes_by_id"
                map_options
                auto_complete
                clearable
                required
                :option_label="'label'"
                :default_value="dividend_local.parameters.emitter_id"
                :rules="[
                  (v) => useRules().is_required(v, 'El ID emisor es requerido'),
                ]"
                @update:modelValue="
                  dividend_local.parameters.emitter_id = $event
                "
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Número de ETFs
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  exchange_traded_fund_foreign.find(
                    (etf) =>
                      Number(etf.value) ===
                      Number(dividend_local.parameters.exchange_traded_fund_id)
                  )?.description || '-'
                }}
              </p>
            </template>
            <template v-else>
              <GenericSelectorComponent
                label="Número de ETFs"
                :manual_option="exchange_traded_fund_foreign"
                map_options
                auto_complete
                clearable
                required
                :option_label="'label'"
                :option_value="'value'"
                :default_value="
                  String(
                    dividend_local.parameters.exchange_traded_fund_id ?? ''
                  )
                "
                :rules="[
                  (v) =>
                    useRules().is_required(v, 'El número de ETFs es requerido'),
                ]"
                @update:modelValue="
                  (val) => {
                    const v =
                      typeof val === 'object'
                        ? String(val?.value ?? '')
                        : String(val ?? '')
                    dividend_local.parameters.exchange_traded_fund_id = v
                      ? Number(v)
                      : 0
                  }
                "
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView">
              <p class="text-weight-bold no-margin text-black-90">
                Cantidad de ETFs
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.parameters.quantity_exchange_traded_fund ?? '-'
                }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Cantidad de ETFs"
                type="number"
                disabled
                :default_value="
                  dividend_local.parameters.quantity_exchange_traded_fund ?? ''
                "
                @update:modelValue="
                  (val) =>
                    (dividend_local.parameters.quantity_exchange_traded_fund =
                      Number(val))
                "
              />
            </template>
          </div>
        </div>
      </section>

      <section class="q-mb-lg">
        <div class="text-subtitle1 text-weight-bold q-mb-md">
          Registro de dividendo
        </div>

        <div
          class="row q-col-gutter-x-lg q-col-gutter-y-sm"
          :class="{ 'items-end': !isView }"
        >
          <div class="col-12 col-md-3">
            <template v-if="isView"
              ><p class="text-weight-bold no-margin text-black-90">
                Fecha de registro
              </p>
              <p class="text-weight-medium no-margin">
                {{ dividend_local.register_dividend.register_date || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericInputDate
                label="Fecha de registro"
                required
                :default_value="
                  dividend_local.register_dividend.register_date || ''
                "
                :rules="[
                  (v) =>
                    useRules().is_required(
                      v,
                      'La fecha de registro es requerida'
                    ),
                ]"
                @update:modelValue="
                  (val) =>
                    (dividend_local.register_dividend.register_date = val)
                "
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView"
              ><p class="text-weight-bold no-margin text-black-90">
                Tipo de dividendo
              </p>
              <p class="text-weight-medium no-margin">
                {{ dividend_local.register_dividend.dividend_type || '-' }}
              </p>
            </template>
            <template v-else>
              <div class="q-field">
                <p class="q-mb-none mt-1 text-weight-medium">
                  Tipo de dividendo *
                </p>
                <q-option-group
                  v-model="dividend_local.register_dividend.dividend_type"
                  type="radio"
                  :options="dividendTypeOptions"
                  color="primary"
                />
              </div>
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView"
              ><p class="text-weight-bold no-margin text-black-90">
                Fecha exigibilidad
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.register_dividend.enforceability_date || '-'
                }}
              </p>
            </template>
            <template v-else>
              <GenericInputDate
                label="Fecha exigibilidad"
                required
                :default_value="
                  dividend_local.register_dividend.enforceability_date || ''
                "
                :rules="[
                  (v) =>
                    useRules().is_required(
                      v,
                      'La fecha de exigibilidad es requerida'
                    ),
                ]"
                @update:modelValue="
                  (val) =>
                    (dividend_local.register_dividend.enforceability_date = val)
                "
              />
            </template>
          </div>

          <div
            class="col-12 col-md-3"
            v-if="
              dividend_local.register_dividend.dividend_type === 'Ex-Dividendo'
            "
          >
            <template v-if="isView"
              ><p class="text-weight-bold no-margin text-black-90">
                Fecha ex-dividendo
              </p>
              <p class="text-weight-medium no-margin">
                {{ dividend_local.register_dividend.ex_dividend_date || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericInputDate
                label="Fecha ex-dividendo"
                required
                :default_value="
                  dividend_local.register_dividend.ex_dividend_date || ''
                "
                :rules="[
                  (v) =>
                    useRules().is_required(
                      v,
                      'La fecha ex dividendo es requerida'
                    ),
                ]"
                @update:modelValue="
                  (val) =>
                    (dividend_local.register_dividend.ex_dividend_date = val)
                "
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView"
              ><p class="text-weight-bold no-margin text-black-90">Gravado</p>
              <p class="text-weight-medium no-margin">
                {{ dividend_local.register_dividend.graved ? 'Sí' : 'No' }}
              </p>
            </template>
            <template v-else>
              <p class="q-mb-none mt-1 text-weight-medium">Gravado*</p>
              <q-option-group
                v-model="dividend_local.register_dividend.graved"
                type="radio"
                :options="fic_menu_movement"
                color="primary"
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView"
              ><p class="text-weight-bold no-margin text-black-90">
                Impuesto (%)
              </p>
              <p class="text-weight-medium no-margin">
                {{ dividend_local.register_dividend.tax_value ?? '-' }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Impuesto (%)"
                type="number"
                placeholder="0"
                required
                :default_value="
                  dividend_local.register_dividend.tax_value ?? ''
                "
                :rules="[
                  (v) =>
                    useRules().is_required(
                      v,
                      'El valor de impuesto es requerido'
                    ),
                  (v) => useRules().only_number(v),
                ]"
                @update:modelValue="
                  (val) =>
                    (dividend_local.register_dividend.tax_value = Number(val))
                "
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView"
              ><p class="text-weight-bold no-margin text-black-90">
                Moneda origen
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.register_dividend.origin_currency_code ?? '-'
                }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Moneda origen"
                type="text"
                disabled
                required
                :default_value="
                  String(
                    dividend_local.register_dividend.origin_currency_code ?? ''
                  )
                "
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView"
              ><p class="text-weight-bold no-margin text-black-90">
                Valor moneda
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.register_dividend.origin_currency_value ?? '-'
                }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Valor moneda"
                type="number"
                disabled
                required
                :default_value="
                  dividend_local.register_dividend.origin_currency_value ?? ''
                "
                :rules="[
                  (v) =>
                    useRules().is_required(
                      v,
                      'El valor de moneda es requerido'
                    ),
                ]"
                @update:modelValue="
                  (val) =>
                    (dividend_local.register_dividend.origin_currency_value =
                      Number(val))
                "
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <template v-if="isView"
              ><p class="text-weight-bold no-margin text-black-90">
                Valor dividendo/unidad (moneda origen)
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.register_dividend.origin_currency_unit_value ??
                  '-'
                }}
              </p>
            </template>
            <template v-else>
              <GenericInput
                label="Valor dividendo/unidad (moneda origen)"
                type="number"
                placeholder="0"
                required
                :default_value="
                  dividend_local.register_dividend.origin_currency_unit_value ??
                  ''
                "
                :rules="[
                  (v) =>
                    useRules().is_required(
                      v,
                      'El valor de dividendo es requerido'
                    ),
                ]"
                @update:modelValue="
                  (val) =>
                    (dividend_local.register_dividend.origin_currency_unit_value =
                      Number(val))
                "
              />
            </template>
          </div>

          <div class="col-12 col-md-3">
            <GenericInput
              v-if="!isView"
              label="Valor impuesto (moneda origen)"
              type="number"
              disabled
              :default_value="
                dividend_local.register_dividend.origin_currency_value_tax ?? ''
              "
            />
            <template v-else>
              <p class="text-weight-bold no-margin text-black-90">
                Valor impuesto (moneda origen)
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.register_dividend.origin_currency_value_tax ??
                  '-'
                }}
              </p>
            </template>
          </div>

          <div class="col-12 col-md-3">
            <GenericInput
              v-if="!isView"
              label="Valor dividendo después de impuesto (moneda origen)"
              type="number"
              disabled
              :default_value="
                dividend_local.register_dividend
                  .origin_currency_dividend_value_after_tax ?? ''
              "
            />
            <template v-else>
              <p class="text-weight-bold no-margin text-black-90">
                Valor dividendo después de impuesto (moneda origen)
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.register_dividend
                    .origin_currency_dividend_value_after_tax ?? '-'
                }}
              </p>
            </template>
          </div>

          <div class="col-12 col-md-3">
            <GenericInput
              v-if="!isView"
              label="Valor dividendo/unidad (moneda local)"
              type="number"
              disabled
              :default_value="
                dividend_local.register_dividend.local_currency_unit_value ?? ''
              "
            />
            <template v-else>
              <p class="text-weight-bold no-margin text-black-90">
                Valor dividendo/unidad (moneda local)
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.register_dividend.local_currency_unit_value ??
                  '-'
                }}
              </p>
            </template>
          </div>

          <div class="col-12 col-md-3">
            <GenericInput
              v-if="!isView"
              label="Valor impuesto (moneda local)"
              type="number"
              disabled
              :default_value="
                dividend_local.register_dividend.local_currency_value_tax ?? ''
              "
            />
            <template v-else>
              <p class="text-weight-bold no-margin text-black-90">
                Valor impuesto (moneda local)
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.register_dividend.local_currency_value_tax ??
                  '-'
                }}
              </p>
            </template>
          </div>

          <div class="col-12 col-md-3">
            <GenericInput
              v-if="!isView"
              label="Valor dividendo después de impuesto (moneda local)"
              type="number"
              disabled
              :default_value="
                dividend_local.register_dividend
                  .local_currency_dividend_value_after_tax ?? ''
              "
            />
            <template v-else>
              <p class="text-weight-bold no-margin text-black-90">
                Valor dividendo después de impuesto (moneda local)
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.register_dividend
                    .local_currency_dividend_value_after_tax ?? '-'
                }}
              </p>
            </template>
          </div>
        </div>
      </section>

      <section>
        <div class="text-subtitle1 text-weight-bold q-mb-md">
          Valor cumplimiento dividendo
        </div>
        <div
          class="row q-col-gutter-x-lg q-col-gutter-y-sm"
          :class="{ 'items-end': !isView }"
        >
          <div class="col-12 col-md-4">
            <template v-if="isView"
              ><p class="text-weight-bold no-margin text-black-90">
                Fecha pago dividendo
              </p>
              <p class="text-weight-medium no-margin">
                {{ dividend_local.values_compliance.date_pay_dividend || '-' }}
              </p>
            </template>
            <template v-else>
              <GenericInputDate
                label="Fecha pago dividendo"
                required
                :default_value="
                  dividend_local.values_compliance.date_pay_dividend || ''
                "
                :rules="[
                  (v) =>
                    useRules().is_required(v, 'La fecha de pago es requerida'),
                ]"
                @update:modelValue="
                  (val) =>
                    (dividend_local.values_compliance.date_pay_dividend = val)
                "
              />
            </template>
          </div>

          <div class="col-12 col-md-4">
            <GenericInput
              v-if="!isView"
              label="Valor exigibilidad dividendo moneda origen"
              type="number"
              disabled
              :default_value="
                dividend_local.values_compliance
                  .origin_currency_enforceability_value_dividend ?? ''
              "
            />
            <template v-else>
              <p class="text-weight-bold no-margin text-black-90">
                Valor exigibilidad dividendo moneda origen
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.values_compliance
                    .origin_currency_enforceability_value_dividend ?? '-'
                }}
              </p>
            </template>
          </div>

          <div class="col-12 col-md-4">
            <GenericInput
              v-if="!isView"
              label="Valor exigibilidad dividendo moneda local"
              type="number"
              disabled
              :default_value="
                dividend_local.values_compliance
                  .local_currency_enforceability_value_dividend ?? ''
              "
            />
            <template v-else>
              <p class="text-weight-bold no-margin text-black-90">
                Valor exigibilidad dividendo moneda local
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  dividend_local.values_compliance
                    .local_currency_enforceability_value_dividend ?? '-'
                }}
              </p>
            </template>
          </div>
        </div>
      </section>
      <section class="q-mb-lg">
        <div
          class="row col-12 q-col-gutter-x-md q-col-gutter-y-sm"
          v-if="isView"
        >
          <div class="col-12">
            <div class="text-subtitle1 text-weight-bold q-mb-md">
              Historial de cambios
            </div>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-created_at" class="text-weight-bold no-margin">
              Fecha de creación
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-created_at"
            >
              {{ history?.created_at || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-creator_data" class="text-weight-bold no-margin">
              Creado por
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-creator_data"
            >
              {{ history?.created_by_user || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-updated_at" class="text-weight-bold no-margin">
              Modificación
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-updated_at"
            >
              {{ history?.updated_at ?? '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-updated_data" class="text-weight-bold no-margin">
              Modificado por
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-updated_data"
            >
              {{ history?.updated_by_user ?? '-' }}
            </p>
          </div>

          <div class="col-12">
            <q-separator class="q-my-md" />
          </div>
        </div>
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericInputDate from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import { useRules } from '@/composables'
import type { ActionType } from '@/interfaces/global'
import { useInformationForm } from './InformationForm'
import { fic_menu_movement, dividendTypeOptions } from '@/constants'

const props = withDefaults(
  defineProps<{ action: ActionType; hasLoadedData?: boolean }>(),
  { hasLoadedData: false }
)

const {
  informationForm,
  dividend_local,
  isView,
  emitter_anna_codes_by_id,
  exchange_traded_fund_foreign,
  validateForm,
  getFormData,
  history,
} = useInformationForm(props)

defineExpose({
  validateForm: () => validateForm(),
  getFormData: () => getFormData(),
})
</script>
