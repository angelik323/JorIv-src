<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'PriceProviderFile' })"
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
              <PriceProviderFileForm
                ref="priceProviderFileForm"
                action="view"
                :data="information_receipt_request ?? undefined"
              />
            </div>
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  class-custom="custom"
                  label="Finalizar"
                  size="md"
                  @click="
                    $router.push({
                      name: 'PriceProviderFile',
                    })
                  "
                  color="orange"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import { usePriceProviderFileView } from '@/views/investment-portfolio/price-provider-file/v1/view/PriceProviderFileView'
import PriceProviderFileForm from '@/components/Forms/InvestmentPortfolio/PriceProviderFile/PriceProviderFileForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProps,
  tabs,
  activeTab,
  activeTabIdx,
  information_receipt_request,
} = usePriceProviderFileView()
</script>
