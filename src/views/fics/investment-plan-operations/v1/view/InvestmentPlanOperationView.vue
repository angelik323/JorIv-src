<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoTo"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <ViewOperationForm
          v-show="tabActive === 'basic_data'"
          ref="viewOperationFormRef"
          :data="initialData"
        >
          <template #buttons>
            <div class="row justify-end q-gutter-md q-pt-sm">
              <Button
                :outline="false"
                :class-custom="'custom'"
                :rightIcon="defaultIconsLucide.chevronRight"
                label="Contabilidad"
                size="md"
                color="orange"
                color-icon="white"
                @click="handleGoTo('con')"
              />

              <Button
                :outline="false"
                :class-custom="'custom'"
                :rightIcon="defaultIconsLucide.chevronRight"
                label="Movimientos"
                size="md"
                color="orange"
                color-icon="white"
                @click="handleGoTo('mov')"
              />

              <Button
                :outline="false"
                :class-custom="'custom'"
                :rightIcon="defaultIconsLucide.chevronRight"
                label="Tesorería"
                size="md"
                color="orange"
                color-icon="white"
                @click="handleGoTo('tes')"
              />
            </div>
          </template>
        </ViewOperationForm>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ViewOperationForm from '@/components/Forms/Fics/InvestmentPlanOperations/View/ViewOperationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'

// Import
import useInvestmentPlanOperationView from '@/views/fics/investment-plan-operations/v1/view/InvestmentPlanOperationView'

const {
  tabs,
  tabActive,
  handleGoTo,
  headerProps,
  initialData,
  tabActiveIdx,
  defaultIconsLucide,
  viewOperationFormRef,
} = useInvestmentPlanOperationView()
</script>
