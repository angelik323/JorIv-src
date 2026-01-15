<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'RegisterConstitutionList' })"
    >
      <section>
        <div class="row q-mb-md items-center">
          <TabsComponent
            :tabActive="activeTab"
            :tabs="tabs"
            :tabActiveIdx="tabActiveIdx"
            @update:tab-active="activeTab = $event"
            @update:tab-active-idx="tabActiveIdx = $event"
          />
        </div>
        <VCard>
          <template #content-card>
            <InformationForm v-if="activeTab === 'InformationForm'" />
            <InformationFormForeignData
              v-else-if="activeTab === 'InformationForeignFormData'"
            />
            <InformationFormForeignCondition v-else />
            <section class="mx-4 mb-4" v-if="activeTab === 'InformationForm'">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Continuar"
                  size="md"
                  unelevated
                  :disabled="
                    !data_information_generic?.administrator_id ||
                    !data_information_generic.counterparty_id ||
                    !data_information_generic.investment_portfolio_id ||
                    !data_information_generic.issuer_id ||
                    !data_information_generic.operation_date
                  "
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="activeTab = 'InformationForeignFormData'"
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
import { useRegisterConstitutionForeignCreate } from './RegisterConstitutionForeignCreate'
import InformationForm from '@/components/Forms/InvestmentPortfolio/RegisterConstitution/information/InformationForm.vue'
import InformationFormForeignData from '@/components/Forms/InvestmentPortfolio/RegisterConstitution/information/informationForeignMoney/informationFormForeignData.vue'
import InformationFormForeignCondition from '@/components/Forms/InvestmentPortfolio/RegisterConstitution/information/informationForeignMoney/informationFormForeignCondition.vue'

const { headerProps, tabs, activeTab, tabActiveIdx, data_information_generic } =
  useRegisterConstitutionForeignCreate()
</script>
