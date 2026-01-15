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
        <div>
          <InformationForm
            ref="informationFormRef"
            :action="'undo'"
            @modal:process="(val) => (modalRef = val)"
            @update:data="basic_data_form = $event"
            @change-undo:process="changeUndoProcess = $event"
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
          :open-dialog="modalRef"
          :title="alertModalConfig.title"
          v-model="modalRef"
          style-modal="min-width: 400px; flex-direction: row;"
          :showImgDefault="false"
          @confirm="onSubmit()"
          @close="modalRef = false"
        >
          <template #default-img>
            <q-img
              src="@/assets/images/icons/alert_popup_delete.svg"
              max-width="80px"
              width="80px"
              fit="contain"
            />
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InformationForm from '@/components/Forms/Accounting/AccountingRestatement/InformationForm/v2/InformationForm.vue'

//Logic
import ExchangeDifferenceRestatementUndo from '@/views/accounting/accounting-restatement/v2/undo/ExchangeDifferenceRestatementUndo'

const {
  // header and tabs properties
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,

  //ref for change undo process
  changeUndoProcess,

  //modal config and ref
  modalRef,
  alertModalConfig,

  // form prop and reference
  basic_data_form,
  informationFormRef,

  // methods
  onSubmit,
  goToURL,
} = ExchangeDifferenceRestatementUndo()
</script>
