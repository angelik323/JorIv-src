<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="handlerGoTo('IssuersCounterpartiesList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <VCard>
          <template #content-card>
            <IssuersCounterpartiesForm
              ref="informationFormRef"
              action="create"
            />
            <!-- Buttons -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Crear"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useIssuersCounterpartiesCreate from './IssuersCounterpartiesCreate'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import IssuersCounterpartiesForm from '@/components/Forms/InvestmentPortfolio/IssuersCounterparties/IssuersCounterpartiesForm.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProperties,
  tabs,
  activeTab,
  tabActiveIdx,
  informationFormRef,
  handlerGoTo,
  onSubmit,
} = useIssuersCounterpartiesCreate()
</script>
