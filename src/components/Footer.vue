<template>
  <footer>
    <div class="mx-auto text-center">
      <p>
        <strong>JeVeuxSortir</strong> (V0.1) by
        <a class="text-indigo-700" href="https://stormix.co">Anas Mazouni</a>.
        Source code is on
        <a
          class="text-indigo-700"
          href="https://github.com/Stormix/jeveuxsortir/"
        >
          Github
        </a>
        . Illustration by
        <a class="text-indigo-700" href="https://undraw.co">
          undraw.co
        </a>
      </p>
    </div>
    <cookie-law theme="royal" button-text="Oui Merci !">
      <div slot="message">
        Ce site web utilise des cookies pour vous garantir la meilleure
        expérience. Veuillez consulter notre
        <router-link class="text-bold text-indigo-900" to="/privacy">
          Politique de Confidentialité
        </router-link>
        pour plus d'informations sur le type de cookies que nous utilisons. Nous
        supposerons que vous êtes d'accord avec cela.
      </div>
    </cookie-law>
  </footer>
</template>

<script>
import CookieLaw from 'vue-cookie-law'
export default {
  components: { CookieLaw }
}
</script>

<style lang="scss">
footer {
  padding: 3rem 2rem;
}
.Cookie--royal {
  background-color: #667eea !important;
  color: #fff !important;
}
.Cookie--royal .Cookie__button {
  background-color: #667eea !important;
  border: #fff 2px solid !important;
}
</style>
