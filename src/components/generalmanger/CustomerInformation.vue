<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>客户信息</el-breadcrumb-item>
      <el-breadcrumb-item>客户信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 10px">
      <!-- 根据销售代表查看数据 -->
      <el-tabs v-model="activeWarZone" @tab-click="handleWarClick">
        <el-tab-pane
          v-for="(item, index) of warZoneData"
          :key="index"
          :label="item.name"
          :name="item.id + ''"
        >
          <el-tabs v-model="activeSalesDepart" @tab-click="handleDepartClick">
            <el-tab-pane
              v-for="(item, index) of departs"
              :key="index"
              :label="item.name"
              :name="item.id + ''"
            >
              <el-tabs v-model="activeSales" @tab-click="handleClick">
                <el-tab-pane
                  v-for="(item, index) of sales"
                  :key="index"
                  :label="item.name"
                  :name="item.id + ''"
                >
                  <!-- 用户列表区域 -->
                  <el-table
                    :data="userlist"
                    border
                    stripe
                    class="user_message_table"
                  >
                    <!-- 索引列 index的添加 -->
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="贷款时间" prop="create_time">
                    </el-table-column>
                    <el-table-column label="姓名" prop="name">
                    </el-table-column>
                    <el-table-column label="性别" prop="sex"> </el-table-column>
                    <el-table-column label="工作" prop="job"> </el-table-column>
                    <el-table-column label="电话" prop="telephone">
                    </el-table-column>
                    <el-table-column label="贷款进度" prop="order_status">
                    </el-table-column>
                    <el-table-column label="合同金额" prop="contract_amount">
                    </el-table-column>
                    <el-table-column label="合同编号" prop="contract_number">
                    </el-table-column>
                    <el-table-column label="贷款金额" prop="loan_amount">
                    </el-table-column>
                    <el-table-column label="操作">
                      <!-- eslint-disable-next-line -->
                      <template slot-scope="scope">
                        <!-- 删除按钮 -->
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          size="mini"
                          @click="removeUserById(scope.row.id)"
                        ></el-button>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column label="合同" prop="contract"> </el-table-column>
        <el-table-column label="备注" prop="remark"> </el-table-column> -->
                  </el-table>
                  <!-- 分页区域 -->
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    style="margin-top: 15px; float: right; margin-bottom: 10px"
                  >
                  </el-pagination>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeSalesDepart: "",
      activeSales: "",
      activeName: "2",
      activeWarZone: "1",
      // 收到的销售代表的数据
      salesData: [],
      // 表格数据
      userlist: [],
      warZoneData: [],
      departs: [],
      sales: [],
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      total: 0,
    };
  },
  mounted() {
    this.getWarZoneData();
    this.handleDepartClick();
    this.handleWarClick();
    this.handleClick();
  },
  methods: {
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      // if (this.isQuery === true) {
      //   this.inquiry();
      // } else {
      //   this.getUserList();
      // }
      this.handleClick();
    },
    // 监听页码数值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      // if (this.isQuery === true) {
      //   this.inquiry();
      // } else {
      //   this.getUserList();
      // }
      this.handleClick();
    },

    async handleWarClick(tab, event) {
      // 得到战区数据
      const { data: res } = await this.$http.get(
        "/users/salesdepartbywarzone/",
        {
          params: {
            war_zone: this.activeWarZone,
          },
        }
      );
      this.departs = res.results;
    },
    async handleDepartClick(tab, event) {
      // 得到战区下的部门数据
      const { data: res } = await this.$http.get("/users/salebysaledepart/", {
        params: {
          sales_depart: this.activeSalesDepart,
        },
      });
      this.sales = res.results;
    },

    async handleClick(tab, event) {
      // 得到销售代表下的客户数据
      const { data: res } = await this.$http.get(
        "/users/effictiveusersbysales/",
        {
          params: {
            sales_name: this.activeSales,
            page: this.queryInfo.pagenum,
            size: this.queryInfo.pagesize,
          },
        }
      );
      this.userlist = res.results;
      this.total = res.count;
    },
    // 得到战区数据
    async getWarZoneData() {
      // 使用user_id重新请求数据
      const { data: res } = await this.$http.get("/users/warzone/", {
        params: {
          sales_depart: window.sessionStorage.getItem("user_id"),
        },
      });
      this.warZoneData = res.results;
      console.log(res.results);
    },
    // 根据ID删除对应的用户信息
    async removeUserById(id) {
      // 弹框询问用户
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      // 如果用户确认删除 则返回值为字符串confirm
      // 如果用户取消了删除 则返回值为字符串cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除");
      }
      // console.log('确认了删除')
      const { data: res } = await this.$http.delete(
        "users/effictiveusers/" + id + "/"
      );
      this.$message.success("删除用户成功");
      this.getUserList();
    },
  },
};
</script>

<style>
</style>