<template>
	<b-navbar v-if="user" class="menu-app2">
		<draggable tag="b-navbar-nav" :list="items">
			<cp-laudos-tree-node v-for="item of items" :key="item._id" :ident="parseInt(0)"
				:ordem="(item.ordem == undefined ? ordem : item.ordem)" :item="item" @item-clicado="itemClicado">
			</cp-laudos-tree-node>
		</draggable>
	</b-navbar>
</template>

<script>
	import draggable from 'vuedraggable';

	export default {
		name: "CompTree",
		components: {
			draggable
		},
		props: ["items", "ident", "ordem"],
		data() {
			return {
				selectedNode: null,
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
			itemClicado: (item) => {
				item.visible = !item.visible;
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