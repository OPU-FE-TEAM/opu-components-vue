<template>
  <div>
    <div style="height:600px;width:1000px">
      <DataTable
        show-overflow
        keep-source
        ref="xGrid"
        height="300px"
        :data="tableData"
        :setcolumns-config="setColumns"
        class="abc-table"
        :proxy-columns="proxyColumns"
      >
      </DataTable>

      <a-button @click="showSetColumns">设置表头</a-button>
    </div>
  </div>
</template>

<script>
// import {utils} from '../../index'

function getData(arr) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(arr);
      const size = arr.pageSize ? arr.pageSize : 20;
      const pageIndex = arr.pageIndex ? arr.pageIndex : 1;
      const list = Array.from({ length: size }, (_, key) => ({
        id: key,
        name: `name_${pageIndex}_${key}`,
        checkbox: key < 3 ? true : false,
        checkbox1: key === 5 ? true : false,
        select: "",
        select1: "",
        switch: false,
        pulldownTable: "",
        datePicker: "2021-05-05",
        children: [
          {
            id: "a1",
            name: "cname1"
          },
          {
            id: "a2",
            name: "cname2"
          }
        ]
      }));
      const json = {
        // data: [...list],
        // total: 100
        code: 0,
        data: {
          data: [...list],
          total: size
        }
      };
      console.log(json);
      resolve(json);
    }, 500);
  });
}

function getColumns(arr) {
  return new Promise(resolve => {
    console.log(arr);
    setTimeout(() => {
      // const code = arr && arr.code ? arr.code : "";
      const list = [
        {
          name: "statusTypesDesc",
          sort: 0,
          show: true,
          width: 50,
          drag: true,
          align: "center",
          parentCode: "",
          customName: "物品状态",

          children: [],
          sysColumnName: "物品状态",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "goodsCode",
          sort: 1,
          show: true,
          width: 50,
          drag: true,
          align: "center",
          parentCode: "",
          customName: "物品编码",

          children: [],
          sysColumnName: "物品编码",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "goodsName",
          sort: 2,
          show: true,
          width: 180,
          drag: true,
          align: "left",
          parentCode: "",
          customName: "物品名称",

          children: [],
          sysColumnName: "物品名称",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "typeName",
          sort: 3,
          show: false,
          width: 80,
          drag: true,
          align: "left",
          parentCode: "",
          customName: "项目大类",

          children: [],
          sysColumnName: "项目大类",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "hisGoodsId",
          sort: 4,
          show: true,
          width: 120,
          drag: true,
          align: "left",
          parentCode: "",
          customName: "HIS编码",

          children: [],
          sysColumnName: "HIS编码",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "goodsCategoryName",
          sort: 5,
          show: false,
          width: 80,
          drag: true,
          align: "left",
          parentCode: "",
          customName: "项目分类",

          children: [],
          sysColumnName: "项目分类",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "specifications",
          sort: 6,
          show: true,
          width: 120,
          drag: true,
          align: "right",
          parentCode: "",
          customName: "规格",

          children: [],
          sysColumnName: "规格",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "modelName",
          sort: 7,
          show: true,
          width: 60,
          drag: true,
          align: "center",
          parentCode: "",
          customName: "剂型",

          children: [],
          sysColumnName: "剂型",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "batchNo",
          sort: 8,
          show: false,
          width: 80,
          drag: true,
          align: "right",
          parentCode: "",
          customName: "批号",

          children: [],
          sysColumnName: "批号",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "unitName",
          sort: 9,
          show: true,
          width: 50,
          drag: true,
          align: "center",
          parentCode: "",
          customName: "单位",

          children: [],
          sysColumnName: "大单位",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "unitPrice",
          sort: 10,
          show: false,
          width: 80,
          drag: true,
          align: "right",
          parentCode: "",
          customName: "单价",

          children: [],
          sysColumnName: "大单位进价",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "smallUnitName",
          sort: 11,
          show: false,
          width: 60,
          drag: true,
          align: "left",
          parentCode: "",
          customName: "小单位",

          children: [],
          sysColumnName: "小单位",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "smallUnitPrice",
          sort: 12,
          show: false,
          width: 80,
          drag: true,
          align: "right",
          parentCode: "",
          customName: "小单位单价",

          children: [],
          sysColumnName: "小单位进价",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "currentCheckDate",
          sort: 13,
          show: false,
          width: 130,
          drag: true,
          align: "left",
          parentCode: "",
          customName: "上次盘点时间",

          children: [],
          sysColumnName: "上次盘点时间",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "stockItemStatusDesc",
          sort: 14,
          show: false,
          width: 70,
          drag: true,
          align: "left",
          parentCode: "",
          customName: "库存状态",

          children: [],
          sysColumnName: "库存状态",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "unitRetailPrice",
          sort: 15,
          show: false,
          width: 100,
          drag: true,
          align: "right",
          parentCode: "",
          customName: "大单位售价",

          children: [],
          sysColumnName: "大单位售价",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "opening",
          sort: 16,
          show: false,
          width: 80,
          drag: true,
          align: "left",
          parentCode: null,
          customName: "期初",

          children: [
            {
              name: "openingQuantity",
              sort: 16,
              show: false,
              width: 70,
              drag: true,
              align: "right",
              parentCode: "opening",
              customName: "期初数量",

              children: [],
              sysColumnName: "期初数量",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "openingAvgPrice",
              sort: 17,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "opening",
              customName: "期初均价",

              children: [],
              sysColumnName: "期初进货均价",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "openingTotalPrice",
              sort: 18,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "opening",
              customName: "期初金额（进价）",

              children: [],
              sysColumnName: "期初进货金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "openingRetailPrice",
              sort: 23,
              show: false,
              width: 100,
              drag: true,
              align: "right",
              parentCode: "opening",
              customName: "期初售价金额",

              children: [],
              sysColumnName: "期初售价金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            }
          ],
          sysColumnName: "期初",
          isHide: false,
          rowSpan: null,
          colSpan: 4
        },
        {
          name: "inStock",
          sort: 17,
          show: false,
          width: 80,
          drag: true,
          align: "left",
          parentCode: null,
          customName: "入库",

          children: [
            {
              name: "inStockQuantity",
              sort: 20,
              show: false,
              width: 70,
              drag: true,
              align: "right",
              parentCode: "inStock",
              customName: "入库数量",

              children: [],
              sysColumnName: "入库数量",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "inStockAvgPrice",
              sort: 21,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "inStock",
              customName: "入库均价",

              children: [],
              sysColumnName: "入库进货均价",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "inStockTotalPrice",
              sort: 22,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "inStock",
              customName: "入库金额",

              children: [],
              sysColumnName: "入库进货金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "inStockRetailPrice",
              sort: 28,
              show: false,
              width: 100,
              drag: true,
              align: "right",
              parentCode: "inStock",
              customName: "入库售价金额",

              children: [],
              sysColumnName: "入库售价金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            }
          ],
          sysColumnName: "入库",
          isHide: false,
          rowSpan: null,
          colSpan: 4
        },
        {
          name: "outStock",
          sort: 18,
          show: true,
          width: 80,
          drag: true,
          align: "left",
          parentCode: null,
          customName: "出库",

          children: [
            {
              name: "outStockQuantity",
              sort: 24,
              show: true,
              width: 70,
              drag: true,
              align: "right",
              parentCode: "outStock",
              customName: "出库数量",

              children: [],
              sysColumnName: "出库数量",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "outStockAvgPrice",
              sort: 25,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "outStock",
              customName: "出库均价",

              children: [],
              sysColumnName: "出库进货均价",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "outStockTotalPrice",
              sort: 26,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "outStock",
              customName: "出库金额（进价）",

              children: [],
              sysColumnName: "出库进货金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "outStockRetailPrice",
              sort: 33,
              show: false,
              width: 100,
              drag: true,
              align: "right",
              parentCode: "outStock",
              customName: "出库售价金额",

              children: [],
              sysColumnName: "出库售价金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            }
          ],
          sysColumnName: "出库",
          isHide: false,
          rowSpan: null,
          colSpan: 4
        },
        {
          name: "ending",
          sort: 19,
          show: true,
          width: 80,
          drag: true,
          align: "left",
          parentCode: null,
          customName: "期末",

          children: [
            {
              name: "endingQuantity",
              sort: 48,
              show: true,
              width: 70,
              drag: true,
              align: "right",
              parentCode: "ending",
              customName: "期末数量",

              children: [],
              sysColumnName: "期末数量",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "endingAvgPrice",
              sort: 49,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "ending",
              customName: "期末均价",

              children: [],
              sysColumnName: "期末进货均价",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "endingTotalPrice",
              sort: 50,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "ending",
              customName: "期末金额（进价）",

              children: [],
              sysColumnName: "期末进货金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "endingRetailPrice",
              sort: 63,
              show: false,
              width: 100,
              drag: true,
              align: "right",
              parentCode: "ending",
              customName: "期末售价金额",

              children: [],
              sysColumnName: "期末售价金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            }
          ],
          sysColumnName: "期末",
          isHide: false,
          rowSpan: null,
          colSpan: 4
        },
        {
          name: "smallUnitRetailPrice",
          sort: 20,
          show: false,
          width: 100,
          drag: true,
          align: "right",
          parentCode: "",
          customName: "小单位售价",

          children: [],
          sysColumnName: "小单位售价",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "returnGoods",
          sort: 21,
          show: false,
          width: 80,
          drag: true,
          align: "left",
          parentCode: null,
          customName: "退货",

          children: [
            {
              name: "returnGoodsQuantity",
              sort: 28,
              show: false,
              width: 70,
              drag: true,
              align: "right",
              parentCode: "returnGoods",
              customName: "退货数量",

              children: [],
              sysColumnName: "退货数量",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "returnGoodsAvgPrice",
              sort: 29,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "returnGoods",
              customName: "退货均价",

              children: [],
              sysColumnName: "退货进货均价",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "returnGoodsTotalPrice",
              sort: 30,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "returnGoods",
              customName: "退货金额（进价）",

              children: [],
              sysColumnName: "退货进货金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "returnGoodsRetailPrice",
              sort: 38,
              show: false,
              width: 100,
              drag: true,
              align: "right",
              parentCode: "returnGoods",
              customName: "退货售价金额",

              children: [],
              sysColumnName: "退货售价金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            }
          ],
          sysColumnName: "退货",
          isHide: false,
          rowSpan: null,
          colSpan: 4
        },
        {
          name: "returnStock",
          sort: 22,
          show: false,
          width: 80,
          drag: true,
          align: "left",
          parentCode: null,
          customName: "退库",

          children: [
            {
              name: "returnStockQuantity",
              sort: 32,
              show: false,
              width: 70,
              drag: true,
              align: "right",
              parentCode: "returnStock",
              customName: "退库数量",

              children: [],
              sysColumnName: "退库数量",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "returnStockAvgPrice",
              sort: 33,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "returnStock",
              customName: "退库均价",

              children: [],
              sysColumnName: "退库进货均价",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "returnStockTotalPrice",
              sort: 34,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "returnStock",
              customName: "退库金额（进价）",

              children: [],
              sysColumnName: "退库进货金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "returnStockRetailPrice",
              sort: 43,
              show: false,
              width: 100,
              drag: true,
              align: "right",
              parentCode: "returnStock",
              customName: "退库售价金额",

              children: [],
              sysColumnName: "退库售价金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            }
          ],
          sysColumnName: "退库",
          isHide: false,
          rowSpan: null,
          colSpan: 4
        },
        {
          name: "reportLoss",
          sort: 23,
          show: false,
          width: 80,
          drag: true,
          align: "left",
          parentCode: null,
          customName: "报损",

          children: [
            {
              name: "reportLossQuantity",
              sort: 36,
              show: false,
              width: 70,
              drag: true,
              align: "right",
              parentCode: "reportLoss",
              customName: "报损数量",

              children: [],
              sysColumnName: "报损数量",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "reportLossAvgPrice",
              sort: 37,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "reportLoss",
              customName: "报损均价",

              children: [],
              sysColumnName: "报损进货均价",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "reportLossTotalPrice",
              sort: 38,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "reportLoss",
              customName: "报损金额（进价）",

              children: [],
              sysColumnName: "报损进货金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "reportLossRetailPrice",
              sort: 48,
              show: false,
              width: 100,
              drag: true,
              align: "right",
              parentCode: "reportLoss",
              customName: "报损售价金额",

              children: [],
              sysColumnName: "报损售价金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            }
          ],
          sysColumnName: "报损",
          isHide: false,
          rowSpan: null,
          colSpan: 4
        },
        {
          name: "reportOverflow",
          sort: 24,
          show: false,
          width: 80,
          drag: true,
          align: "left",
          parentCode: null,
          customName: "报溢",

          children: [
            {
              name: "reportOverflowQuantity",
              sort: 40,
              show: false,
              width: 70,
              drag: true,
              align: "right",
              parentCode: "reportOverflow",
              customName: "报溢数量",

              children: [],
              sysColumnName: "报溢数量",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "reportOverflowAvgPrice",
              sort: 41,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "reportOverflow",
              customName: "报溢均价",

              children: [],
              sysColumnName: "报溢进货均价",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "reportOverflowTotalPrice",
              sort: 42,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "reportOverflow",
              customName: "报溢金额（进价）",

              children: [],
              sysColumnName: "报溢进货金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "reportOverflowRetailPrice",
              sort: 53,
              show: false,
              width: 100,
              drag: true,
              align: "right",
              parentCode: "reportOverflow",
              customName: "报溢售价金额",

              children: [],
              sysColumnName: "报溢售价金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            }
          ],
          sysColumnName: "报溢",
          isHide: false,
          rowSpan: null,
          colSpan: 4
        },
        {
          name: "transfer",
          sort: 25,
          show: false,
          width: 80,
          drag: true,
          align: "left",
          parentCode: null,
          customName: "调拨",

          children: [
            {
              name: "transferQuantity",
              sort: 44,
              show: false,
              width: 70,
              drag: true,
              align: "right",
              parentCode: "transfer",
              customName: "调拨数量",

              children: [],
              sysColumnName: "调拨数量",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "transferAvgPrice",
              sort: 45,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "transfer",
              customName: "调拨均价",

              children: [],
              sysColumnName: "调拨进货均价",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "transferTotalPrice",
              sort: 46,
              show: false,
              width: 80,
              drag: true,
              align: "right",
              parentCode: "transfer",
              customName: "调拨金额（进价）",

              children: [],
              sysColumnName: "调拨进货金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "transferRetailPrice",
              sort: 58,
              show: false,
              width: 100,
              drag: true,
              align: "right",
              parentCode: "transfer",
              customName: "调拨售价金额",

              children: [],
              sysColumnName: "调拨售价金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            }
          ],
          sysColumnName: "调拨",
          isHide: false,
          rowSpan: null,
          colSpan: 4
        },
        {
          name: "manufacturerName",
          sort: 26,
          show: false,
          width: 200,
          drag: true,
          align: "left",
          parentCode: "",
          customName: "生产厂商",

          children: [],
          sysColumnName: "生产厂商",
          isHide: false,
          rowSpan: null,
          colSpan: null
        }
      ];

      const json = {
        // data: [...list],
        // total: 100
        code: 0,
        data: list
      };
      resolve(json);
    }, 500);
  });
}

export default {
  components: {},
  data() {
    return {
      loading: false,
      tableData: [],
      tableForm: {
        data: {
          name: "",
          sex: ""
        },
        items: [
          {
            field: "name",
            title: "app.body.label.name",
            itemRender: { name: "$input", props: { placeholder: "请输入名称" } }
          },
          {
            field: "sex",
            title: "性别",
            titlePrefix: {
              message: "帮助信息！！！",
              icon: "fa fa-info-circle"
            },
            itemRender: { name: "$select", options: [] }
          },
          {
            itemRender: {
              name: "$buttons",
              children: [
                {
                  props: { type: "submit", content: "查询", status: "primary" }
                },
                { props: { type: "reset", content: "重置" } }
              ]
            }
          }
        ]
      },
      setColumns: {
        // modal: {
        //   props: {
        //     title: "自定义标题"
        //   }
        // },
        proxyConfig: {
          // props: {},
          params: {
            code: "goods"
          }

          // ajax: {
          //   query: json => {
          //     return new Promise(resolve => {
          //       console.log(json);
          //       getColumns({
          //         ...json,
          //         code: "aaaa"
          //       }).then(res => {
          //         resolve(res);
          //       });
          //     });
          //   },
          //   submit: values => {
          //     console.log("submit111", values);
          //   }
          // }
        }
      },

      pagerConfig: {
        pageIndex: 0,
        pageSize: 10
        // layouts: [
        //   "PrevJump",
        //   "PrevPage",
        //   "Number",
        //   "NextPage",
        //   "NextJump",
        //   "Sizes",
        //   "FullJump"
        //   // "Total"
        // ],
        // perfect: true,
        // slots: {
        //   left: () => {
        //     return "666";
        //   }
        // }
        // props:{
        //   pageSize:'size',
        //   currentPage:'pageIndex'
        // }
      },
      proxyConfig: {
        // seq: true, // 启用动态序号代理
        // sort: true, // 启用排序代理
        // filter: true, // 启用筛选代理
        // form: true, // 启用表单代理
        props: {
          result: "data.data",
          total: "data.total",
          list: "data.data"
        },
        autoLoad: false,
        ajax: {
          query: getData
        }
      },
      proxyColumns: {
        // props: {
        //   list: "data.data",
        //   show: "show",
        //   align: "align",
        //   fixed: "freeze"
        // },
        params: {
          code: "goods"
        },
        on: {},

        ajax: {
          query: json => {
            return new Promise(resolve => {
              console.log(json);
              getColumns({
                ...json,
                code: "aaaa"
              }).then(res => {
                resolve(res);
              });
            });
          }
        }
      }
    };
  },
  created() {
    // this.findList()
    this.fetchSelectData();
  },
  methods: {
    fetchSelectData() {
      // getSelectData().then(res => {
      //   if (this.$refs.xGrid) {
      //     // const column = this.$refs.xGrid.getColumnByField("select1");
      //     // column.editRender.options = res.data.data;
      //   }
      // });
    },
    searchEvent() {
      this.tablePage.currentPage = 1;
      this.findList();
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.findList();
    },
    currentChangeEvent({ row }) {
      console.log("行选中事件", row);
      // this.delDisabled = !this.delDisabled;
      // const headToolbar = this.headToolbar;
      // headToolbar.buttons[1][1].disabled = this.delDisabled;
      // this.headToolbar = { ...headToolbar };
      // console.log(this.headToolbar);
      // const that = this;
      // setTimeout(() => {
      //   that.currentRow = row;
      // }, 10);
    },
    getCurrentRecord() {
      const grid = this.$refs.xGrid;
      const row = grid.getCurrentRecord();
      console.log(6666, row);
    },
    getData() {
      const grid = this.$refs.xGrid;
      const data = grid.getData();
      console.log(data);
    },
    showSetColumns() {
      const grid = this.$refs.xGrid;
      grid.showSetColumns();
    },
    updateColumns() {
      this.tableColumn = [
        { type: "checkbox", colIndex: 0, width: 60 },
        { type: "seq", title: "Number", colIndex: 1, width: 80 },
        {
          field: "code",
          title: "Code",
          minWidth: 140,
          editRender: { name: "AInput" }
        },
        {
          field: "checkbox",
          title: "Checkbox",
          minWidth: 140,
          editRender: { name: "ACheckbox" }
        }
      ];
    },
    editRow(row) {
      const str = JSON.stringify(row);
      console.log(str);
    },
    onAdd() {
      this.$refs.crudTable.reloadTable();
    },
    setSearchData() {
      const grid = this.$refs.xGrid;
      grid.setSearchData({
        name: "aaa"
      });
    },
    getSearchData() {
      const grid = this.$refs.xGrid;
      const values = grid.getSearchData();
      console.log(values);
    },
    toSearch() {
      const grid = this.$refs.xGrid;
      grid.reload({
        a: 1,
        b: 2
      });
    },
    onCellClick(e) {
      console.log(e);
      // if (this.currentRow._XID && e.row._XID === this.currentRow._XID) {
      //   const grid = this.$refs.xGrid;
      //   grid.clearCurrentRow();
      //   this.currentRow = {};
      // }
    },
    reload() {
      const grid = this.$refs.xGrid;
      grid.reload();
    },
    setData() {
      this.tableData = [
        {
          id: 1,
          name: "b1",
          sex: 1
        },
        {
          id: 2,
          name: "b2",
          sex: 1
        },
        {
          id: 3,
          name: "b3",
          sex: 1
        }
      ];
    }
  }
};
</script>

<style lang="css"></style>
