<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统日志</el-breadcrumb-item>
      <el-breadcrumb-item>日志查询</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card style="margin-top: 10px">


      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe class="user_message_table">
        <!-- 索引列 index的添加 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="请求时间" prop="re_time"> </el-table-column>
        <el-table-column label="请求IP" prop="re_ip"> </el-table-column>
        <el-table-column label="请求地址" prop="re_url"> </el-table-column>
        <el-table-column label="请求方法" prop="re_method"> </el-table-column>
        <el-table-column label="响应时间" prop="access_time"> </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10,50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 15px; float: right; margin-bottom: 10px"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 是否索引
      isQuery: false,
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      // 得到表格展示数据
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
        Conversation_record: "",
        loan_money: "",
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
      const { data: res } = await this.$http.get("/users/oplogs/", {
        params: {
          //   sales_name: window.sessionStorage.getItem("user_id"),
          page: this.queryInfo.pagenum,
          size: this.queryInfo.pagesize,
        },
      });
      console.log(res);
      //   for (var i = 0; i < res.results.length; i++) {
      //     res.results[i].create_time =
      //       res.results[i].create_time.slice(0, 10) +
      //       " " +
      //       res.results[i].create_time.slice(11, 19);
      //   }
      //   this.userlist = res.results;
      //   this.total = res.count;
      this.userlist = res.results;
      this.total = res.count
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      if (this.isQuery === true) {
        this.talkingQuery();
      } else {
        this.getUserList();
      }
    },
    // 监听页码数值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      if (this.isQuery === true) {
        this.talkingQuery();
      } else {
        this.getUserList();
      }
    },
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
          "/users/userconversation/",
          this.addForm
        );
        this.$message.success("添加用户成功");
        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
        // 重新获取用户的列表数据
        this.getUserList();
      });
    },
    // 搜索
    async talkingQuery() {
      this.isQuery = true;
      if (this.queryInfo.query === "") {
        this.isQuery = false;
        this.$message({
          message: "不可查询空数据",
          type: "warning",
        });
        this.getUserList();
        return;
      }
      const { data: res } = await this.$http.get(
        "/users/userconversation/?sales_name=" +
          window.sessionStorage.getItem("user_id") +
          "&name=" +
          this.queryInfo.query +
          "&page=" +
          this.queryInfo.pagenum +
          "&size=" +
          this.queryInfo.pagesize
      );
      this.total = res.count;
      this.userlist = res.results;
    },
  },
};
</script>

<style lang="less" scoped>
.user_message_table {
  margin-top: 20px;
}
</style>