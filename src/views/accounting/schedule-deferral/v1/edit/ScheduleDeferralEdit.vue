<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ScheduleDeferralList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <div v-if="tabActive === 'information'">
          <ScheduleDeferralForm
            v-if="scheduleDeferralData"
            ref="scheduleDeferralForm"
            :action="'edit'"
            :id="voucherDataId"
            :data="scheduleDeferralData"
            @saved="onSaved"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ScheduleDeferralForm from '@/components/Forms/Accounting/ScheduleDeferral/Information/InformationForm.vue'
import useScheduleDeferralEdit from '@/views/accounting/schedule-deferral/v1/edit/ScheduleDeferralEdit'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  scheduleDeferralForm,
  scheduleDeferralData,
  voucherDataId,
  onSaved,
} = useScheduleDeferralEdit()
</script>
