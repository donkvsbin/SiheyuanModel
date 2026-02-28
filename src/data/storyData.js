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
                        title: "初见王爷爷",
                        description: "玩家在大门口遇到王爷爷",
                        dialogue: [
                            { speaker: "你", text: "您好，请问是王德顺先生吗？" },
                            { speaker: "王爷爷", text: "是啊，你是小林吧。来参观四合院的吧？过来歇口气。" },
                            { speaker: "你", text: "是，我替我妈来看看您。" },
                            { speaker: "王爷爷", text: "哦.....小梅啊，好久都没有见到她了，她小时候老在这院子里跑。这是'静心院'，已经有一百多年了，我们家三代人都在这儿住，除了你妈。以前真热闹，现在清静多了..." },
                            { speaker: "你", text: "我能进去看看吗？" },
                            { speaker: "王爷爷", text: "当然，你先进去吧，大门就在右边，别被门槛绊着了。" }
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
                        title: "Meeting Grandpa Wang",
                        description: "Player meets Grandpa Wang at the main gate",
                        dialogue: [
                            { speaker: "You", text: "Hello, are you Mr. Wang Deshun?" },
                            { speaker: "Grandpa Wang", text: "Yes, you must be Xiaolin. Here to visit the siheyuan? Come and rest for a while." },
                            { speaker: "You", text: "Yes, I'm here to visit you on behalf of my mother." },
                            { speaker: "Grandpa Wang", text: "Oh... Little Mei, I haven't seen her for a long time. She used to run around this courtyard when she was young. This is 'Jingxin Courtyard'. It's over 100 years old. My family has lived here for three generations, except for your mother. It used to be so lively, but now it's much quieter..." },
                            { speaker: "You", text: "Can I go in and have a look?" },
                            { speaker: "Grandpa Wang", text: "Of course, go ahead. The main gate is on the right. Watch out for the threshold." }
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

// 垂花门对话（王爷爷在垂花门处的新对话）
export function getChuihuaDialogue(locale) {
    const dialogues = {
        zh: [
            { speaker: "你", text: "这么大的院子，一定有很多人住吧。" },
            { speaker: "王爷爷", text: "现在就剩我和我老伴了。半年？一年？记不清了。忙，都忙。我有两个儿子一个女儿，都跑出去了，剩我俩在这院子里。" },
            { speaker: "王爷爷", text: "这院子以前热闹。我爹在的时候，一大家子十几口人。后来孩子们一个个飞走了，就剩我一个。人老了，脑子也锈了，以前的事...像隔着毛玻璃，看得见，摸不着。" }
        ],
        en: [
            { speaker: "You", text: "Such a big courtyard, there must be many people living here." },
            { speaker: "Grandpa Wang", text: "Now it's just me and my wife. Half a year? A year? I can't remember. Busy, all busy. I have two sons and a daughter, they all left, leaving just the two of us in this courtyard." },
            { speaker: "Grandpa Wang", text: "This courtyard used to be lively. When my father was alive, there were more than a dozen people in the family. Later, the children flew away one by one, leaving only me. When you get old, your mind rusts too. The past... it's like looking through frosted glass, you can see it but can't touch it." }
        ]
    };
    return dialogues[locale] || dialogues['zh'];
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
        //王氏家谱
        familybook: {
            zh: "家谱是记录家族成员和血缘关系的重要文献。在传统四合院中，家谱通常由家族长辈保管，记录祖先的名字、生平和家族传承。通过家谱，人们可以了解自己的家族历史和辈分。",
            en: "The family genealogy is an important document recording family members and blood relationships. In traditional siheyuan, the genealogy is usually kept by the family elders, recording the names, life stories, and family heritage of ancestors. Through the genealogy, people can understand their family history and generational status."
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
        id: "familybook",
        name: "王氏家谱",
        nameEn: "Wang Family Book",
        position: { x: -1, y: 15.5, z: 20 },
        radius: 2,
        action: "interact",
        once: true,
        condition: null
    },
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
        radius: 2,
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
        radius: 2,
        action: "interact",
        condition: null
    },
    {
        id: "taohe",
        name: "海棠树",
        nameEn: "Taohe Tree",
        position: { x: 7, y: 14.5, z: 5 },
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
            {
                id: "wang_family_book",
                name: "王氏家谱",
                icon: "",
                image: "/photo/Collection/Book.png",
                interactionId: "familybook",
                location: "正房",
                description: "王氏家族世代相传的家谱，记录了王家三代人在静心院的生活点滴。泛黄的纸页上记载着家族的荣耀与传承。"
            },
            {
                id: "land_deed",
                name: "地契",
                icon: "",
                image: "/photo/Collection/Landdeed.png",
                interactionId: "landdeed",
                location: "正房",
                description: "地契是房屋和土地所有权的证明文件。在古代北京，四合院的主人会保存地契，以证明自己对房屋的合法拥有权。地契通常盖有官方印章，具有法律效力。"
            },
            {
                id: "folding_fan",
                name: "折扇",
                icon: "",
                image: "/photo/Collection/Fan.png",
                interactionId: "fan",
                location: "东厢房",
                description: "折扇是传统的纳凉工具。夏天，人们常在院子里一边乘凉，一边摇扇子。折扇不仅实用，还常带有书法或绘画装饰。"
            },
            {
                id: "jianzi",
                name: "毽子",
                icon: "",
                image: "/photo/Collection/Jianzi.png",
                interactionId: "jianzi",
                location: "内院",
                description: "踢毽子是传统的儿童游戏，在院子里非常常见。"
            },
        ]
    },
    en: {
        items: [
            {
                id: "wang_family_book",
                name: "Wang Family Genealogy",
                icon: "",
                image: "/photo/Collection/Book.png",
                interactionId: "familybook",
                location: "Main House",
                description: "The Wang family's ancestral genealogy, passed down through generations, recording three generations of the Wang family's life in Jingxin Courtyard. The yellowed pages bear witness to the family's honor and legacy."
            },
            {
                id: "land_deed",
                name: "Land Deed",
                icon: "",
                image: "/photo/Collection/Landdeed.png",
                interactionId: "landdeed",
                location: "Main House",
                description: "The land deed is a legal document proving ownership of houses and land. In ancient Beijing, siheyuan owners would keep land deeds to prove their legal ownership of the property. The deed usually bears an official seal and has legal validity."
            },
            {
                id: "folding_fan",
                name: "Folding Fan",
                icon: "",
                image: "/photo/Collection/Fan.png",
                interactionId: "fan",
                location: "East Wing",
                description: "The folding fan is a traditional cooling tool. In summer, people would sit in the courtyard enjoying the cool breeze while waving fans. Folding fans are not only practical but often decorated with calligraphy or paintings."
            },
            {
                id: "jianzi",
                name: "Jianzi",
                icon: "",
                image: "/photo/Collection/Jianzi.png",
                interactionId: "jianzi",
                location: "Inner Courtyard",
                description: "Kick shuttlecock is a traditional children's game, very common in the courtyard."
            }
        ]
    }
};

// 获取当前语言的收集物数据
export function getCollectionData(locale) {
    return collectionData[locale] || collectionData['zh'];
}

// 任务数据
export const questData = {
    zh: [
        {
            id: "quest_talk_to_grandpa",
            name: "和王爷爷说话",
            description: "外公应该在大门口附近，先去找他聊聊。"
        },
        {
            id: "quest_explore_threshold",
            name: "探索门槛",
            description: "和王爷爷对话后，去右边的门槛看看。"
        },
        {
            id: "quest_enter_gate",
            name: "进入大门",
            description: "进入大门，观察影壁。"
        },
        {
            id: "quest_meet_grandpa_chuihua",
            name: "与王爷爷交流",
            description: "来到垂花门，与王爷爷交流。"
        },
        {
            id: "quest_explore_courtyard",
            name: "探索内院",
            description: "探索四合院内院，发现更多有趣的事物。"
        },
        {
            id: "quest_talk_about_family_book",
            name: "和王爷爷谈论家谱",
            description: "获得家谱后，和王爷爷谈论家谱的内容。"
        },
        {
            id: "quest_talk_to_grandma",
            name: "和老奶奶聊天",
            description: "院子里有位老奶奶，去和她打个招呼。"
        },
        {
            id: "quest_tea_ceremony",
            name: "体验茶道",
            description: "西厢房可以体验茶道，去试试看。"
        }
    ],
    en: [
        {
            id: "quest_talk_to_grandpa",
            name: "Talk to Grandpa",
            description: "Grandpa should be near the main gate, go talk to him."
        },
        {
            id: "quest_explore_threshold",
            name: "Explore the Threshold",
            description: "After talking to Grandpa, go check out the threshold on the right."
        },
        {
            id: "quest_enter_gate",
            name: "Enter the Gate",
            description: "Enter the main gate and observe the screen wall."
        },
        {
            id: "quest_meet_grandpa_chuihua",
            name: "Talk to Grandpa",
            description: "Come to the Chuihua Gate and talk to Grandpa."
        },
        {
            id: "quest_explore_courtyard",
            name: "Explore Courtyard",
            description: "Explore the inner courtyard and discover more interesting things."
        },
        {
            id: "quest_talk_about_family_book",
            name: "Talk About Family Book",
            description: "After obtaining the family book, talk to Grandpa about it."
        },
        {
            id: "quest_talk_to_grandma",
            name: "Chat with Grandma",
            description: "There's an old lady in the courtyard, go say hello."
        },
        {
            id: "quest_tea_ceremony",
            name: "Experience Tea Ceremony",
            description: "The tea ceremony is available in the west wing, give it a try."
        }
    ]
};

// 获取当前语言的任务数据
export function getQuestData(locale) {
    return questData[locale] || questData['zh'];
}

export default storyData;
