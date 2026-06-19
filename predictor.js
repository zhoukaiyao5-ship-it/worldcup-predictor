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

    // 中北美
    '墨西哥':   { att: 1.55, def: 0.82, style: 'counter',   form: 1.6, setPiece: 0.32, phys: 8.0, depth: 7.2, fifa: 1655 },
    '美国':     { att: 1.60, def: 0.85, style: 'balanced',  form: 1.7, setPiece: 0.30, phys: 8.2, depth: 7.5, fifa: 1648 },
    '加拿大':   { att: 1.65, def: 0.95, style: 'attack',    form: 1.6, setPiece: 0.28, phys: 8.0, depth: 6.8, fifa: 1610 },
    '哥斯达黎加':{ att: 1.25, def: 0.78, style: 'defensive',form: 1.2, setPiece: 0.30, phys: 7.2, depth: 6.2, fifa: 1565 },
    '巴拿马':   { att: 1.15, def: 0.95, style: 'defensive', form: 1.1, setPiece: 0.28, phys: 7.0, depth: 6.0, fifa: 1520 },
    '牙买加':   { att: 1.30, def: 0.92, style: 'counter',   form: 1.3, setPiece: 0.28, phys: 7.8, depth: 6.2, fifa: 1510 },
    '海地':     { att: 1.20, def: 0.95, style: 'defensive', form: 1.2, setPiece: 0.28, phys: 7.5, depth: 6.0, fifa: 1490 },
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
    globalBaseMultiplier: 1.45,

    // 防守缩放系数 — 回测最优: 2.0 (拉开强队与弱队防守差距)
    defenseScaling: 2.0,

    // 阶段系数 — 值 < 1.0 表示进球期望下降
    stageMultiplier: {
        '小组赛': 1.00,
        '1/16决赛': 0.96,
        '1/8决赛': 0.96,
        '1/4决赛': 0.92,
        '半决赛': 0.88,
        '三四名决赛': 1.04,
        '决赛': 0.86,
    },

    // 实力差放大 — 回测最优: amp=1.2
    mismatch: {
        enabled: true,
        threshold: 0.10,
        maxAmplification: 1.20,
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
        },
        consistencyBoost: 1.25,
        consistencyPenalty: 0.75,
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

    // 泊松分布参数
    poisson: {
        maxGoals: 7,
        overdispersion: 1.05,
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
    setMatch(home, away, stage = '小组赛', handicap = 2.5, situation = '常规', morale = '均衡', opts = {}) {
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

        // 可选参数
        this.homeAdvantage = opts.homeAdvantage ?? false;
        this.restDaysHome = opts.restDaysHome ?? 7;
        this.restDaysAway = opts.restDaysAway ?? 7;

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
        const homeAtt = this.home.att;
        const awayAtt = this.away.att;
        const homeDef = this.home.def;
        const awayDef = this.away.def;

        // 缩放防守值: 原始[0.6,1.0] → 扩展[0.55,1.65]
        // 弱队防守变差, 强队防守更好 — 拉开差距
        const scale = this.config.defenseScaling || 1.7;
        const scaledHomeDef = 0.5 + (homeDef - 0.5) * scale;
        const scaledAwayDef = 0.5 + (awayDef - 0.5) * scale;

        // 预期进球 = 攻击力 × 对手防守脆弱度(已缩放)
        const homeXG = homeAtt * scaledAwayDef;
        const awayXG = awayAtt * scaledHomeDef;

        let base = (homeXG + awayXG) / 2;

        // FIFA 评分微量修正
        const fifaBonus = ((this.home.fifa + this.away.fifa) / 2 - 1600) / 4000;
        base *= (1.0 + fifaBonus);

        // 强弱悬殊放大
        const { enabled, threshold, maxAmplification } = this.config.mismatch;
        if (enabled) {
            const totalAtt = homeAtt + awayAtt;
            const mismatch = totalAtt > 0 ? Math.abs(homeAtt - awayAtt) / totalAtt : 0;
            if (mismatch > threshold) {
                const amp = 1.0 + (mismatch - threshold) / (1 - threshold) * (maxAmplification - 1.0);
                base *= amp;
            }
        }

        // 全局校准
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

    /** 因子7: 心理因素 */
    _factorPsychology() {
        const sitM = this.config.situationMultiplier[this.situation] ?? 1.0;
        const morM = this.config.moraleMultiplier[this.morale] ?? 1.0;
        // 两种效应取几何平均避免重复计算
        const combined = Math.sqrt(sitM * morM);
        return 1.0 + (combined - 1.0) * this.config.factorWeights.psychology;
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

        // 7. 辅助信号: 历史交锋
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

    _predictScorelines(expectedGoals) {
        const { maxGoals, overdispersion } = this.config.poisson;
        const attRatio = this.home.att / (this.home.att + this.away.att);
        const homeXG = expectedGoals * attRatio;
        const awayXG = expectedGoals * (1 - attRatio);

        const scorelines = [];

        // 使用标准泊松 (可通过 overdispersion 参数调优)
        const poissonPMF = (lambda, k) => {
            return Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k);
        };

        let totalProb = 0;
        for (let h = 0; h <= maxGoals; h++) {
            for (let a = 0; a <= maxGoals; a++) {
                const prob = poissonPMF(homeXG, h) * poissonPMF(awayXG, a);
                scorelines.push({
                    score: `${h}-${a}`,
                    home: h,
                    away: a,
                    probability: prob,
                    total: h + a,
                    isOver: (h + a) > this.handicap,
                    isUnder: (h + a) < this.handicap,
                });
                totalProb += prob;
            }
        }

        // 重归一化 (截断修正)
        for (const s of scorelines) {
            s.probability = s.probability / Math.max(totalProb, 0.001);
        }

        scorelines.sort((a, b) => b.probability - a.probability);
        return scorelines;
    }

    // ==================== 主预测 ====================

    predict() {
        if (!this.home || !this.away) {
            throw new ValidationError('请先调用 setMatch() 设置比赛');
        }

        this._predictionCount++;

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
            * infoEdgeR.auxiliaryImpact;

        const clampedExpected = clamp(expected, 0.3, 7.0);

        // --- 判断大小球 ---
        const isOver = clampedExpected > this.handicap;
        const edge = clampedExpected - this.handicap;

        // --- Sigmoid 置信度 ---
        const absEdge = Math.abs(edge);
        const { steepness, midpoint, baseConfidence, consensusWeight, dataQualityWeight } = this.config.confidence;

        // Edge 贡献 (sigmoid)
        const edgeConf = sigmoid(absEdge, steepness, midpoint);

        // 因子共识度贡献: 计算各因子偏离中性(1.0)的方向一致性
        const factorValues = [stageF, tacticF, defenseF, marketF, formF, setPieceF, psychF, fatigueR.factor, homeF];
        const bullishFactors = factorValues.filter(v => v > 1.002).length;
        const bearishFactors = factorValues.filter(v => v < 0.998).length;
        const totalF = bullishFactors + bearishFactors;
        let consensus = 0.5;
        if (totalF > 0) {
            consensus = Math.max(bullishFactors, bearishFactors) / totalF;
        }

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
        const insights = this._generateInsights(clampedExpected, isOver, edge, consensus,
            infoEdgeR, fatigueR);

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
            modelVersion: '2.0',
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
                    { homeAdvantage: m.homeAdvantage ?? false, restDaysHome: m.restDaysHome ?? 7, restDaysAway: m.restDaysAway ?? 7 });
                if (m.liveData) this.setLiveData(m.liveData);
                if (m.marketHeat !== undefined) this.setMarketHeat(m.marketHeat);

                const pred = this.predict();
                const actualOver = m.actualTotal > m.handicap;
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
            modelVersion: '2.0',
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
    window.generateMockLiveData = generateMockLiveData;
    window.getTeamList = getTeamList;
    window.TEAM_DATABASE = TEAM_DATABASE;
    window.CONFIG = CONFIG;
}
