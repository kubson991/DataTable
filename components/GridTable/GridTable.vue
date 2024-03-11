<template>
  <section
    class="tableContainer"
    :class="{ disabled: loading }"
    ref="TableContainer"
  >
    <div
      ref="modalCalendar"
      v-if="modalConfiguration.active"
      class="calendarModal"
      :style="{
        left: modalConfiguration.x + 'px',
        top: modalConfiguration.y + 'px',
      }"
    >
      <DatePicker
        @input="onDateRangeChange"
        color="red"
        :attributes="attrsToday"
        :value="
          modalConfiguration.value ? new Date(modalConfiguration.value) : null
        "
      ></DatePicker>
    </div>
    <header class="topOfDataTable">
      <p class="elementsCounter">
        {{ dataOrdered.length }} Elements of {{ this.totalElements }}
      </p>
      <div class="form-check form-switch" v-show="tableConfig.activeFilters">
        <input
          v-model="activeFilters"
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckDefault"
        />
        <label class="form-check-label" for="flexSwitchCheckDefault"
          >Filters</label
        >
      </div>
    </header>
    <div class="tableMaxContentContainer">
      <input
        v-show="scrollRange > 0"
        class="slider"
        type="range"
        :value="scrollPosition"
        min="0"
        :max="scrollRange"
        @input="scrollTable"
        :style="{
          width: virtualScrollHeight - 4 + 'px',
          '--thumbHeight': thumbHeight + 'px',
        }"
      />
      <section class="tableComponent">
        <div class="loader" v-show="loading"></div>
        <header ref="columnsContainer">
          <div
            :class="{
              canEdit: header.orderable || header.orderableByEvent,
              filterActive: header.value === filterActive,
            }"
            v-for="header in columnsRendered"
            :key="header.value"
            @click="manageClickOnColumnHeader($event, header)"
            :style="{ 'min-width': header.custmonMinWitdh }"
          >
            <slot :name="header.name">
              <div class="headerTitle">
                <b>{{ header.name }}</b>
                <span class="orderContainer">
                  <i :class="{ active: !desc }">↑</i>
                  <i :class="{ active: desc }">↓</i>
                </span>
              </div>
            </slot>
          </div>
        </header>
        <nav :class="{ active: activeFilters }">
          <div
            v-for="(filter, index) in columnsRendered"
            :key="filter.value"
            :style="{
              'min-width': widthColumnArray[index],
              'max-width': widthColumnArray[index],
            }"
          >
            <GridFilter
              :column="filter.value"
              @filterChange="columnFilterChange($event, filter)"
            ></GridFilter>
          </div>
        </nav>
        <main>
          <section
            v-show="dataOrdered.length < 1 && !loading"
            class="tableComponentRow noInfo"
          >
            No hay Informacion Disponible
          </section>
          <section
            class="scrollContainer"
            ref="scrollContainer"
            @scroll.passive="setScroll"
          >
            <section v-if="!tableConfig.groupBy" @scroll.passive="hideModal">
              <GridRow
                v-for="(rowData, index) in dataOrdered"
                :key="
                  tableConfig.key ? getParam(rowData, tableConfig.key) : index
                "
                class="tableComponentRow"
                :rowData="rowData"
                :columns="columnsRendered"
                :widthColumnArray="widthColumnArray"
                :editable="activeRow === rowData"
                @rowEdited="onFiltersChange($event, rowData)"
                @elemntPicked="clickEvent($event)"
                @openCalendar="openCalendar"
              >
                <template
                  #[`Column.${column.value}`]="{ columnInfo, rowInfo }"
                  v-for="column in columns"
                >
                  <slot
                    :name="`Column.${column.value}`"
                    :rowInfo="rowInfo"
                    :columnInfo="columnInfo"
                  >
                  </slot>
                </template>
              </GridRow>
            </section>
            <section
              v-else-if="tableConfig.groupBy"
              @scroll.passive="hideModal"
            >
              <div
                v-for="(group, index) in groupedRows"
                :key="index"
                class="groupsContainer"
                :class="{
                  listOpen: group.openState === 1,
                  listClose: group.openState === 2,
                }"
                :style="{ '--elementsNumber': group.elements.length + 1 }"
              >
                <section
                  class="tableComponentRow noInfo titleGroup"
                  @click="manageGroupOpen(group)"
                >
                  <slot
                    name="GroupTitle"
                    :group="group.elements[0][tableConfig.groupBy]"
                  >
                    <slot
                      :name="`GroupTitle__${
                        group.elements[0][tableConfig.groupBy]
                      }`"
                      :group="group.elements[0][tableConfig.groupBy]"
                      >{{
                        group.elements[0][tableConfig.groupBy]
                          ? group.elements[0][tableConfig.groupBy]
                          : "Not Value"
                      }}</slot
                    >
                  </slot>
                </section>
                <GridRow
                  v-for="(rowData, index) in group.elements"
                  :key="
                    tableConfig.key ? getParam(rowData, tableConfig.key) : index
                  "
                  class="tableComponentRow"
                  :rowData="rowData"
                  :columns="columnsRendered"
                  :widthColumnArray="widthColumnArray"
                  :hideColumns="[tableConfig.groupBy]"
                  :editable="activeRow === rowData"
                  @rowEdited="onFiltersChange($event, rowData)"
                  @elemntPicked="clickEvent($event)"
                  @openCalendar="openCalendar"
                >
                  <template
                    #[`Column.${column.value}`]="{ columnInfo, rowInfo }"
                    v-for="column in columns"
                  >
                    <slot
                      :name="`Column.${column.value}`"
                      :rowInfo="rowInfo"
                      :columnInfo="columnInfo"
                    >
                    </slot>
                  </template>
                </GridRow>
              </div>
            </section>
          </section>
        </main>
      </section>
    </div>
    <footer v-if="paginator">
      <section class="quantityPerPageContainer">
        <span>Mostrar</span>
        <div class="selectContainer">
          <select v-model="quantityPerPage" @input="quantiTyChange">
            <option
              :selected="index === 0"
              :value="quantity"
              v-for="(quantity, index) in quantityPerPageOptions"
              :key="quantity"
            >
              {{ quantity }}
            </option>
          </select>
        </div>

        <span>Registros</span>
      </section>
      <section class="pagesContainer">
        <div class="PagesElement">
          <div
            class="before"
            :class="{ disabled: pageRender === 1 }"
            @click="() => pageRender !== 1 && pageChange(-1)"
          >
            Anterior
          </div>
          <div
            class="paginatorPage"
            @click="setActualPage(pagetoShow)"
            v-for="pagetoShow in pagesToShow"
            :key="pagetoShow"
            :class="{ active: pagetoShow === pageRender }"
          >
            {{ pagetoShow }}
          </div>
          <div class="paginatorPage active mobile">
            {{ pageRender }}
          </div>
          <div
            class="next"
            :class="{ disabled: pageRender >= totalPagesRender }"
            @click="() => pageRender < totalPagesRender && pageChange(1)"
          >
            Siguiente
          </div>
        </div>
      </section>
    </footer>
  </section>
</template>
<script>
import GridRow from "./GridRow.vue";
import GridFilter from "./GridFilters.vue";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
export default {
  name: "GridTable",

  components: {
    GridRow,
    DatePicker,
    GridFilter,
  },
  props: {
    //? [{name:ColumnName , value:paraMeterObject , orderable:true,orderableByEvent:false,editable:false,custmonMinWitdh:4rem,filter:{type:'input',custom}}]
    columns: {
      type: Array,
      default: () => [],
    },
    //? [{}]
    data: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    ajaxTable: {
      type: Boolean,
      default: () => false,
    },
    ajaxFunction: {
      type: Function,
      default: () => null,
    },
    tableConfig: {
      type: Object,
      default: { groupBy: null, activeFilters: false, key: null },
    },
    paginator: {
      default: () => true,
      type: Boolean,
    },
  },
  data() {
    return {
      totalElements: 0,
      activeFilters: false,
      attrsToday: [
        {
          key: "today",
          dot: "red",
          dates: new Date(),
        },
      ],
      range: "",
      modalConfiguration: { active: false },
      groupedRows: {},
      dataOrdered: [],
      desc: false,
      columToOrder: {},
      filterActive: null,
      quantityPerPageOptions: [10, 25, 50, 100],
      quantityPerPage: 10,
      widthColumnArray: [],
      pageRender: 1,
      totalPagesRender: 1,
      headerForOrderActive: null,
      activeRow: null,
      observer: null,
      dataCopy: [],
      scrollPosition: 0,
      scrollRange: 0,
      virtualScrollHeight: 0,
      thumbHeight: 30,
      filters: {},
    };
  },
  beforeMount() {
    if (!this.ajaxTable) {
      this.initOfflineTable();
    } else {
      this.manageAjaxMode();
    }
  },
  mounted() {
    this.observer = new ResizeObserver(this.watchcolumnsSize);
    this.obeserverConfig();
    this.$nextTick(() => {
      this.watchcolumnsSize();
      this.clickOutsiteModalCalendar();
    });
  },
  updated() {
    this.$emit("addRow", this.addRow);
    this.$emit("deleteRows", this.deleteRows);
    const scrollContainer = this.$refs.scrollContainer;
    if (scrollContainer) {
      setTimeout(() => {
        this.scrollPosition = scrollContainer.scrollTop;
        this.scrollRange =
          scrollContainer.scrollHeight - scrollContainer.offsetHeight;
        this.virtualScrollHeight = scrollContainer.offsetHeight;
        this.thumbHeight =
          (this.virtualScrollHeight / scrollContainer.scrollHeight) *
          this.virtualScrollHeight;
      }, 200);
    }
  },
  methods: {
    quantiTyChange(e) {
      const value = e.target.value;
      this.quantityPerPage = value;
      this.$emit("onRegistersNumberChange", value);
      this.pageRender = 1;
      if (this.ajaxTable) {
        this.manageAjaxMode();
      } else {
        this.setTotalPages();
      }
    },
    setScroll(e) {
      this.scrollPosition = e.target.scrollTop;
    },
    scrollTable(e) {
      this.$refs.scrollContainer.scrollTop = e.target.value;
    },
    columnFilterChange(value, columnInfo) {
      this.filters[columnInfo.value] = value;
      this.applyFilters();
      this.setTotalPages();
      this.setElemetsForView();
      this.groupRows();
    },
    applyFilters() {
      let filteredElements = [...this.dataCopy];
      for (const column in this.filters) {
        const filterValue = this.filters[column];
        if (Object.hasOwnProperty.call(this.filters, column)) {
          if (filterValue) {
            filteredElements = filteredElements.filter((row) => {
              const rowValue = this.getParam(row, column)
                ? (this.getParam(row, column) + "").toLowerCase()
                : "";
              if (rowValue) {
                return rowValue.includes(
                  (this.filters[column] + "").toLowerCase()
                );
              } else {
                return false;
              }
            });
          }
        }
      }
      this.rowsWithFiltersApplied = [...filteredElements];
    },
    obeserverConfig() {
      if (this.observer) {
        this.observer.disconnect();
      }
      const elementoObservado = this.$refs.columnsContainer;
      const childrens = [...elementoObservado.children];
      childrens.forEach((child) => {
        this.observer.observe(child);
      });
    },
    clickOutsiteModalCalendar() {
      document.addEventListener("click", this.ousiteListener);
    },
    ousiteListener(event) {
      const element = this.$refs.modalCalendar;
      const self = this;
      if (self.modalConfiguration.active) {
        if (!element.contains(event.target)) {
          self.modalConfiguration.active = false;
        }
      }
    },
    onDateRangeChange(e) {
      if (e) {
        const fecha = e;
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();
        this.editRow(
          this.getParamAndModify(
            this.modalConfiguration.rowData,
            this.modalConfiguration.key,
            `${mes}/${dia}/${anio}`
          ),
          this.modalConfiguration.rowData
        );
      }

      this.modalConfiguration.active = false;
    },
    onFiltersChange(e, rowData) {
      this.editRow(this.getParamAndModify(rowData, e.key, e.value), rowData);
    },
    hideModal() {
      if (this.modalConfiguration.active) {
        this.modalConfiguration.active = false;
      }
    },
    openCalendar(object) {
      if (this.modalConfiguration.active) {
        this.modalConfiguration.active = false;
        return;
      }
      const child = object.target;
      const scrollAncestor = this.$refs.scrollContainer;
      const childRect = child.getBoundingClientRect();
      const scrollAncestorRect = scrollAncestor.getBoundingClientRect();
      const x = childRect.left - scrollAncestorRect.left;
      const y = childRect.top - scrollAncestorRect.top;
      const scrollAncestorHeight = scrollAncestor.clientHeight;
      const halfScrollAncestorHeight = scrollAncestorHeight / 2;
      if (y > halfScrollAncestorHeight) {
        this.modalConfiguration = {
          active: true,
          x: x - 80,
          y: this.filterActive ? y - 180 : y - 140,
          ...object,
          value: this.getParam(object.rowData, object.key),
        };
      } else {
        this.modalConfiguration = {
          active: true,
          x: x - 80,
          y: this.filterActive ? y + 140 : y + 180,
          ...object,
          value: this.getParam(object.rowData, object.key),
        };
      }
    },
    setTotalPages() {
      if (
        this.rowsWithFiltersApplied.length <= 0 ||
        this.quantityPerPage <= 0
      ) {
        return 0;
      }
      this.totalElements = this.rowsWithFiltersApplied.length;
      const totalPages = Math.ceil(
        this.rowsWithFiltersApplied.length / this.quantityPerPage
      );
      this.totalPagesRender = totalPages;
    },
    addRow(newRow) {
      this.dataOrdered.unshift(newRow);
      this.groupRows();
    },
    deleteRows(rule) {
      const elementsDeleted = [];
      if (this.ajaxTable) {
        for (let i = this.dataOrdered.length - 1; i >= 0; i--) {
          if (rule(this.dataOrdered[i])) {
            elementsDeleted.push(this.dataOrdered.splice(i, 1)[0]);
          }
          this.$emit("elementDeleted", {
            elementsDeleted,
            newData: this.dataOrdered,
          });
        }
      } else {
        for (let i = this.dataCopy.length - 1; i >= 0; i--) {
          if (rule(this.dataCopy[i])) {
            elementsDeleted.push(this.dataCopy.splice(i, 1)[0]);
          }
        }
        this.applyFilters();
        this.setTotalPages();
        this.setElemetsForView();
        this.groupRows();
        this.$emit("elementDeleted", {
          elementsDeleted,
          newData: this.dataCopy,
        });
      }

      this.$emit("elementDeleted", {
        elementsDeleted,
        newData: this.dataOrdered,
      });
      this.groupRows();
    },
    editRow(newRow, rowData) {
      const index = this.dataOrdered.indexOf(rowData);
      const oldRow = { ...this.dataOrdered[index] };
      Object.assign(this.dataOrdered[index], newRow);
      this.$emit("rowEdited", { newData: this.dataOrdered, oldRow, newRow });
    },
    manageAjaxMode() {
      const header = this.headerForOrderActive;
      const info = {
        data: this.dataOrdered,
        page: this.pageRender,
        totalPages: this.totalPagesRender,
        quantityPerPage: this.quantityPerPage,
      };
      if (header) {
        info.desc = this.desc;
        info.columnName = header.name;
        info.orderableByEvent = header.orderableByEvent ? true : false;
        info.columnValue = header.value;
      }
      this.ajaxFunction(info, this.setAjaxInfo);
    },
    setAjaxInfo({ data, totalPages = 1, totalElements = 0 }) {
      this.dataOrdered = [...data];
      this.totalPagesRender = totalPages;
      this.totalElements = totalElements;
      this.groupRows();
    },
    groupedBy(valueToGroup, arrayTogroup) {
      const parts = valueToGroup.split(".");
      const groupedBy = arrayTogroup.reduce((accumulator, column) => {
        let group = column;
        for (const part of parts) {
          if (group && group.hasOwnProperty(part)) {
            group = group[part];
          } else {
            group = undefined;
            break;
          }
        }
        if (group !== undefined) {
          if (!accumulator[group]) {
            accumulator[group] = {};
            accumulator[group].elements = [];
            accumulator[group].openState = 0;
          }
          accumulator[group].elements.push(column);
        } else {
          const notValueGroup = "NotValue";
          if (!accumulator[notValueGroup]) {
            accumulator[notValueGroup] = {};
            accumulator[notValueGroup].elements = [];
            accumulator[notValueGroup].openState = 0;
          }
          accumulator[notValueGroup].elements.push(column);
          accumulator[notValueGroup].openState = 0;
        }

        return accumulator;
      }, {});

      return groupedBy;
    },
    pageChange(next) {
      if (next > 0) {
        this.$emit("onPageChange", this.pageRender + 1);
        this.setActualPage(this.pageRender + 1);
      } else {
        this.$emit("onPageChange", this.pageRender - 1);
        this.setActualPage(this.pageRender - 1);
      }
    },
    setActualPage(page) {
      this.$emit("onPageChange", page);
      this.pageRender = page;
      if (!this.ajaxTable) {
        this.setElemetsForView();
        this.groupRows();
      } else {
        this.manageAjaxMode();
      }
    },
    watchcolumnsSize() {
      const header = this.$refs.columnsContainer;
      this.widthColumnArray = [];
      if (header) {
        const children = header.children;
        for (let i = 0; i < children.length; i++) {
          const hijo = children[i];
          const anchoHijo = window
            .getComputedStyle(hijo)
            .getPropertyValue("width");
          this.widthColumnArray.push(anchoHijo);
        }
      }
    },
    manageClickOnColumnHeader(e, header) {
      if (header.orderable || header.orderableByEvent) {
        this.filterActive = header.value;
        this.headerForOrderActive = header;
        this.desc = !this.desc;
        this.orderManagment();
        if (this.ajaxTable && !header.orderableByEvent) {
          this.manageAjaxMode();
        } else if (!this.ajaxTable && !header.orderableByEvent) {
          this.setOfflineOrder(header);
        }
      }
    },
    orderByNumber(columValue, array) {
      array.sort((row, nextRow) => {
        const Row = row[columValue] ? row[columValue] : 0;
        const NextRow = nextRow[columValue] ? nextRow[columValue] : 0;
        if (this.desc) {
          return Row - NextRow;
        } else {
          return NextRow - Row;
        }
      });
    },
    orderByString(columValue, array) {
      array.sort((row, nextRow) => {
        const Row = row[columValue] ? row[columValue] : 0;
        const NextRow = nextRow[columValue] ? nextRow[columValue] : 0;
        if (this.desc) {
          return Row ? Row.localeCompare(NextRow) : -1;
        } else {
          return NextRow ? NextRow.localeCompare(Row) : -1;
        }
      });
    },
    setOfflineOrder(header) {
      const variableType = header.type;
      const columValue = header.value;
      switch (variableType) {
        case "number":
          this.orderByNumber(columValue, this.rowsWithFiltersApplied);
          this.dataOrdered = [...this.rowsWithFiltersApplied];
          this.setActualPage(1);
          break;

        case "string":
          this.orderByString(columValue, this.rowsWithFiltersApplied);
          this.dataOrdered = [...this.rowsWithFiltersApplied];
          this.setActualPage(1);
          break;

        default:
          console.warn("Value is neither Number or String");
          break;
      }
    },
    orderManagment() {
      const header = this.headerForOrderActive;
      const orderInfo = {
        orderableByEvent: header.orderableByEvent ? true : false,
        columnName: header.name,
        columnValue: header.value,
        desc: this.desc,
      };
      this.$emit("onChangeOrderPicked", orderInfo);
    },
    manageGroupOpen(group) {
      if (group.openState === 0) {
        group.openState = 2;
      } else {
        group.openState =
          group.openState < 2 ? group.openState + 1 : group.openState - 1;
      }
    },
    groupRows() {
      if (
        this.ajaxTable &&
        this.dataOrdered.length > 0 &&
        this.tableConfig?.groupBy
      ) {
        this.groupedRows = this.groupedBy(
          this.tableConfig.groupBy,
          this.dataOrdered
        );
      } else if (
        !this.ajaxTable &&
        this.dataCopy.length > 0 &&
        this.tableConfig?.groupBy
      ) {
        this.groupedRows = this.groupedBy(
          this.tableConfig.groupBy,
          this.dataOrdered
        );
      } else {
        this.groupedRows = [];
      }
    },
    getParam(objeto, consulta) {
      const keys = consulta.split(".");
      let resultado = objeto;
      for (const key of keys) {
        resultado = resultado[key];
        if (typeof resultado === "undefined") {
          return undefined;
        }
      }

      return resultado;
    },
    getParamAndModify(objeto, consulta, nuevaClave) {
      const keys = consulta.split(".");
      let resultado = JSON.parse(JSON.stringify(objeto));
      let nuevoObjeto = { ...resultado }; // Clonamos el objeto original para no modificarlo directamente
      if (keys.length > 1) {
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          resultado = resultado[key];

          if (typeof resultado === "undefined") {
            return undefined;
          }

          if (i === keys.length - 2 && nuevaClave !== undefined) {
            resultado[keys[i + 1]] = nuevaClave;
          }
        }
        return nuevoObjeto;
      } else {
        nuevoObjeto[keys[0]] = nuevaClave;
        return nuevoObjeto;
      }
    },
    initOfflineTable() {
      this.dataCopy = [...this.data];
      this.rowsWithFiltersApplied = [...this.data];
      this.setTotalPages();
      this.setElemetsForView();
      this.groupRows();
    },
    clickEvent(e) {
      if (this.activeRow !== e.rowData) {
        this.modalConfiguration.active = false;
      }
      this.activeRow = e.rowData;
      this.$emit("onClickEvent", e);
    },
    setElemetsForView() {
      const firstIndex =
        this.pageRender === 1
          ? 0
          : (this.pageRender - 1) * this.quantityPerPage;
      let lastIndex = firstIndex + this.quantityPerPage;
      if (lastIndex > this.rowsWithFiltersApplied.length) {
        lastIndex = this.rowsWithFiltersApplied.length;
      }
      this.dataOrdered = this.rowsWithFiltersApplied.slice(
        firstIndex,
        lastIndex
      );
      2;
    },
  },
  destroyed() {
    document.removeEventListener("click", this.ousiteListener);
  },
  watch: {
    data() {
      if (!this.ajaxTable) {
        this.initOfflineTable();
      }
    },
    ajaxTable() {
      this.manageAjaxMode();
    },
    columns() {
      this.obeserverConfig();
    },
    tableConfig: {
      handler() {
        this.obeserverConfig();
      },
      deep: true,
    },
  },
  computed: {
    pagesToShow() {
      const pagesToShow = [];
      const halfRange = 2;
      let lowerBound = Math.max(this.pageRender - halfRange, 1);
      let upperBound = Math.min(
        this.pageRender + halfRange,
        this.totalPagesRender
      );
      const neededPages = 5 - (upperBound - lowerBound + 1);
      if (lowerBound === 1) {
        upperBound = Math.min(upperBound + neededPages, this.totalPagesRender);
      } else if (upperBound === this.totalPagesRender) {
        lowerBound = Math.max(lowerBound - neededPages, 1);
      }

      for (let i = lowerBound; i <= upperBound; i++) {
        pagesToShow.push(i);
      }

      return pagesToShow;
    },
    columnsRendered() {
      return this.columns.filter(
        (column) => column.value != this.tableConfig.groupBy
      );
    },
  },
};
</script>
<style lang="scss" scoped>
// Variables
$primaryColor: #e9332b;
$borderColor: #ebedf3;
$backgroundColor: white;
$scrollbarBackground: #f0f0f0;
$scrollbarThumb: #e9332b;
$backgroundColor: white;
div {
  border-collapse: collapse;
}
// Mixins
@mixin flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}
.calendarModal {
  z-index: 1000;
  position: absolute;
}
.topOfDataTable {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .elementsCounter {
    margin: unset;
    padding-left: 0.2rem;
  }
  .form-switch {
    padding-right: 0.2rem;
  }
}
.tableComponentRow {
  display: flex;
  min-height: 3rem;
  height: 3rem;
  min-width: fit-content;
  background-color: $backgroundColor;
}

.noInfo {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tableComponentColumn {
  display: flex;
  align-items: center;
  border: solid 1px $borderColor;
  text-align: center;
  border-spacing: 5px;
  min-width: var(--width);
  max-width: var(--width);
  padding: 0.45rem;
  overflow: hidden;
  font-size: 0.8rem;
}
.tableComponent header,
.tableComponent nav {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  border-collapse: collapse;
  height: 3.5rem;
  min-height: 3.5rem;
  & > div {
    @include flexCenter;
    border: solid 1px $borderColor;
    padding: 1rem;
    height: 100%;
    max-height: 100%;
    min-height: 100%;
    flex: 1;
    overflow: hidden;
    min-width: fit-content;
    .headerTitle {
      display: flex;
      justify-content: center;
      gap: 0.4rem;
      flex-wrap: nowrap;
    }
    .orderContainer {
      display: none;
    }
  }
}
.tableComponent nav {
  height: 0px;
  transition: all 0.3s ease-in-out;
  min-height: 0px;
  div {
    padding: 0.2rem;
    visibility: hidden;
  }
  &.active {
    height: 2.8rem;
    min-height: 2.8rem;
    div {
      visibility: visible;
    }
  }
}
.tableContainer {
  display: flex;
  flex-direction: column;
  overflow: visible;
  gap: 1.2rem;
  &.disabled {
    pointer-events: none;
  }
  ::-webkit-scrollbar {
    width: 0.25rem;
    height: 0.4rem;
    background-color: $scrollbarBackground;
  }

  ::-webkit-scrollbar-thumb {
    background: $scrollbarThumb;
    border-radius: 0.3rem;
    border: unset;
    padding: unset;
  }
}

footer {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}

.pagesContainer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.3rem;

  .PagesElement {
    border-radius: 5px;
    overflow: hidden;

    div {
      @include flexCenter;
      line-height: 1.3;
      text-align: center;
      width: 60px;
      height: 27px;
      font-size: 0.7rem;
      font-weight: 500;
      color: #3f4254;
      cursor: pointer;
      &.before,
      &.next {
        background-color: #f3f6f9;
      }
      &:hover:not(.disabled) {
        background-color: red;
        color: white;
      }
      &.paginatorPage {
        cursor: pointer;
        border-radius: 3px;
        width: 27px;
        &.active {
          background-color: red;
          color: white;
        }
        @media screen and (min-width: 500px) {
          &.mobile {
            display: none;
          }
        }
        @media screen and (max-width: 500px) {
          & {
            display: none;
          }
          &.mobile {
            display: flex;
            cursor: help;
          }
        }
      }

      &.disabled {
        cursor: not-allowed;
        opacity: 0.65;
      }
    }
    display: flex;
  }
}

.quantityPerPageContainer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.25rem;
  overflow: visible;
  font-size: 0.82rem;
  padding-left: 0.3rem;

  .selectContainer {
    position: relative;
    width: fit-content;
    height: fit-content;
    color: rgb(63, 66, 84);

    &::after,
    &::before {
      font-size: 7px;
      display: block;
      position: absolute;
      right: 5px;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 10px;
      width: 10px;
      pointer-events: none;
      color: rgb(63, 66, 84);
    }

    &::after {
      content: "▲";
      transform: translateY(-30%) scaleX(145%);
    }

    &::before {
      transform: translateY(35%) scaleX(145%);
      content: "▼";
    }

    select {
      width: 56px;
      height: 32px;
      outline: unset;
      border-radius: 0.85rem;
      font-weight: 500;
      border: 1px solid $borderColor;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
      font-size: 0.78rem;
      text-indent: 0.7rem;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
      color: rgb(63, 66, 84);
    }
  }
}

.loader {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(128, 128, 128, 0.055);
  z-index: 100;
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    content: "";
    @include flexCenter;
    background-image: url("@/assets/icons/loading.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 70px;
    height: 70px;
    opacity: 0.7;
  }
}

.canEdit {
  .headerTitle {
    cursor: pointer;
    .orderContainer {
      display: flex;
    }
  }
  &.filterActive {
    b {
      color: $primaryColor;
    }
    span {
      i:not(.active) {
        opacity: 0.6;
      }
      .active {
        color: $primaryColor;
      }
    }
  }
}

section {
  position: relative;
  max-width: 100%;

  .tableComponent {
    border: solid 1px $borderColor;
    border-radius: 4px;
    position: relative;
    margin: unset;
    min-width: 100%;
    background-color: $backgroundColor;
    border-collapse: collapse;
    border-spacing: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-width: 100%;
    overflow-x: visible;
    min-height: 6.5rem;
    border-collapse: collapse;
    main {
      position: relative;
      z-index: 5;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: fit-content;
    }
  }
}
.tableMaxContentContainer {
  overflow: hidden;
  display: flex;
  min-width: 100%;
  position: relative;
}
.scrollContainer {
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    width: 0px; /* For Chrome, Safari, and Opera */
  }

  &::-webkit-scrollbar-thumb {
    width: 0px;
    background: transparent; /* For Chrome, Safari, and Opera */
  }
}
@keyframes closeList {
  to {
    max-height: 3rem;
  }
}
@keyframes openList {
  from {
    max-height: 3rem;
  }
  to {
    max-height: calc((var(--elementsNumber) * 3rem));
  }
}
.listClose {
  animation-name: closeList;
  border-bottom: solid 1px $borderColor;
}
.listOpen {
  animation-name: openList;
}
.groupsContainer {
  max-height: calc((var(--elementsNumber) * 3rem));
  animation-duration: 1s;
  animation-fill-mode: forwards;
  overflow: hidden;
  .titleGroup {
    cursor: n-resize;
  }
}
.slider {
  cursor: initial;
  --thumbHeight: 20px;
  background-color: $scrollbarBackground;
  position: absolute;
  z-index: 1000;
  width: 100px;
  height: 5px;
  right: 3px;
  bottom: 2px;
  transform-origin: right center;
  transform: rotate(90deg);
  -webkit-appearance: none; /* Override default CSS styles */
}
.slider::-webkit-slider-thumb {
  border-radius: 5px;
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  height: 3px; /* Set a specific slider handle width */
  width: var(--thumbHeight); /* Slider handle height */
  background: $scrollbarThumb; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  border-radius: 5px;
  height: 3px; /* Set a specific slider handle width */
  width: var(--thumbHeight); /* Slider handle height */
  background: $scrollbarThumb; /* Green background */
  cursor: pointer; /* Cursor on hover */
}
</style>