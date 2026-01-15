<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToList()"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <Card>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="formInformation"
                action="authorize"
                :data="response_map"
              />
              <DocumentsForm
                v-if="tabActive === 'documents'"
                ref="formDocuments"
                action="authorize"
                :data="response_map_documents"
              />
              <AuthorizeForm
                v-if="tabActive === 'auth'"
                ref="formAuthorize"
                action="authorize"
                :data="response_map?.observations"
              />
            </div>
          </template>
        </Card>
      </section>
      <section class="mx-4 mb-4">
        <div class="row justify-end q-gutter-md">
          <Button
            v-if="
              tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
              tabs.findIndex((tab) => tab.name === tabActive) > 0
            "
            label="Atrás"
            size="md"
            unelevated
            outline
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="backTab"
          />

          <Button
            v-if="
              tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
              tabs.findIndex((tab) => tab.name === tabActive) < tabs.length - 1
            "
            label="Continuar"
            :rightIcon="defaultIconsLucide.next"
            color-icon="#fff"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="nextTab"
          />

          <Button
            v-if="
              tabs.findIndex((tab) => tab.name === tabActive) ===
              tabs.length - 1
            "
            label="Rechazar"
            size="md"
            unelevated
            :outline="false"
            color="primary_fiduciaria"
            class="text-capitalize btn-filter custom"
            @click="openAlertModal(false)"
          />

          <Button
            v-if="
              tabs.findIndex((tab) => tab.name === tabActive) ===
              tabs.length - 1
            "
            label="Autorizar"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="openAlertModal(true)"
          />
        </div>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      :title="alertModalConfig.description"
      @confirm="onSubmit(alertModalConfig.action)"
    >
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/TrustBusiness/AssignmentBuyer/InformationForm/InformationForm.vue'
import DocumentsForm from '@/components/Forms/TrustBusiness/AssignmentBuyer/Documents/DocumentsForm.vue'
import AuthorizeForm from '@/components/Forms/TrustBusiness/AssignmentBuyer/AuthorizeForm/AuthorizeForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useAssignmentBuyerAuthorize from './AssignmentBuyerAuthorize'

import { useUtils } from '@/composables'
const defaultIconsLucide = useUtils().defaultIconsLucide

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  formDocuments,
  response_map,
  response_map_documents,
  formAuthorize,
  alertModalRef,
  alertModalConfig,

  openAlertModal,
  nextTab,
  backTab,
  onSubmit,
  goToList,
} = useAssignmentBuyerAuthorize()
</script>
