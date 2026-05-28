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

// 家谱对话后的简短提示语（第二次及以后对话）
export function getFamilyBookShortDialogue(locale) {
    const shortDialogues = {
        zh: [
            { speaker: "王爷爷", text: "东厢房还锁着呢？去石榴树下找找钥匙吧，你奶奶就爱把东西藏那儿。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "East Wing still locked? Check under the pomegranate tree for the key. Your grandmother always loved hiding things there." }
        ]
    };
    return shortDialogues[locale] || shortDialogues['zh'];
}

// 全家福对话后的简短提示语（找到碎片前第二次及以后对话）
export function getFamilyPhotoShortDialogue(locale) {
    const shortDialogues = {
        zh: [
            { speaker: "王爷爷", text: "去西厢房看看吧，墨锭和别的东西都在那边。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "Go check the West Wing. The ink stick and other things are there." }
        ]
    };
    return shortDialogues[locale] || shortDialogues['zh'];
}

// 全家福碎片对话后的简短提示语（摘石榴前第二次及以后对话）
export function getPhotoPieceShortDialogue(locale) {
    const shortDialogues = {
        zh: [
            { speaker: "王爷爷", text: "去摘点石榴吧，带回去。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "Go pick some pomegranates and take them home." }
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

// 家谱对话（获得家谱后与王爷爷的对话）
export function getFamilyBookDialogue(locale) {
    const dialogues = {
        zh: [
            { speaker: "王爷爷", text: "这是我们家的家谱。" },
            { speaker: "你", text: "这么厚啊。" },
            { speaker: "王爷爷", text: "厚是厚。纸比人还多。", expression: "笑" },
            { speaker: "你", text: "字写得真工整。" },
            { speaker: "王爷爷", text: "以前都是毛笔写的。我爹写一页，要磨半天墨。" },
            { speaker: "你", text: "您也写过吗？" },
            { speaker: "王爷爷", text: "写过。年轻的时候记得清楚。谁是第几代，谁娶了谁，谁脾气倔，谁偷着吃糖被罚站。" },
            { speaker: "你", text: "连这个都记得。", expression: "笑" },
            { speaker: "王爷爷", text: "那会儿记得清。现在不行了，有时候翻到名字，得想一会儿——'这是谁来着？'想半天，忽然又想起来：哦，是那个老爱爬树的。" },
            { speaker: "你", text: "那这儿怎么空着？" },
            { speaker: "王爷爷", text: "这是老三的位置。", expression: "手停住" },
            { speaker: "你", text: "怎么会空着？" },
            { speaker: "王爷爷", text: "以前吵架。他说别写，我也气。我说'不写就不写'，就真空了。" },
            { speaker: "你", text: "就因为一场架？" },
            { speaker: "王爷爷", text: "人年轻的时候，觉得吵赢了就算赢了。后来才知道，赢了嘴，输了人。" },
            { speaker: "你", text: "他后来回来过吗？" },
            { speaker: "王爷爷", text: "回来过一次。站在门口，没进来。" },
            { speaker: "你", text: "您看见了？" },
            { speaker: "王爷爷", text: "这院子小，站门口都听得见呼吸。" },
            { speaker: "你", text: "那您当时……没叫他吗？" },
            { speaker: "王爷爷", text: "当时我觉得，他要是真想进，自然会进。现在想想，我要是叫一声……也许就不一样。" },
            { speaker: "你", text: "那现在呢？还能补上吗？", expression: "轻声" },
            { speaker: "王爷爷", text: "这页空着，总觉得风从这儿漏进来。", expression: "翻了两页又翻回来" },
            { speaker: "你", text: "写上吧。" },
            { speaker: "王爷爷", text: "你觉得该写吗？" },
            { speaker: "你", text: "院子不是用来赌气的。" },
            { speaker: "王爷爷", text: "写上……得磨墨啊。", expression: "长叹一口气" },
            { speaker: "你", text: "墨不是在这儿吗？" },
            { speaker: "王爷爷", text: "这砚台是空的。那块老墨，我好像收起来了。还有毛笔，也不知散在哪里了。" },
            { speaker: "王爷爷", text: "你帮我找找吧，一支旧毛笔，还有一块黑漆漆的墨锭。没有它们，这字写不下去。" },
            { speaker: "王爷爷", text: "毛笔应该在你三舅的东厢房里。不过那间房让你奶奶锁了好多年了，钥匙我记得她藏在石榴树底下。你先去石榴树下找找钥匙吧。" },
            { speaker: "你", text: "好，我去石榴树下看看。" },
            { speaker: "你", text: "对了，墨锭的话……" },
            { speaker: "王爷爷", text: "墨锭在西厢房，那间没锁。你先把毛笔和钥匙找着再说。" },
            { speaker: "你", text: "行，我先去东厢房。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "This is our family genealogy." },
            { speaker: "You", text: "It's so thick." },
            { speaker: "Grandpa Wang", text: "Thick indeed. More paper than people.", expression: "smiling" },
            { speaker: "You", text: "The handwriting is so neat." },
            { speaker: "Grandpa Wang", text: "In the old days, we used brush pens. My father would grind ink for half a day just to write one page." },
            { speaker: "You", text: "Did you write in it too?" },
            { speaker: "Grandpa Wang", text: "I did. When I was young, I remembered clearly. Who was which generation, who married whom, who had a stubborn temper, who was punished for stealing candy." },
            { speaker: "You", text: "You even remember that.", expression: "laughing" },
            { speaker: "Grandpa Wang", text: "I remembered clearly back then. Now I can't. Sometimes I see a name and have to think for a while—'Who was this?' Then suddenly remember: oh, that one who loved climbing trees." },
            { speaker: "You", text: "Why is this page blank?" },
            { speaker: "Grandpa Wang", text: "This is the third son's place.", expression: "hand stops" },
            { speaker: "You", text: "Why is it blank?" },
            { speaker: "Grandpa Wang", text: "We had a fight. He said don't write me in, and I was angry. I said 'Fine, don't write,' so it stayed blank." },
            { speaker: "You", text: "Just because of one fight?" },
            { speaker: "Grandpa Wang", text: "When you're young, you think winning an argument means winning. Later you realize, you won the words but lost the person." },
            { speaker: "You", text: "Did he ever come back?" },
            { speaker: "Grandpa Wang", text: "Once. Stood at the door, didn't come in." },
            { speaker: "You", text: "You saw him?" },
            { speaker: "Grandpa Wang", text: "This courtyard is small. You can hear breathing at the door." },
            { speaker: "You", text: "Then... didn't you call out to him?" },
            { speaker: "Grandpa Wang", text: "At the time, I thought if he really wanted to come in, he would. Now I think, if I had called out... maybe things would be different." },
            { speaker: "You", text: "What about now? Can it still be filled in?", expression: "softly" },
            { speaker: "Grandpa Wang", text: "This blank page... it feels like wind leaks through here.", expression: "flipping pages back and forth" },
            { speaker: "You", text: "Write it in." },
            { speaker: "Grandpa Wang", text: "Do you think it should be written?" },
            { speaker: "You", text: "Courtyards aren't for holding grudges." },
            { speaker: "Grandpa Wang", text: "To write... I need to grind ink.", expression: "sighing deeply" },
            { speaker: "You", text: "Isn't the ink right here?" },
            { speaker: "Grandpa Wang", text: "The inkstone is empty. That old ink stick... I seem to have put it away somewhere. And the brush, I don't know where it's scattered off to." },
            { speaker: "Grandpa Wang", text: "Help me look for them — an old brush, and a pitch-black ink stick. Without them, the writing can't begin." },
            { speaker: "Grandpa Wang", text: "The brush should be in your third uncle's room in the East Wing. But your grandmother locked that room years ago. The key... I remember she hid it under the pomegranate tree. Go check there first." },
            { speaker: "You", text: "Alright, I'll check under the pomegranate tree." },
            { speaker: "You", text: "And the ink stick?" },
            { speaker: "Grandpa Wang", text: "The ink stick is in the West Wing, that one's not locked. Find the brush and key first." },
            { speaker: "You", text: "Okay, I'll head to the East Wing." }
        ]
    };
    return dialogues[locale] || dialogues['zh'];
}

// 毛笔首次对话（拾取毛笔后，未拿墨锭）
export function getFamilyPhotoDialogue(locale) {
    const dialogues = {
        zh: [
            { speaker: "王爷爷", text: "这支毛笔……有些年头了。" },
            { speaker: "王爷爷", text: "笔杆上还有旧墨迹。老三小时候练字，用的就是这支。" },
            { speaker: "你", text: "他字写得好吗？" },
            { speaker: "王爷爷", text: "好。比我好。笔画工整，有耐心的时候能写一整篇。" },
            { speaker: "王爷爷", text: "就是不爱磨墨。磨两下就喊手酸，每次都要我催。" },
            { speaker: "你", text: "后来您催不动了？" },
            { speaker: "王爷爷", text: "后来他长大了，也不用我催了。" },
            { speaker: "王爷爷", text: "墨锭还在西厢房。那是块好墨，松烟制的。你去拿来，这笔才能用。" },
            { speaker: "你", text: "好，我去找找。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "This brush... it's been many years." },
            { speaker: "Grandpa Wang", text: "There's still old ink on the handle. Third used this one when he practiced calligraphy as a child." },
            { speaker: "You", text: "Was his handwriting good?" },
            { speaker: "Grandpa Wang", text: "Good. Better than mine. Neat strokes — when he had patience, he could write a whole page." },
            { speaker: "Grandpa Wang", text: "But he hated grinding ink. After two rubs he'd complain his hand hurt. I always had to push him." },
            { speaker: "You", text: "And later you stopped pushing?" },
            { speaker: "Grandpa Wang", text: "Later he grew up. He didn't need me to push anymore." },
            { speaker: "Grandpa Wang", text: "The ink stick is still in the West Wing. It's good ink, made from pine soot. Go get it — this brush won't write without it." },
            { speaker: "You", text: "Alright. I'll go look." }
        ]
    };
    return dialogues[locale] || dialogues['zh'];
}

// 墨锭首次对话（拾取墨锭后，未拿毛笔）
export function getInkStickDialogue(locale) {
    const dialogues = {
        zh: [
            { speaker: "王爷爷", text: "哎，是这块。松烟墨。", expression: "接过墨锭，用手指摩挲" },
            { speaker: "王爷爷", text: "这墨写出来偏冷，泛青。好墨，就是得慢慢磨。" },
            { speaker: "你", text: "磨墨很费工夫吗？" },
            { speaker: "王爷爷", text: "急不得。水多了淡，水少了涩。心浮气躁，磨出来的墨也不匀。" },
            { speaker: "王爷爷", text: "老三就是坐不住。磨两下就喊累，说用瓶装墨汁不就行了。" },
            { speaker: "你", text: "那您怎么说？" },
            { speaker: "王爷爷", text: "我说，磨墨磨的不是墨，是性子。急了写不出好字。" },
            { speaker: "王爷爷", text: "他嘴上不服，后来……倒也听进去了。就是不知道现在还练不练字。" },
            { speaker: "你", text: "书桌上那块撕下来的照片……", expression: "望向书桌的方向" },
            { speaker: "王爷爷", text: "嗯。那个不急。先把东西找齐。毛笔在东厢房，以前那儿是书房。", expression: "摆摆手，没有多提" },
            { speaker: "你", text: "好，我去拿。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "Ah, this one. Pine soot ink.", expression: "taking the ink stick, rubbing it with his fingers" },
            { speaker: "Grandpa Wang", text: "The ink from this writes cool, with a bluish cast. Good ink, but you have to grind it slowly." },
            { speaker: "You", text: "Does grinding ink take a lot of effort?" },
            { speaker: "Grandpa Wang", text: "Can't be rushed. Too much water and it's thin, too little and it's gritty. If your mind is restless, the ink won't be even either." },
            { speaker: "Grandpa Wang", text: "Third could never sit still for it. After two rubs he'd say his arm hurt. 'Why not just use bottled ink?'" },
            { speaker: "You", text: "What did you tell him?" },
            { speaker: "Grandpa Wang", text: "I told him, grinding ink isn't about the ink — it's about settling your temperament. If you're impatient, you can't write good characters." },
            { speaker: "Grandpa Wang", text: "He wouldn't admit it at the time, but later... it did sink in. Though I wonder if he still practices." },
            { speaker: "You", text: "That torn photo on the desk...", expression: "glancing toward the desk" },
            { speaker: "Grandpa Wang", text: "Mm. That can wait. Let's gather everything first. The brush is in the East Wing — that used to be the study.", expression: "waving his hand, not saying more" },
            { speaker: "You", text: "Alright, I'll go get it." }
        ]
    };
    return dialogues[locale] || dialogues['zh'];
}

// 两样物品都找到后与爷爷的深度对话（共享情感核心）
export function getDeepTalkDialogue(locale) {
    const dialogues = {
        zh: [
            { speaker: "王爷爷", text: "笔也找到了，墨也找到了。好……好。", expression: "看着桌上的毛笔和墨锭，点了点头" },
            { speaker: "王爷爷", text: "这笔，这笔上刻的是你妈妈的名字。她出生那天，我特意刻上去的。那时候觉得，名字刻在笔上，人就忘不了根。" },
            { speaker: "你", text: "她很少提这些。" },
            { speaker: "王爷爷", text: "不提不打紧。东西在，记性就在。" },
            { speaker: "王爷爷", text: "这墨也是你三舅挑的。他拿着零花钱跑了三家店，说这块最黑。其实小孩子哪懂墨的好坏，但那份心意比什么都好。" },
            { speaker: "你", text: "他那时候多大？" },
            { speaker: "王爷爷", text: "十一二岁。比你还小。那时候他最黏我，写字要挨着，看书要挨着。后来……后来就不挨了。" },
            { speaker: "你", text: "是因为卖院子的事吗？", expression: "轻声" },
            { speaker: "王爷爷", text: "那天他站在院子里，跟我说换楼房、住电梯房。我一听就炸了。不是气他说要卖——是气他不懂，这个院子对他意味着什么。", expression: "声音沉下去" },
            { speaker: "王爷爷", text: "我一把扯过桌上的全家福，撕了他那一角。我说，你既然不想回来，那这张照片上也不必留你了。" },
            { speaker: "你", text: "您后悔说这句话吗？" },
            { speaker: "王爷爷", text: "后悔。后悔了一万遍。但话出了口，就像撕了角的照片——你明知道缺一块，就是补不回来。" },
            { speaker: "", text: "（王爷爷拿起墨锭，慢慢转了一圈。）" },
            { speaker: "王爷爷", text: "笔要蘸墨才能写字。人也一样，得有个东西牵着，才走不远。" },
            { speaker: "你", text: "那这张照片呢？", expression: "拿出那片撕下来的照片一角" },
            { speaker: "王爷爷", text: "……你找到了？在西厢房？", expression: "愣了一下" },
            { speaker: "你", text: "嗯。就在书桌旁边。" },
            { speaker: "王爷爷", text: "好。东西齐了。照片、笔、墨……都在这儿了。来，把它拼回去。", expression: "把全家福从抽屉里拿出来，放在桌上" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "The brush, found. The ink, found too. Good... good.", expression: "looking at the brush and ink stick on the table, nodding" },
            { speaker: "Grandpa Wang", text: "This brush — your mother's name is carved on it. I carved it the day she was born. I thought, carve the name on the brush, and the person won't forget their roots." },
            { speaker: "You", text: "She rarely talks about these things." },
            { speaker: "Grandpa Wang", text: "It's fine if she doesn't. The things are here. The memory stays." },
            { speaker: "Grandpa Wang", text: "This ink stick — your third uncle picked it. He went to three shops with his pocket money and said this one was the blackest. What does a child know about ink quality? But that heart, that intention — it's worth more than anything." },
            { speaker: "You", text: "How old was he then?" },
            { speaker: "Grandpa Wang", text: "Eleven or twelve. Younger than you. Back then he clung to me most — writing next to me, reading next to me. Later... later, he stopped." },
            { speaker: "You", text: "Was it because of selling the courtyard?", expression: "softly" },
            { speaker: "Grandpa Wang", text: "That day he stood in the courtyard and told me to swap it for an apartment, live in a building with elevators. I exploded. It wasn't that he said sell — it was that he didn't understand what this courtyard means to him.", expression: "voice sinking" },
            { speaker: "Grandpa Wang", text: "I grabbed the family photo from the table and tore off his corner. I said, if you don't want to come back, there's no need to keep you in this picture either." },
            { speaker: "You", text: "Do you regret saying that?" },
            { speaker: "Grandpa Wang", text: "I regret it. Ten thousand times over. But words once spoken are like a torn photo — you know something is missing, and you can't just put it back." },
            { speaker: "", text: "(Grandpa Wang picks up the ink stick and slowly turns it in his hand.)" },
            { speaker: "Grandpa Wang", text: "A brush needs ink to write. People are the same — you need something to hold onto, or you drift too far." },
            { speaker: "You", text: "And the photo?", expression: "taking out the torn corner of the photo" },
            { speaker: "Grandpa Wang", text: "...You found it? In the West Wing?", expression: "taken aback" },
            { speaker: "You", text: "Yes. Right next to the desk." },
            { speaker: "Grandpa Wang", text: "Good. Everything's here. The photo, the brush, the ink... all of it. Come — piece it back together.", expression: "taking the family photo out of the drawer, placing it on the table" }
        ]
    };
    return dialogues[locale] || dialogues['zh'];
}

// 找到全家福碎片后与爷爷的对话（第一部分：拼图前）
export function getPhotoPieceDialogue(locale) {
    const dialogues = {
        zh: [
            { speaker: "王爷爷", text: "……还在啊。人老了，连生气都没当年那么大声。", expression: "苦笑" },
            { speaker: "王爷爷", text: "那天他站在这儿，跟我说，'爸，院子太旧了，卖了换套楼房，您和妈住电梯房。'" },
            { speaker: "你", text: "听起来……也不是坏事。" },
            { speaker: "王爷爷", text: "是啊，不是坏事。可我当时就觉得，他是要把根拔了。这座院子承载着我太多回忆了。" },
            { speaker: "你", text: "后面卖了吗？" },
            { speaker: "王爷爷", text: "肯定没卖。他比我倔。吵完架，走了。嘴上硬，心也硬。" },
            { speaker: "你", text: "您后来找过他吗？" },
            { speaker: "王爷爷", text: "我守着院子，他守着脸面。谁也没低头。" },
            { speaker: "王爷爷", text: "你妈……还跟他聊天吗？" },
            { speaker: "你", text: "说。他说石榴树每年都该结果。" },
            { speaker: "王爷爷", text: "他还记得这些啊...." },
            { speaker: "你", text: "记得。他只是没说要回来。" },
            { speaker: "王爷爷", text: "那你这次回来，是替你妈来的……还是替他来的？" },
            { speaker: "你", text: "都不是。" },
            { speaker: "你", text: "是替缺的那一块来的。" },
            { speaker: "", text: "（风吹过院子，石榴树叶轻响。）" },
            { speaker: "王爷爷", text: "这一角我留了这么多年……来，我眼花了手也抖，你来把它拼回去。", expression: "从抽屉里拿出照片和碎片，放在桌上" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "...It's still here. When you get old, even anger isn't as loud as it used to be.", expression: "wry smile" },
            { speaker: "Grandpa Wang", text: "That day he stood here and told me, 'Dad, the courtyard is too old. Sell it and buy an apartment. You and Mom can live in a building with elevators.'" },
            { speaker: "You", text: "Sounds... not like a bad thing." },
            { speaker: "Grandpa Wang", text: "Yes, not bad. But at that moment, I felt he wanted to uproot us. This courtyard holds too many memories for me." },
            { speaker: "You", text: "Did you sell it in the end?" },
            { speaker: "Grandpa Wang", text: "Definitely not. He's more stubborn than me. After the fight, he left. Hard on the lips, hard in the heart." },
            { speaker: "You", text: "Did you ever look for him?" },
            { speaker: "Grandpa Wang", text: "I guarded the courtyard, he guarded his pride. Neither of us bowed." },
            { speaker: "Grandpa Wang", text: "Your mother... does she still chat with him?" },
            { speaker: "You", text: "Yes. He says the pomegranate tree should bear fruit every year." },
            { speaker: "Grandpa Wang", text: "He still remembers..." },
            { speaker: "You", text: "He remembers. He just never said he wanted to come back." },
            { speaker: "Grandpa Wang", text: "Then this time, did you come for your mother... or for him?" },
            { speaker: "You", text: "Neither." },
            { speaker: "You", text: "I came for the missing piece." },
            { speaker: "", text: "(Wind blows through the courtyard, pomegranate leaves rustling.)" },
            { speaker: "Grandpa Wang", text: "I've kept this corner all these years... Here — my eyes are old, my hands shake. You piece it back together.", expression: "taking out the photo and the torn piece from the drawer, placing them on the table" }
        ]
    };
    return dialogues[locale] || dialogues['zh'];
}

// 全家福拼图完成后对话（第二部分：名字、磨墨、摘石榴）
// 拼图完成后对话第一部分（磨墨前）
export function getPhotoPieceDialoguePart2a(locale) {
    const dialogues = {
        zh: [
            { speaker: "王爷爷", text: "（看着你拼好的照片，手指轻轻划过那道裂痕。）接上了。裂痕清清楚楚，但人回到了原位。", expression: "目光久久停在照片上" },
            { speaker: "王爷爷", text: "原来……一直都在。" },
            { speaker: "王爷爷", text: "照片补上了，名字也该补上。" },
            { speaker: "你", text: "您还记得怎么写吗？" },
            { speaker: "王爷爷", text: "记得。是我给他起的。", expression: "淡淡一笑" },
            { speaker: "你", text: "我帮您磨墨吧。" },
        ],
        en: [
            { speaker: "Grandpa Wang", text: "(Looking at the photo you pieced together, his finger gently tracing the crack.) It's joined. The crack is still clear, but the person is back where they belong.", expression: "gaze lingering on the photo" },
            { speaker: "Grandpa Wang", text: "So... it was always here." },
            { speaker: "Grandpa Wang", text: "The photo is mended, the name should be too." },
            { speaker: "You", text: "Do you still remember how to write it?" },
            { speaker: "Grandpa Wang", text: "I remember. I gave him that name.", expression: "smiling faintly" },
            { speaker: "You", text: "Let me grind the ink for you." },
        ]
    };
    return dialogues[locale] || dialogues['zh'];
}

// 拼图完成后对话第二部分（磨墨后）
export function getPhotoPieceDialoguePart2b(locale) {
    const dialogues = {
        zh: [
            { speaker: "王爷爷", text: "你这墨磨得匀。老三小时候没这个耐心，磨两圈就跑出去玩，墨色总是不对。", expression: "看着砚台里的墨，微微点头" },
            { speaker: "", text: "（你看着王爷爷用笔尖沾满墨汁）" },
            { speaker: "王爷爷", text: "写上了，这下不算少人了。门一直开着，就等他们回来吧。" },
            { speaker: "王爷爷", text: "今年石榴成熟的早，要不要摘几个？" },
            { speaker: "你", text: "好，别让他自己掉地上。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "You ground this ink evenly. When Third was young, he had no patience for it — two circles and he'd run off to play. The color was never right.", expression: "looking at the inkstone, nodding slightly" },
            { speaker: "", text: "(You watch Grandpa Wang dip the brush tip into the ink.)" },
            { speaker: "Grandpa Wang", text: "Written now. No one's missing anymore. The door has always been open, just waiting for them to return." },
            { speaker: "Grandpa Wang", text: "The pomegranates ripened early this year. Want to pick some?" },
            { speaker: "You", text: "Yes, before they fall to the ground." }
        ]
    };
    return dialogues[locale] || dialogues['zh'];
}

// 摘石榴后与爷爷分享石榴的对话
export function getPomegranateShareDialogue(locale) {
    const dialogues = {
        zh: [
            { speaker: "王爷爷", text: "摘了几个？" },
            { speaker: "你", text: "四个。够吗？" },
            { speaker: "王爷爷", text: "够。留几个在树上，鸟儿也得吃。" },
            { speaker: "", text: "（交互提示：把石榴递给王爷爷）" },
            { speaker: "王爷爷", text: "这个给你妈带回去。这个……留给老大，他爱吃酸的。这个给老二，她小时候总偷青的吃，酸得皱眉头。这个……" },
            { speaker: "", text: "（他停住了，看着最后一个石榴。）" },
            { speaker: "你", text: "这个给三舅？" },
            { speaker: "", text: "王爷爷没说话，把那个石榴放在旁边的空马扎上。" },
            { speaker: "", text: "风吹过，石榴树叶沙沙响。" },
            { speaker: "王爷爷", text: "今年结得多。他要是回来，还能赶上。" },
            { speaker: "", text: "（你站在那儿，看着那个空马扎上的石榴。）" },
            { speaker: "你", text: "会回来的。" },
            { speaker: "", text: "（王爷爷抬头看你。）" },
            { speaker: "王爷爷", text: "你怎么知道？" },
            { speaker: "你", text: "您门不是一直开着吗。" },
            { speaker: "", text: "（王爷爷愣了一下，然后笑了，笑得眼眶有点红。）" },
            { speaker: "王爷爷", text: "走吧，天不早了。" },
            { speaker: "你", text: "嗯。我走了。" },
            { speaker: "", text: "（你走到院门口，回头看了一眼。）" },
            { speaker: "", text: "王爷爷还坐在那儿，手里捧着那本家谱。那个石榴静静躺在空马扎上，红得像一盏小灯笼。" },
            { speaker: "王爷爷", text: "走吧，忙你的去。别学我儿子们，飞走了就不回头...（笑）开玩笑的。年轻人，该飞就飞。" },
            { speaker: "你", text: "我会再来的。" },
            { speaker: "你", text: "（掏出手机，对着补好的全家福拍了张照）发给三舅吧。照片补上了，他该看看。" },
            { speaker: "王爷爷", text: "（沉默片刻，点了点头）……发吧。" },
            { speaker: "", text: "（你按下发送键。照片穿过屏幕，飞向不知道哪座城市。）" },
            { speaker: "王爷爷", text: "回去跟你妈说，石榴还结着，有空也回来看看。" },
            { speaker: "王爷爷", text: "（摆手）来不来都行。记得石榴熟的时候，回来尝一口。" },
        ],
        en: [
            { speaker: "Grandpa Wang", text: "How many did you pick?" },
            { speaker: "You", text: "Four. Is that enough?" },
            { speaker: "Grandpa Wang", text: "Enough. Leave some on the tree for the birds." },
            { speaker: "", text: "(Interaction hint: Hand the pomegranates to Grandpa)" },
            { speaker: "Grandpa Wang", text: "This one is for your mother. This... for the eldest, he loves sour ones. This for the second, she used to steal green ones as a child, scrunching up her face from the sourness. This..." },
            { speaker: "", text: "(He stops, looking at the last pomegranate.)" },
            { speaker: "You", text: "This one for the third uncle?" },
            { speaker: "", text: "Grandpa says nothing, placing that pomegranate on the empty stool beside him." },
            { speaker: "", text: "Wind blows, pomegranate leaves rustling." },
            { speaker: "Grandpa Wang", text: "There are many this year. If he comes back, he can still catch them." },
            { speaker: "", text: "(You stand there, looking at the pomegranate on the empty stool.)" },
            { speaker: "You", text: "He will come back." },
            { speaker: "", text: "(Grandpa looks up at you.)" },
            { speaker: "Grandpa Wang", text: "How do you know?" },
            { speaker: "You", text: "Isn't your door always open?" },
            { speaker: "", text: "(Grandpa is stunned, then smiles, his eyes a bit red.)" },
            { speaker: "Grandpa Wang", text: "Go, it's getting late." },
            { speaker: "You", text: "Yes. I'm leaving." },
            { speaker: "", text: "(You walk to the courtyard gate, looking back.)" },
            { speaker: "", text: "Grandpa is still sitting there, holding the family genealogy. That pomegranate lies quietly on the empty stool, red like a small lantern." },
            { speaker: "Grandpa Wang", text: "Go, attend to your business. Don't be like my sons, flying away and never looking back... (laughs) Just kidding. Young people should fly when they need to." },
            { speaker: "You", text: "I'll come again." },
            { speaker: "You", text: "(Taking out your phone, snapping a photo of the mended family portrait) Send this to Third Uncle. The photo is whole again — he should see it." },
            { speaker: "Grandpa Wang", text: "(Silent for a moment, then nods) ...Go ahead." },
            { speaker: "", text: "(You press send. The photo travels through the screen, flying toward some unknown city.)" },
            { speaker: "Grandpa Wang", text: "Tell your mother — the pomegranates are still bearing fruit. She should come visit too, when she can." },
            { speaker: "Grandpa Wang", text: "(Waving hand) Come or not, it doesn't matter. Just remember to come back for a taste when the pomegranates are ripe." },
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
        //折扇
        fan: {
            zh: "一把精致的折扇，扇面上绘着山水花鸟，扇骨是上好的竹材制成。夏日午后，王爷爷常坐在院中摇扇纳凉，这把扇子陪伴他度过了无数个宁静的夏日时光。",
            en: "An exquisite folding fan with landscape and flower paintings on the surface, made from premium bamboo ribs. On summer afternoons, Grandpa Wang often sat in the courtyard fanning himself for coolness. This fan accompanied him through countless peaceful summer days."
        },
        //地契
        diqi: {
            zh: "一张泛黄的地契，记录着静心院这片土地的所有权。纸上的毛笔字迹工整有力，盖着鲜红的官印。这是王爷爷最珍贵的财产证明，也是家族根基的见证。",
            en: "A yellowed land deed recording the ownership of Jingxin Courtyard. The brush calligraphy on the paper is neat and forceful, stamped with a bright red official seal. This is Grandpa Wang's most precious proof of property and a testament to the family's foundation."
        },
        //毽子
        jianzi: {
            zh: "一个彩色的毽子，羽毛鲜艳，底座是铜钱形状的。这是王爷爷三儿子小时候最喜欢的玩具，常常在内院踢着玩，引来一群小伙伴围观。毽子承载着童年无忧无虑的欢笑声。",
            en: "A colorful Jianzi shuttlecock with bright feathers and a copper coin-shaped base. This was the third son's favorite toy when he was young, often kicking it in the inner courtyard and attracting a crowd of friends. The Jianzi carries the carefree laughter of childhood."
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
            en: "The taohe tree, also known as the Xifu Csrabapple, is a common tree species in the siheyuan. Its flowers are beautiful, symbolizing love and happiness."
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
        //毛笔
        brush: {
            zh: "东厢房的书桌上放着一支旧毛笔。笔杆上还留着墨迹，不知道是多少年前写的字。",
            en: "An old brush lies on the desk in the East Wing. Ink stains still remain on the shaft — words written who knows how many years ago."
        },
        //墨锭
        inkstick: {
            zh: "你在西厢房找到了那块黑漆漆的墨锭。沉甸甸的，凑近还能闻到松烟的味道。旁边的书桌上搁着一张人像照，边缘毛毛糙糙的，像是从什么地方撕下来的。",
            en: "You found the pitch-black ink stick in the West Wing. It's surprisingly heavy, and up close you can still smell the pine soot. On the desk beside it lies a portrait photo, its edges ragged, as if torn from somewhere."
        },
        //全家福碎片
        thirdson_photo: {
            zh: "一张泛黄的全家福碎片，边缘微微卷曲。照片上是三舅年轻时的侧脸，眉眼间与王爷爷有几分相似。背面残留着浆糊的痕迹，似乎曾被小心贴存，又被粗暴撕下。",
            en: "A yellowed family photo fragment with slightly curled edges. It shows the third uncle's profile in his youth, bearing resemblance to Grandpa. Paste traces on the back suggest it was once carefully kept, then roughly torn away."
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
        condition: "chuihua_talk_completed"
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
        id: "fan",
        name: "折扇",
        nameEn: "Folding Fan",
        position: { x: 36, y: 17, z: 17 },
        radius: 2,
        action: "interact",
        condition: null
    },
    {
        id: "diqi",
        name: "地契",
        nameEn: "Land Deed",
        position: { x: -30, y: 17, z: 25 },
        radius: 2,
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
        condition: "photopiece_talk_completed",
        once: true
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
        id: "jianzi",
        name: "毽子",
        nameEn: "Jianzi",
        position: { x: -5, y: 16, z: 9 },
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
        position: { x: -22, y: 19, z: 20 },
        radius: 3,
        action: "interact",
        condition: null
    },
    {
        id: "eastwing_door",
        name: "东厢房门",
        nameEn: "East Wing Door",
        position: { x: -27, y: 16.5, z: 18.5 },
        radius: 3,
        action: "interact",
        condition: null
    },
    {
        id: "eastwing_key",
        name: "铜钥匙",
        nameEn: "Bronze Key",
        position: { x: -5, y: 16, z: 30 },
        radius: 2.5,
        action: "interact",
        condition: "familybook_talk_completed",
        once: true
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
    },
    {
        id: "brush",
        name: "旧毛笔",
        nameEn: "Old Brush",
        position: { x: -30, y: 16, z: 16 },
        radius: 2,
        action: "interact",
        once: true,
        condition: "familybook_talk_completed"
    },
    {
        id: "inkstick",
        name: "墨锭",
        nameEn: "Ink Stick",
        position: { x: 26, y: 15, z: -7 },
        radius: 2,
        action: "interact",
        once: true,
        condition: "familybook_talk_completed"
    },
];

/**
 * 收集物数据配置
 * 在这里添加你想要收集的物品
 */
export const collectionData = {
    zh: {
        items: [
            // 收集物品类 - 有3D模型
            {
                id: "wang_family_book",
                name: "王氏家谱",
                icon: "",
                image: "/photo/Collection/Book.webp",
                modelPath: "/models/Book.glb",
                interactionId: "familybook",
                location: "正房",
                description: "王氏家族世代相传的家谱，记录了王家三代人在静心院的生活点滴。泛黄的纸页上记载着家族的荣耀与传承。",
                category: "collectible"
            },
            {
                id: "land_deed",
                name: "地契",
                icon: "",
                image: "/photo/Collection/Landdeed.webp",
                modelPath: "/models/Diqi.glb",
                interactionId: "landdeed",
                location: "正房",
                description: "地契是房屋和土地所有权的证明文件。在古代北京，四合院的主人会保存地契，以证明自己对房屋的合法拥有权。地契通常盖有官方印章，具有法律效力。",
                category: "collectible"
            },
            {
                id: "folding_fan",
                name: "折扇",
                icon: "",
                image: "/photo/Collection/Fan.webp",
                modelPath: "/models/Fan.glb",
                interactionId: "fan",
                location: "东厢房",
                description: "折扇是传统的纳凉工具。夏天，人们常在院子里一边乘凉，一边摇扇子。折扇不仅实用，还常带有书法或绘画装饰。",
                category: "collectible"
            },
            {
                id: "jianzi",
                name: "毽子",
                icon: "",
                image: "/photo/Collection/Jianzi.webp",
                modelPath: "/models/Jianzi.glb",
                interactionId: "jianzi",
                location: "内院",
                description: "踢毽子是传统的儿童游戏，在院子里非常常见。",
                category: "collectible"
            },
            // 建筑/地点类 - 图鉴系统
            {
                id: "east_wing",
                name: "东厢房",
                icon: "🏠",
                image: "/photo/Collection/Dongxiangfang.webp",
                interactionId: "eastwing",
                location: "四合院东侧",
                description: "东厢房位于四合院东侧，坐东朝西，是晚辈居住的地方。它与西厢房相对，一东一西，阴阳平衡。东厢房通常比正房略低，体现长幼有序的传统伦理。在这里，你找到了王爷爷的旧毛笔。",
                category: "location"
            },
            {
                id: "west_wing",
                name: "西厢房",
                icon: "🏠",
                image: "/photo/Collection/Xixiangfang.webp",
                interactionId: "westwing",
                location: "四合院西侧",
                description: "西厢房位于四合院西侧，与东厢房相对。在四合院中，东西厢房对称分布，体现阴阳平衡的理念。西厢房同样是晚辈的居所，与东厢房共同构成内院的重要组成部分。在这里，你找到了那张缺失的全家福碎片。",
                category: "location"
            },
            {
                id: "main_house",
                name: "正房",
                icon: "🏯",
                image: "/photo/Collection/Zhengfang.webp",
                interactionId: "mainhouse",
                location: "四合院北侧",
                description: "正房是四合院中地位最高的建筑，位于院落北侧，坐北朝南。正房高敞，是长辈的居所；厢房略低，归晚辈居住。一高一低之间，是长幼有序，也是敬老的传统。王爷爷常在这里翻看家谱，回忆往事。",
                category: "location"
            },
            {
                id: "inner_courtyard",
                name: "内院",
                icon: "🌳",
                image: "/photo/Collection/Neiyuan.webp",
                interactionId: "chuihuamen",
                location: "垂花门内",
                description: "内院是四合院的核心区域，穿过垂花门便进入内院。这里有石榴树、海棠树，还有老奶奶常坐的摇椅。内院是家人日常活动的地方，也是孩子们嬉戏玩耍的场所。",
                category: "location"
            },
            {
                id: "garden_path",
                name: "入院小径",
                icon: "🚪",
                image: "/photo/Collection/Ruyuanxiaojing.webp",
                interactionId: "arrow2",
                location: "影壁后",
                description: "入院小径连接着大门和内院，绕过影壁便是。影壁挡住外人视线，保护院内隐私，也阻挡邪气直入。壁上常有'福'字或吉祥图案。",
                category: "location"
            },
            {
                id: "main_gate",
                name: "大门",
                icon: "🚪",
                image: "/photo/Collection/Damen.webp",
                interactionId: "oldman",
                location: "四合院南侧",
                description: "大门是四合院的入口，也是家族的门面。大门通常位于院落东南角，朝向南方。门槛高30厘米，象征地位，也防止雨水倒灌。王爷爷常在这里迎接客人，送别儿女。",
                category: "location"
            }
        ]
    },
    en: {
        items: [
            {
                id: "wang_family_book",
                name: "Wang Family Genealogy",
                icon: "",
                image: "/photo/Collection/Book.webp",
                interactionId: "familybook",
                location: "Main House",
                description: "The Wang family's ancestral genealogy, passed down through generations, recording three generations of the Wang family's life in Jingxin Courtyard. The yellowed pages bear witness to the family's honor and legacy."
            },
            {
                id: "land_deed",
                name: "Land Deed",
                icon: "",
                image: "/photo/Collection/Landdeed.webp",
                interactionId: "landdeed",
                location: "Main House",
                description: "The land deed is a legal document proving ownership of houses and land. In ancient Beijing, siheyuan owners would keep land deeds to prove their legal ownership of the property. The deed usually bears an official seal and has legal validity."
            },
            {
                id: "folding_fan",
                name: "Folding Fan",
                icon: "",
                image: "/photo/Collection/Fan.webp",
                interactionId: "fan",
                location: "East Wing",
                description: "The folding fan is a traditional cooling tool. In summer, people would sit in the courtyard enjoying the cool breeze while waving fans. Folding fans are not only practical but often decorated with calligraphy or paintings."
            },
            {
                id: "jianzi",
                name: "Jianzi",
                icon: "",
                image: "/photo/Collection/Jianzi.webp",
                interactionId: "jianzi",
                location: "Inner Courtyard",
                description: "Kick shuttlecock is a traditional children's game, very common in the courtyard."
            },
            // Locations - Encyclopedia System
            {
                id: "east_wing",
                name: "East Wing",
                icon: "🏠",
                image: "/photo/place/en/EastWing.webp",
                interactionId: "eastwing",
                location: "East Side of Courtyard",
                description: "The East Wing is located on the east side of the courtyard, facing west. It is where the younger generation lives. It faces the West Wing, creating a balance of yin and yang. The East Wing is usually slightly lower than the main house, reflecting the traditional ethics of respecting seniority. Here, you found Grandpa Wang's old brush.",
                category: "location"
            },
            {
                id: "west_wing",
                name: "West Wing",
                icon: "🏠",
                image: "/photo/place/en/WestWing.webp",
                interactionId: "westwing",
                location: "West Side of Courtyard",
                description: "The West Wing is located on the west side of the courtyard, facing the East Wing. In the siheyuan, the east and west wings are symmetrically distributed, embodying the concept of yin-yang balance. The West Wing is also the residence of the younger generation. Here, you found the missing piece of the family photo.",
                category: "location"
            },
            {
                id: "main_house",
                name: "Main House",
                icon: "🏯",
                image: "/photo/place/en/MainHouse.webp",
                interactionId: "mainhouse",
                location: "North Side of Courtyard",
                description: "The main house is the most prestigious building in the siheyuan, located on the north side, facing south. The main house is spacious for the elders; the side houses are slightly lower for the younger generation. The difference in height represents the order of seniority and the tradition of respecting the elderly. Grandpa Wang often reads the family genealogy here, reminiscing about the past.",
                category: "location"
            },
            {
                id: "inner_courtyard",
                name: "Inner Courtyard",
                icon: "🌳",
                image: "/photo/place/en/InnerCourtyard.webp",
                interactionId: "chuihuamen",
                location: "Inside Chuihua Gate",
                description: "The inner courtyard is the core area of the siheyuan. Passing through the Chuihua Gate, you enter the inner courtyard. There are pomegranate trees, crabapple trees, and the rocking chair where Grandma often sits. The inner courtyard is where family members conduct daily activities and where children play.",
                category: "location"
            },
            {
                id: "garden_path",
                name: "Garden Path",
                icon: "🚪",
                image: "/photo/place/en/GardenPath.webp",
                interactionId: "arrow2",
                location: "Behind Screen Wall",
                description: "The garden path connects the main gate and the inner courtyard, right behind the screen wall. The screen wall blocks outsiders' view to protect privacy and prevents evil spirits from entering directly. It often bears the character 'Fu' (blessing) or auspicious patterns.",
                category: "location"
            },
            {
                id: "main_gate",
                name: "Main Gate",
                icon: "🚪",
                image: "/photo/place/en/MainGate.webp",
                interactionId: "oldman",
                location: "South Side of Courtyard",
                description: "The main gate is the entrance to the siheyuan and the face of the family. It is usually located at the southeast corner of the courtyard, facing south. The threshold is 30 centimeters high, symbolizing status and preventing rainwater from flowing back in. Grandpa Wang often welcomes guests and sees off his children here.",
                category: "location"
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
            description: "在院落的桌子上，似乎有一本家谱。"
        },
        {
            id: "quest_talk_about_family_book",
            name: "和王爷爷谈论家谱",
            description: "拿到家谱后，和在正房的王爷爷谈论家谱的内容。"
        },
        {
            id: "quest_find_pen",
            name: "寻找毛笔和墨锭",
            description: "在东西厢房里找到王爷爷的旧毛笔和墨锭，没有它们，家谱上的字写不下去。"
        },
        {
            id: "quest_talk_about_photo",
            name: "聊聊全家福",
            description: "回到正房，与王爷爷聊聊那张有缺口的全家福。"
        },
        {
            id: "quest_talk_about_ink_stick",
            name: "拿着墨锭去找王爷爷聊聊",
            description: "在西厢房找到了墨锭，拿去给王爷爷看看。"
        },
        {
            id: "quest_find_inkstick",
            name: "去西厢房找墨锭",
            description: "毛笔已经拿到了，王爷爷说墨锭在西厢房。"
        },
        {
            id: "quest_find_brush",
            name: "去东厢房找毛笔",
            description: "墨锭已经拿到了，王爷爷说毛笔在东厢房的书房里。"
        },
        {
            id: "quest_talk_deep",
            name: "两样都齐了，回去找王爷爷",
            description: "毛笔和墨锭都在手上了，回去找王爷爷吧。"
        },
        {
            id: "quest_find_photo_piece",
            name: "与王爷爷聊聊",
            description: "毛笔和墨锭都交给王爷爷了，听听他要说什么。"
        },
        {
            id: "quest_pick_pomegranate",
            name: "摘石榴",
            description: "去石榴树那里摘几个石榴。"
        },
        {
            id: "quest_share_pomegranate",
            name: "与王爷爷分享石榴",
            description: "把摘到的石榴带给王爷爷。"
        },
        {
            id: "quest_explore_freely",
            name: "尽情探索四合院",
            description: "剧情已完成，自由探索静心院。"
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
            description: "After obtaining the family book, talk to Grandpa in the main house about it."
        },
        {
            id: "quest_find_pen",
            name: "Find Brush and Ink Stick",
            description: "Search the courtyard for Grandpa Wang's old brush and ink stick. Without them, the family book cannot be written."
        },
        {
            id: "quest_talk_about_photo",
            name: "Talk About the Photo",
            description: "Return to the Main House and talk to Grandpa about the incomplete family photo."
        },
        {
            id: "quest_talk_about_ink_stick",
            name: "Show Ink Stick to Grandpa",
            description: "You found the ink stick in the West Wing. Bring it to Grandpa Wang."
        },
        {
            id: "quest_find_inkstick",
            name: "Find the Ink Stick in the West Wing",
            description: "You have the brush. Grandpa Wang said the ink stick is in the West Wing."
        },
        {
            id: "quest_find_brush",
            name: "Find the Brush in the East Wing",
            description: "You have the ink stick. Grandpa Wang said the brush is in the East Wing study."
        },
        {
            id: "quest_talk_deep",
            name: "Return to Grandpa Wang",
            description: "You have both the brush and the ink stick. Go back to Grandpa Wang."
        },
        {
            id: "quest_find_photo_piece",
            name: "Talk to Grandpa Wang",
            description: "You have the brush and the ink stick. Go back and talk to Grandpa Wang."
        },
        {
            id: "quest_pick_pomegranate",
            name: "Pick Pomegranates",
            description: "Go to the pomegranate tree and pick some pomegranates."
        },
        {
            id: "quest_share_pomegranate",
            name: "Share Pomegranates with Grandpa",
            description: "Bring the picked pomegranates to Grandpa."
        },
        {
            id: "quest_explore_freely",
            name: "Explore the Courtyard",
            description: "Story completed, freely explore the Jingxin Courtyard."
        }
    ]
};

// 获取当前语言的任务数据
export function getQuestData(locale) {
    return questData[locale] || questData['zh'];
}

export default storyData;
