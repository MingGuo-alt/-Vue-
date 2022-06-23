<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息统计</el-breadcrumb-item>
      <el-breadcrumb-item>公海数据库</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card style="margin-top: 10px">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入客户名称"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe class="user_message_table">
        <!-- 索引列 index的添加 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="name"> </el-table-column>
        <el-table-column label="年龄" prop="age"> </el-table-column>
        <el-table-column label="性别" prop="sex"> </el-table-column>
        <el-table-column label="电话" prop="telephone"> </el-table-column>
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
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 15px; float: right; margin-bottom: 10px"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5,
      },
      userlist: [], //用户列表
      total: 0, //总数据条数
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        name: "",
        phone_num: "",
        loan_amount: "",
        remark: "",
      },
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证对象规则
      editFormRules: {
        email: [
          {
            required: true,
            message: "请输入用户邮箱",
            trigger: "blur",
          },
          // {
          //   validator: checkEmain,
          //   trigger: 'blur',
          // },
        ],
        mobile: [
          {
            required: true,
            message: "请输入用户手机",
            trigger: "blur",
          },
          // {
          //   validator: checkMobile,
          //   trigger: 'blur',
          // },
        ],
      },
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // 根据页数去得到相应数据 暂时不可用
    async getUserList() {
      const { data: res } = await this.$http.get(
        "/users/userinfo/" +
          "?page=" +
          this.queryInfo.pagenum +
          "&size=" +
          this.queryInfo.pagesize
      );
      //   if (res.meta.status !== 200) {
      //     return this.$message.error("获取用户列表失败!!!");
      //   }
      this.userlist = res.results;
      this.total = res.count;
      console.log(res);
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码数值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听Switch开关状态的改变
    // async userStateChanged(userInfo) {
    //   console.log(userInfo);
    //   const { data: res } = await this.$http.put(
    //     `users/${userInfo.id}/state/${userInfo.mg_state}`
    //   );
    //   if (res.meta.status !== 200) {
    //     userInfo.mg_state = !userInfo.mg_state;
    //     return this.$message.error("更新用户数据失败");
    //   }
    //   this.$message.success("更新用户状态成功");
    // },
    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.addForm);
        // if (res.meta.status !== 201) {
        //   this.$message.error("添加用户失败");
        // }
        this.$message.success("添加用户成功");
        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
        // 重新获取用户的列表数据
        this.getUserList();
      });
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        );
        if (res.meta.status !== 200) {
          return this.$message.errot("更新用户数据失败");
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getUserList();
        // 提示修改成功
        this.$message.success("更新用户信息成功");
      });
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
      //   console.log(id)
      const { data: res } = await this.$http.delete(
        "/users/userinfo/" + id + "/"
      );
      //   if (res.meta.status !== 200) {
      //     return this.$message.error("删除用户失败");
      //   }
      this.$message.success("删除用户成功");
      this.getUserList();
    },
  },
};
</script>

<style lang="less" scoped>
.user_message_table {
  margin-top: 20px;
}
</style>