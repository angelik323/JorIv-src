<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="headerProps.showBackBtn"
      @on-back="goToURL('HomologationProcessList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <div v-if="tabActive === 'simple'">
          <SimpleViewForm :id="processId" />
        </div>
        <div v-if="tabActive === 'detailed'">
          <DetailedViewForm :id="processId" />
        </div>
      </section>
      <section class="mx-2 mt-2 mb-4">
        <div class="row justify-end">
          <Button
            :outline="false"
            class-custom="custom"
            color="orange"
            label="Finalizar"
            size="md"
            @click="goToURL('HomologationProcessList')"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import DetailedViewForm from '@/components/Forms/Accounting/HomologationProcess/DetailedView/DetailedViewForm.vue'
import SimpleViewForm from '@/components/Forms/Accounting/HomologationProcess/SimpleView/SimpleViewForm.vue'
import Button from '@/components/common/Button/Button.vue'
import router from '@/router'
import useHomologationProcessView from '@/views/accounting/homologation-process/v1/view/HomologationProcessView'

const { headerProps, filteredTabs, tabActive, tabActiveIdx, processId } =
  useHomologationProcessView()
const goToURL = (name: string) => router.push({ name })
</script>
