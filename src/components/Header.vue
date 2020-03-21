<template>
  <nav class=" bg-indigo-500 p-6">
    <div
      class=" mx-auto container flex items-center justify-between flex-wrap "
    >
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class=" text-xl tracking-tight brand">
          <router-link :to="{ path: '/' }">
            JeVeuxSortir
          </router-link>
        </span>
      </div>
      <div class="block lg:hidden">
        <button
          class="flex items-center px-3 py-2 border rounded text-indigo-200 border-indigo-400 hover:text-white hover:border-white"
          @click.prevent="toggleMenu"
        >
          <svg
            class="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        v-show="showMenu"
        class="w-full block flex-grow lg:flex lg:items-center lg:w-auto"
      >
        <div class="text-sm lg:flex-grow">
          <router-link
            class="block mt-4 lg:inline-block lg:mt-0 text-indigo-200 hover:text-white"
            :to="{ path: '/about' }"
          >
            A propos
          </router-link>
          <a
            href="https://github.com/Stormix/jeveuxsortir/projects/1"
            class="block ml-4 mt-4 lg:inline-block lg:mt-0 text-indigo-200 hover:text-white"
            target="_blank"
          >
            Roadmap
          </a>
        </div>
        <div>
          <router-link
            :to="{ path: '/privacy' }"
            class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-500 hover:bg-white mt-4 lg:mt-0"
          >
            Politique de confidentialité
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { isMobile } from 'mobile-device-detect'

export default {
  data() {
    return {
      showMenu: true
    }
  },
  mounted() {
    this.showMenu = !isMobile
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Pacifico&display=swap');
.brand {
  font-family: 'Pacifico', cursive;
  font-size: 1.4rem;
}
</style>
