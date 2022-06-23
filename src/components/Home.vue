<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header class="maintenance-home-header">
      <div class="maintenance-header-left">
        <img src="@/assets/header_img_two.png" alt="" />
        <span>大富翁金融服务有限公司</span>
      </div>

      <div class="maintenance-header-right">
        <!-- 显示时间 -->
        <el-button type="text" id="time" style="cursor: Default"></el-button>
        <!-- 客服热线 -->
        <el-button type="text" style="cursor: Default"
          >客服热线: 400-108-1833</el-button
        >
        <!-- 通知 -->
        <el-button type="text" icon="el-icon-bell" @click="headerNotice"
          >通知</el-button
        >
        <!-- 用户 -->
        <el-dropdown @command="handlePerson">
          <el-button type="text">
            {{user_name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="person">个人中心</el-dropdown-item>
            <el-dropdown-item command="close">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path + ''"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path + '')"
            >
              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

    <!-- 点击消息按钮弹出消息dialog -->
    <el-dialog
      class="protect_plan_dialog"
      :visible.sync="dialogVisibleMessage"
      width="60%"
    >
      <!-- title修改样式 -->
      <template slot="title">
        <div style="font-size: 16px; color: #fff; font-weight: bold">
          最近消息
        </div>
      </template>
      <span>使用一个table表格展示最近消息</span>
    </el-dialog>

    <!-- 点击个人中心用户详情dialog -->
    <el-dialog :visible.sync="dialogVisiblePerson" width="60%">
      <!-- title修改样式 -->
      <template slot="title">
        <div style="font-size: 16px; color: #fff; font-weight: bold">
          个人中心
        </div>
      </template>
      <span>用户个人中心的修改密码用户名等相关信息</span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      user_name: window.sessionStorage.getItem("user_name"),

      // header部分的数据
      // 通知dialog是否可见
      dialogVisibleMessage: false,
      // 个人中心dialog是否可见
      dialogVisiblePerson: false,

      menulist: [], //左侧菜单数据
      iconsObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
        104: "iconfont icon-morentouxiang",
        105: "iconfont icon-lock_fill",
        106: "iconfont icon-showpassword",
        107: "iconfont icon-3702mima",
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
    };
  },
  mounted() {
    this.getTime();
    this.getMenuList();
    // this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    // 暂时没有执行
    logout() {
      // 清空token 重定向到登录页
      // window.sessionStorage.clear();
      // this.$router.push("/login");
      // console.log("退出登录");
    },
    // 从后端获取到侧边栏数据
    async getMenuList() {
      if (window.sessionStorage.getItem("user_property") === "部门经理") {
        // 部门经理的侧边数据
        console.log("部门经理登录成功");
        this.menulist = [
          {
            id: 101,
            authName: "销售业绩",
            path: "",
            children: [
              {
                id: 104,
                authName: "业绩展示",
                path: "sale/performance",
                children: [],
              },
            ],
          },
          {
            id: 102,
            authName: "签约客户",
            path: "",
            children: [
              {
                id: 104,
                authName: "销售代表",
                path: "sign/customer",
                children: [],
              },
            ],
          },
        ];
      } else if (
        window.sessionStorage.getItem("user_property") === "销售代表"
      ) {
        console.log("销售代表登录成功");

        // 销售代表的侧边数据;
        this.menulist = [
          {
            id: 101,
            authName: "信息录入",
            path: "",
            children: [
              {
                id: 104,
                authName: "录入用户信息",
                path: "input/user/message",
                children: [],
              },
              {
                id: 105,
                authName: "录入洽谈记录",
                path: "input/talk/record",
                children: [],
              },
              {
                id: 106,
                authName: "录入工作日志",
                path: "input/word/date",
                children: [],
              },
              {
                id: 107,
                authName: "合同明细",
                path: "input/contract",
                children: [],
              },
            ],
          },
          {
            id: 102,
            authName: "信息统计",
            path: "",
            children: [
              {
                id: 104,
                authName: "个人销售业绩",
                path: "statistics/sale/achievement",
                children: [],
              },
              {
                id: 105,
                authName: "公海客户库",
                path: "statistics/user/database",
                children: [],
              },
            ],
          },
        ];
      } else if (
        window.sessionStorage.getItem("user_property") === "销售总监"
      ) {
        // console.log("销售总监登录成功");
        // 销售总监的侧边数据
        this.menulist = [
          {
            id: 101,
            authName: "销售业绩",
            path: "",
            children: [
              {
                id: 104,
                authName: "业绩展示",
                path: "warzone/sale/performance",
                children: [],
              },
            ],
          },
          {
            id: 102,
            authName: "签约客户",
            path: "",
            children: [
              {
                id: 104,
                authName: "客户信息",
                path: "director/customer",
                children: [],
              },
            ],
          },
          {
            id: 103,
            authName: "工作日志",
            path: "",
            children: [
              {
                id: 104,
                authName: "工作记录",
                path: "director/joblog",
                children: [],
              },
            ],
          },
        ];
      } else if (
        window.sessionStorage.getItem("user_property") == "系统管理员"
      ) {
        console.log("系统管理员登录成功");
        // 系统管理员的侧边数据
        this.menulist = [
          {
            id: 101,
            authName: "账号管理",
            path: "",
            children: [
              {
                id: 105,
                authName: "销售代表管理",
                path: "sales/mange",
                children: [],
              },
              {
                id: 106,
                authName: "部门经理管理",
                path: "salesdepart/mange",
                children: [],
              },
              {
                id: 107,
                authName: "销售总监管理",
                path: "salesdirector/mange",
                children: [],
              },
              {
                id: 108,
                authName: "金融专员管理",
                path: "fincialcommision/mange",
                children: [],
              },
              {
                id: 109,
                authName: "总经理管理",
                path: "general/manger",
                children: [],
              },
              {
                id: 110,
                authName: "管理员管理",
                path: "admin/mange",
                children: [],
              },
              {
                id: 111,
                authName: "会计管理",
                path: "accountant/mange",
                children: [],
              },
            ],
          },
          {
            id: 102,
            authName: "系统日志",
            path: "",
            children: [
              {
                id: 104,
                authName: "日志查询",
                path: "oplogs",
                children: [],
              },
            ],
          },
          {
            id: 103,
            authName: "部门注册",
            path: "",
            children: [
              {
                id: 104,
                authName: "部门注册",
                path: "depart/register",
                children: [],
              },
            ],
          },
        ];
      } else if (window.sessionStorage.getItem("user_property") === "总经理") {
        console.log("总经理登录成功");
        this.menulist = [
          {
            id: 101,
            authName: "业绩管理",
            path: "",
            children: [
              {
                id: 105,
                authName: "业绩管理",
                path: "performance/mange",
                children: [],
              },
            ],
          },
          {
            id: 102,
            authName: "客户信息",
            path: "",
            children: [
              {
                id: 105,
                authName: "客户信息",
                path: "customer/information",
                children: [],
              },
            ],
          },
        ];
      } else if (window.sessionStorage.getItem("user_property") === "会计") {
        console.log("会计登录成功");
        this.menulist = [
          {
            id: 101,
            authName: "服务费",
            path: "",
            children: [
              {
                id: 105,
                authName: "待收取",
                path: "service/fee",
                children: [],
              },
              {
                id: 106,
                authName: "已完成",
                path: "history/customer",
                children: [],
              },
            ],
          },
        ];
      } else if (
        window.sessionStorage.getItem("user_property") === "金融专员"
      ) {
        this.menulist = [
          {
            id: 101,
            authName: "业绩",
            path: "",
            children: [
              {
                id: 105,
                authName: "业绩详情",
                path: "fincial/promance",
                children: [],
              },
              // {
              //   id: 106,
              //   authName: "已完成",
              //   path: "history/customer",
              //   children: [],
              // },
            ],
          },
          {
            id: 102,
            authName: "贷款业务",
            path: "",
            children: [
              {
                id: 105,
                authName: "已发放贷款",
                path: "fincial/buinessfee",
                children: [],
              },
              {
                id: 105,
                authName: "未发放贷款",
                path: "fincial/buinessnofee",
                children: [],
              },
              // {
              //   id: 106,
              //   authName: "已完成",
              //   path: "history/customer",
              //   children: [],
              // },
            ],
          },
        ];
      }
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
      console.log("当前路径" + this.activePath);
    },
    //获取时间 格式化年月日时分秒 获取星期几
    getTime() {
      var span = document.getElementById("time");
      var dateStr = this.formatDate();
      // 将时间放置到span内
      span.innerText = dateStr;
      // 每隔一秒，再放置一次最新的时间
      setInterval(() => {
        span.innerText = this.formatDate();
      }, 1000);
    },
    formatDate() {
      var date = new Date();
      var week = this.getWeek(date);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      var day = date.getDate();
      day = day < 10 ? "0" + day : day;
      var hours = date.getHours();
      hours = hours < 10 ? "0" + hours : hours;
      var minutes = date.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var seconds = date.getSeconds();
      seconds = seconds < 10 ? "0" + seconds : seconds;
      // 2019-07-23 09:40:30
      return (
        year +
        " /" +
        month +
        " /" +
        day +
        "\xa0\xa0" +
        week +
        "  " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds +
        "\xa0\xa0"
      );
    },
    getWeek(d) {
      var weekday = new Array(7);
      weekday[0] = "星期日";
      weekday[1] = "星期一";
      weekday[2] = "星期二";
      weekday[3] = "星期三";
      weekday[4] = "星期四";
      weekday[5] = "星期五";
      weekday[6] = "星期六";

      return weekday[d.getDay()];
    },
    //退出登录
    // close() {
    //   // 退出登录清空token
    //   window.sessionStorage.clear();
    //   this.$router.push("/");
    // },
    //个人中心  退出登录
    handlePerson(command) {
      if (command === "person") {
        //点击个人中心展示一个用户信息dialog
        // this.dialogVisiblePerson = true;
        //
        this.$router.push("/cloud/personal/information");
        this.saveNavState("/cloud/personal/information");
      } else if (command === "close") {
        this.$router.push("/");
        window.sessionStorage.clear();
      }
    },
    //点击消息按钮展示一个最近通知信息dialog
    headerNotice() {
      this.dialogVisibleMessage = true;
    },
  },
};
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.maintenance-home-header {
  height: 70px !important; //如果有默认设置，添加important使得默认设置不生效
  background: #4a5064;
  display: flex;
  padding-left: 0; //图片左边贴边效果
  align-items: center; //按钮居中效果
  color: #e7dbdb; //文本的颜色
  position: relative;

  .maintenance-header-left {
    //文本的控制
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
      font-size: 27px;
      color: #fff;
    }
    img {
      margin-left: 15px;
    }
  }
  .maintenance-header-right {
    position: absolute;
    margin-right: 10px;
    right: 0;
    .el-button {
      margin-right: 8px;
      margin-left: 8px;
      font-size: 16px;
      color: #fff;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #3a425f;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>