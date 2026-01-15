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
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <!-- Tabs content -->
        <Card>
          <template #content-card>
            <!-- Information -->
            <InformationForm
              v-if="activeTab === 'InformationForm'"
              ref="informationFormRef"
              :action="'create'"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  label="Crear"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </Card>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          :showImgDefault="false"
          :title="ERROR_INVALID_BANK_CODE_OR_NIT ?? ''"
          :default_value="modelModalJustification.justification"
          @confirm="changeStatusAction"
        >
          <template #default-body>
            <q-form ref="formModalRef" class="row q-mt-md q-mx-xl">
              <div class="col-12">
                <GenericInput
                  label="Motivo para autorizar"
                  :default_value="modelModalJustification.justification"
                  :required="true"
                  type="textarea"
                  :rules="[
                    (v: string) => useRules().is_required(v),
                    (v: string) => useRules().no_special_characters(v),
                    (v: string) => useRules().max_length(v, 500),
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
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import InformationForm from '@/components/Forms/Treasury/BankingEntities/information/InformationForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Logic view
import useBankingEntitiesCreate from '@/views/treasury/banking-entities/v1/create/BankingEntitiesCreate'

// Composables
import { useRules } from '@/composables'
const {
  headerProperties,
  tabs,
  activeTab,
  tabActiveIdx,
  informationFormRef,
  alertModalRef,
  modelModalJustification,
  ERROR_INVALID_BANK_CODE_OR_NIT,
  formModalRef,
  changeStatusAction,
  handlerGoTo,
  onSubmit,
} = useBankingEntitiesCreate()
</script>
