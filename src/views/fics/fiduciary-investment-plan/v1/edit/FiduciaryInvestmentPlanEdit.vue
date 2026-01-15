<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <Card>
          <template #content-card>
            <section class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="formInformation"
                :action="'edit'"
                :data="fiduciary_investment_plan_response"
              />

              <HolderForm
                v-if="tabActive === 'holder'"
                ref="formHolder"
                :action="'edit'"
                :data="fiduciary_investment_plan_response"
              />

              <ParameterForm
                v-if="tabActive === 'parameter'"
                ref="formParameter"
                :action="'edit'"
                :data="fiduciary_investment_plan_response"
              />

              <q-separator class="q-my-lg" />

              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="tabActiveIdx > 0"
                  :outline="true"
                  label="Atras"
                  :class-custom="'custom'"
                  color="orange"
                  :styleContent="{
                    'place-items': 'center',
                    'margin-left': '0.1em',
                  }"
                  @click="backTab"
                />

                <Button
                  v-if="tabActiveIdx < tabs.length - 1"
                  :outline="false"
                  label="Continuar"
                  :class-custom="'custom'"
                  color="orange"
                  :styleContent="{
                    'place-items': 'center',
                    'margin-left': '0.1em',
                  }"
                  @click="nextTab"
                />

                <Button
                  v-if="tabActiveIdx == tabs.length - 1"
                  :outline="false"
                  label="Actualizar"
                  :class-custom="'custom'"
                  color="orange"
                  :styleContent="{
                    'place-items': 'center',
                    'margin-left': '0.1em',
                  }"
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
import InformationForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/Information/InformationForm.vue'
import ParameterForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/Parameter/ParameterForm.vue'
import HolderForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/Holder/HolderForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import Card from '@/components/common/VCard/VCard.vue'

// Logic view
import useFiduciaryInvestmentPlanEdit from '@/views/fics/fiduciary-investment-plan/v1/edit/FiduciaryInvestmentPlanEdit'

const {
  tabs,
  nextTab,
  backTab,
  onSubmit,
  tabActive,
  tabActiveIdx,
  handleGoToList,
  headerProperties,
  fiduciary_investment_plan_response,
} = useFiduciaryInvestmentPlanEdit()
</script>
