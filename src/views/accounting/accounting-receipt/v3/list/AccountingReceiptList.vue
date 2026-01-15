<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'AccountingReceiptList', 'create')
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('AccountingReceiptCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filterConfig"
          :buttons="['more_filters']"
          @show-more="handleShowFilters"
          @filter="handleFilter"
          @clear-filters="clearFilters"
          @update:values="handleFieldChange"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['voided', 'status', 'result_review', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #voided="{ row }">
            <q-checkbox
              :model-value="
                row.is_annulled
                  ? true
                  : row.is_annuller
                  ? null
                  : row.is_annulled
              "
              indeterminate
              size="sm"
              color="orange"
              disabled
            />
          </template>

          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status.id ?? 1)" />
          </template>

          <template #result_review="{ row }">
            <ShowStatus
              v-if="row?.authorization_status.status !== 'Pendiente'"
              :type="
                row?.authorization_status.status === 'Automático'
                  ? 0
                  : Number(row?.authorization_status?.id ?? 1)
              "
              :statusType="
                row?.authorization_status.status === 'Automático'
                  ? 'accounting'
                  : undefined
              "
            />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter('Accounting', 'AccountingReceiptList', 'show')
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

            <!-- Editar -->
            <Button
              v-if="
                ['Errado', 'Registrado'].includes(row?.status.status) &&
                validateRouter('Accounting', 'AccountingReceiptList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('AccountingReceiptEdit', row.id)"
            />

            <!-- Anular -->
            <Button
              v-if="
                ['Actualizado'].includes(row?.status.status) &&
                (['Aprobado'].includes(row.authorization_status?.status) ||
                  ['Pendiente'].includes(row.authorization_status?.status)) &&
                !row.is_annulled &&
                validateRouter(
                  'Accounting',
                  'AccountingReceiptList',
                  'action_annul'
                )
              "
              :left-icon="defaultIconsLucide.circleOff"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :disabled="row.status.id === AccountingReceiptStatusID.ANNULED"
              tooltip="Anular"
              @click="openModal(row)"
            />
          </template>
        </TableList>
        <AlertModalComponent
          v-if="
            validateRouter(
              'Accounting',
              'AccountingReceiptList',
              'action_annul'
            )
          "
          :show-img-default="false"
          ref="alertModalRef"
          styleModal="padding: 1vw"
          :title-header="'Anular comprobante'"
          @confirm="cancelReceipt"
        >
          <template #default-body>
            <q-form ref="cancelReceiptModalRef" class="row q-mx-lg">
              <div class="col-12">
                <p class="text-weight-medium mb-0" :class="'text-grey-6'">
                  Fecha de creación del comprobante con efecto de anulación
                </p>
                <GenericDateInput
                  ref="cancelRef"
                  placeholder="DD/MM/AAAA"
                  :required="true"
                  :default_value="''"
                  :rules="[(val: string) => !!val || 'La fecha es requerida']"
                  @update:modelValue="annulateDate = $event"
                />
              </div>
            </q-form>
            <q-separator class="q-mx-lg"></q-separator>
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Interfaces
import { AccountingReceiptStatusID } from '@/interfaces/global'

// Components:
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Logic view
import useAccountingReceiptList from '@/views/accounting/accounting-receipt/v3/list/AccountingReceiptList'

const {
  // Props
  filtersRef,
  headerProps,
  tableProps,
  alertModalRef,
  cancelReceiptModalRef,
  filterConfig,
  annulateDate,
  defaultIconsLucide,
  // Methods
  handleFilter,
  clearFilters,
  handleShowFilters,
  goToURL,
  updatePage,
  updatePerPage,
  cancelReceipt,
  openModal,
  handleFieldChange,
  validateRouter,
} = useAccountingReceiptList()
</script>
