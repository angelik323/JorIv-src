<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerOpeningRecord.title"
      :breadcrumbs="headerOpeningRecord.breadcrumbs"
      :show-back-btn="headerOpeningRecord.showBackBtn"
      @on-back="goToURL('OpeningRecordList')"
    >
      <section class="q-my-md q-pl-lg">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="activeTabIdx"
          @update:tab-active="activeTab = $event"
        />
        <VCard>
          <template #content-card>
            <div v-if="activeTab === 'basic_data'">
              <OpeningRecordForm
                ref="openingRecordForm"
                action="create"
                @hasSelectedBusiness="hasSelectedBusiness = $event"
              />
            </div>
            <div v-if="activeTab === 'process_report'">
              <ProcessReportTableDownload
                v-if="processData"
                :data="processData"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  color="orange"
                  class-custom="custom"
                  label="Crear"
                  size="md"
                  v-if="!processData && hasSelectedBusiness"
                  @click="onCreate"
                />
                <Button
                  :outline="true"
                  class-custom="custom"
                  color="orange"
                  label="Atras"
                  size="md"
                  v-if="processData"
                  @click="goToURL('OpeningRecordList')"
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
import { ref } from 'vue'

import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import { useGoToUrl } from '@/composables/useGoToUrl'
import OpeningRecordForm from '@/components/Forms/Accounting/OpeningRecord/OpeningRecordForm.vue'
import useOpeningRecordCreate from './OpeningRecordCreate'
import ProcessReportTableDownload from '../download/ProcessReportTableDownload.vue'
import type { OpeningRecordFormExpose } from '@/interfaces/customs'

const { goToURL } = useGoToUrl()

const openingRecordForm = ref<OpeningRecordFormExpose | null>(null)

const {
  headerOpeningRecord,
  tabs,
  activeTab,
  activeTabIdx,
  processData,
  hasSelectedBusiness,
  onCreate,
} = useOpeningRecordCreate(openingRecordForm)
</script>

<style scoped lang="scss">
.containerForm {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px 40px;

  .formContent {
    width: 100%;
    border-radius: 15px;
    padding: 15px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
}
</style>
