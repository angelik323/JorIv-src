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
        <CheckBalancesControlViewForm ref="formInformation" :action="'view'" />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import CheckBalancesControlViewForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/CheckBalancesControlView/CheckBalancesControlViewForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'

// Logic view
import useCheckBalancesControlView from '@/views/fics/fiduciary-investment-plan/v1/check-balances-control/CheckBalancesControlView'

const { handleGoBack, headerProperties } = useCheckBalancesControlView()
</script>
