import { EnglishUnit } from '../../types';

export const englishUnits: EnglishUnit[] = [
  {
    id: 1,
    unitNumber: 1,
    title: "Let's Learn Together!",
    titleAr: "لِنَتَعَلَّمْ مَعاً!",
    color: "from-sky-500 to-blue-600",
    iconName: "BookOpen",
    outcomes: [
      "Use common greetings and introduce yourself",
      "Follow and understand classroom rules & imperatives",
      "Describe people's looks and personalities",
      "Express daily routines using present simple",
      "Pronounce the digraph 'wh' correctly"
    ],
    lessons: [
      {
        id: "eng-1-1",
        lessonNumber: 1,
        title: "Greetings and Introductions",
        topic: "التحيات والتعارف بالنفس والآخرين",
        vocabulary: [
          { word: "Good morning", meaningAr: "صباح الخير", phonetic: "جُودْ مُورْنِينْجْ", example: "Good morning, teacher!" },
          { word: "Nice to meet you", meaningAr: "سُرِرْتُ بِلِقَائِك", phonetic: "نَايْسْ تُو مِيتْ يُو", example: "Nice to meet you, Sara!" },
          { word: "How are you?", meaningAr: "كيف حالك؟", phonetic: "هَاوْ آرْ يُو", example: "How are you today?" },
          { word: "I'm fine, thank you", meaningAr: "أنا بخير، شكراً لك", phonetic: "آيْمْ فَاينْ ثَانْكْ يُو", example: "I am fine, thank you!" },
          { word: "Primary 3", meaningAr: "الصف الثالث الابتدائي", phonetic: "بْرَايْمَرِي ثْرِي", example: "I am in Primary 3." }
        ],
        conversation: [
          { speaker: "Sara", speakerAr: "سارة", text: "Hello! My name is Sara. What's your name?", translationAr: "مرحباً! اسمي سارة. ما اسمكِ؟" },
          { speaker: "Lina", speakerAr: "لينا", text: "Good morning! My name is Lina. Nice to meet you!", translationAr: "صباح الخير! اسمي لينا. سررت بلقائكِ!" },
          { speaker: "Sara", speakerAr: "سارة", text: "How old are you, Lina?", translationAr: "كم عمركِ يا لينا؟" },
          { speaker: "Lina", speakerAr: "لينا", text: "I am 8 years old. I am in Primary 3!", translationAr: "عمري 8 سنوات. أنا في الصف الثالث الابتدائي!" }
        ],
        languageFocus: {
          title: "Introducing Yourself & Asking Questions",
          ruleExplanation: "للسؤال عن الاسم نستخدم (What is your name?) والإجابة (My name is...) أو (I am...). وللسؤال عن العمر نستخدم (How old are you?) والإجابة (I am ... years old).",
          formula: "What is your name? -> My name is [Name]. | How old are you? -> I am [Age] years old.",
          examples: [
            { en: "What is your name? - I am Amir.", ar: "ما اسمك؟ - أنا أمير." },
            { en: "How old are you? - I am eight years old.", ar: "كم عمرك؟ - أنا في الثامنة من عمري." }
          ]
        },
        exercises: [
          {
            id: "eng1-1-e1",
            question: "In the morning, we say ____________ to our friends.",
            type: "choice",
            options: ["good morning", "good night", "goodbye"],
            correctAnswer: "good morning",
            hint: "التحية المناسبة في الصباح.",
            explanation: "'Good morning' means صباح الخير."
          },
          {
            id: "eng1-1-e2",
            question: "Nice to ________ you, Sara!",
            type: "choice",
            options: ["meet", "eat", "see"],
            correctAnswer: "meet",
            hint: "التعبير الرسمي عند مقابلة صديق جديد: Nice to meet you.",
            explanation: "'Nice to meet you' يعني سررت بلقائك."
          }
        ],
        geniusQuestions: [
          {
            id: "eng1-1-g1",
            question: "Genius Challenge: Reorder to form a correct sentence: [years - eight - is - Adam - old]",
            type: "choice",
            options: ["Adam is eight years old.", "Adam eight is old years.", "Eight years Adam is old."],
            correctAnswer: "Adam is eight years old.",
            hint: "Subject + verb to be (is) + age + years old.",
            explanation: "The correct English sentence structure is: Adam is eight years old."
          }
        ]
      },
      {
        id: "eng-1-2",
        lessonNumber: 2,
        title: "Classroom Rules & Phonics 'wh'",
        topic: "قواعد الفصل الدراسي وصوت الحرفين wh",
        vocabulary: [
          { word: "Raise your hand", meaningAr: "ارفع يدك", phonetic: "رِيزْ يُورْ هَانْدْ", example: "Raise your hand to answer." },
          { word: "Listen carefully", meaningAr: "استمع بحرص", phonetic: "لِسِنْ كِيرْفُولِي", example: "Listen carefully to your teacher." },
          { word: "Sit down", meaningAr: "اجلس", phonetic: "سِتْ دَاوْنْ", example: "Sit down please." },
          { word: "Don't shout", meaningAr: "لا تصرخ", phonetic: "دُونْتْ شَاوْتْ", example: "Don't shout in the classroom." },
          { word: "Keep clean", meaningAr: "حافظ على النظافة", phonetic: "كِيبْ كْلِينْ", example: "Keep your classroom clean." }
        ],
        phonicsFocus: {
          rule: "The letters 'wh' together make the /w/ sound (like in 'what', 'whale').",
          sound: "/w/",
          sampleWords: ["whale", "wheel", "white", "what", "when", "where"]
        },
        languageFocus: {
          title: "Imperatives (الأمر والنهي في الفصل)",
          ruleExplanation: "لإعطاء أمر إيجابي نبدأ بمصدر الفعل (Inf). وللنهي نبدأ بـ (Don't + Inf).",
          formula: "Affirmative: [Verb stem] + rest. | Negative: Don't + [Verb stem] + rest.",
          examples: [
            { en: "Listen to your teacher carefully.", ar: "استمع لمعلمك بحرص." },
            { en: "Don't run in the corridor.", ar: "لا تجرِ في الممر." }
          ]
        },
        exercises: [
          {
            id: "eng1-2-e1",
            question: "When the teacher talks, you should ________.",
            type: "choice",
            options: ["listen carefully", "shout", "sleep"],
            correctAnswer: "listen carefully",
            hint: "ماذا يجب أن تفعل عند تحدث المعلم؟",
            explanation: "You must listen carefully when the teacher explains."
          },
          {
            id: "eng1-2-e2",
            question: "Which word starts with the 'wh' sound?",
            type: "choice",
            options: ["whale", "cat", "phone"],
            correctAnswer: "whale",
            hint: "حيوان بحري ضخم يبدأ بحرفي w و h.",
            explanation: "'Whale' (حوت) starts with digraph 'wh' pronouncing /w/."
          }
        ],
        geniusQuestions: [
          {
            id: "eng1-2-g1",
            question: "Smart Riddle: I am big, I swim in the deep ocean, and my name starts with 'wh'. What am I?",
            type: "choice",
            options: ["whale", "wheel", "white"],
            correctAnswer: "whale",
            hint: "أضخم كائن في المحيط.",
            explanation: "A whale is the giant creature of the sea!"
          }
        ]
      },
      {
        id: "eng-1-3",
        lessonNumber: 3,
        title: "Describing People & Looks",
        topic: "وصف مظهر الشخصية والصفات",
        vocabulary: [
          { word: "tall", meaningAr: "طويل", phonetic: "تُولْ", example: "My teacher is tall." },
          { word: "short", meaningAr: "قصير", phonetic: "شُورْتْ", example: "He is short." },
          { word: "curly hair", meaningAr: "شعر مجعد", phonetic: "كِيرْلِي هِيرْ", example: "She has curly hair." },
          { word: "straight hair", meaningAr: "شعر مستقيم/ناعم", phonetic: "سْتْرِيتْ هِيرْ", example: "He has straight hair." },
          { word: "friendly", meaningAr: "ودود", phonetic: "فْرِينْدْلِي", example: "He says hello to everyone." },
          { word: "helpful", meaningAr: "متعاون/مساعد", phonetic: "هِلْبْفُولْ", example: "She is helpful to her classmates." },
          { word: "polite", meaningAr: "مهذب", phonetic: "بُولَايْتْ", example: "He always says please." }
        ],
        languageFocus: {
          title: "Describing Looks (have/has) & Personality (Verb to Be)",
          ruleExplanation: "نستخدم (am, is, are) مع الصفات الشخصية، ونستخدم (have, has) مع الملامح كالشعر والعيون.",
          formula: "He / She + is + [adjective]. | He / She + has + [hair / eyes].",
          examples: [
            { en: "Mona is kind and friendly.", ar: "منى عطوفة وودودة." },
            { en: "She has brown eyes and curly hair.", ar: "لديها عينان بنيتان وشعر مجعد." }
          ]
        },
        exercises: [
          {
            id: "eng1-3-e1",
            question: "My friend always helps others. She is ________.",
            type: "choice",
            options: ["helpful", "angry", "shy"],
            correctAnswer: "helpful",
            hint: "من يساعد الآخرين يسمى...",
            explanation: "Helpful means متعاون ويحب المساعدة."
          },
          {
            id: "eng1-3-e2",
            question: "Laila ________ curly hair and green eyes.",
            type: "choice",
            options: ["has", "have", "is"],
            correctAnswer: "has",
            hint: "مع المفرد Laila نستخدم has للملكية.",
            explanation: "Third person singular (he/she/it) takes 'has'."
          }
        ],
        geniusQuestions: [
          {
            id: "eng1-3-g1",
            question: "Genius Quiz: Which sentence is grammatically correct?",
            type: "choice",
            options: [
              "She is tall and has curly brown hair.",
              "She have tall and is curly brown hair.",
              "She are tall and have curly brown hair."
            ],
            correctAnswer: "She is tall and has curly brown hair.",
            hint: "'is' for height adjective, 'has' for hair features.",
            explanation: "She takes 'is' for tall, and 'has' for hair."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    unitNumber: 2,
    title: "My Family and I",
    titleAr: "عائلتي وأنا",
    color: "from-amber-500 to-orange-600",
    iconName: "Users",
    outcomes: [
      "Identify family members and their roles",
      "Recognize traditional celebrations (Eid Al-Fitr, Sham El-Nessim, 6th of October)",
      "Express family jobs (doctor, teacher, baker, farmer, pilot)",
      "Master phonics: 'ph' (/f/) and letter 'x' (/gz/)",
      "Use possessive pronouns: my, your, his, her"
    ],
    lessons: [
      {
        id: "eng-2-1",
        lessonNumber: 1,
        title: "Meet My Family & Possessive Pronouns",
        topic: "أفراد الأسرة وضمائر الملكية",
        vocabulary: [
          { word: "grandfather", meaningAr: "جَدّ", phonetic: "جْرَانْدْ فَاذَرْ", example: "My grandfather is wise." },
          { word: "grandmother", meaningAr: "جَدَّة", phonetic: "جْرَانْدْ مَاذَرْ", example: "My grandmother tells great stories." },
          { word: "cousin", meaningAr: "ابن/ابنة العم أو الخال", phonetic: "كَازِنْ", example: "I play with my cousin." },
          { word: "uncle", meaningAr: "عمّ أو خال", phonetic: "آنْكِلْ", example: "My uncle is a police officer." },
          { word: "aunt", meaningAr: "عمّة أو خالة", phonetic: "آنْتْ", example: "My aunt works at a clinic." }
        ],
        languageFocus: {
          title: "Possessive Pronouns: his & her",
          ruleExplanation: "نستخدم (his) لملكية المذكر (ولد/رجل)، ونستخدم (her) لملكية المؤنث (بنت/سيدة).",
          formula: "His + noun (his book, his bag) | Her + noun (her cat, her dress)",
          examples: [
            { en: "Adam is reading his new book.", ar: "آدم يقرأ كتابه الجديد." },
            { en: "Dina loves her cute little cat.", ar: "دينا تحب قطتها اللطيفة." }
          ]
        },
        exercises: [
          {
            id: "eng2-1-e1",
            question: "Nader has a toy train. ________ toy is blue.",
            type: "choice",
            options: ["His", "Her", "My"],
            correctAnswer: "His",
            hint: "نادر ولد، ما ضمير الملكية المناسب؟",
            explanation: "We use 'His' for male possession."
          },
          {
            id: "eng2-1-e2",
            question: "Amira is holding ________ school bag.",
            type: "choice",
            options: ["her", "his", "their"],
            correctAnswer: "her",
            hint: "أميرة بنت، إذن ملكيتها تكون...",
            explanation: "We use 'her' for female possession."
          }
        ],
        geniusQuestions: [
          {
            id: "eng2-1-g1",
            question: "Genius Puzzle: 'My father's sister is my ________.'",
            type: "choice",
            options: ["aunt", "grandmother", "cousin"],
            correctAnswer: "aunt",
            hint: "أخت الأب هي العمة.",
            explanation: "The sister of your father or mother is your aunt."
          }
        ]
      },
      {
        id: "eng-2-2",
        lessonNumber: 2,
        title: "Celebrations & Phonics 'ph' and 'x'",
        topic: "المناسبات والاحتفالات وصوتيات ph و x",
        vocabulary: [
          { word: "Eid Al-Fitr", meaningAr: "عيد الفطر المبارك", phonetic: "عِيدْ الْفِطْرْ", example: "We celebrate Eid Al-Fitr with family." },
          { word: "Sham El-Nessim", meaningAr: "عيد شم النسيم", phonetic: "شَمْ النِّسِيمْ", example: "We color eggs in Sham El-Nessim." },
          { word: "6th of October", meaningAr: "عيد السادس من أكتوبر", phonetic: "سِكْسْثْ أُوفْ أُوكْتُوبَرْ", example: "It reminds us of brave soldiers." },
          { word: "Mother's Day", meaningAr: "عيد الأم", phonetic: "مَاذَرْزْ دِيهْ", example: "We give cards on Mother's Day." }
        ],
        phonicsFocus: {
          rule: "Digraph 'ph' sounds like /f/ (phone, photo, elephant). Letter 'x' between vowels can sound like /gz/ (exam, exit, example).",
          sound: "/f/ and /gz/",
          sampleWords: ["phone", "photo", "elephant", "alphabet", "exam", "exit"]
        },
        exercises: [
          {
            id: "eng2-2-e1",
            question: "In ________, we go to the public gardens and color eggs.",
            type: "choice",
            options: ["Sham El-Nessim", "Mother's Day", "Exam day"],
            correctAnswer: "Sham El-Nessim",
            hint: "عيد الربيع المصري الشهير بتلوين البيض.",
            explanation: "Sham El-Nessim is celebrated in gardens with colored eggs."
          },
          {
            id: "eng2-2-e2",
            question: "Which word has the /f/ sound spelled with 'ph'?",
            type: "choice",
            options: ["elephant", "fish", "farm"],
            correctAnswer: "elephant",
            hint: "فيل بالإنجليزية يُكتب فيه ph.",
            explanation: "Elephant uses 'ph' to make the /f/ sound."
          }
        ],
        geniusQuestions: [
          {
            id: "eng2-2-g1",
            question: "Phonics Riddle: 'I start with E and have an X, I show where people leave the building. What am I?'",
            type: "choice",
            options: ["exit", "exam", "example"],
            correctAnswer: "exit",
            hint: "علامة المخرج الخضراء.",
            explanation: "An 'exit' is the way out!"
          }
        ]
      },
      {
        id: "eng-2-4",
        lessonNumber: 4,
        title: "Jobs in My Family",
        topic: "المهن والوظائف في العائلة",
        vocabulary: [
          { word: "doctor", meaningAr: "طبيب / طبيبة", phonetic: "دُوكْتُورْ", example: "A doctor helps sick patients." },
          { word: "teacher", meaningAr: "معلم / معلمة", phonetic: "تِيتْشَرْ", example: "A teacher works at a school." },
          { word: "baker", meaningAr: "خباز", phonetic: "بِيكَرْ", example: "A baker bakes delicious fresh bread." },
          { word: "farmer", meaningAr: "فلاح / مزارع", phonetic: "فَارْمَرْ", example: "A farmer grows vegetables and fruits." },
          { word: "pilot", meaningAr: "طيار", phonetic: "بَايْلُوتْ", example: "A pilot flies big airplanes in the sky." }
        ],
        exercises: [
          {
            id: "eng2-4-e1",
            question: "My uncle bakes warm, delicious bread. He is a ________.",
            type: "choice",
            options: ["baker", "pilot", "doctor"],
            correctAnswer: "baker",
            hint: "من يصنع الخبز والكعك في المخبز؟",
            explanation: "A baker bakes bread."
          },
          {
            id: "eng2-4-e2",
            question: "My mother flies airplanes around the world. She is a ________.",
            type: "choice",
            options: ["pilot", "teacher", "farmer"],
            correctAnswer: "pilot",
            hint: "قائدة الطائرة في السماء.",
            explanation: "A pilot flies airplanes."
          }
        ],
        geniusQuestions: [
          {
            id: "eng2-4-g1",
            question: "Genius Match: Which job matches 'grows food, works on the soil, cares for animals'?",
            type: "choice",
            options: ["farmer", "baker", "doctor"],
            correctAnswer: "farmer",
            hint: "المزارع الذي يعمل في الحقل.",
            explanation: "Farmers grow crops and food for everyone."
          }
        ]
      }
    ]
  },
  {
    id: 3,
    unitNumber: 3,
    title: "New Adventures",
    titleAr: "مُغَامَرَاتٌ جَدِيدَةٌ",
    color: "from-emerald-500 to-teal-600",
    iconName: "Compass",
    outcomes: [
      "Name community places (museum, supermarket, park, train station, library)",
      "Learn Egypt's historical landmarks (Cairo Tower, Pyramids, Alexandria Library)",
      "Use prepositions of place (in, on, under, behind, between, in front of)",
      "Master double consonants (ff, ll, ss, zz) and digraph 'ck'",
      "Form regular past simple verbs (-ed)"
    ],
    lessons: [
      {
        id: "eng-3-1",
        lessonNumber: 1,
        title: "Places Around Me & Egypt Landmarks",
        topic: "الأماكن المحيطة ومعالم مصر الجميلة",
        vocabulary: [
          { word: "Cairo Tower", meaningAr: "برج القاهرة", phonetic: "كَايْرُو تَاوَرْ", example: "Cairo Tower is very tall." },
          { word: "Pyramids of Giza", meaningAr: "أهرامات الجيزة", phonetic: "بِيرَامِيدْزْ أُوفْ جِيزَا", example: "We saw the great Pyramids." },
          { word: "Alexandria Library", meaningAr: "مكتبة الإسكندرية", phonetic: "أَلِكْسَانْدْرِيَا لَايْبْرَرِي", example: "We read amazing stories in Alexandria Library." },
          { word: "supermarket", meaningAr: "سوبرماركت", phonetic: "سُوبَرْمَارْكِتْ", example: "We buy fresh food at the supermarket." },
          { word: "train station", meaningAr: "محطة القطار", phonetic: "تْرِينْ سْتِيشَنْ", example: "We saw a fast train at the station." }
        ],
        exercises: [
          {
            id: "eng3-1-e1",
            question: "Where do we go to borrow and read interesting books?",
            type: "choice",
            options: ["library", "supermarket", "train station"],
            correctAnswer: "library",
            hint: "المكان المخصص للكتب والقراءة الهادئة.",
            explanation: "A library is a place where you read and borrow books."
          }
        ],
        geniusQuestions: [
          {
            id: "eng3-1-g1",
            question: "Genius Landmark: Which famous Egyptian landmark was built near the Nile and shaped like a lotus blossom?",
            type: "choice",
            options: ["Cairo Tower", "Pyramids of Giza", "Alexandria Library"],
            correctAnswer: "Cairo Tower",
            hint: "برج القاهرة الشهير بتصميمه المستوحى من زهرة اللوتس.",
            explanation: "Cairo Tower is designed in the shape of a lotus flower."
          }
        ]
      },
      {
        id: "eng-3-3",
        lessonNumber: 3,
        title: "Prepositions of Place (Map It Out)",
        topic: "حروف جر المكان",
        vocabulary: [
          { word: "in", meaningAr: "في / داخل", phonetic: "إِنْ", example: "The cat is in the box." },
          { word: "on", meaningAr: "على / فوق", phonetic: "أُونْ", example: "The book is on the desk." },
          { word: "under", meaningAr: "تحت", phonetic: "آنْدَرْ", example: "The toy car rolled under the couch." },
          { word: "between", meaningAr: "بين (اثنين)", phonetic: "بِيتْوِينْ", example: "The kitten sits between two boxes." },
          { word: "behind", meaningAr: "خلف / وراء", phonetic: "بِيهَايْنْدْ", example: "The dog is behind the door." },
          { word: "in front of", meaningAr: "أمام", phonetic: "إِنْ فْرَانْتْ أُوفْ", example: "She is standing in front of the board." }
        ],
        exercises: [
          {
            id: "eng3-3-e1",
            question: "Samy's red car rolled ________ the couch, so he used a stick to reach it.",
            type: "choice",
            options: ["under", "on", "between"],
            correctAnswer: "under",
            hint: "السيارة اختفت أسفل الأريكة.",
            explanation: "'Under' means تحت."
          }
        ],
        geniusQuestions: [
          {
            id: "eng3-3-g1",
            question: "Clever Challenge: If Ahmed is standing with Ali on his right and Omar on his left, where is Ahmed?",
            type: "choice",
            options: ["between Ali and Omar", "under Ali", "behind Omar"],
            correctAnswer: "between Ali and Omar",
            hint: "يقع في المنتصف بين اثنين.",
            explanation: "Between means in the middle of two things or people."
          }
        ]
      }
    ]
  },
  {
    id: 4,
    unitNumber: 4,
    title: "Let's Tell Stories!",
    titleAr: "هَيَّا نَرْوِي الْقَصَصَ!",
    color: "from-violet-500 to-purple-600",
    iconName: "Feather",
    outcomes: [
      "Express feelings & emotions (happy, sad, excited, scared, proud)",
      "Use narrative linking words (First, Then, After that, Finally)",
      "Understand irregular past simple verbs (went, saw, felt, won)",
      "Master Hard 'c' (/k/) vs Soft 'c' (/s/) phonics rules"
    ],
    lessons: [
      {
        id: "eng-4-1",
        lessonNumber: 1,
        title: "How We Feel & Narrative Linking Words",
        topic: "المشاعر والكلمات الرابطة في القصة",
        vocabulary: [
          { word: "happy", meaningAr: "سعيد", phonetic: "هَابِي", example: "I felt happy when I won." },
          { word: "excited", meaningAr: "متحمس للغاية", phonetic: "إِكْسَايْتِدْ", example: "We are excited about the school trip!" },
          { word: "proud", meaningAr: "فخور بنفسه أو غيره", phonetic: "بْرَاوْدْ", example: "Omar felt proud when his team won." },
          { word: "scared", meaningAr: "خائف", phonetic: "سْكِيرْدْ", example: "She was scared of the loud noise." },
          { word: "tired", meaningAr: "تعبان / مرهق", phonetic: "تَايَرْدْ", example: "He was tired after running." }
        ],
        languageFocus: {
          title: "Story Linking Words (تسلسل القصة)",
          ruleExplanation: "نستخدم الكلمات الرابطة لجعل القصة واضحة وسهلة المتابعة:",
          formula: "First (أولاً) -> Then (ثم) -> After that (بعد ذلك) -> Finally (أخيراً)",
          examples: [
            { en: "First, they cleaned the street. Finally, everyone smiled.", ar: "أولاً نظفوا الشارع. وفي النهاية ابتسم الجميع." }
          ]
        },
        exercises: [
          {
            id: "eng4-1-e1",
            question: "Omar scored the winning goal! His friends felt ________ and cheered loudly.",
            type: "choice",
            options: ["proud", "sad", "angry"],
            correctAnswer: "proud",
            hint: "الشعور بالفرح والاعتزاز بالإنجاز.",
            explanation: "'Proud' means فخور."
          }
        ],
        geniusQuestions: [
          {
            id: "eng4-1-g1",
            question: "Past Verb Wizard: What is the irregular past tense of the verb 'see'?",
            type: "choice",
            options: ["saw", "seed", "seen"],
            correctAnswer: "saw",
            hint: "see -> saw.",
            explanation: "The past simple of see is saw."
          }
        ]
      },
      {
        id: "eng-4-2",
        lessonNumber: 2,
        title: "Phonics: Hard 'c' (/k/) vs Soft 'c' (/s/)",
        topic: "قاعدة صوت حرف C الصعب والناعم",
        vocabulary: [
          { word: "cat", meaningAr: "قطة (Hard C)", phonetic: "كَاتْ", example: "The cat jumped." },
          { word: "city", meaningAr: "مدينة (Soft C)", phonetic: "سِيتِي", example: "Cairo is a big city." },
          { word: "face", meaningAr: "وجه (Soft C)", phonetic: "فِيسْ", example: "A smile on his face." },
          { word: "cake", meaningAr: "كعكة (Hard C)", phonetic: "كِيكْ", example: "We ate tasty cake." }
        ],
        phonicsFocus: {
          rule: "Letter 'c' makes the soft /s/ sound when followed by (e, i, or y). Otherwise, it makes the hard /k/ sound.",
          sound: "/s/ or /k/",
          sampleWords: ["city", "pencil", "face", "nice", "cat", "cup", "cold"]
        },
        exercises: [
          {
            id: "eng4-2-e1",
            question: "In the word 'pencil', the letter 'c' makes the ________ sound.",
            type: "choice",
            options: ["/s/ (soft c)", "/k/ (hard c)", "/ch/"],
            correctAnswer: "/s/ (soft c)",
            hint: "يأتي بعد حرف c الحرف i، لذا ينطق /s/.",
            explanation: "C followed by 'i' sounds like /s/."
          }
        ],
        geniusQuestions: [
          {
            id: "eng4-2-g1",
            question: "Genius Phonics: In the word 'circle', which sounds does 'c' make?",
            type: "choice",
            options: ["First /s/, second /k/", "Both are /s/", "Both are /k/"],
            correctAnswer: "First /s/, second /k/",
            hint: "cir- (followed by i -> /s/) cle (followed by l -> /k/).",
            explanation: "The first C has an 'i' so it's /s/, the second C has an 'l' so it's /k/."
          }
        ]
      }
    ]
  },
  {
    id: 5,
    unitNumber: 5,
    title: "Together Is Better",
    titleAr: "مَعاً نَكُونُ أَفْضَلَ",
    color: "from-rose-500 to-pink-600",
    iconName: "HeartHandshake",
    outcomes: [
      "Understand teamwork actions (share, care, plant, donate, clean)",
      "Cooperation action verbs",
      "Community volunteering values",
      "Hard 'g' (/g/) vs Soft 'g' (/dʒ/) phonics"
    ],
    lessons: [
      {
        id: "eng-5-1",
        lessonNumber: 1,
        title: "Teamwork, Chores & Helping Community",
        topic: "التعاون في المنزل والمجتمع",
        vocabulary: [
          { word: "share", meaningAr: "يشارك", phonetic: "شِيرْ", example: "They share ideas together." },
          { word: "tidy up", meaningAr: "يرتب وينظم", phonetic: "تَايْدِي أَبْ", example: "Tidy up your room." },
          { word: "plant", meaningAr: "يزرع نبتة", phonetic: "بْلَانْتْ", example: "Laila plants a green tree." },
          { word: "donate", meaningAr: "يتبرع", phonetic: "دُونِيتْ", example: "Ahmed donates warm clothes to children." }
        ],
        exercises: [
          {
            id: "eng5-1-e1",
            question: "Ahmed gives clothes and toys to poor children. He ________ them.",
            type: "choice",
            options: ["donates", "sells", "hides"],
            correctAnswer: "donates",
            hint: "يعطي الأشياء مجاناً للمحتاجين.",
            explanation: "Donate means to give something to help others."
          }
        ],
        geniusQuestions: [
          {
            id: "eng5-1-g1",
            question: "Teamwork Riddle: 'Soft g' sounds like /dʒ/ in which Egyptian word?",
            type: "choice",
            options: ["Egypt", "garden", "game"],
            correctAnswer: "Egypt",
            hint: "اسم بلدنا الحبيبة!",
            explanation: "In Egypt, 'g' is followed by 'y' making the soft /dʒ/ sound."
          }
        ]
      }
    ]
  },
  {
    id: 6,
    unitNumber: 6,
    title: "Dare to Dream",
    titleAr: "تَجَرَّأْ أَنْ تَحْلُمَ!",
    color: "from-amber-500 to-yellow-600",
    iconName: "Target",
    outcomes: [
      "Set personal goals and dreams",
      "Use Present Continuous tense (am/is/are + verb-ing)",
      "Three-consonant clusters (spr, spl, str, scr)",
      "Perseverance and celebration of success"
    ],
    lessons: [
      {
        id: "eng-6-1",
        lessonNumber: 1,
        title: "My Goal, My Dream & Present Continuous",
        topic: "الأهداف والأحلام والمضارع المستمر",
        vocabulary: [
          { word: "goal", meaningAr: "هدف وطموح", phonetic: "جُولْ", example: "My goal is to be a doctor." },
          { word: "practice", meaningAr: "يتدرب بانتظام", phonetic: "بْرَاكْتِسْ", example: "She practices every day." },
          { word: "success", meaningAr: "نجاح وتفوق", phonetic: "سَاكْسِسْ", example: "Hard work brings great success." },
          { word: "celebrate", meaningAr: "يحتفل بالإنجاز", phonetic: "سِلِبْرِيتْ", example: "They celebrate with high cheers." }
        ],
        languageFocus: {
          title: "Present Continuous Tense (الحدث المستمر الآن)",
          ruleExplanation: "نستخدم زمن المضارع المستمر للتعبير عن أفعال تحدث الآن في هذه اللحظة.",
          formula: "Subject + am / is / are + [verb + ing]",
          examples: [
            { en: "Samer is scoring a winning goal right now.", ar: "سامر يسجل هدف الفوز الآن." },
            { en: "They are celebrating their success.", ar: "إنهم يحتفلون بنجاحهم." }
          ]
        },
        exercises: [
          {
            id: "eng6-1-e1",
            question: "Look! Mona ________ her red bicycle along the path.",
            type: "choice",
            options: ["is riding", "rides", "rode"],
            correctAnswer: "is riding",
            hint: "كلمة Look تدل على حدث يقع الآن.",
            explanation: "Present continuous: Mona is riding."
          }
        ],
        geniusQuestions: [
          {
            id: "eng6-1-g1",
            question: "Consonant Cluster Master: Which word starts with the three consonants 'spr'?",
            type: "choice",
            options: ["spring", "splash", "street"],
            correctAnswer: "spring",
            hint: "فصل الربيع الجميل.",
            explanation: "Spring starts with s-p-r cluster."
          }
        ]
      }
    ]
  }
];
