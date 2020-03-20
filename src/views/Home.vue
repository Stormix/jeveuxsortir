<template>
  <div class="container mx-auto">
    <div class="grid gap-4 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
      <div class="w-full rounded overflow-hidden shadow-lg px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Nom Complet
          </label>
          <input
            id="name"
            v-model="name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Mme / M. ..."
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="address"
          >
            Demeurant
          </label>
          <input
            id="address"
            v-model="address"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Demeurant"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="address"
          >
            Né le
          </label>
          <datepicker
            v-model="birthday"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Né le ..."
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="reason"
          >
            Motif de déplacement:
          </label>
          <div class="">
            <select
              v-model="reason"
              class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option
                v-for="option in options"
                :key="option.id"
                :value="option.id"
              >
                {{ option.text }}
              </option>
            </select>
          </div>

          <small v-if="reasonDesc">
            <b>Description:</b>
            {{ reasonDesc }}
          </small>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="city">
            Fait à
          </label>
          <input
            id="city"
            v-model="city"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Ville"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="city">
            Signature
          </label>
          <Signature ref="signature" class="sign my-auto" />
        </div>

        <div class="flex items-center ">
          <button
            v-if="!generated"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            @click.prevent="generate"
          >
            <i class="fas fa-cogs" /> Générer mon attestation
          </button>
          <button
            v-if="generated"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            @click.prevent="generate"
          >
            <i class="fas fa-cogs" /> Regénérer
          </button>
          <a
            v-if="generated"
            :href="pdfURL"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded ml-2"
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
  </div>
</template>

<script>
import Signature from '@/components/Signature'
import axios from 'axios'
import Datepicker from 'vuejs-datepicker'

const ENDPOINT = 'https://nominatim.openstreetmap.org/reverse'
const FORMAT = 'jsonv2'
const port = process.env.VUE_APP_BACKEND_PORT || 3000
const host = process.env.VUE_APP_HOST || 'localhost'
const protocol = process.env.VUE_APP_HTTP || 'http'

export default {
  name: 'Home',
  components: {
    Signature,
    Datepicker
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
      const option = this.options.find(o => o.id == parseInt(this.reason))
      return option && option.desc ? option.desc : ''
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
