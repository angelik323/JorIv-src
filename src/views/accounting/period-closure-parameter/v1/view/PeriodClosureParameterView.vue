<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'PeriodClosureParameterList' })"
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
            <div v-if="tabActive === 'information'">
              <PeriodClosureParameterForm
                ref="periodClosureParameterForm"
                :action="'view'"
                :id="periodClosureParameterId"
              />
            </div>
            <!-- Buttons -->
            <section class="q-ma-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
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
// components
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import PeriodClosureParameterForm from '@/components/Forms/Accounting/PeriodClosureParameter/InformationForm.vue'

// view logic
import usePeriodClosureParameterView from '@/views/accounting/period-closure-parameter/v1/view/PeriodClosureParameterView'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  periodClosureParameterForm,
  periodClosureParameterId,
  goToList,
} = usePeriodClosureParameterView()
</script>
