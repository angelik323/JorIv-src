<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('TreasuryMovementsCancelledList')"
    >
      <TabsComponent :tabActive :tabs :tabActiveIdx />
      <section class="q-my-md">
        <VCard>
          <template #content-card>
            <TreasuryMovementsCancelledForm
              action="view"
              :data="movementData"
            />
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  @click="goToURL('TreasuryMovementsCancelledList')"
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
import TreasuryMovementsCancelledForm from '@/components/Forms/Treasury/TreasuryMovementsCancelled/TreasuryMovementsCancelledForm.vue'
import Button from '@/components/common/Button/Button.vue'
import useMovementCancelledView from '@/views/treasury/treasury-movements-cancelled/view/TreasuryMovementsCancelledView'

const { headerProps, movementData, tabs, tabActiveIdx, tabActive, goToURL } =
  useMovementCancelledView()
</script>
