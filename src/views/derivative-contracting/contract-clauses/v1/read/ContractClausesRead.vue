<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('ContractClausesList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <BasicDataForm
                v-if="tabActive === 'basic_data'"
                :data="data_information_form"
                ref="basicDataFormRef"
                action="view"
                @update:data="data_information_form = $event"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom q-mt-md'"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  @click="goToList"
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
import BasicDataForm from '@/components/Forms/DerivativeContracting/ContractClauses/BasicData.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useContractClausesRead from '@/views/derivative-contracting/contract-clauses/v1/read/ContractClausesRead'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  data_information_form,
  goToURL,
  goToList,
} = useContractClausesRead()
</script>
