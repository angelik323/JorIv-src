<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
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
          <VCard class="q-pa-lg">
            <template #content-card>
              <VoucherLogs />
              <section class="q-mt-lg">
                <div class="row justify-end q-gutter-md">
                  <Button
                    v-if="
                      filteredTabs.findIndex(
                        (tab) => tab.name === tabActive
                      ) ===
                      filteredTabs.length - 1
                    "
                    :outline="false"
                    :class-custom="'custom q-mt-md'"
                    label="Finalizar"
                    size="md"
                    color="orange"
                    @click="goToURL('HomologationProcessList')"
                  />
                </div>
              </section>
            </template>
          </VCard>
        </div>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VoucherLogs from '@/components/Detail/Accounting/HomologationProcess/VoucherLogs.vue'
import Button from '@/components/common/Button/Button.vue'

import useHomologationProcessVoucherLogs from '@/views/accounting/homologation-process/v1/voucher-logs/HomologationProcessVoucherLogs'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  processId,
  goToURL,
} = useHomologationProcessVoucherLogs()
</script>
