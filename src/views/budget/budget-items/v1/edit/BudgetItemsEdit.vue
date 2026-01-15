<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BudgetItemsList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-px-lg q-pb-lg q-pt-lg">
              <BudgetForm
                v-if="tabActive === 'information'"
                ref="formInformation"
                action="edit"
                :data="selected_budget_item"
              />
            </div>
            <section class="q-px-lg q-pb-lg q-pt-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  class-custom="custom"
                  label="Actualizar"
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
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BudgetForm from '@/components/Forms/Budget/BudgetItems/BudgetItemsForm.vue'

// Logic view
import useBudgetItemsEdit from '@/views/budget/budget-items/v1/edit/BudgetItemsEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  selected_budget_item,
  onSubmit,
  goToURL,
} = useBudgetItemsEdit()
</script>
