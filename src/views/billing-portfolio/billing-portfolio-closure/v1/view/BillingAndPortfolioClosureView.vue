<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'BillingAndPortfolioClosureList' })"
    >
      <section>
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <!-- Tabs content -->
        <VCard>
          <template #content-card>
            <!-- Information -->
            <InformationForm
              v-if="tabActive === 'information'"
              ref="formInformationRef"
              :action="'view'"
              :data="billing_portfolio_clouser_response"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="goToURL('BillingAndPortfolioClosureList')"
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
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import InformationForm from '@/components/Forms/BillingPortfolio/BillingAndPortfolioClousure/InformationForm.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useBillingAndPortfolioClousereView from './BillingAndPortfolioClosureView'

// Logic composable
import { useGoToUrl } from '@/composables'
const { goToURL } = useGoToUrl()
const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformationRef,
  billing_portfolio_clouser_response,
} = useBillingAndPortfolioClousereView()
</script>
