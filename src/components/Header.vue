<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <div class="brand text-primary">
          JeVeuxSortir
        </div>
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        Accueil
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/about' }">
        A propos
      </b-navbar-item>
    </template>

    <template slot="end">
      <!-- <b-navbar-item tag="div">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
          <a class="button is-light">
            Log in
          </a>
        </div>
      </b-navbar-item> -->

      <b-navbar-item tag="router-link" :to="{ path: '/privacy' }">
        Politique de confidentialité
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Pacifico&display=swap');
.brand {
  font-family: 'Pacifico', cursive;
  font-size: 1.4rem;
}
</style>
