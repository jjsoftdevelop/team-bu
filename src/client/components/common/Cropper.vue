<template>
  <div class="cropper">
    <!-- <div class="text-success">{{ imgSrc }}</div> -->
    <div
      class="cropper--input"
      v-show="!imgSrc"
      @click.prevent="showFileChooser"
    >
      <div class="cropper--icon text-center">
        <div>
          <svg
            width="40"
            height="41"
            viewBox="0 0 40 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 22.1374V12.9708C12.5 12.3077 12.7634 11.6718 13.2322 11.203C13.7011 10.7342 14.337 10.4708 15 10.4708C15.663 10.4708 16.2989 10.7342 16.7678 11.203C17.2366 11.6718 17.5 12.3077 17.5 12.9708V22.1374"
              stroke="#21B39A"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M32.5 21.3041V26.7207C32.5 32.0132 28.2092 36.3041 22.9167 36.3041H22.0833C16.7908 36.3041 12.5 32.0132 12.5 26.7207V21.3041"
              stroke="#21B39A"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17.5 24.6374V20.4708C17.5 19.8077 17.7634 19.1718 18.2322 18.703C18.7011 18.2342 19.337 17.9708 20 17.9708C20.663 17.9708 21.2989 18.2342 21.7678 18.703C22.2366 19.1718 22.5 19.8077 22.5 20.4708M22.5 20.4708V24.6374M22.5 20.4708C22.5 19.8077 22.7634 19.1718 23.2322 18.703C23.7011 18.2342 24.337 17.9708 25 17.9708C25.663 17.9708 26.2989 18.2342 26.7678 18.703C27.2366 19.1718 27.5 19.8077 27.5 20.4708M27.5 20.4708V24.6374M27.5 20.4708C27.5 19.8077 27.7634 19.1718 28.2322 18.703C28.7011 18.2342 29.337 17.9708 30 17.9708C30.663 17.9708 31.2989 18.2342 31.7678 18.703C32.2366 19.1718 32.5 19.8077 32.5 20.4708V24.6374"
              stroke="#21B39A"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M23.3332 12.9708C23.3353 11.187 22.7632 9.44999 21.7015 8.01662C20.9272 6.96779 19.9173 6.11556 18.7533 5.5286C17.5892 4.94165 16.3035 4.6364 14.9998 4.63745C13.6962 4.6364 12.4105 4.94165 11.2464 5.5286C10.0823 6.11556 9.07247 6.96779 8.29818 8.01662C7.23647 9.44999 6.66437 11.187 6.66651 12.9708"
              stroke="#21B39A"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div class="text-success text-l mb-2">點擊上傳圖片</div>
        <div class="text-s text-grey">建議圖檔寬度至少1028px以上</div>
      </div>
    </div>
    <input
      id="upload"
      ref="input"
      type="file"
      name="image"
      accept="image/*"
      @change="setImage"
    />
    <div class="content" v-show="imgSrc">
      <section class="cropper-area">
        <div class="img-cropper">
          <vue-cropper
            ref="cropper"
            :aspect-ratio="10 / 3"
            dragMode="move"
            :zoomable="false"
            preview=".preview"
          />
        </div>
        <div class="actions">
          <!-- <a href="#" role="button" @click.prevent="zoom(0.2)"> Zoom In </a>
          <a href="#" role="button" @click.prevent="zoom(-0.2)"> Zoom Out </a>
          <a href="#" role="button" @click.prevent="move(-10, 0)">
            Move Left
          </a>
          <a href="#" role="button" @click.prevent="move(10, 0)">
            Move Right
          </a>
          <a href="#" role="button" @click.prevent="move(0, -10)"> Move Up </a>
          <a href="#" role="button" @click.prevent="move(0, 10)"> Move Down </a>
          <a href="#" role="button" @click.prevent="rotate(90)">
            Rotate +90deg
          </a>
          <a href="#" role="button" @click.prevent="rotate(-90)">
            Rotate -90deg
          </a>
          <a ref="flipX" href="#" role="button" @click.prevent="flipX">
            Flip X
          </a>
          <a ref="flipY" href="#" role="button" @click.prevent="flipY">
            Flip Y
          </a>
          
          
          <a href="#" role="button" @click.prevent="getData"> Get Data </a>
          <a href="#" role="button" @click.prevent="setData"> Set Data </a>
          <a href="#" role="button" @click.prevent="getCropBoxData">
            Get CropBox Data
          </a>
          <a href="#" role="button" @click.prevent="setCropBoxData">
            Set CropBox Data
          </a>
           -->
          <div class="d-flex justify-content-center">
            <b-button
              @click.prevent="reset"
              class="px-6 btn-l btn btn-light text-info font-weight-bold mr-6"
              pill
            >
              重置
            </b-button>
            <b-button
              class="btn-l"
              variant="success"
              pill
              @click.prevent="getImage"
              >取得照片</b-button
            >
          </div>
          <!-- <a href="#" role="button" @click.prevent="reset"> 重置 </a> -->

          <!-- <a href="#" role="button" @click.prevent="cropImage"> Crop </a> -->
          <!-- <a href="#" role="button" @click.prevent="getImage">取得照片</a> -->
        </div>

        <!-- <textarea v-model="data" /> -->
      </section>
      <section class="preview-area" v-show="data">
        <!-- <p>Preview</p>
        <div class="preview" /> -->
        <!-- <p>Cropped Image</p>
        <div class="cropped-image">
          <img v-if="cropImg" :src="cropImg" alt="Cropped Image" />
          <div v-else class="crop-placeholder" />
        </div> -->
      </section>
    </div>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
export default {
  components: {
    VueCropper,
  },
  data() {
    return {
      imgSrc: "",
      //   imgSrc: "https://picsum.photos/250/250/?image=54",
      cropImg: "",
      data: null,
      file: "",
    };
  },
  methods: {
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    flipX() {
      const dom = this.$refs.flipX;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleX(scale);
      dom.setAttribute("data-scale", scale);
    },
    flipY() {
      const dom = this.$refs.flipY;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleY(scale);
      dom.setAttribute("data-scale", scale);
    },
    getCropBoxData() {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);
    },
    getData() {
      this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4);
    },
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    reset() {
      this.$refs.cropper.reset();
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg);
    },
    setCropBoxData() {
      if (!this.data) return;
      this.$refs.cropper.setCropBoxData(JSON.parse(this.data));
    },
    setData() {
      if (!this.data) return;
      this.$refs.cropper.setData(JSON.parse(this.data));
    },
    setImage(e) {
      this.file = e.target.files[0];
      const { file } = this;
      if (file.type.indexOf("image/") === -1) {
        alert("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
    getImage() {
      this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
        const filename = "cropperImage" + blob.type.replace("image/", ".");
        const file = new File([blob], filename, {
          type: blob.type,
        });
        console.log(filename);
        this.$emit("getFileObj", file);
        this.$emit("closeCropperModal");
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
body {
  font-family: Arial, Helvetica, sans-serif;
  width: 1024px;
  margin: 0 auto;
}
input[type="file"] {
  display: none;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 5px 0;
}
.header h2 {
  margin: 0;
}
.header a {
  text-decoration: none;
  color: black;
}
.content {
  display: flex;
  justify-content: space-between;
}
.cropper-area {
  width: 614px;
}
.actions {
  margin-top: 1rem;
}
.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #0062cc;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
textarea {
  width: 100%;
  height: 100px;
}
.preview-area {
  width: 307px;
}
.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}
.preview-area p:last-of-type {
  margin-top: 1rem;
}
.preview {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
}
.crop-placeholder {
  width: 100%;
  height: 200px;
  background: #ccc;
}
.cropped-image img {
  max-width: 100%;
}
.cropper {
  &--input {
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 219px;
    border: 2px dashed $Success-500;
  }
  &--icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
