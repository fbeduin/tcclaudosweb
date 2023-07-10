<template>
  <b-navbar class="header user-select-none" toggleable="lg" type="dark" fixed="top">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto" v-if="user">
        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            <b-avatar :text="user.no_usuario[0]" variant="primary" size="36px" class="font-weight-bold"></b-avatar>
          </template>
            <b-dropdown-text class="d-flex flex-column">
              <span class="user-name">{{ user.no_usuario }}</span>
              <span class="user-role">{{ user.role }}</span>
            </b-dropdown-text>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button @click="logout">Sair</b-dropdown-item-button>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import router from '@/router'

export default {
  name: "Header",
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      router.push({name: 'Login'});
    }
  }
};
</script>

<style scoped>

.header {
  height: 72px;
  position: fixed;
  left: 250px;
  top: 0;
  right: 0;
  z-index: 800;
  border-bottom: 1px solid #f3f5f9;
  display: flex;
  align-items: center;
  transition: all .25s;
  box-shadow: 0 1px 1px rgba(33,40,48,.01),0 4px 4px rgba(33,40,48,.01),0 16px 16px rgba(33,40,48,.01);
}

.user-name {
  font-size: 1rem;
  font-family: Open Sans;
  font-weight: 600 !important;
}

.user-role {
  font-size: .8125rem;
  color: #6e7985;
  font-family: Open Sans;
  font-weight: 400 !important;
}

p.b-dropdown-text {
  display: flex;
  flex-direction: column;
}

</style>