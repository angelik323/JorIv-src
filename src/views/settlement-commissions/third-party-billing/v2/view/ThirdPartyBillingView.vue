<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('ThirdPartyBillingList')"
    >
      <section class="q-my-md">
        <TabsComponent :tabActive :tabs :tabActiveIdx />
        <VCard>
          <template #content-card>
            <div class="q-pa-xl">
              <BasicDataForm
                v-if="tabActive === 'basic_data'"
                v-model:data="data_information_form"
                ref="basicDataFormRef"
                action="view"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom q-mt-md'"
                  label="Finalizar"
                  size="md"
                  color="orange"
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
// Components
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/SettlementCommissions/ThirdPartyBilling/v2/BasicData.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'

// Logic view
import useThirdPartyBillingRead from '@/views/settlement-commissions/third-party-billing/v2/view/ThirdPartyBillingView'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  data_information_form,

  onSubmit,
  goToURL,
} = useThirdPartyBillingRead()
</script>
