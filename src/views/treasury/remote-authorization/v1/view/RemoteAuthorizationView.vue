<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'RemoteAuthorizationList' })"
    >
      <section class="q-my-md q-pl-lg">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />

        <VCard>
          <template #content-card>
            <div
              v-if="tabActive === 'basic_data'"
              class="q-mt-xl q-mb-lg q-px-lg"
            >
              <div class="row q-col-gutter-lg">
                <div class="col-12 col-md-4">
                  <label class="text-bold text-lg mb-3"
                    >Número de autorización</label
                  >
                  <div>{{ authorization.number }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <label class="text-bold text-lg mb-3"
                    >Fecha de solicitud</label
                  >
                  <div>{{ authorization.request_date }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <label class="text-bold text-lg mb-3">Estado</label>
                  <div class="q-mt-xs">
                    <ShowStatus :type="Number(authorization.status_id)" />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <label class="text-bold text-lg mb-3">Registro</label>
                  <div>{{ authorization.register }}</div>
                </div>
                <div class="col-12 col-md-6">
                  <label class="text-bold text-lg mb-3">Proceso</label>
                  <div>{{ authorization.process }}</div>
                </div>
              </div>

              <div class="row q-col-gutter-lg q-mt-md">
                <div class="col-12 col-md-4">
                  <label class="text-bold text-lg mb-3"
                    >Usuario solicitante</label
                  >
                  <div>{{ authorization.requester_user }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <label class="text-bold text-lg mb-3">Módulo</label>
                  <div>{{ authorization.module }}</div>
                </div>
              </div>

              <q-separator class="my-4" />

              <div class="q-mb-md">
                <p class="text-bold text-lg mb-3">Descripción</p>
                <div>{{ authorization.description }}</div>
              </div>

              <div class="q-mb-md">
                <p class="text-bold text-lg mb-3">
                  Observaciones del solicitante
                </p>
                <div>{{ authorization.requester_notes }}</div>
              </div>

              <div class="q-mb-md">
                <p class="text-bold text-lg mb-3">Motivo de rechazo</p>
                <div>{{ authorization.rejection_reason }}</div>
              </div>

              <div class="row q-mt-lg">
                <div class="col-12 flex justify-end">
                  <Button
                    label="Finalizar"
                    :outline="false"
                    color="orange"
                    size="md"
                    :classCustom="'text-capitalize btn-filter custom'"
                    @click="$router.push({ name: 'RemoteAuthorizationList' })"
                  />
                </div>
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import useRemoteAuthorizationView from './RemoteAuthorizationView'

const { headerProps, filteredTabs, tabActive, tabActiveIdx, authorization } =
  useRemoteAuthorizationView()
</script>
