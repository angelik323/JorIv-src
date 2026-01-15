<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section>
        <TabsComponent
          :tabs="tabs"
          :tabActive="activeTab"
          :tabActiveIdx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <template v-if="activeTab === 'Tipos de fondos'">
          <section class="q-mt-md">
            <h2 class="text-h6 q-mb-md"><b>Tipos de fondo</b></h2>
            <p>
              Estas líneas de inversión serán la base de los tipos de
              participación y estarán asociadas al plan de inversión para
              permitir realizar estas configuraciones que serán utilizadas para
              transmitir información
            </p>
          </section>

          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['status', 'actions']"
          />
        </template>

        <template v-else-if="activeTab === 'Tipos de operación'">
          <section class="q-mt-md">
            <h2 class="text-h6 q-mb-md"><b>Tipos de operaciones</b></h2>
            <p>
              Estas lineas de inversión serán la base de los tipos de
              participacion y estarán asociadas al plan de inversión para
              permitir realizar estas configuraciones que serán utilizadas para
              transmitir información
            </p>
          </section>

          <TableList
            :loading="tableTypesProps.loading"
            :columns="tableTypesProps.columns"
            :rows="tableTypesProps.rows"
            :pages="tableTypesProps.pages"
            :custom-columns="['status', 'actions']"
          />
        </template>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logics view
import { useCollectiveInvestmentFundList } from '@/views/fics/funds-types-operation/v1/list/CollectiveInvestmentFundList'

const {
  tabs,
  activeTab,
  tableProps,
  headerProps,
  tabActiveIdx,
  tableTypesProps,
} = useCollectiveInvestmentFundList()
</script>
