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
            <InformationLegalization
              v-show="tabActive === 'information'"
              :data="genericInvestmentPlan"
              ref="informationFormRef"
              action="create"
            />
          </template>
        </VCard>

        <VCard>
          <template #content-card>
            <LegalizationResourcesForm
              v-show="tabActive === 'information'"
              ref="legalizationResourceFormRef"
              action="create"
              :data="{
                genericInvestmentPlan,
                unidentifiedContributions: {
                  data: generic_investment_plan_unidentified_contributions_list,
                  loading: !isLoaded,
                  pages:
                    generic_investment_plan_unidentified_contributions_pages,
                },
              }"
            />

            <section class="mx-1 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Legalizar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleSubmitForm"
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
import InformationLegalization from '@/components/Forms/Fics/GenericInvestmentPlans/LegalizationResources/InformationLegalization/InformationLegalization.vue'
import LegalizationResourcesForm from '@/components/Forms/Fics/GenericInvestmentPlans/LegalizationResources/LegalizationResourcesForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useLegalizationResourcesCreate from '@/views/fics/generic-investment-plans/v1/create-legalization/LegalizationResourcesCreate'

const {
  isLoaded,
  tabActive,
  headerProps,
  tabs,
  tabActiveIdx,
  handleGoToList,
  handleSubmitForm,
  informationFormRef,
  genericInvestmentPlan,
  legalizationResourceFormRef,
  generic_investment_plan_unidentified_contributions_list,
  generic_investment_plan_unidentified_contributions_pages,
} = useLegalizationResourcesCreate()
</script>
