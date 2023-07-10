<template>
  <div>

    <!--<div class="card bg-white mb-1 border-0" v-if="hasHeader">-->
    <div class="card bg-light mb-1 rounded-0" v-if="hasHeader">
      <br />
      <div class="card-body">
        <div class="">
          <div >
            <template v-if="fieldFilter">
              <b-row>
                <b-col md="3" sm="12" v-for="(fld, idx) in fieldFilter" :key="`fld${fld}`">
                  <b-form-group class="text-left m-1 mb-0">
                    <template #label>
                      <b>{{ fld }}</b>
                    </template>
                    <b-form-checkbox-group v-model="selected[idx]" :options="opcoes(fld)" switches stacked>
                    </b-form-checkbox-group>
                  </b-form-group>
                </b-col>
              </b-row>
            </template>
          </div>
        </div>
        <div class="c-table-box-tools-right w-25">
          <div class="input-group input-group-sm hidden-xs" v-if="filter">
            <b-form-input v-model.trim="filterInput" type="search" placeholder="Filtre os dados aqui" />
            <div class="input-group-btn">
              <button type="submit" class="btn btn-default">
                <font-awesome-icon :icon="['fas', 'search']" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-table class="table-bordered shadow-sm" :items="items" :fields="fieldsComp" striped hover show-empty
      empty-text="Não foram encontrados dados" empty-filtered-text="Não foram encontrados dados com os filtros selecionados" stacked="sm" :small="small" :filter="allFilters"
      :sort-compare-options="{ numeric: true, sensitivity: 'base' }" :filter-function="nameFilter2"
      :per-page="perPageIntern" :current-page="currentPage" :sort-by.sync="sortByIntern"
      :sort-desc.sync="sortDescIntern" :tbody-tr-class="trClass" no-sort-reset @filtered="onFiltered">
      <template v-if="index" #cell(index)="data">
        {{ data.index + 1 }}
      </template>

      <template v-slot:cell(actions)="row">
        <div class="d-flex justify-content-center">
          <font-awesome-icon v-for="action of filterActions(row.item)" :key="action.id" class="table-action"
            :icon="action.icon" size="lg" @click="action.action(row.item)" v-b-tooltip.hover :title="action.tooltip"
            :color="action.color" />
        </div>
      </template>
      <template #cell(de_garantias)="data">
        <div class="d-flex flex-column">
          <span v-for="garantia of data.value" :key="garantia" class="text-left">{{ garantia }}</span>
        </div>
      </template>
      <template #cell(ic_aprovado)="{ item }">
        <b-form-checkbox v-model="item.ic_aprovado" />
      </template>
      <template #cell(no_designado)="data">
					<div :title="data.item.co_designado" class="table-action" >{{ data.item.no_designado }}</div>
			</template>
      <template #cell(ic_execucao)="data">
        <b-form-checkbox v-model="data.item.ic_execucao" :disabled="data.field.disabled"/>
      </template>
    </b-table>
    <template v-if="hasPagination">
      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPageIntern" align="center">
        <template slot="first-text">
          <font-awesome-icon :icon="['fas', 'angle-double-left']" />
        </template>
        <template slot="prev-text">
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </template>
        <template slot="next-text">
          <font-awesome-icon :icon="['fas', 'angle-right']" />
        </template>
        <template slot="last-text">
          <font-awesome-icon :icon="['fas', 'angle-double-right']" />
        </template>
      </b-pagination>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      fields: {
        type: Array,
        required: true
      },
      items: {
        type: [Array, Function],
        required: true
      },
      actions: {
        type: Array,
        default: null
      },
      fieldFilter: {
        type: Array,
        default: () => []
      },
      filter: {
        type: Boolean,
        default: false
      },
      perPage: {
        type: Number,
        default: 10
      },
      sortBy: {
        type: String,
        default: null
      },
      sortDesc: {
        type: Boolean,
        default: false
      },
      small: {
        type: Boolean,
        default: false
      },
      index: {
        type: Boolean,
        default: false
      },
      hasHeader: {
        type: Boolean,
        default: true
      },
      trClass: {
        type: Function,
        default: null
      }
    },
    data() {
      return {
        filterInput: "",
        perPageIntern: this.perPage,
        sortByIntern: this.sortBy,
        sortDescIntern: this.sortDesc,
        totalRows: this.items.length,
        pageOptions: [{
            text: "10 linhas",
            value: 10
          },
          {
            text: "20 linhas",
            value: 20
          },
          {
            text: "50 linhas",
            value: 50
          },
          {
            text: "Todas as linhas",
            value: null
          }
        ],
        currentPage: 1,
        selected: []
      };
    },
    mounted() {
      this.fieldFilter.forEach(el => this.selected.push(this.opcoes(el)));
    },
    computed: {
      opcoes() {
        return fld => [...new Set(this.items.map(item => item[`${this.fields.find(field => field.label == fld).key}`]))].sort();
      },
      allFilters() {
        const filtroTexto = !this.filterInput ? '' : this.filterInput;
        return [...this.selected, filtroTexto];
      },
      fieldsComp() {
        // let comp = JSON.parse(JSON.stringify(this.fields));
        let comp = this.fields;
        if (this.index) {
          comp.unshift({
            key: "index",
            label: "Opção",
            sortable: false
          });
        }
        if (this.actions) {
          comp.push({
            key: "actions",
            label: "Ações",
            sortable: false
          });
        }
        return comp;
      },
      hasPagination() {
        return this.perPageIntern && this.totalRows > this.perPageIntern;
      }
    },
    watch: {
      items: function (items) {
        this.totalRows = items.length;
      }
    },
    methods: {
      // Ignora acentos e só busca nas colunas apresentadas
      nameFilter(row, filter) {
        var rowValues = "";
        for (var [key, value] of Object.entries(row)) {
          if (this.fields.find(obj => obj.key === key)) {
            rowValues = rowValues + "," + value;
          }
        }
        if (!filter || filter === "") {
          return true;
        }
        var n = this.prepareNameFilter(rowValues);
        var s = this.prepareNameFilter(filter);
        return n.includes(s);
      },
      nameFilter2(row, filter) {
        const selecionado = this.fieldFilter.every((el, idx) => {
          const key = this.fields.find(field => field.label == el).key;
          const arr = filter[idx];
          return arr.includes(row[key]);
        });

        if (!selecionado) return false;

        var rowValues = "";
        for (var [key, value] of Object.entries(row)) {
          if (this.fields.find(obj => obj.key === key)) {
            rowValues = rowValues + "," + value;
          }
        }
        if (!filter[filter.length-1] || filter[filter.length-1] === "") {
          return true;
        }
        var n = this.prepareNameFilter(rowValues);
        var s = this.prepareNameFilter(filter[filter.length-1]);
        return n.includes(s) && selecionado;
      },
      // Limpeza de acentos
      prepareNameFilter(str) {
        if (!str) return "";
        str = String(str).toLowerCase();
        str = str.replace(/[aáàãäâ]/, "a");
        str = str.replace(/[eéèëê]/, "e");
        str = str.replace(/[iíìïî]/, "i");
        str = str.replace(/[oóòõöô]/, "o");
        str = str.replace(/[uúùüû]/, "u");
        return str;
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
      filterActions(item) {
        return this.actions.filter(action => action.if ? action.if(item) : true)
      }
    }
  };
</script>

<style lang='scss'>
  @import "@/assets/styles/variables";

  .c-table-box-header {
    color: #444;
    display: block;
    padding: 10px;
    position: relative;
    text-align: left;
    border-bottom: 50px solid #f4f4f4;
  }

  .c-table-box-tools-left {
    position: absolute;
    left: 5px;
    bottom: 5px;
  }

  .c-table-box-tools-right {
    position: absolute;
    right: 0px;
    bottom: 5px;
  }

  .btn-default {
    background-color: #f4f4f4;
    color: #444;
    height: 27px;
    display: inline-block;
    margin-bottom: 0;
    margin-left: -1px;
    font-weight: 400;
    font-size: 11px;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    border: 1px solid #ddd;
    line-height: 1.42857143;
    border-radius: 4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .box-title {
    display: inline-block;
    font-size: 18px;
    margin: 0;
    line-height: 1;
  }

  .box-body {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
    padding: 10px;
  }

  .table {
    color: #3a4859;
    font-family: Arial;
    font-family: Arial;
    font-size: 12px;
    text-align: center;
  }

  .table tbody tr td,
  .table tbody tr th {
    padding: 0.5rem;
  }

  .table tbody tr:hover td,
  .table tbody tr:hover th {
    background-color: $cor-paleta-light-teal;
  }

  .table-action+.table-action {
    margin-left: 10px;
  }

  .table-action:hover {
    cursor: pointer;
  }

  .page-link {
    border: 0;

    outline: none !important;
    box-shadow: none !important;
  }

  .page-item.active .page-link {
    background-color: #ddd;
    border-color: #ddd;
    /*color: $cor-paleta-rhino;*/
    font-weight: bold;
  }

  .page-item:not(.disabled) .page-link {
    color: $cor-paleta-rhino !important;
  }

  .pull-right {
    float: right !important;
  }

  .box-footer {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
    border-top: 1px solid #f4f4f4;
    padding: 10px;
    background-color: #fff;
  }

  h3 {
    font-family: "Source Sans Pro", sans-serif;
  }

  .pagination>li>span,
  .pagination>li>button {
    position: relative;
    float: left;
    padding: 6px 12px;
    margin-left: -1px;
    line-height: 1.42857143;
    color: #337ab7;
    text-decoration: none;
    background-color: #fff;
    border: 1px solid #ddd;
    font-size: 11px;
  }

  .box.box-primary {
    border-top-color: #3c8dbc;
  }

  .box.box-info {
    border-top-color: #00c0ef;
  }

  .box.box-danger {
    border-top-color: #dd4b39;
  }

  .box.box-warning {
    border-top-color: #F39200;
  }

  .box.box-success {
    border-top-color: #28a745;
  }
</style>
