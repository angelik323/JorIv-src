<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="useUtils().defaultIconsLucide.plusCircleOutline"
    >
      <section>
        <FiltersComponentV2
          ref="filter_component_ref"
          @filter="handleFilter"
          :fields="filterConfig"
          @clear-filters="handleClear"
          @update:values="filterUpdate"
        />
      </section>
      <section class="mt-8">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          @update-page="updatePage"
          @update-rows-per-page="updateRows"
          :custom-columns="[
            'select',
            'register_type',
            'nature',
            'business',
            'movement_code',
            'bank',
            'bank_account',
            'fund',
            'investment_plan',
            'amount',
            'cost_center',
            'cash_flow',
            'foreign_amount',
            'currency',
            'trm',
            'status',
          ]"
          :pages="tableProps.pages"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status?.id ?? '')" clickable />
          </template>
          <template #custom-header-action>
            <Button
              :outline="true"
              label="Descargar excel"
              @click="downloadExcel(bankTransferSelected?.id ?? 0)"
              :leftImg="excelIcon"
              :disabled="tableProps.rows.length === 0"
              tooltip="Descargar excel"
            />
          </template>
          <template #select="{ row }">
            <div class="px-1 flex justify-center">
              <q-radio
                dense
                size="sm"
                v-model="bankTransferSelected"
                :val="row"
                color="orange"
              />
            </div>
          </template>
          <template #register_type>
            <SubReceiptCell :items="['Origen', 'Destino']">
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #nature="{ row }">
            <SubReceiptCell
              :items="[
                row.origin_details?.movement?.nature,
                row.destination_details?.movement?.nature,
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #business="{ row }">
            <SubReceiptCell
              :items="[
                row.origin_details?.business_trust?.business_code
                  ? row.origin_details?.business_trust?.business_code +
                    ' - ' +
                    row.origin_details?.business_trust?.name
                  : '',
                row.destination_details?.business_trust?.business_code
                  ? row.destination_details?.business_trust?.business_code +
                    ' - ' +
                    row.destination_details?.business_trust?.name
                  : '',
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #movement_code="{ row }">
            <SubReceiptCell
              :items="[
                row.origin_details?.movement?.description,
                row.destination_details?.movement?.description,
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #bank="{ row }">
            <SubReceiptCell
              :items="[
                row.origin_details?.bank?.description,
                row.destination_details?.bank?.description,
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #bank_account="{ row }">
            <SubReceiptCell
              :items="[
                row.origin_details && row.origin_details.bank_account
                  ? `${row.origin_details.bank_account.account_number} - ${row.origin_details.bank_account.account_name}`
                  : '',
                row.destination_details && row.destination_details.bank_account
                  ? `${row.destination_details.bank_account.account_number} - ${row.destination_details.bank_account.account_name}`
                  : '',
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #fund="{ row }">
            <SubReceiptCell
              :items="[
                row.origin_details?.fund?.name,
                row.destination_details?.fund?.name,
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #investment_plan="{ row }">
            <SubReceiptCell
              :items="[
                row.origin_details?.investment_plan?.name,
                row.destination_details?.investment_plan?.name,
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #amount="{ row }">
            <SubReceiptCell
              :items="[
                useUtils().formatCurrency(row.origin_details?.value || 0),
                useUtils().formatCurrency(row.destination_details?.value || 0),
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #cost_center="{ row }">
            <SubReceiptCell
              :items="[
                row.origin_details?.cost_center?.name || 'Sin datos',
                row.destination_details?.cost_center?.name || 'Sin datos',
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #cash_flow="{ row }">
            <SubReceiptCell
              :items="[
                row.origin_details?.cash_flow?.name || 'Sin datos',
                row.destination_details?.cash_flow?.name || 'Sin datos',
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #foreign_amount="{ row }">
            <SubReceiptCell
              :items="[
                row.origin_details?.foreign_currency_value || 0,
                row.destination_details?.foreign_currency_value || 0,
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #currency="{ row }">
            <SubReceiptCell
              :items="[row.origin_details?.coin, row.destination_details?.coin]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
          <template #trm="{ row }">
            <SubReceiptCell
              :items="[
                row.origin_details?.trm
                  ? useUtils().formatCurrency(row.origin_details?.trm)
                  : 'N/A',
                row.destination_details?.trm
                  ? useUtils().formatCurrency(row.destination_details?.trm)
                  : 'N/A',
              ]"
            >
              <template #default="{ element }: { element: string }">
                {{ element }}
              </template>
            </SubReceiptCell>
          </template>
        </TableList>
      </section>
      <div
        v-if="bankTransferSelected"
        class="col q-col-gutter-x-lg q-col-gutter-y-sm"
      >
        <VCard>
          <template #content-card>
            <p class="text-weight-bold mb-2">Origen</p>
            <div
              v-for="(row, index) in originData"
              :key="index"
              class="row q-col-gutter-x-lg q-col-gutter-y-sm"
              :class="{ 'my-1': index > 0 }"
            >
              <div
                v-for="field in row"
                :key="field.label"
                class="col-12 col-md-6"
              >
                <p class="text-weight-medium mb-0 text-grey-6">
                  {{ field.label }}:
                </p>
                <p class="text-weight-medium mb-0 text-black-10 mt-1">
                  <b>{{ field.value }}</b>
                </p>
              </div>
            </div>
          </template>
        </VCard>

        <VCard>
          <template #content-card>
            <p class="text-weight-bold mb-2">Destino</p>
            <div
              v-for="(row, index) in destinyData"
              :key="index"
              class="row q-col-gutter-x-lg q-col-gutter-y-sm"
              :class="{ 'my-1': index > 0 }"
            >
              <div
                v-for="field in row"
                :key="field.label"
                class="col-12 col-md-6"
              >
                <p class="text-weight-medium mb-0 text-grey-6">
                  {{ field.label }}:
                </p>
                <p class="text-weight-medium mb-0 text-black-10 mt-1">
                  <b>{{ field.value }}</b>
                </p>
              </div>
            </div>
          </template>
        </VCard>
      </div>

      <div class="mb-2">
        <p><b>Ingresar a módulos adicionales</b></p>
        <div class="flex q-gutter-md">
          <Button
            v-if="validateRouter('Accounting', 'AccountingReceiptList', 'show')"
            :outline="true"
            label="Comprobante contable"
            size="md"
            color="orange"
            :style-text="{ color: '#333' }"
            :disabled="
              !bankTransferSelected ||
              !bankTransferSelected?.treasury_movement?.voucher_id
            "
            class="text-capitalize btn-filter custom"
            @click="
              goToURL('AccountingReceiptView', {
                id: bankTransferSelected?.treasury_movement?.voucher_id,
              })
            "
          />
          <Button
            :outline="true"
            label="Comprobante tesorería"
            size="md"
            color="orange"
            :style-text="{ color: '#333' }"
            :disabled="isTreasuryVoucherDisabled"
            class="text-capitalize btn-filter custom"
            @click="sendInformationToVoucherTreausury()"
          />
          <Button
            :outline="true"
            label="Operación monetaria"
            size="md"
            color="orange"
            :style-text="{ color: '#333' }"
            :disabled="true"
            class="text-capitalize btn-filter custom"
          />
          <Button
            :outline="true"
            label="Operación portafolio"
            size="md"
            color="orange"
            :style-text="{ color: '#333' }"
            :disabled="true"
            class="text-capitalize btn-filter custom"
          />
        </div>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useCheckBankTransfersList from './CheckBankTransfersList'
import { useUtils } from '@/composables'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import excelIcon from '@/assets/images/excel.svg'
import VCard from '@/components/common/VCard/VCard.vue'
import SubReceiptCell from '@/components/common/SubReceiptCell/SubReceiptCell.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

const {
  headerProps,
  filterConfig,
  tableProps,
  originData,
  destinyData,
  filter_component_ref,
  bankTransferSelected,
  handleFilter,
  updateRows,
  updatePage,
  handleClear,
  filterUpdate,
  downloadExcel,
  sendInformationToVoucherTreausury,
  goToURL,
  validateRouter,
  isTreasuryVoucherDisabled,
} = useCheckBankTransfersList()
</script>
