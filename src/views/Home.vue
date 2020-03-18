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
      <div
        class="grid lg:grid-cols-2 lg:grid-rows-1 grid-flow-col md:grid-rows-2 sm:grid-rows-2 gap-4"
      >
        <div class="card">
          <!-- <b-message type="is-danger" has-icon>
            <div class=" my-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </b-message>

          <b-message type="is-info" has-icon>
            Motif séléctionnér: déplacements entre le domicile et le lieu
            d’exercice de l’activité professionnelle, lorsqu’ils sont
            indispensables à l’exercice d’activités ne pouvant être organisées
            sous forme de télétravail (sur justificatif permanent) ou
            déplacements professionnels ne pouvant être différés ;
          </b-message>

          <b-message type="is-warning" has-icon>
            Lorem ipsum dolor sit amet, consectetur warning elit. Fusce id
            fermentum quam. Proin sagittis, nibh id hendrerit imperdiet, elit
            sapien laoreet elit
          </b-message> -->

          <b-field label="Nom Complet:">
            <b-input
              v-model="name"
              required
              icon-pack="fas"
              icon="user"
              placeholder="Mme / M. ..."
              validation-message="Only lowercase is allowed"
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
            <b-select
              v-model="reason"
              placeholder="Motif de déplacement"
              expanded
            >
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

          <small v-if="reasonDesc">
            <b>Description:</b>
            {{ reasonDesc }}
          </small>
          <b-field label="Fait à:" class="mt-2">
            <b-input
              v-model="city"
              placeholder="Ville"
              type="text"
              icon-pack="fas"
              icon="map-marker"
            />
          </b-field>
          <b-field label="Signature:">
            <Signature ref="signature" class="sign my-auto" />
          </b-field>
          <div class="flex items-center ">
            <b-button
              v-if="!generated"
              type="is-success"
              @click.prevent="generate"
            >
              <i class="fas fa-cogs" /> Générer mon attestation
            </b-button>
            <b-button
              v-if="generated"
              type="is-success"
              @click.prevent="generate"
            >
              <i class="fas fa-cogs" /> Regénérer
            </b-button>
            <a
              v-if="generated"
              :href="pdfURL"
              class="button is-primary ml-2"
              download="attestation.pdf"
            >
              <i class="fas fa-download" /> Enregistrer
            </a>
          </div>
        </div>
        <div class="">
          <img
            v-if="!generated"
            class="w-3/4 mx-auto"
            src="img/undraw_social_distancing.svg"
          />
          <iframe v-else class="w-full h-full" :src="pdfURL" />
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
const port = process.env.BACKEND_PORT || 3000
const host = process.env.HOST || 'localhost'
const protocol = process.env.HTTP || 'http'

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
      reason: null,
      generated: false,
      pdfPath: null,
      port: port,
      host: host,
      protocol: protocol,
      options: [
        {
          id: 0,
          text: 'Déplacement professionelle',
          desc: `déplacements entre le domicile et le lieu d’exercice de l’activité professionnelle,
          lorsqu’ils sont indispensables à l’exercice d’activités ne pouvant être organisées
          sous forme de télétravail (sur justificatif permanent) ou déplacements
          professionnels ne pouvant être différés `
        },
        {
          id: 1,
          text: 'Déplacement pour achats de première nécessité',
          desc: `déplacements pour effectuer des achats de première nécessité dans des
          établissements autorisés (liste sur gouvernement.fr); `
        },
        {
          id: 2,
          text: 'Déplacement pour motif de santé',
          desc: null
        },
        {
          id: 3,
          text: 'Déplacement pour motif familial impérieux',
          desc: `déplacements pour motif familial impérieux, pour l’assistance aux personnes
          vulnérables ou la garde d’enfants `
        },
        {
          id: 4,
          text: 'Déplacements brefs (à proximité du domicile)',
          desc: `déplacements brefs, à proximité du domicile, liés à l’activité physique individuelle
          des personnes, à l’exclusion de toute pratique sportive collective, et aux besoins
          des animaux de compagnie.`
        }
      ]
    }
  },
  computed: {
    signature() {
      if (this.$refs.signature) {
        this.$refs.signature.saveSignature()
        return this.$refs.signature.$data.signatureImage
      }
      return null
    },
    reasonDesc() {
      let option = this.options.filter(o => o.id === parseInt(this.reason))[0]
      return option !== undefined ? option.desc : null
    },
    pdfURL() {
      return this.pdfPath
        ? `${protocol}://${host}:${port}/preview/${this.pdfPath}`
        : '#'
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

    if (localStorage.name) {
      this.name = localStorage.name
    }
    if (localStorage.birthday) {
      this.birthday = new Date(localStorage.birthday)
    }
    if (localStorage.address) {
      this.address = localStorage.address
    }
    if (localStorage.city) {
      this.city = localStorage.city
    }
    if (localStorage.reason) {
      this.reason = localStorage.reason
    }
    if (localStorage.signature && this.$refs.signature) {
      this.$refs.signature.$data.signatureImage = localStorage.signature
    }
  },
  sockets: {
    connect: function() {
      // console.log('socket connected')
    },
    preview: function(data) {
      this.generated = true
      this.pdfPath = data
    }
  },
  methods: {
    persist() {
      localStorage.setItem('reason', this.reason)
      localStorage.setItem('name', this.name)
      localStorage.setItem('birthday', this.birthday)
      localStorage.setItem('address', this.address)
      localStorage.setItem('signature', this.signature)
    },

    generate() {
      this.persist()
      this.$socket.emit('generate', {
        name: this.name,
        birthday: this.birthday,
        address: this.address,
        city: this.city,
        reason: this.reason,
        signature: this.signature
      })
    },
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
.card {
  padding: 1rem 1.4rem;
}
.media-content {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
