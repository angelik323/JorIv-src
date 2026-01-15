<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="headerProps.showBackBtn"
      @on-back="goToURL('HomologationProcessView', processId)"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <div v-if="tabActive === 'basic'">
          <VCard>
            <template #content-card>
              <AccountingReceiptForm
                ref="accountingReceiptForm"
                :action="'view'"
                :id="voucherId"
              />
            </template>
          </VCard>
        </div>
      </section>
      <section class="mx-2 mt-2 mb-4">
        <div class="row justify-end">
          <Button
            :outline="false"
            class-custom="custom"
            color="orange"
            label="Finalizar"
            size="md"
            @click="goToURL('HomologationProcessList')"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AccountingReceiptForm from '@/components/Forms/Accounting/AccountingReceipt/Information/v2/InformationForm.vue'
import Button from '@/components/common/Button/Button.vue'
import useHomologationProcessViewVoucher from '@/views/accounting/homologation-process/v1/view-voucher/HomologationProcessViewVoucher'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  voucherId,
  processId,
  goToURL,
} = useHomologationProcessViewVoucher()
</script>
