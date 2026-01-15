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
                action="edit"
                :data="information_receipt_request ?? undefined"
              />
            </div>
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  color="orange"
                  class-custom="custom"
                  label="Actualizar"
                  size="md"
                  @click="
                    $router.push({
                      name: 'PriceProviderFile',
                    })
                  "
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
// Components
import PriceProviderFileForm from '@/components/Forms/InvestmentPortfolio/PriceProviderFile/PriceProviderFileForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import { usePriceProviderFileEdit } from '@/views/investment-portfolio/price-provider-file/v1/edit/PriceProviderFileEdit'
const {
  headerProps,
  tabs,
  activeTab,
  activeTabIdx,
  information_receipt_request,
} = usePriceProviderFileEdit()
</script>
