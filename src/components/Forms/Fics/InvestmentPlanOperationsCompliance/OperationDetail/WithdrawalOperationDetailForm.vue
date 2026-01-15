<template>
  <div>
    <q-form ref="operationDetailForm">
      <section>
        <VCard class="q-px-lg" style="margin-bottom: 0">
          <template #content-card>
            <section class="detail-table q-pb-lg">
              <TableList
                :loading="false"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :hide-pagination="true"
                :hide-header="!tableProps.rows.length"
                :custom-columns="['radio', 'account']"
              >
                <template #radio="{ row }">
                  <RadioYesNo
                    v-model="row.selected"
                    :options="[{ label: '', value: true }]"
                    @update:model-value="selectDetail(row)"
                  />
                </template>

                <template #account="{ row }">
                  <!-- Ver -->
                  <Button
                    :left-icon="useUtils().defaultIconsLucide.plusCircleOutline"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    tooltip="Seleccionar cuenta"
                    @click="openAccountModal(row)"
                  />
                </template>

                <template v-if="tableProps.rows.length" #custom-bottom-row>
                  <q-tr>
                    <q-td colspan="4" style="height: 1.75rem" align="right">
                      <strong class="text-primary_fiduciaria"
                        >Total operación</strong
                      >
                    </q-td>
                    <q-td colspan="5" style="height: 1.75rem">
                      <span>{{
                        `${useUtils().formatCurrencyString(totalValue)}`
                      }}</span>
                    </q-td>
                  </q-tr>
                </template>
              </TableList>
            </section>
            <section v-if="selectedRow?.id">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
                <div class="col-12 col-md-3">
                  <GenericSelectorComponent
                    label="Banco"
                    :manual_option="banks"
                    map_options
                    :required="false"
                    :default_value="selectedRow.treasury_collection_bank_id"
                    auto_complete
                    clearable
                    disabled
                    :placeholder="'Seleccione'"
                    :rules="[]"
                    @update:modelValue="selectBank($event)"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <GenericInputComponent
                    label="Descripción banco"
                    placeholder="-"
                    disabled
                    :default_value="
                      selectedRow.treasury_collection_bank_description
                    "
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <GenericSelectorComponent
                    label="Cuenta origen"
                    :manual_option="bank_account"
                    map_options
                    :required="false"
                    :default_value="selectedRow.fic_account_bank_id"
                    auto_complete
                    clearable
                    disabled
                    :placeholder="'Seleccione'"
                    :rules="[]"
                    @update:modelValue="selectBankAccount($event)"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <GenericInputComponent
                    label="Descripción cuenta origen"
                    placeholder="-"
                    disabled
                    :default_value="selectedRow.fic_account_bank_description"
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <GenericInputComponent
                    label="Saldo cuenta origen"
                    placeholder="-"
                    disabled
                    :default_value="selectedRowInfoExtra.initial_balance"
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <GenericInputComponent
                    label="Tipo de cuenta"
                    placeholder="-"
                    disabled
                    :default_value="selectedRowInfoExtra.type_account"
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <GenericInputComponent
                    label="Cheque"
                    placeholder="-"
                    disabled
                    :default_value="selectedRow.check_bank_id"
                    :rules="[]"
                  />
                </div>
                <div class="col-12">
                  <GenericInputComponent
                    label="Observaciones"
                    type="textarea"
                    disabled
                    placeholder="Inserte"
                    :default_value="selectedRow.observations"
                    :rules="[]"
                    @update:modelValue="selectedRow.observation = $event"
                  />
                </div>
              </div>
            </section>
          </template>
        </VCard>
      </section>
      <AlertModalComponent
        ref="accountModalRef"
        :show-img-default="false"
        marginTopBody=""
        styleModal="padding-left: 2vw;"
        :title-header="'Cuenta'"
        :show-btn-confirm="false"
        :show-btn-cancel="false"
      >
        <template #default-body>
          <section>
            <div class="row q-col-gutter-y-md">
              <div class="col-12 text-black-90">
                <p class="text-weight-bold mb-3">
                  Numero de cuenta/plan de inversión
                </p>
                <p class="text-weight-medium no-margin">
                  {{ modalAccountInfo.account_number ?? 'No registra' }}
                </p>
              </div>
              <div class="col-12 text-black-90">
                <p class="text-weight-bold mb-3">Fondo/banco</p>
                <p class="text-weight-medium no-margin">
                  {{ modalAccountInfo.bank_code ?? 'No registra' }}
                </p>
              </div>
              <div class="col-12 text-black-90">
                <p class="text-weight-bold mb-3">Tipo cuenta*</p>
                <p class="text-weight-medium no-margin">
                  {{ modalAccountInfo.type_account ?? 'No registra' }}
                </p>
              </div>
              <div class="col-12 text-black-90">
                <p class="text-weight-bold mb-3">Identificación titular*</p>
                <p class="text-weight-medium no-margin">
                  {{
                    modalAccountInfo.responsible_owner_document ?? 'No registra'
                  }}
                </p>
              </div>
              <div class="col-12 text-black-90">
                <p class="text-weight-bold mb-3">Nombre titular</p>
                <p class="text-weight-medium no-margin">
                  {{ modalAccountInfo.responsible_owner_name ?? 'No registra' }}
                </p>
              </div>
            </div>
          </section>
        </template>
      </AlertModalComponent>
    </q-form>
  </div>
</template>
<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IInvestmentPlanOperationResponseDetailItem } from '@/interfaces/customs/fics/InvestmentPlanOperationCompliance'

// Composables
import { useUtils } from '@/composables'

// logic view
import useWithdrawalOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperationsCompliance/OperationDetail/WithdrawalOperationDetailForm'

defineExpose({
  validateForm: () => validateInvestmentPlanOperation(),
  getFormData: () => getFormData(),
})

const props = withDefaults(
  defineProps<{
    data?: IInvestmentPlanOperationResponseDetailItem[]
    subtype: string | undefined
  }>(),
  {}
)

const {
  banks,
  tableProps,
  totalValue,
  selectedRow,
  bank_account,
  accountModalRef,
  operationDetailForm,
  selectedRowInfoExtra,
  modalAccountInfo,
  selectBank,
  getFormData,
  selectDetail,
  openAccountModal,
  selectBankAccount,
  validateInvestmentPlanOperation,
} = useWithdrawalOperationDetailForm(props)
</script>
