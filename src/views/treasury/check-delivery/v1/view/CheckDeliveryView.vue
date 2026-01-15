<template>
  <div class="q-mx-xl">
    <Header
      indentation
      content-indentation
      :title="headerBreadcrumbs.title"
      :breadcrumbs="headerBreadcrumbs.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'CheckDeliveryList' })"
    />
    <TabsMenu
      :tab-active="tabActive"
      :tabs="filteredTabs"
      :tab-active-idx="tabActiveIdx"
      @update:tab-active="tabActive = $event"
    />

    <VCard>
      <template #content-card>
        <InformationBasicForm action="view" ref="informationFormRef" />

        <section class="mx-4 mb-4">
          <q-separator class="q-mb-md" />

          <div class="row justify-end q-gutter-md">
            <Button
              label="Finalizar"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="$router.push({ name: 'CheckDeliveryList' })"
            />
          </div>
        </section>
      </template>
    </VCard>
  </div>
</template>
<script lang="ts" setup>
// Components
import TabsMenu from '@/components/common/Tabs/TabsComponent.vue'
import Header from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import InformationBasicForm from '@/components/Forms/Treasury/CheckDelivery/InformationForm/InformationForm.vue'
import useCheckDeliveryView from '@/views/treasury/check-delivery/v1/view/CheckDeliveryView'
import Button from '@/components/common/Button/Button.vue'

const {
  headerBreadcrumbs,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  informationFormRef,
} = useCheckDeliveryView()
</script>
