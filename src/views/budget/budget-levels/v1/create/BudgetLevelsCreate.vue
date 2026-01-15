<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="headerProps.btn.to"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <div v-if="tabActive === 'information'">
              <BudgetLevelsForm ref="budgetLevelForm" :action="'create'" />
            </div>

            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="validateRouter('Budget', 'BudgetLevelsList', 'create')"
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
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import BudgetLevelsForm from '@/components/Forms/Budget/BudgetLevels/InformationForm.vue'
import useBudgetLevelsCreate from '@/views/budget/budget-levels/v1/create/BudgetLevelsCreate'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  budgetLevelForm,
  onSubmit,
  validateRouter,
} = useBudgetLevelsCreate()
</script>
