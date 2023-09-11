<template>
  <div class="filterColumn">
    <div class="filterInput" v-if="type==='text' || type==='number'">
        <input :type="type" @input="emitInputValue" />
    </div>
  </div>
</template>
<script>
import vSelect from "vue-select";
export default {
  components: { vSelect },
  props: {
    type:{
        type:String,
        default:'text'
    }
  },
  methods: {
    emitInputValue(e) {
      this.$emit(e.target.value);
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
.filterColumn{
    width: 100%;
    height: 100%;
    input{
        width: 100%;
        outline: unset;
    }
}
</style>