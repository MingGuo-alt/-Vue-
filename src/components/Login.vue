<template>
  <div class="login_container">
    <!-- 标题以及注解 -->
    <div class="login_all_title">
      <span class="span_one">大富翁金融服务有限公司</span><br />
      <span class="span_three">创始人:吴杰、杨劲冲</span>
    </div>
    <!-- 登录注册表单 -->
    <div class="login_box">
      <!-- 登录表单的标题 -->
      <span class="login_title"><b>金融公司管理系统</b></span>
      <!-- 登录表单区域 loginForm 表单的数据绑定 loginFormRef 表单实例对象-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 选择不同用户权限 -->
        <el-form-item prop="job">
          <el-select
            v-model="loginForm.job"
            placeholder="请选择用户类型"
            clearable
          >
            <el-option label="销售代表" value="销售代表"></el-option>
            <el-option label="部门经理" value="部门经理"></el-option>
            <el-option label="销售总监" value="销售总监"></el-option>
            <el-option label="金融专员" value="金融专员"></el-option>
            <el-option label="总经理" value="总经理"></el-option>
            <el-option label="会计" value="会计"></el-option>
            <el-option label="系统管理员" value="系统管理员"></el-option>
          </el-select>
        </el-form-item>
        <!-- 用户名区域 -->
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            prefix-icon="el-icon-user-solid"
          >
          </el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-s-cooperation"
            type="password"
          >
          </el-input>
        </el-form-item>
        <!-- 验证码区域 -->
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            prefix-icon="el-icon-s-marketing"
            type="code"
            placeholder="请输入验证码"
            class="input-val"
          >
          </el-input>
        </el-form-item>
        <!-- 验证码区域 -->
        <canvas id="canvas" width="100" height="30"></canvas>
        <!-- 按钮区域 -->
        <el-form-item class="login_button">
          <el-button type="primary" @click="login">登录</el-button>
          <!-- <el-button type="success" @click="register">注册</el-button> -->
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象 销售代表：saleone 123456
      loginForm: {
        account: "",
        password: "",
        roleId: 1,
        code: "",
        job: "",
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        account: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 5 到 15 个字符",
            trigger: "blur",
          },
        ],
        // 验证码
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            min: 4,
            max: 4,
            message: "长度在 4 个字符",
            trigger: "blur",
          },
        ],
        // 用户类型选择
        job: [{ required: true, message: "请输入用户类型", trigger: "change" }],
      },
      // 验证码的数组
      show_num: [],
    };
  },
  mounted() {
    // 执行验证码函数
    this.getIdentify();
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 点击登录按钮
    login() {
      // validate 表单预校验 valid 通过或者失败的布尔值
      // Function(callback: Function(boolean, object))
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        var val = this.loginForm.code;
        var num = this.show_num.join("");
        if (val == "") {
          alert("请输入验证码！");
        } else if (val == num) {
          // this.$router.push("/home");
          // window.sessionStorage.setItem("user_id", "2");
          console.log(this.loginForm.job);
          if (this.loginForm.job === "销售代表") {
            // promise 简化操作 添加 await async(修饰函数为异步函数)
            const { data: res } = await this.$http.post(
              "/users/sales/login/",
              this.loginForm
            );
            if (res.code === 200) {
              this.$router.push("/home");
              // 登陆成功后将token保存到sessionStorage中
              window.sessionStorage.setItem("user_name", res.user_name);
              window.sessionStorage.setItem("user_id", res.user_id);
              window.sessionStorage.setItem("user_property", "销售代表");
              return this.$message.success("登录成功");
            } else if (res.code === 400) {
              return this.$message.error("登录失败");
            }
          } else if (this.loginForm.job === "部门经理") {
            const { data: res } = await this.$http.post(
              "/users/departmanger/login/",
              this.loginForm
            );
            if (res.code === 200) {
              this.$router.push("/home");
              // 登陆成功后将token保存到sessionStorage中
              window.sessionStorage.setItem("user_name", res.user_name);

              window.sessionStorage.setItem("user_id", res.user_id);
              window.sessionStorage.setItem("user_property", "部门经理");
              return this.$message.success("登录成功");
            }
          } else if (this.loginForm.job === "销售总监") {
            const { data: res } = await this.$http.post(
              "/users/salesdirector/login/",
              this.loginForm
            );
            if (res.code === 200) {
              this.$router.push("/home");
              // 登陆成功后将token保存到sessionStorage中
              window.sessionStorage.setItem("user_name", res.user_name);

              window.sessionStorage.setItem("user_id", res.user_id);
              window.sessionStorage.setItem("war_zone", res.war_zone);
              window.sessionStorage.setItem("user_property", "销售总监");
              return this.$message.success("登录成功");
            }
          } else if (this.loginForm.job === "系统管理员") {
            const { data: res } = await this.$http.post(
              "/users/admin/login/",
              this.loginForm
            );
            if (res.code === 200) {
              this.$router.push("/home");
              // 登陆成功后将token保存到sessionStorage中
              window.sessionStorage.setItem("user_name", res.user_name);

              window.sessionStorage.setItem("user_id", res.user_id);
              window.sessionStorage.setItem("user_property", "系统管理员");
              return this.$message.success("登录成功");
            }
          } else if (this.loginForm.job === "总经理") {
            const { data: res } = await this.$http.post(
              "/users/generalmanager/login/",
              this.loginForm
            );
            if (res.code === 200) {
              this.$router.push("/home");
              // 登陆成功后将token保存到sessionStorage中
              window.sessionStorage.setItem("user_name", res.user_name);

              window.sessionStorage.setItem("user_id", res.user_id);
              window.sessionStorage.setItem("user_property", "总经理");
              // console.log("登陆成功")
              return this.$message.success("登录成功");
            }
          } else if (this.loginForm.job === "会计") {
            const { data: res } = await this.$http.post(
              "/users/accountant/login/",
              this.loginForm
            );
            if (res.code === 200) {
              this.$router.push("/home");
              // 登陆成功后将token保存到sessionStorage中
              window.sessionStorage.setItem("user_name", res.user_name);

              window.sessionStorage.setItem("user_id", res.user_id);
              window.sessionStorage.setItem("user_property", "会计");
              return this.$message.success("登录成功");
            }
          } else if (this.loginForm.job === "金融专员") {
            const { data: res } = await this.$http.post(
              "/users/financialcommission/login/",
              this.loginForm
            );
            if (res.code === 200) {
              this.$router.push("/home");
              // 登陆成功后将token保存到sessionStorage中
              window.sessionStorage.setItem("user_name", res.user_name);

              window.sessionStorage.setItem("user_id", res.user_id);
              window.sessionStorage.setItem("user_property", "金融专员");
              return this.$message.success("登录成功");
            }
          }
        } else {
          this.loginForm.code = "";
          return this.$message.error("验证码错误！请重新输入！");
        }
      });
    },
    // 生成验证码
    getIdentify() {
      $(() => {
        this.draw(this.show_num);
        $("#canvas").on("click", () => {
          this.draw(this.show_num);
        });
        $(".btn").on("click", () => {
          // 获取input中的数据
          var val = $(".input-val").val().toLowerCase();
          var num = this.show_num.join("");
          if (val == "") {
            alert("请输入验证码！");
          } else if (val == num) {
            alert("提交成功！");
            $(".input-val").val("");
            // draw(show_num);
          } else {
            alert("验证码错误！请重新输入！");
            $(".input-val").val("");
            // draw(show_num);
          }
        });
      });
    },
    // 生成并渲染出验证码图形
    draw(show_num) {
      var canvas_width = $("#canvas").width();
      var canvas_height = $("#canvas").height();
      var canvas = document.getElementById("canvas"); //获取到canvas的对象，演员
      var context = canvas.getContext("2d"); //获取到canvas画图的环境，演员表演的舞台
      canvas.width = canvas_width;
      canvas.height = canvas_height;
      var sCode =
        "a,b,c,d,e,f,g,h,i,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
      var aCode = sCode.split(",");
      var aLength = aCode.length; //获取到数组的长度
      for (var i = 0; i < 4; i++) {
        //这里的for循环可以控制验证码位数（如果想显示6位数，4改成6即可）
        var j = Math.floor(Math.random() * aLength); //获取到随机的索引值
        // var deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
        var deg = Math.random() - 0.5; //产生一个随机弧度
        var txt = aCode[j]; //得到随机的一个内容
        // show_num[i] = txt.toLowerCase();
        show_num[i] = txt;

        var x = 10 + i * 20; //文字在canvas上的x坐标
        var y = 20 + Math.random() * 8; //文字在canvas上的y坐标
        context.font = "bold 23px 微软雅黑";
        context.translate(x, y);
        context.rotate(deg);
        context.fillStyle = this.randomColor();
        context.fillText(txt, 0, 0);
        context.rotate(-deg);
        context.translate(-x, -y);
      }
      for (var i = 0; i <= 5; i++) {
        //验证码上显示线条
        context.strokeStyle = this.randomColor();
        context.beginPath();
        context.moveTo(
          Math.random() * canvas_width,
          Math.random() * canvas_height
        );
        context.lineTo(
          Math.random() * canvas_width,
          Math.random() * canvas_height
        );
        context.stroke();
      }
      for (var i = 0; i <= 30; i++) {
        //验证码上显示小点
        context.strokeStyle = this.randomColor();
        context.beginPath();
        var x = Math.random() * canvas_width;
        var y = Math.random() * canvas_height;
        context.moveTo(x, y);
        context.lineTo(x + 1, y + 1);
        context.stroke();
      }
    },
    // 得到随机的颜色值
    randomColor() {
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      return "rgb(" + r + "," + g + "," + b + ")";
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-image: url(../assets/login_background.png);
  background-size: cover;
  background-attachment: fixed;
}

.login_box {
  width: 450px;
  height: 450px;
  background-color: #fff;
  border-radius: 25px;
  position: absolute;
  left: 50%;
  top: 55%;
  // 有点不能理解 横移 达到正中间的效果
  transform: translate(-50%, -50%);
  .login_title {
    position: absolute;
    top: 15%;
    padding: 0 20px;
    font-size: 25px;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .login_button {
    // 按钮居右对齐
    display: flex;
    justify-content: flex-end;
  }
  #canvas {
    position: absolute;
    vertical-align: middle;
    box-sizing: border-box;
    border: 1px solid #ddd;
    cursor: pointer;
    top: 193px;
    right: 40px;
  }
  /deep/ .el-select {
    width: 100%;
  }
}

.login_all_title {
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translate(-50%, -50%);

  .span_one {
    color: white;
    font-size: 50px;
  }
  .span_two {
    color: white;
    font-size: 30px;
  }
  .span_three {
    color: white;
    font-size: 20px;
  }
}
</style>