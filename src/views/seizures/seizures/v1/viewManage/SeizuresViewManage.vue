<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoBack"
    >
      <section class="q-my-md">
        <VCard>
          <template #content-card>
            <SeizuresFormManage
              ref="formRef"
              :key="managementData?.id"
              action="view"
              :management-type="managementType"
              :data="managementData"
            />

            <section class="mx-2 mb-2">
              <div class="row justify-end">
                <Button
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleGoBack"
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
import SeizuresFormManage from '@/components/Forms/Seizures/SeizuresFormManage/SeizuresFormManage.vue'

// logic view
import useSeizuresViewManage from '@/views/seizures/seizures/v1/viewManage/SeizuresViewManage'

const { headerProps, managementType, managementData, handleGoBack } =
  useSeizuresViewManage()
</script>
