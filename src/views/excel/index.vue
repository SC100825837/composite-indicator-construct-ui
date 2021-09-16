<template>
  <div id="example1">
    <hot-table ref="hotTableComponent" :settings="hotSettings">
      <hot-column title="First column header"></hot-column>
      <hot-column :settings="secondColumnSettings"></hot-column>
    </hot-table>
    <button v-on:click="swapHotData" class="controls">Load new data!</button>
  </div>
</template>

<script>
import {HotTable, HotColumn} from '@handsontable/vue';
import Handsontable from 'handsontable';

export default {
  name: "example1",
  components: {
    HotTable,
    HotColumn
  },
  data() {
    return {
      hotSettings: {
        data: Handsontable.helper.createSpreadsheetData(6, 2),
        colHeaders: true,
        readOnly: false,
        contextMenu: {
          items: {
            'row_above': {
              name: 'Insert row above this one (custom name)'
            },
            'row_below': {},
            'separator': Handsontable.plugins.ContextMenu.SEPARATOR,
            'clear_custom': {
              name: 'Clear all cells (custom)',
              callback() {
                this.clear();
              }
            }
          }
        },
        height: 'auto',
        licenseKey: 'non-commercial-and-evaluation'
      },
      secondColumnSettings: {
        title: 'Second column header',
      },
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
    },
    swapHotData: function() {
      // The Handsontable instance is stored under the `hotInstance` property of the wrapper component.
      this.$refs.hotTableComponent.hotInstance.loadData([['new', 'data']]);
    }
  },
}
</script>

<style>

</style>


<style src="../../../node_modules/handsontable/dist/handsontable.full.css"></style>
