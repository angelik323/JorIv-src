<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      @on-back="goToURL('VoucherManagementList')"
      show-back-btn
    >
      <section>
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <div class="q-px-lg q-pb-md q-pt-lg">
              <section>
                <UpdateForm
                  ref="voucherManagementFormRef"
                  action="create"
                  :data="null"
                />
              </section>
              <section
                class="mx-1"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    :outline="false"
                    label="Actualizar comprobante"
                    color="orange"
                    class="btn-filter custom"
                    @click="onSubmit"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
        <VCard>
          <template #content-card>
            <div class="q-px-lg q-pb-md q-pt-lg">
              <section>
                <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                  <div class="col-12 col-md-4">
                    <GenericInputComponent
                      :default_value="textForFieldProcessRealized"
                      label="Proceso realizado"
                      placeholder="-"
                      required
                      disabled
                    />
                  </div>
                  <div class="col-12">
                    <q-separator />
                  </div>
                  <div class="col-12">
                    <TableList
                      v-if="tableErrorsProps.rows.length > 0"
                      :loading="tableErrorsProps.loading"
                      :columns="tableErrorsProps.columns"
                      :rows="tableErrorsProps.rows ?? []"
                      hide-pagination
                      :custom-columns="['actions']"
                      class="mt-3"
                    >
                      <template #custom-header>
                        <div class="row q-col-gutter-sm" style="width: 100%">
                          <div
                            class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center"
                          >
                            <p class="q-my-none text-weight-medium text-h5">
                              {{ tableErrorsProps.title }}
                            </p>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
                            <div class="row justify-end">
                              <Button
                                class-custom="custom"
                                :outline="true"
                                label="Descargar excel"
                                color="orange"
                                :styleContent="{
                                  'place-items': 'center',
                                  color: 'black',
                                }"
                                :left-img="imgButtonHeaderTable"
                                :disabled="isDownloadDisabled"
                                @click="downloadAction"
                              />
                            </div>
                          </div>
                        </div>
                      </template>

                      <template #actions="{ row }">
                        <!-- Editar -->
                        <Button
                          :left-icon="defaultIconsLucide.edit"
                          color="orange"
                          class-custom="custom"
                          :outline="false"
                          :flat="true"
                          colorIcon="#f45100"
                          tooltip="Editar"
                          @click="
                            goToURL('AccountingReceiptEdit', row.voucher_id)
                          "
                        />
                      </template>
                    </TableList>
                  </div>
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import UpdateForm from '@/components/Forms/Accounting/VoucherManagement/UpdateForm/UpdateForm.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// Logic view
import useVoucherManagementUpdate from '@/views/accounting/voucher-management/v2/update/VoucherManagementUpdate'

const {
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  voucherManagementFormRef,
  textForFieldProcessRealized,
  tableErrorsProps,
  defaultIconsLucide,
  isDownloadDisabled,
  downloadAction,
  goToURL,
  onSubmit,
} = useVoucherManagementUpdate()
</script>
