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
            { speaker: "王爷爷", text: "慢点找，别翻得太急。东厢房那屋子……好久没人进了。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "Take your time searching, don't rush. That room in the East Wing... no one has entered for a long time." }
        ]
    };
    return shortDialogues[locale] || shortDialogues['zh'];
}

// 全家福对话后的简短提示语（找到碎片前第二次及以后对话）
export function getFamilyPhotoShortDialogue(locale) {
    const shortDialogues = {
        zh: [
            { speaker: "王爷爷", text: "去吧，全家福碎片好像是在西厢房。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "Go ahead, the family photo piece seems to be in the West Wing." }
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
            { speaker: "王爷爷", text: "厚是厚。纸比人还多。" },
            { speaker: "你", text: "字写得真工整。" },
            { speaker: "王爷爷", text: "以前都是毛笔写的。我爹写一页，要磨半天墨。" },
            { speaker: "你", text: "您也写过吗？" },
            { speaker: "王爷爷", text: "写过。年轻的时候记得清楚。谁是第几代，谁娶了谁，谁脾气倔，谁偷着吃糖被罚站。" },
            { speaker: "你", text: "连这个都记得。" },
            { speaker: "王爷爷", text: "那会儿记得清。现在不行了，有时候翻到名字，得想一会儿——'这是谁来着？'想半天，忽然又想起来：哦，是那个老爱爬树的。" },
            { speaker: "你", text: "那这儿怎么空着？" },
            { speaker: "王爷爷", text: "这是老三的位置。" },
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
            { speaker: "你", text: "那现在呢？还能补上吗？....这页空着，总觉得风从这儿漏进来。" },
            { speaker: "王爷爷", text: "写上吧。" },
            { speaker: "王爷爷", text: "院子不是用来赌气的。" },
            { speaker: "王爷爷", text: "笔在东厢房的桌子上,他小时候写字用的那支,你去帮我找找。" },
            { speaker: "你", text: "好。" },
            { speaker: "王爷爷", text: "慢点找，别翻得太急。那屋子……好久没人进了。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "This is our family genealogy." },
            { speaker: "You", text: "It's so thick." },
            { speaker: "Grandpa Wang", text: "Thick indeed. More paper than people." },
            { speaker: "You", text: "The handwriting is so neat." },
            { speaker: "Grandpa Wang", text: "In the old days, we used brush pens. My father would grind ink for half a day just to write one page." },
            { speaker: "You", text: "Did you write in it too?" },
            { speaker: "Grandpa Wang", text: "I did. When I was young, I remembered clearly. Who was which generation, who married whom, who had a stubborn temper, who was punished for stealing candy." },
            { speaker: "You", text: "You even remember that." },
            { speaker: "Grandpa Wang", text: "I remembered clearly back then. Now I can't. Sometimes I see a name and have to think for a while—'Who was this?' Then suddenly remember: oh, that one who loved climbing trees." },
            { speaker: "You", text: "Why is this page blank?" },
            { speaker: "Grandpa Wang", text: "This is the third son's place." },
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
            { speaker: "You", text: "What about now? Can it still be filled in?....This blank page... it feels like wind leaks through here." },
            { speaker: "Grandpa Wang", text: "Write it in." },
            { speaker: "Grandpa Wang", text: "Courtyards aren't for holding grudges." },
            { speaker: "Grandpa Wang", text: "The brush is on the table in the East Wing, the one he used to write with as a child, go find it for me." },
            { speaker: "You", text: "Alright." },
            { speaker: "Grandpa Wang", text: "Take your time searching, don't rush. That room... no one has entered for a long time." }
        ]
    };
    return dialogues[locale] || dialogues['zh'];
}

// 全家福对话（拾取钢笔后与王爷爷的对话）
export function getFamilyPhotoDialogue(locale) {
    const dialogues = {
        zh: [
            { speaker: "王爷爷", text: "全家福……这是哪年？" },
            { speaker: "王爷爷", text: "这个是我大儿子，小时候最黏我。现在一年一个电话。" },
            { speaker: "王爷爷", text: "这个是你妈，那时候扎着两条小辫子……那年石榴刚种下没几年。" },
            { speaker: "你", text: "人都在。" },
            { speaker: "王爷爷", text: "嗯，都在。" },
            { speaker: "王爷爷", text: "拍照那天我还嫌他们站得歪。现在想想，歪点也挺好。" },
            { speaker: "你", text: "这里缺了一块……是三舅吗？" },
            { speaker: "王爷爷", text: "是。我撕的。" },
            { speaker: "你", text: "您自己撕的？" },
            { speaker: "王爷爷", text: "气头上，什么都敢撕。气散了，就只剩后悔。" },
            { speaker: "你", text: "当时吵得很凶吗？" },
            { speaker: "王爷爷", text: "他一句话就把我点着了。" },
            { speaker: "你", text: "他说什么？" },
            { speaker: "王爷爷", text: "他说卖院子。" },
            { speaker: "你", text: "卖院子？" },
            { speaker: "王爷爷", text: "换楼房，电梯上下，离医院也近。听着挺好。" },
            { speaker: "你", text: "那您为什么不同意？" },
            { speaker: "王爷爷", text: "我怕的不是楼房。" },
            { speaker: "王爷爷", text: "我怕以后谁想回来，都不知道该往哪儿回。" },
            { speaker: "你", text: "所以您说——院子不是拿来赌气的。" },
            { speaker: "王爷爷", text: "嗯。" },
            { speaker: "你", text: "那是拿来干嘛的？" },
            { speaker: "王爷爷", text: "是拿来让人回来的。" },
            { speaker: "你", text: "后来……你们就一直这样僵着？" },
            { speaker: "王爷爷", text: "僵着。" },
            { speaker: "你", text: "您后悔吗？" },
            { speaker: "王爷爷", text: "后悔。" },
            { speaker: "王爷爷", text: "但嘴硬了一辈子，真要软下来，反而不知道怎么开口。" },
            { speaker: "你", text: "那这一角……" },
            { speaker: "王爷爷", text: "当时随手一扔，不知道落哪儿了。" },
            { speaker: "你", text: "会不会还在院子里？" },
            { speaker: "王爷爷", text: "西厢房那边……旧东西多。你去找找看。" },
            { speaker: "王爷爷", text: "要是找得着，就把它拼回去。" },
            { speaker: "你", text: "好。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "Family photo... which year was this?" },
            { speaker: "Grandpa Wang", text: "This is my eldest son. He was closest to me when he was little. Now, one phone call a year." },
            { speaker: "Grandpa Wang", text: "This is your mother, with two braids back then... The pomegranate tree had just been planted a few years earlier." },
            { speaker: "You", text: "Everyone is here." },
            { speaker: "Grandpa Wang", text: "Yes, everyone." },
            { speaker: "Grandpa Wang", text: "I complained they were standing crooked that day. Now I think, crooked is fine too." },
            { speaker: "You", text: "There's a piece missing here... Is it the third uncle?" },
            { speaker: "Grandpa Wang", text: "Yes. I tore it." },
            { speaker: "You", text: "You tore it yourself?" },
            { speaker: "Grandpa Wang", text: "In anger, you dare to tear anything. When the anger fades, only regret remains." },
            { speaker: "You", text: "Was the fight very bad?" },
            { speaker: "Grandpa Wang", text: "One sentence from him set me off." },
            { speaker: "You", text: "What did he say?" },
            { speaker: "Grandpa Wang", text: "He said sell the courtyard." },
            { speaker: "You", text: "Sell the courtyard?" },
            { speaker: "Grandpa Wang", text: "Exchange it for an apartment building, with elevators, close to the hospital. Sounds good." },
            { speaker: "You", text: "Then why didn't you agree?" },
            { speaker: "Grandpa Wang", text: "I wasn't afraid of the apartment building." },
            { speaker: "Grandpa Wang", text: "I was afraid that when someone wants to come back, they won't know where to return to." },
            { speaker: "You", text: "So you said—the courtyard is not for selling." },
            { speaker: "Grandpa Wang", text: "Yes." },
            { speaker: "You", text: "Then what is it for?" },
            { speaker: "Grandpa Wang", text: "It's for people to come back to." },
            { speaker: "You", text: "Later... you two just stayed like this?" },
            { speaker: "Grandpa Wang", text: "Stiff." },
            { speaker: "You", text: "Do you regret it?" },
            { speaker: "Grandpa Wang", text: "I regret it." },
            { speaker: "Grandpa Wang", text: "But I've been stubborn all my life. When it comes time to soften, I don't know how to open my mouth." },
            { speaker: "You", text: "Then this corner..." },
            { speaker: "Grandpa Wang", text: "I threw it away casually back then. Don't know where it landed." },
            { speaker: "You", text: "Could it still be in the courtyard?" },
            { speaker: "Grandpa Wang", text: "The West Wing... lots of old things there. Go take a look." },
            { speaker: "Grandpa Wang", text: "If you find it, put it back together." },
            { speaker: "You", text: "Okay." }
        ]
    };
    return dialogues[locale] || dialogues['zh'];
}

// 找到全家福碎片后与爷爷的对话
export function getPhotoPieceDialogue(locale) {
    const dialogues = {
        zh: [
            { speaker: "王爷爷", text: "……还在啊。" },
            { speaker: "你", text: "我在西厢房的桌子上找到的，压在旧报纸下面。" },
            { speaker: "王爷爷", text: "人老了，连生气都没当年那么大声。（苦笑）" },
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
            { speaker: "王爷爷", text: "把那一块缺的给我吧。" },
            { speaker: "你", text: "（递过那缺失的一角照片）" },
            { speaker: "王爷爷", text: "（王爷爷把照片放在桌上，重新对齐。这一次，三舅的脸完整地接上了。裂痕清清楚楚，但人回到了原位。）" },
            { speaker: "王爷爷", text: "原来……一直都在。" },
            { speaker: "王爷爷", text: "照片补上了，名字也该补上。" },
            { speaker: "你", text: "您还记得怎么写吗？" },
            { speaker: "王爷爷", text: "（淡淡一笑）记得。是我给他起的。" },
            { speaker: "王爷爷", text: "写上了，这下不算少人了。门一直开着，就等他们回来吧。" },
            { speaker: "王爷爷", text: "今年石榴成熟的早，要不要摘几个？" },
            { speaker: "你", text: "好，别让他自己掉地上。" }
        ],
        en: [
            { speaker: "Grandpa Wang", text: "...It's still here." },
            { speaker: "You", text: "I found it on the table in the West Wing, under some old newspapers." },
            { speaker: "Grandpa Wang", text: "When you get old, even anger isn't as loud as it used to be. (wry smile)" },
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
            { speaker: "(Wind blows through the courtyard, pomegranate leaves rustling.)", text: "" },
            { speaker: "Grandpa Wang", text: "Give me that missing piece." },
            { speaker: "You", text: "(Handing over the missing corner of the photo)" },
            { speaker: "Grandpa Wang", text: "(Grandpa places the photo on the table and realigns it. This time, the third uncle's face is complete. The crack is clear, but the person is back in place.)" },
            { speaker: "Grandpa Wang", text: "So... it was always here." },
            { speaker: "Grandpa Wang", text: "The photo is mended, the name should be too." },
            { speaker: "You", text: "Do you still remember how to write it?" },
            { speaker: "Grandpa Wang", text: "(smiling faintly) I remember. I gave him that name." },
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
            { speaker: "", text: "（把石榴递给王爷爷）" },
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
            { speaker: "", text: "（摆手）" },
            { speaker: "王爷爷", text: "来不来都行。记得石榴熟的时候，回来尝一口。" },
            { speaker: "", text: "（王爷爷独自坐在马扎上，翻着家谱，石榴树的影子落在他身上。远处传来邻居家的电视声，更显得院子安静。）" }
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
            { speaker: "", text: "(Waving hand)" },
            { speaker: "Grandpa Wang", text: "Come or not, it doesn't matter. Just remember to come back for a taste when the pomegranates are ripe." },
            { speaker: "", text: "(Grandpa sits alone on the stool, flipping through the genealogy, the shadow of the pomegranate tree falling on him. The sound of the neighbor's TV comes from afar, making the courtyard seem even quieter.)" }
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
        //钢笔
        pen: {
            zh: "你拿起了桌上的那只钢笔，不经意间发现了一张有缺口的全家福。",
            en: "You picked up the pen on the table and accidentally discovered a family photo with a missing piece."
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
    },
    {
        id: "pen",
        name: "钢笔",
        nameEn: "Pen",
        position: { x: -30, y: 16, z: 16 },
        radius: 2,
        action: "interact",
        once: true,
        condition: "familybook_talk_completed"
    },
    {
        id: "thirdson_photo",
        name: "全家福碎片",
        nameEn: "Family Photo Piece",
        position: { x: 27, y: 16, z: -7 },
        radius: 2,
        action: "interact",
        once: true,
        condition: "familyphoto_talk_completed"
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
            {
                id: "pen",
                name: "钢笔",
                icon: "",
                image: "/photo/Collection/Pen.webp",
                interactionId: "pen",
                location: "东厢房",
                description: "王爷爷三儿子小时候写字用的那支钢笔，承载着家族的记忆与思念。"
            },
            // 建筑/地点类 - 图鉴系统
            {
                id: "east_wing",
                name: "东厢房",
                icon: "🏠",
                image: "/photo/Collection/Dongxiangfang.png",
                interactionId: "eastwing",
                location: "四合院东侧",
                description: "东厢房位于四合院东侧，坐东朝西，是晚辈居住的地方。它与西厢房相对，一东一西，阴阳平衡。东厢房通常比正房略低，体现长幼有序的传统伦理。在这里，你找到了王爷爷三儿子小时候用的钢笔。",
                category: "location"
            },
            {
                id: "west_wing",
                name: "西厢房",
                icon: "🏠",
                image: "/photo/Collection/Xixiangfang.png",
                interactionId: "westwing",
                location: "四合院西侧",
                description: "西厢房位于四合院西侧，与东厢房相对。在四合院中，东西厢房对称分布，体现阴阳平衡的理念。西厢房同样是晚辈的居所，与东厢房共同构成内院的重要组成部分。在这里，你找到了那张缺失的全家福碎片。",
                category: "location"
            },
            {
                id: "main_house",
                name: "正房",
                icon: "🏯",
                image: "/photo/Collection/Zhengfang.png",
                interactionId: "mainhouse",
                location: "四合院北侧",
                description: "正房是四合院中地位最高的建筑，位于院落北侧，坐北朝南。正房高敞，是长辈的居所；厢房略低，归晚辈居住。一高一低之间，是长幼有序，也是敬老的传统。王爷爷常在这里翻看家谱，回忆往事。",
                category: "location"
            },
            {
                id: "inner_courtyard",
                name: "内院",
                icon: "🌳",
                image: "/photo/Collection/Neiyuan.png",
                interactionId: "chuihuamen",
                location: "垂花门内",
                description: "内院是四合院的核心区域，穿过垂花门便进入内院。这里有石榴树、海棠树，还有老奶奶常坐的摇椅。内院是家人日常活动的地方，也是孩子们嬉戏玩耍的场所。",
                category: "location"
            },
            {
                id: "garden_path",
                name: "入院小径",
                icon: "🚪",
                image: "/photo/Collection/Ruyuanxiaojing.png",
                interactionId: "arrow2",
                location: "影壁后",
                description: "入院小径连接着大门和内院，绕过影壁便是。影壁挡住外人视线，保护院内隐私，也阻挡邪气直入。壁上常有'福'字或吉祥图案。",
                category: "location"
            },
            {
                id: "main_gate",
                name: "大门",
                icon: "🚪",
                image: "/photo/Collection/Damen.png",
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
            },
            {
                id: "pen",
                name: "Brush Pen",
                icon: "",
                image: "/photo/Collection/Pen.webp",
                interactionId: "pen",
                location: "East Wing",
                description: "The brush pen that Grandpa Wang's third son used to write with as a child, carrying the family's memories and longing."
            },
            // Locations - Encyclopedia System
            {
                id: "east_wing",
                name: "East Wing",
                icon: "🏠",
                image: "/photo/place/en/EastWing.webp",
                interactionId: "eastwing",
                location: "East Side of Courtyard",
                description: "The East Wing is located on the east side of the courtyard, facing west. It is where the younger generation lives. It faces the West Wing, creating a balance of yin and yang. The East Wing is usually slightly lower than the main house, reflecting the traditional ethics of respecting seniority. Here, you found the pen used by Grandpa Wang's third son as a child.",
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
            description: "探索四合院内院，发现更多有趣的事物。"
        },
        {
            id: "quest_talk_about_family_book",
            name: "和王爷爷谈论家谱",
            description: "获得家谱后，和在正房的王爷爷谈论家谱的内容。"
        },
        {
            id: "quest_find_pen",
            name: "寻找三舅的笔",
            description: "前往东厢房，找到三舅以前用过的那支笔。"
        },
        {
            id: "quest_talk_about_photo",
            name: "聊聊全家福",
            description: "回到正房，与王爷爷聊聊那张有缺口的全家福。"
        },
        {
            id: "quest_find_photo_piece",
            name: "寻找全家福碎片",
            description: "前往西厢房，寻找全家福缺失的那一角。"
        },
        {
            id: "quest_talk_after_photo_piece",
            name: "告知王爷爷",
            description: "带着找到的碎片回到正房，告诉王爷爷。"
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
            name: "Find Uncle's Pen",
            description: "Go to the East Wing and find the pen that the third uncle used to use."
        },
        {
            id: "quest_talk_about_photo",
            name: "Talk About the Photo",
            description: "Return to the Main House and talk to Grandpa about the incomplete family photo."
        },
        {
            id: "quest_find_photo_piece",
            name: "Find the Photo Piece",
            description: "Go to the West Wing and search for the missing corner of the family photo."
        },
        {
            id: "quest_talk_after_photo_piece",
            name: "Report to Grandpa",
            description: "Bring the found piece back to the Main House and tell Grandpa."
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
