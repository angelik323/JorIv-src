<template>
  <q-form ref="formRestatement">
    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div v-if="['create', 'edit'].includes(action)" class="col-12 mb-0">
            <p class="text-black-10 text-weight-bold text-h6">
              Efecto de tesorería
            </p>
          </div>

          <div class="col-xs-12 col-md-4">
            <p class="text-weight-medium text-grey-6 mb-0">Negocio</p>

            <GenericInput :default_value="business" :disabled="true" />
          </div>

          <div class="col-xs-12 col-md-4">
            <p class="text-weight-medium text-grey-6 mb-0">Banco</p>

            <GenericInput :default_value="bank" :disabled="true" />
          </div>

          <div class="col-xs-12 col-md-4">
            <p class="text-weight-medium text-grey-6 mb-0">Cuenta bancaria</p>

            <GenericInput :default_value="account_bank" :disabled="true" />
          </div>

          <div v-if="['view'].includes(action)" class="col-12 mb-0">
            <p class="text-black-10 text-weight-bold text-h6">
              Efecto de tesorería
            </p>
          </div>

          <div class="col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Movimiento diferencia positiva{{
                ['view'].includes(action) ? '' : '*'
              }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.treasury_movement_positive_id"
              :manual_option="
                treasury_movement_codes.filter((item) =>
                  item.nature?.includes('Ingreso')
                )
              "
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val, 'El movimiento diferencia positiva es requerido')]"
              @update:model-value="
                models.treasury_movement_positive_id = $event
              "
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.treasury_movement_positive_code ?? 'No registrado' }} -
              {{ models.treasury_movement_positive_description ?? '' }}
            </p>
          </div>

          <div class="col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Movimiento diferencia negativa{{
                ['view'].includes(action) ? '' : '*'
              }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.treasury_movement_negative_id"
              :manual_option="
                treasury_movement_codes.filter((item) =>
                  item.nature?.includes('Egreso')
                )
              "
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val, 'El movimiento diferencia negativa es requerido')]"
              @update:model-value="
                models.treasury_movement_negative_id = $event
              "
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.treasury_movement_negative_code ?? 'No registrado' }} -
              {{ models.treasury_movement_negative_description ?? '' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mt-1" />

    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div class="col-12 mb-0">
            <p class="text-black-10 text-weight-bold text-h6">
              Movimiento fondos
            </p>
          </div>

          <div class="col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Movimiento diferencia positiva{{
                ['view'].includes(action) ? '' : '*'
              }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.movement_codes_positive_id"
              :manual_option="bank_account_movements_positive"
              :disabled="isPositiveMovementFundDisabled"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val, 'El movimiento diferencia positiva es requerido')]"
              @update:model-value="models.movement_codes_positive_id = $event"
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.movement_codes_positive_code ?? 'No registrado' }} -
              {{ models.movement_codes_positive_description ?? '' }}
            </p>
          </div>

          <div class="col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
              "
            >
              Movimiento diferencia negativa{{
                ['view'].includes(action) ? '' : '*'
              }}
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.movement_codes_negative_id"
              :manual_option="bank_account_movements_negative"
              :disabled="isNegativeMovementFundDisabled"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => useRules().is_required(val, 'El movimiento diferencia negativa es requerido')]"
              @update:model-value="models.movement_codes_negative_id = $event"
            />
            <p v-else class="text-grey-9 mb-0">
              {{ models.movement_codes_negative_code ?? 'No registrado' }} -
              {{ models.movement_codes_negative_description ?? '' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mt-1" />

    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-sm mt-1">
          <div class="col-12 mb-0">
            <p class="text-black-10 text-weight-bold text-h6">
              Efecto Contable
            </p>
          </div>

          <div class="col-sm-12 col-md-6">
            <Card>
              <template #content-card>
                <div class="mx-3 my-3">
                  <p class="text-black-10 text-weight-bold text-h6">
                    Diferencia positiva
                  </p>

                  <p
                    class="text-weight-medium mb-0"
                    :class="
                      ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
                    "
                  >
                    Cuenta contable{{ ['view'].includes(action) ? '' : '*' }}
                  </p>

                  <GenericSelectorComponent
                    v-if="['create', 'edit'].includes(action)"
                    :default_value="models.accounting_account_positive_id"
                    :manual_option="bank_account_accounting_accounts"
                    :auto_complete="true"
                    :required="true"
                    :map_options="true"
                    :rules="[(val: string) => useRules().is_required(val, 'La cuenta contable es requerida')]"
                    @update:model-value="
                      models.accounting_account_positive_id = $event
                    "
                  />
                  <p v-else class="text-grey-9 mb-3">
                    {{
                      models.accounting_account_positive_code ?? 'No registrado'
                    }}
                    - {{ models.accounting_account_positive_name ?? '' }}
                  </p>

                  <p
                    class="text-weight-medium mb-0"
                    :class="
                      ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
                    "
                  >
                    Tipo de tercero{{ ['view'].includes(action) ? '' : '*' }}
                  </p>

                  <GenericSelectorComponent
                    v-if="['create', 'edit'].includes(action)"
                    :default_value="models.type_thirdparty_positive"
                    :manual_option="type_thirParty"
                    :auto_complete="true"
                    :required="true"
                    :disabled="['edit'].includes(action) ? true : false"
                    :map_options="true"
                    :rules="[(val: string) => useRules().is_required(val, 'El tipo de tercero es requerido')]"
                    @update:model-value="
                      models.type_thirdparty_positive = $event
                    "
                  />
                  <p v-else class="text-grey-9 mb-3">
                    {{ models.type_thirdparty_positive ?? 'No registrado' }}
                  </p>

                  <p
                    class="text-weight-medium mb-0"
                    :class="
                      ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
                    "
                  >
                    Centro de costo{{ ['view'].includes(action) ? '' : '*' }}
                  </p>

                  <GenericSelectorComponent
                    v-if="['create', 'edit'].includes(action)"
                    :default_value="models.cost_center_positive_id"
                    :manual_option="bank_account_cost_center"
                    :disabled="isPositiveCostCenterDisable"
                    :auto_complete="true"
                    :required="true"
                    :map_options="true"
                    :rules="[(val: string) => useRules().is_required(val, 'El centro de costo es requerido')]"
                    @update:model-value="
                      models.cost_center_positive_id = $event
                    "
                  />
                  <p v-else class="text-grey-9 mb-3">
                    {{ models.cost_center_positive_code ?? 'No registrado' }} -
                    {{ models.cost_center_positive_description ?? '' }}
                  </p>
                </div>
              </template>
            </Card>
          </div>

          <div class="col-sm-12 col-md-6">
            <Card>
              <template #content-card>
                <div class="mx-3 my-3">
                  <p class="text-black-10 text-weight-bold text-h6">
                    Diferencia negativa
                  </p>

                  <p
                    class="text-weight-medium mb-0"
                    :class="
                      ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
                    "
                  >
                    Cuenta contable{{ ['view'].includes(action) ? '' : '*' }}
                  </p>

                  <GenericSelectorComponent
                    v-if="['create', 'edit'].includes(action)"
                    :default_value="models.accounting_account_negative_id"
                    :manual_option="bank_account_accounting_accounts"
                    :auto_complete="true"
                    :required="true"
                    :map_options="true"
                    :rules="[(val: string) => useRules().is_required(val, 'La cuenta contable es requerida')]"
                    @update:model-value="
                      models.accounting_account_negative_id = $event
                    "
                  />
                  <p v-else class="text-grey-9 mb-3">
                    {{
                      models.accounting_account_negative_code ?? 'No registrado'
                    }}
                    - {{ models.accounting_account_negative_name ?? '' }}
                  </p>

                  <p
                    class="text-weight-medium mb-0"
                    :class="
                      ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
                    "
                  >
                    Tipo de tercero{{ ['view'].includes(action) ? '' : '*' }}
                  </p>

                  <GenericSelectorComponent
                    v-if="['create', 'edit'].includes(action)"
                    :default_value="models.type_thirdparty_negative"
                    :manual_option="type_thirParty"
                    :auto_complete="true"
                    :required="true"
                    :disabled="['edit'].includes(action) ? true : false"
                    :map_options="true"
                    :rules="[(val: string) => useRules().is_required(val, 'El tipo de tercero es requerido')]"
                    @update:model-value="
                      models.type_thirdparty_negative = $event
                    "
                  />
                  <p v-else class="text-grey-9 mb-3">
                    {{ models.type_thirdparty_negative ?? 'No registrado' }}
                  </p>

                  <p
                    class="text-weight-medium mb-0"
                    :class="
                      ['view'].includes(action) ? 'text-black-6' : 'text-grey-6'
                    "
                  >
                    Centro de costo{{ ['view'].includes(action) ? '' : '*' }}
                  </p>

                  <GenericSelectorComponent
                    v-if="['create', 'edit'].includes(action)"
                    :default_value="models.cost_center_negative_id"
                    :manual_option="bank_account_cost_center"
                    :disabled="isNegativeCostCenterDisable"
                    :auto_complete="true"
                    :required="true"
                    :map_options="true"
                    :rules="[(val: string) => useRules().is_required(val, 'El centro de costo es requerido')]"
                    @update:model-value="
                      models.cost_center_negative_id = $event
                    "
                  />
                  <p v-else class="text-grey-9 mb-3">
                    {{ models.cost_center_negative_code ?? 'No registrado' }} -
                    {{ models.cost_center_negative_description ?? '' }}
                  </p>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
// Components
import { useRules } from '@/composables'
import Card from '@/components/common/VCard/VCard.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Interfaces
import { IBankAccountRestatement } from '@/interfaces/customs'

// Logic form
import useRestatementForm from '@/components/Forms/Treasury/BankingAccounts/Restatement/v2/RestatementForm'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBankAccountRestatement
  }>(),
  {}
)

const {
  models,
  bank_account_accounting_accounts,
  type_thirParty,
  bank_account_cost_center,
  business,
  bank,
  account_bank,
  bank_account_movements_positive,
  bank_account_movements_negative,
  formRestatement,
  treasury_movement_codes,
  isPositiveMovementFundDisabled,
  isNegativeMovementFundDisabled,
  isPositiveCostCenterDisable,
  isNegativeCostCenterDisable,
} = useRestatementForm(props)

defineExpose({
  validateForm: () => formRestatement.value?.validate(),
})
</script>
