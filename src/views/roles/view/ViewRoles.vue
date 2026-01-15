<script lang="ts" src="./ViewRoles.ts" />

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
              :form-type="'view'"
              btn-label="Finalizar"
              :btnIcon="null"
              @on-continue="handlerView()"
              @on-back="backTab"
            />
            <RestrictionsForm
              v-if="tabActive === 'restrictions'"
              :form-type="'view'"
              btn-label="Finalizar"
              @on-action="handlerView()"
              @on-back="backTab"
            />
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<style lang="scss" src="./ViewRoles.scss" scoped />
