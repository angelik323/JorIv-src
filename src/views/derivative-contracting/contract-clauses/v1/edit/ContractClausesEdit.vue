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
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <BasicDataForm
                v-if="tabActive === 'basic_data'"
                :data="data_information_form"
                ref="basicDataFormRef"
                action="edit"
                @update:data="data_information_form = $event"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Actualizar"
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
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/DerivativeContracting/ContractClauses/BasicData.vue'

// Logic view
import useContractClausesEdit from '@/views/derivative-contracting/contract-clauses/v1/edit/ContractClausesEdit'

const {
  data_information_form,
  basicDataFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  goToURL,
  onSubmit,
} = useContractClausesEdit()
</script>
