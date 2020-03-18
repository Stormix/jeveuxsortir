<template>
  <div class="mt-10">
    <section class="hero is-small is-bold">
      <div class="mb-2">
        <h1 class="title is-spaced">
          Générateur d'attestation de déplacement
        </h1>
        <h2 class="subtitle">
          Primary bold subtitle
        </h2>
      </div>
    </section>

    <section class="mt-2">
      <div>
        <div class="flex mb-4">
          <div class="w-1/2">
            <b-field label="Nom Complet:">
              <b-input
                v-model="name"
                required
                icon-pack="fas"
                icon="user"
                placeholder="Mme / M. ..."
              />
            </b-field>
            <b-field label="Date de naissance:">
              <b-datepicker
                v-model="birthday"
                :show-week-number="showWeekNumber"
                placeholder="Né le ..."
                icon="calendar-today"
                trap-focus
                required
              />
            </b-field>
            <b-field label="Demeurant:">
              <b-input
                v-model="address"
                placeholder="Demeurant"
                type="text"
                icon-pack="fas"
                icon="home"
                required
              />
            </b-field>
            <b-field label="Motif de déplacement:">
              <b-select placeholder="Motif de déplacement" expanded>
                <option
                  v-for="option in options"
                  :key="option.id"
                  :value="option.id"
                  required
                >
                  {{ option.text }}
                </option>
              </b-select>
            </b-field>

            <b-field label="Fait à:">
              <b-input
                v-model="city"
                placeholder="Ville"
                type="text"
                icon-pack="fas"
                icon="map-marker"
              />
            </b-field>
            <b-field label="Signature:">
              <Signature class="sign my-auto" />
            </b-field>
            <div class="flex items-center ">
              <b-button type="is-primary">
                <i class="fas fa-download" /> Enregistrer
              </b-button>
              <b-button type="is-light" class="ml-2">
                <i class="fas fa-print" /> Imprimer
              </b-button>
            </div>
          </div>
          <div class="w-1/2">
            <img class="w-3/4 mx-auto" src="img/undraw_social_distancing.svg" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Signature from '@/components/Signature'
import axios from 'axios'

const ENDPOINT = 'https://nominatim.openstreetmap.org/reverse'
const FORMAT = 'jsonv2'

export default {
  name: 'Home',
  components: {
    Signature
  },
  data() {
    return {
      name: null,
      showWeekNumber: false,
      birthday: null,
      address: null,
      city: null,
      location: null,
      gettingLocation: false,
      errorStr: null,
      options: [
        {
          id: 0,
          text: 'Déplacement professionelle' // show a warning that a proof may be requested
        },
        {
          id: 1,
          text: 'Déplacement pour achats de première nécessité'
        },
        {
          id: 2,
          text: 'Déplacement pour motif de santé'
        },
        {
          id: 3,
          text: 'Déplacement pour motif familial impérieux'
        },
        {
          id: 4,
          text: 'Déplacements brefs (à proximité du domicile)'
        }
      ]
    }
  },
  async mounted() {
    this.gettingLocation = true
    try {
      this.gettingLocation = false
      this.location = await this.getLocation()
      const address = await this.addressByCoordinates(this.location.coords)
      this.city = address.city
    } catch (e) {
      this.gettingLocation = false
      this.errorStr = e.message
    }
  },
  methods: {
    async addressByCoordinates({ latitude, longitude }) {
      const { data } = await axios.get(ENDPOINT, {
        params: {
          format: FORMAT,
          lat: latitude,
          lon: longitude
        }
      })

      return data.address
    },
    async getLocation() {
      return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation is not available.'))
        }

        navigator.geolocation.getCurrentPosition(
          pos => {
            resolve(pos)
          },
          err => {
            reject(err)
          }
        )
      })
    }
  }
}
</script>

<style lang="scss">
.sign {
  min-height: 6rem;
}
</style>
