<script lang="ts" src="./EditRoles.ts" />

<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="headerProps.showBackBtn"
      @to="goToView"
      @on-back="goToView('ListRoles')"
    >
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
            <PermissionsForm
              v-if="tabActive === 'permissions'"
              :form-type="'edit'"
              btnLabel="Actualizar"
              @on-continue="handlerUpdate"
              @on-back="backTab"
            />
            <RestrictionsForm
              v-if="tabActive === 'restrictions'"
              :form-type="'edit'"
              btn-label="Actualizar"
              @on-action="handlerUpdate"
              @on-back="backTab"
            />
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<style lang="scss" src="./EditRoles.scss" scoped />
