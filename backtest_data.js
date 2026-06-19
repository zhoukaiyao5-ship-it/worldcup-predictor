// ============================================================
// 历史比赛回测数据集 — 含实际比分 (2022世界杯 + 2024欧洲杯)
// 用于 Top-3 比分准确度评估
// ============================================================

const BACKTEST_MATCHES = [
    // ==================== 2022 世界杯 小组赛 48场 ====================
    { home:'卡塔尔',   away:'厄瓜多尔', stage:'小组赛', handicap:2.5, hScore:0, aScore:2, tournament:'WC' },
    { home:'塞内加尔', away:'荷兰',     stage:'小组赛', handicap:2.5, hScore:0, aScore:2 , tournament:'WC' },
    { home:'卡塔尔',   away:'塞内加尔', stage:'小组赛', handicap:2.5, hScore:1, aScore:3 , tournament:'WC' },
    { home:'荷兰',     away:'厄瓜多尔', stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' },
    { home:'荷兰',     away:'卡塔尔',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'WC' },
    { home:'厄瓜多尔', away:'塞内加尔', stage:'小组赛', handicap:2.5, hScore:1, aScore:2 , tournament:'WC' },
    { home:'英格兰',   away:'伊朗',     stage:'小组赛', handicap:2.5, hScore:6, aScore:2 , tournament:'WC' },
    { home:'美国',     away:'威尔士',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' },
    { home:'威尔士',   away:'伊朗',     stage:'小组赛', handicap:2.5, hScore:0, aScore:2 , tournament:'WC' },
    { home:'英格兰',   away:'美国',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'WC' },
    { home:'威尔士',   away:'英格兰',   stage:'小组赛', handicap:2.5, hScore:0, aScore:3 , tournament:'WC' },
    { home:'伊朗',     away:'美国',     stage:'小组赛', handicap:2.5, hScore:0, aScore:1 , tournament:'WC' },
    { home:'阿根廷',   away:'沙特',     stage:'小组赛', handicap:2.5, hScore:1, aScore:2 , tournament:'WC' },
    { home:'墨西哥',   away:'波兰',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'WC' },
    { home:'波兰',     away:'沙特',     stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'WC' },
    { home:'阿根廷',   away:'墨西哥',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'WC' },
    { home:'波兰',     away:'阿根廷',   stage:'小组赛', handicap:2.5, hScore:0, aScore:2 , tournament:'WC' },
    { home:'沙特',     away:'墨西哥',   stage:'小组赛', handicap:2.5, hScore:1, aScore:2 , tournament:'WC' },
    { home:'丹麦',     away:'突尼斯',   stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'WC' },
    { home:'法国',     away:'澳大利亚', stage:'小组赛', handicap:2.5, hScore:4, aScore:1 , tournament:'WC' },
    { home:'突尼斯',   away:'澳大利亚', stage:'小组赛', handicap:2.5, hScore:0, aScore:1 , tournament:'WC' },
    { home:'法国',     away:'丹麦',     stage:'小组赛', handicap:2.5, hScore:2, aScore:1 , tournament:'WC' },
    { home:'澳大利亚', away:'丹麦',     stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'WC' },
    { home:'突尼斯',   away:'法国',     stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'WC' },
    { home:'德国',     away:'日本',     stage:'小组赛', handicap:2.5, hScore:1, aScore:2 , tournament:'WC' },
    { home:'西班牙',   away:'哥斯达黎加', stage:'小组赛', handicap:2.5, hScore:7, aScore:0 , tournament:'WC' },
    { home:'日本',     away:'哥斯达黎加', stage:'小组赛', handicap:2.5, hScore:0, aScore:1 , tournament:'WC' },
    { home:'西班牙',   away:'德国',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' },
    { home:'日本',     away:'西班牙',   stage:'小组赛', handicap:2.5, hScore:2, aScore:1 , tournament:'WC' },
    { home:'哥斯达黎加', away:'德国',   stage:'小组赛', handicap:2.5, hScore:2, aScore:4 , tournament:'WC' },
    { home:'摩洛哥',   away:'克罗地亚', stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'WC' },
    { home:'比利时',   away:'加拿大',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'WC' },
    { home:'比利时',   away:'摩洛哥',   stage:'小组赛', handicap:2.5, hScore:0, aScore:2 , tournament:'WC' },
    { home:'克罗地亚', away:'加拿大',   stage:'小组赛', handicap:2.5, hScore:4, aScore:1 , tournament:'WC' },
    { home:'克罗地亚', away:'比利时',   stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'WC' },
    { home:'加拿大',   away:'摩洛哥',   stage:'小组赛', handicap:2.5, hScore:1, aScore:2 , tournament:'WC' },
    { home:'瑞士',     away:'喀麦隆',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'WC' },
    { home:'巴西',     away:'塞尔维亚', stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'WC' },
    { home:'喀麦隆',   away:'塞尔维亚', stage:'小组赛', handicap:2.5, hScore:3, aScore:3 , tournament:'WC' },
    { home:'巴西',     away:'瑞士',     stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'WC' },
    { home:'塞尔维亚', away:'瑞士',     stage:'小组赛', handicap:2.5, hScore:2, aScore:3 , tournament:'WC' },
    { home:'喀麦隆',   away:'巴西',     stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'WC' },
    { home:'乌拉圭',   away:'韩国',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'WC' },
    { home:'葡萄牙',   away:'加纳',     stage:'小组赛', handicap:2.5, hScore:3, aScore:2 , tournament:'WC' },
    { home:'韩国',     away:'加纳',     stage:'小组赛', handicap:2.5, hScore:2, aScore:3 , tournament:'WC' },
    { home:'葡萄牙',   away:'乌拉圭',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'WC' },
    { home:'韩国',     away:'葡萄牙',   stage:'小组赛', handicap:2.5, hScore:2, aScore:1 , tournament:'WC' },
    { home:'加纳',     away:'乌拉圭',   stage:'小组赛', handicap:2.5, hScore:0, aScore:2 , tournament:'WC' },

    // ==================== 2022 世界杯 淘汰赛 16场 ====================
    { home:'荷兰',     away:'美国',     stage:'1/8决赛', handicap:2.5, hScore:3, aScore:1 , tournament:'WC' },
    { home:'阿根廷',   away:'澳大利亚', stage:'1/8决赛', handicap:2.5, hScore:2, aScore:1 , tournament:'WC' },
    { home:'法国',     away:'波兰',     stage:'1/8决赛', handicap:2.5, hScore:3, aScore:1 , tournament:'WC' },
    { home:'英格兰',   away:'塞内加尔', stage:'1/8决赛', handicap:2.5, hScore:3, aScore:0 , tournament:'WC' },
    { home:'日本',     away:'克罗地亚', stage:'1/8决赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' }, // CRO pens
    { home:'巴西',     away:'韩国',     stage:'1/8决赛', handicap:2.5, hScore:4, aScore:1 , tournament:'WC' },
    { home:'摩洛哥',   away:'西班牙',   stage:'1/8决赛', handicap:2.5, hScore:0, aScore:0 , tournament:'WC' }, // MAR pens
    { home:'葡萄牙',   away:'瑞士',     stage:'1/8决赛', handicap:2.5, hScore:6, aScore:1 , tournament:'WC' },
    { home:'克罗地亚', away:'巴西',     stage:'1/4决赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' }, // CRO pens
    { home:'荷兰',     away:'阿根廷',   stage:'1/4决赛', handicap:2.5, hScore:2, aScore:2 , tournament:'WC' }, // ARG pens
    { home:'摩洛哥',   away:'葡萄牙',   stage:'1/4决赛', handicap:2.5, hScore:1, aScore:0 , tournament:'WC' },
    { home:'英格兰',   away:'法国',     stage:'1/4决赛', handicap:2.5, hScore:1, aScore:2 , tournament:'WC' },
    { home:'阿根廷',   away:'克罗地亚', stage:'半决赛', handicap:2.5, hScore:3, aScore:0 , tournament:'WC' },
    { home:'法国',     away:'摩洛哥',   stage:'半决赛', handicap:2.5, hScore:2, aScore:0 , tournament:'WC' },
    { home:'克罗地亚', away:'摩洛哥',   stage:'三四名决赛', handicap:2.5, hScore:2, aScore:1 , tournament:'WC' },
    { home:'阿根廷',   away:'法国',     stage:'决赛', handicap:2.5, hScore:3, aScore:3 , tournament:'WC' }, // ARG pens

    // ==================== Euro 2024 小组赛 ====================
    { home:'德国',     away:'苏格兰',   stage:'小组赛', handicap:2.5, hScore:5, aScore:1 , tournament:'Euro' },
    { home:'匈牙利',   away:'瑞士',     stage:'小组赛', handicap:2.5, hScore:1, aScore:3 , tournament:'Euro' },
    { home:'德国',     away:'匈牙利',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Euro' },
    { home:'苏格兰',   away:'瑞士',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'Euro' },
    { home:'瑞士',     away:'德国',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'Euro' },
    { home:'苏格兰',   away:'匈牙利',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 , tournament:'Euro' },
    { home:'西班牙',   away:'克罗地亚', stage:'小组赛', handicap:2.5, hScore:3, aScore:0 , tournament:'Euro' },
    { home:'西班牙',   away:'意大利',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'Euro' },
    { home:'克罗地亚', away:'意大利',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'Euro' },
    { home:'丹麦',     away:'英格兰',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'Euro' },
    { home:'塞尔维亚', away:'英格兰',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 , tournament:'Euro' },
    { home:'丹麦',     away:'塞尔维亚', stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'Euro' },
    { home:'波兰',     away:'荷兰',     stage:'小组赛', handicap:2.5, hScore:1, aScore:2 , tournament:'Euro' },
    { home:'奥地利',   away:'法国',     stage:'小组赛', handicap:2.5, hScore:0, aScore:1 , tournament:'Euro' },
    { home:'波兰',     away:'奥地利',   stage:'小组赛', handicap:2.5, hScore:1, aScore:3 , tournament:'Euro' },
    { home:'荷兰',     away:'法国',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'Euro' },
    { home:'法国',     away:'波兰',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'Euro' },
    { home:'荷兰',     away:'奥地利',   stage:'小组赛', handicap:2.5, hScore:2, aScore:3 , tournament:'Euro' },
    { home:'比利时',   away:'罗马尼亚', stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Euro' },
    { home:'土耳其',   away:'葡萄牙',   stage:'小组赛', handicap:2.5, hScore:0, aScore:3 , tournament:'Euro' },
    { home:'葡萄牙',   away:'捷克',     stage:'小组赛', handicap:2.5, hScore:2, aScore:1 , tournament:'Euro' },
    { home:'捷克',     away:'土耳其',   stage:'小组赛', handicap:2.5, hScore:1, aScore:2 , tournament:'Euro' },

    // ==================== Euro 2024 淘汰赛 ====================
    { home:'瑞士',     away:'意大利',   stage:'1/8决赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Euro' },
    { home:'德国',     away:'丹麦',     stage:'1/8决赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Euro' },
    { home:'西班牙',   away:'格鲁吉亚', stage:'1/8决赛', handicap:2.5, hScore:4, aScore:1 , tournament:'Euro' },
    { home:'法国',     away:'比利时',   stage:'1/8决赛', handicap:2.5, hScore:1, aScore:0 , tournament:'Euro' },
    { home:'奥地利',   away:'土耳其',   stage:'1/8决赛', handicap:2.5, hScore:1, aScore:2 , tournament:'Euro' },
    { home:'西班牙',   away:'德国',     stage:'1/4决赛', handicap:2.5, hScore:2, aScore:1 , tournament:'Euro' }, // extra time
    { home:'葡萄牙',   away:'法国',     stage:'1/4决赛', handicap:2.5, hScore:0, aScore:0 , tournament:'Euro' }, // FRA pens
    { home:'英格兰',   away:'瑞士',     stage:'1/4决赛', handicap:2.5, hScore:1, aScore:1 , tournament:'Euro' }, // ENG pens
    { home:'荷兰',     away:'土耳其',   stage:'1/4决赛', handicap:2.5, hScore:2, aScore:1 , tournament:'Euro' },
    { home:'西班牙',   away:'法国',     stage:'半决赛', handicap:2.5, hScore:2, aScore:1 , tournament:'Euro' },
    { home:'荷兰',     away:'英格兰',   stage:'半决赛', handicap:2.5, hScore:1, aScore:2 , tournament:'Euro' },
    { home:'西班牙',   away:'英格兰',   stage:'决赛', handicap:2.0, hScore:2, aScore:1 , tournament:'Euro' },

    // ==================== 2026 世界杯 小组赛 ====================
    { home:'墨西哥',   away:'南非',     stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'WC' },
    { home:'韩国',     away:'捷克',     stage:'小组赛', handicap:2.5, hScore:2, aScore:1 , tournament:'WC' },
    { home:'捷克',     away:'南非',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' },
    { home:'墨西哥',   away:'韩国',     stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'WC' },
    { home:'加拿大',   away:'波黑',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' },
    { home:'瑞士',     away:'卡塔尔',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' },
    { home:'瑞士',     away:'波黑',     stage:'小组赛', handicap:2.5, hScore:4, aScore:1 , tournament:'WC' },
    { home:'加拿大',   away:'卡塔尔',   stage:'小组赛', handicap:2.5, hScore:6, aScore:0 , tournament:'WC' },
    { home:'巴西',     away:'摩洛哥',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' },
    { home:'海地',     away:'苏格兰',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 , tournament:'WC' },
    { home:'美国',     away:'巴拉圭',   stage:'小组赛', handicap:2.5, hScore:4, aScore:1 , tournament:'WC' },
    { home:'澳大利亚', away:'土耳其',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'WC' },
    { home:'德国',     away:'库拉索',   stage:'小组赛', handicap:2.5, hScore:7, aScore:1 , tournament:'WC' },
    { home:'科特迪瓦', away:'厄瓜多尔', stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'WC' },
    { home:'荷兰',     away:'日本',     stage:'小组赛', handicap:2.5, hScore:2, aScore:2 , tournament:'WC' },
    { home:'瑞典',     away:'突尼斯',   stage:'小组赛', handicap:2.5, hScore:5, aScore:1 , tournament:'WC' },
    { home:'比利时',   away:'埃及',     stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' },
    { home:'伊朗',     away:'新西兰',   stage:'小组赛', handicap:2.5, hScore:2, aScore:2 , tournament:'WC' },
    { home:'西班牙',   away:'佛得角',   stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'WC' },
    { home:'沙特',     away:'乌拉圭',   stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' },
    { home:'法国',     away:'塞内加尔', stage:'小组赛', handicap:2.5, hScore:3, aScore:1 , tournament:'WC' },
    { home:'伊拉克',   away:'挪威',     stage:'小组赛', handicap:2.5, hScore:1, aScore:4 , tournament:'WC' },
    { home:'阿根廷',   away:'阿尔及利亚', stage:'小组赛', handicap:2.5, hScore:3, aScore:0 , tournament:'WC' },
    { home:'奥地利',   away:'约旦',     stage:'小组赛', handicap:2.5, hScore:3, aScore:1 , tournament:'WC' },
    { home:'葡萄牙',   away:'民主刚果', stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'WC' },
    { home:'乌兹别克', away:'哥伦比亚', stage:'小组赛', handicap:2.5, hScore:1, aScore:3 , tournament:'WC' },
    { home:'英格兰',   away:'克罗地亚', stage:'小组赛', handicap:2.5, hScore:4, aScore:2 , tournament:'WC' },
    { home:'加纳',     away:'巴拿马',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'WC' },

    // ==================== 2026 世预赛 欧洲区 关键场次 ====================
    { home:'德国',     away:'斯洛伐克', stage:'小组赛', handicap:2.5, hScore:3, aScore:1 , tournament:'Qualifier' },
    { home:'法国',     away:'乌克兰',   stage:'小组赛', handicap:2.5, hScore:3, aScore:0 , tournament:'Qualifier' },
    { home:'荷兰',     away:'波兰',     stage:'小组赛', handicap:2.5, hScore:4, aScore:0 , tournament:'Qualifier' },
    { home:'挪威',     away:'意大利',   stage:'小组赛', handicap:2.5, hScore:4, aScore:1 , tournament:'Qualifier' },
    { home:'英格兰',   away:'塞尔维亚', stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Qualifier' },
    { home:'葡萄牙',   away:'匈牙利',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Qualifier' },
    { home:'西班牙',   away:'土耳其',   stage:'小组赛', handicap:2.5, hScore:3, aScore:0 , tournament:'Qualifier' },
    { home:'意大利',   away:'挪威',     stage:'小组赛', handicap:2.5, hScore:1, aScore:4 , tournament:'Qualifier' },
    { home:'奥地利',   away:'罗马尼亚', stage:'小组赛', handicap:2.5, hScore:2, aScore:1 , tournament:'Qualifier' },
    { home:'比利时',   away:'威尔士',   stage:'小组赛', handicap:2.5, hScore:2, aScore:1 , tournament:'Qualifier' },
    { home:'克罗地亚', away:'捷克',     stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Qualifier' },
    // 附加赛
    { home:'意大利',   away:'丹麦',     stage:'1/8决赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Qualifier' },
    { home:'乌克兰',   away:'瑞典',     stage:'1/8决赛', handicap:2.5, hScore:1, aScore:3 , tournament:'Qualifier' },
    { home:'波兰',     away:'阿尔巴尼亚', stage:'1/8决赛', handicap:2.5, hScore:2, aScore:1 , tournament:'Qualifier' },
    { home:'土耳其',   away:'罗马尼亚', stage:'1/8决赛', handicap:2.5, hScore:1, aScore:0 , tournament:'Qualifier' },
    { home:'丹麦',     away:'斯洛伐克', stage:'1/8决赛', handicap:2.5, hScore:4, aScore:0 , tournament:'Qualifier' },

    // ==================== Copa América 2024 (32场) ====================
    // Group A
    { home:'阿根廷',   away:'加拿大',   stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Copa' },
    { home:'秘鲁',     away:'智利',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'Copa' },
    { home:'秘鲁',     away:'加拿大',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 , tournament:'Copa' },
    { home:'智利',     away:'阿根廷',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 , tournament:'Copa' },
    { home:'阿根廷',   away:'秘鲁',     stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Copa' },
    { home:'加拿大',   away:'智利',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'Copa' },
    // Group B
    { home:'厄瓜多尔', away:'委内瑞拉', stage:'小组赛', handicap:2.5, hScore:1, aScore:2 , tournament:'Copa' },
    { home:'墨西哥',   away:'牙买加',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'Copa' },
    { home:'委内瑞拉', away:'墨西哥',   stage:'小组赛', handicap:2.5, hScore:1, aScore:0 , tournament:'Copa' },
    { home:'厄瓜多尔', away:'牙买加',   stage:'小组赛', handicap:2.5, hScore:3, aScore:1 , tournament:'Copa' },
    { home:'墨西哥',   away:'厄瓜多尔', stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'Copa' },
    { home:'牙买加',   away:'委内瑞拉', stage:'小组赛', handicap:2.5, hScore:0, aScore:3 , tournament:'Copa' },
    // Group C
    { home:'美国',     away:'玻利维亚', stage:'小组赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Copa' },
    { home:'乌拉圭',   away:'巴拿马',   stage:'小组赛', handicap:2.5, hScore:3, aScore:1 , tournament:'Copa' },
    { home:'巴拿马',   away:'美国',     stage:'小组赛', handicap:2.5, hScore:2, aScore:1 , tournament:'Copa' },
    { home:'乌拉圭',   away:'玻利维亚', stage:'小组赛', handicap:2.5, hScore:5, aScore:0 , tournament:'Copa' },
    { home:'美国',     away:'乌拉圭',   stage:'小组赛', handicap:2.5, hScore:0, aScore:1 , tournament:'Copa' },
    { home:'玻利维亚', away:'巴拿马',   stage:'小组赛', handicap:2.5, hScore:1, aScore:3 , tournament:'Copa' },
    // Group D
    { home:'哥伦比亚', away:'巴拉圭',   stage:'小组赛', handicap:2.5, hScore:2, aScore:1 , tournament:'Copa' },
    { home:'巴西',     away:'哥斯达黎加', stage:'小组赛', handicap:2.5, hScore:0, aScore:0 , tournament:'Copa' },
    { home:'巴拉圭',   away:'巴西',     stage:'小组赛', handicap:2.5, hScore:1, aScore:4 , tournament:'Copa' },
    { home:'哥伦比亚', away:'哥斯达黎加', stage:'小组赛', handicap:2.5, hScore:3, aScore:0 , tournament:'Copa' },
    { home:'巴西',     away:'哥伦比亚', stage:'小组赛', handicap:2.5, hScore:1, aScore:1 , tournament:'Copa' },
    { home:'哥斯达黎加', away:'巴拉圭', stage:'小组赛', handicap:2.5, hScore:2, aScore:1 , tournament:'Copa' },
    // Quarterfinals
    { home:'阿根廷',   away:'厄瓜多尔', stage:'1/4决赛', handicap:2.5, hScore:1, aScore:1 , tournament:'Copa' },
    { home:'委内瑞拉', away:'加拿大',   stage:'1/4决赛', handicap:2.5, hScore:1, aScore:1 , tournament:'Copa' },
    { home:'哥伦比亚', away:'巴拿马',   stage:'1/4决赛', handicap:2.5, hScore:5, aScore:0 , tournament:'Copa' },
    { home:'乌拉圭',   away:'巴西',     stage:'1/4决赛', handicap:2.5, hScore:0, aScore:0 , tournament:'Copa' },
    // Semifinals
    { home:'阿根廷',   away:'加拿大',   stage:'半决赛', handicap:2.5, hScore:2, aScore:0 , tournament:'Copa' },
    { home:'乌拉圭',   away:'哥伦比亚', stage:'半决赛', handicap:2.5, hScore:0, aScore:1 , tournament:'Copa' },
    // Third place
    { home:'加拿大',   away:'乌拉圭',   stage:'三四名决赛', handicap:2.5, hScore:2, aScore:2 , tournament:'Copa' },
    // Final
    { home:'阿根廷',   away:'哥伦比亚', stage:'决赛', handicap:2.0, hScore:1, aScore:0, tournament:'Copa' },

    // ==================== AFCON 2023 (48场) ====================
    // Group A: CIV, NGA, EQG, GNB — only CIV+NGA in DB
    { home:'科特迪瓦', away:'尼日利亚', stage:'小组赛', handicap:2.0, hScore:0, aScore:1, tournament:'AFCON' },
    // Group B: EGY, GHA, CPV, MOZ
    { home:'埃及', away:'加纳', stage:'小组赛', handicap:2.0, hScore:2, aScore:2, tournament:'AFCON' },
    { home:'佛得角', away:'埃及', stage:'小组赛', handicap:2.0, hScore:2, aScore:2, tournament:'AFCON' },
    { home:'加纳', away:'佛得角', stage:'小组赛', handicap:2.0, hScore:1, aScore:2, tournament:'AFCON' },
    // Group C: SEN, CMR, GUI, GAM
    { home:'塞内加尔', away:'喀麦隆', stage:'小组赛', handicap:2.0, hScore:3, aScore:1, tournament:'AFCON' },
    { home:'喀麦隆', away:'几内亚', stage:'小组赛', handicap:2.0, hScore:1, aScore:1, tournament:'AFCON' },
    { home:'几内亚', away:'塞内加尔', stage:'小组赛', handicap:2.0, hScore:0, aScore:2, tournament:'AFCON' },
    // Group D: ALG, BFA, ANG, MTN
    { home:'阿尔及利亚', away:'安哥拉', stage:'小组赛', handicap:2.0, hScore:1, aScore:1, tournament:'AFCON' },
    { home:'阿尔及利亚', away:'布基纳法索', stage:'小组赛', handicap:2.0, hScore:2, aScore:2, tournament:'AFCON' },
    { home:'安哥拉', away:'布基纳法索', stage:'小组赛', handicap:2.0, hScore:2, aScore:0, tournament:'AFCON' },
    // Group E: TUN, MLI, RSA, NAM
    { home:'突尼斯', away:'纳米比亚', stage:'小组赛', handicap:2.0, hScore:0, aScore:1, tournament:'AFCON' },
    { home:'马里', away:'南非', stage:'小组赛', handicap:2.0, hScore:2, aScore:0, tournament:'AFCON' },
    { home:'突尼斯', away:'马里', stage:'小组赛', handicap:2.0, hScore:1, aScore:1, tournament:'AFCON' },
    { home:'南非', away:'纳米比亚', stage:'小组赛', handicap:2.0, hScore:4, aScore:0, tournament:'AFCON' },
    { home:'南非', away:'突尼斯', stage:'小组赛', handicap:2.0, hScore:0, aScore:0, tournament:'AFCON' },
    // Group F: MAR, COD, ZAM, TAN
    { home:'摩洛哥', away:'民主刚果', stage:'小组赛', handicap:2.0, hScore:1, aScore:1, tournament:'AFCON' },
    { home:'民主刚果', away:'赞比亚', stage:'小组赛', handicap:2.0, hScore:1, aScore:1, tournament:'AFCON' },
    { home:'赞比亚', away:'摩洛哥', stage:'小组赛', handicap:2.0, hScore:0, aScore:1, tournament:'AFCON' },
    // R16
    { home:'尼日利亚', away:'喀麦隆', stage:'1/8决赛', handicap:2.0, hScore:2, aScore:0, tournament:'AFCON' },
    { home:'埃及', away:'民主刚果', stage:'1/8决赛', handicap:2.0, hScore:1, aScore:1, tournament:'AFCON' },
    { home:'塞内加尔', away:'科特迪瓦', stage:'1/8决赛', handicap:2.0, hScore:1, aScore:1, tournament:'AFCON' },
    { home:'马里', away:'布基纳法索', stage:'1/8决赛', handicap:2.0, hScore:2, aScore:1, tournament:'AFCON' },
    { home:'摩洛哥', away:'南非', stage:'1/8决赛', handicap:2.0, hScore:0, aScore:2, tournament:'AFCON' },
    { home:'安哥拉', away:'纳米比亚', stage:'1/8决赛', handicap:2.0, hScore:3, aScore:0, tournament:'AFCON' },
    // QF
    { home:'尼日利亚', away:'安哥拉', stage:'1/4决赛', handicap:2.0, hScore:1, aScore:0, tournament:'AFCON' },
    { home:'民主刚果', away:'几内亚', stage:'1/4决赛', handicap:2.0, hScore:3, aScore:1, tournament:'AFCON' },
    { home:'马里', away:'科特迪瓦', stage:'1/4决赛', handicap:2.0, hScore:1, aScore:2, tournament:'AFCON' },
    // SF
    { home:'尼日利亚', away:'南非', stage:'半决赛', handicap:2.0, hScore:1, aScore:1, tournament:'AFCON' },
    { home:'科特迪瓦', away:'民主刚果', stage:'半决赛', handicap:2.0, hScore:1, aScore:0, tournament:'AFCON' },
    // Final
    { home:'尼日利亚', away:'科特迪瓦', stage:'决赛', handicap:2.0, hScore:1, aScore:2, tournament:'AFCON' },

    // ==================== Asian Cup 2023 (有效场次) ====================
    { home:'澳大利亚', away:'乌兹别克', stage:'小组赛', handicap:2.0, hScore:1, aScore:1, tournament:'Asian' },
    { home:'伊朗', away:'阿联酋',   stage:'小组赛', handicap:2.0, hScore:2, aScore:1, tournament:'Asian' },
    { home:'日本', away:'伊拉克',   stage:'小组赛', handicap:2.0, hScore:1, aScore:2, tournament:'Asian' },
    { home:'韩国', away:'巴林',     stage:'小组赛', handicap:2.5, hScore:3, aScore:1, tournament:'Asian' },
    { home:'约旦', away:'韩国',     stage:'小组赛', handicap:2.5, hScore:2, aScore:2, tournament:'Asian' },
    { home:'沙特', away:'阿曼',     stage:'小组赛', handicap:2.0, hScore:2, aScore:1, tournament:'Asian' },
    { home:'沙特', away:'泰国',     stage:'小组赛', handicap:2.5, hScore:0, aScore:0, tournament:'Asian' },
    { home:'卡塔尔', away:'乌兹别克', stage:'1/4决赛', handicap:2.0, hScore:1, aScore:1, tournament:'Asian' },
    { home:'伊朗', away:'叙利亚',   stage:'1/8决赛', handicap:2.0, hScore:1, aScore:1, tournament:'Asian' },
    { home:'伊朗', away:'日本',     stage:'1/4决赛', handicap:2.5, hScore:2, aScore:1, tournament:'Asian' },
    { home:'澳大利亚', away:'韩国', stage:'1/4决赛', handicap:2.5, hScore:1, aScore:2, tournament:'Asian' },
    { home:'约旦', away:'韩国',     stage:'半决赛', handicap:2.5, hScore:2, aScore:0, tournament:'Asian' },
    { home:'伊朗', away:'卡塔尔',   stage:'半决赛', handicap:2.5, hScore:2, aScore:3, tournament:'Asian' },
    { home:'约旦', away:'卡塔尔',   stage:'决赛', handicap:2.0, hScore:1, aScore:3, tournament:'Asian' },
];

// Standard exports
if (typeof module !== 'undefined' && module.exports) module.exports = BACKTEST_MATCHES;
if (typeof window !== 'undefined') window.BACKTEST_MATCHES = BACKTEST_MATCHES;
