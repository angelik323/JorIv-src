<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      btn-label="Crear fondo"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleGoToCreate"
    >
      <NoDataState v-if="tableProperties.rows.length === 0" type="empty" />

      <VCard v-else class="q-pt-md q-my-xl">
        <template #content-card>
          <div class="q-px-md">
            <TableList
              :loading="tableProperties.loading"
              :rows="tableProperties.rows"
              :columns="tableProperties.columns"
              :pages="tableProperties.pages"
              :custom-columns="customColumns"
              @update-page="handleUpdatePage"
              @update-rows-per-page="handleUpdateRowsPerPage"
            >
              <template #radio_button="{ row }">
                <RadioYesNo
                  v-model="selectedRow"
                  :options="[{ label: '', value: row.id }]"
                  @update:model-value="(val) => onSelectionChange(val)"
                />
              </template>

              <template #actions="{ row }">
                <Button
                  left-icon="Eye"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  :tooltip="'Ver'"
                  @click="handleOptions('view', row.id)"
                />
                <Button
                  left-icon="Pencil"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  :tooltip="'Editar'"
                  @click="handleOptions('edit', row.id)"
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>

      <div
        v-if="selectedFundId"
        class="row items-center justify-between q-mb-md q-mt-xl"
      >
        <span class="text-h6 text-weight-bold">Fondos compartimentos</span>
        <Button
          no-caps
          unelevated
          label="Agregar"
          :left-icon="defaultIconsLucide.plusCircleOutline"
          color-icon="white"
          text-color="white"
          :outline="false"
          color="primary"
          @click="openModalAssign = true"
        />
      </div>

      <VCard class="q-pt-sm q-my-xl">
        <template #content-card>
          <div
            v-if="!selectedFundId"
            class="flex column justify-center items-center q-py-xl"
          >
            <img
              src="@/assets/images/icons/no_data.svg"
              alt="No hay datos"
              class="q-mb-lg"
            />
            <p class="text-weight-bold text-h6 text-center">
              Seleccione un fondo consolidador
            </p>
            <p class="text-weight-light text-h6 text-center">
              Aquí visualizará los compartimentos del fondo seleccionado
            </p>
          </div>

          <div
            v-else-if="tablePropertiesBehavior.rows.length === 0"
            class="flex column justify-center items-center q-py-xl"
          >
            <img
              src="@/assets/images/icons/no_data_accounting.svg"
              alt="No hay datos para mostrar"
              class="q-mb-lg"
            />
            <p class="text-weight-bold text-h6 text-center">
              Actualmente no hay compartimentos en el fondo seleccionado
            </p>
            <p class="text-weight-light text-h6 text-center">
              Por favor, agregue uno para continuar con el proceso
            </p>
          </div>

          <div v-else class="q-px-md">
            <TableList
              :loading="tablePropertiesBehavior.loading"
              :rows="tablePropertiesBehavior.rows"
              :columns="tablePropertiesBehavior.columns"
              :pages="tablePropertiesBehavior.pages"
              :custom-columns="customColumns"
              @update-page="handleUpdatePage($event, 'detail')"
              @update-rows-per-page="handleUpdateRowsPerPage($event, 'detail')"
            >
              <template #actions="{ row }">
                <Button
                  :left-icon="defaultIconsLucide.trash"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Eliminar"
                  @click="deleteRowValidation(row.compartment_id)"
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>

      <CustomModal
        v-model:openDialog="openModal"
        :defaultHeader="false"
        :closable="true"
        customStyle="min-width: 300px; max-width: 400px;"
      >
        <template #content-modal>
          <div style="max-height: 70vh; overflow-y: auto">
            <InformationForm ref="informationFormRef" :action="'create'" />
          </div>

          <div class="row justify-end q-gutter-md q-mt-md q-px-md q-mb-md">
            <Button
              label="Cancelar"
              color="orange"
              class="text-capitalize btn-filter custom"
              outline
              @click="openModal = false"
            />
            <Button
              :outline="false"
              label="Crear"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="handleCreate"
            />
          </div>
        </template>
      </CustomModal>

      <CustomModal
        v-model:openDialog="openModalAssign"
        :defaultHeader="false"
        :closable="true"
        customStyle="min-width: 300px; max-width: 400px;"
      >
        <template #content-modal>
          <div style="max-height: 70vh; overflow-y: auto">
            <InformationFormAssign
              ref="informationFormRefAssign"
              :action="'create'"
            />
          </div>

          <div class="row justify-end q-gutter-md q-mt-md q-px-md q-mb-md">
            <Button
              label="Cancelar"
              color="orange"
              class="text-capitalize btn-filter custom"
              outline
              @click="openModalAssign = false"
            />
            <Button
              :outline="false"
              label="Agregar"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="handleAssign"
            />
          </div>
        </template>
      </CustomModal>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="handleDelete()"
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
// Components
import InformationFormAssign from '@/components/Forms/Fics/ConsolidatedInvestmentAssign/information/InformationForm.vue'
import InformationForm from '@/components/Forms/Fics/ConsolidatedInvestment/information/InformationForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import CustomModal from '@/components/common/Modal/ModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useConsolidatedInvestmentList from '@/views/fics/consolidated-investment/list/ConsolidatedInvestmentList'

const {
  openModal,
  selectedRow,
  handleCreate,
  handleAssign,
  handleDelete,
  handleOptions,
  customColumns,
  alertModalRef,
  selectedFundId,
  openModalAssign,
  tableProperties,
  handleUpdatePage,
  headerProperties,
  alertModalConfig,
  handleGoToCreate,
  onSelectionChange,
  informationFormRef,
  defaultIconsLucide,
  deleteRowValidation,
  handleUpdateRowsPerPage,
  tablePropertiesBehavior,
  informationFormRefAssign,
} = useConsolidatedInvestmentList()
</script>
