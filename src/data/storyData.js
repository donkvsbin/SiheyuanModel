/**
 * 四合院剧情数据
 * 基于四合院场景的剧情设计
 */

export const storyData = {
    zh: {
        title: "四合院往事",
        chapters: [
            {
                id: "chapter1",
                title: "初入庭院",
                scenes: [
                    {
                        id: "scene1_1",
                        title: "醒来",
                        description: "玩家在四合院中醒来，老人在不远处",
                        dialogue: [
                            { speaker: "王爷爷", text: "小伙子，是来参观四合院的吧？过来歇口气。" },
                            { speaker: "你", text: "老人家，请问这是什么地方？是老四合院吗？" },
                            { speaker: "王爷爷", text: "哈哈，是啊！我是王爷爷，这里是'静心院'，已经有一百多年了，我们家三代人都在这儿住。" },
                            { speaker: "你", text: "哇，好厉害！我能进去看看吗？" },
                            { speaker: "王爷爷", text: "当然能！进去慢点儿，别漏了影壁和堂屋的老字画，都很特别。" },
                            { speaker: "你", text: "好嘞，谢谢大爷！" },
                            { speaker: "王爷爷", text: "去吧孩子，右边就是大门。" }
                        ]
                    }
                ]
            },
            {
                id: "chapter2",
                title: "午后时光",
                scenes: [
                    {
                        id: "scene2_1",
                        title: "遇见老奶奶",
                        description: "玩家在院子里遇到抚摸猫的老奶奶",
                        dialogue: [
                            { speaker: "你", text: "奶奶，您这猫养得真好，毛色真亮。" },
                            { speaker: "老奶奶", text: "呵呵，这猫儿跟了我十二年啦，比亲孙子还亲呢。" },
                            { speaker: "你", text: "它每天都在这儿晒太阳吗？" },
                            { speaker: "老奶奶", text: "可不是嘛，这院子朝南，午后阳光最好。猫儿懂享受，人也该学学。" },
                            { speaker: "你", text: "奶奶，这院子住得舒服吗？" },
                            { speaker: "老奶奶", text: "舒服啊，冬暖夏凉，邻里亲近。年轻人，慢点走，多看看，这院子里的每一块砖都有故事。" }
                        ]
                    }
                ]
            }
        ]
    },
    en: {
        title: "The Siheyuan Story",
        chapters: [
            {
                id: "chapter1",
                title: "First Entry",
                scenes: [
                    {
                        id: "scene1_1",
                        title: "Awakening",
                        description: "Player wakes up in the siheyuan, an old man is nearby",
                        dialogue: [
                            { speaker: "Grandpa Wang", text: "Young man, come to visit the siheyuan? Come and rest for a while." },
                            { speaker: "You", text: "Old man, what is this place? Is it an old siheyuan?" },
                            { speaker: "Grandpa Wang", text: "Haha, yes! I'm Grandpa Wang. This is 'Jingxin Courtyard'. It's over 100 years old. My family has lived here for three generations." },
                            { speaker: "You", text: "Wow, amazing! Can I go in and have a look?" },
                            { speaker: "Grandpa Wang", text: "Sure! Please walk slowly inside. Don't miss the screen wall and the old calligraphy and paintings in the main room. They are very special." },
                            { speaker: "You", text: "Okay, thank you, Grandpa!" },
                            { speaker: "Grandpa Wang", text: "Go ahead, the main entrance is on the right." }
                        ]
                    }
                ]
            },
            {
                id: "chapter2",
                title: "Afternoon Time",
                scenes: [
                    {
                        id: "scene2_1",
                        title: "Meeting Grandma",
                        description: "Player meets grandma petting her cat in the courtyard",
                        dialogue: [
                            { speaker: "You", text: "Grandma, your cat is so well-kept, its fur is so shiny." },
                            { speaker: "Grandma", text: "Hehe, this cat has been with me for twelve years, closer than my own grandchildren." },
                            { speaker: "You", text: "Does it sunbathe here every day?" },
                            { speaker: "Grandma", text: "Of course, this courtyard faces south, the afternoon sun is the best. The cat knows how to enjoy life, people should learn from it." },
                            { speaker: "You", text: "Grandma, is it comfortable living in this courtyard?" },
                            { speaker: "Grandma", text: "Very comfortable, warm in winter and cool in summer, close neighbors. Young person, walk slowly, look around, every brick in this courtyard has a story." }
                        ]
                    }
                ]
            }
        ]
    }
};

// 获取当前语言的剧情数据
export function getStoryData(locale) {
    return storyData[locale] || storyData['zh'];
}

// 获取简短提示语（第二次及以后对话）
export function getShortDialogue(locale) {
    const shortDialogues = {
        zh: [
            { speaker: "王爷爷", text: "去吧孩子，右边就是大门。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "Go ahead, the main entrance is on the right." }
        ]
    };
    return shortDialogues[locale] || shortDialogues['zh'];
}



// 获取tips提示文本
export function getTipsText(locale, tipId) {
    const tipsData = {
        //门槛
        threshold: {
            zh: "门槛高30厘米，象征地位，也防止雨水倒灌。进出需抬脚，不能踩踏。提示：按下Space键可以越过门槛。",
            en: "The threshold is 30 centimeters high, symbolizing status and also preventing rainwater from flowing back in. You need to lift your feet to go in and out, and cannot step on it. Tip: Press the Space key to step over the threshold."
        },
        //影壁
        screenwall: {
            zh: "影壁，又称照壁，是四合院的第一道风景。它挡住外人视线，保护院内隐私，也阻挡邪气直入。壁上常有'福'字或吉祥图案。提示：绕过影壁，内院的风景更精彩",
            en: "The screen wall, also known as zhaobi, is the first sight of the siheyuan. It blocks outsiders' view to protect privacy and prevents evil spirits from entering directly. It often bears the character 'Fu' (blessing) or auspicious patterns."
        },
        //垂花门
        chuihuamen: {
            zh: [
                "垂花门，又称二门，是四合院内外院的分界。门上垂莲柱雕刻精美，是四合院中最华丽的门。俗语'大门不出，二门不迈'中的二门即指此门。",
                "穿过这道垂花门，便是后院了。现在尽情探索这里吧。"
            ],
            en: [
                "The Chuihua Gate, also known as the Second Gate, marks the boundary between the outer and inner courtyards. Its hanging lotus columns are exquisitely carved, making it the most ornate gate in the siheyuan. The saying 'never leaves the main gate, never steps past the second gate' refers to this gate.",
                "Pass through this Chuihua Gate to enter the back courtyard. Explore to your heart's content."
            ]
        },
        //石榴
        pomegranate: {
            zh: "石榴多籽，象征多子多福。中秋节常吃石榴，象征团圆。",
            en: "Pomegranates have many seeds, symbolizing fertility and prosperity. Eating pomegranates during the Mid-Autumn Festival symbolizes family reunion."
        },
        //笔墨纸砚
        calligraphy: {
            zh: "笔墨纸砚，文房四宝。毛笔柔软，宣纸吸墨，墨分五色，砚台研墨。书法是中国传统艺术，一笔一画皆有韵味。",
            en: "The Four Treasures of the Study: brush, ink, paper, and inkstone. The brush is soft, Xuan paper absorbs ink, ink has five shades, and the inkstone grinds the ink. Calligraphy is a traditional Chinese art, where every stroke has its own charm."
        },
        //猫
        cat: {
            zh: "一只橘白相间的老猫，正慵懒地打着盹儿。",
            en: "An orange and white old cat, lazily taking a nap."
        },
        //正房
        mainhouse: {
            zh: "正房高敞，是长辈的居所；厢房略低，归晚辈居住。一高一低之间，是长幼有序，也是敬老的传统。四合院的布局，处处体现着中国家庭的伦理与温情。",
            en: "The main house is spacious for the elders; the side houses are slightly lower for the younger generation. The difference in height represents the order of seniority and the tradition of respecting the elderly."
        },
        //东厢房
        eastwing: {
            zh: "东厢房位于院落东侧，是晚辈居住的地方。它与西厢房相对，一东一西，阴阳平衡。东厢房通常比正房略低，体现长幼有序的传统伦理。",
            en: "The East Wing is located on the east side of the courtyard, where the younger generation lives. It faces the West Wing, creating a balance of yin and yang. The East Wing is usually slightly lower than the main house, reflecting the traditional ethics of respecting seniority."
        },
        //西厢房
        westwing: {
            zh: "西厢房位于院落西侧，与东厢房相对。在四合院中，东西厢房对称分布，体现阴阳平衡的理念。西厢房同样是晚辈的居所，与东厢房共同构成内院的重要组成部分。",
            en: "The West Wing is located on the west side of the courtyard, facing the East Wing. In the siheyuan, the east and west wings are symmetrically distributed, embodying the concept of yin-yang balance. The West Wing is also the residence of the younger generation, together with the East Wing forming an important part of the inner courtyard."
        },
        //茶道
        tea: {
            zh: [
                "茶道，是中国传统文化的重要组成部分。'温杯'是泡茶的第一步，用热水温烫茶具，既清洁器具，又能提升茶香。",
                "'投茶'讲究手法与分量。茶叶的多少直接影响茶汤的浓淡，而优雅的动作则体现了茶人的修养。",
                "'注水'是泡茶的关键。水温、水流的高低与缓急，都会影响茶叶的舒展和茶汤的滋味。",
                "'品茗'是茶道的最高境界。细品慢饮，感受茶汤在口中的层次变化，体会'茶禅一味'的境界。"
            ],
            en: [
                "Tea ceremony is an important part of Chinese traditional culture. 'Warming the cup' is the first step, using hot water to warm the teaware, cleaning the utensils and enhancing the tea aroma.",
                "'Adding tea' requires skill and measurement. The amount of tea directly affects the strength of the brew, while elegant movements reflect the tea master's cultivation.",
                "'Pouring water' is the key to brewing. Water temperature and flow rate affect how the tea leaves unfold and the taste of the tea.",
                "'Tasting tea' is the highest realm of tea ceremony. Savor slowly, feel the layers of flavor in your mouth, and experience the state of 'tea and Zen as one'."
            ]
        },
        //海棠树
        taohe: {
            zh: "海棠树，又称西府海棠，是四合院中常见的树种。它的花朵美丽，象征着爱情和幸福。",
            en: "The taohe tree, also known as the West府tangerine, is a common tree species in the siheyuan. Its flowers are beautiful, symbolizing love and happiness."
        },
        //厨房
        kitchen: {
            zh: "厨房是四合院中用于烹饪食物的地方。它通常位于院落的东南角，与正房相对。厨房中设有灶台、储物柜和各种烹饪用具。",
            en: "The kitchen is the place in the siheyuan where food is cooked. It is usually located in the southeast corner, opposite the main house. The kitchen features a stove, storage cabinets, and various cooking utensils."
        },

    };
    const tip = tipsData[tipId];
    return tip ? (tip[locale] || tip['zh']) : '';
}

/**
 * 交互点配置
 */
export const interactionPoints = [
    {
        id: "oldman",
        name: "王爷爷",
        nameEn: "Grandpa Wang",
        position: { x: -2, y: 15, z: -36 },
        radius: 3,
        action: "talk",
        condition: null
    },
    {
        id: "guidance",
        name: "门槛",
        nameEn: "Threshold",
        position: { x: -24, y: 16, z: -30 },
        radius: 4,
        action: "interact",
        condition: null
    },
    {
        id: "arrow2",
        name: "影壁",
        nameEn: "Screen Wall",
        position: { x: -24, y: 15, z: -10.7 },
        radius: 5,
        action: "interact",
        condition: null
    },
    {
        id: "chuihuamen",
        name: "垂花门",
        nameEn: "Chuihua Gate",
        position: { x: 1, y: 15, z: -10 },
        radius: 5,
        action: "interact",
        condition: null
    },
    {
        id: "swing",
        name: "秋千",
        nameEn: "Swing",
        position: { x: -8, y: 16, z: 1 },
        radius: 5,
        action: "interact",
        condition: null
    },
    {
        id: "pomegranate",
        name: "石榴树",
        nameEn: "Pomegranate Tree",
        position: { x: -5, y: 16, z: 30 },
        radius: 2,
        action: "interact",
        condition: null
    },
    {
        id: "calligraphy",
        name: "纸墨笔砚",
        nameEn: "Four Treasures",
        position: { x: 1, y: 16, z: 18 },
        radius: 4,
        action: "interact",
        condition: null
    },
    {
        id: "oldwoman",
        name: "老奶奶",
        nameEn: "Grandma",
        position: { x: -7, y: 14.7, z: 22 },
        radius: 2.5,
        action: "interact",
        condition: null
    },
    {
        id: "cat",
        name: "猫",
        nameEn: "Cat",
        position: { x: -8, y: 15, z: 26 },
        radius: 2,
        action: "interact",
        condition: null
    },
    {
        id: "mainhouse",
        name: "正房",
        nameEn: "Main House",
        position: { x: 1, y: 15, z: 40 },
        radius: 5,
        action: "interact",
        condition: null
    },
    {
        id: "eastwing",
        name: "东厢房",
        nameEn: "East Wing",
        position: { x: -22, y: 16, z: 20 },
        radius: 3,
        action: "interact",
        condition: null
    },
    {
        id: "westwing",
        name: "西厢房",
        nameEn: "West Wing",
        position: { x: 24, y: 17, z: 20 },
        radius: 3,
        action: "interact",
        condition: null
    },
    {
        id: "tea",
        name: "茶点",
        nameEn: "Tea",
        position: { x: 1, y: 16, z: 22 },
        radius: 3,
        action: "interact",
        condition: null
    }
];

/**
 * 收集物数据配置
 * 在这里添加你想要收集的物品
 */
export const collectionData = {
    zh: {
        items: [
            // 在这里添加收集物，格式示例：
            // {
            //     id: "item1",
            //     name: "物品名称",
            //     icon: "🔮",
            //     interactionId: "交互点ID",
            //     location: "发现地点",
            //     description: "物品描述"
            // }
        ]
    },
    en: {
        items: [
            // Add collectibles here, format example:
            // {
            //     id: "item1",
            //     name: "Item Name",
            //     icon: "🔮",
            //     interactionId: "interactionId",
            //     location: "Discovery Location",
            //     description: "Item description"
            // }
        ]
    }
};

// 获取当前语言的收集物数据
export function getCollectionData(locale) {
    return collectionData[locale] || collectionData['zh'];
}

export default storyData;
