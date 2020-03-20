<template>
  <div id="app" class="flex flex-col min-h-screen ">
    <Header />
    <main class="flex-grow flex justify-center">
      <router-view class="" />
    </main>
    <Footer />
  </div>
</template>
<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Noto+Sans&display=swap');
body {
  font-family: 'Noto Sans', sans-serif;
}
</style>
