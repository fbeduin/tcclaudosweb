<template>
	<div>
		<b-nav-item v-if="!item.menu" :to="item.target" :key="item.nome"
			:link-classes="'text-'+(item.ordem == undefined ? ordem : item.ordem)"
			class="d-flex justify-content-between align-items-center"
			:style="'left: '+ident*25+'px; width: calc(100% - '+ident*25+'px)'">
			<font-awesome-icon :icon="['fas', 'file-alt']" class="mr-2" size="1x" />
			{{ item.nome }}
		</b-nav-item>

		<b-nav-item v-if="item.menu" :aria-expanded="item.visible ? 'true' : 'false'" :aria-controls="item.nome"
			data-toggle="collapse" @click="Emite" :text="item.nome" :key="item.nome"
			:link-classes="'d-flex justify-content-between align-items-center text-'+(item.ordem == undefined ? ordem : item.ordem)" :style="'left: '+ident*25+'px; width: calc(100% - '+ident*25+'px)'">
			<span>
				<font-awesome-icon :icon="['fas', 'caret-right']" class="mr-2" size="1x"
					:class="item.visible ? 'open' : 'closed'" />
				{{ item.nome }}
			</span>
		</b-nav-item>
		
		<b-collapse v-if="item.menu" :id="item.nome" :key="item.nome+'c'" v-model="item.visible" tag="ul">
			<cp-laudos-tree-node :item="item2" :ident="parseInt(ident+1)" v-for="item2 of item.menu"
				:ordem="(item2.ordem == undefined ? ordem : item2.ordem)" :id="item2.nome+'-tr'" :key="item2.nome+'-tr'" @item-clicado="$emit('item-clicado', $event)"></cp-laudos-tree-node>
		</b-collapse>
	</div>
</template>

<script>
	export default {
		name: "CompTreeNode",
		props: ["item", "ident", "ordem"],
		data() {
			return {
				visible: false,
				menus: []
			};
		},
		computed: {
			user() {
				return this.$store.state.auth.user;
			}
		},
		mounted() {
			
		},

		methods: {
			Emite() {
                this.$emit('item-clicado', this.item);
            }
		}
	};
</script>

<style lang="scss" scoped>
	@import "@/assets/styles/variables";

	.navbar.menu-app2 {
		display: block;
		position: relative;
		padding: 0;
		width: 100%;
		z-index: 810;
		user-select: none;
		
		.navbar-text {
			font-size: $font-size-menu-header;
			text-align: left;
			padding: 0px;
			user-select: none;
			cursor: default;
		}

		.navbar-nav {
			flex-direction: column;

			ul {
				list-style: none;
				text-align: left;
				padding-left: 0px;
			}
		}

		.nav-item {
			position: relative;
			margin: 0;
			padding: 0;
			text-align: left;
            margin-bottom: 3px;

			.nav-link {
				font-size: 13px;
				padding: 12px 5px 12px 20px;
				display: block;
				float: left;
				width: 100%;
				font-weight: 500;

				.pull-right {
					position: absolute;
					right: 15px;
					top: 50%;
					margin-top: -7px;
				}

				.open {
					-webkit-transform: rotate(90deg);
					-ms-transform: rotate(90deg);
					-o-transform: rotate(90deg);
					transform: rotate(90deg);
					transition: transform 0.5s ease;
				}

				.closed {
					transition: transform 0.5s ease;
				}
			}

			.dropdown-menu {
				background-color: $cor-paleta-light-grey;
				padding: 0;

				.dropdown-item {
					float: none;
					padding: 12px 5px 12px 15px;
					text-decoration: none;
					display: block;
					text-align: left;
					width: 100%;
					text-decoration: normal;
					font-size: $font-size-base;
				}

				.dropdown-item:hover {
					background-color: $cor-paleta-light-teal;
				}
			}
		}

		.nav-item:hover {
			opacity: 0.8;
		}
	}
</style>