<template>
	<div class="user-select-none2">
        <div class="contact-panel">
            <div class="textos-list">
                <div class="textos-list-header d-flex flex-row justify-content-between align-items-center">
                    <div class="d-flex flex-column align-items-start align-self-center">
                        <h6 id="titulo_laudo" class="textos-list-title">Modo Edição</h6>
                        <small id="titulo_laudo" class="textos-list-title">{{ nomeExame() }}</small>
                    </div>
                    <div>
                        <b-button size="sm" variant="primary" v-if="diff.length > 0" @click="salvar()" v-b-tooltip.hover title="Salvar mudanças">
                            <font-awesome-icon class="icon-action" :icon="['fas', 'save']" />
                        </b-button>
                    </div>
                </div>
                <div class="arvore box-body d-flex flex-column justify-content-between align-self-start">
                    <el-tree accordion :data="items_laudo.data" :props="defaultProps" node-key="id" ref="tree"
                    class="tree" draggable :expand-on-click-node="true"
                    @node-contextmenu="menuContexto" @node-click="clickItemLaudo">
                        <span class="custom-tree-node cor-texto" slot-scope="{ node, data }">
                            <font-awesome-icon v-if="!data.menu" :icon="['fas', 'file-alt']"
                                class="icone" />
                            <span>{{ node.label }}</span>
                        </span>
                    </el-tree>
                    <context-menu id="context-menu" ref="ctxMenu">
                        <li v-for="item_menu of mnuContexto" @click="item_menu.funcao" :key="'mn-'+item_menu.id"
                            :style="`color: ${item_menu.cor}`">
                            <font-awesome-icon :icon="['fas', item_menu.icone]"
                                class="icone" />
                            {{ item_menu.nome }}</li>
                    </context-menu>
                </div>
            </div>

            <div class="textos-list2" v-if="itemAtual && !itemAtual.menu">
                <div class="textos-list-header d-flex flex-column align-items-start align-self-center justify-content-center">
                    <h6 id="titulo_laudo" class="textos-list-title">Editar item</h6>
                    <!-- <small id="titulo_laudo" class="textos-list-title">...</small> -->
                </div>
                <div class="box-body" style="max-height: calc(100vh - 235px);overflow-y: auto;">
                    <div class="setting-item">
                        <div class="row g-2 align-items-center">
                            <div class="col-md-5">
                                <h6 class="mb-0">Nome</h6>
                            </div>
                            <div class="col-md">
                                <b-form-input class="form-control" v-model="itemAtual.nome" placeholder="Digite o nome do item"></b-form-input>
                            </div>
                        </div>
                    </div>

                    <div class="setting-item">
                        <div class="row g-2 align-items-center">
                            <div class="col-md-5">
                                <h6 class="mb-0">Propriedades</h6>
                            </div>
                            <div class="col-md">
                                <b-input-group>
                                    <el-select v-model="valores" multiple placeholder="Selecione um tipo"
                                        style="width: 420px" @remove-tag="removeProp">
                                        <el-option v-for="item in opcoes" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </b-input-group>
                            </div>
                        </div>
                    </div>
                    
                    <b-tabs pills card class="mt-4">
                        <b-tab lazy v-if="valores.includes('texto')" :active="valores[0] == 'texto'" title="Texto" class="p-0">
                            <template #title>
                                <span >Texto</span>
                            </template>
                            <quill-editor
                                v-model="itemAtual.texto"
                                ref="refQuillEditor"
                                :options="editorOption"
                                spellcheck="false">
                            </quill-editor>
                        </b-tab>
                        <b-tab lazy v-if="valores.includes('conclusao')" :active="valores[0] == 'conclusao'" class="p-0">
                            <template #title>
                                <span >Conclusão</span>
                            </template>
                            <quill-editor
                                v-model="itemAtual.conclusao"
                                ref="refQuillEditor"
                                :options="editorOption"
                                spellcheck="false">
                            </quill-editor>
                        </b-tab>
                        <b-tab lazy v-if="valores.includes('obs')" :active="valores[0] == 'obs'" class="p-0">
                            <template #title>
                                <span >Observação</span>
                            </template>
                            <quill-editor
                                v-model="itemAtual.obs"
                                ref="refQuillEditor"
                                :options="editorOption"
                                spellcheck="false">
                            </quill-editor>
                        </b-tab>
                        <b-tab lazy v-if="valores.includes('ref')" :active="valores[0] == 'ref'" class="p-0">
                            <template #title>
                                <span >Referência</span>
                            </template>
                            <quill-editor
                                v-model="itemAtual.ref"
                                ref="refQuillEditor"
                                :options="editorOption"
                                spellcheck="false">
                            </quill-editor>
                        </b-tab>
                    </b-tabs>
                </div>
            </div>
            <div v-else class="contact-content-empty">Nenhum item selecionado</div>
        </div>
	</div>
</template>

<script>
    import contextMenu from 'vue-context-menu';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';

    const rfc6902 = require('rfc6902')

    export default {
        name: "EdicaoLaudo",
        components: {
            contextMenu,
            quillEditor
        },
        computed: {
            user() {
                return this.$store.state.auth.user;
            },
            mensagem() {
                let texto = '';
                let conclusao = '';
                let obs = '';
                let ref = '';

                this.items_selecionados.forEach(el => texto += el.texto ? `${el.texto}<p>` : ``);

                this.items_selecionados.forEach(el => conclusao += el.conclusao ? `${el.conclusao}<p>` : ``);
                texto += conclusao.length > 0 ? `<p><b>Conclusão:</b><p>${conclusao}` : ``;

                this.items_selecionados.forEach(el => obs += el.obs ? `${el.obs}<p>` : ``);
                texto += obs.length > 0 ? `<p><b>Obs:</b><p>${obs}` : ``;

                this.items_selecionados.forEach(el => ref += el.ref ? `${el.ref}<p>` : ``);
                texto += ref.length > 0 ? `<p><b>Ref:</b><p>${ref}` : ``;
                return texto;
            }
        },
        watch: {
            items_laudo: {
                handler: function () {
                    this.diff = rfc6902.createPatch(this.items_baixados, this.items_laudo);
                },
                immediate: true,
                deep: true
            },
            itemAtual: {
                handler: function () {
                    this.diff = rfc6902.createPatch(this.items_baixados, this.items_laudo);
                },
                immediate: true,
                deep: true
            }
        },
        props: ["id"],
        data() {
            return {
                houveMudanca: false,
                dadosCarregados: false,
                diff: [],
                diff_ids: [],
                items_baixados: [],
                items_laudo: [],
                items_selecionados: [],
                defaultProps: {
                    children: 'menu',
                    label: 'nome',
                    isLeaf: 'menu'
                },
                text: '',
                tipo: '',
                mnuContexto: [],
                itemAtual: null,
                hide: {
                    strikethrough: true,
                    heading: true,
                    alignLeft: true,
                    alignCenter: true,
                    alignRight: true,
                    ol: true,
                    ul: true,
                    url: true,
                    table: true,
                    indent: true,
                    outdent: true
                },
                opcoes: [{
                    value: 'texto',
                    label: 'Texto'
                }, {
                    value: 'conclusao',
                    label: 'Conclusão'
                }, {
                    value: 'obs',
                    label: 'Observação'
                }, {
                    value: 'ref',
                    label: 'Referência'
                }],
                valores: [],
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'font': [] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
                            ['clean']
                        ]
                    }
                }
            };
        },
        async mounted() {
            await this.getItemsLaudo();
        },
        methods: {
            makeid(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                const charactersLength = characters.length;
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            },
            removeAt(idx) {
                this.items_selecionados.splice(idx, 1);
            },
            clickItemLaudo(data) {
                this.itemAtual = null;
                if (!data.menu) {
                    this.itemAtual = data;
                    this.valores = [];
                    if (this.itemAtual.texto) this.valores.push('texto');
                    if (this.itemAtual.conclusao) this.valores.push('conclusao');
                    if (this.itemAtual.obs) this.valores.push('obs');
                    if (this.itemAtual.ref) this.valores.push('ref');
                }
            },
            removeProp(prop) {
                delete this.itemAtual[prop];
                this.diff = rfc6902.createPatch(this.items_baixados, this.items_laudo);
            },
            menuContexto(event, data) {
                this.mnuContexto = [];
                this.itemAtual = data;
                const itemExcluir = {
                    id: 1,
                    nome: `Excluir ${data.menu ? 'categoria' : 'item'}`,
                    icone: 'trash',
                    cor: 'darkred',
                    funcao: () => {
                        //const n = this.$refs.tree.getNode(this.itemAtual.id);
                        this.$confirm(`Deseja realmente excluir ${data.menu ? 'a categoria' : 'o item'}?`,
                                'Exclusão', {
                                    confirmButtonText: 'OK',
                                    cancelButtonText: 'Cancel',
                                    type: 'warning'
                                }).then(value => {
                                if (value) this.$refs.tree.remove(this.itemAtual.id);
                                this.itemAtual = null;
                            })
                            .catch(err => {
                                this.toast(`Não foi possível efetuar a operação: ${err}`, false);
                            })
                    }
                };
                const categoriaAdicionar = {
                    id: 2,
                    nome: `Adicionar categoria`,
                    icone: 'plus',
                    cor: 'black',
                    funcao: async () => {
                        const nome = await this.$prompt('Digite o nome da categoria', 'Nova categoria', {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel'
                        });
                        const newItem = {
                            id: this.makeid(16),
                            nome: nome.value,
                            cor: this.itemAtual.cor,
                            ordem: this.itemAtual.ordem,
                            menu: []
                        };
                        this.$refs.tree.append(newItem, this.itemAtual.id);
                    }
                };
                const itemAdicionar = {
                    id: 3,
                    nome: `Adicionar item`,
                    icone: 'plus',
                    cor: 'black',
                    funcao: () => {
                        const newItem = {
                            id: this.makeid(16),
                            nome: `Novo item`,
                            ordem: this.itemAtual.ordem
                        };
                        this.$refs.tree.append(newItem, this.itemAtual.id);
                        //n.childNodes.push(newItem);
                    }
                };
                const categoriaEditar = {
                    id: 4,
                    nome: `Alterar nome`,
                    icone: 'edit',
                    cor: 'black',
                    funcao: async () => {
                        const nome = await this.$prompt('Digite o novo nome da categoria', 'Editar categoria', {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            inputValue: this.itemAtual.nome
                        });
                        this.itemAtual.nome = nome.value;
                    }
                };

                if (data.menu) {
                    this.mnuContexto.push(categoriaEditar);
                    this.mnuContexto.push(categoriaAdicionar);
                    this.mnuContexto.push(itemAdicionar);
                }
                this.mnuContexto.push(itemExcluir);
                this.$refs.ctxMenu.open();
            },
            async getItemsLaudo() {
                try {
                    this.getTipo();
                    const items = (await this.$http.get(`/api/template/${this.id}`)).data;
                    items.data.forEach(el => {
                        if (el.menu) {
                            el.visible = false;
                            this.setIdTree(el.menu);
                        }
                        el.id = this.makeid(16);
                        //delete el._id;
                    });
                    this.items_laudo = items;
                    this.items_baixados = JSON.parse(JSON.stringify(this.items_laudo));
                    this.$nextTick(() => {
                        this.dadosCarregados = true
                    })
                } catch (error) {
                    this.toast(error.data ? error.data.message || error.data : error.statusText, false);
                }
            },
            setIdTree(menu) {
                menu.forEach(el => {
                    if (el.menu) {
                        this.setIdTree(el.menu);
                    }
                    el.id = this.makeid(16);
                });
            },
            setCorItems(menu, cor) {
                menu.forEach(el => {
                    if (el.menu) {
                        this.setCorItems(el.menu, cor);
                    }
                    el.cor = cor;
                });
            },
            async salvar() {
                try {
                    const items = this.diff;
                    items.forEach(it => delete it.value.id);
                    await this.$http.patch(`/api/template/${this.id}`, items);
                    this.toast("Edição efetuada com sucesso!", true);
                    this.items_baixados = JSON.parse(JSON.stringify(this.items_laudo));
                    this.diff = rfc6902.createPatch(this.items_baixados, this.items_laudo);
                } catch (error) {
                    this.toast(error.data ? error.data.message || error.data : error.statusText, false);
                }
            },
            getTipo() {
                switch (parseInt(this.id)) {
                    case 1:
                        this.tipo = 'Colonoscopia';
                        break;
                    case 2:
                        this.tipo = 'EDA';
                        break;
                    case 3:
                        this.tipo = 'pHmetria';
                        break;
                    case 4:
                        this.tipo = 'Teste Respiratório';
                        break;
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
            },
            highlightSearch(obj, texto, cor) {
                texto = texto.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
                let query = new RegExp("((\\B|\\b)" + texto + "(\\B|\\b))", "gm");
                let newe = obj.replace(query,
                    `<mark class="bg-${cor}" style="padding: 2px" ${this.$options._scopeId}>$1</mark>`);
                this.text = newe;
            },
            run(item) {
                this.text = this.mensagem;
                if (item.texto) {
                    let fragmentos_texto = item.texto.split("<p>");
                    for (let i = 0; i < fragmentos_texto.length; i++) {
                        this.highlightSearch(this.text, fragmentos_texto[i], item.cor);
                    }
                }
                if (item.conclusao) {
                    let fragmentos_conclusao = item.conclusao.split("<p>");
                    for (let i = 0; i < fragmentos_conclusao.length; i++) {
                        this.highlightSearch(this.text, fragmentos_conclusao[i], item.cor);
                    }
                }
                if (item.obs) {
                    let fragmentos_obs = item.obs.split("<p>");
                    for (let i = 0; i < fragmentos_obs.length; i++) {
                        this.highlightSearch(this.text, fragmentos_obs[i], item.cor);
                    }
                }

                if (item.ref) {
                    let fragmentos_ref = item.ref.split("<p>");
                    for (let i = 0; i < fragmentos_ref.length; i++) {
                        this.highlightSearch(this.text, fragmentos_ref[i], item.cor);
                    }
                }
            },
			nomeExame() {
				switch (this.id) {
					case "eda": 
						return "Endoscopia Digestiva Alta";
					case "colono": 
						return "Colonoscopia";
					case "phmetria": 
						return "phMetria";
					case "teste_respiratorio": 
						return "Teste Respiratório";
				}
			}
        }
    };
</script>
<style scoped>

    .ctx-menu>span {
        padding: 3px 10px;
        cursor: default;
        user-select: none;
        font-size: 0.85em;
        color: gray;
    }

    .ctx-menu>li {
        padding: 3px 10px;
        cursor: pointer;
        min-width: 170px;
    }

    .ctx-menu>li:hover {
        background-color: #eee;
    }

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
		width: 360px;
		border-right: 1px solid rgba(226,229,236,.6);
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: #fbfcfe;
	}

	.textos-list2 {
		margin-left: 360px;
		width: calc(100% - 360px);
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
		/* width: 280px;
		border-right: 1px solid rgba(226,229,236,.6);
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: #fbfcfe; */
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
		color: #bd3d26 !important;
	}

	.cor-fundo {
		background-color: #72b1e4 !important;
	}

	.setting-item {
        padding: 20px;
        position: relative;
    }

    .setting-item + .setting-item {
        border-top: 1px solid #f3f5f9;
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

    .texto-tab {
        color: #1b4f7e !important;
    }

    .nav-item:has(.bg-active-tab) {
        background-color: #a7d2f4 !important;
    }

    .nav-item:has(.bg-active-tab) {
        background-color: #a7d2f4 !important;
    }

    .nav-link.active span {
        color: #fff !important;
    }

    .nav-link:not(.active) span {
        color: #007bff !important;
    }

    .arvore {
        height: calc(100vh - 230px);
    }

    .tree {
        font-weight: 500;
        user-select: none;
    }

    .icone {
        width: 14px;
        font-size: 0.9em;
        padding-right: 4px;
    }
</style>