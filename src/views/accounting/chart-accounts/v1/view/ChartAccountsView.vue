<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ChartAccountsList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              :action="'view'"
              :data="chart_accounts_request"
            />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  :label="'Finalizar'"
                  :iconRight="'mdi-chevron-right'"
                  :size="'md'"
                  :unelevated="true"
                  :outline="false"
                  :color="'orange'"
                  :class="'text-capitalize btn-filter custom'"
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
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// composables
import useChartAccountsView from './ChartAccountsView'

// Forms
import InformationForm from '@/components/Forms/Accounting/ChartAccounts/information/InformationForm.vue'
const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  chart_accounts_request,
  onSubmit,
} = useChartAccountsView()
</script>
