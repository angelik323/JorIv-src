<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'TreasuryMovementCodesList' })"
    >
      <section>
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <VCard>
          <template #content-card>
            <div class="mx-3 mt-0 mb-3">
              <div class="row q-col-gutter-lg mt-1">
                <div class="col-xs-12 col-sm-12 col-md-3 mb-2">
                  <p class="text-weight-medium mb-0">{{ fieldCode.label }}</p>
                  <p class="text-grey-8 mb-0">
                    {{ fieldCode.value() ?? fieldCode.fallback }}
                  </p>
                </div>
              </div>
              <div
                class="row q-col-gutter-lg mt-1"
                v-for="(row, rowIdx) in fieldRows"
                :key="rowIdx"
              >
                <div
                  v-for="(field, index) in row"
                  :key="index"
                  class="col-xs-12 col-sm-12 col-md-3 mb-2"
                >
                  <p class="text-weight-medium mb-0">{{ field.label }}</p>
                  <p class="text-grey-8 mb-0">
                    <span v-if="field.yesNo">{{
                      formatYesNo(field.value())
                    }}</span>
                    <span v-else>{{ field.value() ?? field.fallback }}</span>
                  </p>
                </div>
              </div>
              <q-separator class="q-mt-sm q-mb-md" color="grey-4" />
            </div>
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="$router.push({ name: 'TreasuryMovementCodesList' })"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import { IMovementCodes } from '@/interfaces/customs/treasury/MovementCodes'
import { useTreasureMovementCodesView } from './TreasuryMovementCodesView'
withDefaults(
  defineProps<{
    data?: IMovementCodes | null
  }>(),
  {}
)
const {
  headerProps,
  tabs,
  activeTab,
  tabActiveIdx,
  formatYesNo,
  fieldCode,
  fieldRows,
} = useTreasureMovementCodesView()
</script>
