<template>
    <section class="laudo d-flex flex-column justify-content-between align-items-start p-5 user-select-none">
        <div class="w-100 mb-4 text-right">
            <span class="cabecalho1 h1 d-block pb-0 mb-0">laudos.web</span>
            <span class="cabecalho2 h1 d-block">gastroenterologia e endoscopia digestiva</span>
        </div>

        <div class="d-flex flex-column align-items-start mb-5 ml-0">
            <span><b>Paciente:</b> {{ nome_paciente }}</span>
            <span><b>Médico solicitante:</b> {{ nome_medico_solicitante }}</span>
            <span><b>Exame:</b> {{ tipo_exame }}</span>
            <span><b>Exame sob sedação assistida por anestesiologista</b></span>
        </div>

        <span v-for="(item, idx) of ar_textos.filter(el => el.texto)" :key="`texto-${idx}`"
            v-html="item.texto" class="mb-3" :id="`texto-${idx}`"></span>

        <div v-if="ar_textos.filter(el => el.conclusao).length > 0" class="font-weight-bold mb-1">Conclusão:</div>
        <div v-for="(item, idx) of ar_textos.filter(el => el.conclusao)" :key="`conclusao-${idx}`" class="mb-3 ml-2 d-flex flex-line justify-content-between">
            <span class="mr-1">{{ idx+1 }} - </span>
            <span v-html="item.conclusao" :id="`conclusao-${idx}`"></span>
        </div>

        <span v-if="ar_textos.filter(el => el.obs).length > 0"
            class="font-weight-bold mb-1">Obs:</span>
        <span v-for="(item, idx) of ar_textos.filter(el => el.obs)" :key="`obs-${idx}`" v-html="item.obs"
            class="mb-3 ml-2" :id="`obs-${idx}`"></span>

        <span v-if="ar_textos.filter(el => el.ref).length > 0"
            class="font-weight-bold mb-1">Ref:</span>
        <span v-for="(item, idx) of ar_textos.filter(el => el.ref)" :key="`ref-${idx}`" v-html="item.ref"
            class="mb-3 ml-2" :id="`ref-${idx}`"></span>

        <span v-if="nome_medico_exame" class="font-weight-bold mb-5">Médico Responsável: Dr./Dra. {{ nome_medico_exame }}</span>

        <div class="mb-5" />

        <div class="align-center">
            <b-img v-for="(imagem,idx) of ar_imagens" :key="`img_${idx+1}`" thumbnail fluid
                :src="imagem" class="m-2" width="300" height="300"></b-img>
        </div>
    </section>
</template>
<script>
  export default {
    props: {
      nome_paciente: {
        type: String,
        required: true
      },
      nome_medico_solicitante: {
        type: String,
        required: true
      },
      nome_medico_exame: {
        type: String,
        required: true
      },
      tipo_exame: {
        type: String,
        required: true
      },
      ar_textos: {
        type: Array,
        required: true
      },
      ar_imagens: {
        type: Array,
        required: true
      },
    },
    data() {
      return {
        
      };
    },
    mounted() {
      
    },
    methods: {
      
    }
  };
</script>
<style scoped>
    .laudo {
        max-width: 934px;
        min-width: 934px;
    }
    .cabecalho1 {
        font-family: 'Archivo';
        font-size: 2rem;
        color: #20639a;
    }
    .cabecalho2 {
        font-family: 'Archivo';
        font-size: 1rem;
        color: #6d91ae;
    }
</style>