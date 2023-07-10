<template>
	<div>
		<div class="laudo-content" v-if="laudo">
			<cp-laudo :nome_paciente="laudo.o_exame.o_paciente.nome"
				:nome_medico_solicitante="laudo.o_exame.o_medico_solicitante.nome"
				:nome_medico_exame="laudo.o_medico_laudo.nome" :tipo_exame="laudo.nome_especialidade"
				:ar_textos="laudo.ar_texto" :ar_imagens="laudo.o_exame.ar_imagens">
			</cp-laudo>
		</div>
	</div>
</template>

<script>
	export default {
		name: "LaudoPaciente",
		computed: {
			user() {
				return this.$store.state.auth.user;
			}
		},
		props: ["id"],
		data() {
			return {
				laudo: undefined
			};
		},
		async mounted() {
			await this.getLaudo();
		},
		methods: {
			async getLaudo() {
				try {
					const laudo = (await this.$http.get(`/api/laudo/${this.id}`)).data;
					this.laudo = laudo.length > 0 ? laudo[0] : undefined;
				} catch (error) {
					this.toast(error.data ? error.data.message || error.data : error.statusText, false);
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
	.laudo-content {
		display: block;
		position: relative;
		overflow: scroll !important;
		padding: 1.5rem;
		margin: 0 auto;
	}

	.laudo-content section {
		border: 2px solid #666;
	}
</style>