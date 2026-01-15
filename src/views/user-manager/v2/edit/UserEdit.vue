<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import UserDataFormComponent from '@/components/Forms/User/v2/UserDataForm/UserDataFormComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
// Logic:
import { useEditUserView } from '@/views/user-manager/v2/edit/UserEdit'
import { defaultIcons } from '@/utils'

const {
  headerProps,
  userFormRef,

  goToView,
  handleEditUser,
} = useEditUserView()
</script>

<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :subtitle="headerProps.subtitle"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ListUserView' })"
      @to="goToView"
    >
      <section class="q-my-md">
        <VCard>
          <template #content-card>
            <!-- Form component -->
            <UserDataFormComponent ref="userFormRef" :formType="'update'" />

            <!-- Submit Button -->
            <section>
              <div class="q-px-lg q-mt-lg q-mb-lg">
                <div class="row justify-end">
                  <div>
                    <q-btn
                      class="text-initial btn__history"
                      type="submit"
                      size="md"
                      unelevated
                      no-caps
                      :icon-right="defaultIcons.next"
                      :label="'Continuar'"
                      :style="{ width: '150px', height: '50px' }"
                      @click="handleEditUser"
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
