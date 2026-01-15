<script setup lang="ts">
// Images
import avatarPath from '@/assets/images/profile/avatar-640x.png'

// Components
import ButtonFileComponent from '@/components/common/ButtonFile/ButtonFileComponent.vue'

// Logic View
import useHeaderProfileComponent from '@/components/HeaderProfile/HeaderProfileComponent'

// Imports variables
const { capturePhotoFromDevice, loggedUser } = useHeaderProfileComponent()
</script>
<template>
  <div class="row items-start q-gutter-md" style="min-height: 20rem !important">
    <q-card flat style="width: 100%">
      <q-card-section class="section-custom p-0">
        <q-img
          src="@/assets/images/profile/banner.png"
          fit="fill"
          class="photo_profile__header"
        />
        <div class="row mt-2">
          <div
            class="col-xs-12 col-sm-12 col-md-3 col-lg-2 mr-7"
            style="height: 10rem"
          >
            <div class="photo_profile__container--left">
              <q-avatar size="15rem" rounded class="photo_profile__avatar">
                <q-img
                  :src="loggedUser?.user?.photo ?? avatarPath"
                  spinner-color="indigo-10"
                  alt="User Profile"
                />
                <ButtonFileComponent
                  color="indigo-9"
                  icon="mdi-image"
                  :style="'position: absolute;right: 15px;bottom: 0;border: solid 3px white;'"
                  @set-file="capturePhotoFromDevice"
                >
                  <template #content-btn>
                    <q-tooltip
                      class="bg-indigo-10 text-body2"
                      :offset="[10, 10]"
                    >
                      Cambiar foto
                    </q-tooltip>
                  </template>
                </ButtonFileComponent>
              </q-avatar>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-7 col-lg-8">
            <p
              class="text-h4 mb-0"
              :class="
                ['sm', 'xs'].includes($q.screen.name) ? 'text-center' : ''
              "
            >
              {{ loggedUser?.user.name }} {{ loggedUser?.user.last_name }}
            </p>
            <p
              class="text-h6 text-weight-light text-grey-6"
              :class="
                ['sm', 'xs'].includes($q.screen.name) ? 'text-center' : ''
              "
            >
              {{ loggedUser?.role }}
            </p>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: initial;
}
.q-avatar__content,
.q-avatar img:not(.q-icon):not(.q-img__image) {
  border-radius: inherit;
  height: inherit;
  width: auto;
}

.photo_profile {
  &__header {
    top: 0;
    left: 0;
    height: 20rem;
  }
  &__container {
    &--left {
      width: 250px;
      z-index: 9998;
      transform: translate(28px, -150px);
      border-radius: 50%;
    }
    &--right {
      z-index: 9998;
      position: absolute;
      transform: translate(270px, 190px);
    }
  }
  &__avatar {
    background-color: white;
    top: 0;
    left: 0px;
    border: 4px white solid;
    border-radius: 100%;
    box-shadow: 0px 0px 5px;
  }
}

.section-custom {
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
}
</style>
