<template>
  <div class="q-px-xl" role="main">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('RegisterAuthorizationChangesList')"
    >
      <section class="q-my-md">
        <VCard class="q-mb-md">
          <template #content-card>
            <div class="q-pa-lg">
              <h6 class="q-mb-md">Datos básicos</h6>

              <div class="row q-col-gutter-md">
                <div class="col-3">
                  <strong>Código novedad</strong>
                  <div>{{ noveltyDetail.novelty_code || '-' }}</div>
                </div>

                <div class="col-3">
                  <strong>Estado</strong>
                  <div class="text-positive">
                    {{ noveltyDetail.status || '-' }}
                  </div>
                </div>

                <div class="col-3">
                  <strong>Creado por</strong>
                  <div>{{ noveltyDetail.created_by || '-' }}</div>
                </div>

                <div class="col-3">
                  <strong>Fecha creación</strong>
                  <div>
                    {{
                      noveltyDetail.created_at
                        ? formatDate(noveltyDetail.created_at, DATE_MASK)
                        : '-'
                    }}
                  </div>
                </div>

                <div class="col-3 q-mt-sm">
                  <strong>Actualizado por</strong>
                  <div>{{ noveltyDetail.updated_by || '-' }}</div>
                </div>

                <div class="col-3 q-mt-sm">
                  <strong>Fecha actualización</strong>
                  <div>
                    {{
                      noveltyDetail.updated_at &&
                      noveltyDetail.updated_at !== '-'
                        ? formatDate(noveltyDetail.updated_at, DATE_MASK)
                        : '-'
                    }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </VCard>

        <VCard class="q-mb-md">
          <template #content-card>
            <div class="q-pa-lg">
              <h6 class="q-mb-md">Detalle de novedad</h6>

              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <strong>Activo fijo / bien</strong>
                  <div>{{ noveltyDetail.asset || '-' }}</div>
                </div>

                <div class="col-6">
                  <strong>Tipo de novedad</strong>
                  <div>{{ noveltyDetail.novelty_type || '-' }}</div>
                </div>

                <div class="col-12 q-mt-sm">
                  <strong>Descripción de la novedad</strong>
                  <div class="q-pa-sm bordered-box">
                    {{ noveltyDetail.description || '-' }}
                  </div>
                </div>

                <div class="col-3 q-mt-sm">
                  <strong>¿Genera contabilidad?</strong>
                  <div>
                    {{ noveltyDetail.generates_accounting ? 'Sí' : 'No' }}
                  </div>
                </div>

                <div class="col-3 q-mt-sm">
                  <strong>Afectación al activo/bien</strong>
                  <div>{{ noveltyDetail.affectation_type || '-' }}</div>
                </div>

                <div class="col-3 q-mt-sm">
                  <strong>Fecha estimada de ejecución</strong>
                  <div>
                    {{
                      noveltyDetail.solution_date
                        ? formatDate(noveltyDetail.solution_date, DATE_MASK)
                        : '-'
                    }}
                  </div>
                </div>

                <div class="col-3 q-mt-sm">
                  <strong>Costo</strong>
                  <div>{{ formatCurrency(noveltyDetail.cost) }}</div>
                </div>

                <div class="col-12 q-mt-sm">
                  <strong>Observaciones adicionales</strong>
                  <div class="q-pa-sm bordered-box">
                    {{ noveltyDetail.additional_observation || '-' }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </VCard>

        <VCard class="q-mb-md">
          <template #content-card>
            <Accordeon
              expand-separator
              label="Documentos asociados activo fijo o bien"
              default-opened
            >
              <div class="q-pa-lg">
                <div v-if="noveltyDetail.documents?.length">
                  <ul class="q-pl-none">
                    <li
                      v-for="doc in noveltyDetail.documents"
                      :key="doc.id"
                      class="q-mb-sm"
                    >
                      <a
                        href="#"
                        class="text-primary cursor-pointer"
                        @click.prevent="openDocument(doc.id)"
                      >
                        {{ doc.original_name || doc.file_name }}
                      </a>
                    </li>
                  </ul>
                </div>

                <div v-else>No hay documentos asociados</div>
              </div>
            </Accordeon>
          </template>
        </VCard>

        <VCard class="q-mb-md">
          <template #content-card>
            <Accordeon
              expand-separator
              label="Comprobante contable"
              default-opened
            >
              <div class="q-pa-lg">
                <div class="row q-col-gutter-md">
                  <!-- Labels -->
                  <div class="col-6">
                    <div class="q-mb-sm">
                      <strong>Número comprobante contable</strong>
                    </div>
                    <div class="q-mb-sm">
                      <strong>Fecha de registro</strong>
                    </div>
                    <div><strong>Estado de comprobante</strong></div>
                  </div>

                  <!-- Values -->
                  <div class="col-6 text-right">
                    <div class="q-mb-sm">
                      {{
                        noveltyDetail.accounting_voucher?.voucher_number || '-'
                      }}
                    </div>
                    <div class="q-mb-sm">
                      {{
                        noveltyDetail.accounting_voucher?.registration_date &&
                        noveltyDetail.accounting_voucher.registration_date !==
                          '-'
                          ? formatDate(
                              noveltyDetail.accounting_voucher
                                .registration_date,
                              DATE_MASK
                            )
                          : '-'
                      }}
                    </div>

                    <div class="text-positive">
                      {{ noveltyDetail.accounting_voucher?.status || '-' }}
                    </div>
                  </div>
                </div>

                <!-- Botón -->
                <div class="row justify-end q-mt-lg">
                  <Button
                    label="Ver comprobante"
                    color="dark"
                    :outline="false"
                    :disable="!noveltyDetail.accounting_voucher_id"
                    :dropdown-options="undefined"
                    @click="goToAccountingVoucher"
                  />
                </div>
              </div>
            </Accordeon>
          </template>
        </VCard>

        <div class="row justify-end q-mt-xl">
          <Button
            label="Finalizar"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="goToURL('RegisterAuthorizationChangesList')"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import Accordeon from '@/components/Accordeon/Accordeon.vue'

// logic view
import useRegisterAuthorizationChangesView from '@/views/fixed-assets/register-authorization-changes/v1/view/RegisterAuthorizationChangesView'

const {
  noveltyDetail,
  headerProperties,
  DATE_MASK,
  goToAccountingVoucher,
  openDocument,
  formatDate,
  formatCurrency,
  goToURL,
} = useRegisterAuthorizationChangesView()
</script>

<style lang="scss" src="./RegisterAuthorizationChanges.scss"></style>
