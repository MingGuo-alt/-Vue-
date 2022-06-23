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
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">
            录入客户
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addContract = true">
            录入合同
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe class="user_message_table">
        <!-- 索引列 index的添加 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="贷款时间" prop="create_time"> </el-table-column>
        <el-table-column label="姓名" prop="name"> </el-table-column>
        <el-table-column label="工作" prop="job"> </el-table-column>
        <el-table-column label="性别" prop="sex"> </el-table-column>
        <el-table-column label="电话" prop="telephone"> </el-table-column>
        <el-table-column label="身份信息" prop="img_id_card">
        </el-table-column>
        <!-- <el-table-column label="贷款进度" prop="order_status">
        </el-table-column> -->
        <el-table-column label="合同金额" prop="contract_amount">
        </el-table-column>
        <el-table-column label="已下发金额" prop="loan_amount">
        </el-table-column>
        <!-- <el-table-column label="服务费" prop="service_fee_number">
        </el-table-column> -->
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
            <el-button
              type="warning"
              icon="el-icon-s-unfold"
              size="mini"
              @click="viewContract(scope.row.contract_number)"
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
        label-width="85px"
      >
        <!-- yyyy-MM-dd HH:mm:ss -->
        <el-form-item label="日期选择" prop="create_time">
          <el-date-picker
            v-model="addForm.create_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-ddTHH:mm:ss"
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
        <el-form-item label="订单状态" prop="order_status">
          <el-input v-model="addForm.order_status"></el-input>
        </el-form-item>
        <el-form-item label="身份证照片" prop="img_id_card">
          <el-upload
            class="upload-demo"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
            :http-request="httpRequest"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="贷款是否下放" prop="check_status">
          <el-switch v-model="addForm.check_status"> </el-switch>
        </el-form-item>
        <el-form-item label="是否收取服务费" prop="service_fee_status">
          <el-input v-model="addForm.service_fee_status"></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contract_number">
          <el-input v-model="addForm.contract_number"></el-input>
        </el-form-item>
        <el-form-item label="合同金额" prop="contract_amount">
          <el-input v-model="addForm.contract_amount"></el-input>
        </el-form-item>
        <el-form-item label="发放金额" prop="loan_amount">
          <el-input v-model="addForm.loan_amount"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="addForm.note"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加合同 -->
    <el-dialog
      title="添加合同"
      :visible.sync="addContract"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addFormContract"
        ref="addFormRef"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item label="日期选择" prop="contract_time">
          <el-date-picker
            v-model="addFormContract.contract_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-ddTHH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同名称" prop="contract_name">
          <el-input v-model="addFormContract.contract_name"></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contract_number">
          <el-input v-model="addFormContract.contract_number"></el-input>
        </el-form-item>
        <el-form-item label="合同金额" prop="contract_money">
          <el-input v-model="addFormContract.contract_money"></el-input>
        </el-form-item>
        <el-form-item label="合同照片" prop="contract_image">
          <el-upload
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
            :http-request="httpRequestContrcat"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="合同客户" prop="effictiveusers_id">
          <el-input v-model="addFormContract.effictiveusers_id"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addContract = false">取 消</el-button>
        <el-button type="primary" @click="addContractC">确 定</el-button>
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
        <el-form-item label="日期" prop="contract_time">
          <el-input v-model="editForm.contract_time" disabled></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contract_number">
          <el-input v-model="editForm.contract_number" disabled></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contract_name">
          <el-input v-model="editForm.contract_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="合同金额" prop="contract_money">
          <el-input v-model="editForm.contract_money" disabled></el-input>
        </el-form-item>
        <el-form-item label="合同明细" prop="contract_image">
          <el-input v-model="editForm.contract_image"></el-input>
        </el-form-item>
      </el-form>
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
      contractList: {},
      total: 0, //总数据条数
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      addContract: false,
      // 添加用户的表单数据
      addForm: {
        create_time: "",
        name: "",
        age: "",
        sex: "",
        telephone: "",
        contract_number: "",
        contract_amount: 0,
        loan_amount: "0",
        job: "",
        order_status: "",
        check_status: false,
        service_fee_status: "",
        note: "",
        sales_name: window.sessionStorage.getItem("user_id"),
      },
      addFormContract: {
        contract_time: "",
        contract_name: "",
        effictiveusers_id: "",
        contract_number: "",
        contract_money: 0,
        contract_image: "0",
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
      editForm: {
        contract_time: "",
        contract_number: "",
        contract_name: "",
        contract_money: "",
        contract_image: "",
      },
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
      // 照片数据
      fileList: [],
      daikuanMessage: new FormData(),
      daikuanMessageCon: new FormData(),
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // 照片上传网络请求
    httpRequest(params) {
      this.daikuanMessage.append("img_id_card", params.file);
      this.daikuanMessage.append("create_time", this.addForm.create_time);
      this.daikuanMessage.append("name", this.addForm.name);
      this.daikuanMessage.append("age", this.addForm.age);
      this.daikuanMessage.append("sex", this.addForm.sex);
      this.daikuanMessage.append("telephone", this.addForm.telephone);
      this.daikuanMessage.append(
        "contract_number",
        this.addForm.contract_number
      );
      this.daikuanMessage.append(
        "contract_amount",
        this.addForm.contract_amount
      );
      this.daikuanMessage.append("loan_amount", this.addForm.loan_amount);
      this.daikuanMessage.append("job", this.addForm.job);
      this.daikuanMessage.append("order_status", this.addForm.order_status);
      this.daikuanMessage.append("check_status", this.addForm.check_status);
      this.daikuanMessage.append(
        "service_fee_status",
        this.addForm.service_fee_status
      );
      this.daikuanMessage.append("note", this.addForm.note);
      this.daikuanMessage.append("sales_name", this.addForm.sales_name);
      // 这里需要做一下序列化，把表单数据都append到formdata中
      for (const key in this.formModel) {
        if (Object.hasOwnProperty.call(this.formModel, key)) {
          this.daikuanMessage.append(key, this.formModel[key]);
        }
      }
    },
    httpRequestContrcat(params) {
      this.daikuanMessageCon.append("contract_image", params.file);
      this.daikuanMessageCon.append(
        "contract_time",
        this.addFormContract.contract_time
      );
      this.daikuanMessageCon.append(
        "contract_name",
        this.addFormContract.contract_name
      );
      this.daikuanMessageCon.append(
        "contract_number",
        this.addFormContract.contract_number
      );
      this.daikuanMessageCon.append(
        "contract_money",
        this.addFormContract.contract_money
      );
      this.daikuanMessageCon.append(
        "effictiveusers_id",
        this.addFormContract.effictiveusers_id
      );
      // 这里需要做一下序列化，把表单数据都append到formdata中
      for (const key in this.formModel) {
        if (Object.hasOwnProperty.call(this.formModel, key)) {
          this.daikuanMessageCon.append(key, this.formModel[key]);
        }
      }
    },
    // 照片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    async addUser() {
      console.log(this.addForm);
      // 可以发起添加用户的网络请求
      const { data: res } = await this.$http.post(
        "/users/effictiveusersbysales/",
        this.daikuanMessage
      );
      console.log(res);
      this.$message.success("录入客户成功");
      // 隐藏添加用户的对话框
      this.addDialogVisible = false;
      // 重新获取用户的列表数据
      this.getUserList();
    },
    async addContractC() {
      // 可以发起添加用户的网络请求
      const { data: res } = await this.$http.post(
        "/users/contractbyeffictusers/",
        this.daikuanMessageCon
      );
      console.log(res);
      this.$message.success("录入合同成功");
      // 隐藏添加用户的对话框
      this.addContract = false;
      // 重新获取用户的列表数据
      this.getUserList();
    },
    // 根据页数去得到相应数据 暂时不可用
    async getUserList() {
      this.isQuery = false;
      const { data: res } = await this.$http.get(
        "/users/effictiveusersbysales/",
        {
          params: {
            sales_name: window.sessionStorage.getItem("user_id"),
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
        "/users/effictiveusersbysales/?sales_name=" +
          window.sessionStorage.getItem("user_id") +
          "&name=" +
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
    addContractDetail() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post(
          "/users/contractbyeffictusers/",
          this.addForm
        );
        this.$message.success("添加合同成功");
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
      // console.log('确认了删除')
      const { data: res } = await this.$http.delete(
        "users/effictiveusers/" + id + "/"
      );
      this.$message.success("删除用户成功");
      this.getUserList();
    },
    async viewContract(id) {
      console.log(id);
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(
        "users/contractbyeffictusers/?contract_number=" + id
      );
      console.log(res);
      this.editForm = res.results[0];
      console.log(this.editForm);
    },
  },
};
</script>

<style lang="less" scoped>
.user_message_table {
  margin-top: 20px;
}
</style>