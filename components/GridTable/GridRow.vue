<template>
  <div class="tableComponentRow">
    <div
      @click.stop="emitCLickEvent($event, column, rowData)"
      v-for="(column, index) in columns"
      :key="column.value"
      class="tableComponentColumn"
      :style="{
        '--width': widthColumnArray[index],
      }"
    >
      <slot
        v-if="
          (column.editableConfig ? column.editableConfig.editable : false) &&
          editable
        "
        :name="'ColumnEdit.' + column.value"
        :rowInfo="rowData"
        :columnInfo="column"
        :updateRow="updateRow"
      >
        <div
          v-if="
            column.editableConfig.inputType === 'number' ||
            column.editableConfig.inputType === 'text'
          "
          class="inputContainer"
        >
          <input
            :placeholder="column.editableConfig.placeHolder"
            :type="column.editableConfig.inputType"
            :value="getParam(rowData, column.value)"
            @input="
              (e) => updateRow({ key: column.value, newValue: e.target.value })
            "
          />
        </div>
        <div
          v-else-if="column.editableConfig.inputType === 'selector'"
          class="inputContainer"
        >
          <v-select
            :label="column.editableConfig.label"
            :options="column.editableConfig.options"
            :placeholder="getParam(rowData, column.value)"
            @option:selected="
              (e) => updateRow({ key: column.value, newValue: e })
            "
          />
        </div>
        <div v-else-if="column.editableConfig.inputType === 'date'" class="inputContainer" @click="showCalendar($event,{ key: column.value })">
          <input type="text" disabled  :value="getParam(rowData, column.value)">
        </div>
      </slot>
      <slot
        v-else
        :name="'Column.' + column.value"
        :rowInfo="rowData"
        :columnInfo="column"
      >
        {{ manageRowData(rowData, column.value) }}
      </slot>
    </div>
  </div>
</template>
<script>
import vSelect from "vue-select";
export default {
  components: { vSelect },
  props: {
    rowData: Object,
    columns: Array,
    widthColumnArray: Array,
    editable: Boolean,
    hideColumns: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    showCalendar(event,{key}) {
     const editedRow = {key, rowData:this.rowData, target: event.target };
      this.$emit('openCalendar',editedRow)
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
    emitCLickEvent(event, columnData, rowData) {
      this.$emit("elemntPicked", { event, columnData, rowData });
    },
    manageRowData(rowData, value) {
      if (rowData) {
        if (this.getParam(rowData, value)) {
          return this.getParam(rowData, value);
        } else {
          return " - ";
        }
      } else {
        throw new Error(
          `an error with data row have ocurred on Data: ${value} `
        );
      }
    },
    updateRow({ key, newValue }) {
      const editedRow = { ...this.rowData, value: newValue ,key};
      this.$emit("rowEdited", editedRow);
    },
  },
};
</script>

<style lang="scss" scoped>
$primaryColor: #e9332b;
$borderColor: #ebedf3;
$backgroundColor: white;
$scrollbarBackground: #f0f0f0;
$scrollbarThumb: #e9332b;
.tableComponentRow {
  display: flex;
  min-height: 3rem;
  height: 3rem;
  min-width: fit-content;
  overflow: visible;
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
  overflow: visible;
  font-size: 0.8rem;
}
.inputContainer {
  width: 100%;
  overflow: visible;
  input {
    max-width: 100%;
  }
}
</style>