<template>
	<div>
		<b-overlay>
			<template #overlay>
				<b-icon class="d-none"></b-icon>
			</template>
			<div class="laudos-panel user-select-none">
				<div class="laudos-list">
					<div class="laudos-list-header justify-content-between align-items-center user-select-none">
						<h6 id="titulo_laudo" class="laudos-list-title">Laudos</h6>
						<h6 class="mb-0"><b-badge class="p-2 bg-primary">{{ items_laudos.length }}</b-badge></h6>
					</div>
					<div class="box-body">
						<b-form-datepicker @input="getLaudos()" id="laudo-data" size="sm" v-model="data_selecionada" locale="pt-BR" :date-format-options="{ 'year': 'numeric', 'month': 'numeric', 'day': 'numeric'}" offset="100" hide-header class="mb-2"></b-form-datepicker>
						<b-list-group class="border-0" v-if="items_laudos.length > 0">
							<b-list-group-item :active="laudo_selecionado ? laudo.id_exame == laudo_selecionado.id_exame : false" button v-for="laudo of items_laudos" class="item-laudo d-flex align-items-center border-0" :key="laudo.id_exame" @click="mostraDetalhesLaudo(laudo)">
								<div class="chat-item-body">
									<div class="d-flex align-items-center mb-0">
										<h6 class="mb-0">{{ laudo.o_exame.o_paciente.nome }}</h6>
										<small class="ml-auto">{{ formataData(laudo.o_exame.dt_exame, "hh:mm") }}</small>
									</div>
									<span class="span-item-laudo">{{ laudo.nome_especialidade }}</span>
								</div>
							</b-list-group-item>
						</b-list-group>
						<div v-else class="laudos-list-empty">Nenhum laudo na data selecionada</div>
					</div>
				</div>
				<div class="laudo-content" v-if="laudo_selecionado">
					<cp-laudo 
						:nome_paciente="laudo_selecionado.o_exame.o_paciente.nome" 
						:nome_medico_solicitante="laudo_selecionado.o_exame.o_medico_solicitante.nome" 
						:nome_medico_exame="laudo_selecionado.o_medico_laudo.nome" 
						:tipo_exame="laudo_selecionado.nome_especialidade" 
						:ar_textos="laudo_selecionado.ar_texto" 
						:ar_imagens="laudo_selecionado.o_exame.ar_imagens">
					</cp-laudo>
				</div>
				<div v-else class="laudo-content-empty">Nenhum laudo selecionado</div>
			</div>
		</b-overlay>
	</div>
</template>

<script>
	import moment from 'moment';

	export default {
		name: "Laudos",
		computed: {
			user() {
				return this.$store.state.auth.user;
			}
		},
		props: ["id"],
		data() {
			return {
				data_selecionada: new Date(),
				items_laudos: [],
				laudo_selecionado: undefined
			};
		},
		async mounted() {
			await this.getLaudos();
		},
		methods: {
			async getLaudos() {
				try {
					const dt = moment(this.data_selecionada).format("YYYY-MM-DD");
					const items = (await this.$http.get(`/api/laudo/?dt_laudo=${dt}`)).data;
					
					this.items_laudos = items.sort((a,b) => this.formataData(b.o_exame.dt_exame, "hh:mm") - this.formataData(a.o_exame.dt_exame, "hh:mm"));
				} catch (error) {
					this.toast(error.data ? error.data.message || error.data : error.statusText, false);
				}
			},
			async mostraDetalhesLaudo(laudo) {
				this.laudo_selecionado = laudo;
			},
			async criarLaudo(){
				this.$router.push({
					path: `/laudo/${this.laudo_selecionado.id_exame}/`
				});
			},
			formataData(date, formato) {
				return moment(date).format(formato);
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
	.box-body {
		height: calc(100vh - 235px);
		overflow-y: auto;
		padding: 0.75rem;
	}
	.laudos-panel {
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

	.laudos-list {
		width: 300px;
		border-right: 1px solid rgba(226,229,236,.6);
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: #fbfcfe;
	}
	.laudos-list-header {
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

	.laudos-list-title {
		font-size: 16px;
		font-weight: 600;
		color: #212830;
		margin-bottom: 0;
	}

	.laudo-content {
		margin-left: 280px;
		display: block;
		height: 100%;
		position: relative;
		padding: 0 20px;
		overflow-y: scroll
	}

	.laudo-content-empty {
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

	.laudos-list-empty {
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

	.item-laudo {
		display: flex;
		align-items: center;
		padding: 10px;
		border-radius: 4px;
		transition: all .25s;
	}

	.span-item-laudo {
		display: block;
		font-size: .75rem;
		color: #6e7985;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.5;
	}

	.item-laudo.active {
		z-index: 2;
		color: #2679bd;
		background-color: #ddeffd;
		border-color: #007bff;
	}	

	.item-laudo:hover {
		background-color: #eef2f7;
	}

	.item-prontuario {
		overflow-y: scroll;
		height: calc(100vh - 504px);
	}

	.laudo-content section {
		border: 2px solid #666;
	}
</style>