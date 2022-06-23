<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息录入</el-breadcrumb-item>
      <el-breadcrumb-item>录入用户信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card style="margin-top: 10px">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入客户名称"
            v-model="inputContent"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="inquiry"
            ></el-button>
          </el-input>
        </el-col>
        <!-- <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">
            添加客户
          </el-button>
        </el-col> -->
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe class="user_message_table">
        <!-- 索引列 index的添加 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="贷款时间" prop="create_time"> </el-table-column>
        <el-table-column label="姓名" prop="name"> </el-table-column>
        <!-- <el-table-column label="工作" prop="job"> </el-table-column> -->
        <!-- <el-table-column label="性别" prop="sex"> </el-table-column>
        <el-table-column label="电话" prop="telephone"> </el-table-column> -->
        <el-table-column label="贷款进度" prop="order_status"> </el-table-column>
        <el-table-column label="合同金额" prop="contract_amount">
        </el-table-column>
        <el-table-column label="已下放金额" prop="loan_amount"> </el-table-column>
        <!-- <el-table-column label="服务费" prop="service_fee_number">
        </el-table-column>
        <el-table-column label="服务费收取" prop="service_fee_status"> -->
        <!-- </el-table-column> -->
        <el-table-column label="合同编号" prop="contract_number">
        </el-table-column>
        <!-- <el-table-column label="备注" prop="note"> </el-table-column> -->
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
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 15px; float: right; margin-bottom: 10px"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item label="日期选择" prop="create_time">
          <el-date-picker
            v-model="addForm.create_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="addForm.age"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="addForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="工作" prop="job">
          <el-input v-model="addForm.job"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="telephone">
          <el-input v-model="addForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contract_number">
          <el-input v-model="addForm.contract_number"></el-input>
        </el-form-item>
        <el-form-item label="合同金额" prop="contract_amount">
          <el-input v-model="addForm.contract_amount"></el-input>
        </el-form-item>
        <el-form-item label="贷款金额" prop="loan_amount">
          <el-input v-model="addForm.loan_amount"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 判断是否进行查询
      isQuery: false,
      // 获取输入框的数据
      inputContent: "",
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      userlist: [], //用户列表
      total: 0, //总数据条数
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        create_time: "",
        name: "",
        age: "",
        sex: "",
        telephone: "",
        contract_amount: "",
        loan_amount: "",
        sales_name: window.sessionStorage.getItem("user_id"),
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          // {
          //   validator:checkEmail,trigger:'blur'
          // }
        ],
        mobile: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          // {
          //   validator:checkMobile,trigger:'blur'
          // }
        ],
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
      this.isQuery = false;
      const { data: res } = await this.$http.get(
        "/users/effictiveusersfee/",
        {
          params: {
            // sales_name: window.sessionStorage.getItem("user_id"),
            page: this.queryInfo.pagenum,
            size: this.queryInfo.pagesize,
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
      this.total = res.count;
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      if (this.isQuery === true) {
        this.inquiry();
      } else {
        this.getUserList();
      }
    },
    // 监听页码数值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      if (this.isQuery === true) {
        this.inquiry();
      } else {
        this.getUserList();
      }
    },
    // 查询用户名
    async inquiry() {
      this.isQuery = true;
      if (this.inputContent === "") {
        this.isQuery = false;
        this.$message({
          message: "不可查询空数据",
          type: "warning",
        });
        this.getUserList();
        return;
      }
      const { data: res } = await this.$http.get(
        "/users/effictiveusersnofee/?" +
          //   window.sessionStorage.getItem("user_id") +
          "name=" +
          this.inputContent +
          "&page=" +
          this.queryInfo.pagenum +
          "&size=" +
          this.queryInfo.pagesize
      );
      this.total = res.count;
      this.userlist = res.results;
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
        const { data: res } = await this.$http.post(
          "/users/effictiveusersbysales/",
          this.addForm
        );
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
      console.log(id)
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
      const { data: res } = await this.$http.delete("users/effictiveusers/" + id + "/");
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