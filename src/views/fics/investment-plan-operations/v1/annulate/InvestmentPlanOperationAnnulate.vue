<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />
        <div v-if="tabActive === 'basic_data'">
          <AnnulateOperationForm ref="annulateForm" action="create">
            <template #submit-button>
              <div class="row justify-end q-gutter-md q-pt-lg">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Anular"
                  size="md"
                  color="orange"
                  @click="confirmAnnulation"
                />
              </div>
            </template>
          </AnnulateOperationForm>
        </div>
      </section>

      <AlertModalComponent
        ref="annulateModalRef"
        styleModal="min-width: 480px"
        :title="`¿Desea anular la operación número ${investmentPlanOperationId}?`"
        @confirm="annulateOperation"
      >
        <template #default-body>
          <q-separator class="q-mx-lg" />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import AnnulateOperationForm from '@/components/Forms/Fics/InvestmentPlanOperations/Annulate/AnnulateOperationForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useInvestmentPlanOperationAnnulate from '@/views/fics/investment-plan-operations/v1/annulate/InvestmentPlanOperationAnnulate'

const {
  tabs,
  tabActive,
  headerProps,
  tabActiveIdx,
  annulateForm,
  handleGoToList,
  annulateModalRef,
  annulateOperation,
  confirmAnnulation,
  investmentPlanOperationId,
} = useInvestmentPlanOperationAnnulate()
</script>
