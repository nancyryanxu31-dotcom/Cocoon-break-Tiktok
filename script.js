const feed = document.querySelector("#feed");
const drawer = document.querySelector("#personaDrawer");
const weeklyModal = document.querySelector("#weeklyModal");
let reels = [...document.querySelectorAll(".reel")];
let videos = [...feed.querySelectorAll("video")];
const roles = typeof rolePresets === "undefined" ? [] : rolePresets;

const roleCarousel = document.querySelector("#roleCarousel");
const feedTabs = document.querySelector(".feed-tabs");
const recommendTabButton = document.querySelector("#openRecommend");
const cocoonTabButton = document.querySelector("#openPersona");
const roleCooldown = document.querySelector("#roleCooldown");
const roleEditor = document.querySelector("#roleEditor");
const customRoleName = document.querySelector("#customRoleName");
const saveRoleName = document.querySelector("#saveRoleName");
const roleMenu = document.querySelector("#roleMenu");
const roleMenuButton = document.querySelector("#roleMenuButton");
const shuffleRole = document.querySelector("#shuffleRole");
const rolePreviewPanel = document.querySelector("#rolePreviewPanel");
const roleToast = document.querySelector("#roleToast");
const roleSearch = document.querySelector("#roleSearch");
const roleDots = document.querySelector("#roleDots");
const enableActiveRoleButton = document.querySelector("#enableActiveRole");
const previewActiveRoleButton = document.querySelector("#previewActiveRole");
const weeklyTitle = document.querySelector("#weeklyTitle");
const weeklyBody = document.querySelector("#weeklyBody");
const publishWeeklyPersona = document.querySelector("#publishWeeklyPersona");
const openPortraitCommunity = document.querySelector("#openPortraitCommunity");
const saveWeeklyPersona = document.querySelector("#saveWeeklyPersona");
const communityModal = document.querySelector("#communityModal");
const communityTitle = document.querySelector("#communityTitle");
const communityMeta = document.querySelector("#communityMeta");
const communityVideos = document.querySelector("#communityVideos");
const communityNews = document.querySelector("#communityNews");
const communityMembers = document.querySelector("#communityMembers");
const communityChat = document.querySelector("#communityChat");
const communityForm = document.querySelector("#communityForm");
const communityMessage = document.querySelector("#communityMessage");

const scores = {
  coder: document.querySelector("#codeScore"),
  reader: document.querySelector("#focusScore"),
  founder: document.querySelector("#openScore")
};

const videoBasePath = "videos/";

function videoPath(source) {
  const value = String(source || "");
  if (/^(https?:|data:|blob:|\/)/.test(value) || value.startsWith(videoBasePath)) return value;
  return `${videoBasePath}${value}`;
}

function normalizeVideoKey(source) {
  return String(source || "").replace(/^videos\//, "");
}

const defaultRolePowerScores = {
  coding: 67,
  exam: 46,
  reader: 52,
  fitness: 34,
  foodie: 28,
  founder: 58,
  creator: 41,
  finance: 49,
  language: 37
};

const rolePowerLabels = {
  coding: "Coding",
  exam: "考研",
  reader: "阅读",
  fitness: "晨练",
  foodie: "料理",
  founder: "产品",
  creator: "内容",
  finance: "理财",
  language: "外语"
};

const roleViewerPools = {
  coding: ["1.2k", "1.4k", "986", "1.7k", "1.1k"],
  exam: ["8632", "9021", "7816", "9350", "8144"],
  reader: ["6354", "7120", "5988", "6801", "7542"],
  fitness: ["4821", "5290", "4318", "5012", "4680"],
  foodie: ["1.1k", "973", "1280", "864", "1.4k"],
  founder: ["1.7k", "1420", "1988", "1680", "2114"],
  creator: ["940", "1180", "863", "1290", "1017"],
  finance: ["3290", "3764", "3018", "3488", "3921"],
  language: ["5176", "5610", "4882", "5309", "5744"]
};

const initialRecommendVideos = [
  {
    source: "美食.mp4",
    fallbackClass: "founder",
    persona: "normal",
    videoType: "entertainment",
    creator: "@好好吃饭计划",
    caption: "一人食也可以认真一点。把晚饭做漂亮，今天就没有完全交给算法。",
    music: "♪ 原声 · 生活切片"
  },
  {
    source: "小说2.mp4",
    fallbackClass: "reader",
    persona: "normal",
    videoType: "entertainment",
    creator: "@慢读十分钟",
    caption: "别急着划走，给一个观点留十秒钟，它会慢慢长出自己的答案。",
    music: "♪ 原声 · 普通推荐流"
  },
  {
    source: "剧目.mp4",
    fallbackClass: "founder",
    persona: "normal",
    videoType: "entertainment",
    creator: "@是个好剧",
    caption: "今天看了一部很好的剧,给大家分享一下",
    music: "♪ 原声 · 生活切片"
  }
];

const roleVideoPools = {
  coding: [
    { source: "超级AI研究所.mp4", creator: "@超级AI研究所", caption: "先把 AI Coding 的全流程看一遍，从灵感、提示词到可运行的 Demo。", tag: "AI 研究", isRoleCore: true },
    { source: "雷神aicode.mp4", creator: "@雷神 AI Code", caption: "把一个 AI Coding 工作流拆成可复用步骤，今天先让代码自己跑起来。", tag: "AI Coding", isRoleCore: true },
    { source: "麻省理工rui同学.mp4", creator: "@麻省理工 Rui 同学", caption: "从论文想法到可运行 Demo，AI 编程把验证速度压到一杯咖啡之内。", tag: "项目复现", isRoleCore: true },
    { source: "徐sir的ai.mp4", creator: "@徐sir 的 AI", caption: "把复杂项目拆成 AI 能接手的小任务，今天先推进一个最小闭环。", tag: "实战", isRoleCore: true },
    { source: "小代不懂代码.mp4", creator: "@小代不懂代码", caption: "先从最小能跑的代码开始，把复杂问题拆到自己能接住的那一层。", tag: "入门实战", isRoleCore: true },
    { source: "Selena玩Ai.mp4", creator: "@Selena 玩 AI", caption: "用 AI 做一个小工具，先把灵感落成屏幕上的按钮。", tag: "AI Coding", isRoleCore: true }
  ],
  foodie: [
    { source: "今天不吃饭.mp4", creator: "@今天不吃饭", caption: "先认真看一顿饭，生活会慢慢重新有秩序。", tag: "治愈料理", isRoleCore: true },
    { source: "美食之奶黄蛋堡.mp4", creator: "@奶黄蛋堡研究所", caption: "把普通一口拍得热乎一点，今天先被食物安慰一下。", tag: "美食", isRoleCore: true },
    { source: "恰一口美食.mp4", creator: "@恰一口美食", caption: "这条适合饿的时候看，也适合想恢复一点生活感的时候看。", tag: "美食治愈", isRoleCore: true },
    { source: "上海美食.mp4", creator: "@上海美食地图", caption: "城市里藏着很多具体的小快乐，先从一口热的开始。", tag: "城市美食", isRoleCore: true },
    { source: "深夜来口大美食.mp4", creator: "@深夜来口大美食", caption: "深夜刷到这一口，允许自己被认真照顾一次。", tag: "深夜美食", isRoleCore: true },
    { source: "我吃吃吃.mp4", creator: "@我吃吃吃", caption: "今天的目标很简单：好好吃饭，好好回到自己身上。", tag: "生活切片", isRoleCore: true }
  ],
  language: [
    { source: "恐怖英语制约我.mp4", creator: "@恐怖英语制约我", caption: "别被英语吓住，先从一句能开口的话开始。", tag: "英语输入", isRoleCore: true },
    { source: "你好我是英语.mp4", creator: "@你好我是英语", caption: "今天练一点点，先让耳朵和嘴巴重新热起来。", tag: "口语", isRoleCore: true },
    { source: "谁用谁是英语大神.mp4", creator: "@谁用谁是英语大神", caption: "把高频表达放进短视频里，刷着刷着就多会一句。", tag: "表达积累", isRoleCore: true },
    { source: "我爱英语.mp4", creator: "@我爱英语", caption: "语言学习不一定要苦，先把输入变得轻一点。", tag: "听力", isRoleCore: true },
    { source: "下辈子还学英语吗.mp4", creator: "@下辈子还学英语吗", caption: "这条适合一边笑一边学，压力小一点也能进步。", tag: "英语日常", isRoleCore: true },
    { source: "英语我要开窍.mp4", creator: "@英语我要开窍", caption: "把复杂语感拆成能跟读的小片段，今天先开一条缝。", tag: "跟读", isRoleCore: true },
    { source: "英语我学学学.mp4", creator: "@英语我学学学", caption: "短频高复现，适合今天只想坚持十分钟的人。", tag: "沉浸练习", isRoleCore: true },
    { source: "英语英语英语er.mp4", creator: "@英语英语英语er", caption: "用一点重复感把语言磨顺，别急，先刷完这一条。", tag: "语言输入", isRoleCore: true }
  ]
};

const codingPowerStorageKey = "codingDailyPowerState";
const roleDailyPowerStorageKey = "roleDailyPowerStates";
const codingPowerSteps = [
  { count: 1, power: 10, badge: "", persistBadge: false },
  { count: 2, power: 30, badge: "小试牛刀", persistBadge: false },
  { count: 3, power: 50, badge: "", persistBadge: false },
  { count: 4, power: 70, badge: "渐入佳境", persistBadge: false },
  { count: 5, power: 90, badge: "", persistBadge: false },
  { count: 6, power: 100, badge: "知行合一", persistBadge: false }
];
const codingVideoOrder = roleVideoPools.coding.map((item) => normalizeVideoKey(item.source));

const rolePreviewVideoSources = {
  coding: "雷神aicode.mp4",
  exam: "学习.mp4",
  reader: "小说2.mp4",
  fitness: "今天练练练.mp4",
  foodie: "今天不吃饭.mp4",
  creator: "实验室研究生.mp4",
  finance: "基因gogogo.mp4",
  language: "你好我是英语.mp4",
  other: "实验室研究生.mp4"
};

const drawerRoleIds = new Set(["coding", "foodie", "language", "other"]);
const drawerCooldownCopy = "距下次更换还有11h，或消耗1次人生重置卡立即更换......";

const weeklyReports = [
  {
    roleId: "coding",
    persona: "coder",
    title: "AI 编程冲刺型选手",
    rank: "前 8.4%",
    rarity: "A级稀有画像",
    summary: "你本周明显偏向代码、AI 工具和效率提升内容，系统判断你正在进入高强度学习和实战状态。",
    metrics: [
      { label: "AI Coding", value: 72, detail: "72 次互动" },
      { label: "代码技巧", value: 54, detail: "54 次停留" },
      { label: "工具链", value: 46, detail: "46 次收藏" },
      { label: "项目实战", value: 31, detail: "31 次复看" }
    ],
    evidence: [
      "你完整看完 Cursor、Agent、Python 技巧类视频的比例最高。",
      "你收藏了 6 条能直接复用到 Demo 的代码内容。",
      "你在深夜时段对学习视频的完播率显著高于娱乐视频。"
    ]
  },
  {
    roleId: "reader",
    persona: "reader",
    title: "深度阅读沉浸者",
    rank: "前 12.7%",
    rarity: "B级稀有画像",
    summary: "你本周更容易停留在阅读、观点和知识整理类内容上，偏好慢节奏但信息密度高的视频。",
    metrics: [
      { label: "深度阅读", value: 66, detail: "66 次停留" },
      { label: "观点拆解", value: 58, detail: "58 次互动" },
      { label: "书单内容", value: 43, detail: "43 次复看" },
      { label: "笔记整理", value: 28, detail: "28 次收藏" }
    ],
    evidence: [
      "你对长字幕、书桌、读书笔记类内容的平均观看时长最高。",
      "你多次复看同一条观点拆解视频，说明内容进入了思考链路。",
      "系统检测到你对知识卡片和摘要类内容有明显偏好。"
    ]
  },
  {
    roleId: "founder",
    persona: "founder",
    title: "产品增长实验家",
    rank: "前 6.1%",
    rarity: "S级稀有画像",
    summary: "你本周集中浏览产品、增长、商业验证和 AI 创业内容，适合进入更强目标感的信息流。",
    metrics: [
      { label: "产品判断", value: 74, detail: "74 次互动" },
      { label: "增长案例", value: 62, detail: "62 次停留" },
      { label: "商业验证", value: 47, detail: "47 次收藏" },
      { label: "AI 创业", value: 39, detail: "39 次复看" }
    ],
    evidence: [
      "你对 MVP、用户反馈和增长拆解内容的完播率最高。",
      "你收藏的内容更偏实操清单，而不是泛泛的商业故事。",
      "系统判断你正在寻找可验证的机会点和下一步行动。"
    ]
  }
];

const roleWeeklyReportProfiles = {
  exam: {
    title: "自律冲刺型备考人",
    rank: "前 9.6%",
    rarity: "A 级高专注画像",
    summary: "你本周明显偏向备考、自习、错题复盘和节奏管理内容，系统判断你正在进入高密度冲刺状态。",
    metrics: [
      { label: "备考专注", value: 68, detail: "68 次停留" },
      { label: "错题复盘", value: 56, detail: "56 次互动" },
      { label: "自习节奏", value: 48, detail: "48 次完播" },
      { label: "记忆卡片", value: 34, detail: "34 次收藏" }
    ],
    evidence: [
      "你对自习、复盘和学习规划类视频的停留时间明显高于娱乐内容。",
      "你连续刷完多条备考节奏内容，说明短期目标正在变得更清晰。",
      "系统检测到你对错题整理、记忆卡片和作息管理内容有稳定偏好。"
    ]
  },
  fitness: {
    title: "晨练行动唤醒者",
    rank: "前 14.2%",
    rarity: "B 级行动画像",
    summary: "你本周更容易被晨练、体能唤醒和轻量打卡内容拉住，适合进入低门槛但持续推进的信息流。",
    metrics: [
      { label: "晨练打卡", value: 64, detail: "64 次停留" },
      { label: "体能唤醒", value: 51, detail: "51 次完播" },
      { label: "动作跟练", value: 44, detail: "44 次互动" },
      { label: "作息重启", value: 32, detail: "32 次收藏" }
    ],
    evidence: [
      "你对短时跟练和晨间唤醒内容的完播率最高。",
      "你多次停留在低门槛训练计划上，说明更适合从小动作开始恢复节奏。",
      "系统判断你正在寻找能立刻执行、不需要复杂装备的行动入口。"
    ]
  },
  foodie: {
    title: "治愈料理生活家",
    rank: "前 11.8%",
    rarity: "B 级治愈画像",
    summary: "你本周偏向料理、生活秩序和自我照顾内容，系统判断你正在用具体的小事修复节奏。",
    metrics: [
      { label: "料理灵感", value: 70, detail: "70 次互动" },
      { label: "生活治愈", value: 57, detail: "57 次停留" },
      { label: "备餐计划", value: 42, detail: "42 次收藏" },
      { label: "摆盘审美", value: 29, detail: "29 次复看" }
    ],
    evidence: [
      "你对一人食、备餐和快速料理内容的停留最稳定。",
      "你收藏了多条可以直接复用的菜单和生活清单。",
      "系统判断你更容易被温和、具体、能立刻改善生活的小行动打动。"
    ]
  },
  creator: {
    title: "内容增长实验家",
    rank: "前 7.9%",
    rarity: "A 级创作画像",
    summary: "你本周集中浏览选题、脚本、增长和账号实验内容，适合进入更强反馈感的创作信息流。",
    metrics: [
      { label: "选题灵感", value: 73, detail: "73 次互动" },
      { label: "脚本结构", value: 61, detail: "61 次停留" },
      { label: "账号增长", value: 49, detail: "49 次收藏" },
      { label: "实验复盘", value: 37, detail: "37 次复看" }
    ],
    evidence: [
      "你对爆款标题、脚本结构和选题拆解类内容的互动频次最高。",
      "你多次复看同一类创作方法论，说明正在寻找可复制的表达框架。",
      "系统判断你适合把灵感转成小实验，而不是只停留在收藏。"
    ]
  },
  finance: {
    title: "理财规划执行者",
    rank: "前 10.4%",
    rarity: "A 级规划画像",
    summary: "你本周明显偏向预算、支出复盘和现金流规划内容，系统判断你正在重建更稳的金钱秩序。",
    metrics: [
      { label: "预算规划", value: 69, detail: "69 次停留" },
      { label: "支出复盘", value: 55, detail: "55 次互动" },
      { label: "现金流", value: 46, detail: "46 次收藏" },
      { label: "消费降噪", value: 33, detail: "33 次复看" }
    ],
    evidence: [
      "你对预算表、账户分类和支出复盘内容的停留时长更高。",
      "你收藏了多条可以直接落地的金钱管理方法。",
      "系统判断你更需要清晰的执行表，而不是泛泛的财富故事。"
    ]
  },
  language: {
    title: "外语沉浸练习者",
    rank: "前 13.1%",
    rarity: "B 级沉浸画像",
    summary: "你本周更容易停留在听力、跟读和场景表达内容上，适合进入短频高复现的语言输入流。",
    metrics: [
      { label: "听力输入", value: 67, detail: "67 次完播" },
      { label: "影子跟读", value: 52, detail: "52 次互动" },
      { label: "场景表达", value: 44, detail: "44 次收藏" },
      { label: "睡前输入", value: 31, detail: "31 次复看" }
    ],
    evidence: [
      "你对短句跟读和听力输入内容的完播率最稳定。",
      "你多次停留在同一类场景表达视频上，说明输入正在变成可复用语料。",
      "系统判断你适合用高频、短时、可重复的方式建立语言手感。"
    ]
  }
};

function createWeeklyReportForRole(role) {
  const roleName = getRoleName(role);
  const label = getRolePowerLabel(role);
  const tags = role.tags?.length ? role.tags : [label, roleName, role.signature].filter(Boolean);
  const samples = role.samples?.length ? role.samples : [`${roleName} 今日复盘`, `${roleName} 行动清单`, `${roleName} 进阶路线`];
  const profile = roleWeeklyReportProfiles[role.id];
  const fallbackMetrics = tags.slice(0, 4).map((tag, index) => {
    const values = [66, 54, 43, 31];
    const details = ["次停留", "次互动", "次收藏", "次复看"];
    return {
      label: tag,
      value: values[index] || Math.max(28, 62 - index * 9),
      detail: `${values[index] || Math.max(28, 62 - index * 9)} ${details[index] || "次互动"}`
    };
  });

  while (fallbackMetrics.length < 4) {
    const value = 34 - fallbackMetrics.length * 3;
    fallbackMetrics.push({ label: `${label}指数`, value, detail: `${value} 次互动` });
  }

  return {
    roleId: role.id,
    persona: role.targetPersona || "normal",
    title: profile?.title || `${roleName} 深度画像`,
    rank: profile?.rank || "前 12.5%",
    rarity: profile?.rarity || "A 级成长画像",
    summary: profile?.summary || `你本周明显偏向${tags.slice(0, 2).join("、") || roleName}内容，系统判断你正在进入更稳定的${roleName}状态。`,
    metrics: profile?.metrics || fallbackMetrics,
    evidence:
      profile?.evidence || [
        `你对「${samples[0]}」相关内容的停留明显更高。`,
        `你多次互动和收藏 ${roleName} 相关内容，说明这个身份正在形成稳定偏好。`,
        `系统判断你适合进入更聚焦的 ${roleName} 信息流，用连续内容把兴趣变成行动。`
      ]
  };
}

function getWeeklyReportForRole(roleOrId = selectedRoleId) {
  const role = typeof roleOrId === "string" ? getRole(roleOrId) : roleOrId;
  const fallbackRole = role || getSelectedRole();
  let report = weeklyReports.find((item) => item.roleId === fallbackRole?.id);
  if (!report && fallbackRole) {
    report = createWeeklyReportForRole(fallbackRole);
    weeklyReports.push(report);
  }
  return report || weeklyReports[0];
}

function setWeeklyReportForRole(roleId = selectedRoleId) {
  const report = getWeeklyReportForRole(roleId);
  const index = weeklyReports.findIndex((item) => item === report || item.roleId === report?.roleId);
  weeklyReportIndex = index >= 0 ? index : 0;
  activeWeeklyReport = weeklyReports[weeklyReportIndex];
  return activeWeeklyReport;
}

const portraitCommunities = {
  coder: {
    name: "AI 编程冲刺社区",
    online: "1.2k 在线",
    members: ["Agent 调参师", "Cursor 熟练工", "后端接口修理员", "Python 提效党"],
    hotVideos: [
      { title: "Cursor 自动重构工作流", rate: "点击率 18.7%", reason: "同画像完播最高", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=480&q=80" },
      { title: "Agent 从 0 到 1 做小工具", rate: "点击率 16.2%", reason: "收藏增长最快", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=480&q=80" },
      { title: "RAG 推荐流量排序实战", rate: "点击率 14.9%", reason: "周报相关度最高", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=480&q=80" }
    ],
    events: [
      { type: "直播", title: "48 小时 Agent 编程挑战", meta: "今晚 20:00 开始 · 324 人预约" },
      { type: "机会", title: "低代码 Agent 模板需求上升", meta: "相关搜索 +38%" }
    ],
    messages: [
      ["Agent 调参师", "这周最有用的是把 prompt 拆成步骤，Demo 稳了很多。"],
      ["Cursor 熟练工", "我也被周报判成补课型，看来不是我一个人在半夜写 Demo。"],
      ["后端接口修理员", "RAG 那条推荐真能直接放进项目里。"]
    ]
  },
  reader: {
    name: "深度阅读同频社区",
    online: "842 在线",
    members: ["书桌整理者", "观点卡片玩家", "长文摘要党", "睡前阅读派"],
    hotVideos: [
      { title: "如何把一本书拆成行动卡", rate: "点击率 15.8%", reason: "同画像收藏最高", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=480&q=80" },
      { title: "3 分钟做完观点复盘", rate: "点击率 13.6%", reason: "复看率最高", image: "https://images.unsplash.com/photo-1499257398700-43669759a540?auto=format&fit=crop&w=480&q=80" },
      { title: "今日阅读片段精选", rate: "点击率 12.4%", reason: "阅读画像强匹配", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=480&q=80" }
    ],
    events: [
      { type: "共读", title: "7 天观点卡片共读挑战", meta: "第 3 天 · 86 人同步打卡" },
      { type: "机会", title: "知识整理模板热度上升", meta: "相关收藏 +21%" }
    ],
    messages: [
      ["书桌整理者", "这周终于把收藏夹清了一半。"],
      ["观点卡片玩家", "AI 摘要加自己的判断，真的比只收藏强很多。"],
      ["长文摘要党", "周报说我偏深度阅读，还挺准。"]
    ]
  },
  founder: {
    name: "产品增长实验室",
    online: "1.7k 在线",
    members: ["MVP 拆解师", "增长显微镜", "用户访谈狂热者", "AI 产品经理"],
    hotVideos: [
      { title: "MVP 需求验证 5 步法", rate: "点击率 19.4%", reason: "同画像转化最高", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=480&q=80" },
      { title: "AI 产品如何找到第一个用户", rate: "点击率 17.1%", reason: "讨论量最高", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=480&q=80" },
      { title: "从数据看增长机会", rate: "点击率 14.8%", reason: "MVP 标签强相关", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=480&q=80" }
    ],
    events: [
      { type: "直播", title: "从一个痛点做出 MVP", meta: "明晚开播 · 12 个项目报名" },
      { type: "机会", title: "AI 效率工具垂类需求升温", meta: "相关帖子 46 条" }
    ],
    messages: [
      ["MVP 拆解师", "周报给的机会点可以直接变验证清单。"],
      ["增长显微镜", "先别做大功能，先测一个强入口。"],
      ["AI 产品经理", "同标签内容流比普通推荐准很多。"]
    ]
  },
  normal: {
    name: "同画像探索社区",
    online: "3.8k 在线",
    members: ["随机灵感收集者", "内容探索者", "轻学习用户", "趋势观察员"],
    hotVideos: [
      { title: "本周热门学习内容合集", rate: "点击率 21.3%", reason: "泛兴趣匹配", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=480&q=80" },
      { title: "如何清理收藏夹", rate: "点击率 18.5%", reason: "收藏用户高频", image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=480&q=80" },
      { title: "30 秒找到今天的目标", rate: "点击率 16.8%", reason: "适合普通模式", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=480&q=80" }
    ],
    events: [
      { type: "精选", title: "本周高质量内容榜单", meta: "按画像兴趣实时更新" },
      { type: "机会", title: "短学习内容热度上升", meta: "适合破茧入口测试" }
    ],
    messages: [
      ["随机灵感收集者", "这个社区像是我的收藏夹整理器。"],
      ["内容探索者", "周报能看出自己到底在刷什么。"],
      ["趋势观察员", "同画像推荐比普通推荐更聚焦。"]
    ]
  }
};

function readSavedWeeklyRoles() {
  try {
    const savedRoles = JSON.parse(localStorage.getItem("savedWeeklyRoles") || "[]");
    return Array.isArray(savedRoles) ? savedRoles : [];
  } catch (error) {
    return [];
  }
}

function writeSavedWeeklyRoles(savedRoles) {
  localStorage.setItem("savedWeeklyRoles", JSON.stringify(savedRoles));
}

function readPublicWeeklyRoles() {
  try {
    const publicRoles = JSON.parse(localStorage.getItem("publicWeeklyRoles") || "[]");
    return Array.isArray(publicRoles) ? publicRoles : [];
  } catch (error) {
    return [];
  }
}

function writePublicWeeklyRoles(publicRoles) {
  localStorage.setItem("publicWeeklyRoles", JSON.stringify(publicRoles));
}

function syncSavedWeeklyRoles() {
  const savedRoles = [...readPublicWeeklyRoles(), ...readSavedWeeklyRoles()];

  savedRoles.forEach((role) => {
    if (!role?.id || roles.some((item) => item.id === role.id)) return;
    roles.push(role);
  });
}

syncSavedWeeklyRoles();

let activeIndex = 0;
let muted = true;
let selectedRoleId = localStorage.getItem("selectedRoleId") || roles.find((role) => role.status)?.id || roles[0]?.id;
const isDrawerSelectableRole = (roleId) => drawerRoleIds.has(roleId) && !getRole(roleId)?.disabled;
if (!isDrawerSelectableRole(selectedRoleId)) {
  selectedRoleId = "coding";
}
let activeRoleId = selectedRoleId;
let roleScrollFrame = null;
let rolePromptShown = false;
let roleSearchTerm = "";
let userPausedActiveVideo = false;
let personaModeEnabled = false;
let activeFeedPage = window.location.hash === "#cocoon" ? "cocoon" : "recommend";
const userSettings = window.userSettings || {};
userSettings.identityTagEnabled = Boolean(userSettings.identityTagEnabled && personaModeEnabled);
window.userSettings = userSettings;
let weeklyReportIndex = 0;
let activeWeeklyReport = null;
let codingFeedCycleCount = 0;
const viewedReels = new Set();
const observedReels = new WeakSet();
const boundReels = new WeakSet();
const boundVideos = new WeakSet();
let powerDragState = null;
let suppressRolePowerDuringJump = false;

let customRoleNames = {};
let rolePowerScores = {};
let roleDailyPowerStates = {};

function createDefaultRoleDailyPowerState() {
  return {
    viewedIndices: [0],
    viewedCount: 1,
    power: 10,
    badge: ""
  };
}

function createDefaultCodingDailyPowerState() {
  return createDefaultRoleDailyPowerState();
}

function normalizeRoleDailyPowerState(state = {}, sourceOrder = []) {
  const value = state && typeof state === "object" ? state : {};
  const fallback = createDefaultRoleDailyPowerState();
  const viewedIndices = Array.isArray(value.viewedIndices)
    ? value.viewedIndices
    : Array.isArray(value.viewedSources) && sourceOrder.length > 0
      ? value.viewedSources
          .map((source) => sourceOrder.indexOf(normalizeVideoKey(source)))
          .filter((index) => index >= 0)
      : [];
  const uniqueViewedIndices = [...new Set(viewedIndices.map((index) => Number(index)).filter((index) => Number.isInteger(index) && index >= 0))].sort(
    (a, b) => a - b
  );
  const power = Number(value.power);
  const viewedCount = Number(value.viewedCount);

  return {
    viewedIndices: uniqueViewedIndices.length > 0 ? uniqueViewedIndices : fallback.viewedIndices,
    viewedCount: Number.isFinite(viewedCount) && viewedCount > 0 ? viewedCount : uniqueViewedIndices.length || fallback.viewedCount,
    power: Number.isFinite(power) && power > 0 ? Math.min(100, power) : fallback.power,
    badge: typeof value.badge === "string" ? value.badge : ""
  };
}

function normalizeCodingDailyPowerState(state = {}) {
  return normalizeRoleDailyPowerState(state, codingVideoOrder);
}

let codingDailyPowerState = createDefaultCodingDailyPowerState();

try {
  customRoleNames = JSON.parse(localStorage.getItem("customRoleNames") || "{}");
} catch (error) {
  customRoleNames = {};
}

try {
  rolePowerScores = {
    ...defaultRolePowerScores,
    ...JSON.parse(localStorage.getItem("rolePowerScores") || "{}")
  };
} catch (error) {
  rolePowerScores = { ...defaultRolePowerScores };
}

try {
  roleDailyPowerStates = JSON.parse(localStorage.getItem(roleDailyPowerStorageKey) || "{}");
} catch (error) {
  roleDailyPowerStates = {};
}

try {
  codingDailyPowerState = normalizeCodingDailyPowerState(
    JSON.parse(localStorage.getItem(codingPowerStorageKey) || JSON.stringify(roleDailyPowerStates.coding || {}))
  );
} catch (error) {
  codingDailyPowerState = createDefaultCodingDailyPowerState();
}
roleDailyPowerStates.coding = codingDailyPowerState;

function openLayer(layer) {
  layer.classList.add("open");
  layer.setAttribute("aria-hidden", "false");
}

function closeLayer(layer) {
  layer.classList.remove("open");
  layer.setAttribute("aria-hidden", "true");

  if (layer === drawer) {
    hideRoleOverlays();
    pauseRolePreviewVideos();
  }
}

function isCocoonPageActive() {
  return activeFeedPage === "cocoon" && personaModeEnabled && userSettings.identityTagEnabled;
}

function updateFeedTabs() {
  feedTabs?.querySelectorAll("button").forEach((button) => {
    button.classList.remove("active");
  });

  if (cocoonTabButton) {
    cocoonTabButton.textContent = "破茧";
  }

  if (activeFeedPage === "cocoon") {
    cocoonTabButton?.classList.add("active");
    return;
  }

  recommendTabButton?.classList.add("active");
}

function switchFeedPage(page) {
  activeFeedPage = page === "cocoon" && personaModeEnabled ? "cocoon" : "recommend";
  document.body.classList.toggle("cocoon-page", isCocoonPageActive());
  updateFeedTabs();
  updateIdentityOverlays();
}

function navigateToCocoonPage() {
  if (window.location.hash !== "#cocoon") {
    window.location.href = "#cocoon";
  }

  switchFeedPage("cocoon");
}

function openPersonaDrawer() {
  rolePromptShown = true;
  sessionStorage.setItem("rolePromptShown", "1");
  openLayer(drawer);
  requestAnimationFrame(() => {
    setActiveRole(activeRoleId, { scroll: true });
    playRolePreviewVideos();
  });
}

function maybeOpenRolePrompt() {
  if (
    rolePromptShown ||
    personaModeEnabled ||
    viewedReels.size < 2 ||
    roles.length === 0 ||
    drawer.classList.contains("open") ||
    weeklyModal.classList.contains("open")
  ) {
    return;
  }

  rolePromptShown = true;
  sessionStorage.setItem("rolePromptShown", "1");
  openPersonaDrawer();
}

function playActiveVideo() {
  videos.forEach((video, index) => {
    video.muted = muted;
    if (index === activeIndex) {
      const reel = reels[index];
      if (userPausedActiveVideo || reel?.classList.contains("is-paused")) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
      return;
    }
    video.pause();
    reels[index]?.classList.remove("is-paused");
  });
}

function toggleActiveVideoPlayback(reel) {
  const index = reels.indexOf(reel);
  const video = videos[index];
  if (!video) return;

  if (video.paused) {
    userPausedActiveVideo = false;
    reel.classList.remove("is-paused");
    video.play().catch(() => {});
    return;
  }

  userPausedActiveVideo = true;
  video.pause();
  reel.classList.add("is-paused");
}

function scrollToPersona(persona) {
  const target = reels.find((reel) => reel.dataset.persona === persona);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  closeLayer(drawer);
}

function scrollToRoleFeed(role) {
  const target = [...feed.querySelectorAll(`.generated-reel[data-role-id="${role.id}"]`)][0] || reels.find((reel) => reel.dataset.persona === role.targetPersona);
  if (!target) {
    suppressRolePowerDuringJump = false;
    return;
  }
  suppressRolePowerDuringJump = true;
  target.scrollIntoView({ behavior: "auto", block: "start" });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      suppressRolePowerDuringJump = false;
    });
  });
  closeLayer(drawer);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

function getRole(roleId) {
  return roles.find((role) => role.id === roleId);
}

function getRoleName(role) {
  return customRoleNames[role.id] || role.name;
}

function getRoleAccent(role) {
  const accents = {
    amber: "#ffd166",
    cyan: "#29e6ff",
    green: "#80f2b5",
    pink: "#ff3b79",
    violet: "#a96cff"
  };

  return accents[role.accent] || accents.cyan;
}

function getSelectedRole() {
  return getRole(selectedRoleId) || roles[0];
}

function getRolePowerLabel(role) {
  return rolePowerLabels[role?.id] || getRoleName(role || {});
}

function getRoleDailyPowerState(roleId = selectedRoleId) {
  if (roleId === "coding") return codingDailyPowerState;

  const normalized = normalizeRoleDailyPowerState(roleDailyPowerStates[roleId]);
  roleDailyPowerStates[roleId] = normalized;
  return normalized;
}

function getRolePower(roleId = selectedRoleId) {
  const state = getRoleDailyPowerState(roleId);
  return Math.max(0, Math.min(100, Number(state.power ?? rolePowerScores[roleId] ?? defaultRolePowerScores[roleId] ?? 0)));
}

function getCodingVideoIndexForReel(reel) {
  const source = normalizeVideoKey(reel?.dataset.videoKey);
  return codingVideoOrder.indexOf(source);
}

function getRolePowerIndexForReel(reel, roleId = selectedRoleId) {
  if (roleId === "coding") {
    const codingVideoIndex = getCodingVideoIndexForReel(reel);
    if (codingVideoIndex >= 0) return codingVideoIndex;
    if (reel?.dataset.codingWeekly === "true") return codingPowerSteps.length - 1;
  }

  const rolePowerIndex = Number(reel?.dataset.rolePowerIndex);
  return Number.isInteger(rolePowerIndex) && rolePowerIndex >= 0 ? rolePowerIndex : -1;
}

function getRolePowerStepForReel(reel, role = getSelectedRole()) {
  const powerIndex = getRolePowerIndexForReel(reel, role?.id);
  return powerIndex >= 0 ? getCodingStep(powerIndex + 1) : getCodingStep(getRoleDailyPowerState(role?.id).viewedCount || 1);
}

function getCodingStepForReel(reel) {
  return getRolePowerStepForReel(reel, getRole("coding"));
}

function saveRolePowerScores() {
  localStorage.setItem("rolePowerScores", JSON.stringify(rolePowerScores));
}

function saveRoleDailyPowerStates() {
  localStorage.setItem(roleDailyPowerStorageKey, JSON.stringify(roleDailyPowerStates));
}

function saveCodingDailyPowerState() {
  roleDailyPowerStates.coding = codingDailyPowerState;
  saveRoleDailyPowerStates();
  localStorage.setItem(codingPowerStorageKey, JSON.stringify(codingDailyPowerState));
}

function saveRoleDailyPowerState(roleId = selectedRoleId) {
  if (roleId === "coding") {
    saveCodingDailyPowerState();
    return;
  }

  roleDailyPowerStates[roleId] = getRoleDailyPowerState(roleId);
  saveRoleDailyPowerStates();
}

function getRoleViewerCount(role, reel) {
  const pool = roleViewerPools[role?.id] || [role?.fellowCount || "0"];
  const index = Math.max(0, reels.indexOf(reel));
  return pool[index % pool.length];
}

function syncFeedCollections() {
  reels = [...document.querySelectorAll(".reel")];
  videos = [...feed.querySelectorAll("video")];
}

function createFeedReel(item, index, options = {}) {
  const reel = document.createElement("article");
  reel.className = `reel${index === 0 ? " is-active" : ""}${options.generated ? " generated-reel" : ""}`;
  reel.dataset.persona = item.persona || "normal";
  reel.dataset.videoType = item.videoType || "entertainment";
  if (item.roleId) reel.dataset.roleId = item.roleId;
  if (item.isRoleCore) reel.dataset.roleCore = "true";
  if (item.videoKey || item.source) reel.dataset.videoKey = normalizeVideoKey(item.videoKey || item.source);
  if (Number.isInteger(item.rolePowerIndex) && item.rolePowerIndex >= 0) reel.dataset.rolePowerIndex = String(item.rolePowerIndex);

  const fallbackClass = escapeHtml(item.fallbackClass || "");
  reel.innerHTML = `
    <video muted loop playsinline webkit-playsinline preload="metadata" src="${escapeHtml(videoPath(item.source))}"></video>
    <div class="video-fallback ${fallbackClass}"></div>
    <div class="shade"></div>
    <div class="copy">
      <p class="creator">${escapeHtml(item.creator)}</p>
      <p class="caption">${escapeHtml(item.caption)}</p>
      <p class="music-line">${escapeHtml(item.music || `♪ ${item.tag || "推荐"} · 普通推荐流`)}</p>
    </div>
    <div class="actions" aria-label="视频操作">
      <button class="avatar-action" aria-label="作者主页"><span class="avatar ${item.avatarClass || ""}">${escapeHtml(item.avatar || item.creator.replace("@", "").slice(0, 1))}</span><i>+</i></button>
      <button data-action="like"><strong>♥</strong><span>${escapeHtml(item.likes || `${index + 1}.${index + 4}w`)}</span></button>
      <button><strong>💬</strong><span>${escapeHtml(item.comments || String(860 + index * 317))}</span></button>
      <button><strong>★</strong><span>收藏</span></button>
      <button><strong>↗</strong><span>分享</span></button>
      <button class="disc-button" aria-label="音乐"><span></span></button>
    </div>
  `;

  return reel;
}

function createRoleWeeklyPanel(role) {
  const report = getWeeklyReportForRole(role);
  const metrics = report?.metrics?.slice(0, 3) || [];
  const roleName = getRoleName(role);
  const label = getRolePowerLabel(role);
  const viewerCount = roleViewerPools[role.id]?.[1] || roleViewerPools[role.id]?.[0] || role.fellowCount || "1.2k";
  const panel = document.createElement("section");
  panel.className = "coding-weekly-panel";
  panel.setAttribute("aria-label", `${roleName}周报预览`);

  panel.innerHTML = `
      <p class="coding-weekly-kicker">${escapeHtml(label)}洞察</p>
      <h2>${escapeHtml(report?.title || `${roleName} 深度画像`)}</h2>
      <div class="coding-weekly-rank">
        <span>${escapeHtml(report?.rarity || "A 级成长画像")}</span>
        <strong>${escapeHtml(report?.rank || "前 12.5%")}</strong>
      </div>
      <p>${escapeHtml(report?.summary || `你已经完成今日 ${label} 力量值冲刺。`)}</p>
      <div class="coding-weekly-metrics">
        ${metrics
          .map(
            (item) => `
              <div>
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.detail)}</strong>
              </div>
            `
          )
          .join("")}
      </div>
      <button type="button" data-open-role-weekly data-weekly-role-id="${escapeHtml(role.id)}">
        <span>查看完整日报</span>
        <i aria-hidden="true">›</i>
      </button>
      <div class="coding-weekly-watchers">
        <span class="viewer-avatars weekly-photo-avatars" aria-hidden="true"><i></i><i></i><i></i></span>
        <strong>${escapeHtml(viewerCount)} 位 ${escapeHtml(roleName)} 正在看</strong>
        <i aria-hidden="true">›</i>
      </div>
  `;

  panel.addEventListener("click", (event) => {
    const weeklyButton = event.target.closest("[data-open-role-weekly]");
    if (weeklyButton) {
      openWeeklyReportForRole(weeklyButton.dataset.weeklyRoleId || role.id);
    }
    event.stopPropagation();
  });

  return panel;
}

function createRoleWeeklyReel(role, index) {
  const label = getRolePowerLabel(role);
  const dailyTitle = role.id === "coding" ? "生成你的Coding日报" : `生成你的${label}日报`;
  const reel = document.createElement("article");
  reel.className = "reel generated-reel coding-weekly-reel role-weekly-reel";
  reel.dataset.persona = role.targetPersona || "normal";
  reel.dataset.videoType = "study";
  reel.dataset.roleId = role.id;
  reel.dataset.roleWeekly = "true";
  if (role.id === "coding") reel.dataset.codingWeekly = "true";

  reel.innerHTML = `
    <div class="coding-weekly-virtual-bg" aria-hidden="true">
      <span class="weekly-bg-grid"></span>
      <span class="weekly-bg-window weekly-bg-window-a"></span>
      <span class="weekly-bg-window weekly-bg-window-b"></span>
      <span class="weekly-bg-code-lines"></span>
      <span class="weekly-bg-desk"></span>
    </div>
    <div class="shade"></div>
    <div class="coding-weekly-stage-copy">
      <span>今日 ${escapeHtml(label)} 力量值已满</span>
      <strong>${escapeHtml(dailyTitle)}</strong>
    </div>
  `;
  reel.appendChild(createRoleWeeklyPanel(role));

  return reel;
}

function createCodingWeeklyPanel() {
  return createRoleWeeklyPanel(getRole("coding") || getSelectedRole());
}

function createCodingWeeklyReel(index) {
  return createRoleWeeklyReel(getRole("coding") || getSelectedRole(), index);
}

function renderFeedItems(items, options = {}) {
  feed.innerHTML = "";
  const fragment = document.createDocumentFragment();
  items.forEach((item, index) => fragment.appendChild(createFeedReel(item, index, options)));
  feed.appendChild(fragment);
  syncFeedCollections();
  activeIndex = 0;
  userPausedActiveVideo = false;
  bindFeedItems();
  updateIdentityOverlays();
  reels[0]?.scrollIntoView({ behavior: options.smooth ? "smooth" : "auto", block: "start" });
  playActiveVideo();
}

function renderInitialRecommendFeed() {
  renderFeedItems(initialRecommendVideos);
}

function ensureIdentityOverlays() {
  reels.forEach((reel) => {
    if (!reel.querySelector(".power-overlay")) {
      const powerOverlay = document.createElement("div");
      powerOverlay.className = "power-overlay";
      powerOverlay.innerHTML = `
        <div class="power-overlay-row">
          <span class="power-icon" aria-hidden="true">⚡</span>
          <span class="power-copy"></span>
          <strong class="power-value"></strong>
          <span class="power-chevron" aria-hidden="true">›</span>
        </div>
        <span class="power-track"><i></i></span>
      `;
      reel.appendChild(powerOverlay);
    }

    if (!reel.querySelector(".badge-overlay")) {
      const badgeOverlay = document.createElement("div");
      badgeOverlay.className = "badge-overlay";
      badgeOverlay.innerHTML = `
        <span class="badge-sparkles" aria-hidden="true"></span>
        <span class="badge-icon" aria-hidden="true"><i></i></span>
        <div class="badge-copy">
          <span class="badge-label"></span>
          <strong class="badge-name"></strong>
          <span class="badge-subtitle"></span>
        </div>
      `;
      reel.appendChild(badgeOverlay);
    }

    if (!reel.querySelector(".viewer-overlay")) {
      const viewerOverlay = document.createElement("div");
      viewerOverlay.className = "viewer-overlay";
      viewerOverlay.innerHTML = `
        <span class="viewer-avatars" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="viewer-copy"></span>
        <span class="viewer-chevron" aria-hidden="true">›</span>
      `;
      reel.appendChild(viewerOverlay);
    }
  });
}

function updateIdentityOverlay(reel) {
  const role = getSelectedRole();
  if (!role || !reel) return;

  const label = getRolePowerLabel(role);
  const isStudyVideo = reel.dataset.videoType === "study";
  const showIdentityUi = isCocoonPageActive();
  const isRoleWeeklyReel = reel.dataset.roleWeekly === "true";
  const powerOverlay = reel.querySelector(".power-overlay");
  const badgeOverlay = reel.querySelector(".badge-overlay");
  const viewerOverlay = reel.querySelector(".viewer-overlay");
  const roleStep = getRolePowerStepForReel(reel, role);
  const power = roleStep?.power ?? getRolePower(role.id);

  if (powerOverlay) {
    const powerCopy = `本日${label}力量值`;
    powerOverlay.hidden = !showIdentityUi || isRoleWeeklyReel;
    powerOverlay.classList.toggle("is-study", isStudyVideo);
    powerOverlay.querySelector(".power-copy").textContent = powerCopy;
    powerOverlay.querySelector(".power-value").textContent = `${power}%`;
    powerOverlay.setAttribute("aria-label", `${powerCopy} ${power}%`);
    powerOverlay.querySelector(".power-track i").style.width = `${power}%`;
  }

  if (badgeOverlay) {
    if (!badgeOverlay.classList.contains("is-unlocking")) {
      badgeOverlay.hidden = true;
    }
  }

  if (viewerOverlay) {
    viewerOverlay.hidden = !showIdentityUi || isRoleWeeklyReel;
    const roleName = getRoleName(role);
    viewerOverlay.querySelector(".viewer-copy").textContent = `${getRoleViewerCount(role, reel)} 位 ${roleName} 正在看`;
  }
}

function updateIdentityOverlays() {
  ensureIdentityOverlays();
  document.body.classList.toggle("persona-mode", isCocoonPageActive());
  reels.forEach(updateIdentityOverlay);
  updatePersonaModeControls();
}

function updatePersonaModeControls() {
  if (!enableActiveRoleButton) return;

  enableActiveRoleButton.textContent = "开启今日人设";
  enableActiveRoleButton.classList.remove("is-exit-mode");
  enableActiveRoleButton.disabled = false;
}

function roleMatchesReel(role, reel) {
  if (!role || !reel) return false;
  if (reel.dataset.roleId) return reel.dataset.roleId === role.id;
  return reel.dataset.persona === role.targetPersona;
}

function increaseRolePowerForReel(reel) {
  const role = getSelectedRole();
  if (!isCocoonPageActive() || !roleMatchesReel(role, reel)) return;

  increaseDailyPowerForReel(reel, role);
}

function getCodingStep(count) {
  return codingPowerSteps.filter((step) => count >= step.count).slice(-1)[0] || codingPowerSteps[0];
}

function resetRoleDailyPowerState(roleId = selectedRoleId) {
  const defaultState = createDefaultRoleDailyPowerState();

  if (roleId === "coding") {
    codingDailyPowerState = defaultState;
    codingFeedCycleCount = 0;
  } else {
    roleDailyPowerStates[roleId] = defaultState;
  }

  rolePowerScores[roleId] = defaultState.power;
  saveRoleDailyPowerState(roleId);
  saveRolePowerScores();

  const role = getRole(roleId);
  const scoreTarget = scores[role?.targetPersona];
  if (scoreTarget) scoreTarget.textContent = String(defaultState.power);
}

function resetCodingDailyPowerState() {
  resetRoleDailyPowerState("coding");
}

function increaseDailyPowerForReel(reel, role) {
  if (!role) return;

  const powerIndex = getRolePowerIndexForReel(reel, role.id);
  const state = getRoleDailyPowerState(role.id);
  if (powerIndex < 0 || state.viewedIndices.includes(powerIndex)) return;

  state.viewedIndices.push(powerIndex);
  state.viewedIndices.sort((a, b) => a - b);
  state.viewedCount = Math.max(state.viewedIndices.length, powerIndex + 1);
  const step = getRolePowerStepForReel(reel, role);
  const previousPower = getRolePower(role.id);
  const previousBadge = state.badge;

  state.power = step.power;
  state.badge = step.persistBadge ? step.badge : "";
  if (role.id === "coding") codingDailyPowerState = state;
  roleDailyPowerStates[role.id] = state;
  rolePowerScores[role.id] = step.power;
  saveRoleDailyPowerState(role.id);
  saveRolePowerScores();

  const scoreTarget = scores[role.targetPersona];
  if (scoreTarget) scoreTarget.textContent = String(step.power);

  updateIdentityOverlays();

  if (step.power !== previousPower || step.badge || state.badge !== previousBadge) {
    triggerPowerFeedback(reel, step.power - previousPower, step.power >= 100, role, step.badge, step.persistBadge);
  }
}

function increaseCodingPowerForReel(reel, role) {
  increaseDailyPowerForReel(reel, role || getRole("coding"));
}

function triggerPowerFeedback(reel, gain, reachedMax, role, badgeName = "", persistBadge = false) {
  const powerOverlay = reel.querySelector(".power-overlay");
  if (powerOverlay) {
    powerOverlay.classList.remove("is-flashing");
    void powerOverlay.offsetWidth;
    powerOverlay.classList.add("is-flashing");
    window.clearTimeout(powerOverlay.feedbackTimer);
    powerOverlay.feedbackTimer = window.setTimeout(() => {
      powerOverlay.classList.remove("is-flashing");
    }, 1000);
  }

  flashBadgeOverlay(reel, badgeName, persistBadge, role);

  if (role.id !== "coding") {
    spawnRoleParticles(reel, role);
  }

  if (role.id !== "coding" && (badgeName || reachedMax)) {
    triggerRoleReward(reel, role, badgeName);
  }
}

function flashBadgeOverlay(reel, badgeName, persistBadge = false, role = getSelectedRole()) {
  const badgeOverlay = reel.querySelector(".badge-overlay");
  if (!badgeName || !badgeOverlay) return;

  const step = getRolePowerStepForReel(reel, role);
  const power = step?.power || getRolePower(role?.id);
  const badgeTier = power >= 100 ? "master" : power >= 70 ? "progress" : "starter";
  const label = badgeTier === "master" ? "满级徽章：" : "已解锁徽章：";
  const powerLabel = getRolePowerLabel(role);

  badgeOverlay.hidden = false;
  badgeOverlay.dataset.badge = badgeName;
  badgeOverlay.dataset.badgeTier = badgeTier;
  badgeOverlay.dataset.power = power;
  badgeOverlay.querySelector(".badge-icon i").dataset.power = power;
  badgeOverlay.querySelector(".badge-label").textContent = label;
  badgeOverlay.querySelector(".badge-name").textContent = badgeName;
  badgeOverlay.querySelector(".badge-subtitle").textContent = `${powerLabel} 力量值达到 ${power}%`;
  badgeOverlay.classList.remove("is-unlocking");
  void badgeOverlay.offsetWidth;
  badgeOverlay.classList.add("is-unlocking");

  window.clearTimeout(badgeOverlay.flashTimer);
  badgeOverlay.flashTimer = window.setTimeout(() => {
    badgeOverlay.classList.remove("is-unlocking");
    badgeOverlay.hidden = true;
  }, 1700);
}

function spawnRoleParticles(reel, role) {
  const particleLayer = document.createElement("div");
  particleLayer.className = `role-particles ${role?.id === "coding" ? "coding-particles" : ""}`;
  particleLayer.innerHTML = Array.from({ length: 12 }, (_, index) => `<span style="--particle-index: ${index}"></span>`).join("");
  reel.appendChild(particleLayer);
  window.setTimeout(() => particleLayer.remove(), 1200);
}

function triggerRoleReward(reel, role, badgeName = "") {
  if (reel.querySelector(".role-reward")) return;

  const reward = document.createElement("div");
  reward.className = "role-reward";
  reward.textContent = badgeName ? `徽章解锁：${badgeName}` : `${getRoleName(role)} 徽章解锁`;
  reel.appendChild(reward);
  window.setTimeout(() => reward.remove(), 1800);
}

function getRoleVideoSource(role) {
  const fallbacks = {
    coding: "雷神aicode.mp4",
    exam: "学习.mp4",
    reader: "小说2.mp4",
    fitness: "今天练练练.mp4",
    foodie: "美食.mp4",
    founder: "https://media.w3.org/2010/05/video/movie_300.mp4",
    creator: "实验室研究生.mp4",
    finance: "基因gogogo.mp4",
    language: "bella学英语.mp4"
  };

  return fallbacks[role?.id] || role?.previewVideo || "剧目.mp4";
}

function getFallbackClass(role) {
  const map = {
    coding: "coder",
    exam: "reader",
    reader: "reader",
    founder: "founder",
    finance: "founder",
    language: "reader"
  };

  return map[role?.id] || "";
}

function getRecommendedVideoType(role) {
  return ["foodie", "creator"].includes(role?.id) ? "entertainment" : "study";
}

function getRoleRecommendationTitles(role) {
  const roleName = getRoleName(role);
  const samples = role.samples?.length ? role.samples : [`${roleName} 今日必刷`, `${roleName} 入门路线`, `${roleName} 复盘清单`];
  return samples.slice(0, 4);
}

function createRecommendedReel(role, title, index) {
  const roleName = getRoleName(role);
  const pool = roleVideoPools[role.id] || [];
  const poolItem = pool[index % Math.max(1, pool.length)];
  return createFeedReel(
    {
      source: poolItem?.source || getRoleVideoSource(role),
      videoKey: poolItem?.source || getRoleVideoSource(role),
      fallbackClass: getFallbackClass(role),
      persona: role.targetPersona || "normal",
      videoType: poolItem?.isRoleCore === false ? "study" : getRecommendedVideoType(role),
      roleId: role.id,
      rolePowerIndex: index,
      isRoleCore: poolItem?.isRoleCore ?? role.id === "coding",
      creator: poolItem?.creator || `@${roleName}频道 ${String(index + 1).padStart(2, "0")}`,
      caption: poolItem?.caption || `${title}。这一条会优先推荐给选择「${roleName}」的人。`,
      music: `♪ 破茧 · ${poolItem?.tag || role.tags?.[index % Math.max(1, role.tags.length)] || roleName} · 同频推荐`,
      avatar: roleName.slice(0, 1),
      avatarClass: role.targetPersona === "coder" ? "coder-avatar" : role.targetPersona === "reader" ? "reader-avatar" : role.targetPersona === "founder" ? "founder-avatar" : "",
      likes: `${index + 1}.${index + 2}w`,
      comments: String(860 + index * 317)
    },
    index,
    { generated: true }
  );
}

function bindVideo(video) {
  if (boundVideos.has(video)) return;
  boundVideos.add(video);

  video.addEventListener("loadeddata", () => {
    video.closest(".reel").classList.add("video-ready");
  });
  video.addEventListener("error", () => {
    video.closest(".reel").classList.remove("video-ready");
  });
}

function bindReel(reel) {
  if (boundReels.has(reel)) return;
  boundReels.add(reel);

  reel.addEventListener("click", (event) => {
    if (event.target.closest(".power-overlay")) return;

    const weeklyButton = event.target.closest("[data-open-role-weekly], [data-open-coding-weekly]");
    if (weeklyButton) {
      openWeeklyReportForRole(weeklyButton.dataset.weeklyRoleId || reel.dataset.roleId || selectedRoleId);
      return;
    }

    const personaButton = event.target.closest(".open-persona-button");
    if (personaButton) {
      openPersonaDrawer();
      return;
    }

    const likeButton = event.target.closest("[data-action='like']");
    if (likeButton) {
      likeButton.classList.toggle("liked");
      return;
    }

    if (event.target.closest("button, a, input, textarea, select")) return;
    toggleActiveVideoPlayback(reel);
  });
}

function observeReel(reel) {
  if (!observer || observedReels.has(reel)) return;
  observedReels.add(reel);
  observer.observe(reel);
}

function bindFeedItems() {
  syncFeedCollections();
  reels.forEach((reel) => {
    bindReel(reel);
    observeReel(reel);
  });
  videos.forEach(bindVideo);
}

function startPowerOverlayDrag(event) {
  const overlay = event.target.closest(".power-overlay");
  if (!overlay || overlay.hidden || !personaModeEnabled) return;

  const reel = overlay.closest(".reel");
  const reelRect = reel.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();
  powerDragState = {
    overlay,
    reelRect,
    offsetX: event.clientX - overlayRect.left,
    offsetY: event.clientY - overlayRect.top
  };

  overlay.classList.add("is-dragging");
  overlay.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function movePowerOverlay(event) {
  if (!powerDragState) return;

  const { overlay, reelRect, offsetX, offsetY } = powerDragState;
  const maxLeft = reelRect.width - overlay.offsetWidth - 10;
  const maxTop = reelRect.height - overlay.offsetHeight - 86;
  const left = Math.max(10, Math.min(maxLeft, event.clientX - reelRect.left - offsetX));
  const top = Math.max(78, Math.min(maxTop, event.clientY - reelRect.top - offsetY));

  overlay.style.left = `${left}px`;
  overlay.style.top = `${top}px`;
  overlay.style.right = "auto";
}

function stopPowerOverlayDrag() {
  if (!powerDragState) return;
  powerDragState.overlay.classList.remove("is-dragging");
  powerDragState = null;
}

function renderRecommendedReels(role) {
  const titles = getRoleRecommendationTitles(role);
  const poolLength = Math.max(codingPowerSteps.length, roleVideoPools[role.id]?.length || titles.length);
  const reelsToRender = Array.from({ length: poolLength }, (_, index) => createRecommendedReel(role, titles[index % titles.length], index));

  feed.innerHTML = "";
  if (role.id === "coding") {
    codingFeedCycleCount = 1;
  }
  const fragment = document.createDocumentFragment();
  reelsToRender.forEach((reel, index) => {
    reel.classList.toggle("is-active", index === 0);
    fragment.appendChild(reel);
  });
  feed.appendChild(fragment);
  syncFeedCollections();
  activeIndex = 0;
  bindFeedItems();
  updateIdentityOverlays();
  playActiveVideo();
}

function appendRoleVideoCycle(role) {
  if (!isCocoonPageActive() || !role) return;

  if (getRolePower(role.id) < 100 || feed.querySelector(`.role-weekly-reel[data-role-id="${role.id}"]`)) return;
  const weeklyReel = createRoleWeeklyReel(role, reels.length);
  feed.appendChild(weeklyReel);
  bindFeedItems();
  updateIdentityOverlays();
}

function getVisibleRoles() {
  const term = roleSearchTerm.trim().toLowerCase();
  const drawerRoles = roles.filter((role) => drawerRoleIds.has(role.id));
  if (!term) return drawerRoles;

  return drawerRoles.filter((role) => {
    const searchable = [
      getRoleName(role),
      role.signature,
      role.fellowCount,
      ...role.tags,
      ...role.samples
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(term);
  });
}

function getRolePreviewSources(role) {
  return rolePreviewVideoSources[role.id] || role.previewVideo || getRoleVideoSource(role);
}

function getRolePreviewPlaylist(role) {
  if (!role) return [];

  if (role.id === "coding") {
    return roleVideoPools.coding.slice(0, 5).map((item) => ({
      source: item.source,
      title: item.creator,
      subtitle: item.tag
    }));
  }

  const source = getRolePreviewSources(role);
  const baseTitle = getRoleName(role);
  const subtitles = role.samples?.slice(0, 3) || [];

  return Array.from({ length: 3 }, (_, index) => ({
    source,
    title: `${baseTitle} 预览 ${index + 1}`,
    subtitle: subtitles[index] || role.signature
  }));
}

function renderRoleCards() {
  if (!roleCarousel || roles.length === 0) return;

  const visibleRoles = getVisibleRoles();

  if (visibleRoles.length === 0) {
    roleCarousel.innerHTML = `
      <div class="role-empty">
        <strong>没有匹配身份</strong>
        <span>换个关键词试试，比如 Coding、考研、阅读。</span>
      </div>
    `;
    if (roleDots) roleDots.innerHTML = "";
    if (enableActiveRoleButton) enableActiveRoleButton.disabled = !personaModeEnabled;
    if (previewActiveRoleButton) previewActiveRoleButton.disabled = true;
    updatePersonaModeControls();
    return;
  }

  if (enableActiveRoleButton) enableActiveRoleButton.disabled = false;
  if (previewActiveRoleButton) previewActiveRoleButton.disabled = false;

  if (!visibleRoles.some((role) => role.id === activeRoleId && !role.disabled)) {
    activeRoleId = visibleRoles.find((role) => !role.disabled)?.id || visibleRoles[0].id;
  }

  roleCarousel.innerHTML = visibleRoles
    .map((role) => {
      const roleName = escapeHtml(getRoleName(role));
      const signature = escapeHtml(role.signature);
      const previewTag = escapeHtml(role.tags[0] || "身份");
      const activeFellows = escapeHtml(roleViewerPools[role.id]?.[0] || role.fellowCount);
      const previewVideo = escapeHtml(getRolePreviewSources(role));
      const disabled = Boolean(role.disabled);

      return `
        <article class="role-card${disabled ? " is-disabled" : ""}" data-role-id="${role.id}"${disabled ? ' data-role-disabled="true"' : ""} style="--role-accent: ${getRoleAccent(role)}">
          <button class="role-card-menu" type="button" data-role-more aria-label="更多操作">...</button>
          <span class="role-current-badge">${disabled ? "暂不可选" : "已启用"}</span>
          <div class="role-copy">
            <div class="role-name-row">
              <h3>${roleName}</h3>
              <button class="role-edit" type="button" data-role-edit aria-label="编辑角色标签">✎</button>
            </div>
            <p>${signature}</p>
          </div>
          <div class="role-media">
            <video class="role-preview-video" muted autoplay loop playsinline webkit-playsinline preload="metadata" src="${escapeHtml(videoPath(previewVideo))}"></video>
            <div class="role-media-fallback"></div>
            <button class="role-play-dot" type="button" data-role-video aria-label="暂停或继续预览视频">Ⅱ</button>
            <span class="role-silent-badge">${previewTag} · 静音预览</span>
          </div>
          <div class="role-fellows">
            <span class="role-avatars" aria-hidden="true"><i></i><i></i><i></i></span>
            <strong>${activeFellows}</strong> 位同行者正在刷
          </div>
        </article>
      `;
    })
    .join("");

  if (roleDots) {
    roleDots.innerHTML = visibleRoles.map((role) => `<span data-role-dot="${role.id}"></span>`).join("");
  }

  roleCarousel.querySelectorAll("video").forEach((video) => {
    video.addEventListener("timeupdate", () => {
      if (video.currentTime >= 3) {
        video.currentTime = 0;
      }
    });
  });

  updateRoleCardState();
}

function updateRoleCardState() {
  if (!roleCarousel) return;

  roleCarousel.querySelectorAll(".role-card").forEach((card) => {
    card.classList.toggle("is-current", card.dataset.roleId === selectedRoleId);
    card.classList.toggle("is-centered", card.dataset.roleId === activeRoleId);
    card.classList.toggle("is-disabled", card.dataset.roleDisabled === "true");
  });

  roleDots?.querySelectorAll("[data-role-dot]").forEach((dot) => {
    dot.classList.toggle("is-active", dot.dataset.roleDot === activeRoleId);
  });

  const role = getRole(activeRoleId);
  if (roleCooldown && role) {
    roleCooldown.textContent = drawerCooldownCopy;
  }
}

function setActiveRole(roleId, options = {}) {
  if (!getRole(roleId)) return;

  activeRoleId = roleId;
  updateRoleCardState();

  if (options.scroll && roleCarousel) {
    const card = roleCarousel.querySelector(`[data-role-id="${roleId}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
}

function updateActiveRoleFromScroll() {
  if (!roleCarousel) return;

  const carouselCenter = roleCarousel.getBoundingClientRect().left + roleCarousel.clientWidth / 2;
  const centeredCard = [...roleCarousel.querySelectorAll(".role-card")]
    .map((card) => ({
      card,
      distance: Math.abs(card.getBoundingClientRect().left + card.clientWidth / 2 - carouselCenter)
    }))
    .sort((a, b) => a.distance - b.distance)[0]?.card;

  if (centeredCard && centeredCard.dataset.roleId !== activeRoleId && centeredCard.dataset.roleDisabled !== "true") {
    activeRoleId = centeredCard.dataset.roleId;
    updateRoleCardState();
  }
}

function showRoleEditor(roleId = activeRoleId) {
  const role = getRole(roleId);
  if (!role || !roleEditor) return;

  setActiveRole(role.id, { scroll: true });
  roleEditor.hidden = false;
  customRoleName.value = getRoleName(role);
  customRoleName.focus();
  customRoleName.select();
}

function saveCustomRoleName() {
  const role = getRole(activeRoleId);
  if (!role) return;

  const name = customRoleName.value.trim();
  if (name) {
    customRoleNames[role.id] = name;
  } else {
    delete customRoleNames[role.id];
  }

  localStorage.setItem("customRoleNames", JSON.stringify(customRoleNames));
  roleEditor.hidden = true;
  renderRoleCards();
  setActiveRole(role.id, { scroll: true });
  showRoleToast("标签已更新");
}

function showRolePreview(roleId = activeRoleId) {
  const role = getRole(roleId);
  if (!role || !rolePreviewPanel) return;

  setActiveRole(role.id, { scroll: true });
  rolePreviewPanel.hidden = false;
  const playlist = getRolePreviewPlaylist(role);
  rolePreviewPanel.innerHTML = `
    <div class="role-preview-head">
      <strong>${escapeHtml(getRoleName(role))} 示例内容流</strong>
      <button type="button" data-close-preview aria-label="关闭预览">×</button>
    </div>
    <div class="role-preview-list">
      ${playlist
        .map(
          (item) => `
            <div class="role-preview-item">
              <video muted autoplay loop playsinline webkit-playsinline preload="metadata" src="${escapeHtml(videoPath(item.source))}"></video>
              <div class="role-preview-meta">
                <strong>${escapeHtml(item.title)}</strong>
                <span>${escapeHtml(item.subtitle || "静音预览")}</span>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function hideRoleOverlays() {
  if (roleEditor) roleEditor.hidden = true;
  if (roleMenu) roleMenu.hidden = true;
  if (rolePreviewPanel) rolePreviewPanel.hidden = true;
  roleMenuButton?.setAttribute("aria-expanded", "false");
}

function showRoleToast(message) {
  if (!roleToast) return;

  roleToast.textContent = message;
  window.clearTimeout(showRoleToast.timer);
  showRoleToast.timer = window.setTimeout(() => {
    roleToast.textContent = "";
  }, 1800);
}

function playRolePreviewVideos() {
  roleCarousel?.querySelectorAll("video").forEach((video) => {
    video.muted = true;
    video.closest(".role-media")?.classList.remove("is-paused");
    const toggle = video.closest(".role-media")?.querySelector("[data-role-video]");
    if (toggle) toggle.textContent = "Ⅱ";
    video.play().catch(() => {});
  });
}

function pauseRolePreviewVideos() {
  roleCarousel?.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.closest(".role-media")?.classList.add("is-paused");
    const toggle = video.closest(".role-media")?.querySelector("[data-role-video]");
    if (toggle) toggle.textContent = "▶";
  });
}

function toggleRoleCardVideo(card) {
  const media = card.querySelector(".role-media");
  const previewVideos = [...card.querySelectorAll("video")];
  if (!media || previewVideos.length === 0) return;

  if (previewVideos.some((video) => video.paused)) {
    media.classList.remove("is-paused");
    const toggle = media.querySelector("[data-role-video]");
    if (toggle) toggle.textContent = "Ⅱ";
    previewVideos.forEach((video) => video.play().catch(() => {}));
    return;
  }

  previewVideos.forEach((video) => video.pause());
  media.classList.add("is-paused");
  const toggle = media.querySelector("[data-role-video]");
  if (toggle) toggle.textContent = "▶";
}

function enableRole(roleId = activeRoleId) {
  const role = getRole(roleId);
  if (!role || role.disabled || !isDrawerSelectableRole(role.id)) return;

  selectedRoleId = role.id;
  localStorage.setItem("selectedRoleId", selectedRoleId);
  personaModeEnabled = true;
  userSettings.identityTagEnabled = true;
  resetRoleDailyPowerState(role.id);
  sessionStorage.setItem("personaModeEnabled", "1");
  setActiveRole(role.id, { scroll: true });
  suppressRolePowerDuringJump = true;
  renderRecommendedReels(role);
  updateIdentityOverlays();
  navigateToCocoonPage();
  scrollToRoleFeed(role);
}

function exitPersonaMode() {
  personaModeEnabled = false;
  userSettings.identityTagEnabled = false;
  switchFeedPage("recommend");
  sessionStorage.removeItem("personaModeEnabled");
  renderInitialRecommendFeed();
  closeLayer(drawer);
}

function toggleRoleMenu(forceOpen) {
  if (!roleMenu) return;

  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : roleMenu.hidden;
  roleMenu.hidden = !shouldOpen;
  roleMenuButton?.setAttribute("aria-expanded", String(shouldOpen));
}

function shareRole(roleId = activeRoleId) {
  const role = getRole(roleId);
  if (!role) return;

  const text = `我正在启用「${getRoleName(role)}」：${role.signature}。${role.fellowCount} 位同行者正在刷。`;

  if (navigator.share) {
    navigator.share({ title: "破茧平行人生角色卡", text }).catch(() => {});
    return;
  }

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(
      () => showRoleToast("角色卡片文案已复制"),
      () => showRoleToast(text)
    );
    return;
  }

  showRoleToast(text);
}

function renderWeeklyReport(index = weeklyReportIndex) {
  if (!weeklyBody || weeklyReports.length === 0) return;

  weeklyReportIndex = ((index % weeklyReports.length) + weeklyReports.length) % weeklyReports.length;
  activeWeeklyReport = weeklyReports[weeklyReportIndex];
  const role = getRole(activeWeeklyReport.roleId);
  const roleName = role ? getRoleName(role) : activeWeeklyReport.title;
  const topMetrics = activeWeeklyReport.metrics.slice(0, 3);
  const strongestMetric = activeWeeklyReport.metrics[0];
  const rankValue = activeWeeklyReport.rank.replace(/^前\s*/, "");
  const suggestionTags = [
    `继续关注 ${roleName}`,
    role?.tags?.[0] || strongestMetric?.label || "高强度吸收",
    activeWeeklyReport.metrics[3]?.label || "项目复现"
  ];

  if (weeklyTitle) {
    weeklyTitle.textContent = `${roleName}日报生成`;
  }

  weeklyBody.innerHTML = `
    <section class="weekly-result-card weekly-tech-report">
      <div class="weekly-result-mark" aria-hidden="true">
        <span>TOP</span>
        <strong>${escapeHtml(rankValue)}</strong>
        <em>${escapeHtml(activeWeeklyReport.rarity)}</em>
      </div>
      <strong class="weekly-result-name">${escapeHtml(activeWeeklyReport.title)}</strong>
      <p class="weekly-result-summary">${escapeHtml(activeWeeklyReport.summary)}</p>

      <div class="weekly-insight-grid" aria-label="日报核心洞察">
        <article>
          <span class="weekly-insight-icon weekly-insight-code" aria-hidden="true"></span>
          <strong>偏好方向</strong>
          <div>
            ${topMetrics.map((item) => `<b>${escapeHtml(item.label)}</b>`).join("")}
          </div>
        </article>
        <article>
          <span class="weekly-insight-icon weekly-insight-brain" aria-hidden="true"></span>
          <strong>学习状态</strong>
          <div>
            <b>${escapeHtml(strongestMetric?.detail || "高强度吸收")}</b>
            <b>${escapeHtml(activeWeeklyReport.metrics[1]?.detail || "适合继续刷实战案例")}</b>
          </div>
        </article>
        <article>
          <span class="weekly-insight-icon weekly-insight-spark" aria-hidden="true"></span>
          <strong>推荐建议</strong>
          <div>
            ${suggestionTags.map((item) => `<b>${escapeHtml(item)}</b>`).join("")}
          </div>
        </article>
      </div>
    </section>

    <section class="weekly-role-link">
      <span>下一步内容流</span>
      <strong>${escapeHtml(roleName)}</strong>
      <small>下一次打开破茧时，系统会优先把你带入 ${escapeHtml(activeWeeklyReport.title)} 的内容流。</small>
    </section>

    <section class="weekly-chart" aria-label="本周观看结构">
      <div class="weekly-section-head">
        <strong>兴趣结构</strong>
        <span>${escapeHtml(strongestMetric?.label || "本周画像")} 最强</span>
      </div>
      ${activeWeeklyReport.metrics
        .map(
          (item) => `
            <div class="weekly-bar-row">
              <span>${escapeHtml(item.label)}</span>
              <i style="--bar: ${item.value}%"></i>
              <b>${escapeHtml(item.detail)}</b>
            </div>
          `
        )
        .join("")}
    </section>

    <section class="weekly-evidence" aria-label="周报证据">
      <div class="weekly-section-head">
        <strong>判定依据</strong>
        <span>来自本周观看、收藏和完播行为</span>
      </div>
      ${activeWeeklyReport.evidence.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
    </section>
  `;
}

function openWeeklyReport() {
  renderWeeklyReport(weeklyReportIndex);
  openLayer(weeklyModal);
}

function openWeeklyReportForRole(roleId = selectedRoleId) {
  setWeeklyReportForRole(roleId);
  openWeeklyReport();
}

function startWeeklyPersona() {
  const report = activeWeeklyReport || weeklyReports[weeklyReportIndex];
  if (!report) return;

  closeLayer(weeklyModal);

  const role = getRole(report.roleId);
  if (role) {
    enableRole(role.id);
    return;
  }

  scrollToPersona(report.persona);
}

function renderCommunityMessage(author, text, isMine = false) {
  return `
    <div class="community-message ${isMine ? "is-mine" : ""}">
      <strong>${escapeHtml(author)}</strong>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

function openPortraitCommunityPanel() {
  const report = activeWeeklyReport || weeklyReports[weeklyReportIndex];
  const persona = report?.persona || "normal";
  const community = portraitCommunities[persona] || portraitCommunities.normal;

  closeLayer(weeklyModal);

  if (communityTitle) {
    communityTitle.textContent = community.name;
  }

  if (communityMeta) {
    communityMeta.textContent = `${community.online} · ${report?.title || "相同画像"} 标签`;
  }

  if (communityVideos) {
    communityVideos.innerHTML = `
      <div class="community-section-title">
        <strong>同画像高点击内容</strong>
        <span>按完播和收藏排序</span>
      </div>
      <div class="community-video-list">
        ${community.hotVideos
          .map(
            (video) => `
              <button class="community-video-card" type="button">
                <img src="${escapeHtml(video.image)}" alt="" loading="lazy" />
                <i>▶</i>
                <span>${escapeHtml(video.rate)}</span>
                <strong>${escapeHtml(video.title)}</strong>
                <small>${escapeHtml(video.reason)}</small>
              </button>
            `
          )
          .join("")}
      </div>
    `;
  }

  if (communityNews) {
    communityNews.innerHTML = community.events
      .map(
        (item) => `
          <article class="community-news-card">
            <span>${escapeHtml(item.type)}</span>
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.meta)}</small>
          </article>
        `
      )
      .join("");
  }

  if (communityMembers) {
    communityMembers.innerHTML = community.members.map((name) => `<span>${escapeHtml(name)}</span>`).join("");
  }

  if (communityChat) {
    communityChat.innerHTML = community.messages.map(([author, text]) => renderCommunityMessage(author, text)).join("");
  }

  openLayer(communityModal);
  communityMessage?.focus();
}

function createRoleFromWeeklyReport(report, options = {}) {
  const baseRole = getRole(report.roleId);
  const metrics = report.metrics.map((item) => item.label).slice(0, 3);
  const isPublic = options.visibility === "public";

  return {
    id: `${isPublic ? "public-weekly" : "weekly"}-${report.roleId}`,
    targetPersona: report.persona,
    name: report.title,
    signature: report.rarity,
    fellowCount: report.rank.replace("前 ", ""),
    status: isPublic ? "公开标签" : "周报身份",
    visibility: isPublic ? "public" : "private",
    cooldown: isPublic ? "这个周报身份已公开，其他同标签用户可以看到你的画像入口。" : "已保存为常用身份，可在破茧身份选择中再次启用。",
    accent: baseRole?.accent || "cyan",
    previewVideo: baseRole?.previewVideo || "https://media.w3.org/2010/05/sintel/trailer.mp4",
    tags: isPublic ? ["公开标签", ...metrics].slice(0, 3) : metrics.length > 0 ? metrics : ["周报身份", "常用", "推荐流"],
    samples: isPublic ? ["这个身份标签已公开，其他人可以查看。", ...report.evidence] : report.evidence
  };
}

function saveWeeklyIdentity() {
  const report = activeWeeklyReport || weeklyReports[weeklyReportIndex];
  if (!report) return;

  const weeklyRole = createRoleFromWeeklyReport(report);
  const savedRoles = readSavedWeeklyRoles().filter((role) => role.id !== weeklyRole.id);
  savedRoles.unshift(weeklyRole);
  writeSavedWeeklyRoles(savedRoles);

  const roleIndex = roles.findIndex((role) => role.id === weeklyRole.id);
  if (roleIndex >= 0) {
    roles[roleIndex] = weeklyRole;
  } else {
    roles.unshift(weeklyRole);
  }

  selectedRoleId = weeklyRole.id;
  activeRoleId = weeklyRole.id;
  localStorage.setItem("selectedRoleId", selectedRoleId);
  renderRoleCards();
  closeLayer(weeklyModal);
  showRoleToast("已保存为常用身份");
}

function publishWeeklyIdentity() {
  const report = activeWeeklyReport || weeklyReports[weeklyReportIndex];
  if (!report) return;

  const publicRole = createRoleFromWeeklyReport(report, { visibility: "public" });
  const publicRoles = readPublicWeeklyRoles().filter((role) => role.id !== publicRole.id);
  publicRoles.unshift(publicRole);
  writePublicWeeklyRoles(publicRoles);

  const roleIndex = roles.findIndex((role) => role.id === publicRole.id);
  if (roleIndex >= 0) {
    roles[roleIndex] = publicRole;
  } else {
    roles.unshift(publicRole);
  }

  selectedRoleId = publicRole.id;
  activeRoleId = publicRole.id;
  localStorage.setItem("selectedRoleId", selectedRoleId);
  renderRoleCards();
  setActiveRole(publicRole.id, { scroll: true });
  closeLayer(weeklyModal);
  showRoleToast("身份标签已公开");
}

function updateActiveReel(entries) {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  activeIndex = reels.indexOf(visible.target);
  viewedReels.add(visible.target);
  reels.forEach((reel, index) => reel.classList.toggle("is-active", index === activeIndex));
  userPausedActiveVideo = false;
  if (!suppressRolePowerDuringJump) {
    increaseRolePowerForReel(visible.target);
  }
  updateIdentityOverlays();
  playActiveVideo();
  maybeOpenRolePrompt();

  if (isCocoonPageActive() && activeIndex >= reels.length - 2) {
    appendRoleVideoCycle(getSelectedRole());
  }

  const persona = visible.target.dataset.persona;
  if (persona === "coder" && getSelectedRole()?.id === "coding" && isCocoonPageActive()) {
    if (scores.coder) {
      scores.coder.textContent = String(getRolePower("coding"));
    }
  } else if (scores[persona]) {
    scores[persona].textContent = String(Math.min(99, Number(scores[persona].textContent) + 1));
  }
}

let observer = new IntersectionObserver(updateActiveReel, {
  root: feed,
  threshold: [0.6, 0.82]
});

renderInitialRecommendFeed();

renderRoleCards();
renderWeeklyReport();
switchFeedPage("recommend");

recommendTabButton?.addEventListener("click", () => {
  if (window.location.hash === "#cocoon") {
    window.location.hash = "";
  }

  switchFeedPage("recommend");
  renderInitialRecommendFeed();
});

cocoonTabButton?.addEventListener("click", () => {
  if (personaModeEnabled) {
    navigateToCocoonPage();
    return;
  }

  openPersonaDrawer();
});

cocoonTabButton?.addEventListener("dblclick", (event) => {
  event.preventDefault();
  if (personaModeEnabled) {
    navigateToCocoonPage();
  }
  openPersonaDrawer();
});

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#cocoon" && personaModeEnabled) {
    switchFeedPage("cocoon");
    return;
  }

  switchFeedPage("recommend");
});

document.querySelector("#closeDrawer").addEventListener("click", () => closeLayer(drawer));
document.querySelector("#xDrawer").addEventListener("click", () => closeLayer(drawer));

roleCarousel?.addEventListener("click", (event) => {
  const card = event.target.closest(".role-card");
  if (!card) return;
  if (card.dataset.roleDisabled === "true") return;

  const roleId = card.dataset.roleId;
  setActiveRole(roleId, { scroll: true });

  if (event.target.closest("[data-role-video]") || event.target.closest(".role-media")) {
    toggleRoleCardVideo(card);
    return;
  }

  if (event.target.closest("[data-role-edit]")) {
    hideRoleOverlays();
    showRoleEditor(roleId);
    return;
  }

  if (event.target.closest("[data-role-more]")) {
    roleEditor.hidden = true;
    rolePreviewPanel.hidden = true;
    toggleRoleMenu(true);
    return;
  }

  if (event.target.closest("[data-role-action='preview']")) {
    hideRoleOverlays();
    showRolePreview(roleId);
  }
});

roleCarousel?.addEventListener("dblclick", (event) => {
  const card = event.target.closest(".role-card");
  if (!card || event.target.closest("button, input, textarea, select")) return;
  if (card.dataset.roleDisabled === "true") return;

  setActiveRole(card.dataset.roleId, { scroll: true });
  enableRole(card.dataset.roleId);
});

roleCarousel?.addEventListener("scroll", () => {
  window.cancelAnimationFrame(roleScrollFrame);
  roleScrollFrame = window.requestAnimationFrame(updateActiveRoleFromScroll);
});

roleSearch?.addEventListener("input", (event) => {
  roleSearchTerm = event.target.value;
  hideRoleOverlays();
  renderRoleCards();
  requestAnimationFrame(() => {
    setActiveRole(activeRoleId, { scroll: true });
    playRolePreviewVideos();
  });
});

enableActiveRoleButton?.addEventListener("click", () => {
  enableRole();
});

previewActiveRoleButton?.addEventListener("click", () => {
  hideRoleOverlays();
  showRolePreview();
});

roleMenuButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleRoleMenu();
});

roleMenu?.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-role-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.roleAction;
  toggleRoleMenu(false);

  if (action === "preview") {
    hideRoleOverlays();
    showRolePreview();
  }

  if (action === "share") {
    shareRole();
  }

  if (action === "customize") {
    hideRoleOverlays();
    showRoleEditor();
  }
});

shuffleRole?.addEventListener("click", () => {
  if (roles.length < 2) return;

  const candidates = roles.filter((role) => role.id !== activeRoleId);
  const nextRole = candidates[Math.floor(Math.random() * candidates.length)];
  hideRoleOverlays();
  setActiveRole(nextRole.id, { scroll: true });
});

saveRoleName?.addEventListener("click", saveCustomRoleName);

customRoleName?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveCustomRoleName();
  }

  if (event.key === "Escape") {
    roleEditor.hidden = true;
  }
});

rolePreviewPanel?.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-preview]")) {
    rolePreviewPanel.hidden = true;
  }
});

feed.addEventListener(
  "scroll",
  () => {
    if (viewedReels.size >= 2) {
      maybeOpenRolePrompt();
    }
  },
  { passive: true }
);

feed.addEventListener("pointerdown", startPowerOverlayDrag);
document.addEventListener("pointermove", movePowerOverlay);
document.addEventListener("pointerup", stopPowerOverlayDrag);
document.addEventListener("pointercancel", stopPowerOverlayDrag);

document.querySelector("#openWeekly").addEventListener("click", () => openWeeklyReportForRole(selectedRoleId));
document.querySelector("#closeWeekly").addEventListener("click", () => closeLayer(weeklyModal));
document.querySelector("#xWeekly")?.addEventListener("click", () => closeLayer(weeklyModal));
document.querySelector("#xWeeklyClean")?.addEventListener("click", () => closeLayer(weeklyModal));
document.querySelector("#startWeeklyPersona").addEventListener("click", startWeeklyPersona);
publishWeeklyPersona?.addEventListener("click", publishWeeklyIdentity);
saveWeeklyPersona?.addEventListener("click", saveWeeklyIdentity);
openPortraitCommunity?.addEventListener("click", openPortraitCommunityPanel);
document.querySelector("#closeCommunity")?.addEventListener("click", () => closeLayer(communityModal));
document.querySelector("#xCommunity")?.addEventListener("click", () => closeLayer(communityModal));

communityForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = communityMessage?.value.trim();
  if (!text || !communityChat) return;

  communityChat.insertAdjacentHTML("beforeend", renderCommunityMessage("我", text, true));
  communityMessage.value = "";
  communityChat.scrollTop = communityChat.scrollHeight;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLayer(drawer);
    closeLayer(weeklyModal);
    closeLayer(communityModal);
  }

  if (event.key === "ArrowDown") {
    const next = Math.min(reels.length - 1, activeIndex + 1);
    reels[next].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (event.key === "ArrowUp") {
    const previous = Math.max(0, activeIndex - 1);
    reels[previous].scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

window.addEventListener("load", playActiveVideo);
