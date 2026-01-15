<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
    </ContentComponent>
    <section class="q-my-md">
      <Card>
        <template #content-card>
          <RecordIndividualExpensesFilterData
            ref="formInformation"
            :data="resetFormFilter"
          />

          <section class="mx-4 mb-4" v-if="!is_creating">
            <div class="row justify-end q-gutter-md">
              <Button
                label="Continuar"
                size="md"
                :outline="false"
                unelevated
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="onSubmit"
              />
            </div>
          </section>
        </template>
      </Card>
    </section>
    <section class="mb-4" v-if="is_creating">
      <div class="row justify-end q-gutter-md">
        <Button
          no-caps
          unelevated
          :disabled="data_list.length >= 10"
          :label="'Agregar'"
          :leftIcon="defaultIconsLucide.plusCircle"
          :color-icon="'white'"
          :text-color="'white'"
          :outline="false"
          :color="'primary'"
          @click="addForm"
        />
      </div>
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :rows="tableProps.rows"
        :columns="tableProps.columns"
        :custom-columns="['status', 'actions']"
        :pages="tableProps.pages"
      >
        <template #actions="{ row }">
          <!-- ver -->
          <Button
            v-if="
              validateRouter('Treasury', 'RecordIndividualExpensesList', 'show')
            "
            :left-icon="defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Ver"
            @click="handleOptions('view', row.id)"
          />

          <!-- Editar -->
          <Button
            v-if="
              validateRouter('Treasury', 'RecordIndividualExpensesList', 'edit')
            "
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Editar"
            @click="handleOptions('edit', row.id)"
          />

          <!-- Eliminar -->
          <Button
            v-if="
              validateRouter(
                'Treasury',
                'RecordIndividualExpensesList',
                'delete'
              )
            "
            :left-icon="defaultIconsLucide.delete"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="handleOptions('delete', row.id)"
          />
        </template>
      </TableList>
      <section>
        <template v-if="is_creating">
          <q-form>
            <div class="mt-1 mb-1">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-none">
                <div class="col-xs-12 col-sm-12 col-md-6">
                  <p class="text-weight-medium mb-0">
                    Valor total moneda local
                  </p>
                  <CurrencyInput
                    v-model="totalLocalCurrencyValue"
                    :currency="'COP'"
                    placeholder="Inserte"
                    hide-icon
                    :disabled="true"
                  />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6">
                  <p class="text-weight-medium mb-0">
                    Valor total moneda extranjera
                  </p>
                  <CurrencyInput
                    v-model="totalForeignCurrencyValue"
                    :currency="'COP'"
                    placeholder="Inserte"
                    hide-icon
                    :disabled="true"
                  />
                </div>
              </div>
            </div>
          </q-form>
        </template>
      </section>

      <div class="row justify-end q-gutter-md" v-if="is_creating">
        <Button
          label="Confirmar"
          size="md"
          :outline="false"
          unelevated
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="openCreateConfirmationModal"
        />
      </div>
    </section>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 700px"
      :showImgDefault="false"
      :show-btn-cancel="false"
      :show-btn-confirm="false"
      margin-top-body=""
    >
      <template #default-body>
        <DetailOFIndividualExpensesData
          ref="detailOfIndividualBasicDataRef"
          :action="'view'"
          :data="data_list.find((item) => item.id === alertModalConfig.id)"
        />
      </template>
    </AlertModalComponent>

    <AlertModalComponent
      ref="alertDeleteModalRef"
      styleModal="min-width: 470px"
      :showImgDefault="false"
      :title="alertDeleteModalConfig.description"
      :description_message="''"
      @confirm="deleteRecordIndividualExpenses()"
    >
    </AlertModalComponent>

    <AlertModalComponent
      ref="alertCreateModalRef"
      styleModal="min-width: 470px"
      :showImgDefault="false"
      :title="alertCreateModalConfig.description"
      :description_message="''"
      @confirm="createRecordIndividual()"
    >
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
import useRecordIndividualExpensesList from '@/views/treasury/record-individual-expenses/v1/list/RecordIndividualExpensesList'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import RecordIndividualExpensesFilterData from '@/components/Forms/Treasury/RecordIndividualExpenses/information/RecordIndividualExpensesFilterData.vue'
import { defaultIconsLucide } from '@/utils'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import DetailOFIndividualExpensesData from '@/components/Forms/Treasury/DetailOFIndividualExpenses/information/DetailOFIndividualExpensesData.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

defineExpose({
  validateForm: () => detailOfIndividualBasicDataRef.value?.validate(),
})

const {
  totalForeignCurrencyValue,
  totalLocalCurrencyValue,
  headerProperties,
  tableProps,
  formInformation,
  is_creating,
  data_list,
  alertModalConfig,
  alertModalRef,
  alertDeleteModalRef,
  alertDeleteModalConfig,
  detailOfIndividualBasicDataRef,
  alertCreateModalRef,
  alertCreateModalConfig,
  resetFormFilter,
  openCreateConfirmationModal,
  addForm,
  createRecordIndividual,
  handleOptions,
  onSubmit,
  deleteRecordIndividualExpenses,
  validateRouter,
} = useRecordIndividualExpensesList()
</script>
