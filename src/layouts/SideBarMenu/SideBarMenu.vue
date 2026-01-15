<template>
  <div>
    <MainLoader />

    <q-layout view="lHh Lpr lff" container style="height: 100vh">
      <q-header class="sidebar__layout--header">
        <q-toolbar>
          <q-btn
            v-if="$q.screen.lt.sm"
            flat
            round
            dense
            aria-label="Abrir menú principal"
            @click="drawer = !drawer"
          >
            <Icon name="Menu" color="black" :size="24" />
          </q-btn>

          <q-space />

          <nav
            class="q-px-sm"
            aria-label="Opciones de usuario y notificaciones"
          >
            <AvatarHeader @click:notification="openPanelNotifications" />
          </nav>
        </q-toolbar>
      </q-header>

      <q-drawer
        id="sidebar-drawer-menu"
        class="bg-primary_fiduciaria column full-height"
        v-model="drawer"
        show-if-above
        bordered
        :width="280"
        :breakpoint="$q.screen.sizes.sm"
        :mini="!drawer || miniState"
        @click.capture="drawerClick"
      >
        <nav
          class="column full-height"
          aria-label="Menú de navegación principal"
        >
          <!-- Logo y encabezado -->
          <div class="flex flex-center" style="min-height: 100px">
            <q-img
              v-if="miniState && !$q.screen.lt.sm"
              src="@/assets/images/f-fiduprevisora.svg"
              style="width: 70%; max-width: 150px"
            />
            <q-img
              v-else
              src="@/assets/images/fiduprevisora-logo.svg"
              style="width: 80%; max-width: 180px"
            />
          </div>

          <q-separator
            class="q-mx-lg"
            :class="{ 'q-mt-md': miniState && !$q.screen.lt.sm }"
            color="white"
          />

          <!-- Scroll con menú -->
          <div class="col">
            <q-scroll-area class="fit q-pb-lg">
              <q-list padding class="text-white">
                <!-- Inicio -->
                <q-item
                  class="menu-item"
                  clickable
                  aria-label="Inicio"
                  @click="updateRoute('HomeView')"
                >
                  <q-expansion-item group="somegroup" hide-expand-icon>
                    <template #header>
                      <q-item-section avatar>
                        <Icon name="House" color="white" />
                      </q-item-section>

                      <q-item-section>Inicio</q-item-section>
                    </template>
                  </q-expansion-item>
                </q-item>

                <!-- Menús dinámicos -->
                <template v-for="menu in menus" :key="menu.id">
                  <q-item class="menu-item">
                    <q-expansion-item
                      group="somegroup"
                      expand-separator
                      expand-icon-class="text-white expansion-icon"
                      :icon="menu.icon ? menu.icon : ''"
                      :label="menu.name"
                      :aria-label="`Seccion ${menu.name}`"
                      @click="dropdownSelected(menu.name)"
                    >
                      <template #header>
                        <q-item-section avatar>
                          <Icon
                            :name="menu.icon ? menu.icon : ''"
                            color="white"
                          />
                        </q-item-section>
                        <q-item-section> {{ menu.name }} </q-item-section>
                      </template>

                      <transition name="fade">
                        <q-list
                          v-if="menu.children?.length > 0"
                          tag="ul"
                          class="q-ml-lg mt-0"
                          :aria-label="`Submenús de ${menu.name}`"
                        >
                          <q-item
                            tag="li"
                            v-for="submenu in menu.children"
                            :key="submenu.identifier"
                            clickable
                            v-ripple
                            dense
                            tabindex="0"
                            role="menuitem"
                            class="text-weight-light q-px-xs"
                            :class="{
                              'text-red': isActiveRoute(submenu.identifier),
                            }"
                            @click="updateRoute(submenu.identifier)"
                            :active="currentRoute === submenu.identifier"
                            active-class="my-menu-link"
                            style="background: #5d1d36; list-style: none"
                            :aria-current="
                              isActiveRoute(submenu.identifier) ? 'page' : null
                            "
                          >
                            <q-item-section class="q-pl-md">
                              {{ submenu.name }}
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </transition>
                    </q-expansion-item>
                  </q-item>
                </template>
              </q-list>
            </q-scroll-area>
          </div>

          <!-- Botón flotante lateral -->
          <div class="absolute" style="top: 80px; right: -17px">
            <q-btn
              v-if="!$q.screen.lt.sm"
              round
              unelevated
              class="sidebar__drawer--btn shadow-2 bg-new-primary-minus custom"
              color="bg-new-primary-minus"
              @click="miniState = true"
              aria-label="Alternar menú"
            >
              <Icon
                :name="miniState ? 'Menu' : 'ChevronLeft'"
                color="white"
                :size="18"
              />
            </q-btn>
          </div>

          <!-- Botón "Salir" fijo -->
          <q-item
            class="exit-button text-white"
            clickable
            aria-label="Cerrar sesión"
            @click="logout"
          >
            <q-item-section avatar>
              <Icon name="LogOut" color="white" />
            </q-item-section>

            <q-item-section>Salir</q-item-section>
          </q-item>
        </nav>
      </q-drawer>

      <!-- Panel de notificaciones -->
      <NotificationMenu
        :open="notificationPanel"
        @update:open="notificationPanel = $event"
      />

      <!-- Contenedor principal -->
      <q-page-container>
        <InactivityUser />
        <router-view />
      </q-page-container>

      <!-- Herramientas de accesibilidad -->
      <AccessibilityBar />
    </q-layout>
  </div>
</template>

<script setup lang="ts">
// Components
import MainLoader from '@/components/loader/MainLoader.vue'
import AvatarHeader from '@/components/Avatar/AvatarHeader/AvatarHeader.vue'
import Icon from '@/components/common/Icon/Icon.vue'
import InactivityUser from '@/components/InactivityUser/Index.vue'
import NotificationMenu from '@/components/Notifications/v1/NotificationList.vue'
import AccessibilityBar from '@/components/common/AccessibilityBar/AccessibilityBar.vue'

// Logic View
import useSideBarMenu from '@/layouts/SideBarMenu/SideBarMenu'

const {
  drawer,
  miniState,
  menus,
  currentRoute,
  isActiveRoute,
  notificationPanel,

  openPanelNotifications,
  drawerClick,
  dropdownSelected,
  updateRoute,
  logout,
} = useSideBarMenu()
</script>

<style lang="scss">
#sidebar-drawer-menu {
  z-index: 9999;
  border-radius: 0px 60px 46px 0px !important;
  overflow: hidden !important;
}

.q-drawer.q-drawer--left {
  z-index: 9999;
  border-radius: 0px 60px 46px 0px !important;
}

.sidebar {
  &__layout {
    &--header {
      height: 60px;
      background-color: #fff;

      .q-toolbar {
        height: 100%;
      }
    }
  }
  &__drawer {
    &--btn {
      border: 2px solid white;
      font-size: 12px;
    }
  }
}

.submenu {
  padding-left: 50px;
}

.expansion-icon .q-icon {
  font-size: 12px !important;
}

.my-menu-link {
  color: white !important;
  background: #7b3953 !important;
}

.bell-notification {
  place-content: baseline;
  align-content: center;
}

.menu-item {
  padding: unset;
  > .q-expansion-item {
    width: 100%;
  }
}

.exit-button {
  border-radius: 0 0 46px 0;
}
</style>
