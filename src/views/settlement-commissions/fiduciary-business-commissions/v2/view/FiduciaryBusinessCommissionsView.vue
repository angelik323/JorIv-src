<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BusinessTrustCommissionsList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-xl">
              <BasicData
                v-if="tabActive === 'basic-data'"
                :data="basic_data"
                ref="basicDataFormRef"
                action="view"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicData from '@/components/Forms/SettlementCommissions/FiduciaryBusinessCommissions/V2/BasicData/BasicData.vue'

// Logic view
import useFiduciaryBusinessCommissionsView from '@/views/settlement-commissions/fiduciary-business-commissions/v2/view/FiduciaryBusinessCommissionsView'

const {
  basic_data,
  basicDataFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,

  onSubmit,
  goToURL,
} = useFiduciaryBusinessCommissionsView()
</script>
