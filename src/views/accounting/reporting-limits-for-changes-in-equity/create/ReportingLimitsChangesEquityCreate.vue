<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ReportingLimitsChangesEquityList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <div>
          <ReportingLimitsChangesInEquityForm
            ref="reportingLimitsChangesEquityForm"
            :action="'create'"
          />
        </div>
        <div class="mx-4 mb-4">
          <div class="row justify-end q-gutter-md">
            <Button
              v-if="
                filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                filteredTabs.length - 1
              "
              :outline="false"
              :class-custom="'custom'"
              label="Crear"
              size="md"
              color="orange"
              :disabled="!reportingLimitsChangesEquityForm?.hasBusinesses"
              @click="onSubmit"
            />
          </div>
        </div>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ReportingLimitsChangesInEquityForm from '@/components/Forms/Accounting/ReportingLimitsChangesInEquity/ReportingLimitsChangesInEquityForm.vue'
import useReportingLimitsForChangesInEquityCreate from './ReportingLimitsChangesEquityCreate'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  onSubmit,
  reportingLimitsChangesEquityForm,
} = useReportingLimitsForChangesInEquityCreate()
</script>
