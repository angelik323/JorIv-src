<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('InvoicesCommissionNotesList')"
    >
      <section>
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <BasicDataForm
                v-if="tabActive === 'basic-data'"
                ref="formInformationRef"
                action="view"
                :data="basic_data_form"
              />
            </div>
          </template>
        </VCard>
        <section class="mx-2 mb-4">
          <div class="row justify-end">
            <Button
              :outline="false"
              class-custom="custom"
              color="orange"
              label="Finalizar"
              size="md"
              @click="goToURL('InvoicesCommissionNotesList')"
            />
          </div>
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import BasicDataForm from '@/components/Forms/BillingPortfolio/AdjustmentNoteRecord/BasicDataForm.vue'

import useAdjustmentNoteRecordListView from '@/views/billing-portfolio/adjustment-note-record/v1/view/AdjustmentNoteRecordView'

const {
  headerProps,
  tabs,
  basic_data_form,
  tabActive,
  tabActiveIdx,
  formInformationRef,
  goToURL,
} = useAdjustmentNoteRecordListView()
</script>
