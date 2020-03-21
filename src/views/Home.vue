<template>
  <div class="container mx-auto my-auto">
    <div class="grid gap-4 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
      <div class="w-full rounded overflow-hidden shadow-lg px-8 pt-6 pb-8 mb-4">
        <h1 class="text-3xl">
          Générateur d'attestation de déplacement
        </h1>
        <div
          v-if="!isValid && submitted"
          class="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md"
          role="alert"
        >
          <div class="flex">
            <div class="py-1">
              <svg
                class="fill-current h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
                />
              </svg>
            </div>
            <div>
              <p class="font-bold">
                Erreur !
              </p>
              <p class="text-sm">
                Merci de remplir tout les champs.
              </p>
            </div>
          </div>
        </div>
        <div class="mt-4 mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Nom Complet
          </label>
          <input
            id="name"
            v-model="name"
            required
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
            for="birthday"
          >
            Né le
          </label>
          <input
            id="birthday"
            v-model="birthday"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
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
        <div
          class="flex items-center bg-blue-500 text-white text-sm px-4 py-3 mb-2 mt-2"
          role="alert"
        >
          <svg
            class="fill-current w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"
            />
          </svg>
          <p>
            Apparement les versions numériques de l'attestation ne sont plus
            acceptées. Veuillez imprimer le document généré pour éviter les
            problèmes avec les autorités.
            <a
              class="font-bold"
              href="https://twitter.com/Place_Beauvau/status/1240236276416118784"
            >
              Source
            </a>
          </p>
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

const ENDPOINT = 'https://nominatim.openstreetmap.org/reverse'
const FORMAT = 'jsonv2'
const port = process.env.VUE_APP_BACKEND_PORT || 3000
const host = process.env.VUE_APP_HOST || 'localhost'
const protocol = process.env.VUE_APP_HTTP || 'http'

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
      submitted: false,
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
    isValid() {
      return (
        !!this.name &&
        !!this.reason &&
        !!this.birthday &&
        !!this.address &&
        !!this.city
      )
    },
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
        ? process.env.NODE_ENV === 'production'
          ? `${protocol}://${host}/preview/${this.pdfPath}`
          : `${protocol}://${host}:${port}/preview/${this.pdfPath}`
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
      if (this.signature) {
        localStorage.setItem('signature', this.signature)
      }
    },

    generate() {
      if (!this.isValid) {
        this.submitted = true
        return
      }
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
