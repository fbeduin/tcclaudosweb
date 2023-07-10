<template>
	<div>
		<b-overlay>
			<template #overlay>
				<b-icon class="d-none"></b-icon>
			</template>
			<div class="contact-panel">
				<div class="contact-list">
					<div class="contact-list-header justify-content-between align-items-center user-select-none">
						<h6 id="titulo_laudo" class="contact-list-title">Médicos cadastrados</h6>
						<div>
							<b-button size="sm" variant="primary" @click="salvar()" v-b-tooltip.hover title="Adicionar médico">
								<font-awesome-icon class="icon-action" :icon="['fas', 'plus']" />
							</b-button>
						</div>
					</div>
					<div class="box-body" style="height: calc(100vh - 235px);overflow-y: auto;">
						<b-list-group class="border-0 mt-1" v-if="usuarios.length > 0">
							<b-list-group-item :active="usuario ? usuario._id == usuario_selecionado._id : false" button v-for="usuario of usuarios" class="item-exame d-flex align-items-center border-0" :key="usuario.no_usuario" @click="mostraDetalhesUsuario(usuario)">
								<div class="chat-item-body">
									<div class="d-flex align-items-center mb-0">
										<h6 class="mb-0">{{ usuario.no_usuario }}</h6>
									</div>
									<span class="span-item-exame">{{ usuario.role }}</span>
								</div>
							</b-list-group-item>
						</b-list-group>
						<div v-else class="contact-list-empty">Nenhum usuário cadastrado</div>
					</div>
				</div>
				<div class="contact-content user-select-none" v-if="usuario_selecionado">
					<div class="d-sm-flex p-2 p-sm-4 p-md-2 p-xl-4">
						<div class="flex-fill">
							<h4 id="cName" class="mb-1 text-nome">{{ usuario_selecionado.no_usuario }}</h4>
							<div class="d-flex flex-column mb-3">
								<span>{{ usuario_selecionado.no_usuario }}</span>
								<span>{{ usuario_selecionado.no_usuario }}</span>
							</div>
							<div class="d-flex">
								<b-button variant="primary" class="px-5" size="md" @click="criarLaudo()">
									Laudo
								</b-button>
								<b-button class="ml-1" variant="secondary" v-b-modal.modal-img>Imagens</b-button>
							</div>
						</div>
					</div>

					<hr>

					<div class="row">
						<div class="col-4 text-right text-secondary">Data de Nascimento</div>
						<div class="col">{{ usuario_selecionado.no_usuario }}</div>
					</div>
					<div class="row mt-2">
						<div class="col-4 text-right text-secondary">Sexo</div>
						<div class="col">{{ usuario_selecionado.no_usuario }}</div>
					</div>          
				</div>
				<div v-else class="contact-content-empty user-select-none">Nenhum usuário selecionado</div>
			</div>
		</b-overlay>

	<b-modal hide-header hide-footer id="modal-cadastro" size="lg">
		
	</b-modal>
	</div>
</template>

<script>
	export default {
		name: "Exames",
		computed: {
			user() {
				return this.$store.state.auth.user;
			}
		},
		props: ["id"],
		data() {
			return {
				usuarios: [],
				usuario_selecionado: {}
			};
		},
		async mounted() {
			await this.getUsuarios();
		},
		methods: {
			async getUsuarios() {
				try {
					const items = (await this.$http.get(`/api/usuario/`)).data;
					this.usuarios = items.sort((a, b) => a.no_usuario > b.no_usuario);
				} catch (error) {
					this.toast(error.data ? error.data.message || error.data : error.statusText, false);
				}
			},
			async mostraDetalhesUsuario(usuario) {
				this.usuario_selecionado = usuario;
			},
			async cadastrarUsuario(){
				const usuario = {

				};
				await this.$http.post(`/api/usuario/`, usuario);
			},
			toast(mensagem, sucesso) {
				const title = sucesso ? "Sucesso" : "Erro";
				const variant = sucesso ? "success" : "danger";
				this.$root.$bvToast.toast(mensagem, {
					title: title,
					variant: variant,
					solid: true,
				});
			}
		}
	};
</script>
<style scoped>
	.contact-panel {
		position: relative;
		height: calc(100vh - 170px);
		display: flex;
		flex: 1;
		background-color: #fff;
		box-shadow: 0 1px 2px rgba(204,210,218,.07),0 2px 4px rgba(204,210,218,.07),0 4px 8px rgba(204,210,218,.07),0 8px 16px rgba(204,210,218,.07),0 16px 32px rgba(204,210,218,.07),0 32px 64px rgba(204,210,218,.07);
		border-radius: 6px;
		position: relative;
		transition: all .25s;
		padding: 1.5rem !important;
	}

	.contact-list {
		width: 300px;
		border-right: 1px solid rgba(226,229,236,.6);
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: #fbfcfe;
	}
	.contact-list-header {
		height: 60px;
		background-color: #fff;
		border-top-left-radius: 6px;
		border-top-right-radius: inherit;
		padding-left: 20px;
		padding-right: 15px;
		border-bottom: 1px solid rgba(226,229,236,.6);
		display: flex;
		align-items: center;
	}

	.contact-list-title {
		font-size: 16px;
		font-weight: 600;
		color: #212830;
		margin-bottom: 0;
	}

	.contact-content {
		margin-left: 280px;
		display: block;
		height: 100%;
		overflow: hidden;
		position: relative;
		padding: 0 20px;
	}

	.contact-content-empty {
		margin-left: 280px;
		display: flex;
		height: 100%;
		width: 100%;
		overflow: hidden;
		position: relative;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-weight: 300;
		font-size: 20px;
		color: rgba(110,121,133,.4);
	}

	.row {
		--bs-gutter-x: 1.5rem;
		--bs-gutter-y: 0;
		display: flex;
		flex-wrap: wrap;
		margin-top: calc(-1*var(--bs-gutter-y));
		margin-right: calc(-0.5*var(--bs-gutter-x));
		margin-left: calc(-0.5*var(--bs-gutter-x));
	}

	.text-nome {
		font-weight: 600 !important;
		font-size: 1.3125rem !important;
		color: #212830;
	}

	.btn {
		font-size: 0.875rem;
		font-weight: 400;
		line-height: 1.5;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		user-select: none;
		border: 1px solid transparent;
		border-radius: 0.25rem;
		color: #fff;
		transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
	}

	.btn-primary {
		background-color: #2679bd;
	}

	.bg-primary {
		background-color: #2679bd;
	}

	.chat-item-body {
		padding-left: 10px;
		flex: 1;
		width: calc(100% - 46px);
	}

	.chat-item-body small {
		font-size: 11px;
		font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
		color: #6e7985;
	}

	h6 {
		font-size: 0.875rem;
	}

	.item-exame {
		display: flex;
		align-items: center;
		padding: 10px;
		border-radius: 4px;
		transition: all .25s;
	}

	.span-item-exame {
		display: block;
		font-size: .75rem;
		color: #6e7985;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.5;
	}

	.item-exame.active {
		z-index: 2;
		color: #2679bd;
		background-color: #ddeffd;
		border-color: #007bff;
	}	

	.item-prontuario {
		overflow-y: scroll;
		height: calc(100vh - 504px);
	}

	.sidebar-label {
		display: block;
		margin-bottom: 5px;
		padding: 0 10px;
		font-size: .75rem;
		font-weight: 500;
		color: #6e7985;
	}

	.contact-list-empty {
		display: flex;
		height: 50%;
		width: 100%;
		overflow: hidden;
		position: relative;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-weight: 300;
		font-size: 20px;
		color: rgba(110,121,133,.4);
	}
</style>