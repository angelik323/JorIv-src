<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import UserBasicDataDetailComponent from '@/components/Detail/User/v2/BasicDataDetail/UserBasicDataDetailComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
// Logic:
import { useReadUserView } from '@/views/user-manager/v2/read/UserRead'

const {
  headerProps,

  goToView,
} = useReadUserView()
</script>

<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :subtitle="headerProps.subtitle"
      :breadcrumbs="headerProps.breadcrumbs"
      @to="goToView"
    >
      <section class="q-my-md">
        <VCard>
          <template #content-card>
            <!-- Detail component -->
            <UserBasicDataDetailComponent />

            <!-- Submit Button -->
            <section>
              <div class="q-px-lg q-mt-lg q-mb-lg">
                <div class="row justify-end">
                  <div>
                    <q-btn
                      class="text-initial btn__history"
                      size="md"
                      unelevated
                      no-caps
                      :label="'Finalizar'"
                      :style="{ width: '150px', height: '50px' }"
                      @click="goToView('ListUserView')"
                    />
                  </div>
                </div>
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
