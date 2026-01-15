<template>
  <div class="q-mx-xl">
    <Header
      indentation
      content-indentation
      :title="headerBreadcrumbs.title"
      :breadcrumbs="headerBreadcrumbs.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BankTransferList')"
    />

    <TabsComponent
      :tab-active="tabActive"
      :tabs="filteredTabs"
      :tab-active-idx="tabActiveIdx"
      @update:tab-active="tabActive = $event"
    />

    <VCard>
      <template #content-card>
        <q-card-section>
        </q-card-section>
      </template>
    </VCard>
  </div>
</template>
<script lang="ts" setup>
import Header from '@/components/common/ViewContainter/ContentComponent.vue'
import useBankTransferEdit from '@/views/treasury/bank-transfer/edit/BankTransferEdit'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

const { headerBreadcrumbs, goToURL, tabActive, filteredTabs, tabActiveIdx } =
  useBankTransferEdit()
</script>
