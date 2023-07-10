<template>
  <b-navbar class="footer user-select-none" fixed="bottom">
    <b-col class="owner">
      <span>Criado por {{ $project.owner }}</span>
    </b-col>
    <b-col class="version">
      <span>Versão {{ $project.version }}</span>
    </b-col>
  </b-navbar>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
  .footer {
    clear: both;
    height: 50px;
    left: 250px;
    position: fixed;
    background: #fbfcfe;
    border-top: 1px solid rgba(226,229,236,.6);
  }
  .owner{
    text-align: left;
  }
  .version{
    text-align: right;
  }
  span {
    font-size: .8125rem;
    color: #6e7985;
  }
</style>