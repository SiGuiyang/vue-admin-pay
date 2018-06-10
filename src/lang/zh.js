export default {
  route: {
    dashboard: '首页',
    merchantmanagement: '商户管理',
    openmerchant: '一键开户',
    merchantList: '商户列表',
    ordermanagement: '交易管理',
    statisticsmanagement: '统计管理',
    everydaytradeAmout: '每日交易金额记录',
    statisticchat: '交易图表',
    channelmanagement: '渠道管理',
    channel: '渠道管理',
    financemanagement: '财务管理',
    tradeFlow: '交易流水',
    refundFlow: '退款流水',
    systemmanagement: '系统管理',
    orderList: '订单列表',
    tradeList: '交易单列表',
    orderInfo: '订单详情',
    orderReview: '订单审核',
    permission: '权限管理',
    roleList: '角色列表',
    userList: '用户列表',
    menuList: '菜单列表',
    account: '账户管理',
    config: '配置设置',
    qiniuupload: '七牛云存储',
    accountList: '账户列表'
  },
  navbar: {
    logOut: '退出登录',
    dashboard: '首页',
    github: '个人信息',
    screenfull: '全屏',
    theme: '换肤'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码'
  },
  documentation: {
    documentation: '文档',
    github: 'Github 地址'
  },
  permission: {
    roles: '你的权限',
    switchRoles: '切换权限'
  },
  components: {
    documentation: '文档',
    tinymceTips:
      '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    dropzoneTips:
      '由于我司业务有特殊需求，而且要传七牛 所以没用第三方，选择了自己封装。代码非常的简单，具体代码你可以在这里看到 @/components/Dropzone',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2:
      '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips:
      '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  table: {
    age: '年龄',
    gender: '性别',
    birthday: '生日',
    editPermission: '权限设置',
    dynamicTips1: '固定表头, 按照表头顺序排序',
    dynamicTips2: '不固定表头, 按照点击顺序排序',
    pleaseSelect: '请选择',
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    importance: '重要性',
    type: '类型',
    remark: '备注',
    immediatelyCreate: '立即创建',
    search: '搜索',
    add: '添加',
    export: '导出',
    reviewer: '审核人',
    review: '审核',
    reset: '重置',
    close: '关闭',
    submit: '提交',
    id: '序号',
    date: '时间',
    author: '作者',
    readings: '阅读数',
    status: '状态',
    actions: '操作',
    edit: '编辑',
    modifyCache: '更新配置项缓存',
    publish: '发布',
    draft: '草稿',
    delete: '删除',
    cancel: '取 消',
    confirm: '确 定',
    detail: '详情',
    sequence: '序号',
    configName: '配置项名称',
    configValue: '配置项值',
    description: '说明',
    version: '版本',
    merchantName: '商户名',
    contractName: '联系人',
    merchantNo: '商户号',
    mobile: '手机号码',
    rate: '费率',
    deduction: '扣量',
    isDeduction: '是否扣量',
    idCard: '身份证号码',
    createTime: '创建时间',
    updateTime: '更新时间',
    bankName: '银行名称',
    bankCode: '银行编码',
    bankNum: '银行卡号',
    payAmount: '支付金额',
    tradeStatus: '交易状态',
    roleName: '角色名称',
    roleCode: '角色代码',
    username: '用户名',
    highQuality: 'VIP商户',
    channelCenterName: '渠道名称',
    channelPayType: '支付渠道方式',
    createUserName: '创建人',
    updateUserName: '修改人',
    payChannelSet: '支付渠道配置',
    channelName: '通道名称',
    appId: 'appId',
    openId: 'openId',
    mchId: '支付商户号',
    secureKey: '密钥',
    currentNode: '当前节点',
    currentEnable: '是否可用',
    noticationStatus: '通知状态',
    tradeCode: '交易流水号',
    tradeAmount: '交易金额',
    IdCardFrond: '身份证正面',
    IdCardBehind: '身份证反面',
    license: '营业执照',
    publicKey: '共钥',
    privateKey: '私钥',
    payChannelCenter: '支付中心配置',
    merchantPay: '支付配置'
  },
  dashboard: {
    merchantCount: '平台商户总数',
    yesterdayAlipayAmount: '昨日支付宝交易总金额',
    yesterdayWechatAmount: '昨日微信交易总金额',
    yesterdayOrderCount: '昨日下单总数'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description:
      '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  zip: {
    export: '导出',
    placeholder: '请输入文件名(默认file)'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips:
      'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  bank: {
    name: '银行名称',
    code: '银行编码',
    num: '银行卡号'
  },
  time: {
    createTime: '创建时间'
  },
  status: {
    name: '状态',
    normal: '正常',
    disable: '禁用',
    enable: '启用'
  }
}
