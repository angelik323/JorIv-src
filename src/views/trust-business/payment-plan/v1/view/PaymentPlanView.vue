<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handlerGoTo('PaymentPlanList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard v-if="data_payment_plan_response">
          <template #content-card>
            <div class="q-pa-xl">
              <BasicDataForm
                v-if="tabActive === 'basic_data'"
                ref="basicDataFormRef"
                v-model:data="basic_data_form"
                :dataResponse="data_payment_plan_response"
                action="view"
              />

              <section
                class="q-mt-lg"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    class="custom"
                    label="Finalizar"
                    unelevated
                    :outline="false"
                    color="orange"
                    @click="handlerGoTo('PaymentPlanList')"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/TrustBusiness/PaymentPlan/BasicDataPaymentPlan/BasicDataPaymentPlan.vue'

// Logic view
import usePaymentPlanView from '@/views/trust-business/payment-plan/v1/view/PaymentPlanView'

const {
  data_payment_plan_response,
  basic_data_form,
  basicDataFormRef,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  handlerGoTo,
} = usePaymentPlanView()
</script>
