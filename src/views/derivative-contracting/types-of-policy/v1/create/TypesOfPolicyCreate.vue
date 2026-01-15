<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('TypesOfPolicyList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <InformationForm
              ref="informationFormRef"
              :action="'create'"
              :basic-data-form="basicDataForm"
              @update:basic-data-form="basicDataForm = $event"
              :risks="risk_definitions_list"
              :policy-stage="policy_stage"
              :risk-list="risk_list"
            />

            <section class="mx-2 mb-2">
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Form de Types of Policy
import InformationForm from '@/components/Forms/DerivativeContracting/TypesOfPolicies/InformationForm.vue'

// Logic view
import useTypeOfPolicyCreate from '@/views/derivative-contracting/types-of-policy/v1/create/TypesOfPolicyCreate'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  informationFormRef,
  basicDataForm,
  risk_definitions_list,
  policy_stage,
  risk_list,

  goToURL,
  onSubmit,
} = useTypeOfPolicyCreate()
</script>
