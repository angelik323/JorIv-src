<script setup lang="ts">
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue';
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue';
import DataForm from '@/components/Forms/User/Data/DataForm.vue';
import PermissionsForm from '@/components/Forms/User/Permissions/PermissionsForm.vue';
import AdditionalInformationForm from '@/components/Forms/User/AdditionalInformation/AdditionalInformationForm.vue';
import VCard from '@/components/common/VCard/VCard.vue';
// Logic
import { useCreateUserView } from '@/views/user-manager/create/CreateUserView';

const {
  headerProps,
  tabs,
  tabActiveIdx,
  tabActive,
  isSaveButtonDisabled,
  goToView,
  nextTab,
  backTab,
  handleCreateUser
} = useCreateUserView()
</script>

<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="headerProps.showBackBtn"
      @to="goToView"
      @on-back="goToView('ListUserView')"
    >
      <template #addBefore>
        <div class="row q-gutter-sm">
          <q-btn
            no-caps
            unelevated
            outline
            class="btn-header"
            label="Roles"
            size="md"
            color="white"
            text-color="indigo-10"
            @click="goToView('ListRoles')"
          />
          <q-btn
            no-caps
            unelevated
            class="btn-header"
            label="Guardar"
            text-color="white"
            size="md"
            :disable="isSaveButtonDisabled"
            @click="handleCreateUser"
          />
        </div>
      </template>

      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <VCard>
          <template #content-card>
            <DataForm
              v-if="tabActive === 'user_data'"
              :formType="'create'"
              @on-continue="nextTab"
            />
            <PermissionsForm
              v-if="tabActive === 'permissions'"
              :form-type="'create'"
              show-back-btn
              @on-continue="nextTab"
              @on-back="backTab"
            />
            <AdditionalInformationForm
              v-if="tabActive === 'aditional_information'"
              :form-type="'create'"
              btn-label="Guardar"
              show-back-btn
              show-btn-without-icon
              @on-action="nextTab"
              @on-back="backTab"
            />
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<style lang="scss" src="./CreateUserView.scss" scoped />
