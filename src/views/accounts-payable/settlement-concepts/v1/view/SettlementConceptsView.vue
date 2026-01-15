<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <BasicDataView
            v-if="tabActive === 'information'"
            action="view"
            ref="basicDataFormRef"
            :data="settlement_concepts_form"
          />

          <section class="mx-2 mb-2">
            <div class="row justify-end">
              <Button
                label="Finalizar"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="handleView"
              />
            </div>
          </section>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataView from '@/components/Forms/AccountsPayable/SettlementConcepts/BasicDataView.vue'

// logic View
import useSettlementConceptsView from '@/views/accounts-payable/settlement-concepts/v1/view/SettlementConceptsView'

const {
  // configs
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,

  // refs
  basicDataFormRef,
  settlement_concepts_form,

  // methods
  handleView,
} = useSettlementConceptsView()
</script>









