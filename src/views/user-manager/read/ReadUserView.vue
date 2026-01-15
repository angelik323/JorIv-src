<script setup lang="ts">
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import UserDataDetail from '@/components/Detail/User/UserData/UserDataDetail.vue'
import PermissionsDetail from '@/components/Detail/User/Permissions/PermissionsDetail.vue'
import AdditionalInformationDetail from '@/components/Detail/User/AdditionalInformation/AdditionalInformationDetail.vue'
// Logic
import { useReadUserView } from '@/views/user-manager/read/ReadUserView'

const {
  headerProps,
  isActiveUser,
  tabActive,
  tabs,
  tabActiveIdx,
  defaultIcons,
  id,
  nextTab,
  backTab,
  goToView,
  goToViewOnNewWindow,
} = useReadUserView()
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
              background: #ffeaeb;
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
              style="color: #d20008"
              class="pl-1"
              size="xs"
            />
          </q-badge>
          <q-btn
            no-caps
            unelevated
            class="btn-header"
            label="Editar"
            :icon="defaultIcons.edit"
            text-color="white"
            size="md"
            @click="goToViewOnNewWindow('EditUserView', id)"
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
            <!-- User data -->
            <UserDataDetail v-if="tabActive === 'user_data'" />
            <!-- Permissions -->
            <PermissionsDetail v-if="tabActive === 'permissions'" />
            <!-- Additional Information -->
            <AdditionalInformationDetail
              v-if="tabActive === 'additional_information'"
            />

            <div class="q-px-md q-mt-md q-mb-lg">
              <div class="row justify-end">
                <q-btn
                  v-if="tabActive === 'permissions'"
                  no-caps
                  unelevated
                  outline
                  class="text-initial btn-custom-style col-2 q-ma-sm"
                  text-color="indigo-10"
                  size="md"
                  color="white"
                  label="Atrás"
                  :style="{ width: '150px', height: '40px' }"
                  :icon="defaultIcons.back"
                  @click="backTab()"
                />
                <q-btn
                  class="text-initial btn__history col-2 q-ma-sm"
                  type="submit"
                  size="md"
                  unelevated
                  no-caps
                  :label="
                    tabActive !== 'additional_information'
                      ? 'Continuar'
                      : 'Finalizar'
                  "
                  :style="{ width: '150px', height: '50px' }"
                  :icon-right="
                    tabActive !== 'additional_information'
                      ? defaultIcons.next
                      : undefined
                  "
                  @click="nextTab(tabActive)"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<style lang="scss" scoped src="./ReadUserView.scss" />
