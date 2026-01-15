<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <FiltersComponentV2
        ref="filterComponentRef"
        :fields="filterConfig"
        @update:values="onChangeFilter"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
        :buttons="['more_filters']"
        @show-more="handleShowMoreFilters"
      />

      <div class="q-pt-md q-my-xl">
        <TableList
          ref="tableListRef"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          selection="single"
          @selected="handleSelected"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header>
            <div class="row q-col-gutter-sm full-width">
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10">
                <p class="full-height q-my-none text-weight-medium text-h5">
                  {{ tableProperties.title }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
                <div class="row justify-end">
                  <Button
                    class-custom="custom"
                    :outline="true"
                    label="Descargar excel"
                    color="orange"
                    :disabled="isDownloadDisabled"
                    :styleContent="{
                      'place-items': 'center',
                      color: 'black',
                    }"
                    :left-img="imgButtonHeaderTable"
                    @click="downloadExcel"
                  />
                </div>
              </div>
            </div>
          </template>
        </TableList>

        <div
          id="check-bank-account-movement-details"
          class="row q-col-gutter-md mt-2"
          v-show="rowSelectedCheckBankAccountMovement"
        >
          <div class="col-12 col-md-6">
            <VCard>
              <template #content-card>
                <section class="mx-4 mb-4">
                  <h3 class="text-h6">Saldos de la cuenta bancaria</h3>
                  <div class="row">
                    <div class="col-12 mb-3">
                      <p class="text-weight-bold mb-0">Saldo Inicial</p>
                      <p class="mb-0">
                        {{
                          useUtils().formatCurrency(
                            rowSelectedCheckBankAccountMovement?.initial_balance ??
                              0
                          ) ?? '-'
                        }}
                      </p>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                      <p class="text-weight-bold mb-0">
                        Total ingresos del periodo
                      </p>
                      <p class="mb-0">
                        {{
                          useUtils().formatCurrency(
                            rowSelectedCheckBankAccountMovement?.total_period_incomes ??
                              0
                          ) ?? '-'
                        }}
                      </p>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                      <p class="text-weight-bold mb-0">
                        Total egresos del periodo
                      </p>
                      <p class="mb-0">
                        {{
                          useUtils().formatCurrency(
                            rowSelectedCheckBankAccountMovement?.total_period_expenses ??
                              0
                          ) ?? '-'
                        }}
                      </p>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                      <p class="text-weight-bold mb-0">Saldo final</p>
                      <p class="mb-0">
                        {{
                          useUtils().formatCurrency(
                            rowSelectedCheckBankAccountMovement?.final_balance ??
                              0
                          ) ?? '-'
                        }}
                      </p>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                      <p class="text-weight-bold mb-0">Saldo contable</p>
                      <p class="mb-0">
                        {{
                          useUtils().formatCurrency(
                            rowSelectedCheckBankAccountMovement?.accounting_balance ??
                              0
                          ) ?? '-'
                        }}
                      </p>
                    </div>
                  </div>
                </section>
              </template>
            </VCard>
          </div>
          <div class="col-12 col-md-6">
            <VCard>
              <template #content-card>
                <section class="mx-4 mb-4">
                  <h3 class="text-h6">Descripción</h3>
                  <div class="row">
                    <div class="col-12 mb-3">
                      <p class="text-weight-bold mb-0">Negocio</p>
                      <p class="mb-0">
                        {{
                          rowSelectedCheckBankAccountMovement?.business_trust
                            ?.business_code
                        }}
                        -
                        {{
                          rowSelectedCheckBankAccountMovement?.business_trust
                            ?.name
                        }}
                      </p>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                      <p class="text-weight-bold mb-0">Banco</p>
                      <p class="mb-0">
                        {{
                          rowSelectedCheckBankAccountMovement?.bank?.bank_code
                        }}
                        -
                        {{
                          rowSelectedCheckBankAccountMovement?.bank?.description
                        }}
                      </p>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                      <p class="text-weight-bold mb-0">Comprobante</p>
                      <p class="mb-0">
                        {{ rowSelectedCheckBankAccountMovement?.voucher?.id }}-
                        {{ rowSelectedCheckBankAccountMovement?.voucher?.code }}
                      </p>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                      <p class="text-weight-bold mb-0">Tercero</p>
                      <p class="mb-0">
                        {{
                          rowSelectedCheckBankAccountMovement?.third_party
                            ?.document
                        }}
                        -
                        {{
                          rowSelectedCheckBankAccountMovement?.third_party?.name
                        }}
                      </p>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                      <p class="text-weight-bold mb-0">Cuenta bancaria</p>
                      <p class="mb-0">
                        {{
                          rowSelectedCheckBankAccountMovement?.bank_account
                            ?.account_number
                        }}
                        -
                        {{
                          rowSelectedCheckBankAccountMovement?.bank_account
                            ?.account_name
                        }}
                      </p>
                    </div>
                  </div>
                </section>
              </template>
            </VCard>
          </div>
          <div class="col-12">
            <h3 class="text-h5">Ingresar a módulos adicionales</h3>
            <div class="flex q-gutter-md">
              <Button
                :outline="true"
                :class-custom="'custom'"
                label="Comprobante contable"
                size="md"
                color="orange"
                style-text="color: #000000;"
                @click="
                  goToURL(
                    'AccountingReceiptView',
                    rowSelectedCheckBankAccountMovement?.voucher?.id
                  )
                "
              />
              <Button
                :outline="true"
                :class-custom="'custom'"
                label="Comprobante tesorería"
                size="md"
                color="orange"
                :disabled="isTreasuryVoucherDisabled"
                style-text="color: #000000;"
                @click="treasuryReceipt()"
              />
            </div>
          </div>
        </div>
      </div>
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useCheckBankAccountMovementList from './CheckBankAccountMovementList'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import { useGoToUrl, useUtils } from '@/composables'
const { goToURL } = useGoToUrl()

const {
  headerProperties,
  tableProperties,
  filterConfig,
  rowSelectedCheckBankAccountMovement,
  isDownloadDisabled,
  filterComponentRef,
  tableListRef,
  isTreasuryVoucherDisabled,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  onChangeFilter,
  downloadExcel,
  handleSelected,
  treasuryReceipt,
  handleShowMoreFilters,
} = useCheckBankAccountMovementList()
</script>
