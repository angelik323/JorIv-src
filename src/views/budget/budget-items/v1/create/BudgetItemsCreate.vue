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
        <!-- Tabs -->
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <BudgetForm
                v-if="tabActive === 'information'"
                ref="budgetForm"
                :action="'create'"
              />
            </div>

            <!-- Botón de creación -->
            <section class="q-pb-lg q-pr-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  class-custom="custom"
                  label="Crear"
                  size="md"
                  color="orange"
                  @click="createBudget"
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
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import BudgetForm from '@/components/Forms/Budget/BudgetItems/BudgetItemsForm.vue'

// logic view
import useBudgetItemsCreate from '@/views/budget/budget-items/v1/create/BudgetItemsCreate'

const {
  // props
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  budgetForm,
  // methods
  createBudget,
  goToURL,
} = useBudgetItemsCreate()
</script>

<style src="./BudgetItemsCreate.scss"></style>
