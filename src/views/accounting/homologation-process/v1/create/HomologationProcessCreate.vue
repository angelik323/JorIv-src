<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'HomologationProcessList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <div v-if="tabActive === 'information'">
          <HomologationProcessForm ref="homologationProcessForm" />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import HomologationProcessForm from '@/components/Forms/Accounting/HomologationProcess/InformationForm.vue'

import useHomologationProcessCreate from '@/views/accounting/homologation-process/v1/create/HomologationProcessCreate'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  homologationProcessForm,
} = useHomologationProcessCreate()
</script>
