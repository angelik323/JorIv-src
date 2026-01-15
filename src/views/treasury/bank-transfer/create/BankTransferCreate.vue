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
        <q-card-section v-if="tabActive === 'origin-data'">
          <FormDetail />
        </q-card-section>
        <q-card-section v-if="tabActive === 'destiny-data'">
          <FormDestiny />
        </q-card-section>
        <q-card-section v-if="tabActive === 'show-data'">
          <FormView />
        </q-card-section>
      </template>
    </VCard>
  </div>
</template>
<script lang="ts" setup>
import Header from '@/components/common/ViewContainter/ContentComponent.vue'
import useBankTransferCreate from '@/views/treasury/bank-transfer/create/BankTransferCreate'
import FormDetail from '@/components/Forms/Treasury/BankTransFer/CreateOriginForm/CreateOriginTransferForm.vue'
import FormDestiny from '@/components/Forms/Treasury/BankTransFer/CreateDestinyForm/CreateDestinyTransferForm.vue'
import FormView from '@/components/Forms/Treasury/BankTransFer/BankTransferView/TransferBankViewForm.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

const { headerBreadcrumbs, goToURL, tabActive, filteredTabs, tabActiveIdx } =
  useBankTransferCreate()
</script>
