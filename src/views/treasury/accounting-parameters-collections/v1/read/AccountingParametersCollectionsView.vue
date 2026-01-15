<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handlerGoTo('CollectionAccountingBlocksList')"
    >
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
        />
      </section>

      <section class="q-mt-lg">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card v-if="collectionAccountingBlockSelected">
            <section v-if="tabActive === 'acounting-collection-param'">
              <CollectionParametersList :controls="false" v-model:data="collectionAccountingBlockSelected"/>
            </section>

            <section v-if="tabActive === 'commission'">
              <CommissionList :controls="false" v-model:data="collectionAccountingBlockSelected"/>
            </section>

            <section v-if="tabActive === 'commission-param'">
              <CommissionParametersList :controls="false" v-model:data="collectionAccountingBlockSelected"/>
            </section>
          </template>
        </VCard>

        <div class="row justify-end q-gutter-md mb-5">
          <Button
            :outline="false"
            label="Finalizar"
            size="md"
            unelevated
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="
              $router.push({ name: 'CollectionAccountingBlocksList' })
            "
          />
        </div>
      </section>
      
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

import CollectionParametersList from '@/components/Lists/Treasury/CollectionAcountingBlocks/CollectionParameters/CollectionParametersList.vue'
import CommissionList from '@/components/Lists/Treasury/CollectionAcountingBlocks/Commission/CommissionList.vue'
import CommissionParametersList from '@/components/Lists/Treasury/CollectionAcountingBlocks/CommissionParameters/CommissionParametersList.vue'

import useAccountingParametersCollectionsView from './AccountingParametersCollectionsView'

const {
  filteredTabs,
  tabActive,
  tabActiveIdx,
  headerProperties,
  tableProps,
  collectionAccountingBlockSelected,

  handlerGoTo,
} = useAccountingParametersCollectionsView()
</script>
