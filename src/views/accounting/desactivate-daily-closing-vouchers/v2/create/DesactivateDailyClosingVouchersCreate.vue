<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="onFinish"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />
        <BasicDataForm
          v-if="tabActive === 'information'"
          ref="formInformationRef"
          action="create"
          @validateForm="isValidatedForm = $event"
        />
        <DesactivateDailyClosingVouchersInformProcess
          v-if="tabActive === 'inform_process'"
          :revert_vouchers_id="idDesactivateDailyClosingVouchers || 0"
        />

        <section class="mx-4 mb-4">
          <div class="row justify-end q-gutter-md">
            <Button
              v-if="tabActive === 'information'"
              label="Procesar"
              :right-icon="defaultIconsLucide.chevronRight"
              :color-icon="'white'"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom"
              :disabled="!isValidatedForm"
              @click="openReasonForm"
            />
            <Button
              v-if="tabActive === 'inform_process'"
              label="Finalizar"
              :right-icon="defaultIconsLucide.chevronRight"
              :color-icon="'white'"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="onFinish"
            />
          </div>
        </section>
      </section>
    </ContentComponent>
  </div>
  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 480px"
    title="Desactualizar cierre diario"
    description_message="Por favor digite el motivo para generar el proceso de desactualización."
    :show-img-default="false"
    @confirm="onSubmit"
  >
    <template #default-body>
      <div class="q-px-lg">
        <GenericInputComponent
          ref="reasonRef"
          label="Motivo de la desactualización"
          type="textarea"
          required
          :default_value="''"
          @update:model-value="modelReasonModal = $event"
          :rules="[(v: string) => useRules().is_required(v), val => useRules().min_length(val, 5), val => useRules().max_length(val, 250)]"
        />
      </div>
    </template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/Accounting/DesactivateDailyClosingVouchers/v2/BasicData/BasicDataForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import DesactivateDailyClosingVouchersInformProcess from '@/components/Lists/Accounting/DesactivateDailyClosingVouchers/create/DesactivateDailyClosingVouchersInformProcess.vue'

// composables
import { useRules } from '@/composables/useRules'

// logic view
import useDesactivateDailyClousingVouchersCreate from '@/views/accounting/desactivate-daily-closing-vouchers/v2/create/DesactivateDailyClosingVouchersCreate'

const {
  headerProps,
  tabActive,
  tabActiveIdx,
  tabs,
  isValidatedForm,
  modelReasonModal,
  formInformationRef,
  reasonRef,
  alertModalRef,
  idDesactivateDailyClosingVouchers,
  defaultIconsLucide,
  onSubmit,
  onFinish,
  openReasonForm,
} = useDesactivateDailyClousingVouchersCreate()
</script>
