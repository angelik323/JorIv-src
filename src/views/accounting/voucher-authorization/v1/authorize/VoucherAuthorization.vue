<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          :buttons="['more_filters']"
          @filter="handleFilter"
          @show-more="handleShowFilters"
          @clear-filters="cleanPendingVouchersData"
        />
      </section>

      <section class="q-mt-xl">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-md">
          {{ tableProps.title }}
        </p>
        <VCard class="q-px-lg" style="margin-bottom: 0">
          <template #content-card>
            <TableList
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :pages="tableProps.pages"
              :hide-header="!tableProps.rows.length"
              :custom-columns="['status', 'actions']"
              :selection="
                validateRouter(
                  'Accounting',
                  'VoucherAuthorization',
                  'action_authorize'
                ) ||
                validateRouter(
                  'Accounting',
                  'VoucherAuthorization',
                  'action_reject'
                )
                  ? 'multiple'
                  : 'none'
              "
              @selected="handleSelection"
              @update-page="updatePage"
              @update-rows-per-page="updatePerPage"
            >
              <template #status="{ row }">
                <ShowStatus :type="Number(row.status.id) || 1" />
              </template>

              <template #actions="{ row }">
                <!-- Ver -->
                <Button
                  v-if="
                    validateRouter(
                      'Accounting',
                      'VoucherAuthorization',
                      'show'
                    ) && row.status.id === AccountingReceiptStatusID.REGISTERED
                  "
                  :left-icon="defaultIconsLucide.eye"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Ver"
                  @click="goToURL('AccountingReceiptView', row.id)"
                />
              </template>
            </TableList>
          </template>
        </VCard>
        <div class="row justify-end q-gutter-x-md q-mb-lg">
          <Button
            v-if="
              validateRouter(
                'Accounting',
                'VoucherAuthorization',
                'action_reject'
              )
            "
            :outline="true"
            :class-custom="'custom q-mt-lg'"
            label="Rechazar"
            size="md"
            color="orange"
            :disabled="!selectedVouchers.length"
            @click="openConfirmRejectionModal"
          />
          <Button
            v-if="
              validateRouter(
                'Accounting',
                'VoucherAuthorization',
                'action_authorize'
              )
            "
            :outline="false"
            :class-custom="'custom q-mt-lg'"
            label="Autorizar"
            size="md"
            color="orange"
            :disabled="!selectedVouchers.length"
            @click="processAuthorization('approve')"
          />
        </div>
        <AlertModalComponent
          ref="alertModalRef"
          title-header="Rechazar comprobantes"
          styleModal="min-width: 480px"
          description_message="Recuerde: Al rechazar un comprobante, debe tener asignado un Tipo de comprobante de anulación."
          :show-img-default="false"
          @confirm="processAuthorization('reject')"
        >
          <template #default-body>
            <div class="q-px-lg">
              <GenericInputComponent
                ref="purposeRef"
                label="Motivo de rechazo"
                type="textarea"
                placeholder="-"
                required
                :default_value="''"
                @update:model-value="rejectionReason = $event"
                :rules="[(v: string) => useRules().is_required(v)]"
              />
              <q-separator />
            </div>
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Logic view
import useVoucherAuthorization from '@/views/accounting/voucher-authorization/v1/authorize/VoucherAuthorization'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { AccountingReceiptStatusID } from '@/interfaces/global'

const {
  // Props
  tableProps,
  headerProps,
  filterConfig,
  alertModalRef,
  rejectionReason,
  selectedVouchers,
  filterComponentRef,
  defaultIconsLucide,
  // Methods
  goToURL,
  updatePage,
  handleFilter,
  updatePerPage,
  handleSelection,
  handleShowFilters,
  processAuthorization,
  openConfirmRejectionModal,
  cleanPendingVouchersData,
  validateRouter,
} = useVoucherAuthorization()
</script>
