<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BudgetAreasResponsibilityList')"
    >
      <section>
        <TabsComponent
          :tabActive="tabActive"
          :tabs="tabs"
          :tabActiveIdx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <BasicDataAreasResponsibility
              v-if="tabActive === 'BasicDataAreasResponsibility'"
              ref="areasResponsibilityBasicData"
              action="create"
              :data-area-structures="area_structures"
              :data-cost-center-structures="cost_center_structures"
            />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :label="'Crear'"
                  rightIcon="mdi-chevron-right"
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

<script lang="ts" setup>
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import BasicDataAreasResponsibility from '@/components/Forms/Budget/AreasResponsibility/BasicDataAreasResponsibility/BasicDataAreasResponsibility.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import { useAreasResponsibilityCreate } from '@/views/budget/areas-responsibility/v1/create/BudgetAreasResponsibilityCreate'

const {
  tabs,
  tabActive,
  tabActiveIdx,
  headerProperties,
  areasResponsibilityBasicData,
  area_structures,
  cost_center_structures,
  goToURL,
  onSubmit,
} = useAreasResponsibilityCreate()
</script>
