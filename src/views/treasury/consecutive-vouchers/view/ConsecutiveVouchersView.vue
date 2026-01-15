<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('ConsecutiveVouchersList')"
    >
      <TabsComponent :tabActive :tabs :tabActiveIdx />
      <section class="q-my-md">
        <VCard>
          <template #content-card>
            <ConsecutiveVouchersView
              action="view"
              :data="consecutiveMovementData"
            />
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  @click="goToURL('ConsecutiveVouchersList')"
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
import ConsecutiveVouchersView from '@/components/Forms/Treasury/ConsecutiveMovements/information/ConsecutiveMovementsView.vue'
import Button from '@/components/common/Button/Button.vue'
import useConsecutiveVouchersView from '@/views/treasury/consecutive-vouchers/view/ConsecutiveVouchersView'

const {
  headerProps,
  consecutiveMovementData,
  tabs,
  tabActiveIdx,
  tabActive,
  goToURL,
} = useConsecutiveVouchersView()
</script>
