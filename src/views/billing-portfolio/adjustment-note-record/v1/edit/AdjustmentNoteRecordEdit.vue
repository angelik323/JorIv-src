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
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <BasicDataForm
                v-if="tabActive === 'basic-data'"
                :data="basic_data_form"
                ref="basicDataFormRef"
                action="edit"
                @update:data="basic_data_form = $event"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Actualizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
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
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/BillingPortfolio/AdjustmentNoteRecord/BasicDataForm.vue'

// Logic view
import useAdjustmentNoteRecordUpdate from '@/views/billing-portfolio/adjustment-note-record/v1/edit/AdjustmentNoteRecordEdit'

const {
  basic_data_form,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  onSubmit,
  goToURL,
} = useAdjustmentNoteRecordUpdate()
</script>
