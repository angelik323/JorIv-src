<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <section class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="informationFormRef"
                :action="'create'"
              />

              <q-separator class="q-my-lg" />

              <div class="row justify-end q-gutter-md">
                <Button
                  label="Crear"
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
import InformationForm from '@/components/Forms/Fics/GroundsBlockingInvestmentPlan/information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useGroundsBlockingInvestmentPlanCreate from '@/views/fics/grounds-blocking-investment-plan/v1/create/GroundsBlockingInvestmentPlanCreate'

const {
  tabs,
  onSubmit,
  tabActive,
  headerProps,
  tabActiveIdx,
  handleGoToList,
  informationFormRef,
} = useGroundsBlockingInvestmentPlanCreate()
</script>
