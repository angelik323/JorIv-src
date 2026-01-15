<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('AccountingRestatementList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />
        <div class="q-pa-lg">
          <InformationForm
            ref="informationFormRef"
            :action="'process'"
            @update:data="basic_data_form = $event"
            @modal:process="(val: boolean) => (modalRef = val)"
          />
          <section
            class="q-mt-lg"
            aria-label="Controles de navegación entre secciones"
          >
            <div class="row justify-end q-gutter-md">
              <Button
                class="custom"
                label="Finalizar"
                unelevated
                :outline="false"
                color="orange"
                @click="goToURL('AccountingRestatementList')"
              />
            </div>
          </section>
        </div>
        <AlertModalComponent
          ref="alertModalRef"
          v-model="modalRef"
          :title="alertModalConfig.title"
          :description_message="alertModalConfig.description"
          style-modal="min-width: 400px; flex-direction: row;"
          :showImgDefault="false"
          :disable-confirm="!subReceiptRef"
          @close="modalRef = false"
          @confirm="onSubmit()"
        >
          <template #default-body>
            <div class="col-12 col-md-12 q-pa-lg">
              <GenericSelectorComponent
                :default_value="subReceiptRef"
                label="Subtipo de comprobante"
                auto_complete
                map_options
                :manual_option="sub_receipt_types"
                required
                :rules="[
        (val: string) => useRules().is_required(val, 'El tipo de comprobante es requerido'),
      ]"
                @update:model-value="(val: number) => (subReceiptRef = val)"
              />
            </div>
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
//Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InformationForm from '@/components/Forms/Accounting/AccountingRestatement/InformationForm/v2/InformationForm.vue'

//Composables
import { useRules } from '@/composables'

//Logic
import ExchangeDifferenceRestatementCreate from '@/views/accounting/accounting-restatement/v2/create/ExchangeDifferenceRestatementCreate'

const {
  //Header and tabs
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,

  //Modal props and methods
  modalRef,
  alertModalConfig,
  sub_receipt_types,

  //Form data and refs
  basic_data_form,
  informationFormRef,
  subReceiptRef,
  onSubmit,

  //Navigate
  goToURL,
} = ExchangeDifferenceRestatementCreate()
</script>
