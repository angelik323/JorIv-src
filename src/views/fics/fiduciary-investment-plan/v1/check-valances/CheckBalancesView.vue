<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handleGoBack"
    >
      <section class="q-my-md">
        <CheckBalancesViewForm ref="formInformation" :action="'view'" />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import CheckBalancesViewForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/CheckBalancesView/CheckBalancesViewForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'

// Logic view
import useCheckBalancesView from '@/views/fics/fiduciary-investment-plan/v1/check-valances/CheckBalancesView'

const { handleGoBack, headerProperties } = useCheckBalancesView()
</script>
