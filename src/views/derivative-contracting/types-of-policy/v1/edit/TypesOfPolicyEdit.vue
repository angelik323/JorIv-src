<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('TypesOfPolicyList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <Card>
          <template #content-card>
            <InformationForm
              ref="informationFormRef"
              :action="'edit'"
              :basic-data-form="basicDataForm"
              @update:basic-data-form="basicDataForm = $event"
              :risks="risk_definitions_list"
              :policy-stage="policy_stage"
              :risk-list="risk_list"
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
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Form
import InformationForm from '@/components/Forms/DerivativeContracting/TypesOfPolicies/InformationForm.vue'

// Logic
import useTypeOfPolicyEdit from '@/views/derivative-contracting/types-of-policy/v1/edit/TypesOfPolicyEdit'

const {
  headerProperties,
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
} = useTypeOfPolicyEdit()
</script>
