<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'BusinessTrustCommissionsList' })"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard v-if="fiduciary_business_commissions_response">
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <BasicData
                v-if="tabActive === 'basic-data'"
                :data="basic_data_form"
                ref="basicDataFormRef"
                action="edit"
                @update:data="basic_data_form = $event"
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

            <div class="q-px-xl q-pb-xl q-pt-lg">
              <Descriptions
                :data="basic_data_form"
                ref="descriptionsFormRef"
                action="edit"
                :id="fiduciary_business_commissions_response.id"
                @update:data="updateDescriptions"
              />
            </div>
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
import BasicData from '@/components/Forms/SettlementCommissions/FiduciaryBusinessCommissions/BasicData/BasicData.vue'
import Descriptions from '@/components/Forms/SettlementCommissions/FiduciaryBusinessCommissions/Descriptions/Descriptions.vue'

// Logic view
import useFiduciaryBusinessCommissionsEdit from '@/views/settlement-commissions/fiduciary-business-commissions/v1/edit/FiduciaryBusinessCommissionsEdit'

const {
  fiduciary_business_commissions_response,
  basic_data_form,
  basicDataFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  descriptionsFormRef,

  updateDescriptions,
  onSubmit,
} = useFiduciaryBusinessCommissionsEdit()
</script>
