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
        />
        <VCard>
          <template #content-card>
            <div v-if="tabActive === 'information'">
              <PeriodClosureParameterForm
                ref="periodClosureParameterForm"
                :action="'create'"
              />
            </div>
            <!-- Buttons -->
            <section class="q-pb-lg q-pr-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Crear"
                  size="md"
                  color="orange"
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
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import PeriodClosureParameterForm from '@/components/Forms/Accounting/PeriodClosureParameter/Information/v2/InformationForm.vue'

import usePeriodClosureParameterCreate from '@/views/accounting/period-closure-parameter/v2/create/PeriodClosureParameterCreate'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  periodClosureParameterForm,
  onSubmit,
} = usePeriodClosureParameterCreate()
</script>
