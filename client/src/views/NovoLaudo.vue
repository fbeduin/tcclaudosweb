<template>
	<div class="user-select-none">
		<VueDragResize :isActive="true" :w="imagem_selecionada.w" :h="imagem_selecionada.h" :x="560" :y="110" :z="1500" :aspectRatio="true" v-if="imagem_selecionada" :sticks="['br']">
			<b-button size="sm" variant="secondary" @click="imagem_selecionada = undefined" class="position-absolute rounded-0 end-0">
				<span aria-hidden="true">&times;</span>
			</b-button>
			<img :src="imagem_selecionada.src" width="100%" height="100%">
        </VueDragResize>
		
		<div class="contact-panel" v-if="exame && nome_especialidade">
			<div class="textos-list">
				<div class="textos-list-header d-flex flex-row justify-content-between align-items-center">
					<div class="d-flex flex-column align-items-start align-self-center">
						<h6 id="titulo_laudo" class="textos-list-title">Laudo - {{ nome_especialidade }}</h6>
						<small id="titulo_laudo" class="textos-list-title">Paciente: {{ exame.o_paciente.nome }}</small>
						<small id="titulo_laudo" class="textos-list-title">Data exame: {{ formataData(exame.dt_exame, "DD/MM/YYYY hh:mm") }}</small>
					</div>
				</div>
				<div class="arvore box-body d-flex flex-column justify-content-between align-self-start">
					<el-tree accordion :data="items_laudo" :props="defaultProps" node-key="id" ref="tree"
						class="tree font-weight-normal user-select-none mb-2" :expand-on-click-node="true"
						@node-click="clickItemLaudo">
						<span class="custom-tree-node cor-texto" slot-scope="{ node, data }">
							<font-awesome-icon v-if="!data.menu" :icon="['fas', 'file-alt']"
								class="icone" />
							<span class="ml-1">{{ node.label }}</span>
						</span>
					</el-tree>
					<b-container fluid class="thumbs p-1 mb-0 d-flex flex-row justify-content-between align-items-center">
						<b-img v-for="(imagem, idx) of exame.ar_imagens" :key="`th-${idx}`"  :src="imagem" class="cur-pointer h-100 p-1 border border-primary border-3" @click="mostrarImagem(imagem)"></b-img>
					</b-container>
				</div>
				<b-overlay :show="boolEdicao" no-wrap>
					<template #overlay>
						<b-icon class="d-none"></b-icon>
					</template>
				</b-overlay>
			</div>

			<div class="textos-list2" v-if="items_selecionados.length">
				<div class="textos-list-header d-flex flex-column align-items-start align-self-center justify-content-center">
					<h6 id="titulo_laudo" class="textos-list-title">Itens selecionados</h6>
					<small id="titulo_laudo" class="textos-list-title">Arraste para reordenar os itens</small>
				</div>
				<div class="items box-body">
					<draggable tag="ul" :list="items_selecionados" class="list-group">
						<li :class="`list-group-item cor-texto d-flex justify-content-between align-items-center m-1 text-white item-selecionado`"
							v-for="(element, idx) in items_selecionados" :key="element._id"
							@mouseover="mouseOverItem(element)" @mouseout="mouseOutItem()">
							<span class="text">{{ element.nome }} </span>
							<div class="item-selecionado-acoes">
								<font-awesome-icon class="cur-pointer icon-action mr-2" :icon="['fas', 'edit']" @click="editar(element)" />
								<font-awesome-icon class="cur-pointer icon-action mr-2" :icon="['fas', 'trash']" @click="remover(idx)" />
							</div>
						</li>
					</draggable>
				</div>
				<b-overlay :show="boolEdicao" no-wrap>
					<template #overlay>
						<b-icon class="d-none"></b-icon>
					</template>
				</b-overlay>
			</div>
			
			<div class="textos-list3" v-if="items_selecionados.length">
				<div class="textos-list-header d-flex flex-row align-items-center justify-content-between">
					<h6 id="titulo_laudo" class="textos-list-title">Texto</h6>
					<div>
						<b-button size="sm" variant="success" v-if="boolEdicao" @click="closeEdicao()" v-b-tooltip.hover title="Finalizar edição">
							<font-awesome-icon class="icon-action" :icon="['fas', 'check']" />
						</b-button>
						<b-button size="sm" variant="primary" v-if="!boolEdicao" @click="salvarLaudo()" class="mr-1" v-b-tooltip.hover title="Salvar">
							<font-awesome-icon class="icon-action" :icon="['fas', 'save']" />
						</b-button>
						<b-button size="sm" variant="secondary" v-if="!boolEdicao" v-b-tooltip.hover title="Visualizar" v-b-modal.modal-laudo>
							<font-awesome-icon class="icon-action" :icon="['fas', 'eye']" />
						</b-button>
						
					</div>
				</div>			
				<div class="items box-body">
					<div id="texto" class="texto d-flex flex-column align-items-start"> 
						<div v-for="item of items_selecionados.filter(el => el.texto)" :key="`txt${item._id}`" v-html="item.texto" class="mb-3" :id="`texto-${item._id}`"></div>

						<div v-if="items_selecionados.filter(el => el.conclusao).length > 0" class="font-weight-bold mb-1">Conclusão:</div>
						<div v-for="(item, idx) of items_selecionados.filter(el => el.conclusao)" :key="`con${item._id}`" class="mb-3 ml-2 d-flex flex-line justify-content-between">
							<span class="mr-1">{{ idx+1 }} - </span>
							<span v-html="item.conclusao" :id="`conclusao-${item._id}`"></span>
						</div>

						<div v-if="items_selecionados.filter(el => el.obs).length > 0" class="font-weight-bold mb-1">Obs:</div>
						<div v-for="item of items_selecionados.filter(el => el.obs)" :key="`obs${item._id}`" v-html="item.obs" class="mb-3 ml-2" :id="`obs-${item._id}`"></div>

						<div v-if="items_selecionados.filter(el => el.ref).length > 0" class="font-weight-bold mb-1">Ref:</div>
						<div v-for="item of items_selecionados.filter(el => el.ref)" :key="`ref${item._id}`" v-html="item.ref" class="mb-3 ml-2" :id="`ref-${item._id}`"></div>
					</div>
				</div>
			</div>
			<div v-else class="contact-content-empty">Nenhum texto selecionado</div>
		</div>
		<b-modal v-if="exame && items_selecionados.length > 0 && nome_especialidade" title="Prévia do laudo" hide-footer id="modal-laudo" size="xl">
			<div class="folha-laudo">
				<cp-laudo 
					:nome_paciente="exame.o_paciente.nome" 
					:nome_medico_solicitante="exame.o_medico_solicitante.nome" 
					:nome_medico_exame="exame.o_medico_exame.nome" 
					:tipo_exame="nome_especialidade" 
					:ar_textos="items_selecionados" 
					:ar_imagens="exame.ar_imagens">
				</cp-laudo>
			</div>
		</b-modal>
	</div>
</template>

<script>
	import draggable from 'vuedraggable';
	import moment from 'moment';
	import VueDragResize from 'vue-drag-resize';

	export default {
		name: "NovoLaudo",
		components: {
			draggable,
			VueDragResize
		},
		computed: {
			user() {
				return this.$store.state.auth.user;
			}
		},
		props: ["id"],
		data() {
			return {
				width: 0,
                height: 0,
                top: 0,
                left: 0,
				exame: undefined,
				items_laudo: [],
				items_selecionados: [],
				nome_especialidade: '',
				defaultProps: {
					children: 'menu',
					label: 'nome',
					isLeaf: 'menu'
				},
				edicao: false,
				text: '',
				mnuContexto: [],
				itemHover: {},
				boolEdicao: false,
				itemEdicao: {},
				edit_texto: '',
				tam_imagens: [],
				imagem_selecionada: undefined
			};
		},
		async mounted() {
			await this.getExame(this.id);
			await this.getTemplatesLaudo();
			await this.lerImagens();
		},
		methods: {
			async mostrarImagem(imagem) {
				const img = await this.loadImage(imagem);
				const obj = {
					src: imagem,
					w: img.width,
					h: img.height
				};
				this.imagem_selecionada = obj;
			},
			async lerImagens() {
				if (!this.exame) return;
				for (let i=0; i < this.exame.ar_imagens.length; i++) {
					const img = await this.loadImage(this.exame.ar_imagens[i]);
					this.tam_imagens.push({w: img.width, h: img.height})
				}
			},
			loadImage(path) {
				return new Promise((resolve, reject) => {
					const img = new Image();
					img.crossOrigin = 'Anonymous';
					img.src = path;
					img.onload = () => {
						resolve(img);
					}
					img.onerror = (e) => {
						reject(e);
					}
				})
			},
			async getExame(id) {
				const exame = (await this.$http.get(`/api/exame/${id}`)).data;
				this.exame = exame;
			},
			makeId(length) {
				let result = '';
				const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
				const charactersLength = characters.length;
				for (let i = 0; i < length; i++) {
					result += characters.charAt(Math.floor(Math.random() * charactersLength));
				}
				return result;
			},
			remover(idx) {
				this.mouseOutItem();
				this.items_selecionados.splice(idx, 1);
			},
			clickItemLaudo(data) {
				if (data.menu) return;
				const item_selecionado = data;
				const existe = this.items_selecionados.filter(el => el._id == data._id).length > 0;
				if (!existe) this.items_selecionados.push(item_selecionado);
			},
			async getTemplatesLaudo() {
				try {
					const items = (await this.$http.get(`/api/template/${this.exame.no_especialidade}`)).data;
					this.nome_especialidade = items.nome;
					items.data.forEach(el => {
						if (el.menu) {
							el.visible = false;
							this.setIdTree(el.menu);
						}
						el._id = this.makeId(16);
					});
					this.items_laudo = items.data;
				} catch (error) {
					this.toast(error.data ? error.data.message || error.data : error.statusText, false);
				}
			},
			setIdTree(menu) {
				menu.forEach(el => {
					if (el.menu) this.setIdTree(el.menu);
					el._id = this.makeId(16);
				});
			},
			toast(mensagem, sucesso) {
				const title = sucesso ? "Sucesso" : "Erro";
				const variant = sucesso ? "success" : "danger";
				this.$root.$bvToast.toast(mensagem, {
					title: title,
					variant: variant,
					solid: true,
				});
			},
			formataData(date, formato) {
				return moment(date).format(formato);
			},
			async previaLaudo() {
				try {
					this.$refs.html2Pdf.generatePdf();
				} catch (error) {
					this.toast(error.data ? error.data.message || error.data : error.statusText, false);
				}
			},
			async salvarLaudo() {
				try {
					const items = [...this.items_selecionados];
					const laudo = {
						id_exame: this.exame.id_exame,
						nome_especialidade: this.nome_especialidade,
						o_paciente: {
							nome: this.exame.o_paciente.nome,
							email: this.exame.o_paciente.email,
						},
						o_medico_laudo: {
							nome: this.user.no_usuario,
							crm: this.user.co_crm,
							email: this.user.no_email
						},
						ar_texto: items,
						dt_laudo: moment(new Date(), 'DD/MM/YYYY HH:mm:ss').toDate()
					};
					await this.$http.post(`/api/laudo/`, laudo);
					this.toast("Laudo salvo com sucesso!", true);
					this.$router.push({
						path: `/exame/`
					});
				} catch (error) {
					this.toast(error.data ? error.data.message || error.data : error.statusText, false);
				}
			},
			highlightSearch(id) {
				const el = document.getElementById(id);
				el.classList.add('cor-fundo');
				el.classList.add('text-white');
			},
			highlightForEdit(id) {
				const el = document.getElementById(id);
				el.classList.add('cor-fundo');
				el.classList.add('text-white');
				el.contentEditable = "true"; 
				el.spellcheck = false; 
			},
			editar(item) {
				this.boolEdicao = true;
				this.itemEdicao = item;
				if (item.texto) this.highlightForEdit(`texto-${item._id}`);
				if (item.conclusao) this.highlightForEdit(`conclusao-${item._id}`);
				if (item.obs) this.highlightForEdit(`obs-${item._id}`);
				if (item.ref) this.highlightForEdit(`ref-${item._id}`);
			},
			mouseOverItem(item) {
				if (this.boolEdicao) return;
				this.itemHover = item;
				if (item.texto) this.highlightSearch(`texto-${item._id}`);
				if (item.conclusao) this.highlightSearch(`conclusao-${item._id}`);
				if (item.obs) this.highlightSearch(`obs-${item._id}`);
				if (item.ref) this.highlightSearch(`ref-${item._id}`);
			},
			mouseOutItem() {
				if (this.boolEdicao) return;
				if (this.itemHover.texto) {
					const el = document.getElementById(`texto-${this.itemHover._id}`);
					el.classList.remove('cor-fundo');
					el.classList.remove('text-white');
				} 
				if (this.itemHover.conclusao) {
					const el = document.getElementById(`conclusao-${this.itemHover._id}`);
					el.classList.remove('cor-fundo');
					el.classList.remove('text-white');
				} 
				if (this.itemHover.obs) {
					const el = document.getElementById(`obs-${this.itemHover._id}`);
					el.classList.remove('cor-fundo');
					el.classList.remove('text-white');
				} 
				if (this.itemHover.ref) {
					const el = document.getElementById(`ref-${this.itemHover._id}`);
					el.classList.remove('cor-fundo');
					el.classList.remove('text-white');
				} 
			},
			closeEdicao() {
				if (this.itemEdicao.texto) {
					const el = document.getElementById(`texto-${this.itemEdicao._id}`);
					this.itemEdicao.texto = el.innerHTML;
					el.classList.remove('cor-fundo');
					el.classList.remove('text-white');
					el.contentEditable = "false"; 
				} 
				if (this.itemEdicao.conclusao) {
					const el = document.getElementById(`conclusao-${this.itemEdicao._id}`);
					this.itemEdicao.conclusao = el.innerHTML;
					el.classList.remove('cor-fundo');
					el.classList.remove('text-white');
					el.contentEditable = "false"; 
				} 
				if (this.itemEdicao.obs) {
					const el = document.getElementById(`obs-${this.itemEdicao._id}`);
					this.itemEdicao.obs = el.innerHTML;
					el.classList.remove('cor-fundo');
					el.classList.remove('text-white');
					el.contentEditable = "false"; 
				} 
				if (this.itemEdicao.ref) {
					const el = document.getElementById(`ref-${this.itemEdicao._id}`);
					this.itemEdicao.ref = el.innerHTML;
					el.classList.remove('cor-fundo');
					el.classList.remove('text-white');
					el.contentEditable = "false"; 
				} 
				this.boolEdicao = false;
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

	.textos-list {
		width: 300px;
		border-right: 1px solid rgba(226,229,236,.6);
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: #fbfcfe;
	}

	.textos-list2 {
		margin-left: 300px;
		width: 300px;
		border-right: 1px solid rgba(226,229,236,.6);
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: #fbfcfe;
	}

	.textos-list3 {
		margin-left: 600px;
		width: calc(100% - 600px);
		border-right: 1px solid rgba(226,229,236,.6);
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: #fbfcfe;
	}

	.textos-list-header {
		height: 60px;
		background-color: #fff;
		border-top-left-radius: 6px;
		border-top-right-radius: inherit;
		padding-left: 20px;
		padding-right: 15px;
		border-bottom: 1px solid rgba(226,229,236,.6);
	}

	h6.textos-list-title {
		font-size: 16px;
		font-weight: 600;
		color: #212830;
		margin-bottom: 1px;
	}

	small.textos-list-title {
		color: #95a1ae;
		margin-bottom: 0;
		padding: 0;
		line-height: 1.25;
	}

	.contact-content {
		margin-left: 560px;
		display: block;
		height: 100%;
		overflow: hidden;
		position: absolute;
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

	.chat-item-body {
		padding-left: 10px;
		flex: 1;
		width: calc(100% - 46px);
	}

	.arvore {
		height: calc(100vh - 230px);
	}

	.tree {
		overflow-y: auto;
	}

	.chat-item-body small {
		font-size: 11px;
		font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
		color: #6e7985;
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

	.items {
		max-height: calc(100vh - 235px);
		overflow-y: auto;
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

	.item-selecionado {
		text-align: left;
		padding: 9px 4px 9px 14px;
		overflow: visible;
		height: 40px;
		border: 0px none;
		border-radius: 6px;
		box-shadow: 0 1px 2px rgba(204,210,218,.07),0 2px 4px rgba(204,210,218,.07),0 4px 8px rgba(204,210,218,.07),0 8px 16px rgba(204,210,218,.07),0 16px 32px rgba(204,210,218,.07),0 32px 64px rgba(204,210,218,.07);
		color: #2679bd !important;
		background-color: white !important;
	}

	.item-selecionado-acoes {
		display: none;
	}

	.item-selecionado-acoes .icon-action {
		opacity: 0.6;
		transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out;
	}

	.item-selecionado-acoes .icon-action:hover {
		opacity: 1;
		transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out;
	}

	.item-selecionado:hover {
		cursor:	grab;
	}

	.item-selecionado:hover .item-selecionado-acoes {
		display: block;
	}

	.cor-texto {
		color: #2679bd !important;
	}

	.cor-fundo {
		background-color: #72b1e4 !important;
	}

	.folha-laudo {
		border: 2px solid black; 
		max-width: 934px;
        min-width: 934px;
	}

	.icone {
		width: 14px;
		font-size: 0.9em; 
		padding-right: 4px; 
		margin-left: -16px; 
		margin-right: 2px;
	}

	.thumbs {
		height: 60px;
		background-color: #edeeef;
		overflow-x: auto;
		z-index: 900;
	}

	.cur-pointer {
		cursor: pointer;
	}

	.texto {
		font-size: 12px;
		user-select: none;
		text-align: left;
	}
</style>