<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      :btn-label="validateRouter('Treasury', 'CollectionAccountingBlocksList', 'create') && props.controls ? 'Crear' : undefined"
      @to="goToURL('BankingEntityParametersCreate', { id: props.data })"
    >
      <section class="q-mt-md" v-if="props.controls">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="bankEntityTable.title"
          :loading="bankEntityTable.loading"
          :columns="bankEntityTable.columns"
          :rows="bankEntityTable.rows"
          :pages="bankEntityTable.pages"
          :custom-columns="['select', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePage"
        >
          <template #select="{ row }" v-if="props.controls">
            <div class="px-1 flex justify-center">
              <q-radio
                dense
                size="sm"
                v-model="bankingEntitySelected"
                :val="row.id"
                color="orange"
              />
            </div>
          </template>
          <template #actions="{ row }" v-if="props.controls">
            <Button
              v-if="
                validateRouter(
                  'Treasury',
                  'CollectionAccountingBlocksList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleEdit_BankingEntity(row.id)"
            />

            <Button
              :left-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleDelete_BankingEntity(row.id)"
            />
          </template>
        </TableList>
      </section>

      <section class="q-mt-xl row justify-end" v-if="props.controls && bankingEntitySelected">
        <Button
          class-custom="custom"
          label="Crear"
          :outline="false"
          @click="goToURL('CollectionsMethodsCreate', { idBlock: props.data, idBankEntity: bankingEntitySelected })"
        />
      </section>

      <section v-if="bankingEntitySelected">
        <TableList
          :title="collectionMethods.title"
          :loading="collectionMethods.loading"
          :columns="collectionMethods.columns"
          :rows="collectionMethods.rows"
          :pages="collectionMethods.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePage"
        >
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleEdit_CollectionMethods(row.id)"
            />

            <Button
              :left-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleDelete_CollectionMethods(row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalBankEntityRef"
        styleModal="max-width: 400px; flex-direction: row;"
        :showImgDefault="false"
        :title="alertModalBankEntityConfig.description"
        :description_message="''"
        @confirm="deleteCollectionParam()"
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

      <AlertModalComponent
        ref="alertModalCollectionMethodsRef"
        styleModal="max-width: 400px; flex-direction: row;"
        :showImgDefault="false"
        :title="alertModalCollectionMethodsConfig.description"
        :description_message="''"
        @confirm="deleteCollectionMethods()"
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
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import useCommissionList from './CommissionList'

const props = withDefaults(
  defineProps<{
    controls?: boolean,
    data: number | null
  }>(),
  {}
)

const {
  headerProps,
  defaultIconsLucide,
  filterConfig,
  bankEntityTable,
  collectionMethods,
  alertModalBankEntityRef,
  alertModalBankEntityConfig,
  alertModalCollectionMethodsRef,
  alertModalCollectionMethodsConfig,

  bankingEntitySelected,

  validateRouter,
  handleFilter,
  handleClear,
  updatePage,
  handleEdit_BankingEntity,
  handleDelete_BankingEntity,
  handleEdit_CollectionMethods,
  handleDelete_CollectionMethods,
  deleteCollectionParam,
  deleteCollectionMethods,
  goToURL,
} = useCommissionList(props)

</script>