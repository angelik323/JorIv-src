<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('SeizuresList')"
    >
      <section class="q-my-md">
        <VCard>
          <template #content-card>
            <SeizuresForm
              ref="SeizuresFormRef"
              :action="'edit'"
              :data="formData"
              @update:data="Object.assign(formData, $event)"
            />

            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Actualizar"
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
import SeizuresForm from '@/components/Forms/Seizures/SeizuresForm/SeizuresForm.vue'

// logic view
import useSeizureEdit from '@/views/seizures/seizures/v1/edit/SeizuresEdit'

const { headerProps, formData, isLoaded, goToURL, onSubmit } = useSeizureEdit()
</script>
