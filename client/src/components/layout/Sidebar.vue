<template>
  <div class="sidebar user-select-none" v-if="user">
    
    <div class="sidebar-header">
      <span class="sidebar-logo">{{ titulo }}</span>
    </div>
    <div class="sidebar-menu">
      <div class="sidebar-menu-header">MENU PRINCIPAL</div>
      <b-nav vertical class="sidebar-menu-itens justify-content-start">
        <template v-for="menu of menus">
          <b-nav-item v-if="!menu.submenus && showMenu(menu.roles)" :to="menu.target" :key="menu.id">
            <font-awesome-icon v-if="menu.icon" class="mr-1" :icon="['fas', menu.icon]" />
            <span class="ml-2">{{ menu.title }}</span>
          </b-nav-item>

          <b-nav-item v-if="menu.submenus && showMenu(menu.roles)" :aria-expanded="menu.visible ? 'true' : 'false'"
            :aria-controls="menu.id" @click="menu.visible = !menu.visible" :to="menu.target" :text="menu.title"
            :key="menu.id">
            <b-icon v-if="menu.icon" :icon="menu.icon"></b-icon>
            <span class="ml-2">{{ menu.title }}</span>
            <font-awesome-icon :icon="['fas', 'angle-down']" size="1x" class="pull-right" />
          </b-nav-item>
          <b-collapse v-if="menu.submenus" :id="menu.id" :key="menu.id+'c'" v-model="menu.visible" tag="ul">
            <template v-for="submenu of menu.submenus">
              <b-nav-item v-if="showMenu(submenu.roles)" :key="submenu.id" :to="submenu.target">
                <b-icon v-if="submenu.icon" :icon="submenu.icon" class="mr-1"></b-icon>
                {{ submenu.title }}
              </b-nav-item>
            </template>
          </b-collapse>
        </template>
      </b-nav>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CxMenu",
    data() {
      return {
        hover: false,
        visible: false,
        menus: [],
        itemsEdicao: []
      };
    },
    computed: {
      user() {
        return this.$store.state.auth.user;
      },
      titulo() {
        return this.$project.id;
      }
    },
    async mounted() {
      await this.getEspecialidades();
      const menus = this.$project.menus;
      const menuEdicao = menus.find(el => el.id == "edicao");
      this.itemsEdicao.forEach(item => {
        menuEdicao.submenus.push({
          "id": `edicao${item.especialidade}`,
					"title": item.nome,
					"target": `/edicao/${item.especialidade}`,
					"description": item.nome,
					"roles": ["Médico"]
        });
      });
      for (let menu in menus) {
        menus[menu].visible = false;
      }
      this.menus = menus;
    },
    methods: {
      showMenu(roles) {
        let user = this.$store.state.auth.user;
        if (roles && roles.indexOf(user.role) < 0) {
          return false;
        }
        return true;
      },
      async getEspecialidades() {
        const items = (await this.$http.get(`/api/template/tipos`)).data;
        this.itemsEdicao = items;
      }
    }
  };
</script>

<style>
  .sidebar {
    width: 250px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    opacity: 1;
    visibility: visible;
    background-color: #fff;
    z-index: 1000;
    transition: all .25s;
    box-shadow: 1px 0 1px rgba(33,40,48,.01),4px 0 4px rgba(33,40,48,.01),16px 0 16px rgba(33,40,48,.01);
    background-image: linear-gradient(to bottom, #20639a, #2679bd);
  }

  .sidebar-header {
    padding: 0 20px;
    height: 72px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,.12);
  }

  .sidebar-logo {
    font-size: 24px;
    font-family: "Archivo",sans-serif;
    font-weight: 600;
    display: inline-block;
    line-height: 1;
    color: #fff;
    letter-spacing: -0.5px;
    position: relative;
  }

  .sidebar-menu {
    height: calc(100% - 72px);
    position: relative;
  }

  .sidebar-menu-header {
    display: block;
    padding: 12px 20px;
    font-size: 11px;
    font-family: "Archivo",sans-serif;
    text-transform: uppercase;
    color: #84aac9;
    letter-spacing: .7px;
    position: relative;
    text-align: left;
  }

  .sidebar-menu-itens {
    height: 100% !important;
    font-family: Open Sans;
    color: rgba(255,255,255,.6) !important;
    list-style: none;
    letter-spacing: -0.1px;
    font-weight: 400;
  }

  .navbar-text {
    color: #333;
    background: #007bb7;
    font-size: 0.9rem;
    text-align: left;
    padding: 10px;
    user-select: none;
    cursor: default;
  }

  .navbar-nav {
    flex-direction: column;
  }

  ul {
    list-style: none;
  } 

  .nav-item {
    position: relative;
    margin: 0;
    padding: 0;
    text-align: left;
    text-decoration: none;
  }

  a {
    color: rgba(255,255,255,.6) !important;
  }

  .nav-link {
    color: #C6D4DA;
    font-size: 0.9rem;
    
    display: flex;
    align-items: center;
    padding: 8px 20px;
  }

  .pull-right {
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -7px;
  }
</style>