<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="handleGoTo('AccountingReceiptCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :buttons="['more_filters']"
          @show-more="handleShowFilters"
          @filter="handleFilter"
          :fields="filterConfig"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status.id ?? 1)" />
          </template>
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'AccountingReceiptView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
            <!-- Editar -->
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'AccountingReceiptEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
            <Button
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
// Components:
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
// Utils
import { defaultIconsLucide } from '@/utils'
// Logic view
import useAccountingReceiptList from './AccountingReceiptList'
import { AccountingReceiptStatusID } from '@/interfaces/global'

const {
  // Props
  headerProps,
  tableProps,
  alertModalRef,
  cancelReceiptModalRef,
  filterConfig,
  annulateDate,
  // Methods
  handleFilter,
  handleShowFilters,
  handleGoTo,
  updatePage,
  updatePerPage,
  cancelReceipt,
  openModal,
} = useAccountingReceiptList()
</script>
