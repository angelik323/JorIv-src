<script lang="ts" setup>
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue';
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue';
import DataForm from '@/components/Forms/User/Data/DataForm.vue';
import PermissionsForm from '@/components/Forms/User/Permissions/PermissionsForm.vue';
import AdditionalInformationForm from '@/components/Forms/User/AdditionalInformation/AdditionalInformationForm.vue';
import VCard from '@/components/common/VCard/VCard.vue';
// Logic:
import { useEditUserView } from '@/views/user-manager/edit/EditUserView';
import { defaultIcons } from '@/utils';

const {
    headerProps,
    isUpdateButtonDisabled,
    isActiveUser,
    tabs,
    tabActive,
    tabActiveIdx,
    goToView,
    nextTab,
    backTab,
    handleUpdateUser
} = useEditUserView()
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
          <q-badge
            v-if="isActiveUser"
            class="q-mt-md q-mr-xs"
            style="
              background: #e7ffe4;
              color: #333742;
              width: 105px !important;
              height: 28px !important;
              border-radius: 200px;
              justify-content: space-around;
              font-size: 14px;
            "
          >
            Activo
            <q-icon
              :name="defaultIcons?.checkCircle"
              style="color: #39ba2e"
              class="pl-1"
              size="xs"
            />
          </q-badge>
          <q-badge
            v-if="!isActiveUser"
            class="q-mt-md q-mr-xs"
            style="
              background: #FFEAEB;
              color: #333742;
              width: 105px !important;
              height: 28px !important;
              border-radius: 200px;
              justify-content: space-around;
              font-size: 14px;
            "
          >
            Inactivo
            <q-icon
              :name="defaultIcons?.closeCircle"
              style="color: #D20008"
              class="pl-1"
              size="xs"
            />
          </q-badge>
          <q-btn
            no-caps
            unelevated
            outline
            class="btn-header"
            label="Roles"
            text-color="indigo-10"
            size="md"
            color="white"
            @click="goToView('ListRoles')"
          />
          <q-btn
            no-caps
            unelevated
            class="btn-header"
            label="Actualizar"
            text-color="white"
            size="md"
            color="blue-action-btn"
            :disable="isUpdateButtonDisabled"
            @click="handleUpdateUser"
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
              :formType="'update'"
              @on-continue="nextTab"
            />
            <PermissionsForm
              v-if="tabActive === 'permissions'"
              :form-type="'update'"
              show-back-btn
              @on-continue="nextTab"
              @on-back="backTab"
            />
            <AdditionalInformationForm
              v-if="tabActive === 'aditional_information'"
              :form-type="'update'"
              btn-label="Actualizar"
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
<style lang="scss" scoped src="./EditUserView.scss" />
