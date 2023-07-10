<template>
  <div id="app">
    <Loader :isVisible="isLoading"></Loader>
    <Header v-if="this.$store.state.auth.user && app_mode"></Header>
    <Sidebar v-if="app_mode"></Sidebar>
    <div :class="[this.$store.state.auth.user ? 'content ml-250' : 'content']" v-if="app_mode">
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <div v-else>
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <Footer v-if="this.$store.state.auth.user && app_mode"></Footer>
  </div>
</template>

<script>
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Loader from "@/components/layout/Loader";

export default {
  name: "App",
  created() {
    document.title = this.$project.id.replace('.','') + " - " + this.$project.name;
  },
  computed: {
		app_mode() {
			return !this.$route.fullPath.endsWith("pdf");
		}
	},
  components: {
    Header,
    Footer,
    Sidebar,
    Loader
  },
  mounted() {
    this.enableInterceptor();
  },
  data() {
    return {
      isLoading: false,
      axiosInterceptor: null
    };
  },
  methods: {
    enableInterceptor() {
      this.axiosInterceptor = this.$http.interceptors.request.use(
        config => {
          this.isLoading = true;
          return config;
        },
        error => {
          this.isLoading = false;
          return Promise.reject(error);
        }
      );

      this.$http.interceptors.response.use(
        response => {
          this.isLoading = false;
          return response;
        },
        error => {
          this.isLoading = false;
          return Promise.reject(error);
        }
      );
    },

    disableInterceptor() {
      this.$http.interceptors.request.eject(this.axiosInterceptor);
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600&display=swap");


body {
  height:100%;
  margin: 0;
}

#app {
  height: 100%;
  background-color: #fbfcfe;
  color: #41505f;
  margin: 0 auto;
  margin-bottom: 50px;
  font-family: "Open Sans", sans-serif; 
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: start;
  overflow: hidden;
  width: 100%;
  display: block;
}

.content {
  padding: 1.5rem;
  margin-top: 72px;
  background-color: #fbfcfe;
  height: calc(100vh - 122px);
  overflow-y: hidden;
}

.ml-250 {
  margin-left: 250px;
}

.border-3 {
    border-width:3px !important;
}

.box-body {
  padding: 1rem;
}

.modal-xl {
	max-width: 966px;
	min-width: 966px;
}

</style>
