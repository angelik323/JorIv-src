<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filterConfig"
          @filter="handleFilter"
          :trigger_event_by_field="true"
          @update:values="handleFieldChange"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section v-show="tableProps.rows.length > 0" class="q-mt-xl">
        <div>
          <p class="text-black-10 text-weight-bold text-h6 mb-0">Detalles</p>
        </div>

        <TableList
          v-if="tableProps.rows?.[0]?.type === 'transfer'"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="[
            'register_type',
            'business',
            'bank',
            'bank_account',
            'third_party',
            'fund',
            'investment_plan',
            'trm',
            'foreign_currency_value',
            'cost_center',
            'date',
            'amount',
            'cash_flow',
            'status',
            'actions',
          ]"
          selection="multiple"
          v-model:selected="selectedRows"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          @update:selected="handleSelectedRows"
        >
          <template #register_type>
            <SubReceiptCell :items="['Origen', 'Destino']">
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>

          <template #business="{ row }">
            <SubReceiptCell
              :items="[row.record.origin_detail, row.record.destination_detail]"
            >
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{ element?.business_trust_name }}
              </template>
            </SubReceiptCell>
          </template>

          <template #bank="{ row }">
            <SubReceiptCell
              :items="[row.record.origin_detail, row.record.destination_detail]"
            >
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{ element?.bank?.name }}
              </template>
            </SubReceiptCell>
          </template>

          <template #bank_account="{ row }">
            <SubReceiptCell
              :items="[row.record.origin_detail, row.record.destination_detail]"
            >
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{ element?.bank_account?.account_number }} -
                {{ element?.bank_account?.account_name }}
              </template>
            </SubReceiptCell>
          </template>

          <template #third_party="{ row }">
            <SubReceiptCell
              :items="[row.record.origin_detail, row.record.destination_detail]"
            >
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{
                  `${element?.third_party?.identification_number ?? ''} - ${
                    element?.third_party?.name ?? ''
                  }`
                }}
              </template>
            </SubReceiptCell>
          </template>

          <template #fund="{ row }">
            <SubReceiptCell
              :items="[row.record.origin_detail, row.record.destination_detail]"
            >
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{ element?.fund }}
              </template>
            </SubReceiptCell>
          </template>

          <template #investment_plan="{ row }">
            <SubReceiptCell
              :items="[row.record.origin_detail, row.record.destination_detail]"
            >
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{ element?.investment_plan }}
              </template>
            </SubReceiptCell>
          </template>

          <template #trm="{ row }">
            <SubReceiptCell
              :items="[row.record.origin_detail, row.record.destination_detail]"
            >
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{ element?.trm }}
              </template>
            </SubReceiptCell>
          </template>

          <template #foreign_currency_value="{ row }">
            <SubReceiptCell
              :items="[row.record.origin_detail, row.record.destination_detail]"
            >
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{
                  Number(element?.foreign_currency_value)?.toLocaleString(
                    'es-CO',
                    {
                      style: 'currency',
                      currency: 'COP',
                    }
                  )
                }}
              </template>
            </SubReceiptCell>
          </template>

          <template #cost_center="{ row }">
            <SubReceiptCell
              :items="[row.record.origin_detail, row.record.destination_detail]"
            >
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{ element?.cost_center?.name }}
              </template>
            </SubReceiptCell>
          </template>

          <template #date="{ row }">
            <SubReceiptCell :items="[row.date, row.date]">
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>

          <template #amount="{ row }">
            <SubReceiptCell
              :items="[row.record.origin_detail, row.record.destination_detail]"
            >
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{
                  Number(element?.value)?.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                  })
                }}
              </template>
            </SubReceiptCell>
          </template>

          <template #cash_flow="{ row }">
            <SubReceiptCell
              :items="[row.record.origin_detail, row.record.destination_detail]"
            >
              <template
                #default="{ element }: { element: IAuthorizationCustomTable }"
              >
                {{ element?.cash_flow?.name }}
              </template>
            </SubReceiptCell>
          </template>

          <template #status="{ row }">
            <ShowStatus
              :type="row.record.status.id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handleDetailClick(row)"
            />
          </template>
        </TableList>

        <TableList
          v-else
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          selection="multiple"
          v-model:selected="selectedRows"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          @update:selected="handleSelectedRows"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="row.record.status.id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handleDetailClick(row)"
            />
          </template>
        </TableList>
      </section>

      <section class="q-mt-xl mt-0 mb-10">
        <div
          v-if="data_selection.length > 0"
          class="row no-wrap items-center q-col-gutter-sm"
        >
          <div class="col mr-3">
            <GenericInput
              placeholder="Inserte"
              label="Motivos de rechazo"
              :required="true"
              :default_value="rejection_reason ?? ''"
              :rules="[
                (val: string) => no_special_characters_extended(val),
                (val: string) => max_length(val, 60),
              ]"
              @update:modelValue="rejection_reason = $event"
            />
          </div>

          <div>
            <Button
              :outline="true"
              :disabled="error.recordId.length == 0"
              label="Errores"
              class="mr-1"
              :color="error.recordId.length == 0 ? 'grey' : 'orange'"
              class-custom="custom"
              @click="handleErrorClick"
            />
          </div>

          <div>
            <Button
              :outline="false"
              label="Autorizar"
              class="mr-1"
              color="orange"
              class-custom="custom"
              @click="authorizeAction"
            />
          </div>

          <div>
            <Button
              :outline="false"
              label="Rechazar"
              class="mr-1"
              color-icon="white"
              :left-icon="defaultIconsLucide.closeCircle"
              :styleContent="{
                'place-items': 'center',
                'min-width': '7rem',
              }"
              @click="rejectAction"
            />
          </div>
        </div>
      </section>

      <section>
        <AlertModalComponent
          ref="alertModalRef"
          styleModal="max-width: 100vw; width: 70%"
          :showBtnConfirm="false"
          :showBtnCancel="false"
          :showImgDefault="false"
          :showCloseBtn="true"
          marginTopBody="mt-0"
        >
          <template #default-body>
            <div class="mx-10">
              <p class="text-black-10 text-weight-bold text-h5">Descripción</p>

              <IncomeAuthorizationDetails
                v-if="
                  authorization_treasury_response.authorization_type ===
                  'income'
                "
                :response="authorization_treasury_response"
              />
              <ExpenseAuthorizationDetails
                v-else-if="
                  authorization_treasury_response.authorization_type ===
                  'expense'
                "
                :response="authorization_treasury_response"
              />
              <TransferAuthorizationDetails
                v-else
                :response="authorization_treasury_response"
              />
            </div>
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import SubReceiptCell from '@/components/common/SubReceiptCell/SubReceiptCell.vue'
import IncomeAuthorizationDetails from '@/components/Forms/Treasury/AuthorizationTreasury/IncomeAuthorizationDetails/IncomeAuthorizationDetails.vue'
import ExpenseAuthorizationDetails from '@/components/Forms/Treasury/AuthorizationTreasury/ExpenseAuthorizationDetails/ExpenseAuthorizationDetails.vue'
import TransferAuthorizationDetails from '@/components/Forms/Treasury/AuthorizationTreasury/TransferAuthorizationDetails/TransferAuthorizationDetails.vue'

// interfaces
import { IAuthorizationCustomTable } from '@/interfaces/customs/treasury/AuthorizationTreasury'

// Utils & Assets
import { defaultIconsLucide } from '@/utils'

// Logic view
import useAuthorizationTreasuryList from '@/views/treasury/authorization-treasury/v1/list/AuthorizationTreasuryList'

const {
  headerProps,
  filtersRef,
  filterConfig,
  alertModalRef,
  tableProps,
  authorization_treasury_response,
  selectedRows,
  data_selection,
  rejection_reason,
  error,
  no_special_characters_extended,
  authorizeAction,
  rejectAction,
  updatePage,
  updatePerPage,
  handleFilter,
  handleFieldChange,
  handleClearFilters,
  handleDetailClick,
  handleSelectedRows,
  handleErrorClick,
  max_length,
} = useAuthorizationTreasuryList()
</script>

<style scoped>
* {
  border: none !important;
}
.sub-receipt-table {
  border-collapse: collapse;
  width: 100%;
}
.sub-receipt-cell {
  padding-left: 2px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  height: 40px;
  vertical-align: middle;
}
</style>
