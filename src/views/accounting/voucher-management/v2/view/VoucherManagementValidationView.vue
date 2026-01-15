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
                <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="no-margin text-weight-bold">Periodo</p>
                      <p class="text-weight-medium">{{ models.period_date }}</p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="no-margin text-weight-bold">
                        Estructura contable
                      </p>
                      <p class="text-weight-medium">
                        {{
                          models.structure
                            ? models.structure.split('-')[0].trim()
                            : ''
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="no-margin text-weight-bold">
                        Nombre de la estructura
                      </p>
                      <p class="text-weight-medium">
                        {{
                          models.structure
                            ? models.structure.split('-')[1].trim()
                            : ''
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="no-margin text-weight-bold">Desde negocio</p>
                      <p class="text-weight-medium">
                        {{ models.from_business_trust_id.business_code }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="no-margin text-weight-bold">
                        Nombre del negocio
                      </p>
                      <p class="text-weight-medium">
                        {{ models.from_business_trust_id.business_name }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="no-margin text-weight-bold">Hasta negocio</p>
                      <p class="text-weight-medium">
                        {{ models.to_business_trust_id.business_code }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="no-margin text-weight-bold">
                        Nombre del negocio
                      </p>
                      <p class="text-weight-medium">
                        {{ models.to_business_trust_id.business_name }}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                  <div class="col-12">
                    <q-separator class="q-my-lg" />
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="text-black-90">
                      <p class="no-margin text-weight-bold">
                        Proceso realizado
                      </p>
                      <p class="text-weight-medium no-margin">Con novedades</p>
                    </div>
                  </div>
                  <div class="col-12">
                    <q-separator class="q-my-lg" />
                  </div>
                  <div class="col-12">
                    <TableList
                      :loading="tableErrorsProps.loading"
                      :columns="tableErrorsProps.columns"
                      :rows="tableErrorsProps.rows ?? []"
                      hide-pagination
                      :custom-columns="['id', 'errors', 'actions']"
                    >
                      <template #id="{ index }">
                        <p class="no-margin">{{ index + 1 }}</p>
                      </template>

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
                                v-if="
                                  validateRouter(
                                    'Accounting',
                                    'VoucherManagementList',
                                    'export'
                                  )
                                "
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

                      <template #errors="{ row }">
                        <p class="no-margin" v-for="error in row.errors">
                          {{ error }}
                        </p>
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
                  <div class="col-12">
                    <q-separator />
                  </div>
                </div>
              </section>
              <section
                class="mx-1 q-mt-lg"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    :outline="false"
                    label="Finalizar"
                    color="orange"
                    class="btn-filter custom"
                    @click="goToURL('VoucherManagementList')"
                  />
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
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// Logic view
import useVoucherManagementValidationView from '@/views/accounting/voucher-management/v2/view/VoucherManagementValidationView'

const {
  models,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  isDownloadDisabled,
  defaultIconsLucide,
  tableErrorsProps,
  downloadAction,
  goToURL,
  validateRouter,
} = useVoucherManagementValidationView()
</script>
