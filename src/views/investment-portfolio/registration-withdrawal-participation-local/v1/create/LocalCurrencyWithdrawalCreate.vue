<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ForeignCurrencyWithdrawalList' })"
    >
      <section class="q-my-md">
        <div ref="step1Ref"></div>
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="guardedSetActive"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <VCard>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <BasicDataForm
                v-show="tabActive === 'basic_data'"
                ref="basicDataFormRef"
                :action="'create'"
              />
              <div ref="step2Ref"></div>
              <BasicOperationForm
                v-show="tabActive === 'basicOperation'"
                ref="detailFormRef"
                :action="'create'"
              />
            </div>
            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="filteredTabs.findIndex((t) => t.name === tabActive) > 0"
                  label="Atrás"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="backTab"
                />
                <Button
                  v-if="
                    filteredTabs.findIndex((t) => t.name === tabActive) <
                    filteredTabs.length - 1
                  "
                  label="Continuar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />
                <Button
                  v-if="
                    filteredTabs.findIndex((t) => t.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  label="Crear"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/InvestmentPortfolio/RegistrationWithdrawalParticipationLocal/BasicData/BasicDataForm.vue'
import BasicOperationForm from '@/components/Forms/InvestmentPortfolio/RegistrationWithdrawalParticipationLocal/BasicOperation/BasicOperationForm.vue'
import useLocalCurrencyWithdrawalCreate from './LocalCurrencyWithdrawalCreate'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  guardedSetActive,
  backTab,
  nextTab,
  onSubmit,
  basicDataFormRef,
  detailFormRef,
  step1Ref,
  step2Ref,
} = useLocalCurrencyWithdrawalCreate()
</script>
