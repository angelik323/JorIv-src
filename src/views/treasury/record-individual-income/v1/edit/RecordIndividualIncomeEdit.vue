<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'RecordIndividualIncomeList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <RecordIndividualIncomeDetailForm
              v-if="tabActive === 'information'"
              ref="detailInformationRef"
              :action="'edit'"
              :data="data_detail_view"
            />

            <section class="mx-2 mb-4">
              <div class="row justify-end">
                <Button
                  v-if="tabActiveIdx === tabs.length - 1"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import RecordIndividualIncomeDetailForm from '@/components/Forms/Treasury/RecordIndividualIncome/Detail/RecordIndividualIncomeDetailForm.vue'
import useRecordIndividualIncomeEdit from './RecordIndividualIncomeEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  detailInformationRef,
  onSubmit,
  data_detail_view,
} = useRecordIndividualIncomeEdit()
</script>
