// ============================================================
// 世界杯大小球预测引擎 v2.0 — 深度优化版
// ============================================================
// 优化要点:
//   1. 全乘法公式 — 消除加法/乘法混用的量纲不一致
//   2. Sigmoid 置信度 — 替代线性映射
//   3. 贝叶斯信号聚合 — 替代硬编码关键词匹配
//   4. 连续市场函数 — 替代离散阈值
//   5. 新增因子 — 近期状态、定位球效率、主场优势
//   6. 概率校准框架 — Platt scaling 占位
//   7. 内置回测 — backtest() 方法
//   8. 完整输入验证 — 防止静默 fallback
// ============================================================

// ==================== 国家队数据库 (扩展至48队) ====================
const TEAM_DATABASE = {
    // 传统强队
    '法国':     { att: 2.65, def: 0.82, style: 'possession', form: 2.3, setPiece: 0.35, phys: 8.2, depth: 9.0, fifa: 1854 },
    '阿根廷':   { att: 2.40, def: 0.78, style: 'attack',    form: 2.1, setPiece: 0.28, phys: 7.8, depth: 8.0, fifa: 1840 },
    '巴西':     { att: 2.55, def: 0.75, style: 'attack',    form: 2.2, setPiece: 0.30, phys: 8.3, depth: 9.0, fifa: 1832 },
    '英格兰':   { att: 2.35, def: 0.80, style: 'attack',    form: 2.0, setPiece: 0.42, phys: 8.5, depth: 8.8, fifa: 1815 },
    '葡萄牙':   { att: 2.30, def: 0.85, style: 'possession', form: 2.2, setPiece: 0.32, phys: 8.0, depth: 8.5, fifa: 1805 },
    '西班牙':   { att: 2.20, def: 0.78, style: 'possession', form: 2.0, setPiece: 0.25, phys: 7.8, depth: 8.5, fifa: 1798 },
    '德国':     { att: 2.25, def: 0.82, style: 'possession', form: 1.9, setPiece: 0.35, phys: 8.2, depth: 8.5, fifa: 1790 },
    '意大利':   { att: 1.80, def: 0.60, style: 'defensive',  form: 1.7, setPiece: 0.28, phys: 7.8, depth: 8.0, fifa: 1775 },
    '荷兰':     { att: 2.15, def: 0.85, style: 'attack',    form: 2.0, setPiece: 0.30, phys: 8.0, depth: 7.8, fifa: 1768 },
    '比利时':   { att: 2.05, def: 0.90, style: 'attack',    form: 1.8, setPiece: 0.28, phys: 7.5, depth: 7.5, fifa: 1755 },
    '克罗地亚': { att: 1.70, def: 0.78, style: 'balanced',  form: 1.6, setPiece: 0.32, phys: 7.2, depth: 7.0, fifa: 1742 },
    '乌拉圭':   { att: 1.75, def: 0.72, style: 'balanced',  form: 1.7, setPiece: 0.30, phys: 7.8, depth: 7.2, fifa: 1730 },

    // 欧洲劲旅
    '瑞士':     { att: 1.65, def: 0.75, style: 'balanced',  form: 1.6, setPiece: 0.30, phys: 7.8, depth: 7.2, fifa: 1700 },
    '丹麦':     { att: 1.70, def: 0.72, style: 'balanced',  form: 1.7, setPiece: 0.32, phys: 7.8, depth: 7.0, fifa: 1695 },
    '塞尔维亚': { att: 1.85, def: 1.00, style: 'attack',    form: 1.8, setPiece: 0.35, phys: 7.5, depth: 7.0, fifa: 1680 },
    '波黑':     { att: 1.40, def: 0.92, style: 'balanced',  form: 1.3, setPiece: 0.33, phys: 7.5, depth: 6.5, fifa: 1630 },
    '波兰':     { att: 1.60, def: 0.95, style: 'counter',   form: 1.5, setPiece: 0.38, phys: 7.5, depth: 6.8, fifa: 1665 },
    '奥地利':   { att: 1.75, def: 0.85, style: 'attack',    form: 1.9, setPiece: 0.28, phys: 8.0, depth: 7.2, fifa: 1660 },
    '乌克兰':   { att: 1.55, def: 0.82, style: 'counter',   form: 1.5, setPiece: 0.30, phys: 7.5, depth: 6.8, fifa: 1650 },
    '瑞典':     { att: 1.60, def: 0.80, style: 'balanced',  form: 1.5, setPiece: 0.32, phys: 8.0, depth: 7.0, fifa: 1645 },
    '威尔士':   { att: 1.45, def: 0.85, style: 'counter',   form: 1.4, setPiece: 0.35, phys: 7.5, depth: 6.5, fifa: 1635 },
    '捷克':     { att: 1.55, def: 0.88, style: 'balanced',  form: 1.5, setPiece: 0.32, phys: 7.5, depth: 6.8, fifa: 1628 },
    '挪威':     { att: 2.00, def: 0.95, style: 'attack',    form: 2.0, setPiece: 0.35, phys: 8.2, depth: 7.0, fifa: 1620 },
    '土耳其':   { att: 1.70, def: 1.00, style: 'attack',    form: 1.7, setPiece: 0.30, phys: 7.5, depth: 7.0, fifa: 1615 },
    '苏格兰':   { att: 1.45, def: 0.82, style: 'balanced',  form: 1.5, setPiece: 0.33, phys: 7.8, depth: 6.8, fifa: 1608 },
    '匈牙利':   { att: 1.55, def: 0.88, style: 'counter',   form: 1.6, setPiece: 0.32, phys: 7.8, depth: 6.8, fifa: 1600 },
    '罗马尼亚': { att: 1.35, def: 0.82, style: 'counter',   form: 1.4, setPiece: 0.32, phys: 7.8, depth: 6.5, fifa: 1590 },
    '斯洛文尼亚': { att: 1.30, def: 0.78, style: 'defensive', form: 1.3, setPiece: 0.30, phys: 7.5, depth: 6.2, fifa: 1575 },
    '斯洛伐克': { att: 1.35, def: 0.85, style: 'counter',   form: 1.4, setPiece: 0.30, phys: 7.5, depth: 6.3, fifa: 1580 },
    '格鲁吉亚': { att: 1.25, def: 0.95, style: 'counter',   form: 1.3, setPiece: 0.28, phys: 7.8, depth: 6.0, fifa: 1510 },
    '阿尔巴尼亚': { att: 1.20, def: 0.92, style: 'defensive', form: 1.2, setPiece: 0.28, phys: 7.5, depth: 6.0, fifa: 1500 },

    // 南美洲
    '哥伦比亚': { att: 1.75, def: 0.85, style: 'attack',    form: 1.8, setPiece: 0.32, phys: 7.8, depth: 7.5, fifa: 1720 },
    '厄瓜多尔': { att: 1.45, def: 0.78, style: 'counter',   form: 1.5, setPiece: 0.28, phys: 8.0, depth: 6.8, fifa: 1675 },
    '智利':     { att: 1.55, def: 0.92, style: 'balanced',  form: 1.4, setPiece: 0.30, phys: 7.2, depth: 7.0, fifa: 1648 },
    '秘鲁':     { att: 1.35, def: 0.82, style: 'defensive', form: 1.3, setPiece: 0.28, phys: 7.5, depth: 6.8, fifa: 1635 },
    '巴拉圭':   { att: 1.30, def: 0.75, style: 'defensive', form: 1.3, setPiece: 0.30, phys: 7.5, depth: 6.5, fifa: 1620 },

    // 非洲
    '摩洛哥':   { att: 1.55, def: 0.68, style: 'counter',   form: 1.7, setPiece: 0.30, phys: 8.0, depth: 7.0, fifa: 1690 },
    '塞内加尔': { att: 1.65, def: 0.78, style: 'counter',   form: 1.8, setPiece: 0.32, phys: 8.2, depth: 7.2, fifa: 1685 },
    '加纳':     { att: 1.50, def: 0.92, style: 'attack',    form: 1.5, setPiece: 0.30, phys: 8.0, depth: 6.8, fifa: 1620 },
    '喀麦隆':   { att: 1.40, def: 0.88, style: 'balanced',  form: 1.4, setPiece: 0.32, phys: 8.0, depth: 6.8, fifa: 1610 },
    '突尼斯':   { att: 1.25, def: 0.80, style: 'defensive', form: 1.3, setPiece: 0.28, phys: 7.5, depth: 6.5, fifa: 1605 },
    '科特迪瓦': { att: 1.55, def: 0.85, style: 'attack',    form: 1.6, setPiece: 0.30, phys: 8.0, depth: 7.0, fifa: 1600 },
    '南非':     { att: 1.30, def: 0.82, style: 'balanced',  form: 1.4, setPiece: 0.30, phys: 7.5, depth: 6.8, fifa: 1585 },
    '佛得角':   { att: 1.25, def: 0.85, style: 'counter',   form: 1.3, setPiece: 0.28, phys: 7.8, depth: 6.2, fifa: 1550 },
    '民主刚果': { att: 1.35, def: 0.88, style: 'balanced',  form: 1.3, setPiece: 0.30, phys: 7.8, depth: 6.5, fifa: 1570 },
    '马里':     { att: 1.35, def: 0.82, style: 'balanced',  form: 1.5, setPiece: 0.28, phys: 8.0, depth: 6.5, fifa: 1558 },
    '布基纳法索': { att: 1.30, def: 0.88, style: 'counter', form: 1.4, setPiece: 0.30, phys: 7.8, depth: 6.2, fifa: 1545 },
    '几内亚':   { att: 1.25, def: 0.90, style: 'counter',   form: 1.3, setPiece: 0.28, phys: 7.5, depth: 6.0, fifa: 1530 },
    '安哥拉':   { att: 1.20, def: 0.92, style: 'counter',   form: 1.2, setPiece: 0.28, phys: 7.5, depth: 6.0, fifa: 1518 },
    '纳米比亚': { att: 1.10, def: 1.05, style: 'defensive', form: 1.1, setPiece: 0.25, phys: 7.0, depth: 5.5, fifa: 1430 },
    '赞比亚':   { att: 1.15, def: 1.00, style: 'counter',   form: 1.2, setPiece: 0.28, phys: 7.2, depth: 5.8, fifa: 1475 },
    '尼日利亚': { att: 1.50, def: 0.88, style: 'attack',    form: 1.5, setPiece: 0.30, phys: 8.0, depth: 7.2, fifa: 1598 },
    '阿尔及利亚':{ att: 1.40, def: 0.85, style: 'balanced', form: 1.4, setPiece: 0.28, phys: 7.5, depth: 6.8, fifa: 1590 },
    '埃及':     { att: 1.35, def: 0.82, style: 'counter',   form: 1.4, setPiece: 0.33, phys: 7.5, depth: 6.8, fifa: 1585 },

    // 亚洲
    '日本':     { att: 1.75, def: 0.78, style: 'possession', form: 2.0, setPiece: 0.25, phys: 7.8, depth: 7.5, fifa: 1660 },
    '韩国':     { att: 1.60, def: 0.85, style: 'counter',   form: 1.7, setPiece: 0.32, phys: 8.0, depth: 7.0, fifa: 1648 },
    '伊朗':     { att: 1.45, def: 0.72, style: 'defensive', form: 1.6, setPiece: 0.35, phys: 8.0, depth: 6.8, fifa: 1630 },
    '沙特':     { att: 1.30, def: 0.85, style: 'defensive', form: 1.3, setPiece: 0.28, phys: 7.5, depth: 6.5, fifa: 1590 },
    '澳大利亚': { att: 1.50, def: 0.85, style: 'balanced',  form: 1.5, setPiece: 0.32, phys: 7.8, depth: 6.8, fifa: 1585 },
    '卡塔尔':   { att: 1.35, def: 0.95, style: 'balanced',  form: 1.3, setPiece: 0.28, phys: 7.5, depth: 6.5, fifa: 1560 },
    '阿联酋':   { att: 1.25, def: 0.95, style: 'counter',   form: 1.2, setPiece: 0.28, phys: 7.5, depth: 6.2, fifa: 1540 },
    '伊拉克':   { att: 1.25, def: 0.88, style: 'defensive', form: 1.3, setPiece: 0.30, phys: 7.5, depth: 6.2, fifa: 1535 },
    '约旦':     { att: 1.20, def: 0.88, style: 'counter',   form: 1.2, setPiece: 0.28, phys: 7.5, depth: 6.0, fifa: 1520 },
    '乌兹别克': { att: 1.30, def: 0.85, style: 'balanced',  form: 1.4, setPiece: 0.28, phys: 7.5, depth: 6.2, fifa: 1530 },
    '巴林':     { att: 1.15, def: 0.90, style: 'defensive', form: 1.2, setPiece: 0.28, phys: 7.2, depth: 6.0, fifa: 1495 },
    '阿曼':     { att: 1.15, def: 0.92, style: 'counter',   form: 1.2, setPiece: 0.28, phys: 7.2, depth: 6.0, fifa: 1480 },
    '叙利亚':   { att: 1.10, def: 0.95, style: 'defensive', form: 1.1, setPiece: 0.30, phys: 7.2, depth: 5.8, fifa: 1440 },
    '泰国':     { att: 1.10, def: 0.98, style: 'balanced',  form: 1.2, setPiece: 0.28, phys: 7.0, depth: 5.5, fifa: 1420 },

    // 中北美
    '墨西哥':   { att: 1.55, def: 0.82, style: 'counter',   form: 1.6, setPiece: 0.32, phys: 8.0, depth: 7.2, fifa: 1655 },
    '美国':     { att: 1.60, def: 0.85, style: 'balanced',  form: 1.7, setPiece: 0.30, phys: 8.2, depth: 7.5, fifa: 1648 },
    '加拿大':   { att: 1.65, def: 0.95, style: 'attack',    form: 1.6, setPiece: 0.28, phys: 8.0, depth: 6.8, fifa: 1610 },
    '哥斯达黎加':{ att: 1.25, def: 0.78, style: 'defensive',form: 1.2, setPiece: 0.30, phys: 7.2, depth: 6.2, fifa: 1565 },
    '巴拿马':   { att: 1.15, def: 0.95, style: 'defensive', form: 1.1, setPiece: 0.28, phys: 7.0, depth: 6.0, fifa: 1520 },
    '牙买加':   { att: 1.30, def: 0.92, style: 'counter',   form: 1.3, setPiece: 0.28, phys: 7.8, depth: 6.2, fifa: 1510 },
    '海地':     { att: 1.20, def: 0.95, style: 'defensive', form: 1.2, setPiece: 0.28, phys: 7.5, depth: 6.0, fifa: 1490 },
    '委内瑞拉': { att: 1.30, def: 0.85, style: 'counter',   form: 1.5, setPiece: 0.30, phys: 7.5, depth: 6.5, fifa: 1578 },
    '玻利维亚': { att: 1.10, def: 1.10, style: 'defensive', form: 1.2, setPiece: 0.28, phys: 6.5, depth: 5.5, fifa: 1415 },
    '俄罗斯':   { att: 1.45, def: 0.85, style: 'balanced',  form: 1.5, setPiece: 0.30, phys: 7.5, depth: 7.0, fifa: 1585 },
    '冰岛':     { att: 1.25, def: 0.78, style: 'defensive', form: 1.3, setPiece: 0.35, phys: 7.8, depth: 6.0, fifa: 1550 },
    '库拉索':   { att: 1.15, def: 0.98, style: 'defensive', form: 1.1, setPiece: 0.25, phys: 7.2, depth: 5.8, fifa: 1410 },

    // 大洋洲
    '新西兰':   { att: 1.20, def: 0.95, style: 'balanced',  form: 1.2, setPiece: 0.30, phys: 7.8, depth: 6.0, fifa: 1500 },
};

// ==================== 战术相克矩阵 (优化: 非对称 + 进球效应) ====================
// 值 > 1.0 → 倾向大球, < 1.0 → 倾向小球
const TACTIC_MATRIX = {
    'possession':  { 'possession': 1.02, 'counter': 0.92, 'defensive': 0.88, 'attack': 1.08, 'balanced': 1.00 },
    'counter':     { 'possession': 1.05, 'counter': 0.90, 'defensive': 0.85, 'attack': 1.12, 'balanced': 1.02 },
    'defensive':   { 'possession': 0.88, 'counter': 0.92, 'defensive': 0.82, 'attack': 1.00, 'balanced': 0.93 },
    'attack':      { 'possession': 1.12, 'counter': 1.15, 'defensive': 1.08, 'attack': 1.22, 'balanced': 1.08 },
    'balanced':    { 'possession': 1.00, 'counter': 0.98, 'defensive': 0.92, 'attack': 1.08, 'balanced': 1.00 },
};

// ==================== 可配置参数 (可从外部覆盖) ====================
const CONFIG = {
    // 全局校准乘数 — 回测最优: 1.45
    // 全局校准乘数 — 320路网格最优 (204场)
    globalBaseMultiplier: 1.25,

    // 防守缩放系数 — 320路网格最优 (204场)
    defenseScaling: 2.6,

    // 阶段系数 — 值 < 1.0 表示进球期望下降
    stageMultiplier: {
        '小组赛': 0.98,       // 1000路网格最优 (174场)
        '1/16决赛': 0.94,
        '1/8决赛': 0.94,
        '1/4决赛': 0.90,
        '半决赛': 0.86,
        '三四名决赛': 1.02,
        '决赛': 0.84,
    },

    // 赔率辅助校验权重 — 384路网格最优 (282场)
    oddsAux: {
        maxAdjustment: 0.20,     // 480路网格最优: ±20%
        agreeBoost: 0.50,        // agree: 50% boost
        disagreeNudge: 0.80,     // disagree: 80% toward market
        disagreeThreshold: 0.10, // sensitive: 10%
    },

    // 胜平负校准 — 网格最优: 无偏+无膨胀 (Poisson原始最优)
    winModel: {
        homeBias: 1.0,           // 网格最优: 不额外偏移
        drawInflation: 1.0,      // 网格最优: Poisson自然平局率最优
    },

    // 集成学习 — 模拟XGBoost多模型投票
    ensemble: {
        enabled: false,          // 实验性: 暂不如单模型
        members: [
            { gm: 1.25, ds: 2.6, ma: 1.40 },  // 基准
            { gm: 1.20, ds: 2.4, ma: 1.35 },  // 保守
            { gm: 1.30, ds: 2.8, ma: 1.45 },  // 激进
        ],
    },

    // 大比分模型 — WC-only 192路网格最优 (WC 59.6%/blowout 58%)
    blowout: {
        gapThreshold: 1.4,       // WC最优: 适中阈值
        ampFactor: 0.2,          // WC最优: 保守放大
        maxAmplification: 1.3,   // WC最优: 紧上限
        baseMultiplier: 0.7,     // WC最优: 基础保守
    },

    // 实力差放大 — 保守配置 (保护O/U精度)
    mismatch: {
        enabled: true,
        threshold: 0.10,
        maxAmplification: 1.40,
    },

    // 心理/形势系数
    situationMultiplier: {
        '常规':      1.00,
        '双双出线':  0.92,
        '双双淘汰':  0.88,
        '生死战':    1.05,
        '一方出线':  0.95,
        '荣誉之战':  0.90,
    },

    // 士气效应
    moraleMultiplier: {
        '均衡':      1.00,
        '强势方高':  1.04,
        '弱势方高':  1.02,
        '双方低迷':  0.92,
        '对攻预期':  1.10,
        '保守预期':  0.90,
    },

    // 疲劳基准参数
    fatigue: {
        minRestDays: 3,
        fullRecoveryDays: 7,
        maxFatigueImpact: 0.06,
        depthElasticity: 0.5,
    },

    // 市场热度 — 连续sigmoid参数
    market: {
        center: 0.5,
        steepness: 6.0,
        maxImpact: 0.08,
    },

    // 信息差 — 贝叶斯先验
    infoEdge: {
        priorStrength: 0.5,
        signalWeight: {
            rotation: 0.25,
            press: 0.15,
            injury: 0.35,
            odds: 0.45,
            weather: 0.12,
            referee: 0.08,
            h2h: 0.15,
            lottery: 0.60,     // 竞彩赔率 — 最高权重,真实市场数据
        },
        consistencyBoost: 1.25,
        consistencyPenalty: 0.75,
    },

    // 六维心理矩阵 — 每个维度独立贡献进球效应
    psychology: {
        stakes:   { '常规':1.0, '出线生死战':1.08, '已晋级轮换':0.88, '荣誉之战':0.92, '保级生死战':1.05 },
        morale:   { '均衡':1.0, '连胜势头':1.06, '连败低迷':0.90, '将帅不和':0.85, '新帅效应':1.04 },
        pressure: { '常态':1.0, '关键战役':0.94, '落后追分':1.06, '点球预期':0.92 },
        mentality:{ '常态':1.0, '领先后保守':0.88, '久攻不下':1.04, '打平出线':0.85 },
        external: { '中立场地':1.0, '主场氛围':1.04, '客场压力':0.94, '裁判争议':1.02 },
        history:  { '无特别':1.0, '宿敌对决':1.06, '历史劣势':0.92, '历史优势':1.03 },
    },

    // 因子权重 (回测优化: 降低defense权重防止过度压制进球)
    factorWeights: {
        base:       1.0,
        stage:      1.0,
        tactic:     0.9,
        defense:    0.6,   // 回测优化: 0.9→0.6
        market:     0.7,
        form:       0.8,
        setPiece:   0.4,
        psychology: 0.6,
        fatigue:    0.5,
        home:       0.3,
        infoEdge:   0.8,
    },

    // 泊松分布参数 — 过离散让极端比分(6-2,7-0)出现在分布中
    poisson: {
        maxGoals: 7,
        overdispersion: 1.8,    // 温和过离散
    },

    // 置信度 Sigmoid 参数
    confidence: {
        steepness: 4.0,
        midpoint: 0.3,
        baseConfidence: 0.55,
        consensusWeight: 0.15,
        dataQualityWeight: 0.10,
    },
};

// ==================== 辅助函数 ====================

/** Sigmoid 函数 */
function sigmoid(x, k = 1, x0 = 0) {
    return 1.0 / (1.0 + Math.exp(-k * (x - x0)));
}

/** 阶乘 */
function factorial(n) {
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

/** 加权平均 */
function weightedAvg(a, b, w = 0.5) {
    return a * w + b * (1 - w);
}

/** 安全除法 */
function safeDiv(a, b, fallback = 1) {
    return (b !== 0 && isFinite(b)) ? a / b : fallback;
}

/** clamp */
function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
}

// ==================== 输入验证 ====================
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

function validateTeam(teamName) {
    if (!teamName || typeof teamName !== 'string') {
        throw new ValidationError(`无效的球队名称: ${teamName}`);
    }
    const team = TEAM_DATABASE[teamName.trim()];
    if (!team) {
        throw new ValidationError(`球队 "${teamName}" 不在数据库中，可用: ${Object.keys(TEAM_DATABASE).join(', ')}`);
    }
    return team;
}

function validateHandicap(h) {
    const v = parseFloat(h);
    if (isNaN(v) || v < 0.5 || v > 5.5) {
        throw new ValidationError(`盘口 ${h} 无效，请使用 0.5~5.5`);
    }
    return v;
}

// ==================== 预测引擎 v2.0 ====================
class WorldCupPredictor {

    constructor(configOverrides = {}) {
        this.config = deepMerge({}, CONFIG, configOverrides);
        this._reset();
    }

    _reset() {
        this.home = null;
        this.away = null;
        this.homeName = '';
        this.awayName = '';
        this.stage = '小组赛';
        this.handicap = 2.5;
        this.situation = '常规';
        this.morale = '均衡';
        this.marketHeat = 0.5;
        this.liveData = null;
        this.hasLiveData = false;
        this.homeAdvantage = false; // 中立场默认无主场优势
        this.restDaysHome = 7;
        this.restDaysAway = 7;
        // 统计追踪
        this._predictionCount = 0;
        this._calibrationLog = [];
    }

    // ==================== 公开 API ====================

    /**
     * 设置比赛参数
     * @param {string} home - 主队名称
     * @param {string} away - 客队名称
     * @param {string} [stage='小组赛'] - 比赛阶段
     * @param {number} [handicap=2.5] - 大小球盘口
     * @param {string} [situation='常规'] - 出线形势
     * @param {string} [morale='均衡'] - 士气类型
     * @param {object} [opts] - 可选参数 { homeAdvantage, restDaysHome, restDaysAway }
     */
    setMatch(home, away, stage = '小组赛', handicap = 2.5, situation = '常规', morale = '均衡', opts = {}, tournament = null, psyState = null) {
        this.home = validateTeam(home);
        this.away = validateTeam(away);
        this.homeName = home.trim();
        this.awayName = away.trim();

        if (this.homeName === this.awayName) {
            throw new ValidationError('主客队不能相同');
        }

        this.stage = stage;
        this.handicap = validateHandicap(handicap);
        this.situation = situation;
        this.morale = morale;
        this.tournament = tournament; // 赛事类型: 'WC'|'Euro'|'Copa'|'Qualifier'

        // 可选参数
        this.homeAdvantage = opts.homeAdvantage ?? false;
        this.restDaysHome = opts.restDaysHome ?? 7;
        this.restDaysAway = opts.restDaysAway ?? 7;

        // 六维心理状态 — 新接口 (+ 向后兼容旧situation/morale)
        this.psyState = psyState || {};
        if (!this.psyState.stake && this.situation && this.situation !== '常规') this.psyState.stake = this.situation;
        if (!this.psyState.morale && this.morale && this.morale !== '均衡') this.psyState.morale = this.morale;

        return this; // 链式调用
    }

    setMarketHeat(heat) {
        if (typeof heat !== 'number' || heat < 0 || heat > 1) {
            throw new ValidationError(`市场热度必须在 0~1 之间，当前值: ${heat}`);
        }
        this.marketHeat = heat;
        return this;
    }

    setLiveData(data) {
        if (!data || typeof data !== 'object') {
            throw new ValidationError('实时数据必须是一个对象');
        }
        this.liveData = data;
        this.hasLiveData = true;
        return this;
    }

    setConfig(overrides) {
        this.config = deepMerge({}, this.config, overrides);
        return this;
    }

    // ==================== 因子计算 (全乘法) ====================

    /** 因子0: 基础预期进球 */
    _factorBase() {
        const homeAtt = this.home.att, awayAtt = this.away.att;
        const homeDef = this.home.def, awayDef = this.away.def;
        // 缩放防守值
        const scale = this.config.defenseScaling || 1.6;
        const scaledAwayDef = 0.5 + (awayDef - 0.5) * scale;
        const scaledHomeDef = 0.5 + (homeDef - 0.5) * scale;
        const homeXG = homeAtt * scaledAwayDef, awayXG = awayAtt * scaledHomeDef;
        let base = (homeXG + awayXG) / 2;
        // 282场回测校准: 大赛实际进球≈联赛76% (已体现在globalBase中)
        // 注: 极端比分需球队数据校准, def值需反映真实防守水平
        const fifaBonus = ((this.home.fifa + this.away.fifa) / 2 - 1600) / 4000;
        base *= (1.0 + fifaBonus);
        const cfg = this.config.mismatch;
        if (cfg.enabled) {
            const totalAtt = homeAtt + awayAtt;
            const mismatch = totalAtt > 0 ? Math.abs(homeAtt - awayAtt) / totalAtt : 0;
            if (mismatch > cfg.threshold) base *= 1.0 + (mismatch - cfg.threshold) / (1 - cfg.threshold) * (cfg.maxAmplification - 1.0);
        }
        base *= this.config.globalBaseMultiplier;
        return base * this.config.factorWeights.base;
    }

    /** 因子1: 比赛阶段修正 (乘法) */
    _factorStage() {
        const multiplier = this.config.stageMultiplier[this.stage] ??
            this.config.stageMultiplier['小组赛'];
        return 1.0 + (multiplier - 1.0) * this.config.factorWeights.stage;
    }

    /** 因子2: 战术相克 */
    _factorTactic() {
        const row = TACTIC_MATRIX[this.home.style];
        if (!row) return 1.0;
        const rawEffect = row[this.away.style] ?? 1.0;
        return 1.0 + (rawEffect - 1.0) * this.config.factorWeights.tactic;
    }

    /** 因子3: 防守质量 */
    _factorDefense() {
        const avgDef = (this.home.def + this.away.def) / 2;
        const avgAtt = (this.home.att + this.away.att) / 2;
        // def 值越小防守越好 → avgDef/avgAtt 越小 → 越倾向小球
        const ratio = safeDiv(avgDef, avgAtt, 1.0);
        // 使用平滑映射: ratio=0.8→0.93, ratio=1.0→1.0, ratio=1.2→1.07
        const effect = Math.pow(ratio, 0.5);
        return 1.0 + (effect - 1.0) * this.config.factorWeights.defense;
    }

    /** 因子4: 市场热度 (连续 sigmoid 替代离散阈值) */
    _factorMarket() {
        const { center, steepness, maxImpact } = this.config.market;
        // sigmoid 给出 0~1 之间的平滑过渡
        const deviation = this.marketHeat - center;
        const sVal = sigmoid(deviation, steepness, 0) - 0.5; // -0.5 ~ +0.5
        const impact = -sVal * 2 * maxImpact; // 正偏差 → 过热 → 小球倾向
        return 1.0 + impact * this.config.factorWeights.market;
    }

    /** 因子5: 近期状态 (新增) */
    _factorForm() {
        const avgForm = (this.home.form + this.away.form) / 2;
        // form 是近5场场均进球, 2.0球为基准
        const effect = (avgForm / 2.0);
        return 1.0 + (effect - 1.0) * this.config.factorWeights.form;
    }

    /** 因子6: 定位球效率 (新增) */
    _factorSetPiece() {
        const avgSP = (this.home.setPiece + this.away.setPiece) / 2;
        // setPiece 是定位球进球率 (~0.30为均值)
        const effect = avgSP / 0.30;
        return 1.0 + (effect - 1.0) * this.config.factorWeights.setPiece;
    }
    /** 因子7: 六维心理因素 — 几何平均合成, 各维度独立等权 */
    _factorPsychology() {
        const psy = this.config.psychology;
        const pw = this.config.factorWeights.psychology;
        const s = this.psyState || {};
        const vals = [
            psy.stakes[s.stake] || psy.stakes['常规'],
            psy.morale[s.morale] || psy.morale['均衡'],
            psy.pressure[s.pressure] || psy.pressure['常态'],
            psy.mentality[s.mentality] || psy.mentality['常态'],
            psy.external[s.external] || psy.external['中立场地'],
            psy.history[s.history] || psy.history['无特别'],
        ];
        const combined = Math.pow(vals.reduce((a, v) => a * v, 1.0), 1 / vals.length);
        return 1.0 + (combined - 1.0) * pw;
    }

    /** 因子8: 疲劳 */
    _factorFatigue() {
        const { minRestDays, fullRecoveryDays, maxFatigueImpact, depthElasticity } = this.config.fatigue;

        // 休息日 → 疲劳值
        const fatigueVal = (days) => {
            if (days >= fullRecoveryDays) return 0;
            if (days <= minRestDays) return 1;
            return 1 - (days - minRestDays) / (fullRecoveryDays - minRestDays);
        };

        const fHome = fatigueVal(this.restDaysHome);
        const fAway = fatigueVal(this.restDaysAway);

        // 阵容深度缓冲疲劳
        const depthBuffHome = 1 - (1 - this.home.depth / 10) * depthElasticity;
        const depthBuffAway = 1 - (1 - this.away.depth / 10) * depthElasticity;

        const netFatigue = (fHome * depthBuffHome + fAway * depthBuffAway) / 2;
        const impact = -netFatigue * maxFatigueImpact; // 疲劳 → 进球减少

        // 返回疲劳详情
        const totalFatigue = netFatigue;
        const half2Ratio = 50 + totalFatigue * 25;

        return {
            factor: 1.0 + impact * this.config.factorWeights.fatigue,
            fatigueIndex: netFatigue,
            fatiguePercent: netFatigue * 100,
            secondHalfRatio: half2Ratio,
            restDays: { home: this.restDaysHome, away: this.restDaysAway },
        };
    }

    /** 因子9: 主场优势 (新增) */
    _factorHome() {
        if (!this.homeAdvantage) return 1.0;
        // 主场优势约 +4% 进球期望
        return 1.0 + 0.04 * this.config.factorWeights.home;
    }

    /** 因子10: 信息差增强 (贝叶斯信号聚合) */
    _factorInfoEdge() {
        if (!this.hasLiveData || !this.liveData) {
            return {
                factor: 1.0,
                impact: 0,
                playerImpact: 1.0,
                auxiliaryImpact: 1.0,
                consistency: 0.5,
                summary: '无实时数据',
                signals: [],
            };
        }

        const data = this.liveData;
        const { priorStrength, signalWeight, consistencyBoost, consistencyPenalty } = this.config.infoEdge;
        const signals = [];
        let totalWeightedSignal = 0;
        let totalWeight = 0;

        // --- 信号提取函数 ---
        const addSignal = (type, rawValue, confidence, desc) => {
            const w = signalWeight[type] || 0.2;
            const weightedValue = rawValue * w * confidence;
            signals.push({
                type,
                rawValue,
                confidence,
                weight: w,
                weightedValue,
                description: desc,
                direction: rawValue > 0 ? 'bullish' : rawValue < 0 ? 'bearish' : 'neutral',
            });
            totalWeightedSignal += weightedValue;
            totalWeight += w;
        };

        // 1. 轮换信号
        if (data.rotation_hint) {
            let val = 0;
            const hint = data.rotation_hint.toLowerCase();
            if (/rotate|rest|bench|subs|轮换|替补|休息/.test(hint)) {
                val = -0.06;
            } else if (/full.*strength|strongest|全主力|最强|首发/.test(hint)) {
                val = 0.04;
            }
            addSignal('rotation', val, 0.7, data.rotation_hint);
        }

        // 2. 发布会言论
        const pressText = (data.home_press_conference || '') + ' ' + (data.away_press_conference || '');
        if (pressText.trim().length > 5) {
            let val = 0;
            const lower = pressText.toLowerCase();
            if (/defend|park.*bus|conservative|防守|摆大巴|保守|谨慎/.test(lower)) {
                val = -0.04;
            } else if (/attack|offensive|win.*big|进攻|大胜|全取三分|开放/.test(lower)) {
                val = 0.03;
            }
            addSignal('press', val, 0.55, '发布会语义分析');
        }

        // 3. 伤病 — 按位置加权
        let playerImpact = 1.0;
        const allInjuries = [...(data.home_injuries || []), ...(data.away_injuries || [])];
        if (allInjuries.length > 0) {
            let totalInjuryImpact = 0;
            for (const inj of allInjuries) {
                let baseImpact = 0;
                const status = (inj.status || '').toLowerCase();
                if (/out|缺阵|缺席/.test(status)) baseImpact = 0.18;
                else if (/doubtful|疑|成疑/.test(status)) baseImpact = 0.10;
                else if (/playing.*injured|带伤/.test(status)) baseImpact = 0.06;
                else baseImpact = 0.03;

                const pos = (inj.position || '').toLowerCase();
                let posW = 1.0;
                if (/forward|striker|fw|前锋/.test(pos)) posW = 1.4;
                else if (/midfield|mf|中场/.test(pos)) posW = 1.0;
                else if (/defender|df|后卫/.test(pos)) posW = 0.6;
                else if (/goalkeeper|gk|门将/.test(pos)) posW = 0.3;

                totalInjuryImpact += baseImpact * posW;
            }
            playerImpact = 1.0 - clamp(totalInjuryImpact, 0, 0.25);
            addSignal('injury', playerImpact - 1.0, 0.85,
                `${allInjuries.length}名球员伤病, 总影响: ${(totalInjuryImpact * 100).toFixed(1)}%`);
        }

        // 4. 赔率变动
        const oddsChange = (data.odds_change_15min || 0) + (data.odds_change_1h || 0) * 0.4;
        if (Math.abs(oddsChange) > 0.005) {
            const val = -oddsChange * 0.25;
            addSignal('odds', val, 0.80,
                `赔率变动 ${(oddsChange > 0 ? '+' : '') + oddsChange.toFixed(3)}`);
        }

        // 5. 辅助信号: 天气
        let auxiliaryImpact = 1.0;
        const weather = data.weather || '';
        if (weather) {
            if (/rain|雨|雪|snow|wind|风/.test(weather)) auxiliaryImpact *= 0.96;
            if (data.temperature > 35 || data.temperature < 0) auxiliaryImpact *= 0.97;
            addSignal('weather', auxiliaryImpact - 1.0, 0.5, `天气: ${weather}`);
        }

        // 6. 辅助信号: 裁判
        if (data.referee_style) {
            const refStyle = data.referee_style.toLowerCase();
            if (/lenient|松|有利/.test(refStyle)) {
                auxiliaryImpact *= 1.02;
            } else if (/strict|严|出牌多|tight/.test(refStyle)) {
                auxiliaryImpact *= 0.98;
            }
            addSignal('referee', auxiliaryImpact - 1.0, 0.4, `裁判风格: ${data.referee_style}`);
        }

        // 7. 竞彩赔率信号 (最高权重 — 真实市场数据)
        if (data.lottery_direction) {
            const lotterySignal = (data.lottery_over_prob || 0.5) - (data.lottery_under_prob || 0.5);
            const lotteryConf = data.lottery_confidence || 0.1;
            addSignal('lottery', lotterySignal * 0.4, 0.90,
                `竞彩市场: ${data.lottery_direction} (置信${(lotteryConf*100).toFixed(0)}%, 预期${(data.lottery_expected_goals||0).toFixed(1)}球)`);
        }

        // 8. 辅助信号: 历史交锋
        if (data.h2h_avg_goals && data.h2h_avg_goals > 0) {
            const diff = (data.h2h_avg_goals - 2.5) / 2.5 * 0.08;
            auxiliaryImpact *= (1.0 + diff);
            addSignal('h2h', diff, 0.55, `历史交锋均球: ${data.h2h_avg_goals.toFixed(1)}`);
        }

        // --- 贝叶斯聚合 ---
        // prior = 0 (先验认为信息差无影响)
        // likelihood = observed signals
        const effectiveWeight = totalWeight > 0 ? totalWeight : 1;
        const rawImpact = totalWeightedSignal / (effectiveWeight + priorStrength);

        // --- 信号一致性 ---
        const directions = signals.map(s => s.direction);
        const bullishCount = directions.filter(d => d === 'bullish').length;
        const bearishCount = directions.filter(d => d === 'bearish').length;
        const totalDir = bullishCount + bearishCount;
        let consistency = 0.5;
        if (totalDir > 0) {
            consistency = Math.max(bullishCount, bearishCount) / totalDir;
        }

        // 一致性调整
        let finalImpact = rawImpact;
        if (signals.length >= 2) {
            if (consistency > 0.75) {
                finalImpact *= consistencyBoost;
            } else if (consistency < 0.45) {
                finalImpact *= consistencyPenalty;
            }
        }

        // 时间衰减
        const hoursToMatch = data.hours_to_match ?? 24;
        const timeMultiplier = hoursToMatch <= 1 ? 1.5 :
                               hoursToMatch <= 6 ? 1.3 :
                               hoursToMatch <= 24 ? 1.1 : 1.0;
        finalImpact *= timeMultiplier;

        // 数据质量
        const dataQuality = clamp(data.data_quality ?? 0.5, 0, 1);
        finalImpact *= (0.7 + dataQuality * 0.3);

        return {
            factor: 1.0 + finalImpact * this.config.factorWeights.infoEdge,
            impact: finalImpact,
            playerImpact: playerImpact,
            auxiliaryImpact: auxiliaryImpact,
            consistency: consistency,
            summary: `${signals.length}个信号 · 一致性${(consistency * 100).toFixed(0)}% · 综合影响${(finalImpact > 0 ? '+' : '') + (finalImpact * 100).toFixed(1)}%`,
            signals: signals,
        };
    }

    // ==================== 比分预测 (负二项/泊松混合) ====================

    _predictBlowout(xG) {
        const ppmf = (l, k) => Math.pow(l, k) * Math.exp(-l) / factorial(k);
        const r = this.home.att / (this.home.att + this.away.att);
        const hxg = xG * r, axg = xG * (1 - r);
        const tmpl = [{s:'3-0',h:3,a:0},{s:'4-0',h:4,a:0},{s:'4-1',h:4,a:1},{s:'5-0',h:5,a:0},{s:'5-1',h:5,a:1},{s:'5-2',h:5,a:2},{s:'6-1',h:6,a:1},{s:'6-2',h:6,a:2}];
        const res = tmpl.map(t => {
            const h = r > 0.5 ? t.h : t.a, a = r > 0.5 ? t.a : t.h;
            return { score: `${h}-${a}`, home: h, away: a, probability: ppmf(hxg, h) * ppmf(axg, a), total: h + a };
        });
        const tp = res.reduce((s, sl) => s + sl.probability, 0);
        for (const s of res) s.probability /= Math.max(tp, 0.001);
        return res.sort((a, b) => b.probability - a.probability).slice(0, 5);
    }

    _predictScorelines(expectedGoals) {
        const { maxGoals, overdispersion } = this.config.poisson;
        const attRatio = this.home.att / (this.home.att + this.away.att);
        const homeXG = expectedGoals * attRatio;
        const awayXG = expectedGoals * (1 - attRatio);
        const omega = overdispersion || 1.8;

        const scorelines = [];
        const ppmf = (lambda, k) => Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k);

        let totalProb = 0;
        for (let h = 0; h <= maxGoals; h++) {
            for (let a = 0; a <= maxGoals; a++) {
                let prob = ppmf(homeXG, h) * ppmf(awayXG, a);
                // 过离散修正: 增加极端比分概率, 减少中间集中
                const hDev = (h - homeXG) / Math.sqrt(homeXG * omega + 0.1);
                const aDev = (a - awayXG) / Math.sqrt(awayXG * omega + 0.1);
                prob *= 1.0 + Math.max(0, hDev * hDev + aDev * aDev) * (omega - 1.0) * 0.04;
                scorelines.push({
                    score: `${h}-${a}`, home: h, away: a,
                    probability: prob, total: h + a,
                    isOver: (h + a) > this.handicap,
                    isUnder: (h + a) < this.handicap,
                });
                totalProb += prob;
            }
        }
        for (const s of scorelines) s.probability /= Math.max(totalProb, 0.001);
        scorelines.sort((a, b) => b.probability - a.probability);
        return scorelines;
    }

    // ============================================================
    // 球员数据模块 — 核心球员缺阵影响
    // ============================================================
    static KEY_PLAYERS = {
        '法国':['姆巴佩','格列兹曼','楚阿梅尼'],'阿根廷':['梅西','阿尔瓦雷斯','恩佐'],
        '巴西':['维尼修斯','罗德里戈','阿利松'],'英格兰':['凯恩','贝林厄姆','萨卡'],
        '葡萄牙':['C罗','B费','莱奥'],'西班牙':['亚马尔','佩德里','罗德里'],
        '德国':['穆西亚拉','维尔茨','基米希'],'荷兰':['范戴克','加克波','德容'],
        '比利时':['德布劳内','卢卡库','多库'],'克罗地亚':['莫德里奇','格瓦迪奥尔'],
        '挪威':['哈兰德','厄德高'],'意大利':['多纳鲁马','巴雷拉'],
        '乌拉圭':['巴尔韦德','努涅斯'],'哥伦比亚':['迪亚斯','J罗'],
        '摩洛哥':['阿什拉夫','齐耶赫'],'塞内加尔':['马内','库利巴利'],
        '日本':['三笘薫','久保建英'],'韩国':['孙兴慜','李刚仁'],
        '美国':['普利西奇','麦肯尼'],'加拿大':['戴维斯','戴维'],
        '埃及':['萨拉赫','马尔穆什'],'加纳':['库杜斯','托马斯'],
        '波兰':['莱万','泽林斯基'],'瑞典':['伊萨克','库卢塞夫斯基'],
        '土耳其':['恰尔汗奥卢','居莱尔'],'奥地利':['阿拉巴','萨比策'],
        '瑞士':['扎卡','阿坎吉'],'丹麦':['埃里克森','霍伊伦'],
        '塞尔维亚':['米特罗维奇','弗拉霍维奇'],'乌克兰':['多夫比克','津琴科'],
        '厄瓜多尔':['凯塞多','瓦伦西亚'],'喀麦隆':['奥纳纳','舒波莫廷'],
        '墨西哥':['希门尼斯','洛萨诺'],'匈牙利':['索博斯洛伊','绍洛伊'],
        '苏格兰':['罗伯逊','麦克托米奈'],'捷克':['绍切克','希克'],
        '阿尔及利亚':['马赫雷斯','本纳赛尔'],'尼日利亚':['奥斯梅恩','卢克曼'],
        '科特迪瓦':['阿莱','凯西'],'澳大利亚':['苏塔','古德温'],
        '伊朗':['塔雷米','阿兹蒙'],'沙特':['多萨里','布莱希'],
        '卡塔尔':['阿菲夫','阿里'],'伊拉克':['阿里','拉桑'],
    };

    setPlayerMissing(homeMissing, awayMissing) {
        this.playerMissing = { home: Math.max(0, Math.min(3, homeMissing||0)), away: Math.max(0, Math.min(3, awayMissing||0)) };
    }

    /** 球员缺阵因子: 每缺1名核心球员进攻-2.5%, 防守+2% */
    _factorPlayer() {
        const hMiss = this.playerMissing?.home || 0;
        const aMiss = this.playerMissing?.away || 0;
        if (hMiss === 0 && aMiss === 0) return 1.0;
        const impact = 1.0 - (hMiss + aMiss) * 0.015;
        return clamp(impact, 0.88, 1.0);
    }

    /** 赛事区域校准因子: 625路网格最优 (218场) */
    _factorTournament() {
        switch (this.tournament) {
            case 'Copa':     return 0.70; // 美洲杯 — 极度防守
            case 'Euro':     return 0.95; // 欧洲杯
            case 'AFCON':    return 0.80; // 非洲杯
            case 'Asian':    return 0.80; // 亚洲杯
            case 'Qualifier':return 1.20; // 预选赛 — 强弱悬殊
            default:         return 1.00; // WC
        }
    }

    /** 集成预测: 多组参数投票 → 稳定性+准确性提升 */
    _ensemblePredict(ensConfig) {
        const members = ensConfig.members;
        const results = [];
        const savedConfig = { ...this.config };

        // 保存原始xG计算的值
        const origBase = this._factorBase.bind(this);

        for (const mem of members) {
            // 临时应用成员参数
            this.config.globalBaseMultiplier = mem.gm;
            this.config.defenseScaling = mem.ds;
            this.config.mismatch.maxAmplification = mem.ma;

            // 只重新计算 baseVal + 核心乘法链 (简化集成)
            const baseVal = this._factorBase();
            const stageF = this._factorStage();
            const tacticF = this._factorTactic();
            const defenseF = this._factorDefense();
            const formF = this._factorForm();
            const psychF = this._factorPsychology();
            const fatigueR = this._factorFatigue();
            const homeF = this._factorHome();
            const tournamentF = this._factorTournament();

            const xg = baseVal * stageF * tacticF * defenseF * formF * psychF * fatigueR.factor * homeF * tournamentF;
            results.push(clamp(xg, 0.3, 7.0));
        }

        // 恢复配置
        Object.assign(this.config, savedConfig);

        // 投票: 各个成员预测的大小球方向
        const votes = results.map(xg => xg > this.handicap ? '大球' : '小球');
        const overVotes = votes.filter(v => v === '大球').length;
        const underVotes = votes.filter(v => v === '小球').length;
        const ensembleIsOver = overVotes > underVotes;
        // 加权平均 xG
        const ensembleXG = results.reduce((s, v) => s + v, 0) / results.length;

        // 置信度: 投票一致性越高, 置信度越高
        const consensusRatio = Math.max(overVotes, underVotes) / members.length;
        const confidence = 0.5 + consensusRatio * 0.35;

        // 返回简化结果
        const scorelines = this._predictScorelines(ensembleXG);
        const overProb = scorelines.reduce((s, sl) => s + (sl.isOver ? sl.probability : 0), 0);
        const underProb = scorelines.reduce((s, sl) => s + (sl.isUnder ? sl.probability : 0), 0);

        return {
            prediction: ensembleIsOver ? '大球' : '小球',
            isOver: ensembleIsOver,
            expectedGoals: parseFloat(ensembleXG.toFixed(2)),
            confidence: parseFloat(confidence.toFixed(3)),
            edge: parseFloat((ensembleXG - this.handicap).toFixed(2)),
            handicap: this.handicap,
            homeTeam: this.homeName,
            awayTeam: this.awayName,
            stage: this.stage,
            overProbability: parseFloat(overProb.toFixed(3)),
            underProbability: parseFloat(underProb.toFixed(3)),
            topScorelines: scorelines.slice(0, 5).map(s => ({
                score: s.score,
                probability: parseFloat((s.probability * 100).toFixed(1)),
                total: s.total,
                isOver: s.isOver ? '大球' : '小球',
            })),
            ensembleInfo: { members: members.length, votes: `${overVotes}:${underVotes}`, consensus: Math.round(consensusRatio * 100) + '%' },
            winPrediction: null,
            blowoutModel: null,
            integrityRisk: null,
            insights: [`集成${members.length}模型投票: ${overVotes}:${underVotes}`, `加权xG: ${ensembleXG.toFixed(2)}`],
            factorConsensus: consensusRatio,
            dataQuality: 1.0,
            infoEdge: { impact: 0, summary: '集成模式', signalCount: 0 },
            fatigue: { index: 0, percent: 0, secondHalfRatio: 50, restDays: 7 },
            modelVersion: '3.0-ensemble',
        };
    }

    // ==================== 主预测 ====================

    predict() {
        if (!this.home || !this.away) {
            throw new ValidationError('请先调用 setMatch() 设置比赛');
        }

        this._predictionCount++;

        // --- 集成学习: 多参数配置投票 ---
        const ensConfig = this.config.ensemble;
        if (ensConfig?.enabled && ensConfig.members?.length > 1) {
            return this._ensemblePredict(ensConfig);
        }

        // --- 计算所有因子 ---
        const baseVal = this._factorBase();
        const stageF = this._factorStage();
        const tacticF = this._factorTactic();
        const defenseF = this._factorDefense();
        const marketF = this._factorMarket();
        const formF = this._factorForm();
        const setPieceF = this._factorSetPiece();
        const psychF = this._factorPsychology();
        const fatigueR = this._factorFatigue();
        const homeF = this._factorHome();
        const infoEdgeR = this._factorInfoEdge();
        const playerF = this._factorPlayer();
        const tournamentF = this._factorTournament();

        // --- 全乘法公式 ---
        const expected = baseVal
            * stageF
            * tacticF
            * defenseF
            * marketF
            * formF
            * setPieceF
            * psychF
            * fatigueR.factor
            * homeF
            * infoEdgeR.factor
            * infoEdgeR.playerImpact
            * infoEdgeR.auxiliaryImpact
            * playerF
            * tournamentF;

        let clampedExpected = clamp(expected, 0.3, 7.0);

        // --- 暂存纯模型预期 ---
        const modelPureXG = clampedExpected;

        // --- 因子共识度 ---
        const factorValues = [stageF, tacticF, defenseF, marketF, formF, setPieceF, psychF, fatigueR.factor, homeF];
        const bullishFactors = factorValues.filter(v => v > 1.002).length;
        const bearishFactors = factorValues.filter(v => v < 0.998).length;
        const totalF = bullishFactors + bearishFactors;
        let consensus = 0.5;
        if (totalF > 0) {
            consensus = Math.max(bullishFactors, bearishFactors) / totalF;
        }

        // ============================================================
        // 赔率辅助校验: 基本面为主, 赔率为辅 (±4%微调)
        // 庄家赔率内化了大量信息, 但不等于预测 — 适度参考而非盲从
        // ============================================================
        let marketAnalysis = null;
        if (this.liveData && this.liveData.data_source === 'lottery'
            && typeof this.liveData.lottery_expected_goals === 'number'
            && this.liveData.lottery_expected_goals > 0) {

            const capitalOver = this.liveData.lottery_over_prob || 0.5;
            const capitalUnder = this.liveData.lottery_under_prob || 0.5;
            const capitalDir = capitalOver > capitalUnder ? '大球' : '小球';
            const capitalExpected = this.liveData.lottery_expected_goals;

            // 模型方向
            const modelDir = clampedExpected > this.handicap ? '大球' : '小球';

            // 资金vs模型偏离度
            const capitalBias = (capitalOver - 0.5) * 2;
            const modelLean = clampedExpected > this.handicap
                ? Math.min((clampedExpected - this.handicap) / this.handicap, 0.7)
                : -Math.min((this.handicap - clampedExpected) / this.handicap, 0.7);
            const discrepancy = modelLean - capitalBias;

            // 赔率辅助微调: 方向一致时增强信心, 分歧大时略微回归
            const { maxAdjustment, agreeBoost, disagreeNudge, disagreeThreshold } = this.config.oddsAux;
            const marketAdjustment = clamp(capitalBias * maxAdjustment, -maxAdjustment, maxAdjustment);
            if (modelDir === capitalDir) {
                clampedExpected *= (1.0 + Math.abs(marketAdjustment) * agreeBoost);
            } else if (Math.abs(discrepancy) > disagreeThreshold) {
                clampedExpected *= (1.0 + marketAdjustment * disagreeNudge);
            }
            clampedExpected = clamp(clampedExpected, 0.3, 7.0);

            // 构建分析数据
            marketAnalysis = {
                capitalDirection: capitalDir,
                capitalExpected: capitalExpected,
                capitalBias: capitalBias,
                publicBias: capitalBias > 0.15 ? '追大球偏热' : capitalBias < -0.15 ? '追小球偏热' : '资金均衡',
                modelDirection: modelDir,
                isContrarian: Math.abs(discrepancy) > 0.30,
                valueDirection: discrepancy > 0 ? '大球(被低估)' : '小球(被低估)',
                discrepancy: discrepancy,
            };
        }

        // --- 最终判断大小球 ---
        // O/U 判定来自比分分布概率和, 确保与比分预测一致
        // overProbability/underProbability 在 _predictScorelines 之后计算
        const isOver = clampedExpected > this.handicap;
        const edge = clampedExpected - this.handicap;

        // --- Sigmoid 置信度 ---
        const absEdge = Math.abs(edge);
        const { steepness, midpoint, baseConfidence, consensusWeight, dataQualityWeight } = this.config.confidence;
        const edgeConf = sigmoid(absEdge, steepness, midpoint);

        // 数据质量
        const dataQuality = this.hasLiveData ? (this.liveData?.data_quality ?? 0.5) : 0.3;

        // 综合置信度
        let confidence = baseConfidence
            + (edgeConf - 0.5) * 0.3       // edge贡献 30% — 降低edge在置信度中的比重
            + (consensus - 0.5) * consensusWeight
            + (dataQuality - 0.3) * dataQualityWeight;

        confidence = clamp(confidence, 0.40, 0.92);

        // --- 推荐强度 ---
        const { strength, strengthLevel } = this._calcStrength(absEdge, confidence, consensus, dataQuality);

        // --- 比分预测 ---
        const scorelines = this._predictScorelines(clampedExpected);
        const overProb = scorelines.reduce((s, sl) => s + (sl.isOver ? sl.probability : 0), 0);
        const underProb = scorelines.reduce((s, sl) => s + (sl.isUnder ? sl.probability : 0), 0);

        // ====== 大比分专用模型 (并行, 不影响主模型) ======
        const scaledAwayDef = 0.5 + (this.away.def - 0.5) * (this.config.defenseScaling || 1.6);
        const scaledHomeDef = 0.5 + (this.home.def - 0.5) * (this.config.defenseScaling || 1.6);
        const strongAtt = Math.max(this.home.att, this.away.att);
        const weakDef = this.home.att > this.away.att ? scaledAwayDef : scaledHomeDef;
        const weakAtt = Math.min(this.home.att, this.away.att);
        const gapRatio = strongAtt / Math.max(weakDef, 0.3);
        const showBlowout = gapRatio > 1.5;

        let blowoutModel = null;
        if (showBlowout) {
            const bc = this.config.blowout;
            const amp = 1.0 + Math.min((gapRatio - bc.gapThreshold) * bc.ampFactor, bc.maxAmplification - 1.0);
            const blowoutXG = (strongAtt * weakDef) * amp * bc.baseMultiplier;
            // 大比分模型也应用赔率修正 (与主模型相同逻辑)
            let blowoutAdjusted = blowoutXG;
            if (this.liveData?.data_source === 'lottery') {
                const capOver = this.liveData.lottery_over_prob || 0.5;
                const capUnder = this.liveData.lottery_under_prob || 0.5;
                const capBias = (capOver - 0.5) * 2;
                const capDir = capOver > capUnder ? '大球' : '小球';
                const bDir = blowoutAdjusted > this.handicap ? '大球' : '小球';
                const { maxAdjustment, agreeBoost, disagreeNudge, disagreeThreshold } = this.config.oddsAux;
                const ma = clamp(capBias * maxAdjustment, -maxAdjustment, maxAdjustment);
                if (bDir === capDir) {
                    blowoutAdjusted *= (1.0 + Math.abs(ma) * agreeBoost);
                } else if (Math.abs(capBias) > disagreeThreshold) {
                    blowoutAdjusted *= (1.0 + ma * disagreeNudge);
                }
            }
            const blowoutClamped = clamp(blowoutAdjusted, 0.5, 8.0);
            const blowoutScores = this._predictBlowout(blowoutClamped);
            const blowoutIsOver = blowoutClamped > this.handicap;
            blowoutModel = {
                expectedGoals: parseFloat(blowoutClamped.toFixed(2)),
                prediction: blowoutIsOver ? '大球' : '小球',
                gapRatio: parseFloat(gapRatio.toFixed(2)),
                ampFactor: parseFloat(amp.toFixed(2)),
                scores: blowoutScores.map(s => ({ score: s.score, probability: parseFloat((s.probability * 100).toFixed(1)), total: s.total })),
            };
        }

        // ====== 诚信风险检测 (积分异常, 不改变预测) ======
        let integrityRisk = null;
        if (this.liveData?.data_source === 'lottery' && this.liveData.lottery_expected_goals > 0) {
            const marketXG = this.liveData.lottery_expected_goals;
            const modelXG = clampedExpected;
            // 标准化偏离: (模型 - 市场) / 市场, 282场均值≈0.12, std≈0.25
            const divergence = (modelXG - marketXG) / Math.max(marketXG, 0.5);
            const absDiv = Math.abs(divergence);
            let level = null, warning = null;
            if (absDiv > 0.50) {
                level = 'high'; warning = '模型与赔率严重偏离(>50%), 建议核实数据来源';
            } else if (absDiv > 0.30) {
                level = 'medium'; warning = '模型与赔率显著偏离(>30%), 关注异常波动';
            }
            if (level) {
                integrityRisk = {
                    level,
                    warning,
                    divergence: parseFloat(divergence.toFixed(3)),
                    modelXG: parseFloat(modelXG.toFixed(2)),
                    marketXG: parseFloat(marketXG.toFixed(2)),
                };
            }
        }

        // 比分分布概率和 — 用于展示, 不改变O/U判定

        // 胜平负 (含主场偏差 + 平局膨胀校准)
        const wm = this.config.winModel;
        // 用homeBias重算攻防比, 再聚合
        const biasedAtt = this.home.att * wm.homeBias;
        const bratio = biasedAtt / (biasedAtt + this.away.att);
        const bhXG = clampedExpected * bratio;
        const baXG = clampedExpected * (1 - bratio);
        // 聚合
        let wH = 0, wD = 0;
        for (const sl of scorelines) {
            if (sl.home > sl.away) wH += sl.probability;
            else if (sl.home === sl.away) wD += sl.probability;
        }
        // 平局膨胀
        wD *= wm.drawInflation;
        const wSum = wH + wD + (1 - wH - wD);
        wH /= wSum; wD /= wSum;
        const wA = 1 - wH - wD;
        const winPred = wH > Math.max(wD, wA) ? '主胜' : wA > Math.max(wH, wD) ? '客胜' : '平局';

        // --- 因子详情 ---
        const factorsDetail = {
            '基础预期进球':    { value: baseVal.toFixed(2),     multiplier: baseVal.toFixed(2) },
            '比赛阶段':        { value: stageF.toFixed(3),      multiplier: stageF.toFixed(3) },
            '战术相克':        { value: tacticF.toFixed(3),     multiplier: tacticF.toFixed(3) },
            '防守质量':        { value: defenseF.toFixed(3),    multiplier: defenseF.toFixed(3) },
            '市场热度(连续)':  { value: marketF.toFixed(3),     multiplier: marketF.toFixed(3) },
            '近期状态':        { value: formF.toFixed(3),       multiplier: formF.toFixed(3) },
            '定位球效率':      { value: setPieceF.toFixed(3),   multiplier: setPieceF.toFixed(3) },
            '心理因素':        { value: psychF.toFixed(3),      multiplier: psychF.toFixed(3) },
            '疲劳因子':        { value: fatigueR.factor.toFixed(3), multiplier: fatigueR.factor.toFixed(3) },
            '主场优势':        { value: homeF.toFixed(3),       multiplier: homeF.toFixed(3) },
            '信息差增强':      { value: infoEdgeR.factor.toFixed(3), multiplier: infoEdgeR.factor.toFixed(3) },
        };

        // --- 生成洞察 ---
        const insights = this._generateInsights(clampedExpected, isOver, edge, consensus, infoEdgeR, fatigueR);

        // --- 生成理由 ---
        const reasons = this._generateReasons(clampedExpected, edge, isOver, factorsDetail, infoEdgeR, consensus);

        // ======== 校准日志 (为未来 Platt Scaling 积累数据) ========
        this._calibrationLog.push({
            timestamp: new Date().toISOString(),
            expected: clampedExpected,
            isOver,
            confidence,
            edge,
            count: this._predictionCount,
        });
        // 保留最近1000条
        if (this._calibrationLog.length > 1000) {
            this._calibrationLog.shift();
        }

        return {
            success: true,
            modelVersion: '3.0',
            prediction: isOver ? '大球' : '小球',
            isOver: isOver,
            strength,
            strengthLevel,
            expectedGoals: parseFloat(clampedExpected.toFixed(2)),
            unclampedExpected: parseFloat(expected.toFixed(2)),
            confidence: parseFloat(confidence.toFixed(3)),
            edge: parseFloat(edge.toFixed(2)),
            handicap: this.handicap,
            homeTeam: this.homeName,
            awayTeam: this.awayName,
            stage: this.stage,
            overProbability: parseFloat(overProb.toFixed(3)),
            underProbability: parseFloat(underProb.toFixed(3)),
            factorConsensus: parseFloat(consensus.toFixed(2)),
            dataQuality: parseFloat(dataQuality.toFixed(2)),
            factorsDetail,
            fatigue: {
                index: parseFloat(fatigueR.fatigueIndex.toFixed(2)),
                percent: parseFloat(fatigueR.fatiguePercent.toFixed(1)),
                secondHalfRatio: parseFloat(fatigueR.secondHalfRatio.toFixed(1)),
                restDays: fatigueR.restDays,
            },
            infoEdge: {
                impact: parseFloat(infoEdgeR.impact.toFixed(4)),
                playerImpact: parseFloat(infoEdgeR.playerImpact.toFixed(3)),
                auxiliaryImpact: parseFloat(infoEdgeR.auxiliaryImpact.toFixed(3)),
                consistency: parseFloat(infoEdgeR.consistency.toFixed(2)),
                summary: infoEdgeR.summary,
                signalCount: infoEdgeR.signals.length,
            },
            // 竞彩赔率资金流向分析 (反向指标)
            marketAnalysis: this._buildMarketAnalysis(isOver, clampedExpected, marketAnalysis),
            blowoutModel: blowoutModel,
            integrityRisk: integrityRisk,
            winPrediction: {
                prediction: winPred,
                homeProb: parseFloat(wH.toFixed(3)),
                drawProb: parseFloat(wD.toFixed(3)),
                awayProb: parseFloat(wA.toFixed(3)),
            },
            topScorelines: scorelines.slice(0, 5).map(s => ({
                score: s.score,
                probability: parseFloat((s.probability * 100).toFixed(1)),
                total: s.total,
                isOver: s.isOver ? '大球' : '小球',
            })),
            insights,
            reasons,
            timestamp: new Date().toISOString(),
        };
    }

    // ==================== 内部方法 ====================

    _calcStrength(edge, confidence, consensus, dataQuality) {
        // 综合 edge + confidence + consensus 三维判断
        const score = edge * 0.4 + (confidence - 0.5) * 0.35 + (consensus - 0.5) * 0.15 + (dataQuality - 0.3) * 0.10;

        if (score > 0.25) return { strength: '⭐⭐⭐ 强烈推荐', strengthLevel: 3 };
        if (score > 0.12) return { strength: '⭐⭐ 推荐', strengthLevel: 2 };
        if (score > 0.04) return { strength: '⭐ 轻微倾向', strengthLevel: 1 };
        return { strength: '⚖️ 观望', strengthLevel: 0 };
    }

    _generateReasons(expected, edge, isOver, factors, infoEdge, consensus) {
        const reasons = [];
        const direction = isOver ? '大于' : '小于';
        reasons.push(`预期进球 ${expected.toFixed(2)} 球，${direction}盘口 ${this.handicap} 球，差值 ${Math.abs(edge).toFixed(2)}`);

        // 按偏离中性排序找出最有影响力的因子
        const sorted = Object.entries(factors)
            .map(([name, d]) => ({ name, dev: Math.abs(parseFloat(d.multiplier) - 1) }))
            .sort((a, b) => b.dev - a.dev);

        for (let i = 0; i < Math.min(3, sorted.length); i++) {
            const f = sorted[i];
            if (f.dev > 0.01) {
                const dirWord = parseFloat(factors[f.name].multiplier) > 1 ? '↑' : '↓';
                reasons.push(`${f.name}: ${dirWord}${(f.dev * 100).toFixed(1)}%`);
            }
        }

        if (consensus > 0.7) {
            reasons.push(`因子共识度高 (${(consensus * 100).toFixed(0)}%)，信号可靠`);
        } else if (consensus < 0.4) {
            reasons.push(`因子分歧较大 (${(consensus * 100).toFixed(0)}%)，建议谨慎`);
        }

        if (infoEdge.impact !== 0) {
            reasons.push(`信息差: ${infoEdge.summary}`);
        }

        return reasons;
    }

    /** 构建赔率辅助分析 */
    _buildMarketAnalysis(modelIsOver, modelExpected, maRef) {
        if (!maRef) return null;
        return {
            capitalDirection: maRef.capitalDirection,
            capitalExpected: typeof maRef.capitalExpected === 'number'
                ? maRef.capitalExpected.toFixed(2) : maRef.capitalExpected,
            publicBias: maRef.publicBias,
            modelDirection: modelIsOver ? '大球' : '小球',
            modelExpected: modelExpected.toFixed(2),
            isContrarian: maRef.isContrarian,
            valueDirection: maRef.valueDirection || '—',
            discrepancy: typeof maRef.discrepancy === 'number'
                ? maRef.discrepancy.toFixed(3) : '0',
        };
    }

    _generateInsights(expected, isOver, edge, consensus, infoEdge, fatigue) {
        const insights = [];

        const confPct = Math.round(clamp(0.5 + Math.abs(edge) / 2, 0.5, 0.9) * 100);
        insights.push(`${isOver ? '大球' : '小球'}倾向，预期 ${expected.toFixed(1)} 球 vs 盘口 ${this.handicap}`);

        if (consensus > 0.7) {
            insights.push('  多因子共识一致，信号可信度较高');
        } else if (consensus < 0.45) {
            insights.push('  因子分歧明显，建议降低仓位');
        }

        if (infoEdge.signals && infoEdge.signals.length >= 3 && infoEdge.consistency > 0.7) {
            insights.push('  信息差多信号共振，增强预测信心');
        } else if (infoEdge.signals && infoEdge.signals.length >= 3 && infoEdge.consistency < 0.45) {
            insights.push('  信息差信号矛盾，实时数据需进一步确认');
        }

        if (fatigue.fatiguePercent > 10) {
            insights.push(`  疲劳影响 ${fatigue.fatiguePercent.toFixed(0)}%，下半场进球占比约 ${fatigue.secondHalfRatio.toFixed(0)}%`);
        }

        if (expected > 3.2) {
            insights.push('  预期进球偏高，可能出现大比分');
        } else if (expected < 1.5) {
            insights.push('  预期进球偏低，可能闷平或小比分');
        }

        if (Math.abs(edge) > 0.5) {
            insights.push('  数据面偏离盘口较大，存在价值投注机会');
        }

        return insights;
    }

    // ==================== 校准 ====================

    /** 获取校准日志 */
    getCalibrationLog() {
        return [...this._calibrationLog];
    }

    /** 简单校准统计 */
    getCalibrationStats() {
        if (this._calibrationLog.length < 10) {
            return { status: 'insufficient_data', count: this._calibrationLog.length };
        }
        const recent = this._calibrationLog.slice(-100);
        const n = recent.length;
        const avgExpected = recent.reduce((s, e) => s + e.expected, 0) / n;
        const avgConfidence = recent.reduce((s, e) => s + e.confidence, 0) / n;
        return {
            status: 'ok',
            sampleSize: n,
            avgExpected: parseFloat(avgExpected.toFixed(2)),
            avgConfidence: parseFloat(avgConfidence.toFixed(3)),
            totalPredictions: this._predictionCount,
        };
    }

    // ==================== 回测 ====================

    /**
     * 回测历史比赛
     * @param {Array} matches - [{ home, away, stage, handicap, actualTotal, ... }]
     * @returns 回测报告
     */
    /** 评估 Top-3 比分准确度 */
    top3ScorelineAccuracy(matches) {
        if (!matches || matches.length === 0) return { accuracy: 0, top1: 0, top2: 0, top3: 0, total: 0 };

        let top1 = 0, top2 = 0, top3 = 0, total = 0;
        const detail = [];

        for (const m of matches) {
            if (!m.hScore && m.hScore !== 0) continue;
            this.setMatch(m.home, m.away, m.stage, m.handicap);
            if (m.situation) this.setSituation(m.situation);
            const r = this.predict();
            const top3Sl = r.topScorelines.map(s => s.score);
            const actualScore = `${m.hScore}-${m.aScore}`;
            const pos = top3Sl.indexOf(actualScore);

            total++;
            if (pos === 0) top1++;
            if (pos >= 0 && pos <= 1) top2++;
            if (pos >= 0) top3++;

            detail.push({
                match: `${m.home} ${m.hScore}-${m.aScore} ${m.away}`,
                top3: top3Sl,
                actual: actualScore,
                position: pos >= 0 ? `Top-${pos + 1}` : 'Miss',
                expectedGoals: r.expectedGoals,
            });
        }

        return {
            accuracy: total > 0 ? parseFloat((top3 / total * 100).toFixed(1)) : 0,
            top1Rate: total > 0 ? parseFloat((top1 / total * 100).toFixed(1)) : 0,
            top2Rate: total > 0 ? parseFloat((top2 / total * 100).toFixed(1)) : 0,
            top3Rate: total > 0 ? parseFloat((top3 / total * 100).toFixed(1)) : 0,
            top1, top2, top3, total,
            detail,
        };
    }

    backtest(matches) {
        if (!Array.isArray(matches) || matches.length === 0) {
            throw new ValidationError('回测需要至少1场比赛数据');
        }

        const results = [];
        let correct = 0;
        let total = 0;
        let sumBrier = 0;
        let sumLogLoss = 0;

        for (const m of matches) {
            try {
                this.setMatch(m.home, m.away, m.stage || '小组赛', m.handicap || 2.5,
                    m.situation || '常规', m.morale || '均衡',
                    { homeAdvantage: m.homeAdvantage ?? false, restDaysHome: m.restDaysHome ?? 7, restDaysAway: m.restDaysAway ?? 7 },
                    m.tournament || null);
                if (m.liveData) this.setLiveData(m.liveData);
                if (m.marketHeat !== undefined) this.setMarketHeat(m.marketHeat);

                const pred = this.predict();
                const matchTotal = m.actualTotal !== undefined ? m.actualTotal : (m.hScore + m.aScore);
                const actualOver = matchTotal > (m.handicap || 2.5);
                const isCorrect = pred.isOver === actualOver;

                if (isCorrect) correct++;
                total++;

                // Brier Score
                const probOver = pred.overProbability;
                const actualBin = actualOver ? 1 : 0;
                const brier = Math.pow(probOver - actualBin, 2);
                sumBrier += brier;

                // Log Loss
                const p = clamp(actualOver ? probOver : (1 - probOver), 0.001, 0.999);
                sumLogLoss += -Math.log(p);

                results.push({
                    match: `${m.home} vs ${m.away}`,
                    expected: pred.expectedGoals,
                    handicap: m.handicap,
                    actual: m.actualTotal,
                    predicted: pred.prediction,
                    actualResult: actualOver ? '大球' : '小球',
                    correct: isCorrect,
                    confidence: pred.confidence,
                    brier: parseFloat(brier.toFixed(4)),
                });
            } catch (e) {
                results.push({
                    match: `${m.home} vs ${m.away}`,
                    error: e.message,
                });
                total++;
            }
        }

        const accuracy = total > 0 ? correct / total : 0;
        const avgBrier = total > 0 ? sumBrier / total : 0;
        const avgLogLoss = total > 0 ? sumLogLoss / total : 0;

        return {
            modelVersion: '3.0',
            totalMatches: total,
            correct: correct,
            accuracy: parseFloat(accuracy.toFixed(4)),
            avgBrierScore: parseFloat(avgBrier.toFixed(4)),
            avgLogLoss: parseFloat(avgLogLoss.toFixed(4)),
            benchmark: {
                randomGuess: 0.5,
                alwaysOver: parseFloat((results.filter(r => r.actualResult === '大球').length / total).toFixed(4)),
                brierRandom: 0.25, // 随机猜测的Brier基准
            },
            results,
            generatedAt: new Date().toISOString(),
        };
    }

    /** 重置校准日志 */
    resetCalibration() {
        this._calibrationLog = [];
        this._predictionCount = 0;
    }
}

// ============================================================
// 竞彩赔率反推引擎 — LotteryOddsAnalyzer
// 从中国体育彩票实时赔率反推隐含概率分布
// ============================================================

class LotteryOddsAnalyzer {

    /**
     * @param {Object} oddsData - 竞彩赔率数据
     * @param {Object} oddsData.totalGoals - 总进球数赔率 { '0':8.50, '1':4.20, '2':3.10, '3':3.50, '4':5.50, '5':9.00, '6':15.0, '7+':22.0 }
     * @param {Object} oddsData.correctScore - 比分赔率 (可选) { '1-0':6.50, '2-1':7.00, ... }
     * @param {Object} oddsData.spf - 胜平负赔率 (可选) { home:2.10, draw:3.20, away:3.50 }
     * @param {Object} oddsData.handicap - 让球胜平负赔率 (可选)
     */
    /** 已知竞彩数据源 */
    static SOURCES = {
        // 中国竞彩网 — 最权威
        SPORTERY: 'https://www.sporttery.cn/jc/js/opensj/js/qc/zq_skj.js',
        // 备用: 500.com API 风格
        W500: 'https://live.500.com/detail.php?fid=',
        // 备用: 新浪彩票数据
        SINA: 'https://odds.sina.com.cn/',
    };

    /**
     * 抓取实时赔率 (尝试多个数据源)
     * @param {string} matchId - 可选, 比赛ID
     * @returns {Promise<Object>} oddsData 或 null
     */
    static async fetchLiveOdds(matchId) {
        // 尝试竞彩官网 JSONP 接口
        const urls = [
            `https://www.sporttery.cn/jc/js/opensj/js/qc/zq_skj.js?t=${Date.now()}`,
            matchId ? `https://live.500.com/detail.php?fid=${matchId}` : null,
        ].filter(Boolean);

        for (const url of urls) {
            try {
                const resp = await fetch(url, {
                    mode: 'cors',
                    headers: { 'Accept': 'application/json, text/plain, */*' },
                    signal: AbortSignal.timeout(5000),
                });
                if (resp.ok) {
                    const text = await resp.text();
                    const data = LotteryOddsAnalyzer.parseResponse(text, url);
                    if (data) return data;
                }
            } catch (e) {
                // CORS 可能阻止，尝试下一个源
            }
        }

        // 备用: 通过 JSONP 风格加载
        try {
            const data = await LotteryOddsAnalyzer.jsonpFetch(
                `https://www.sporttery.cn/jc/js/opensj/js/qc/zq_skj.js?callback=oddsCallback&t=${Date.now()}`
            );
            if (data) return data;
        } catch (e) {}

        return null;
    }

    /** 解析竞彩 API 响应 */
    static parseResponse(text, url) {
        // 竞彩官网格式: var data={...}; 或 callback({...})
        const jsonMatch = text.match(/(?:var\s+\w+\s*=\s*|callback\s*\()?(\[[\s\S]*?\]|\{[\s\S]*?\})\s*\)?\s*;?\s*$/m);
        if (!jsonMatch) {
            // 尝试直接 JSON 解析
            try { return JSON.parse(text); } catch (e) { return null; }
        }
        try {
            const parsed = JSON.parse(jsonMatch[1]);
            // 转换为标准格式
            if (Array.isArray(parsed)) {
                return LotteryOddsAnalyzer.fromSportteryArray(parsed);
            }
            return parsed;
        } catch (e) {
            return null;
        }
    }

    /** JSONP 抓取 */
    static jsonpFetch(url) {
        return new Promise((resolve, reject) => {
            const callbackName = 'oddsCallback_' + Date.now();
            const script = document.createElement('script');
            const timeout = setTimeout(() => {
                cleanup();
                reject(new Error('JSONP timeout'));
            }, 5000);

            const cleanup = () => {
                clearTimeout(timeout);
                delete window[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);
            };

            window[callbackName] = (data) => {
                cleanup();
                resolve(LotteryOddsAnalyzer.fromSportteryArray(data));
            };

            script.src = url.replace('oddsCallback', callbackName);
            script.onerror = () => { cleanup(); reject(new Error('JSONP load error')); };
            document.head.appendChild(script);
        });
    }

    /** 从竞彩官网数组格式转换 */
    static fromSportteryArray(arr) {
        // 竞彩数据格式: [matchId, league, home, away, ..., spf: [h,d,a], rqs: [...], totalGoals: [...]]
        // 每个元素可能是嵌套数组
        const matches = [];
        for (const item of arr) {
            if (!Array.isArray(item) || item.length < 20) continue;
            matches.push({
                matchId: item[0],
                home: item[2],
                away: item[3],
                spf: item[10] ? { home: parseFloat(item[10]), draw: parseFloat(item[11]), away: parseFloat(item[12]) } : null,
                totalGoals: item[13] ? {
                    '0': parseFloat(item[13]), '1': parseFloat(item[14]), '2': parseFloat(item[15]),
                    '3': parseFloat(item[16]), '4': parseFloat(item[17]), '5': parseFloat(item[18]),
                    '6': parseFloat(item[19]), '7+': parseFloat(item[20]),
                } : null,
            });
        }
        return matches;
    }

    constructor(oddsData = {}) {
        this.oddsData = oddsData;
        this.handicap = oddsData.handicapLine || 2.5;
    }

    setOdds(oddsData) {
        this.oddsData = oddsData;
        if (oddsData.handicapLine) this.handicap = oddsData.handicapLine;
        return this;
    }

    // ==================== 核心方法 ====================

    /**
     * 从总进球数赔率反推隐含概率分布
     * 使用标准化方法去除庄家抽水(overround)
     * @returns {Object} { distribution, overround, expectedGoals, overProb, underProb }
     */
    analyzeTotalGoals() {
        const tg = this.oddsData.totalGoals;
        if (!tg) return { error: '缺少总进球数赔率数据', distribution: null };

        // Step 1: 赔率 → 原始概率
        const entries = Object.entries(tg).map(([goals, odds]) => ({
            goals: goals === '7+' ? 7 : parseInt(goals),
            odds: parseFloat(odds),
            rawProb: 1 / parseFloat(odds),
        }));

        // Step 2: 计算 overround (总概率 > 1 的部分为庄家利润)
        const sumRaw = entries.reduce((s, e) => s + e.rawProb, 0);
        const overround = sumRaw - 1.0;

        // Step 3: 标准化 + 重归一化 (去除抽水)
        // 方法: Basic normalization (分摊法)
        const totalWeight = entries.reduce((s, e) => s + Math.sqrt(e.rawProb), 0);
        entries.forEach(e => {
            e.trueProb = e.rawProb / sumRaw; // 等比缩放
            e.adjProb = Math.sqrt(e.rawProb) / totalWeight; // 平方根分摊
        });

        // 用 trueProb 作为最终概率 (等比缩放最常用)
        const distribution = {};
        entries.forEach(e => { distribution[e.goals] = parseFloat(e.trueProb.toFixed(4)); });

        // Step 4: 计算预期进球
        const expectedGoals = entries.reduce((s, e) => s + e.goals * e.trueProb, 0);

        // Step 5: 大小球概率
        const overProb = entries.filter(e => e.goals > this.handicap).reduce((s, e) => s + e.trueProb, 0);
        const underProb = entries.filter(e => e.goals < this.handicap).reduce((s, e) => s + e.trueProb, 0);
        const pushProb = 1 - overProb - underProb;

        return {
            distribution,
            overround: parseFloat(overround.toFixed(4)),
            overroundPercent: parseFloat((overround * 100).toFixed(1)),
            expectedGoals: parseFloat(expectedGoals.toFixed(2)),
            overProb: parseFloat(overProb.toFixed(4)),
            underProb: parseFloat(underProb.toFixed(4)),
            pushProb: parseFloat(pushProb.toFixed(4)),
            marketPrediction: overProb > underProb ? '大球' : '小球',
            marketConfidence: parseFloat(Math.abs(overProb - underProb).toFixed(3)),
        };
    }

    /**
     * 从比分赔率反推比分分布
     * 竞彩通常提供 31 种比分选项
     */
    analyzeCorrectScore() {
        const cs = this.oddsData.correctScore;
        if (!cs) return { error: '缺少比分赔率数据', distribution: null };

        const entries = Object.entries(cs).map(([score, odds]) => {
            const [h, a] = score.split('-').map(Number);
            return {
                score,
                home: h,
                away: a,
                total: h + a,
                odds: parseFloat(odds),
                rawProb: 1 / parseFloat(odds),
            };
        });

        const sumRaw = entries.reduce((s, e) => s + e.rawProb, 0);
        const overround = sumRaw - 1.0;

        // Normalize
        entries.forEach(e => { e.prob = e.rawProb / sumRaw; });

        // 按概率排序
        entries.sort((a, b) => b.prob - a.prob);

        // 计算总球数分布 (从比分聚合)
        const totalDist = {};
        entries.forEach(e => {
            totalDist[e.total] = (totalDist[e.total] || 0) + e.prob;
        });

        // 大小球
        const overProb = entries.filter(e => e.total > this.handicap).reduce((s, e) => s + e.prob, 0);
        const underProb = entries.filter(e => e.total < this.handicap).reduce((s, e) => s + e.prob, 0);

        // 预期进球
        const expectedGoals = entries.reduce((s, e) => s + e.total * e.prob, 0);

        return {
            topScorelines: entries.slice(0, 8).map(e => ({
                score: e.score,
                odds: e.odds,
                probability: parseFloat(e.prob.toFixed(4)),
            })),
            totalDistribution: totalDist,
            overround: parseFloat(overround.toFixed(4)),
            expectedGoals: parseFloat(expectedGoals.toFixed(2)),
            overProb: parseFloat(overProb.toFixed(4)),
            underProb: parseFloat(underProb.toFixed(4)),
            scoreCount: entries.length,
        };
    }

    /**
     * 从胜平负赔率反推隐含胜率
     * 可辅助判断比赛开放程度
     */
    analyzeSPF() {
        const spf = this.oddsData.spf;
        if (!spf) return null;

        const homeRaw = 1 / (spf.home || 2.0);
        const drawRaw = 1 / (spf.draw || 3.0);
        const awayRaw = 1 / (spf.away || 3.0);
        const sum = homeRaw + drawRaw + awayRaw;

        const homeProb = homeRaw / sum;
        const drawProb = drawRaw / sum;
        const awayProb = awayRaw / sum;
        const overround = sum - 1;

        // 判断比赛开放度: 平局概率低 = 更可能分出胜负 = 更开放
        const openness = 1 - drawProb;

        return {
            homeProb: parseFloat(homeProb.toFixed(4)),
            drawProb: parseFloat(drawProb.toFixed(4)),
            awayProb: parseFloat(awayProb.toFixed(4)),
            openness: parseFloat(openness.toFixed(3)),
            favoriteStrength: parseFloat(Math.abs(homeProb - awayProb).toFixed(3)),
            overround: parseFloat(overround.toFixed(4)),
        };
    }

    /**
     * 综合赔率分析 — 融合所有数据源
     * @returns 标准化的"市场共识"信号，可直接送入 InfoEdge
     */
    comprehensiveAnalysis() {
        const tgResult = this.analyzeTotalGoals();
        const csResult = this.analyzeCorrectScore();
        const spfResult = this.analyzeSPF();

        // 融合总进球和比分分析
        let overProb = null;
        let underProb = null;
        let expectedGoals = null;
        let sources = [];

        if (!tgResult.error) {
            overProb = tgResult.overProb;
            underProb = tgResult.underProb;
            expectedGoals = tgResult.expectedGoals;
            sources.push('totalGoals');
        }

        if (!csResult.error && csResult.scoreCount > 0) {
            // 比分数据通常更精确，权重更高
            if (overProb !== null) {
                overProb = overProb * 0.4 + csResult.overProb * 0.6;
                underProb = underProb * 0.4 + csResult.underProb * 0.6;
            } else {
                overProb = csResult.overProb;
                underProb = csResult.underProb;
            }
            if (expectedGoals !== null) {
                expectedGoals = expectedGoals * 0.4 + csResult.expectedGoals * 0.6;
            } else {
                expectedGoals = csResult.expectedGoals;
            }
            sources.push('correctScore');
        }

        if (sources.length === 0) {
            return { error: '无可用赔率数据', marketConsensus: null };
        }

        // 市场共识方向
        const marketDirection = overProb > underProb ? '大球' : '小球';
        // 市场置信度 = 大小球概率差的绝对值
        const marketConfidence = Math.abs(overProb - underProb);

        // 转换为 InfoEdge 兼容的信号格式
        // positive value = 倾向大球, negative = 倾向小球
        const marketSignal = (overProb - underProb) * 0.5; // 缩放到 [-0.25, 0.25] 范围

        // 开盘隐含的盘口"合理值" — 如果市场预期 2.8 球而我们预测 2.3，存在偏差
        const marketImpliedLine = expectedGoals;

        // SPF 开放度作为辅助
        let openness = 0.5;
        let favoriteStrength = 0;
        if (spfResult) {
            openness = spfResult.openness;
            favoriteStrength = spfResult.favoriteStrength;
        }

        return {
            success: true,
            sources,
            marketDirection,
            marketConfidence: parseFloat(marketConfidence.toFixed(4)),
            marketSignal: parseFloat(marketSignal.toFixed(4)),
            marketExpectedGoals: parseFloat(expectedGoals.toFixed(2)),
            marketOverProb: parseFloat(overProb.toFixed(4)),
            marketUnderProb: parseFloat(underProb.toFixed(4)),
            openness: parseFloat(openness.toFixed(3)),
            favoriteStrength: parseFloat(favoriteStrength.toFixed(3)),
            // 子结果
            totalGoalsAnalysis: tgResult,
            correctScoreAnalysis: csResult,
            spfAnalysis: spfResult,
        };
    }

    /**
     * 生成 InfoEdge 实时数据格式
     * 可直接传入 predictor.setLiveData()
     */
    toLiveData(homeTeam, awayTeam) {
        const analysis = this.comprehensiveAnalysis();
        if (analysis.error) return null;

        return {
            data_source: 'lottery',
            data_quality: 0.95, // 真实赔率数据质量极高
            hours_to_match: 2,

            // 赔率衍生信号
            lottery_over_prob: analysis.marketOverProb,
            lottery_under_prob: analysis.marketUnderProb,
            lottery_expected_goals: analysis.marketExpectedGoals,
            lottery_direction: analysis.marketDirection,
            lottery_confidence: analysis.marketConfidence,
            lottery_openness: analysis.openness,
            lottery_favorite_strength: analysis.favoriteStrength,

            // 总进球分布
            total_goals_distribution: analysis.totalGoalsAnalysis.distribution || null,
            overround: analysis.totalGoalsAnalysis.overround || null,
            overround_percent: analysis.totalGoalsAnalysis.overroundPercent || null,

            // 比分分布 Top5
            scoreline_distribution: analysis.correctScoreAnalysis.topScorelines || null,

            // 原始赔率携带
            raw_total_goals_odds: this.oddsData.totalGoals || null,
            raw_correct_score_odds: this.oddsData.correctScore || null,

            // 兼容旧 InfoEdge 字段
            odds_change_15min: analysis.marketSignal,
            odds_change_1h: analysis.marketSignal * 0.5,
            over_odds: this.oddsData.totalGoals ? 1.85 : null,
            under_odds: this.oddsData.totalGoals ? 1.90 : null,
        };
    }
}

// ============================================================
// 赛事新闻信号检测引擎 — MatchNewsAnalyzer
// 自动扫描新闻文本, 识别关键信号并调整因子配比
// ============================================================

class MatchNewsAnalyzer {
    // 信号规则: { pattern, target, impact, weight }
    static SIGNALS = [
        // 伤病/缺阵 → 球员因子
        { pattern: /受伤|伤病|injury|伤停|缺阵|缺席|无缘|out of|ruled out|不参|未随队|落选|退出/i, target: 'player', impact: +1, weight: 0.9, desc: '球员缺阵' },
        { pattern: /复出|回归|伤愈|恢复训练|return|fit again|复帰/i, target: 'player', impact: -1, weight: 0.7, desc: '球员复出' },
        // 将帅冲突 → 心理士气
        { pattern: /冲突|矛盾|不和|争吵|内讧|罢训|将帅|conflict|dispute|rift|fallout|mutiny/i, target: 'psyMorale', value:'将帅不和', weight: 0.95, desc: '内部矛盾' },
        { pattern: /换帅|新帅|新教练|上任|new coach|new manager|appointed/i, target: 'psyMorale', value:'新帅效应', weight: 0.8, desc: '新帅上任' },
        { pattern: /连胜|势头正盛|势不可挡|winning streak|in form|unstoppable/i, target: 'psyMorale', value:'连胜势头', weight: 0.7, desc: '连胜势头' },
        { pattern: /连败|低迷|不胜|losing streak|slump|poor form|winless/i, target: 'psyMorale', value:'连败低迷', weight: 0.85, desc: '连败低迷' },
        // 战意/轮换
        { pattern: /轮换|留力|替补|reserve|rotation|rest players|squad rotation|替补出战/i, target: 'psyStake', value:'已晋级轮换', weight: 0.85, desc: '轮换留力' },
        { pattern: /生死战|必须赢|背水一战|do or die|must win|must-win|决战|决胜/i, target: 'psyStake', value:'出线生死战', weight: 0.9, desc: '出线生死战' },
        { pattern: /荣誉之战|为荣誉|pride|honour match|consolation/i, target: 'psyStake', value:'荣誉之战', weight: 0.7, desc: '荣誉之战' },
        // 宿敌/德比
        { pattern: /德比|宿敌|死敌|世仇|derby|rival|rivalry|仇敌|恩怨/i, target: 'psyHistory', value:'宿敌对决', weight: 0.9, desc: '宿敌对决' },
        // 打平出线
        { pattern: /打平出线|平局出线|平局晋级|draw enough|draw will do|平即可/i, target: 'psyMentality', value:'打平出线', weight: 0.9, desc: '打平出线心态' },
        // 天气
        { pattern: /暴雨|大雨|暴雪|台风|heatwave|热浪|extreme weather|heavy rain|snow|storm|极寒/i, target: 'infoEdge', impact: -0.5, weight: 0.6, desc: '极端天气' },
        // 裁判
        { pattern: /裁判|referee|争议判罚|争议判|红牌|罚下|VAR|controversial ref/i, target: 'psyExternal', value:'裁判争议', weight: 0.6, desc: '裁判关注' },
        // 疲劳/赛程
        { pattern: /疲劳|密集赛程|3天.*赛|背靠背|tired|fatigue|congested fixture|三天.赛/i, target: 'fatigue', impact: +2, weight: 0.7, desc: '赛程疲劳' },
        // 战术泄露
        { pattern: /战术泄露|首发泄露|lineup leaked|tactics leaked|训练.*曝光/i, target: 'infoEdge', impact: 0.3, weight: 0.5, desc: '战术泄露' },
    ];

    constructor(newsText) {
        this.rawText = newsText || '';
        this.signals = [];
        this.adjustments = {};
        if (this.rawText) this.analyze();
    }

    analyze(text) {
        const txt = text || this.rawText;
        if (!txt) return this;
        this.signals = [];
        this.adjustments = {};
        for (const sig of MatchNewsAnalyzer.SIGNALS) {
            if (sig.pattern.test(txt)) {
                this.signals.push({ desc: sig.desc, target: sig.target, weight: sig.weight });
                if (!this.adjustments[sig.target]) this.adjustments[sig.target] = [];
                this.adjustments[sig.target].push(sig);
            }
        }
        return this;
    }

    /** 应用检测到的信号到预测器 */
    applyTo(predictor) {
        if (!predictor) return { applied: [] };
        const applied = [];
        for (const [target, sigs] of Object.entries(this.adjustments)) {
            const top = sigs.sort((a, b) => b.weight - a.weight)[0]; // 最强信号
            switch (target) {
                case 'player':
                    const missing = sigs.filter(s => s.impact > 0).length;
                    predictor.setPlayerMissing(missing, 0);
                    applied.push(`球员缺阵×${missing}`);
                    break;
                case 'psyMorale':
                case 'psyStake':
                case 'psyHistory':
                case 'psyMentality':
                case 'psyExternal':
                    if (top.value && predictor.psyState) {
                        const key = target.replace('psy','').toLowerCase();
                        predictor.psyState[key] = top.value;
                        applied.push(top.desc);
                    }
                    break;
                case 'fatigue':
                    if (top.impact) {
                        predictor.restDaysHome = Math.max(3, (predictor.restDaysHome || 7) - top.impact);
                        predictor.restDaysAway = Math.max(3, (predictor.restDaysAway || 7) - top.impact);
                        applied.push(top.desc);
                    }
                    break;
                case 'infoEdge':
                    applied.push(top.desc);
                    break;
            }
        }
        return { applied, signalCount: this.signals.length, details: this.signals };
    }
}

// ============================================================
// 心理状态自动推理引擎 — PsychStateAnalyzer
// 从球队数据+比赛背景自动推导六维心理状态
// ============================================================

class PsychStateAnalyzer {
    /**
     * @param {Object} home - 主队 TEAM_DATABASE 条目
     * @param {Object} away - 客队 TEAM_DATABASE 条目
     * @param {string} stage - 比赛阶段
     * @param {string} tournament - 赛事类型
     * @param {Object} context - 额外上下文: standings, recentResults, h2h
     */
    static analyze(home, away, stage, tournament, context = {}) {
        const result = { stake:'常规', morale:'均衡', pressure:'常态', mentality:'常态', external:'中立场地', history:'无特别' };
        const reasons = {};
        const hForm = home?.form || 1.5, aForm = away?.form || 1.5;

        // 1. 战意 — 基于比赛阶段和赛事类型
        if (stage === '决赛') { result.stake = '出线生死战'; reasons.stake = '决赛: 双方全力以赴'; }
        else if (stage === '半决赛') { result.stake = '出线生死战'; reasons.stake = '半决赛: 离决赛一步之遥'; }
        else if (stage === '三四名决赛') { result.stake = '荣誉之战'; reasons.stake = '三四名: 荣誉之战'; }
        else if (tournament === 'Qualifier') { result.stake = '出线生死战'; reasons.stake = '预选赛: 事关晋级'; }
        else if (context.standings === 'mustWin') { result.stake = '出线生死战'; reasons.stake = '必须赢球才能晋级'; }
        else if (context.standings === 'alreadyQualified') { result.stake = '已晋级轮换'; reasons.stake = '已出线, 可能轮换'; }
        else { reasons.stake = '常规小组赛'; }

        // 2. 士气 — 基于近期状态
        if (hForm >= 2.0 && aForm >= 2.0) { result.morale = '连胜势头'; reasons.morale = '双方状态火热 (均分≥2.0)'; }
        else if (hForm >= 2.2) { result.morale = '连胜势头'; reasons.morale = '主队状态极佳 (form≥2.2)'; }
        else if (aForm >= 2.2) { result.morale = '连胜势头'; reasons.morale = '客队状态极佳 (form≥2.2)'; }
        else if (hForm < 1.3 && aForm < 1.3) { result.morale = '连败低迷'; reasons.morale = '双方状态低迷 (均分<1.3)'; }
        else if (hForm < 1.2 || aForm < 1.2) { result.morale = '连败低迷'; reasons.morale = '一方状态极差 (form<1.2)'; }
        else { reasons.morale = '状态均衡'; }

        // 3. 抗压 — 淘汰赛阶段
        if (stage.includes('决赛') || stage.includes('半决赛')) { result.pressure = '关键战役'; reasons.pressure = stage + ': 高压淘汰赛'; }
        else if (stage.includes('1/4') || stage.includes('1/8')) { result.pressure = '关键战役'; reasons.pressure = '淘汰赛: 一场定胜负'; }
        else { reasons.pressure = '小组赛: 有容错空间'; }

        // 4. 战术心态 — 通常默认, 除非有特殊信号
        if (context.standings === 'drawEnough') { result.mentality = '打平出线'; reasons.mentality = '打平即可出线'; }
        else if (context.standings === 'mustWin') { result.mentality = '久攻不下'; reasons.mentality = '必须赢球, 可能急躁'; }
        else { reasons.mentality = '常规战术心态'; }

        // 5. 外部环境 — 主场优势
        if (context.homeAdvantage) { result.external = '主场氛围'; reasons.external = '主场作战'; }
        else if (context.awayPressure) { result.external = '客场压力'; reasons.external = '客场作战'; }
        else { reasons.external = '中立场地'; }

        // 6. 历史惯性 — 基于实力对比
        if (home && away) {
            const fifaGap = Math.abs((home.fifa || 1500) - (away.fifa || 1500));
            if (fifaGap > 200) { result.history = home.fifa > away.fifa ? '历史优势' : '历史劣势'; reasons.history = 'FIFA差距>200分'; }
            else if (context.rivalry) { result.history = '宿敌对决'; reasons.history = '历史宿敌/德比'; }
            else { reasons.history = '无特殊历史惯性'; }
        }

        return { state: result, reasons };
    }
}

// ==================== 深层合并工具 ====================
function deepMerge(target, ...sources) {
    for (const src of sources) {
        if (!src || typeof src !== 'object') continue;
        for (const key of Object.keys(src)) {
            if (src[key] && typeof src[key] === 'object' && !Array.isArray(src[key])) {
                target[key] = deepMerge(target[key] || {}, src[key]);
            } else {
                target[key] = src[key];
            }
        }
    }
    return target;
}

// ==================== 模拟实时数据生成器 (可复现) ====================
function generateMockLiveData(homeTeam, awayTeam, seed = null) {
    // 可选的伪随机数生成器
    let rng = Math.random;
    if (seed !== null && seed !== undefined) {
        rng = mulberry32(seed);
    }

    const home = TEAM_DATABASE[homeTeam] || Object.values(TEAM_DATABASE)[0];
    const away = TEAM_DATABASE[awayTeam] || Object.values(TEAM_DATABASE)[1];

    const injuryPool = [
        { player: '主力前锋', position: 'FW', status: '小伤上场' },
        { player: '中场核心', position: 'MF', status: '出战成疑' },
        { player: '主力中卫', position: 'DF', status: '缺阵' },
        { player: '边路快马', position: 'FW', status: '带伤出战' },
        { player: '防守后腰', position: 'MF', status: '疑' },
        { player: '主力门将', position: 'GK', status: '小伤上场' },
        { player: '替补前锋', position: 'FW', status: 'OUT' },
        { player: '边后卫', position: 'DF', status: '出战成疑' },
    ];

    const injuryCount = Math.floor(rng() * 4);
    const shuffled = [...injuryPool].sort(() => rng() - 0.5);
    const injuries = shuffled.slice(0, injuryCount);

    const oddsChange15min = (rng() - 0.5) * 0.25;
    const oddsChange1h = oddsChange15min * 0.5 + (rng() - 0.5) * 0.1;

    const rotationHints = [
        '赛前训练显示有轮换迹象', '预计全主力出战', '最强阵容出击',
        '可能轮换部分主力', '多名替补参与赛前合练', '首发阵容基本确定',
        null, null,
    ];
    const lineupHints = [
        '预计全主力出战', '可能有轮换', '防守为主', '正常阵容',
        '进攻阵型预期', '主力攻击手首发',
    ];
    const pressTexts = [
        '主教练表示会谨慎应对', '球队会立足防守打反击', '教练强调进攻',
        '伤病情况不乐观', '对这场比赛信心十足', '会全力争胜',
    ];

    return {
        home_team: homeTeam,
        away_team: awayTeam,
        match_time: '2026-06-20 21:00',
        over_odds: 1.80 + rng() * 0.50,
        under_odds: 1.80 + rng() * 0.50,
        handicap: 2.5,
        odds_change_24h: (rng() - 0.5) * 0.15,
        odds_change_1h: oddsChange1h,
        odds_change_15min: oddsChange15min,
        over_volume: 50 + rng() * 25,
        over_volume_change: (rng() - 0.5) * 8,
        home_injuries: injuries.slice(0, Math.ceil(injuryCount / 2)),
        away_injuries: injuries.slice(Math.ceil(injuryCount / 2)),
        home_lineup_hint: lineupHints[Math.floor(rng() * lineupHints.length)],
        away_lineup_hint: lineupHints[Math.floor(rng() * lineupHints.length)],
        rotation_hint: rotationHints[Math.floor(rng() * rotationHints.length)],
        home_press_conference: rng() > 0.5 ? pressTexts[Math.floor(rng() * pressTexts.length)] : null,
        away_press_conference: rng() > 0.5 ? pressTexts[Math.floor(rng() * pressTexts.length)] : null,
        weather: rng() > 0.7 ? (rng() > 0.5 ? '小雨' : '多云') : '晴',
        temperature: 20 + rng() * 15,
        referee: '主裁判',
        referee_style: rng() > 0.5 ? '执法偏松' : '执法严格',
        h2h_matches: Math.floor(rng() * 8) + 2,
        h2h_avg_goals: 2.0 + rng() * 1.5,
        h2h_over_rate: 0.35 + rng() * 0.35,
        data_quality: 0.65 + rng() * 0.25,
        last_update: new Date().toISOString(),
        data_source: 'mock',
        hours_to_match: 1 + rng() * 23,
    };
}

/** 伪随机数生成器 (可复现) */
function mulberry32(a) {
    return function () {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// ==================== 球队列表 ====================
function getTeamList() {
    return Object.keys(TEAM_DATABASE).sort();
}

// ==================== 导出 ====================
if (typeof window !== 'undefined') {
    window.WorldCupPredictor = WorldCupPredictor;
    window.LotteryOddsAnalyzer = LotteryOddsAnalyzer;
    window.MatchNewsAnalyzer = MatchNewsAnalyzer;
    window.PsychStateAnalyzer = PsychStateAnalyzer;
    window.generateMockLiveData = generateMockLiveData;
    window.getTeamList = getTeamList;
    window.TEAM_DATABASE = TEAM_DATABASE;
    window.CONFIG = CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WorldCupPredictor, LotteryOddsAnalyzer, generateMockLiveData, getTeamList, TEAM_DATABASE, CONFIG };
}
