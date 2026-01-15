<template>
  <div class="q-mx-lg">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('ClosureValidationsList')"
    >
      <section class="q-my-md">
        <!-- Tabs -->
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <ClosureValidationsForm
                v-if="tabActive === 'information'"
                ref="formRef"
                :action="'create'"
                :data="null"
              />
            </div>

            <!-- Botón de creación -->
            <section class="mx-3 mb-3">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  class-custom="custom"
                  :disabled="loading"
                  label="Crear"
                  size="md"
                  color="orange"
                  @click="createClosureValidation"
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
import ClosureValidationsForm from '@/components/Forms/Budget/ClosureValidations/ClosureValidationsForm.vue'

// logic view
import useClosureValidationsCreate from '@/views/budget/closure-validations/v1/create/ClosureValidationsCreate'

const {
  // props
  headerProps,
  loading,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  formRef,
  // methods
  createClosureValidation,
  goToURL,
} = useClosureValidationsCreate()
</script>
