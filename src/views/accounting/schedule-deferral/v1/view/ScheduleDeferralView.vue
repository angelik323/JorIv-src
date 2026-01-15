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
      <section class="q-mt-md">
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
            :action="'view'"
            :data="scheduleDeferralData"
          />
        </div>
      </section>
      <!-- Buttons -->
      <section class="q-mb-lg">
        <div class="row justify-end q-gutter-md q-mt-none">
          <Button
            v-if="
              filteredTabs.findIndex((tab) => tab.name === tabActive) ===
              filteredTabs.length - 1
            "
            :outline="false"
            :class-custom="'custom q-mt-none'"
            label="Finalizar"
            size="md"
            color="orange"
            @click="router.push({ name: 'ScheduleDeferralList' })"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ScheduleDeferralForm from '@/components/Forms/Accounting/ScheduleDeferral/Information/InformationForm.vue'

import router from '@/router'

import useScheduleDeferralView from '@/views/accounting/schedule-deferral/v1/view/ScheduleDeferralView'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  scheduleDeferralData,
} = useScheduleDeferralView()
</script>
