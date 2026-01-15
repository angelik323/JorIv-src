<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="handlerGoTo('BankingEntitiesList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />
        <!-- Tabs content -->
        <VCard>
          <template #content-card>
            <!-- Information -->
            <InformationForm
              v-if="activeTab === 'InformationForm'"
              ref="formInformation"
              :action="'edit'"
              :data="bank_receipt_request ?? undefined"
            />
            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  label="Actualizar "
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </VCard>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          :showImgDefault="false"
          :title="ERROR_INVALID_BANK_CODE_OR_NIT ?? undefined"
          :default_value="modelModalJustification.justification"
          @confirm="changeStatusAction"
        >
          <template #default-body>
            <q-form ref="formModalRef" class="row q-mt-md q-mx-xl">
              <div class="col-12">
                <GenericInput
                  label="Motivo para autorizar*"
                  :default_value="modelModalJustification.justification"
                  required
                  type="textarea"
                  :rules="[
                    (v: string) => !!v || 'El motivo es requerido',
                    (v: string) =>
                      /^[a-zA-Z0-9À-ÿ&` ]*$/.test(v) ||
                      'No se permiten caracteres especiales',
                    (v: string) =>
                      v.length <= 500 ||
                      'Debe contener como máximo 500 caracteres',
                  ]"
                  @update:model-value="
                    modelModalJustification.justification = $event
                  "
                />
              </div>
            </q-form>
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import useBankingEntitiesEdit from '@/views/treasury/banking-entities/v1/edit/BankingEntitiesEdit'
import InformationForm from '@/components/Forms/Treasury/BankingEntities/information/InformationForm.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

const {
  headerProperties,
  tabs,
  activeTab,
  tabActiveIdx,
  bank_receipt_request,
  modelModalJustification,
  ERROR_INVALID_BANK_CODE_OR_NIT,
  formInformation,
  alertModalRef,
  handlerGoTo,
  onSubmit,
  changeStatusAction,
} = useBankingEntitiesEdit()
</script>
