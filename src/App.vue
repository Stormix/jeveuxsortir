<template>
  <div id="app" class="flex flex-col min-h-screen ">
    <Header />
    <main class="flex-grow flex justify-center mt-10">
      <router-view class="" />
    </main>
    <Feedback />
    <Footer />
  </div>
</template>
<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Feedback from '@/components/Feedback'

export default {
  components: {
    Header,
    Footer,
    Feedback
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Noto+Sans&display=swap');
body {
  font-family: 'Noto Sans', sans-serif;
}
</style>
