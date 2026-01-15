<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('ClosureValidationsList')"
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
              <ClosureValidationsForm
                v-if="tabActive === 'information'"
                ref="informationFormRef"
                action="edit"
                v-model:data="information_data_form"
              />
            </div>
            <section class="q-px-xl q-pb-xl q-pt-lg">
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

<script setup lang="ts">
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import ClosureValidationsForm from '@/components/Forms/Budget/ClosureValidations/ClosureValidationsForm.vue'

// Logic view
import useClosureValidationsEdit from '@/views/budget/closure-validations/v1/edit/ClosureValidationsEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  informationFormRef,
  information_data_form,
  onSubmit,
  goToURL,
} = useClosureValidationsEdit()
</script>




