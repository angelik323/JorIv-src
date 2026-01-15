<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('OperationAuthorizationsList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <div class="q-px-lg q-pb-lg q-pt-lg">
              <!-- Formulario para traslados -->
              <OperationAuthorizationsTransferForm
                v-if="tabActive === 'information' && isTransfer"
                action="view"
                :data="transferData"
                :is1to1="isOneToOneTransfer"
              />

              <!-- Formulario para operaciones normales -->
              <OperationAuthorizationsForm
                v-if="tabActive === 'information' && !isTransfer"
                action="view"
                :data="operationRows"
              />
            </div>
            <section class="q-px-xl q-pb-xl q-pt-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="goToURL('OperationAuthorizationsList')"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import OperationAuthorizationsForm from '@/components/Forms/Budget/OperationAuthorizations/Standard/OperationAuthorizationsForm.vue'
import OperationAuthorizationsTransferForm from '@/components/Forms/Budget/OperationAuthorizations/Transfer/OperationAuthorizationsTransferForm.vue'

// Logic view
import useOperationAuthorizationsView from '@/views/budget/operation-authorizations/v1/view/OperationAuthorizationsView'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  operationRows,
  transferData,
  isTransfer,
  isOneToOneTransfer,
  goToURL,
} = useOperationAuthorizationsView()
</script>
