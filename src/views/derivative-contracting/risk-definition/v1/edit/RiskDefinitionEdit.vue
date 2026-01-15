<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('RiskDefinitionList')"
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
              :action="'edit'"
              :basic-data-form="basicDataForm"
              @update:basic-data-form="basicDataForm = $event"
              :risk-nature="risk_nature"
            />

            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Actualizar"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Form
import InformationForm from '@/components/Forms/DerivativeContracting/RiskDefinition/InformationForm.vue'

// Logic view
import useRiskDefinitionsEdit from '@/views/derivative-contracting/risk-definition/v1/edit/RiskDefinitionEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  informationFormRef,
  basicDataForm,
  goToURL,
  onSubmit,
  risk_nature,
} = useRiskDefinitionsEdit()
</script>
