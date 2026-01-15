<template>
  <div class="q-mx-xl">
    <Header
      indentation
      content-indentation
      :title="headerBreadcrumbs.title"
      :breadcrumbs="headerBreadcrumbs.breadcrumbs"
    >
    </Header>
    <section class="q-mt-xl">
      <FiltersV2
        @filter="handlerSearch"
        :fields="filterConfig"
        @update:values="onExpenseCheckUpdate"
        @clear-filters="handlerClear"
      />
    </section>
    <VCard v-if="tableProps.rows.length === 0">
      <template #content-card>
        <section class="q-my-xl">
          <Preloader />
        </section>
      </template>
    </VCard>
    <section class="q-mt-xl" v-else>
      <TabsMenu
        :tab-active="tabActive"
        :tabs="filteredTabs"
        :tab-active-idx="tabActiveIdx"
        @update:tab-active="tabActive = $event"
      />
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions', 'isDelivered']"
        @update-page="updatePage"
        @update-rows-per-page="updateRows"
      >
        <template #custom-header-action>
          <Button
            :right-icon="defaultIconsLucide.ArrowLeftRight"
            :label="'Confirmar entrega'"
            :size="'md'"
            :unelevated="true"
            :outline="false"
            :color="'orange'"
            @click="openAlertModal"
            :disabled="selectedsRowIds.length === 0"
          />
        </template>
        <template #isDelivered="{ row }">
          <RadioYesNo
            :is-radio-button="false"
            v-model="row.isDelivered"
            @update:model-value="(val) => onCheck(row, val)"
          />
        </template>
        <template #actions="{ row }">
          <Button
            :left-icon="defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Ver'"
            @click="
              $router.push({
                name: 'CheckDeliveryView',
                params: {
                  id: row.id,
                },
              })
            "
          />
          <Button
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Editar'"
            @click="
              $router.push({
                name: 'CheckDeliveryEdit',
                params: {
                  id: row.id,
                },
              })
            "
          />
        </template>
      </TableList>
      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 480px"
        :title="alertModalConfig.description"
        :show-img-default="false"
        @confirm="confirmDelivery"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </section>
  </div>
</template>
<script lang="ts" setup>
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Preloader from '@/components/ShowEmptyScreen/ShowEmptyScreen.vue'
import TabsMenu from '@/components/common/Tabs/TabsComponent.vue'
import Header from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useCheckDeliveryList from '@/views/treasury/check-delivery/v1/list/CheckDeliveryList'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

const {
  defaultIconsLucide,
  headerBreadcrumbs,
  alertModalConfig,
  selectedsRowIds,
  alertModalRef,
  filterConfig,
  filteredTabs,
  tabActiveIdx,
  tableProps,
  tabActive,
  onExpenseCheckUpdate,
  confirmDelivery,
  openAlertModal,
  handlerSearch,
  handlerClear,
  updatePage,
  updateRows,
  onCheck,
} = useCheckDeliveryList()
</script>
