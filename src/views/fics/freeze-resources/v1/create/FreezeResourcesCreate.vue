<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <section class="q-pa-lg">
              <InformationForm action="freeze" />

              <div class="row justify-end q-gutter-md">
                <Button
                  :label="'Crear'"
                  :size="'md'"
                  :unelevated="true"
                  :outline="false"
                  :color="'orange'"
                  :disabled="
                    !data_information_form?.orderer_description ||
                    !data_information_form?.orderer_identification ||
                    !data_information_form?.observations ||
                    !data_information_form?.operations?.length ||
                    !data_information_form?.operations?.every(
                      (op) =>
                        op.freeze_type && (op.unfreeze_value || op.freeze_value)
                    )
                  "
                  :class="'text-capitalize btn-filter custom'"
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
import InformationForm from '@/components/Forms/Fics/FreezeResources/Information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useFreezeResourcesCreate from '@/views/fics/freeze-resources/v1/create/FreezeResourcesCreate'

const {
  tabs,
  onSubmit,
  tabActive,
  headerProps,
  tabActiveIdx,
  handleGoToList,
  data_information_form,
} = useFreezeResourcesCreate()
</script>
