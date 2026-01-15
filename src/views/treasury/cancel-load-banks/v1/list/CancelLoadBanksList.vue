<template>
  <div class="q-mx-xl">
    <ContentComponent
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filterRef"
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="clearRows"
        />
      </section>

      <section v-if="showDetails" class="q-mt-xl">
        <CancelLoadBanksDetail
          :data="data_information_form"
          ref="informationFormRef"
          @update:data="data_information_form = $event"
        />
      </section>

      <div
        v-if="showDetails && !!data_information_form?.income_record_ids?.length"
        class="row q-mb-md q-gutter-sm justify-end"
      >
        <Button
          label="Errores"
          color="white"
          class-custom="custom"
          :outline="true"
          :flat="false"
          colorIcon="#f45100"
          text-color="orange"
          @click="logsErrors"
        />
        <Button
          label="Anular"
          color="orange"
          class-custom="custom"
          :outline="false"
          :flat="false"
          colorIcon="#fff"
          text-color="white"
          @click="onShowAlert"
        />
      </div>
    </ContentComponent>

    <AlertModalComponent
      ref="alertModalRef"
      :title="alertModalConfig.title"
      :description_message="alertModalConfig.description_message"
      :showBtnConfirm="true"
      :textBtnConfirm="'Aceptar'"
      :textBtnCancel="'Cancelar'"
      :showCloseBtn="true"
      :showImgDefault="true"
      @confirm="confirmAnular"
    />
  </div>
</template>

<script setup lang="ts">
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import CancelLoadBanksDetail from '@/components/Forms/Treasury/CancelLoadBanks/Detail/CancelLoadBanksDetail.vue'

import useCancelBankLoadsList from '@/views/treasury/cancel-load-banks/v1/list/CancelLoadBanksList'

const {
  headerProperties,
  filterConfig,
  alertModalRef,
  alertModalConfig,
  data_information_form,
  informationFormRef,
  showDetails,
  filterRef,
  handleFilter,
  onShowAlert,
  confirmAnular,
  logsErrors,
  clearRows,
} = useCancelBankLoadsList()
</script>
