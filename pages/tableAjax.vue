<template>
  <section>
    <h1>jaja salu2</h1>
    <button
      @click="
        () =>
          gridGlobalConfig.groupBy
            ? (gridGlobalConfig.groupBy = null)
            : (gridGlobalConfig.groupBy = 'gender')
      "
    >
      Group by gender
    </button>
    <button @click="addNewRow">add Row</button>
    <GridTable
      ajaxTable
      :tableConfig="gridGlobalConfig"
      :columns="columns"
      :loading="tableLoader"
      :ajaxFunction="ajaxModeForTable"
      @rowEdited="rowEdit"
      @onClickEvent="elementClicked"
      @addRow="(e) => (addRow = e)"
      class="tableCostumClass"
    >
      <template #[`Genero`]>
        <div class="containImage">
          <img
            src="data:image/png;base64,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"
            alt="image"
          />
        </div>
      </template>
      <template #[`GroupTitle__Masculino`]>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Male-símbolo.svg/1024px-Male-símbolo.svg.png"
          alt=""
          class="fitImgSex"
        />
      </template>
      <template #[`GroupTitle__Femenino`]>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Female_symbol_%28heavy_pink%29.svg/1200px-Female_symbol_%28heavy_pink%29.svg.png"
          alt=""
          class="fitImgSex"
        />
      </template>
      <template #[`Column.customcolor`] = "prop">
        <div
          class="ColorForPerson"
        :style="{
          'background-color': prop.rowInfo.gender === 'Masculino' ? 'green' : 'pink',
          'background-image': (prop.rowInfo.gender !== 'Masculino' && prop.rowInfo.gender !== 'Femenino') && 'linear-gradient(to right top, #d476d8, #ed5a7e, #c86830, #827900, #1f7c2f)'
        }"
        ></div>
      </template>
    </GridTable>
  </section>
</template>
<script>
import api from "../mockDataInfo";
import GridTable from '../components/GridTable/GridTable.vue'
export default {
  components:{GridTable},
  data() {
    return {
      gridGlobalConfig: {
        groupBy: "gender",
      },
      tableLoader: false,
      customFilterGender: null,
      columns: [
        {
          name: "Nombre",
          value: "name",
          orderable: true,
          type: "string",
        },
        {
          name: "Apellido",
          value: "lastName",
          orderable: true,
          type: "string",
        },
        {
          name: "Cedula",
          value: "document",
          orderable: true,
          editableConfig: {
            editable: true,
            inputType: "number",
            placeHolder: "Insert Document",
          },
          type: "number",
        },
        {
          name: "Date",
          value: "date.local",
          orderable: true,
          editableConfig: {
            editable: true,
            inputType: "date",
          },
        },
        {
          name: "Genero",
          value: "gender",
          type: "string",
          orderable:true,
          editableConfig: {
            editable: true,
            inputType: "selector",
            label: "name",
            options: ["Masculino", "Femenino"],
          },
          custmonMinWitdh: "6.5rem",
        },
        {
          name: "Color por Genero",
          value: "customcolor",
        },
      ],
      data: [],
      addRow: null,
    };
  },
  methods: {
    addNewRow() {
      this.addRow({
        name: "NEW",
        lastName: "ROW",
        gender: "Femenino",
        date: { local: "10/13/2023", value: "10/12/2023" },
        document: 321789456,
      });
    },
    elementClicked(e) {
      // console.log(e);
    },
    rowEdit(e) {
      console.log(e);
    },
    async ajaxModeForTable(tableInfo, callBack) {
      this.tableLoader = true;
      console.log(tableInfo)
      const response = await api(
        null,
        tableInfo.page,
        tableInfo.quantityPerPage
      );
      callBack({
        data: response.data,
        totalPages: response.totalPages,
        totalElements:78,
      });
      this.tableLoader = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.tableCostumClass {
  max-width: 50%;
  margin: auto;
  max-height: 600px;
}
.ColorForPerson {
  width: 20px;
  height: 20px;
  display: block;
  margin: auto;
  border-radius: 2px;
}
.containImage {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-height: 30px;
    max-width: 40px;
    mix-blend-mode: multiply;
  }
}
.fitImgSex {
  max-height: 70%;
  margin: auto;
}
</style>