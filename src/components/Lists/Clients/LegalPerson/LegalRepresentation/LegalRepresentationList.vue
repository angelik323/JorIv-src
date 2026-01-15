<template>
  <section class="q-mx-lg q-mt-lg">
    <q-form ref="formLegalRepresentation" class="q-pa-lg">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :hidePagination="true"
        :custom-columns="['status_id', 'actions']"
      >
        <template #custom-header-action>
          <div v-if="action !== 'view'" class="row justify-end q-mb-md">
            <Button
              size="md"
              :outline="false"
              :label="
                validateRouter('Clients', 'ClientsList', ActionTypeEnum.CREATE)
                  ? 'Crear'
                  : undefined
              "
              :class-custom="'items-center'"
              :left-icon="defaultIconsLucide.plusCircle"
              color-icon="white"
              :style-content="{ 'align-items': 'center' }"
              @click="handleShowModalForm(null, true, ActionTypeEnum.CREATE)"
            />
          </div>
        </template>

        <template #status_id="{ row }">
          <ShowStatus :type="Number(row?.status_id ?? 0)" />
        </template>

        <template #actions="{ row }">
          <Button
            v-if="validateRouter('Clients', 'ClientsList', ActionTypeEnum.EDIT)"
            :left-icon="defaultIconsLucide.edit"
            color="primary"
            class-custom="custom"
            :outline="false"
            :flat="true"
            color-icon="#f45100"
            tooltip="Editar"
            @click="handleShowModalForm(row, true, ActionTypeEnum.EDIT)"
          />
          <Button
            v-if="validateRouter('Clients', 'ClientsList', ActionTypeEnum.SHOW)"
            :left-icon="defaultIconsLucide.eye"
            color="primary"
            class-custom="custom"
            :outline="false"
            :flat="true"
            color-icon="#f45100"
            tooltip="Ver"
            @click="handleShowModalForm(row, true, ActionTypeEnum.VIEW)"
          />
          <Button
            v-if="
              validateRouter('Clients', 'ClientsList', ActionTypeEnum.DELETE) ||
              row.is_new
            "
            :left-icon="defaultIconsLucide.trash"
            color="primary"
            class-custom="custom"
            :outline="false"
            :flat="true"
            color-icon="#f45100"
            tooltip="Eliminar"
            @click="openAlertModal('eliminar', row.id)"
          />
        </template>

        <template #custom-no-data>
          <div
            class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
          >
            <img
              src="@/assets/images/icons/no_data_2.svg"
              alt="No hay datos para mostrar"
              width="180px"
            />
            <p class="text-weight-bold text-h5 text-center">
              No hay datos para mostrar
            </p>
          </div>
        </template>
      </TableList>
    </q-form>

    <AlertModalComponent
      ref="alertModalDeleteRef"
      :title="alertModalConfig.title"
      @confirm="deleteAction"
    >
    </AlertModalComponent>

    <ModalComponent
      :openDialog="showModalForm"
      :minWidth="$q.screen.width <= 607 ? '100%' : '80%'"
      @update:openDialog="handleShowModalForm()"
    >
      <template #content-modal>
        <LegalRepresentationForm
          v-if="showModalForm"
          :action="actionForm"
          :legal-representation-data-form="legalRepresentationDataForm"
          @close:modal="handleShowModalForm()"
          @update:table="onUpdateTable"
        />
      </template>
    </ModalComponent>
  </section>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import LegalRepresentationForm from '@/components/Forms/Clients/v2/LegalPerson/LegalRepresentation/LegalRepresentationForm.vue'

// Interfaces
import { ActionType, ActionTypeEnum } from '@/interfaces/global'
import { IBaseLegalRepresentationItem } from '@/interfaces/customs/clients/Clients'

// Logic view
import useLegalRepresentationList from '@/components/Lists/Clients/LegalPerson/LegalRepresentation/LegalRepresentationList'

const props = withDefaults(
  defineProps<{
    action: ActionType
    legalRepresentationDataList: IBaseLegalRepresentationItem[] | null
  }>(),
  {}
)

const emit = defineEmits<{
  (
    e: 'update:legalRepresentationDataList',
    value: IBaseLegalRepresentationItem[]
  ): void
}>()

const {
  defaultIconsLucide,
  tableProps,
  showModalForm,
  alertModalDeleteRef,
  alertModalConfig,
  legalRepresentationDataForm,
  actionForm,
  formLegalRepresentation,

  validateRouter,
  handleShowModalForm,
  openAlertModal,
  onUpdateTable,
  deleteAction,
} = useLegalRepresentationList(props, emit)

defineExpose({
  validateForm: () => formLegalRepresentation.value?.validate(),
})
</script>
