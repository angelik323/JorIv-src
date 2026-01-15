<template>
  <section class="q-mx-xl">
    <ContentComponent
      v-if="validateRouter('Budget', 'BudgetLevelsList', 'create')"
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="headerProps.btn.to"
    >
      <BudgetLevelsList />
      <q-separator class="q-my-lg" />
      <BudgetMovementsList />
    </ContentComponent>
  </section>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import BudgetLevelsList from '@/components/Lists/Budget/BudgetLevels/BudgetLevelsList.vue'
import BudgetMovementsList from '@/components/Lists/Budget/BudgetMovements/BudgetMovementsList.vue'
import useBudgetLevels from '@/views/budget/budget-levels/v1/list/BudgetLevels'

const { headerProps, validateRouter } = useBudgetLevels()
</script>
