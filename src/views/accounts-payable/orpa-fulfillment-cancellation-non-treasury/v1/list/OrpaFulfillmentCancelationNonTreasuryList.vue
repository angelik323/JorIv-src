<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
        <NoDataState
          v-if="isOrpaFulfillmentCancelationNonTreasuryListEmpty"
          :type="!showState ? 'empty' : 'no-results'"
        />
        <section v-else>
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['status']"
            @update-page="updatePage"
            @update-rows-per-page="updateRowsPerPage"
            selection="multiple"
            v-model:selected="selected"
          >
            <template #status="{ row }">
              <!-- Cambiar estado -->
              <ShowStatus
                :type="row.status ?? 0"
                status-type="accountsPayable"
              />
            </template>
          </TableList>
          <div class="row q-gutter-sm justify-end q-mb-lg">
            <Button
              :disabled="cancelBtnDisabled"
              label="Anular"
              size="md"
              unelevated
              outline
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="openAlertModal('cancel')"
            />
            <Button
              :disabled="fulfillBtnDisabled"
              label="Cumplir"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="openAlertModal('fulfill')"
            />
          </div>
        </section>
      </section>

      <AlertModalComponent
        ref="alertModalCancelRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalCancelConfig.title"
        class-title="mt-0"
        :textBtnConfirm="alertModalCancelConfig.textBtnConfirm"
        :textBtnCancel="alertModalCancelConfig.textBtnCancel"
        @confirm="handleConfirmCancelForm"
      >
        <template #default-body>
          <CancelDataForm
            ref="cancelDataFormRef"
            :data="cancel_data_form"
            @update:data="cancel_data_form = $event"
          />
        </template>
      </AlertModalComponent>

      <AlertModalComponent
        ref="alertModalFulfillRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalFulfillConfig.title"
        class-title="mt-0"
        :textBtnConfirm="alertModalFulfillConfig.textBtnConfirm"
        :textBtnCancel="alertModalFulfillConfig.textBtnCancel"
        @confirm="handleConfirmFulfillForm"
      >
        <template #default-body>
          <FulfillDataForm
            ref="fulfillDataFormRef"
            :data="fulfill_data_form"
            @update:data="fulfill_data_form = $event"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
//Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import FulfillDataForm from '@/components/Forms/AccountsPayable/OrpaFulfillmentCancelationNonTreasury/FulfillDataForm/FulfillDataForm.vue'
import Button from '@/components/common/Button/Button.vue'
import CancelDataForm from '@/components/Forms/AccountsPayable/OrpaFulfillmentCancelationNonTreasury/CancelDataForm/CancelDataForm.vue'

//Logic
import useOrpaFulfillmentCancelationNonTreasuryList from '@/views/accounts-payable/orpa-fulfillment-cancellation-non-treasury/v1/list/OrpaFulfillmentCancelationNonTreasuryList'

const {
  headerProps,
  filterConfig,
  tableProps,
  showState,
  isOrpaFulfillmentCancelationNonTreasuryListEmpty,
  selected,
  alertModalFulfillRef,
  fulfill_data_form,
  alertModalFulfillConfig,
  alertModalCancelRef,
  cancel_data_form,
  alertModalCancelConfig,
  fulfillDataFormRef,
  cancelDataFormRef,
  fulfillBtnDisabled,
  cancelBtnDisabled,
  handleFilter,
  handleClearFilters,
  updatePage,
  updateRowsPerPage,
  openAlertModal,
  handleConfirmFulfillForm,
  handleConfirmCancelForm,
} = useOrpaFulfillmentCancelationNonTreasuryList()
</script>
