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
        <SeizuresFormMassive ref="massiveFormRef" />

        <section class="mx-2 mb-2">
          <div class="row justify-end q-gutter-md">
            <Button
              label="Crear"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="onCreateMassive"
            />
          </div>
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import SeizuresFormMassive from '@/components/Forms/Seizures/SeizuresFormMassive/SeizuresFormMassive.vue'

// Composables
import useSeizuresCreateMassive from './SeizuresCreateMassive'

const { headerProps, handleGoToList, onCreateMassive, massiveFormRef } =
  useSeizuresCreateMassive()
</script>
