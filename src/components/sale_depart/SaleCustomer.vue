<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>签约客户</el-breadcrumb-item>
      <el-breadcrumb-item>销售代表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 10px">
      <!-- 根据销售代表查看数据 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) of salesData"
          :key="index"
          :label="item.name"
          :name="item.id + ''"
        >
          <!-- 用户列表区域 -->
          <el-table :data="userlist" border stripe class="user_message_table">
            <!-- 索引列 index的添加 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="贷款时间" prop="create_time">
            </el-table-column>
            <el-table-column label="姓名" prop="name"> </el-table-column>
            <el-table-column label="性别" prop="sex"> </el-table-column>
            <el-table-column label="工作" prop="job"> </el-table-column>
            <el-table-column label="电话" prop="telephone"> </el-table-column>
            <!-- <el-table-column label="贷款进度" prop="order_status"> </el-table-column> -->
            <el-table-column label="合同金额" prop="contract_amount">
            </el-table-column>
            <el-table-column label="合同编号" prop="contract_number">
            </el-table-column>
            <el-table-column label="身份证" prop="img_id_card">
            </el-table-column>
            <el-table-column label="贷款金额" prop="loan_amount">
            </el-table-column>
          </el-table>
          <!-- 分页区域 -->
          <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin-top: 15px; float: right; margin-bottom: 10px"
          >
          </el-pagination> -->
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "2",
      // 收到的销售代表的数据
      salesData: [],
      // 表格数据
      userlist: [],
    };
  },
  mounted() {
    this.getData();
    this.handleClick();
  },
  methods: {
    async handleClick(tab, event) {
      // 使用user_name重新请求数据
      const { data: res } = await this.$http.get(
        "/users/effictiveusersbysales/",
        {
          params: {
            sales_name: this.activeName,
          },
        }
      );
      for (var i = 0; i < res.results.length; i++) {
        res.results[i].create_time =
          res.results[i].create_time.slice(0, 10) +
          " " +
          res.results[i].create_time.slice(11, 19);
      }
      this.userlist = res.results;
    },
    // 得到销售代表数据
    async getData() {
      // 使用user_id重新请求数据
      const { data: res } = await this.$http.get("/users/salebysaledepart/", {
        params: {
          sales_depart: window.sessionStorage.getItem("user_id"),
        },
      });
      this.salesData = res.results;
      console.log(res.results);
    },
  },
};
</script>

<style>
</style>