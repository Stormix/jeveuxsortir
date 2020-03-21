<template>
  <div>
    <div v-if="type == 'draw'">
      <div class="flex mb-4">
        <div class="w-10/12">
          <VueSignaturePad
            ref="signaturePad"
            height="200px"
            :custom-style="customStyles"
          />
        </div>
        <div class="w-2/12">
          <div
            class="flex items-center flex-col content-center w-full justify-center"
          >
            <button
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              @click.prevent="type = null"
            >
              <i class="fas fa-times" />
            </button>
            <button
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-1"
              @click.prevent="undo"
            >
              <i class="fas fa-undo" />
            </button>
            <button
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-1"
              @click.prevent="clear"
            >
              <i class="fas fa-eraser" />
            </button>
            <button
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-1"
              @click.prevent="download"
            >
              <i class="fas fa-download" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="type == 'upload'">
      <div class="flex mb-4">
        <div class="w-10/12">
          <!-- <b-upload
            
            class="w-full"
            drag-drop
            native
            style="display:block"
          >
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large" />
                </p>
                <p>Déposez vos fichiers ici ou cliquez pour téléverser</p>
              </div>
            </section>
          </b-upload> -->
          <label
            v-show="!signatureImage"
            class="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-indigo-700 cursor-pointer hover:bg-indigo-700 hover:text-white"
          >
            <svg
              class="w-8 h-8"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"
              />
            </svg>
            <span class="mt-2 leading-normal">
              Cliquez pour téléverser
            </span>
            <input
              id="file"
              ref="file"
              type="file"
              class="hidden"
              @change="handleFileUpload()"
            />
          </label>
          <img
            v-if="signatureImage"
            :src="signatureImage"
            height="200px"
            :style="customStyles"
          />
        </div>
        <div class="w-2/12">
          <div
            class="flex items-center flex-col content-center w-full justify-center"
          >
            <button
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              @click.prevent="type = null"
            >
              <i class="fas fa-times" />
            </button>
            <button
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-2"
              @click.prevent="signatureImage = null"
            >
              <i class="fas fa-trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!type">
      <div
        class="flex items-center flex-row content-between w-full justify-center"
      >
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          @click.prevent="type = 'draw'"
        >
          <i class="fas fa-marker" /> Dessiner
        </button>
        <p class="ml-2">
          ou
        </p>
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded ml-2"
          @click.prevent="type = 'upload'"
        >
          <i class="fas fa-upload" /> Téléverser
        </button>
        <div class="ml-2">
          <p v-if="signatureImage">
            Signature enregistrée:
          </p>
          <img
            v-if="signatureImage"
            :src="signatureImage"
            class="signatureimage"
            :style="customStyles"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: null,
      customStyles: { border: '#454545 2px solid' },
      type: null,
      signatureImage: null
    }
  },
  watch: {
    files(newValue) {
      if (newValue) {
        this.readImage()
      }
    }
  },
  methods: {
    handleFileUpload() {
      this.files = this.$refs.file.files[0]
    },
    readImage() {
      const fr = new FileReader()
      if (!this.files) {
        return
      }
      fr.onload = e => {
        this.signatureImage = e.target.result
      }
      fr.readAsDataURL(this.files)
    },
    undo() {
      this.$refs.signaturePad.undoSignature()
    },
    clear() {
      this.$refs.signaturePad.clearSignature()
    },
    saveSignature() {
      if (!this.type && !this.signatureImage) {
        // show error ?
      }
      if (this.type == 'draw') {
        const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
        if (isEmpty) {
          // show warning!
          this.signatureImage = null
          return
        }
        this.signatureImage = data
      }
      if (this.type == 'upload') {
        this.readImage()
      }
    },
    download() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
      if (isEmpty) {
        // show warning!
        return
      }
      var link = document.createElement('a')
      link.download = 'signature.png'
      link.href = data
      link.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.signatureimage {
  max-height: 200px;
}
</style>
