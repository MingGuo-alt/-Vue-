<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>销售业绩</el-breadcrumb-item>
      <el-breadcrumb-item>业绩展示</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 10px">
      <div class="pie_risk" ref="pie_risk_ref"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 收到的销售代表的数据
      salesxAxis: [],
      salesData: [],
      // 表格数据
      userlist: [],
      //
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 得到销售代表数据
    async getData() {
      // 使用user_id重新请求数据
      const { data: res } = await this.$http.get(
        "/users/performancebyall/",
        {
          params: {
            sales_depart: window.sessionStorage.getItem("user_id"),
          },
        }
      );
      for (var i = 0; i < res.Performance_data.length; i++) {
        this.salesxAxis.push(res.Performance_data[i].sale_name);
        this.salesData.push(res.Performance_data[i].contract_amount_total);
      }
      this.initEcharts();
    },
    // 图表
    initEcharts() {
      this.echarts = this.$echarts.init(this.$refs.pie_risk_ref);
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ["签约金额"],
        },
        xAxis: [
          {
            type: "category",
            data: this.salesxAxis,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "金额",
            min: 0,
            max: 1000,
            interval: 200,
            axisLabel: {
              formatter: "{value} 万",
            },
          },
        ],
        series: [
          {
            name: "签约金额",
            type: "bar",
            data: this.salesData,
          },
        ],
      };
      this.echarts.setOption(option);
      // 表格自适应屏幕分辨率
      setTimeout(() => {
        window.onresize = () => {
          this.echarts.resize();
        };
      }, 200);
    },
  },
};
</script>

<style scoped>
.pie_risk {
  height: 500px;
  width: 100%;
  margin: auto;
}
</style>