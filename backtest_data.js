// ============================================================
// 历史比赛回测数据集 — 含实际比分 (2022世界杯 + 2024欧洲杯)
// 用于 Top-3 比分准确度评估
// ============================================================

const BACKTEST_MATCHES = [
    // ==================== 2022 世界杯 小组赛 48场 ====================
    { home:'卡塔尔',   away:'厄瓜多尔', stage:'小组赛', handicap:2.5, hScore:0, aScore:2 },
    { home:'塞内加尔', away:'荷兰',     stage:'小组赛', handicap:2.5, hScore:0, aScore:2 },
    { home:'卡塔尔',   away:'塞内加尔', stage:'小组赛', handicap:2.5, hScore:1, aScore:3 },
    { home:'荷兰',     away:'厄瓜多尔', stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'荷兰',     away:'卡塔尔',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'厄瓜多尔', away:'塞内加尔', stage:'小组赛', handicap:2.5, hScore:1, aScore:2 },
    { home:'英格兰',   away:'伊朗',     stage:'小组赛', handicap:2.5, hScore:6, aScore:2 },
    { home:'美国',     away:'威尔士',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'威尔士',   away:'伊朗',     stage:'小组赛', handicap:2.5, hScore:0, aScore:2 },
    { home:'英格兰',   away:'美国',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'威尔士',   away:'英格兰',   stage:'小组赛', handicap:2.5, hScore:0, aScore:3 },
    { home:'伊朗',     away:'美国',     stage:'小组赛', handicap:2.5, hScore:0, aScore:1 },
    { home:'阿根廷',   away:'沙特',     stage:'小组赛', handicap:2.5, hScore:1, aScore:2 },
    { home:'墨西哥',   away:'波兰',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'波兰',     away:'沙特',     stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'阿根廷',   away:'墨西哥',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'波兰',     away:'阿根廷',   stage:'小组赛', handicap:2.5, hScore:0, aScore:2 },
    { home:'沙特',     away:'墨西哥',   stage:'小组赛', handicap:2.5, hScore:1, aScore:2 },
    { home:'丹麦',     away:'突尼斯',   stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'法国',     away:'澳大利亚', stage:'小组赛', handicap:2.5, hScore:4, aScore:1 },
    { home:'突尼斯',   away:'澳大利亚', stage:'小组赛', handicap:2.5, hScore:0, aScore:1 },
    { home:'法国',     away:'丹麦',     stage:'小组赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'澳大利亚', away:'丹麦',     stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'突尼斯',   away:'法国',     stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'德国',     away:'日本',     stage:'小组赛', handicap:2.5, hScore:1, aScore:2 },
    { home:'西班牙',   away:'哥斯达黎加', stage:'小组赛', handicap:2.5, hScore:7, aScore:0 },
    { home:'日本',     away:'哥斯达黎加', stage:'小组赛', handicap:2.5, hScore:0, aScore:1 },
    { home:'西班牙',   away:'德国',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'日本',     away:'西班牙',   stage:'小组赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'哥斯达黎加', away:'德国',   stage:'小组赛', handicap:2.5, hScore:2, aScore:4 },
    { home:'摩洛哥',   away:'克罗地亚', stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'比利时',   away:'加拿大',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'比利时',   away:'摩洛哥',   stage:'小组赛', handicap:2.5, hScore:0, aScore:2 },
    { home:'克罗地亚', away:'加拿大',   stage:'小组赛', handicap:2.5, hScore:4, aScore:1 },
    { home:'克罗地亚', away:'比利时',   stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'加拿大',   away:'摩洛哥',   stage:'小组赛', handicap:2.5, hScore:1, aScore:2 },
    { home:'瑞士',     away:'喀麦隆',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'巴西',     away:'塞尔维亚', stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'喀麦隆',   away:'塞尔维亚', stage:'小组赛', handicap:2.5, hScore:3, aScore:3 },
    { home:'巴西',     away:'瑞士',     stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'塞尔维亚', away:'瑞士',     stage:'小组赛', handicap:2.5, hScore:2, aScore:3 },
    { home:'喀麦隆',   away:'巴西',     stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'乌拉圭',   away:'韩国',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'葡萄牙',   away:'加纳',     stage:'小组赛', handicap:2.5, hScore:3, aScore:2 },
    { home:'韩国',     away:'加纳',     stage:'小组赛', handicap:2.5, hScore:2, aScore:3 },
    { home:'葡萄牙',   away:'乌拉圭',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'韩国',     away:'葡萄牙',   stage:'小组赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'加纳',     away:'乌拉圭',   stage:'小组赛', handicap:2.5, hScore:0, aScore:2 },

    // ==================== 2022 世界杯 淘汰赛 16场 ====================
    { home:'荷兰',     away:'美国',     stage:'1/8决赛', handicap:2.5, hScore:3, aScore:1 },
    { home:'阿根廷',   away:'澳大利亚', stage:'1/8决赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'法国',     away:'波兰',     stage:'1/8决赛', handicap:2.5, hScore:3, aScore:1 },
    { home:'英格兰',   away:'塞内加尔', stage:'1/8决赛', handicap:2.5, hScore:3, aScore:0 },
    { home:'日本',     away:'克罗地亚', stage:'1/8决赛', handicap:2.5, hScore:1, aScore:1 }, // CRO pens
    { home:'巴西',     away:'韩国',     stage:'1/8决赛', handicap:2.5, hScore:4, aScore:1 },
    { home:'摩洛哥',   away:'西班牙',   stage:'1/8决赛', handicap:2.5, hScore:0, aScore:0 }, // MAR pens
    { home:'葡萄牙',   away:'瑞士',     stage:'1/8决赛', handicap:2.5, hScore:6, aScore:1 },
    { home:'克罗地亚', away:'巴西',     stage:'1/4决赛', handicap:2.5, hScore:1, aScore:1 }, // CRO pens
    { home:'荷兰',     away:'阿根廷',   stage:'1/4决赛', handicap:2.5, hScore:2, aScore:2 }, // ARG pens
    { home:'摩洛哥',   away:'葡萄牙',   stage:'1/4决赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'英格兰',   away:'法国',     stage:'1/4决赛', handicap:2.5, hScore:1, aScore:2 },
    { home:'阿根廷',   away:'克罗地亚', stage:'半决赛', handicap:2.5, hScore:3, aScore:0 },
    { home:'法国',     away:'摩洛哥',   stage:'半决赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'克罗地亚', away:'摩洛哥',   stage:'三四名决赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'阿根廷',   away:'法国',     stage:'决赛', handicap:2.5, hScore:3, aScore:3 }, // ARG pens

    // ==================== Euro 2024 小组赛 ====================
    { home:'德国',     away:'苏格兰',   stage:'小组赛', handicap:2.5, hScore:5, aScore:1 },
    { home:'匈牙利',   away:'瑞士',     stage:'小组赛', handicap:2.5, hScore:1, aScore:3 },
    { home:'德国',     away:'匈牙利',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'苏格兰',   away:'瑞士',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'瑞士',     away:'德国',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'苏格兰',   away:'匈牙利',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 },
    { home:'西班牙',   away:'克罗地亚', stage:'小组赛', handicap:2.5, hScore:3, aScore:0 },
    { home:'西班牙',   away:'意大利',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'克罗地亚', away:'意大利',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'丹麦',     away:'英格兰',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'塞尔维亚', away:'英格兰',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 },
    { home:'丹麦',     away:'塞尔维亚', stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'波兰',     away:'荷兰',     stage:'小组赛', handicap:2.5, hScore:1, aScore:2 },
    { home:'奥地利',   away:'法国',     stage:'小组赛', handicap:2.5, hScore:0, aScore:1 },
    { home:'波兰',     away:'奥地利',   stage:'小组赛', handicap:2.5, hScore:1, aScore:3 },
    { home:'荷兰',     away:'法国',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'法国',     away:'波兰',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'荷兰',     away:'奥地利',   stage:'小组赛', handicap:2.5, hScore:2, aScore:3 },
    { home:'比利时',   away:'罗马尼亚', stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'土耳其',   away:'葡萄牙',   stage:'小组赛', handicap:2.5, hScore:0, aScore:3 },
    { home:'葡萄牙',   away:'捷克',     stage:'小组赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'捷克',     away:'土耳其',   stage:'小组赛', handicap:2.5, hScore:1, aScore:2 },

    // ==================== Euro 2024 淘汰赛 ====================
    { home:'瑞士',     away:'意大利',   stage:'1/8决赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'德国',     away:'丹麦',     stage:'1/8决赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'西班牙',   away:'格鲁吉亚', stage:'1/8决赛', handicap:2.5, hScore:4, aScore:1 },
    { home:'法国',     away:'比利时',   stage:'1/8决赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'奥地利',   away:'土耳其',   stage:'1/8决赛', handicap:2.5, hScore:1, aScore:2 },
    { home:'西班牙',   away:'德国',     stage:'1/4决赛', handicap:2.5, hScore:2, aScore:1 }, // extra time
    { home:'葡萄牙',   away:'法国',     stage:'1/4决赛', handicap:2.5, hScore:0, aScore:0 }, // FRA pens
    { home:'英格兰',   away:'瑞士',     stage:'1/4决赛', handicap:2.5, hScore:1, aScore:1 }, // ENG pens
    { home:'荷兰',     away:'土耳其',   stage:'1/4决赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'西班牙',   away:'法国',     stage:'半决赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'荷兰',     away:'英格兰',   stage:'半决赛', handicap:2.5, hScore:1, aScore:2 },
    { home:'西班牙',   away:'英格兰',   stage:'决赛', handicap:2.0, hScore:2, aScore:1 },

    // ==================== 2026 世界杯 小组赛 ====================
    { home:'墨西哥',   away:'南非',     stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'韩国',     away:'捷克',     stage:'小组赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'捷克',     away:'南非',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'墨西哥',   away:'韩国',     stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'加拿大',   away:'波黑',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'瑞士',     away:'卡塔尔',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'瑞士',     away:'波黑',     stage:'小组赛', handicap:2.5, hScore:4, aScore:1 },
    { home:'加拿大',   away:'卡塔尔',   stage:'小组赛', handicap:2.5, hScore:6, aScore:0 },
    { home:'巴西',     away:'摩洛哥',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'海地',     away:'苏格兰',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 },
    { home:'美国',     away:'巴拉圭',   stage:'小组赛', handicap:2.5, hScore:4, aScore:1 },
    { home:'澳大利亚', away:'土耳其',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'德国',     away:'库拉索',   stage:'小组赛', handicap:2.5, hScore:7, aScore:1 },
    { home:'科特迪瓦', away:'厄瓜多尔', stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'荷兰',     away:'日本',     stage:'小组赛', handicap:2.5, hScore:2, aScore:2 },
    { home:'瑞典',     away:'突尼斯',   stage:'小组赛', handicap:2.5, hScore:5, aScore:1 },
    { home:'比利时',   away:'埃及',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'伊朗',     away:'新西兰',   stage:'小组赛', handicap:2.5, hScore:2, aScore:2 },
    { home:'西班牙',   away:'佛得角',   stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'沙特',     away:'乌拉圭',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'法国',     away:'塞内加尔', stage:'小组赛', handicap:2.5, hScore:3, aScore:1 },
    { home:'伊拉克',   away:'挪威',     stage:'小组赛', handicap:2.5, hScore:1, aScore:4 },
    { home:'阿根廷',   away:'阿尔及利亚', stage:'小组赛', handicap:2.5, hScore:3, aScore:0 },
    { home:'奥地利',   away:'约旦',     stage:'小组赛', handicap:2.5, hScore:3, aScore:1 },
    { home:'葡萄牙',   away:'民主刚果', stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'乌兹别克', away:'哥伦比亚', stage:'小组赛', handicap:2.5, hScore:1, aScore:3 },
    { home:'英格兰',   away:'克罗地亚', stage:'小组赛', handicap:2.5, hScore:4, aScore:2 },
    { home:'加纳',     away:'巴拿马',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },

    // ==================== 2026 世预赛 欧洲区 关键场次 ====================
    { home:'德国',     away:'斯洛伐克', stage:'小组赛', handicap:2.5, hScore:3, aScore:1 },
    { home:'法国',     away:'乌克兰',   stage:'小组赛', handicap:2.5, hScore:3, aScore:0 },
    { home:'荷兰',     away:'波兰',     stage:'小组赛', handicap:2.5, hScore:4, aScore:0 },
    { home:'挪威',     away:'意大利',   stage:'小组赛', handicap:2.5, hScore:4, aScore:1 },
    { home:'英格兰',   away:'塞尔维亚', stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'葡萄牙',   away:'匈牙利',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'西班牙',   away:'土耳其',   stage:'小组赛', handicap:2.5, hScore:3, aScore:0 },
    { home:'意大利',   away:'挪威',     stage:'小组赛', handicap:2.5, hScore:1, aScore:4 },
    { home:'奥地利',   away:'罗马尼亚', stage:'小组赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'比利时',   away:'威尔士',   stage:'小组赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'克罗地亚', away:'捷克',     stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    // 附加赛
    { home:'意大利',   away:'丹麦',     stage:'1/8决赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'乌克兰',   away:'瑞典',     stage:'1/8决赛', handicap:2.5, hScore:1, aScore:3 },
    { home:'波兰',     away:'阿尔巴尼亚', stage:'1/8决赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'土耳其',   away:'罗马尼亚', stage:'1/8决赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'丹麦',     away:'斯洛伐克', stage:'1/8决赛', handicap:2.5, hScore:4, aScore:0 },

    // ==================== Copa América 2024 (32场) ====================
    // Group A
    { home:'阿根廷',   away:'加拿大',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'秘鲁',     away:'智利',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'秘鲁',     away:'加拿大',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 },
    { home:'智利',     away:'阿根廷',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 },
    { home:'阿根廷',   away:'秘鲁',     stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'加拿大',   away:'智利',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    // Group B
    { home:'厄瓜多尔', away:'委内瑞拉', stage:'小组赛', handicap:2.5, hScore:1, aScore:2 },
    { home:'墨西哥',   away:'牙买加',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'委内瑞拉', away:'墨西哥',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 },
    { home:'厄瓜多尔', away:'牙买加',   stage:'小组赛', handicap:2.5, hScore:3, aScore:1 },
    { home:'墨西哥',   away:'厄瓜多尔', stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'牙买加',   away:'委内瑞拉', stage:'小组赛', handicap:2.5, hScore:0, aScore:3 },
    // Group C
    { home:'美国',     away:'玻利维亚', stage:'小组赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'乌拉圭',   away:'巴拿马',   stage:'小组赛', handicap:2.5, hScore:3, aScore:1 },
    { home:'巴拿马',   away:'美国',     stage:'小组赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'乌拉圭',   away:'玻利维亚', stage:'小组赛', handicap:2.5, hScore:5, aScore:0 },
    { home:'美国',     away:'乌拉圭',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 },
    { home:'玻利维亚', away:'巴拿马',   stage:'小组赛', handicap:2.5, hScore:1, aScore:3 },
    // Group D
    { home:'哥伦比亚', away:'巴拉圭',   stage:'小组赛', handicap:2.5, hScore:2, aScore:1 },
    { home:'巴西',     away:'哥斯达黎加', stage:'小组赛', handicap:2.5, hScore:0, aScore:0 },
    { home:'巴拉圭',   away:'巴西',     stage:'小组赛', handicap:2.5, hScore:1, aScore:4 },
    { home:'哥伦比亚', away:'哥斯达黎加', stage:'小组赛', handicap:2.5, hScore:3, aScore:0 },
    { home:'巴西',     away:'哥伦比亚', stage:'小组赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'哥斯达黎加', away:'巴拉圭', stage:'小组赛', handicap:2.5, hScore:2, aScore:1 },
    // Quarterfinals
    { home:'阿根廷',   away:'厄瓜多尔', stage:'1/4决赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'委内瑞拉', away:'加拿大',   stage:'1/4决赛', handicap:2.5, hScore:1, aScore:1 },
    { home:'哥伦比亚', away:'巴拿马',   stage:'1/4决赛', handicap:2.5, hScore:5, aScore:0 },
    { home:'乌拉圭',   away:'巴西',     stage:'1/4决赛', handicap:2.5, hScore:0, aScore:0 },
    // Semifinals
    { home:'阿根廷',   away:'加拿大',   stage:'半决赛', handicap:2.5, hScore:2, aScore:0 },
    { home:'乌拉圭',   away:'哥伦比亚', stage:'半决赛', handicap:2.5, hScore:0, aScore:1 },
    // Third place
    { home:'加拿大',   away:'乌拉圭',   stage:'三四名决赛', handicap:2.5, hScore:2, aScore:2 },
    // Final
    { home:'阿根廷',   away:'哥伦比亚', stage:'决赛', handicap:2.0, hScore:1, aScore:0 },
];

// Standard exports
if (typeof module !== 'undefined' && module.exports) module.exports = BACKTEST_MATCHES;
if (typeof window !== 'undefined') window.BACKTEST_MATCHES = BACKTEST_MATCHES;
