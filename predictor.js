// 世界杯大小球预测引擎 - JavaScript版
// 完整8因子 + 信息差增强 + 动态权重

// ==================== 国家队数据库 ====================
const TEAM_DATABASE = {
    '葡萄牙': { tactic: '进攻型', league_goals: 2.1, attack_rating: 8.5, defense_rating: 7.0, fc26_attack: 86, fc26_defense: 78, fitness: 8.0, squad_depth: 8.5, strength: 8.2 },
    '摩洛哥': { tactic: '防守型', league_goals: 1.3, attack_rating: 6.5, defense_rating: 8.5, fc26_attack: 72, fc26_defense: 84, fitness: 7.5, squad_depth: 6.5, strength: 7.0 },
    '法国': { tactic: '进攻型', league_goals: 2.3, attack_rating: 9.0, defense_rating: 7.5, fc26_attack: 88, fc26_defense: 80, fitness: 8.0, squad_depth: 9.0, strength: 8.8 },
    '阿根廷': { tactic: '进攻型', league_goals: 2.0, attack_rating: 8.8, defense_rating: 7.2, fc26_attack: 87, fc26_defense: 79, fitness: 7.8, squad_depth: 8.0, strength: 8.5 },
    '巴西': { tactic: '进攻型', league_goals: 2.2, attack_rating: 9.0, defense_rating: 7.8, fc26_attack: 89, fc26_defense: 82, fitness: 8.2, squad_depth: 9.0, strength: 8.9 },
    '德国': { tactic: '控球型', league_goals: 2.0, attack_rating: 8.2, defense_rating: 7.8, fc26_attack: 84, fc26_defense: 81, fitness: 8.0, squad_depth: 8.5, strength: 8.3 },
    '西班牙': { tactic: '控球型', league_goals: 2.1, attack_rating: 8.3, defense_rating: 7.5, fc26_attack: 85, fc26_defense: 79, fitness: 8.0, squad_depth: 8.2, strength: 8.2 },
    '英格兰': { tactic: '进攻型', league_goals: 2.2, attack_rating: 8.5, defense_rating: 7.3, fc26_attack: 86, fc26_defense: 78, fitness: 8.2, squad_depth: 8.5, strength: 8.3 },
    '意大利': { tactic: '防守型', league_goals: 1.6, attack_rating: 7.5, defense_rating: 8.8, fc26_attack: 78, fc26_defense: 87, fitness: 7.8, squad_depth: 8.0, strength: 8.0 },
    '荷兰': { tactic: '进攻型', league_goals: 2.1, attack_rating: 8.2, defense_rating: 7.5, fc26_attack: 84, fc26_defense: 79, fitness: 8.0, squad_depth: 7.8, strength: 8.0 },
    '比利时': { tactic: '进攻型', league_goals: 2.0, attack_rating: 8.0, defense_rating: 7.2, fc26_attack: 82, fc26_defense: 76, fitness: 7.5, squad_depth: 7.5, strength: 7.8 },
    '克罗地亚': { tactic: '控球型', league_goals: 1.5, attack_rating: 7.5, defense_rating: 7.8, fc26_attack: 78, fc26_defense: 80, fitness: 7.2, squad_depth: 7.0, strength: 7.5 },
    '乌拉圭': { tactic: '平衡型', league_goals: 1.6, attack_rating: 7.2, defense_rating: 7.8, fc26_attack: 76, fc26_defense: 80, fitness: 7.5, squad_depth: 7.0, strength: 7.3 },
    '瑞士': { tactic: '平衡型', league_goals: 1.7, attack_rating: 7.0, defense_rating: 7.5, fc26_attack: 74, fc26_defense: 78, fitness: 7.8, squad_depth: 7.2, strength: 7.2 },
    '丹麦': { tactic: '平衡型', league_goals: 1.8, attack_rating: 7.2, defense_rating: 7.6, fc26_attack: 75, fc26_defense: 79, fitness: 7.8, squad_depth: 7.0, strength: 7.2 },
    '塞尔维亚': { tactic: '进攻型', league_goals: 1.9, attack_rating: 7.5, defense_rating: 7.0, fc26_attack: 78, fc26_defense: 74, fitness: 7.5, squad_depth: 7.0, strength: 7.2 },
    '墨西哥': { tactic: '反击型', league_goals: 1.6, attack_rating: 7.0, defense_rating: 7.5, fc26_attack: 72, fc26_defense: 78, fitness: 8.0, squad_depth: 7.2, strength: 7.0 },
    '日本': { tactic: '控球型', league_goals: 1.8, attack_rating: 7.2, defense_rating: 7.2, fc26_attack: 75, fc26_defense: 75, fitness: 8.0, squad_depth: 7.0, strength: 7.0 },
    '韩国': { tactic: '反击型', league_goals: 1.7, attack_rating: 7.0, defense_rating: 7.0, fc26_attack: 73, fc26_defense: 73, fitness: 8.2, squad_depth: 6.8, strength: 6.8 },
    '澳大利亚': { tactic: '平衡型', league_goals: 1.5, attack_rating: 6.5, defense_rating: 7.0, fc26_attack: 70, fc26_defense: 74, fitness: 7.5, squad_depth: 6.5, strength: 6.5 },
    '沙特': { tactic: '防守型', league_goals: 1.3, attack_rating: 6.0, defense_rating: 7.2, fc26_attack: 66, fc26_defense: 75, fitness: 7.5, squad_depth: 6.0, strength: 6.2 },
    '伊朗': { tactic: '防守型', league_goals: 1.2, attack_rating: 6.2, defense_rating: 7.5, fc26_attack: 68, fc26_defense: 77, fitness: 7.8, squad_depth: 6.2, strength: 6.5 },
    '卡塔尔': { tactic: '平衡型', league_goals: 1.4, attack_rating: 6.0, defense_rating: 6.8, fc26_attack: 65, fc26_defense: 72, fitness: 7.5, squad_depth: 6.0, strength: 6.0 },
    '厄瓜多尔': { tactic: '防守型', league_goals: 1.3, attack_rating: 6.2, defense_rating: 7.3, fc26_attack: 67, fc26_defense: 76, fitness: 7.8, squad_depth: 6.2, strength: 6.3 },
    '塞内加尔': { tactic: '反击型', league_goals: 1.6, attack_rating: 7.0, defense_rating: 7.2, fc26_attack: 73, fc26_defense: 76, fitness: 8.0, squad_depth: 6.8, strength: 7.0 },
    '突尼斯': { tactic: '防守型', league_goals: 1.2, attack_rating: 6.0, defense_rating: 7.3, fc26_attack: 65, fc26_defense: 76, fitness: 7.5, squad_depth: 6.0, strength: 6.2 },
    '加纳': { tactic: '进攻型', league_goals: 1.7, attack_rating: 7.0, defense_rating: 6.8, fc26_attack: 72, fc26_defense: 72, fitness: 7.8, squad_depth: 6.5, strength: 6.5 },
    '喀麦隆': { tactic: '平衡型', league_goals: 1.5, attack_rating: 6.8, defense_rating: 7.0, fc26_attack: 70, fc26_defense: 74, fitness: 7.8, squad_depth: 6.5, strength: 6.5 },
    '哥斯达黎加': { tactic: '防守型', league_goals: 1.2, attack_rating: 6.0, defense_rating: 7.2, fc26_attack: 65, fc26_defense: 75, fitness: 7.5, squad_depth: 6.0, strength: 6.0 },
    '加拿大': { tactic: '进攻型', league_goals: 1.8, attack_rating: 7.0, defense_rating: 6.8, fc26_attack: 72, fc26_defense: 72, fitness: 8.0, squad_depth: 6.5, strength: 6.5 },
    '美国': { tactic: '平衡型', league_goals: 1.7, attack_rating: 7.0, defense_rating: 7.0, fc26_attack: 72, fc26_defense: 74, fitness: 8.0, squad_depth: 7.0, strength: 6.8 },
    '威尔士': { tactic: '平衡型', league_goals: 1.5, attack_rating: 6.8, defense_rating: 7.0, fc26_attack: 70, fc26_defense: 74, fitness: 7.5, squad_depth: 6.5, strength: 6.5 },
    '波兰': { tactic: '反击型', league_goals: 1.6, attack_rating: 7.0, defense_rating: 7.2, fc26_attack: 72, fc26_defense: 76, fitness: 7.5, squad_depth: 6.8, strength: 6.8 }
};

// ==================== 战术相克矩阵 ====================
const TACTIC_MATRIX = {
    '控球型': { '控球型': 1.05, '反击型': 0.95, '防守型': 0.90, '进攻型': 1.10, '平衡型': 1.00 },
    '反击型': { '控球型': 1.00, '反击型': 0.90, '防守型': 0.85, '进攻型': 1.15, '平衡型': 0.95 },
    '防守型': { '控球型': 0.85, '反击型': 0.90, '防守型': 0.80, '进攻型': 1.05, '平衡型': 0.90 },
    '进攻型': { '控球型': 1.05, '反击型': 1.10, '防守型': 1.00, '进攻型': 1.20, '平衡型': 1.05 },
    '平衡型': { '控球型': 1.00, '反击型': 0.95, '防守型': 0.90, '进攻型': 1.10, '平衡型': 1.00 }
};

// ==================== 世界杯阶段修正 ====================
const STAGE_CORRECTION = {
    '小组赛': -0.3,
    '淘汰赛': -0.5,
    '决赛': -0.7
};

// ==================== 出线形势修正 ====================
const SITUATION_CORRECTION = {
    '常规/未知': 0.0,
    '双双出线': -0.2,
    '生死战': 0.1,
    '荣誉之战': -0.3,
    '一队出线': -0.1
};

// ==================== 士气类型修正 ====================
const MORALE_CORRECTION = {
    '均衡': 0.0,
    '强弱分明': -0.1,
    '对攻大战': 0.2,
    '保守战术': -0.15
};

// ==================== 默认权重 ====================
const DEFAULT_WEIGHTS = {
    base_goals: 1.2,
    world_cup: 0.7,
    tactic: 1.0,
    defense: 1.0,
    market: 1.0,
    fc26: 1.0,
    psychology: 1.0,
    fatigue: 1.0,
    info_edge: 1.0,
    player_status: 1.0,
    auxiliary: 1.0
};

// ==================== 预测引擎类 ====================
class WorldCupPredictor {
    constructor() {
        this.weights = { ...DEFAULT_WEIGHTS };
        this.homeTeam = null;
        this.awayTeam = null;
        this.stage = '小组赛';
        this.handicap = 2.5;
        this.situation = '常规/未知';
        this.morale = '均衡';
        this.marketHeat = 0.5;
        this.useLiveData = false;
        this.liveData = null;
    }

    // 设置比赛
    setMatch(home, away, stage, handicap, situation, morale) {
        this.homeTeam = TEAM_DATABASE[home] || TEAM_DATABASE['葡萄牙'];
        this.awayTeam = TEAM_DATABASE[away] || TEAM_DATABASE['摩洛哥'];
        this.stage = stage || '小组赛';
        this.handicap = handicap || 2.5;
        this.situation = situation || '常规/未知';
        this.morale = morale || '均衡';
    }

    // 设置权重
    setWeights(weights) {
        this.weights = { ...DEFAULT_WEIGHTS, ...weights };
    }

    // 设置市场热度
    setMarketHeat(heat) {
        this.marketHeat = heat;
    }

    // 设置实时数据
    setLiveData(data) {
        this.liveData = data;
        this.useLiveData = true;
        this._adjustWeights();
    }

    // 动态调整权重（根据实时数据）
    _adjustWeights() {
        if (!this.liveData) return;
        
        const data = this.liveData;
        const adjustments = {};

        // 赔率数据 → 市场热度因子权重提升
        if (data.odds_change_15min || data.odds_change_1h) {
            const oddsChange = Math.abs(data.odds_change_15min || 0) + Math.abs(data.odds_change_1h || 0) * 0.5;
            adjustments.market = 1.0 + Math.min(oddsChange * 2, 0.8);
        }

        // 伤病数据 → 防守能力 + 球员状态因子权重提升
        const injuryCount = (data.home_injuries?.length || 0) + (data.away_injuries?.length || 0);
        if (injuryCount > 0) {
            adjustments.defense = 1.0 + Math.min(injuryCount * 0.2, 0.8);
            adjustments.player_status = 1.0 + Math.min(injuryCount * 0.3, 1.0);
        }

        // 发布会言论 → 心理因素因子权重提升
        if (data.home_press_conference || data.away_press_conference) {
            adjustments.psychology = 1.2;
        }

        // 阵容/训练信息 → 战术相克 + 疲劳因子权重提升
        if (data.home_lineup_hint || data.away_lineup_hint || data.rotation_hint) {
            adjustments.tactic = 1.2;
            adjustments.fatigue = 1.2;
        }

        // 历史交锋数据 → 基础预期进球权重提升
        if (data.h2h_matches && data.h2h_matches >= 5) {
            adjustments.base_goals = 1.0 + Math.min((data.h2h_matches - 5) * 0.1, 0.5);
        }

        // 天气数据 → 辅助信号权重提升
        if (data.weather && data.weather !== '晴') {
            adjustments.auxiliary = (adjustments.auxiliary || 1.0) + 0.15;
        }

        // 裁判数据 → 辅助信号权重提升
        if (data.referee_style) {
            adjustments.auxiliary = (adjustments.auxiliary || 1.0) + 0.1;
        }

        // 临赛时间衰减效应
        const hoursToMatch = data.hours_to_match || 24;
        let timeMultiplier = 1.0;
        if (hoursToMatch <= 1) timeMultiplier = 1.5;
        else if (hoursToMatch <= 6) timeMultiplier = 1.3;
        else if (hoursToMatch <= 24) timeMultiplier = 1.1;

        // 应用时间乘数
        for (let key in adjustments) {
            adjustments[key] = 1.0 + (adjustments[key] - 1.0) * timeMultiplier;
        }

        // 数据质量影响信息差整体权重
        const dataQuality = data.data_quality || 0.5;
        adjustments.info_edge = 0.8 + dataQuality * 0.6;

        this.weights = { ...DEFAULT_WEIGHTS, ...adjustments };
        return adjustments;
    }

    // 因子1：基础预期进球
    _calcBaseGoals() {
        const homeGoals = this.homeTeam.league_goals;
        const awayGoals = this.awayTeam.league_goals;
        const base = (homeGoals + awayGoals) / 2 * 1.2;
        return base * this.weights.base_goals;
    }

    // 因子2：世界杯阶段修正
    _calcWorldCupCorrection() {
        const correction = STAGE_CORRECTION[this.stage] || -0.3;
        return correction * this.weights.world_cup;
    }

    // 因子3：战术相克
    _calcTacticFactor() {
        const homeTactic = this.homeTeam.tactic;
        const awayTactic = this.awayTeam.tactic;
        const factor = TACTIC_MATRIX[homeTactic]?.[awayTactic] || 1.0;
        return 1.0 + (factor - 1.0) * this.weights.tactic;
    }

    // 因子4：防守能力限制
    _calcDefenseFactor() {
        const avgDefense = (this.homeTeam.defense_rating + this.awayTeam.defense_rating) / 2;
        const avgAttack = (this.homeTeam.attack_rating + this.awayTeam.attack_rating) / 2;
        const ratio = avgDefense / avgAttack;
        const factor = Math.pow(ratio, 0.8);
        return 1.0 + (factor - 1.0) * this.weights.defense;
    }

    // 因子5：市场热度反推
    _calcMarketFactor() {
        // 过热反向修正
        const heat = this.marketHeat;
        let factor = 1.0;
        if (heat > 0.7) {
            factor = 1.0 - (heat - 0.7) * 0.5; // 过热看衰
        } else if (heat < 0.3) {
            factor = 1.0 + (0.3 - heat) * 0.3; // 冷门倾向
        }
        return 1.0 + (factor - 1.0) * this.weights.market;
    }

    // 因子6：FC26引擎修正
    _calcFC26Factor() {
        const homeAttack = this.homeTeam.fc26_attack;
        const awayDefense = this.awayTeam.fc26_defense;
        const awayAttack = this.awayTeam.fc26_attack;
        const homeDefense = this.homeTeam.fc26_defense;
        
        const homeScore = (homeAttack - awayDefense + 50) / 100;
        const awayScore = (awayAttack - homeDefense + 50) / 100;
        const avgScore = (homeScore + awayScore) / 2;
        
        const factor = 0.8 + avgScore * 0.4;
        return 1.0 + (factor - 1.0) * this.weights.fc26;
    }

    // 因子7：心理因素修正
    _calcPsychologyFactor() {
        const situationCorrection = SITUATION_CORRECTION[this.situation] || 0;
        const moraleCorrection = MORALE_CORRECTION[this.morale] || 0;
        const totalCorrection = situationCorrection + moraleCorrection;
        return 1.0 + totalCorrection * this.weights.psychology * 0.5;
    }

    // 因子8：疲劳因子
    _calcFatigueFactor() {
        const avgFitness = (this.homeTeam.fitness + this.awayTeam.fitness) / 2;
        const avgDepth = (this.homeTeam.squad_depth + this.awayTeam.squad_depth) / 2;
        
        // 体能越好，疲劳影响越小
        const fatigueIndex = (10 - avgFitness) / 10 * 0.6 + (10 - avgDepth) / 10 * 0.4;
        const factor = 1.0 - fatigueIndex * 0.15;
        
        return {
            factor: 1.0 + (factor - 1.0) * this.weights.fatigue,
            fatigueIndex: fatigueIndex,
            fatigueImpact: fatigueIndex * 15,
            secondHalfRatio: 50 + fatigueIndex * 20,
            curve: [
                ['0-15min', 0.1],
                ['15-30min', 0.15],
                ['30-45min', 0.2],
                ['45-60min', 0.2],
                ['60-75min', 0.25],
                ['75-90min', 0.3]
            ]
        };
    }

    // 信息差增强
    _calcInfoEdge() {
        if (!this.useLiveData || !this.liveData) {
            return {
                infoEdgeImpact: 0,
                playerImpact: 1.0,
                auxiliaryImpact: 1.0,
                signalConsistency: 0.5,
                summary: '无实时数据，使用基础预测',
                signals: {}
            };
        }

        const data = this.liveData;
        let totalImpact = 0;
        let totalWeight = 0;
        const signals = {};
        let positiveSignals = 0;
        let negativeSignals = 0;

        // 信号1：训练阵容
        if (data.rotation_hint) {
            let value = 0;
            if (data.rotation_hint.includes('轮换') || data.rotation_hint.includes('替补')) {
                value = -0.08;
                negativeSignals++;
            } else if (data.rotation_hint.includes('全主力') || data.rotation_hint.includes('最强')) {
                value = 0.05;
                positiveSignals++;
            }
            signals.training = { value, confidence: 0.7, description: data.rotation_hint };
            totalImpact += value * 0.25;
            totalWeight += 0.25;
        }

        // 信号2：发布会言论
        if (data.home_press_conference || data.away_press_conference) {
            let value = 0;
            const allText = (data.home_press_conference || '') + (data.away_press_conference || '');
            if (allText.includes('防守') || allText.includes('摆大巴') || allText.includes('谦虚')) {
                value = -0.06;
                negativeSignals++;
            } else if (allText.includes('进攻') || allText.includes('大胜') || allText.includes('全取三分')) {
                value = 0.04;
                positiveSignals++;
            }
            signals.press = { value, confidence: 0.6, description: '发布会语义分析' };
            totalImpact += value * 0.15;
            totalWeight += 0.15;
        }

        // 信号3：球员状态（伤病）
        let playerImpact = 1.0;
        const allInjuries = [...(data.home_injuries || []), ...(data.away_injuries || [])];
        if (allInjuries.length > 0) {
            let totalInjuryImpact = 0;
            for (const injury of allInjuries) {
                let impact = 0;
                const status = injury.status || '';
                if (status.includes('缺阵') || status.includes('OUT')) impact = 0.2;
                else if (status.includes('疑') || status.includes('DOUBTFUL')) impact = 0.12;
                else if (status.includes('带伤') || status.includes('PLAYING')) impact = 0.08;
                else impact = 0.04;

                // 位置权重
                const pos = injury.position || '';
                let posWeight = 1.0;
                if (pos.includes('前锋') || pos.includes('FW')) posWeight = 1.5;
                else if (pos.includes('中场') || pos.includes('MF')) posWeight = 1.0;
                else if (pos.includes('后卫') || pos.includes('DF')) posWeight = 0.5;
                else if (pos.includes('门将') || pos.includes('GK')) posWeight = 0.3;

                totalInjuryImpact += impact * posWeight;
            }
            playerImpact = 1.0 - Math.min(totalInjuryImpact, 0.25);
            if (totalInjuryImpact > 0) negativeSignals++;
        }
        signals.player = { value: playerImpact - 1.0, confidence: 0.8, description: `${allInjuries.length}名球员伤病` };

        // 信号4：盘口异动
        if (data.odds_change_15min || data.odds_change_1h) {
            const oddsChange = (data.odds_change_15min || 0) + (data.odds_change_1h || 0) * 0.5;
            const value = -oddsChange * 0.3; // 赔率上升 = 大球概率下降
            signals.odds = { value, confidence: 0.85, description: `临赛赔率变动${oddsChange > 0 ? '+' : ''}${oddsChange.toFixed(2)}` };
            totalImpact += value * 0.45;
            totalWeight += 0.45;
            if (value > 0) positiveSignals++;
            else if (value < 0) negativeSignals++;
        }

        // 辅助信号：天气
        let auxiliaryImpact = 1.0;
        if (data.weather) {
            if (data.weather.includes('雨') || data.weather.includes('雨')) {
                auxiliaryImpact *= 0.95;
            } else if (data.weather.includes('高温') || data.temperature > 35) {
                auxiliaryImpact *= 0.97;
            }
        }

        // 辅助信号：裁判
        if (data.referee_style) {
            if (data.referee_style.includes('松') || data.referee_style.includes('进攻有利')) {
                auxiliaryImpact *= 1.03;
            } else if (data.referee_style.includes('严') || data.referee_style.includes('出牌多')) {
                auxiliaryImpact *= 0.98;
            }
        }

        // 辅助信号：历史交锋
        if (data.h2h_avg_goals) {
            const avgGoals = data.h2h_avg_goals;
            const diff = (avgGoals - 2.5) / 2.5 * 0.1;
            auxiliaryImpact *= (1.0 + diff);
        }

        signals.auxiliary = { value: auxiliaryImpact - 1.0, confidence: 0.6, description: '天气+裁判+历史交锋' };

        // 信号一致性
        const totalSignals = positiveSignals + negativeSignals;
        let consistency = 0.5;
        if (totalSignals > 0) {
            consistency = Math.max(positiveSignals, negativeSignals) / totalSignals;
        }

        // 一致性放大
        let finalImpact = totalImpact;
        if (consistency > 0.8 && totalSignals >= 2) {
            finalImpact *= 1.4;
        } else if (consistency < 0.4 && totalSignals >= 2) {
            finalImpact *= 0.6;
        }

        // 应用信息差权重
        finalImpact *= this.weights.info_edge;

        return {
            infoEdgeImpact: finalImpact,
            playerImpact: playerImpact,
            auxiliaryImpact: auxiliaryImpact,
            signalConsistency: consistency,
            summary: this._generateInfoEdgeSummary(signals, consistency),
            signals: signals
        };
    }

    // 生成信息差摘要
    _generateInfoEdgeSummary(signals, consistency) {
        const signalCount = Object.keys(signals).length;
        if (signalCount === 0) return '无实时数据';
        
        let strongest = null;
        let strongestValue = 0;
        for (const [key, sig] of Object.entries(signals)) {
            if (Math.abs(sig.value) > Math.abs(strongestValue)) {
                strongestValue = sig.value;
                strongest = sig;
            }
        }
        
        let consistencyText = consistency > 0.7 ? '信号一致性高' : 
                              consistency > 0.4 ? '信号存在分歧' : '信号分歧较大';
        
        return `${signalCount}个信号源 · ${consistencyText} · 最强信号：${strongest?.description || '无'}`;
    }

    // 比分预测（泊松分布）
    _predictScorelines(expectedGoals) {
        const scorelines = [];
        const homeStrength = this.homeTeam.attack_rating / (this.homeTeam.attack_rating + this.awayTeam.attack_rating);
        const homeExpected = expectedGoals * homeStrength;
        const awayExpected = expectedGoals * (1 - homeStrength);

        // 泊松概率计算
        const poisson = (lambda, k) => {
            return Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k);
        };

        for (let h = 0; h <= 5; h++) {
            for (let a = 0; a <= 5; a++) {
                const prob = poisson(homeExpected, h) * poisson(awayExpected, a);
                scorelines.push({
                    score: `${h}-${a}`,
                    home: h,
                    away: a,
                    probability: prob * 100,
                    total: h + a
                });
            }
        }

        scorelines.sort((a, b) => b.probability - a.probability);
        return scorelines.slice(0, 5);
    }

    // 执行预测
    predict() {
        const baseGoals = this._calcBaseGoals();
        const wcCorrection = this._calcWorldCupCorrection();
        const tacticFactor = this._calcTacticFactor();
        const defenseFactor = this._calcDefenseFactor();
        const marketFactor = this._calcMarketFactor();
        const fc26Factor = this._calcFC26Factor();
        const psychologyFactor = this._calcPsychologyFactor();
        const fatigueResult = this._calcFatigueFactor();
        const infoEdge = this._calcInfoEdge();

        // 计算最终预期进球
        let expected = (baseGoals + wcCorrection) 
            * tacticFactor 
            * defenseFactor 
            * marketFactor 
            * fc26Factor 
            * psychologyFactor 
            * fatigueResult.factor
            * infoEdge.playerImpact
            * (1 + infoEdge.infoEdgeImpact)
            * infoEdge.auxiliaryImpact;

        // 限制范围
        expected = Math.max(0.5, Math.min(expected, 6.0));

        // 判断大小球
        const isOver = expected > this.handicap;
        const edge = Math.abs(expected - this.handicap);
        
        // 置信度计算
        let confidence = 0.5 + Math.min(edge / 2, 0.3);
        if (infoEdge.signalConsistency > 0.7) confidence += 0.1;
        if (this.useLiveData && this.liveData?.data_quality > 0.6) confidence += 0.05;
        confidence = Math.min(confidence, 0.95);

        // 推荐强度
        let strength = '⚖️ 观望';
        let strengthLevel = 0;
        if (edge > 0.4 && confidence > 0.65) {
            strength = '⭐⭐⭐ 强烈推荐';
            strengthLevel = 3;
        } else if (edge > 0.2 && confidence > 0.55) {
            strength = '⭐⭐ 推荐';
            strengthLevel = 2;
        } else if (edge > 0.1) {
            strength = '⭐ 轻微倾向';
            strengthLevel = 1;
        }

        // 比分预测
        const topScorelines = this._predictScorelines(expected);

        // 各因子详情
        const factorsDetail = {
            '基础预期进球': { value: baseGoals.toFixed(2), impact: (baseGoals - 2.5).toFixed(2) },
            '世界杯阶段修正': { value: wcCorrection.toFixed(2), impact: wcCorrection.toFixed(2) },
            '战术相克': { value: tacticFactor.toFixed(3), impact: ((tacticFactor - 1) * 100).toFixed(1) + '%' },
            '防守能力限制': { value: defenseFactor.toFixed(3), impact: ((defenseFactor - 1) * 100).toFixed(1) + '%' },
            '市场热度反推': { value: marketFactor.toFixed(3), impact: ((marketFactor - 1) * 100).toFixed(1) + '%' },
            'FC26引擎修正': { value: fc26Factor.toFixed(3), impact: ((fc26Factor - 1) * 100).toFixed(1) + '%' },
            '心理因素修正': { value: psychologyFactor.toFixed(3), impact: ((psychologyFactor - 1) * 100).toFixed(1) + '%' },
            '疲劳因子': { value: fatigueResult.factor.toFixed(3), impact: ((fatigueResult.factor - 1) * 100).toFixed(1) + '%' }
        };

        // 生成判断依据
        const reasons = this._generateReasons(expected, edge, isOver, factorsDetail, infoEdge);

        // 生成关键洞察
        const keyInsights = this._generateInsights(expected, isOver, infoEdge, fatigueResult);

        // 权重调整说明
        const weightAdjustments = {};
        for (const [key, value] of Object.entries(this.weights)) {
            const defaultVal = DEFAULT_WEIGHTS[key];
            if (defaultVal && Math.abs(value - defaultVal) > 0.01) {
                weightAdjustments[key] = {
                    default: defaultVal,
                    current: value.toFixed(2),
                    change: ((value - defaultVal) / defaultVal * 100).toFixed(0) + '%'
                };
            }
        }

        return {
            success: true,
            prediction: isOver ? '大球' : '小球',
            is_over: isOver,
            strength: strength,
            strength_level: strengthLevel,
            expected_goals: parseFloat(expected.toFixed(2)),
            confidence: parseFloat(confidence.toFixed(2)),
            edge: parseFloat(edge.toFixed(2)),
            handicap: this.handicap,
            home_team: this.getTeamName(this.homeTeam),
            away_team: this.getTeamName(this.awayTeam),
            stage: this.stage,
            base_expected: parseFloat(baseGoals.toFixed(2)),
            factors_detail: factorsDetail,
            fatigue_index: parseFloat(fatigueResult.fatigueIndex.toFixed(2)),
            fatigue_impact: parseFloat(fatigueResult.fatigueImpact.toFixed(1)),
            second_half_ratio: parseFloat(fatigueResult.secondHalfRatio.toFixed(1)),
            fatigue_curve: fatigueResult.curve,
            info_edge_impact: parseFloat(infoEdge.infoEdgeImpact.toFixed(3)),
            player_impact: parseFloat(infoEdge.playerImpact.toFixed(3)),
            signal_consistency: parseFloat(infoEdge.signalConsistency.toFixed(2)),
            info_edge_summary: infoEdge.summary,
            info_edge_signals: infoEdge.signals,
            top_scorelines: topScorelines,
            reasons: reasons,
            key_insights: keyInsights,
            data_source: this.useLiveData ? (this.liveData?.data_source || 'live') : 'mock',
            data_quality: this.liveData?.data_quality || 0,
            live_data_summary: this.liveData ? this._summarizeLiveData(this.liveData) : null,
            weight_adjustments: weightAdjustments,
            timestamp: new Date().toISOString()
        };
    }

    // 获取队名
    getTeamName(team) {
        for (const [name, data] of Object.entries(TEAM_DATABASE)) {
            if (data === team) return name;
        }
        return '未知';
    }

    // 生成判断依据
    _generateReasons(expected, edge, isOver, factors, infoEdge) {
        const reasons = [];
        const direction = isOver ? '大于' : '小于';
        
        reasons.push(`预期进球 ${expected.toFixed(2)} 球，${direction}盘口 ${this.handicap} 球，差值 ${edge.toFixed(2)} 球`);
        
        // 找出影响最大的因子
        let maxFactor = null;
        let maxImpact = 0;
        for (const [name, data] of Object.entries(factors)) {
            const impact = parseFloat(data.impact);
            if (Math.abs(impact) > Math.abs(maxImpact)) {
                maxImpact = impact;
                maxFactor = name;
            }
        }
        if (maxFactor) {
            const direction2 = maxImpact > 0 ? '提升' : '降低';
            reasons.push(`${maxFactor}影响最大，${direction2}预期进球约 ${Math.abs(maxImpact).toFixed(2)}`);
        }

        if (infoEdge.infoEdgeImpact !== 0) {
            const direction3 = infoEdge.infoEdgeImpact > 0 ? '正向' : '负向';
            reasons.push(`信息差信号${direction3}影响 ${(infoEdge.infoEdgeImpact * 100).toFixed(1)}%`);
        }

        return reasons;
    }

    // 生成关键洞察
    _generateInsights(expected, isOver, infoEdge, fatigue) {
        const insights = [];
        
        // 主洞察
        const confidence = Math.round((0.5 + Math.min(Math.abs(expected - this.handicap) / 2, 0.3)) * 100);
        insights.push(`本场比赛倾向于${isOver ? '大球' : '小球'}，置信度约 ${confidence}%`);

        // 信息差洞察
        if (infoEdge.signalConsistency > 0.7) {
            insights.push('💡 多信号一致性高，信息差信号可信度较强');
        } else if (infoEdge.signalConsistency < 0.4) {
            insights.push('⚠️ 信号存在较大分歧，建议谨慎参考');
        }

        // 疲劳洞察
        if (fatigue.fatigueImpact > 10) {
            insights.push(`🏃 疲劳影响较大（${fatigue.fatigueImpact.toFixed(1)}%），下半场进球占比预计 ${fatigue.secondHalfRatio.toFixed(0)}%`);
        }

        // 比分洞察
        if (expected > 3) {
            insights.push('⚽ 预期进球较高，可能出现大比分');
        } else if (expected < 1.5) {
            insights.push('🛡️ 预期进球较低，可能是一场闷平');
        }

        return insights;
    }

    // 实时数据摘要
    _summarizeLiveData(data) {
        return {
            odds_available: !!(data.over_odds || data.under_odds),
            injuries_available: !!(data.home_injuries?.length || data.away_injuries?.length),
            press_available: !!(data.home_press_conference || data.away_press_conference),
            lineup_available: !!(data.home_lineup_hint || data.away_lineup_hint),
            h2h_available: !!data.h2h_matches,
            weather_available: !!data.weather,
            referee_available: !!data.referee
        };
    }
}

// 阶乘函数
function factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// 生成模拟实时数据
function generateMockLiveData(homeTeam, awayTeam) {
    const home = TEAM_DATABASE[homeTeam] || TEAM_DATABASE['葡萄牙'];
    const away = TEAM_DATABASE[awayTeam] || TEAM_DATABASE['摩洛哥'];

    // 随机生成一些伤病
    const injuries = [];
    const injuryCount = Math.floor(Math.random() * 3);
    const positions = ['前锋', '中场', '后卫', '门将'];
    const statuses = ['小伤上场', '出战成疑', '带伤出战'];
    const playerNames = ['主力前锋', '中场核心', '后卫', '边锋'];
    
    for (let i = 0; i < injuryCount; i++) {
        injuries.push({
            player: playerNames[i % playerNames.length],
            position: positions[i % positions.length],
            status: statuses[i % statuses.length],
            importance: 0.5 + Math.random() * 0.5
        });
    }

    // 随机赔率变化
    const oddsChange = (Math.random() - 0.5) * 0.3;

    return {
        home_team: homeTeam,
        away_team: awayTeam,
        match_time: '2026-06-20 21:00',
        over_odds: 1.85 + Math.random() * 0.3,
        under_odds: 1.95 + Math.random() * 0.3,
        handicap: 2.5,
        odds_change_24h: (Math.random() - 0.5) * 0.2,
        odds_change_1h: oddsChange * 0.6,
        odds_change_15min: oddsChange,
        over_volume: 55 + Math.random() * 20,
        over_volume_change: (Math.random() - 0.5) * 10,
        home_injuries: injuries.slice(0, Math.ceil(injuryCount / 2)),
        away_injuries: injuries.slice(Math.ceil(injuryCount / 2)),
        home_lineup_hint: Math.random() > 0.5 ? '预计全主力出战' : '可能有轮换',
        away_lineup_hint: Math.random() > 0.5 ? '防守为主' : '正常阵容',
        rotation_hint: Math.random() > 0.7 ? '赛前训练显示有轮换迹象' : null,
        home_press_conference: Math.random() > 0.5 ? '主教练表示会谨慎应对' : null,
        away_press_conference: Math.random() > 0.5 ? '球队会立足防守打反击' : null,
        weather: Math.random() > 0.7 ? '多云' : '晴',
        temperature: 25 + Math.random() * 10,
        referee: '主裁判',
        referee_style: Math.random() > 0.5 ? '执法偏松，进攻有利' : '执法严格',
        h2h_matches: Math.floor(Math.random() * 10) + 3,
        h2h_avg_goals: 2.0 + Math.random() * 1.5,
        h2h_over_rate: 0.4 + Math.random() * 0.3,
        data_quality: 0.75 + Math.random() * 0.2,
        last_update: new Date().toISOString(),
        data_source: 'mock',
        hours_to_match: 2 + Math.random() * 22
    };
}

// 获取球队列表
function getTeamList() {
    return Object.keys(TEAM_DATABASE).sort();
}

// 导出（供浏览器使用）
if (typeof window !== 'undefined') {
    window.WorldCupPredictor = WorldCupPredictor;
    window.generateMockLiveData = generateMockLiveData;
    window.getTeamList = getTeamList;
    window.TEAM_DATABASE = TEAM_DATABASE;
}
