<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('CommissionTypesList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard v-if="type_commissions_response">
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                :data="data_information_form"
                ref="informationFormRef"
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
                  :disabled="!isFormValid"
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
import InformationForm from '@/components/Forms/SettlementCommissions/TypeCommissions/v2/BasicData/BasicDataForm.vue'

// Logic view
import useTypeCommissionsEdit from '@/views/settlement-commissions/types-commission/v2/edit/TypeCommissionsEdit'

const {
  type_commissions_response,
  data_information_form,
  informationFormRef,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  isFormValid,

  onSubmit,
  goToURL,
} = useTypeCommissionsEdit()
</script>
