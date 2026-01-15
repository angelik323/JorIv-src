<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerConfig.title"
      :breadcrumbs="headerConfig.breadcrumbs"
    >
      <section class="q-mt-md">
        <TabsComponent
          :tabs
          :tab-active="activeTab"
          :tab-active-idx="activeTabIdx"
        />

        <VCard v-if="commission">
          <template #content-card>
            <div class="q-px-xl q-py-xl">
              <InformationForm
                v-if="activeTab === 'information'"
                ref="informationFormRef"
                action="view"
                :data="commission"
              />
            </div>
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleBackToListView"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import InformationForm from '@/components/Forms/BillingPortfolio/AuthorizationFiduciaryCommissions/Information/InformationForm.vue'
import Button from '@/components/common/Button/Button.vue'

import useAuthorizationFiduciaryCommissionsView from '@/views/billing-portfolio/authorization-fiduciary-commissions/v1/view/AuthorizationFiduciaryCommissionsView'

const {
  headerConfig,
  tabs,
  activeTab,
  activeTabIdx,
  informationFormRef,
  commission,
  handleBackToListView,
} = useAuthorizationFiduciaryCommissionsView()
</script>
