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
            <b-button type="is-danger" @click.prevent="type = null">
              <i class="fas fa-times" />
            </b-button>
            <b-button type="is-primary" class="mt-1" @click.prevent="undo">
              <i class="fas fa-undo" />
            </b-button>
            <b-button type="is-primary" class="mt-1" @click.prevent="clear">
              <i class="fas fa-eraser" />
            </b-button>
            <b-button type="is-primary" class="mt-1" @click.prevent="download">
              <i class="fas fa-download" />
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="type == 'upload'">
      <div class="flex mb-4">
        <div class="w-10/12">
          <b-upload
            v-show="!signatureImage"
            v-model="files"
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
          </b-upload>
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
            <b-button type="is-danger" @click.prevent="type = null">
              <i class="fas fa-times" />
            </b-button>
            <b-button
              type="is-primary"
              class="mt-2"
              @click.prevent="signatureImage = null"
            >
              <i class="fas fa-undo" />
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!type">
      <div
        class="flex items-center flex-row content-between w-full justify-center"
      >
        <b-button type="is-primary" class="" @click.prevent="type = 'draw'">
          <i class="fas fa-marker" /> Dessiner
        </b-button>
        <p class="ml-2">
          ou
        </p>
        <b-button
          type="is-primary"
          class="ml-2"
          @click.prevent="type = 'upload'"
        >
          <i class="fas fa-upload" /> Téléverser
        </b-button>
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
