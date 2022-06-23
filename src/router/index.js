import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

// 欢迎界面
import Welcome from '../components/Welcome.vue'

// 信息录入
// 录入用户信息
import InputUserMessage from '../components/input_message/InputUserMessage.vue'
// 录入洽谈记录
import InputTalkingRecord from '../components/input_message/InputTalkingRecord.vue'
// 录入工作日志
import InputWordDate from '../components/input_message/InputWordDate.vue'

// 信息统计
// 公海数据库
import SeaDatabase from '../components/message_statistics/SeaDatabase.vue'
// 销售业绩
import SaleAchivement from '../components/message_statistics/SaleAchivement.vue'

// 销售部
// 签约客户
import SaleCustomer from '../components/sale_depart/SaleCustomer.vue'
// 销售业绩
import SaleShows from '../components/sale_depart/SaleShows.vue'

// 战区业绩
import WarZoneSalePerformance from '../components/sale_departer/WarZoneSalePerformance.vue'

// 系统日志（系统管理员）
import Oplogs from '../components/admin/Oplogs.vue'
// 销售代表管理（系统管理员）
import SalesMange from '../components/admin/SalesMange.vue'
// 销售总监管理（系统管理员）
import SalesDirectorMange from '../components/admin/SalesDirectorMange.vue'
// 部门经理管理（系统管理员
import DeparterMange from '../components/admin/DeparterMange.vue'
// 金融给专员管理(系统管理员)
import FincialCommisionMange from '../components/admin/FincialCommisionMange.vue'
// 总经理管理(系统管理员)
import GeneralManger from '../components/admin/GeneralManger.vue'
// 系统管理员账号管理（系统管理员
import AdminMange from '../components/admin/AdminMange.vue'
// 会计管理（系统管理员
import AccountantMange from '../components/admin/AccountantMange.vue'
// 部门注册
import DepartRegister from '../components/admin/DepartRegister.vue'
// 业绩管理（总经理
import PerformanceMange from '../components/generalmanger/PerformanceMange.vue'
// 客户信息
import CustomerInformation from '../components/generalmanger/CustomerInformation.vue'
// 服务费收取页面（会计
import ServiceFee from '../components/accountant/ServiceFee.vue'
// 历史客户（会计
import HistoryCustomer from '../components/accountant/HistoryCustomer.vue';
// 业绩（金融专员
import Promance from '../components/FincialCommision/Promance.vue'
// 贷款业务查询分析（金融专员
import BusinessFee from '../components/FincialCommision/BusinessFee.vue'
import BusinessNoFee from '../components/FincialCommision/BusinessNoFee.vue'
// 合同展示
import Contract from '../components/input_message/Contract.vue'
// 客户信息（销售总监）
import Customer from '../components/sale_departer/Customer.vue'
// 工作记录
import WarZoneJobLog from '../components/sale_departer/WarZoneJobLog.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/input/user/message',
        component: InputUserMessage
      },
      {
        path: '/input/talk/record',
        component: InputTalkingRecord
      },
      {
        path: '/input/word/date',
        component: InputWordDate
      },
      {
        path: '/statistics/user/database',
        component: SeaDatabase
      },
      {
        path: '/statistics/sale/achievement',
        component: SaleAchivement
      },
      {
        path: '/sign/customer',
        component: SaleCustomer
      },
      {
        path: '/sale/performance',
        component: SaleShows
      },
      {
        path: '/warzone/sale/performance',
        component: WarZoneSalePerformance
      },
      {
        path: '/oplogs',
        component: Oplogs
      },
      {
        path: '/sales/mange',
        component: SalesMange
      },
      {
        path: '/salesdirector/mange',
        component: SalesDirectorMange
      },
      {
        path: '/salesdepart/mange',
        component: DeparterMange
        
      },
      {
        path: '/fincialcommision/mange',
        component: FincialCommisionMange
      },
      {
        path: '/general/manger',
        component: GeneralManger
      },
      {
        path: '/admin/mange',
        component: AdminMange
      },
      {
        path: '/accountant/mange',
        component: AccountantMange
      },
      {
        path: '/depart/register',
        component: DepartRegister
      },
      {
        path: '/performance/mange',
        component: PerformanceMange
        
      },
      {
        path: '/customer/information',
        component: CustomerInformation
      },
      {
        path: '/service/fee',
        component: ServiceFee
      },
      {
        path: '/history/customer',
        component: HistoryCustomer
      },
      {
        path: '/fincial/promance',
        component: Promance
      },
      {
        path: '/fincial/buinessnofee',
        component: BusinessNoFee
      },
      {
        path: '/fincial/buinessfee',
        component: BusinessFee
      },
      {
        path: '/input/contract',
        component: Contract
      },
      {
        path: '/director/customer',
        component: Customer
      },
      {
        path: '/director/joblog',
        component: WarZoneJobLog
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   /**
//    * to 将要访问的路径
//    * from 代表从哪个路径跳转而来
//    * next 是一个函数 表示放行
//    * next() 方形 next('/login') 强制跳转
//    */
//   if (to.path === '/login') {
//     return next();
//   }
//   // 获取token
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) {
//     return next('./login')
//   }
//   next()
// })

export default router
