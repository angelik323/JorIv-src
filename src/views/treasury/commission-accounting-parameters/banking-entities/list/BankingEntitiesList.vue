<template>
  <div class="q-mx-xl">
    <q-expansion-item
      class="q-mb-md expansion-item-fp"
      expand-icon-class="text-black expansion-icon"
    >
      <template v-slot:header>
        <q-item-section>
          <div class="column">
            <span class="text-h6 text-weight-bold"> Entidades bancarias </span>
            <span class="text-subtitle1 text-grey-14">
              Haz click sobre Entidades bancarias para desplegar la tabla
            </span>
          </div>
        </q-item-section>
        <q-item-section side>
          <div class="flex justify-between">
            <Button
              v-if="validateRouter('Treasury', 'CollectionAccountingBlocksList', 'create')"
              :left-icon="defaultIconsLucide.plusCircleOutline"
              :outline="false"
              color="white"
              color-icon="white"
              label="Crear"
              :tooltip="
                !props.selectID || tableProps.rows.length > 0
                  ? 'Selecciona un grupo que no tenga entidades bancarias'
                  : 'Crear nueva entidad bancaria'
              "
              :stop-propagation="true"
              @click="
                handlerGoTo(
                  'BankingEntitiesAccountingParametersCommissionsCreate'
                )
              "
              :disabled="!props.selectID || tableProps.rows.length > 0"
              class="q-mr-sm"
            />
          </div>
        </q-item-section>
      </template>

      <TableList
        :loading="tableProps.loading"
        :rows="tableProps.rows"
        :custom-columns="['actions']"
        :columns="tableProps.columns"
        :pages="tableProps.pages"
      >
        <template #actions="{ row }">
          <Button
            v-if="validateRouter('Treasury', 'CollectionAccountingBlocksList', 'edit')"
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Editar"
            @click="handleEdit(row.id)"
          />
          <Button
            v-if="validateRouter('Treasury', 'CollectionAccountingBlocksList', 'delete')"
            :left-icon="defaultIconsLucide.delete"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="handleDelete(row.id)"
          />
        </template>
      </TableList>
    </q-expansion-item>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="max-width: 400px; flex-direction: row;"
      :showImgDefault="false"
      :title="alertModalConfig.description"
      :description_message="''"
      @confirm="changeStatus()"
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
  </div>
</template>
<script setup lang="ts">
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import { defaultIconsLucide } from '@/utils'
import useBankingEntitiesList from '@/views/treasury/commission-accounting-parameters/banking-entities/list/BankingEntitiesList'
const props = defineProps<{
  selectID?: number
}>()
const {
  tableProps,
  alertModalConfig,
  alertModalRef,
  handlerGoTo,
  handleEdit,
  handleDelete,
  changeStatus,
  validateRouter
} = useBankingEntitiesList(props)
</script>
