<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BudgetMovementCodesList')"
    >
      <section>
        <TabsComponent
          :tabActive="tabActive"
          :tabs="tabs"
          :tabActiveIdx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <BasicDataMovementCodes
              ref="movementCodesBasicData"
              action="edit"
              :data="data_movement_codes_request"
            />

            <section class="q-mb-lg q-mr-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  :label="'Actualizar '"
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
import BasicDataMovementCodes from '@/components/Forms/Budget/MovementCodes/BasicDataMovementCodes/BasicDataMovementCodes.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import { useMovementCodesEdit } from '@/views/budget/movement-codes/v1/edit/BudgetMovementCodesEdit'

const {
  tabActive,
  headerProperties,
  tabs,
  tabActiveIdx,
  data_movement_codes_request,
  movementCodesBasicData,
  onSubmit,
  goToURL,
} = useMovementCodesEdit()
</script>
