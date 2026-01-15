<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'CheckDeliveryList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              ref="informationFormRef"
              :action="'edit'"
            />
            <section class="mx-4 mb-4">
              <q-separator class="q-mb-md" />

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
<script lang="ts" setup>
// Components
import InformationForm from '@/components/Forms/Treasury/CheckDelivery/InformationForm/InformationForm.vue'
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'

// Logic view
import useCheckDeliveryEdit from '@/views/treasury/check-delivery/v1/edit/CheckDeliveryEdit'

const {
  informationFormRef,
  tabActiveIdx,
  headerProps,
  tabActive,
  tabs,
  onSubmit,
} = useCheckDeliveryEdit()
</script>
