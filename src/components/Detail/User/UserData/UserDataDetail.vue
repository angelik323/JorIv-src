<script lang="ts" setup>
import { useUserStore } from '@/stores';
import { storeToRefs } from 'pinia';

const capitalizeFirstLetter = (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

const { userData } = storeToRefs(useUserStore())
</script>
<template>
  <!-- User data -->
  <section>
    <div class="q-mx-md q-mt-lg">
      <div class="row q-px-md q-col-gutter-md">
        <div class="col-12">
          <p class="text-black-10 text-weight-bold text-h6 mb-0">
            Datos del usuario
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Rol*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.role?.name ?? null }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Fecha de vencimiento
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.expiration_date ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Sede*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.branch?.name ?? 'No registró' }}
          </p>
        </div>
      </div>
      <div class="q-mx-md">
        <q-separator />
      </div>
    </div>
  </section>

  <!-- Personal user data -->
  <section>
    <div class="q-mx-md q-mt-lg">
      <div class="row q-px-md q-col-gutter-md">
        <div class="col-12">
          <p class="text-black-10 text-weight-bold text-h6 mb-0">
            Datos personales*
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

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Número de documento*
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.document ?? null }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Nombre*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.name ?? null }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Apellidos*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.last_name ?? null }}
          </p>
        </div>

        <div
          class="col-xs-12 col-sm-12 col-md-4 col-lg-4"
          v-show="userData?.document_type_id === 1"
        >
          <p class="text-black-10 text-weight-medium mb-1">
            Lugar de expedición*
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ capitalizeFirstLetter(userData?.expedition_place?.name as string) }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Sexo*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.sex ?? null }}
          </p>
        </div>
      </div>
      <div class="q-mx-md">
        <q-separator />
      </div>
    </div>
  </section>

  <!-- Contact data -->
  <section>
    <div class="q-mx-md q-mt-lg">
      <div class="row q-px-md q-col-gutter-md">
        <div class="col-12">
          <p class="text-black-10 text-weight-bold text-h6 mb-0">
            Datos de contacto
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Teléfono*</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.phone ?? null }}
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
      </div>
      <div class="q-mx-md q-mb-lg">
        <q-separator />
      </div>
    </div>
  </section>
</template>
