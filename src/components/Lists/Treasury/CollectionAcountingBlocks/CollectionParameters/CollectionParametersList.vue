<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="props.controls ? 'Crear' : ''"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('AccountingParametersCollectionsCreate', { id: props.data })"
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
          :title="accountingParameterCollectionTable.title"
          :loading="accountingParameterCollectionTable.loading"
          :columns="accountingParameterCollectionTable.columns"
          :rows="accountingParameterCollectionTable.rows"
          :pages="accountingParameterCollectionTable.pages"
          :custom-columns="props.controls ? ['select', 'actions'] : []"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #select="{ row }">
            <div class="px-1 flex justify-center" v-if="props.controls">
              <q-radio
                dense
                size="sm"
                v-model="collectionAccountParameterSelected"
                :val="row.id"
                color="orange"
              />
            </div>
          </template>
          <template #actions="{ row }" v-if="props.controls">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleEdit_accountingParameterCollection(row.id)"
            />

            <Button
              :left-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleDelete_accountingParameterCollection(row.id)"
            />
          </template>
        </TableList>
      </section>

      <section class="q-mt-xl row justify-end" v-if="collectionAccountParameterSelected && props.controls">
        <Button
          class-custom="custom"
          label="Crear"
          :outline="false"
          @click="goToURL('CollectionsReferenceCreate', { idBlock: props.data, idParam: collectionAccountParameterSelected })"
        />
      </section>

      <section v-if="collectionAccountParameterSelected">
        <TableList
          :title="collectionReferencesTable.title"
          :loading="collectionReferencesTable.loading"
          :columns="collectionReferencesTable.columns"
          :rows="collectionReferencesTable.rows"
          :pages="collectionReferencesTable.pages"
          :custom-columns="['actions']"
          @update-page="null"
          @update-rows-per-page="null"
        >
          <template #actions="{ row }" v-if="props.controls">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleEdit_collectionRef(row.id)"
            />

            <Button
              :left-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleDelete_collectionRef(row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalParamRef"
        styleModal="max-width: 400px; flex-direction: row;"
        :showImgDefault="false"
        :title="alertModalParamConfig.description"
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
        ref="alertModalRefCollectionRef"
        styleModal="max-width: 400px; flex-direction: row;"
        :showImgDefault="false"
        :title="alertModalRefConfig.description"
        :description_message="''"
        @confirm="deleteCollectionRef()"
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

import useAccountingParametersList from './CollectionParametersList'

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
  accountingParameterCollectionTable,
  collectionReferencesTable,
  alertModalParamRef,
  alertModalParamConfig,
  alertModalRefCollectionRef,
  alertModalRefConfig,

  collectionAccountParameterSelected,

  handleFilter,
  handleClear,
  updatePage,
  updateRowsPerPage,
  handleEdit_accountingParameterCollection,
  handleDelete_accountingParameterCollection,
  handleEdit_collectionRef,
  handleDelete_collectionRef,
  deleteCollectionParam,
  deleteCollectionRef,
  goToURL,
} = useAccountingParametersList(props)
</script>
