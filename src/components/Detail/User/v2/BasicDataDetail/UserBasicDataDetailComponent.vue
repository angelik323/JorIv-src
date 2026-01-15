<script lang="ts" setup>
import { useUserModuleStore } from '@/stores';
import { storeToRefs } from 'pinia';

const { user_data } = storeToRefs(useUserModuleStore('v1'))
</script>

<template>
  <!-- General data -->
  <section>
    <div class="q-mx-md q-mt-lg">
      <div class="row q-px-md q-col-gutter-md">
        <div class="col-12">
          <p class="text-black-10 text-weight-bold text-h6 mb-0">
            Datos generales
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Fecha de creación*
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.created_at ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Tipo de usuario*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.user_type ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Usuario</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.user_code ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Tipo de documento*
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.document_type?.name ? user_data?.document_type?.abbreviation + ': ' + user_data?.document_type?.name : 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-6">
          <p class="text-black-10 text-weight-medium mb-1">
            Número de documento*
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.document ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Primer nombre*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.name ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Segundo nombre</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.second_name ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Primer apellido*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.last_name ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Segundo apellido</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.second_last_name ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Correo electrónico*
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.email ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Teléfono*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.phone ?? 'No registró' }}
          </p>
        </div>
      </div>
      <div class="q-mx-md">
        <q-separator />
      </div>
    </div>
  </section>

  <!-- Perfil data -->
  <section>
    <div class="q-mx-md q-mt-lg">
      <div class="row q-px-md q-col-gutter-md">
        <div class="col-12">
          <p class="text-black-10 text-weight-bold text-h6 mb-0">
            Datos perfil
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Perfil*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.profile_type ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Rol*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.roles[0]?.name ?? 'No registró' }}
          </p>
        </div>
      </div>
      <div class="q-mx-md">
        <q-separator />
      </div>
    </div>
  </section>

  <!-- Status data -->
  <section>
    <div class="q-mx-md q-mt-lg">
      <div class="row q-px-md q-col-gutter-md">
        <div class="col-12">
          <p class="text-black-10 text-weight-bold text-h6 mb-0">Estado</p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Estado*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ user_data?.status?.status ?? 'No registró' }}
          </p>
        </div>
      </div>
      <div class="q-mx-md">
        <q-separator />
      </div>
    </div>
  </section>
</template>
