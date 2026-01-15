<template>
  <q-form ref="formPerformance">
    <section v-if="['view'].includes(action)">
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div class="col-12 mb-0">
            <p class="text-black-10 text-weight-bold text-h6">
              Efecto de tesorería
            </p>
          </div>

          <div class="col-xs-12 col-md-4">
            <p class="text-weight-medium text-black-6 mb-0">Negocio</p>

            <p class="text-grey-9 mb-0">{{ business }}</p>
          </div>

          <div class="col-xs-12 col-md-4">
            <p class="text-weight-medium text-black-6 mb-0">Banco</p>

            <p class="text-grey-9 mb-0">{{ bank }}</p>
          </div>

          <div class="col-xs-12 col-md-4">
            <p class="text-weight-medium text-black-6 mb-0">Cuenta bancaria</p>

            <p class="text-grey-9 mb-0">
              {{ account_bank }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator v-if="['view'].includes(action)" class="mt-1" />

    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div class="col-12 mb-0">
            <p
              v-if="['create', 'edit'].includes(action)"
              class="text-black-10 text-weight-bold text-h6"
            >
              Rendimientos
            </p>
            <p
              :class="
                ['create', 'edit'].includes(action)
                  ? 'text-grey-6'
                  : 'text-black-10 text-weight-bold text-h6 mb-0'
              "
            >
              Efecto de tesorería
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              {{
                ['view'].includes(action)
                  ? 'Movimiento de tesorería'
                  : 'Movimiento (tesorería)'
              }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.treasury_movement_id"
              :manual_option="movement_egreso_label"
              :auto_complete="true"
              :required="false"
              :map_options="true"
              :rules="[]"
              @update:model-value="models.treasury_movement_id = $event"
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.treasury_movement_code ?? 'No registrado' }} -
              {{ models.treasury_movement_description ?? '' }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Valida Saldo{{ ['view'].includes(action) ? '' : '' }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.validate_balance"
              :manual_option="validate_balance"
              :auto_complete="true"
              :required="false"
              :map_options="true"
              :rules="[]"
              @update:model-value="models.validate_balance = $event"
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.validate_balance ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 mb-0">
            <p
              :class="
                ['create', 'edit'].includes(action)
                  ? 'text-grey-6'
                  : 'text-black-10 text-weight-bold text-h6 mb-0'
              "
            >
              Movimiento fondos
            </p>
          </div>

          <div class="col-12">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Movimiento de fondos{{ ['view'].includes(action) ? '' : '*' }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.movement_codes_id"
              :manual_option="bank_account_movements"
              :disabled="isMovementsFundsDisabled"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val, 'El movimiento de fondos es requerido')]"
              @update:model-value="models.movement_codes_id = $event"
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.movement_codes_code ?? 'No registrado' }} -
              {{ models.movement_codes_description ?? '' }}
            </p>
          </div>

          <div class="col-12 mb-0">
            <p
              :class="
                ['create', 'edit'].includes(action)
                  ? 'text-grey-6'
                  : 'text-black-10 text-weight-bold text-h6 mb-0'
              "
            >
              Efecto de contable
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Cuenta Contable{{ ['view'].includes(action) ? '' : '' }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.accounting_account_id"
              :manual_option="bank_account_accounting_accounts"
              :auto_complete="true"
              :required="false"
              :map_options="true"
              :rules="[]"
              @update:model-value="models.accounting_account_id = $event"
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.accounting_account_code ?? 'No registrado' }} -
              {{ models.accounting_account_name ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Tipo de tercero{{ ['view'].includes(action) ? '' : '' }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.type_thirdparty"
              :manual_option="type_thirParty"
              :auto_complete="true"
              :required="false"
              :map_options="true"
              :rules="[]"
              @update:model-value="models.type_thirdparty = $event"
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.type_thirdparty ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Centro de costo{{
                ['view'].includes(action) || isCostCenterDisable ? '' : '*'
              }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.cost_center_id"
              :manual_option="bank_account_cost_center"
              :disabled="isCostCenterDisable"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val, 'La validacion de saldo es requerida')]"
              @update:model-value="models.cost_center_id = $event"
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.cost_center_code ?? 'No registrado' }} -
              {{ models.cost_center_description ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mt-1" />

    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div class="col-12 row mb-0">
            <p
              class="col-xs-12 col-md-2 text-black-10 text-weight-bold text-h6"
            >
              Tasas
            </p>

            <div class="col-xs-12 col-md-10 justify-end flex flex-nowrap">
              <div class="mr-3">
                <RadioYesNo
                  v-model="radioRate"
                  :isDisabled="['view'].includes(action)"
                  titleRadioTrue="E.A - Efectivo anual"
                  titleRadioFalse="N.A - Nominal anual"
                  :isRadioButton="true"
                  :hasTitle="false"
                  :hasSubtitle="false"
                  @update:model-value="
                    models.rate_type = $event
                      ? 'E.A - Efectivo anual'
                      : 'N.A - Nominal anual'
                  "
                />
              </div>

              <div v-if="['create', 'edit'].includes(action)">
                <Button
                  :outline="false"
                  label="Crear"
                  class="mr-1"
                  color-icon="white"
                  :left-icon="defaultIconsLucide.plusCircle"
                  :styleContent="{
                    'place-items': 'center',
                    'min-width': '5rem',
                  }"
                  @click="newRate"
                />
              </div>
            </div>

            <div class="col-12">
              <Card>
                <template #content-card>
                  <TableList
                    v-if="models?.rates?.length"
                    :loading="tableProps.loading"
                    :rows="models.rates"
                    :columns="tableProps.columns"
                    :custom-columns="[
                      'range_from',
                      'range_up',
                      'rate',
                      'actions',
                    ]"
                    class="mx-1"
                  >
                    <template #range_from="{ row }">
                      <div class="mt-7">
                        <CurrencyInput
                          v-model="row.range_from"
                          :disabled="['view'].includes(action)"
                          :currency="'COP'"
                          :placeholder="''"
                          currencyLabel=""
                          :rules="[
                            (val: string) => useRules().is_required(val, 'El rango inferior es requerido'),
                            (val: string) => useRules().max_length(val, 18),
                            (val: string) => useRules().min_length(val, 1),
                          ]"
                        />
                      </div>
                    </template>

                    <template #range_up="{ row }">
                      <div class="mt-7">
                        <CurrencyInput
                          v-model="row.range_up"
                          :disabled="['view'].includes(action)"
                          :currency="'COP'"
                          :placeholder="''"
                          currencyLabel=""
                          :rules="[
                            (val: string) => useRules().is_required(val, 'El rango superior es requerido'),
                            (val: string) => useRules().max_length(val, 18),
                            (val: string) => useRules().min_length(val, 1),
                          ]"
                        />
                      </div>
                    </template>

                    <template #rate="{ row }">
                      <div class="mt-7">
                        <CurrencyInput
                          v-model="row.rate"
                          :disabled="['view'].includes(action)"
                          :currency="'COP'"
                          :placeholder="''"
                          currencyLabel=""
                          :hideIcon="true"
                          :precision="5"
                          :rules="[
                            (val: string) => useRules().is_required(val, 'La tasa es requerida'),
                            (val: string) => useRules().max_integer_decimal(val, 2, 5, true),
                          ]"
                        />
                      </div>
                    </template>

                    <template #actions="{ index }">
                      <Button
                        :disabled="['view'].includes(action)"
                        :left-icon="defaultIconsLucide.delete"
                        color="orange"
                        :class-custom="'custom'"
                        :outline="false"
                        :flat="true"
                        colorIcon="#f45100"
                        tooltip="Eliminar"
                        @click="deleteRate(index)"
                      />
                    </template>
                  </TableList>
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
// Components
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Interfaces
import { IBankAccountPerformance } from '@/interfaces/customs'

// Composables
import { useRules } from '@/composables'

// Logic form
import usePerformanceForm from '@/components/Forms/Treasury/BankingAccounts/Performance/v2/PerformanceForm'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBankAccountPerformance
  }>(),
  {}
)

const {
  models,
  formPerformance,
  tableProps,
  movement_egreso_label,
  validate_balance,
  bank_account_accounting_accounts,
  type_thirParty,
  bank_account_cost_center,
  bank_account_movements,
  defaultIconsLucide,
  radioRate,
  business,
  bank,
  account_bank,
  isCostCenterDisable,
  isMovementsFundsDisabled,

  newRate,
  deleteRate,
} = usePerformanceForm(props)

defineExpose({
  validateForm: () => formPerformance.value?.validate(),
})
</script>
