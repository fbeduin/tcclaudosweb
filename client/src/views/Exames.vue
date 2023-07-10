<template>
	<div>
		<b-overlay>
			<template #overlay>
				<b-icon class="d-none"></b-icon>
			</template>
			<div class="exames-panel">
				<div class="exames-list">
					<div class="exames-list-header justify-content-between align-items-center user-select-none">
						<h6 id="titulo_laudo" class="exames-list-title">Exames não laudados</h6>
						<h6 class="mb-0"><b-badge class="p-2 bg-primary">{{ itens_exames_filtrados.length }}</b-badge></h6>
					</div>
					<div class="box-body" style="height: calc(100vh - 235px);overflow-y: auto;">
						<b-form-input v-model="inputPesquisa" placeholder="Pesquise pelo nome do paciente" size="sm" class="mb-1" debounce="500" @input="pesquisaPorNome"></b-form-input>
						<b-list-group class="border-0 mt-3" v-if="itens_exames_filtrados.length > 0">
							<b-list-group-item :active="exame_selecionado ? exame.id_exame == exame_selecionado.id_exame : false" button v-for="exame of itens_exames_filtrados" class="item-exame d-flex align-items-center border-0" :key="exame.id_exame" @click="mostraDetalhesExame(exame)">
								<div class="chat-item-body">
									<div class="d-flex align-items-center mb-0">
										<h6 class="mb-0">{{ exame.o_paciente.nome }}</h6>
									</div>
									<span class="span-item-exame">{{ exame.nomeExame }}</span>
								</div>
							</b-list-group-item>
						</b-list-group>
						<div v-else class="exames-list-empty">Nenhum exame encontrado</div>
					</div>
				</div>
				<div class="exames-content user-select-none" v-if="exame_selecionado">
					<div class="d-sm-flex p-2 p-sm-4 p-md-2 p-xl-4">
						<div class="flex-fill">
							<h4 id="cName" class="mb-1 text-nome">{{ exame_selecionado.o_paciente.nome }}</h4>
							<div class="d-flex flex-column mb-3">
								<span>{{ exame_selecionado.nomeExame }}</span>
								<span>{{ formataData(exame_selecionado.dt_exame, "DD/MM/YYYY hh:mm") }}</span>
							</div>
							<div class="d-flex">
								<b-button variant="primary" class="px-5" size="md" @click="criarLaudo()">
									Criar Laudo
								</b-button>
								<b-button class="ml-1" variant="secondary" v-b-modal.modal-img>Imagens</b-button>
							</div>
						</div>
					</div>

					<hr>

					<div class="row">
						<div class="col-4 text-right text-secondary">Data de Nascimento</div>
						<div class="col">{{ formataData(exame_selecionado.o_paciente.dt_nascimento, "DD/MM/YYYY") }}</div>
					</div>
					<div class="row mt-2">
						<div class="col-4 text-right text-secondary">Sexo</div>
						<div class="col">{{ exame_selecionado.o_paciente.sexo }}</div>
					</div>

					<hr>

					<div class="row">
						<div class="col-4 text-right text-secondary">Prontuário</div>
						<div class="col d-flex flex-column item-prontuario">
							<span v-for="(parag, idx) in exame_selecionado.o_paciente.prontuario.split('\n')" :key="`parag-${idx}`" class="mb-2">{{ parag }}</span>
						</div>
					</div>				
          
				</div>
				<div v-else class="exames-content-empty user-select-none">Nenhum exame selecionado</div>
			</div>
		</b-overlay>

		<b-modal v-if="exame_selecionado != null" hide-header hide-footer id="modal-img" size="lg">
			<b-carousel
			id="carousel-no-animation"
			ref="carousel"
			style="text-shadow: 0px 0px 2px #000"
			no-animation
			indicators
			interval=0
			img-width="400"
			img-height="480">
				<b-carousel-slide caption-tag="span" v-for="(imagem, idx) of exame_selecionado.ar_imagens" :key="`img_${idx+1}`" :caption="`Imagem ${idx}`" :img-src="imagem"></b-carousel-slide>
			</b-carousel>
		</b-modal>

	</div>
</template>

<script>
	import moment from 'moment';
	
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
				items_exames: [],
				itens_exames_filtrados: [],
				exame_selecionado: undefined,
				inputPesquisa: ''
			};
		},
		async mounted() {
			await this.getExames();
		},
		methods: {
			async pesquisaPorNome(str) {
				this.itens_exames_filtrados = str == '' ? this.items_exames : this.items_exames.filter(el =>  el.o_paciente.nome.toLowerCase().includes(str.toLowerCase()));
			},
			async getExames() {
				try {
					const items = (await this.$http.get(`/api/exame/`)).data;
					items.forEach(it => it.nomeExame = this.nomeExame(it.no_especialidade));
					this.items_exames = items.sort((a, b) => this.ts(a.dt_exame) -  this.ts(b.dt_exame));
					this.itens_exames_filtrados = this.items_exames;
				} catch (error) {
					this.toast(error.data ? error.data.message || error.data : error.statusText, false);
				}
			},
			async mostraDetalhesExame(exame) {
				this.exame_selecionado = exame;
			},
			async criarLaudo(){
				this.$router.push({
					path: `/laudo/${this.exame_selecionado.id_exame}/`
				});
			},
			formataData(date, formato) {
				return moment(date).format(formato);
			},
			ts(date) {
				return new Date(date).getTime();
			},
			nomeExame(esp) {
				switch (esp) {
					case "eda": 
						return "Endoscopia Digestiva Alta";
					case "colono": 
						return "Colonoscopia";
					case "phmetria": 
						return "phMetria";
					case "teste_respiratorio": 
						return "Teste Respiratório";
				}
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
	.exames-panel {
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

	.exames-list {
		width: 300px;
		border-right: 1px solid rgba(226,229,236,.6);
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: #fbfcfe;
	}
	.exames-list-header {
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

	.exames-list-title {
		font-size: 16px;
		font-weight: 600;
		color: #212830;
		margin-bottom: 0;
	}

	.exames-content {
		margin-left: 280px;
		display: block;
		height: 100%;
		overflow: hidden;
		position: relative;
		padding: 0 20px;
	}

	.exames-content-empty {
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

	.exames-list-empty {
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