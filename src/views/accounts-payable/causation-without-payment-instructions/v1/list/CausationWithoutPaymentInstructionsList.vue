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
          v-if="isCausationWithoutPaymentInstructionsListEmpty"
          :type="!showState ? 'empty' : 'no-results'"
        />
        <section v-else>
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            @update-page="updatePage"
            @update-rows-per-page="updateRowsPerPage"
            selection="multiple"
            v-model:selected="selected"
          >
            <template #custom-header-action>
              <Button
                no-caps
                outline
                class-custom="custom"
                label="Descargar excel"
                color="orange"
                :disabled="!tableProps.rows.length"
                :style-text="'color:black'"
                :left-img="imgButtonHeaderTable"
                @click="downloadExcel"
              />
            </template>
          </TableList>
          <div class="row q-gutter-sm justify-end q-mb-lg">
            <Button
              :disabled="confirmBtnDisabled"
              label="Confirmar"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="openAlertModal()"
            />
          </div>
        </section>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 650px"
        :showImgDefault="false"
        :title="alertModalConfig.title"
        :description_message="alertModalConfig.description_message"
        class-title="mt-0"
        :textBtnConfirm="alertModalConfig.textBtnConfirm"
        :textBtnCancel="alertModalConfig.textBtnCancel"
        @confirm="handleConfirm"
        @close="handleClose"
      >
        <template #default-body>
          <BasicDataForm
            ref="basicDataFormRef"
            :data="basic_data_form"
            :selected-business-id="selectedBusinessId"
            @update:data="basic_data_form = $event"
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
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/AccountsPayable/CausationWithoutPaymentInstructions/BasicDataForm.vue'

// Assets
import imgButtonHeaderTable from '@/assets/images/excel.svg'

//Logic
import useCausationWithoutPaymentInstructionsList from '@/views/accounts-payable/causation-without-payment-instructions/v1/list/CausationWithoutPaymentInstructionsList'

const {
  headerProps,
  filterConfig,
  tableProps,
  showState,
  isCausationWithoutPaymentInstructionsListEmpty,
  selected,
  alertModalRef,
  alertModalConfig,
  basicDataFormRef,
  basic_data_form,
  confirmBtnDisabled,
  selectedBusinessId,
  handleFilter,
  handleClearFilters,
  updatePage,
  updateRowsPerPage,
  openAlertModal,
  handleConfirm,
  handleClose,
  downloadExcel,
} = useCausationWithoutPaymentInstructionsList()
</script>
