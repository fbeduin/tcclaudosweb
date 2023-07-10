<template>
	<div class="pagina-login user-select-none">
		<b-card class="card-login">
			<b-card-header class="bg-white border-0 pb-0">
				<b-card-title>
					<span class="titulo h1 d-block pb-0 mb-0">laudos.web</span>
					<span class="txt-login h1 d-block pb-0 mt-4 font-weight-lighter">Login</span>
				</b-card-title>
			</b-card-header>
			<b-card-body>
				<b-form class="form-login" @submit.prevent="login">
					<b-form-group label="Usuário" label-for="usuario">
						<b-form-input id="usuario" v-model.trim="$v.user.username.$model"
							:state="$v.user.username.$dirty ? !$v.user.username.$error : null" autocomplete="off">
						</b-form-input>
						<b-form-invalid-feedback v-if="!$v.user.username.required">Usuário é obrigatório
						</b-form-invalid-feedback>
					</b-form-group>
					<b-form-group label="Senha" label-for="senha">
						<b-form-input id="senha" v-model="$v.user.password.$model" type="password"
							:state="$v.user.password.$dirty ? !$v.user.password.$error : null"></b-form-input>
						<b-form-invalid-feedback>Senha é obrigatória</b-form-invalid-feedback>
					</b-form-group>
					<b-button type="submit" class="w-100 mt-2" style="background-color: #4393d8">Login</b-button>
				</b-form>
			</b-card-body>
		</b-card>
	</div>
</template>

<script>
	import {
		required
	} from "vuelidate/lib/validators";

	export default {
		name: "Login",
		data() {
			return {
				loading: false,
				user: {
					username: "",
					password: ""
				}
			};
		},
		validations: {
			user: {
				username: {
					required: required
				},
				password: {
					required
				}
			}
		},
		mounted() {
			if (this.$store.state.auth.user) {
				this.$router.replace("/");
			}
			if (navigator.userAgent.toLowerCase().indexOf('trident') > -1) {
				alert("O Internet Explorer não é compatível com esta aplicação. Por favor acesse através do Mozilla Firefox ou Google Chrome.");
				window.location("https://www.mozilla.org/pt-BR/");
			}
		},
		methods: {
			async login() {
				this.$v.$touch();
				if (!this.$v.$invalid) {
					try {
						await this.$store.dispatch("auth/login", this.user);
						this.$router.push(this.$route.query.redirect || "/");
					} catch (error) {
						this.$bvToast.toast(
							error.data ? error.data.message || error.data : error.statusText, {
								title: "Erro",
								variant: "danger",
								solid: true
							}
						);
					}
				}
			}
		}
	};
</script>

<style scoped>
	.pagina-login {
		padding: 40px 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-login {
		width: 380px;
		margin: auto;
		position: relative;
		display: flex;
		flex-direction: column;
		border: 0;
		border-radius: 10px;
		box-shadow: 0 2.8px 2.2px rgba(110, 121, 133, .02), 0 6.7px 5.3px rgba(110, 121, 133, .028), 0 12.5px 10px rgba(110, 121, 133, .035), 0 22.3px 17.9px rgba(110, 121, 133, .042), 0 41.8px 33.4px rgba(110, 121, 133, .05), 0 100px 80px rgba(110, 121, 133, .07);
	}

	.titulo {
		font-family: 'Archivo';
		font-size: 1.75rem;
		color: #20639a;
	}

	.txt-login {
		font-family: 'Open Sans';
		font-size: 1.7rem;
		color: #666;
	}
</style>