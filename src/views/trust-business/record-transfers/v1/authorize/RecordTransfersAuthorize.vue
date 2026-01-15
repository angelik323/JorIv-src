<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handlerGoTo('RecordTransfersList')"
    >
      <!-- tabs -->
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              action="authorize"
              :data="record_tranfers_request"
            />
            <DocumentsForm
              v-if="tabActive === 'documents'"
              action="authorize"
              :data="documents_request"
            />
            <AuthorizeForm
              v-if="tabActive === 'auth'"
              ref="formAuthorize"
              action="authorize"
              :data="record_tranfers_request?.observations"
            />

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
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
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
                  @click="onSubmit(false)"
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
                  @click="onSubmit(true)"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/TrustBusiness/RecordTransfers/InformationForm/InformationForm.vue'
import DocumentsForm from '@/components/Forms/TrustBusiness/RecordTransfers/DocumentsForm/DocumentsForm.vue'
import AuthorizeForm from '@/components/Forms/TrustBusiness/RecordTransfers/AuthorizeForm/AuthorizeForm.vue'

// logic
import useRecordTransfersAuthorize from './RecordTransfersAuthorize'
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  record_tranfers_request,
  documents_request,
  formAuthorize,

  onSubmit,
  handlerGoTo,
  backTab,
  nextTab,
} = useRecordTransfersAuthorize()
</script>
