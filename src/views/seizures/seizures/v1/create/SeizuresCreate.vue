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
        <VCard>
          <template #content-card>
            <SeizuresForm ref="formRef" :action="'create'" :data="formData" />

            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Crear"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                  :disable="!isLoaded"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Forms
import SeizuresForm from '@/components/Forms/Seizures/SeizuresForm/SeizuresForm.vue'

// logic view
import useSeizuresCreate from '@/views/seizures/seizures/v1/create/SeizuresCreate'

const { headerProps, formRef, formData, isLoaded, handleGoToList, onSubmit } =
  useSeizuresCreate()
</script>
