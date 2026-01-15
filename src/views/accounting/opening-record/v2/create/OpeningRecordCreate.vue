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
                @processCompleted="handleProcessCompleted"
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
// Vue
import { ref } from 'vue'

// Components
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import OpeningRecordForm from '@/components/Forms/Accounting/OpeningRecord/Information/OpeningRecordForm.vue'
import ProcessReportTableDownload from '../download/ProcessReportTableDownload.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Local composable
import useOpeningRecordCreate from '@/views/accounting/opening-record/v2/create/OpeningRecordCreate'

// Interfaces
import type { OpeningRecordFormExpose } from '@/interfaces/customs'

const openingRecordForm = ref<OpeningRecordFormExpose | null>(null)
const {
  goToURL,
  headerOpeningRecord,
  tabs,
  activeTab,
  activeTabIdx,
  processData,
  hasSelectedBusiness,
  handleProcessCompleted,
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
