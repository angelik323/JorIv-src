<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BankNetworkLoadList')"
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
            <div>
              <BankNetworkLoadForm
                ref="bankNetworkLoadForm"
                action="edit"
                :data="bank_network_load_form"
              />
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import BankNetworkLoadForm from '@/components/Forms/Treasury/BankNetworkLoad/BankNetworkLoadForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import { useBankNetworkLoadEdit } from '@/views/treasury/bank-network-load/v1/edit/BankNetworkLoadEdit'

const {
  headerProps,
  tabs,
  activeTab,
  activeTabIdx,
  bankNetworkLoadForm,
  goToURL,

  // refs
  bank_network_load_form,
} = useBankNetworkLoadEdit()
</script>
