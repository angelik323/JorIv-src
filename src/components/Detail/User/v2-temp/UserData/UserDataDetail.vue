<script lang="ts" setup>
import { useUserStore } from '@/stores';
import { storeToRefs } from 'pinia';

const { userData } = storeToRefs(useUserStore())
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
          <p class="text-black-10 text-weight-medium mb-1">Fecha de creación*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            <!-- {{ userData?.created_at ?? null }} formatear con toLocaleString() -->
            Por vincular
          </p>
        </div>
     
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Tipo de usuario*
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            <!-- {{ userData?.user_type ?? 'No registró' }} -->
            Por vincular
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
           Usuario
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            <!-- {{ userData?.user ?? 'No registró' }} -->
            Por vincular
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Tipo de documento*
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.document_type?.name ? userData?.document_type?.abbreviation + ': ' + userData?.document_type?.name : null }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-6">
          <p class="text-black-10 text-weight-medium mb-1">
            Número de documento*
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.document ?? null }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Primer nombre*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.name ?? null }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Segundo nombre</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            <!-- {{ userData?.second_name ?? null }} -->
              Por vincular
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Primer apellido*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.last_name ?? null }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Segundo apellido</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            <!-- {{ userData?.second_last_name ?? null }} -->
              Por vincular
          </p>
        </div>
        
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Correo electrónico*
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.email ?? null }}
          </p>
        </div>
        
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Teléfono*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.phone ?? null }}
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
            <!-- {{ userData?.profile?.name ?? null }} -->
              Por vincular
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Rol*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.role?.name ?? null }}
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
          <p class="text-black-10 text-weight-bold text-h6 mb-0">
            Estado
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Estado*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.status?.status ?? null }}
          </p>
        </div>
      </div>
      <div class="q-mx-md">
        <q-separator />
      </div>
    </div>
  </section>

</template>
