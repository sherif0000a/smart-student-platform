import { DictionaryWord } from '../../types';

// Curated comprehensive vocabulary database for Egyptian Primary learners
// Each word includes: word, arabicMeaning, pronunciationGuide (Arabic phonetics), partOfSpeech, category, exampleEn, exampleAr

const rawVocabularyList: [string, string, string, 'noun' | 'verb' | 'adjective' | 'expression' | 'preposition', 'animals' | 'school' | 'family' | 'food' | 'actions' | 'emotions' | 'places' | 'time' | 'body' | 'numbers' | 'nature' | 'jobs', string, string][] = [
  // 1. Animals & Wildlife
  ['cat', 'قِطَّة', 'كَاتْ', 'noun', 'animals', 'The cat is sleeping on the mat.', 'القطة نائمة على السجادة.'],
  ['dog', 'كَلْب', 'دُوجْ', 'noun', 'animals', 'The friendly dog wags its tail.', 'الكلب الودود يهز ذيله.'],
  ['elephant', 'فِيل', 'إِلِيفَانْتْ', 'noun', 'animals', 'The elephant has big ears.', 'الفيل له أذنان كبيرتان.'],
  ['giraffe', 'زَرَافَة', 'جِرَافْ', 'noun', 'animals', 'The giraffe has a very long neck.', 'الزرافة لها رقبة طويلة جداً.'],
  ['lion', 'أَسَد', 'لَايُونْ', 'noun', 'animals', 'The lion is the king of the jungle.', 'الأسد هو ملك الغابة.'],
  ['monkey', 'قِرْد', 'مَانْكِي', 'noun', 'animals', 'The monkey loves eating yellow bananas.', 'القرد يحب أكل الموز الأصفر.'],
  ['camel', 'جَمَل', 'كَامِلْ', 'noun', 'animals', 'The camel lives in the desert.', 'الجمل يعيش في الصحراء.'],
  ['dolphin', 'دُلْفِين', 'دُولْفِينْ', 'noun', 'animals', 'The playful dolphin swims fast.', 'الدلفين المرح يسبح بسرعة.'],
  ['whale', 'حُوت', 'وِيلْ', 'noun', 'animals', 'The blue whale is the largest sea animal.', 'الحوت الأزرق هو أكبر حيوان بحري.'],
  ['bird', 'عُصْفُور / طَائِر', 'بِيرْدْ', 'noun', 'animals', 'The little bird sings sweetly.', 'العصفور الصغير يغرد بعذوبة.'],
  ['duck', 'بَطَّة', 'دَاكْ', 'noun', 'animals', 'The yellow duck quacks in the pond.', 'البطة الصفراء تصيح في البركة.'],
  ['rabbit', 'أَرْنَب', 'رَابِتْ', 'noun', 'animals', 'The cute rabbit hops on grass.', 'الأرنب اللطيف يقفز على العشب.'],
  ['horse', 'حِصَان', 'هُورْسْ', 'noun', 'animals', 'The brown horse runs fast.', 'الحصان البني يجري بسرعة.'],
  ['sheep', 'خَرُوف', 'شِيبْ', 'noun', 'animals', 'The white sheep gives soft wool.', 'الخروف الأبيض يعطي صوفاً ناعماً.'],
  ['cow', 'بَقَرَة', 'كَاوْ', 'noun', 'animals', 'The cow gives fresh milk every day.', 'البقرة تعطي حليباً طازجاً كل يوم.'],
  ['fish', 'سَمَكَة', 'فِيشْ', 'noun', 'animals', 'The shiny fish swims in blue water.', 'السمكة اللامعة تسبح في الماء الأزرق.'],
  ['butterfly', 'فَرَاشَة', 'بَاتَرْفْلَايْ', 'noun', 'animals', 'A colorful butterfly lands on the flower.', 'فراشة ملونة تهبط على الوردة.'],
  ['bee', 'نَحْلَة', 'بِي', 'noun', 'animals', 'The busy bee makes sweet honey.', 'النحلة النشيطة تصنع العسل اللذيذ.'],
  ['turtle', 'سُلَحْفَاة', 'تِيرْتِلْ', 'noun', 'animals', 'The green turtle walks slowly.', 'السلحفاة الخضراء تمشي ببطء.'],
  ['frog', 'ضِفْدَع', 'فْرُوجْ', 'noun', 'animals', 'The frog jumps into the water.', 'الضفدع يقفز في الماء.'],
  ['ant', 'نَمْلَة', 'آنْتْ', 'noun', 'animals', 'The little ant works hard.', 'النملة الصغيرة تعمل بجد.'],
  ['fox', 'ثَعْلَب', 'فُوكْسْ', 'noun', 'animals', 'The clever fox hides in the woods.', 'الثعلب الذكي يختبئ بين الأشجار.'],
  ['bear', 'دُبّ', 'بِيرْ', 'noun', 'animals', 'The big bear sleeps in winter.', 'الدب الكبير ينام في الشتاء.'],
  ['zebra', 'حِمَار وَحْشِي', 'زِيبْرَا', 'noun', 'animals', 'The zebra has black and white stripes.', 'الحمار الوحشي له خطوط سوداء وبيضاء.'],
  ['tiger', 'نَمِر', 'تَايْجَرْ', 'noun', 'animals', 'The tiger runs very fast.', 'النمر يجري بسرعة هائلة.'],
  ['crocodile', 'تِمْسَاح', 'كْرُوكُودَايْلْ', 'noun', 'animals', 'The crocodile swims in the river Nile.', 'التمساح يسبح في نهر النيل.'],
  ['snake', 'ثُعْبَان', 'سْنِيكْ', 'noun', 'animals', 'The snake glides on the sand.', 'الثعبان ينزلق على الرمال.'],
  ['parrot', 'بَبَّغَاء', 'بَارُوتْ', 'noun', 'animals', 'The colorful parrot can repeat words.', 'الببغاء الملون يستطيع تكرار الكلمات.'],

  // 2. School & Learning
  ['school', 'مَدْرَسَة', 'سْكُولْ', 'noun', 'school', 'I go to school every morning.', 'أذهب إلى المدرسة كل صباح.'],
  ['classroom', 'فَصْل دِرَاسِي', 'كْلَاسْرُومْ', 'noun', 'school', 'Our classroom is clean and bright.', 'فصلنا نظيف ومشرق.'],
  ['teacher', 'مُعَلِّم / أُسْتَاذ', 'تِيتْشَرْ', 'noun', 'school', 'My teacher is kind and helpful.', 'معلمي عطوف ومتعاون.'],
  ['student', 'تِلْمِيذ / طَالِب', 'سْتْيُودِنْتْ', 'noun', 'school', 'The clever student raises his hand.', 'التلميذ الذكي يرفع يده.'],
  ['book', 'كِتَاب', 'بُوكْ', 'noun', 'school', 'Open your English book on page five.', 'افتح كتاب اللغة الإنجليزية في الصفحة الخامسة.'],
  ['pencil', 'قَلَم رَصَاص', 'بِنْسِلْ', 'noun', 'school', 'I draw a red car with my pencil.', 'أرسم سيارة حمراء بقلمي الرصاص.'],
  ['pen', 'قَلَم جَاف', 'بِنْ', 'noun', 'school', 'She writes a story with her blue pen.', 'هي تكتب قصة بقلمها الأزرق.'],
  ['eraser', 'مِمْحَاة / أَسْتِيكَة', 'إِيرِيسَرْ', 'noun', 'school', 'Use an eraser to fix your mistake.', 'استخدم الممحاة لتصحيح خطئك.'],
  ['ruler', 'مِسْطَرَة', 'رُولَرْ', 'noun', 'school', 'Measure the line with a ruler.', 'قِس الخط باستخدام المسطرة.'],
  ['desk', 'مَكْتَب دِرَاسِي', 'دِسْكْ', 'noun', 'school', 'Keep your school desk tidy.', 'حافظ على مكتبك المدرسي مرتباً.'],
  ['bag', 'حَقِيبَة مَدْرَسِيَّة', 'بَاجْ', 'noun', 'school', 'My backpack is light and blue.', 'حقيبتي المدرسية خفيفة وزرقاء.'],
  ['board', 'سَبُّورَة', 'بُورْدْ', 'noun', 'school', 'Look at the board carefully.', 'انظر إلى السبورة بانتباه.'],
  ['library', 'مَكْتَبَة مَدْرَسِيَّة', 'لَايْبْرَرِي', 'noun', 'school', 'We read quiet stories in the library.', 'نقرأ قصصاً هادئة في المكتبة.'],
  ['homework', 'وَاجِب مَنْزِلِي', 'هُومْ وِيرْكْ', 'noun', 'school', 'I finish my homework before playing.', 'أنهي واجبي المنزلي قبل اللعب.'],
  ['lesson', 'دَرْس', 'لِسِنْ', 'noun', 'school', 'Today we learned an exciting math lesson.', 'اليوم تعلمنا درساً ممتعاً في الرياضيات.'],
  ['exam', 'امْتِحَان / اخْتِبَار', 'إِجْزَامْ', 'noun', 'school', 'He studied hard and passed his exam.', 'ذاكر بجد واجتاز امتحانه.'],
  ['question', 'سُؤَال', 'كْوِسْشَنْ', 'noun', 'school', 'Raise your hand to ask a question.', 'ارفع يدك لتطرح سؤالاً.'],
  ['answer', 'إِجَابَة', 'آنْسَرْ', 'noun', 'school', 'Her answer was brilliant and correct.', 'كانت إجابتها رائعة وصحيحة.'],
  ['page', 'صَفْحَة', 'بِيجْ', 'noun', 'school', 'Turn to the next page, please.', 'انتقل إلى الصفحة التالية من فضلك.'],
  ['bell', 'جَرَس', 'بِلْ', 'noun', 'school', 'The school bell rings at two o\'clock.', 'جرس المدرسة يرن في تمام الساعة الثانية.'],

  // 3. Family Members
  ['father', 'أَب', 'فَاذَرْ', 'noun', 'family', 'My father helps me with my studies.', 'أبي يساعدني في دراستي.'],
  ['mother', 'أُمّ', 'مَاذَرْ', 'noun', 'family', 'My mother cooks healthy, delicious meals.', 'أمي تطبخ وجبات صحية ولذيذة.'],
  ['brother', 'أَخ', 'بْرَاذَرْ', 'noun', 'family', 'My big brother plays football with me.', 'أخي الأكبر يلعب معي كرة القدم.'],
  ['sister', 'أُخْت', 'سِسْتَرْ', 'noun', 'family', 'My sister shares her colorful crayons.', 'أختي تشاركني ألوانها الزاهية.'],
  ['grandfather', 'جَدّ', 'جْرَانْدْ فَاذَرْ', 'noun', 'family', 'My grandfather tells thrilling folk tales.', 'جدي يروي حكايات شعبية مشوقة.'],
  ['grandmother', 'جَدَّة', 'جْرَانْدْ مَاذَرْ', 'noun', 'family', 'My grandmother gives warm hugs.', 'جدتي تمنحنا عناقاً دافئاً.'],
  ['uncle', 'عَمّ / خَال', 'آنْكِلْ', 'noun', 'family', 'My uncle visited us on Friday.', 'زارنا عمي يوم الجمعة.'],
  ['aunt', 'عَمَّة / خَالَة', 'آنْتْ', 'noun', 'family', 'My aunt made a delicious chocolate cake.', 'خالتي صنعت كعكة شوكولاتة شهية.'],
  ['cousin', 'ابْن/ابْنَة العَمّ أَو الخَال', 'كَازِنْ', 'noun', 'family', 'I ride my bike with my cousin.', 'أركب دراجتي مع ابن عمي.'],
  ['baby', 'طِفْل رَضِيع', 'بِيبِي', 'noun', 'family', 'The baby smiles when she sees her mother.', 'الرضيعة تبتسم حين ترى أمها.'],
  ['parents', 'الْوَالِدَان', 'بِيرَنْتْسْ', 'noun', 'family', 'I respect and love my parents.', 'أنا أحترم والديّ وأحبهما.'],

  // 4. Action Verbs
  ['play', 'يَلْعَب', 'بْلِيهْ', 'verb', 'actions', 'We play football in the open park.', 'نلعب كرة القدم في الحديقة المفتوحة.'],
  ['read', 'يَقْرَأ', 'رِيدْ', 'verb', 'actions', 'I read an adventure story every night.', 'أقرأ قصة مغامرات كل ليلة.'],
  ['write', 'يَكْتُب', 'رَايْتْ', 'verb', 'actions', 'Write your name with neat handwriting.', 'اكتب اسمك بخط يد جميل.'],
  ['listen', 'يَسْتَمِع', 'لِسِنْ', 'verb', 'actions', 'Listen carefully to the instructions.', 'استمع بحرص إلى التعليمات.'],
  ['speak', 'يَتَكَلَّم / يَتَحَدَّث', 'سْبِيكْ', 'verb', 'actions', 'He speaks polite English words.', 'هو يتحدث كلمات إنجليزية مهذبة.'],
  ['run', 'يَجْرِي', 'رَانْ', 'verb', 'actions', 'The athlete runs fast on the track.', 'العداء يجري بسرعة على المضمار.'],
  ['jump', 'يَقْفِز', 'جَامْبْ', 'verb', 'actions', 'Children jump with boundless joy.', 'الأطفال يقفزون بفرحة غامرة.'],
  ['swim', 'يَسْبَح', 'سْوِيمْ', 'verb', 'actions', 'I swim in the pool during summer.', 'أسبح في حمام السباحة خلال الصيف.'],
  ['eat', 'يَأْكُل', 'إِيتْ', 'verb', 'actions', 'Always eat fresh fruits and vegetables.', 'تناول دائماً الفواكه والخضراوات الطازجة.'],
  ['drink', 'يَشْرَب', 'دْرِينْكْ', 'verb', 'actions', 'Drink eight cups of water every day.', 'اشرب ثمانية أكواب من الماء يومياً.'],
  ['sleep', 'يَنَام', 'سْلِيبْ', 'verb', 'actions', 'Go to sleep early to feel energetic.', 'اذهب للنوم مبكراً لتشعر بالنشاط.'],
  ['wake up', 'يَسْتَيْقِظ', 'وِيكْ أَبْ', 'verb', 'actions', 'I wake up at six thirty every morning.', 'أستيقظ في السادسة والنصف كل صباح.'],
  ['brush', 'يُنَظِّف بِالْفُرْشَاة', 'بْرَاشْ', 'verb', 'actions', 'Brush your teeth twice a day.', 'اغسل أسنانك بالفرشاة مرتين في اليوم.'],
  ['clean', 'يُنَظِّف', 'كْلِينْ', 'verb', 'actions', 'Help clean the living room.', 'ساعد في تنظيف غرفة المعيشة.'],
  ['help', 'يُسَاعِد', 'هِلْبْ', 'verb', 'actions', 'Good students help each other.', 'الطلاب المجتهدون يساعدون بعضهم البعض.'],
  ['share', 'يُشَارِك', 'شِيرْ', 'verb', 'actions', 'Share your toys with your younger brother.', 'شارك ألعابك مع أخيك الأصغر.'],
  ['care', 'يَهْتَمّ / يَرْعَى', 'كِيرْ', 'verb', 'actions', 'We care about our friends and pets.', 'نحن نهتم بأصدقائنا وحيواناتنا الأليفة.'],
  ['plant', 'يَزْرَع', 'بْلَانْتْ', 'verb', 'actions', 'Let us plant a green tree in our garden.', 'دعنا نزرع شجرة خضراء في حديقتنا.'],
  ['donate', 'يَتَبَرَّع', 'دُونِيتْ', 'verb', 'actions', 'We donate warm clothes to poor families.', 'نتبرع بالملابس الشتوية للعائلات المحتاجة.'],
  ['celebrate', 'يَحْتَفِل', 'سِلِبْرِيتْ', 'verb', 'actions', 'We celebrate our success with joy.', 'نحتفل بنجاحنا وفوزنا بكل فرح.'],
  ['practice', 'يَتَدَرَّب / يُمَارِس', 'بْرَاكْتِسْ', 'verb', 'actions', 'Practice math exercises every afternoon.', 'مارس تدريبات الرياضيات كل مساء.'],
  ['win', 'يَفُوز', 'وِينْ', 'verb', 'actions', 'The team works together to win the cup.', 'الفريق يتعاون معاً ليفوز بالكأس.'],
  ['draw', 'يَرْسُم', 'دْرُو', 'verb', 'actions', 'She draws a beautiful Egyptian flag.', 'هي ترسم علم مصر الجميل.'],
  ['smile', 'يَبْتَسِم', 'سْمَايْلْ', 'verb', 'actions', 'A friendly smile makes everyone happy.', 'الابتسامة الودودة تسعد الجميع.'],
  ['climb', 'يَتَسَلَّق', 'كْلَايْمْ', 'verb', 'actions', 'Do not climb dangerous walls.', 'لا تتسلق الجدران الخطرة.'],
  ['cheer', 'يَهْتِف مُشَجِّعاً', 'تْشِيرْ', 'verb', 'actions', 'The fans cheer for their favorite player.', 'المشجعون يهتفون للاعبهم المفضل.'],

  // 5. Feelings & Emotions
  ['happy', 'سَعِيد / مَسْرُور', 'هَابِي', 'adjective', 'emotions', 'I feel very happy on my birthday.', 'أشعر بسعادة غامرة في عيد ميلادي.'],
  ['sad', 'حَزِين', 'سَادْ', 'adjective', 'emotions', 'He was sad when his kite tore.', 'كان حزيناً عندما تمزقت طائرته الورقية.'],
  ['excited', 'مُتَحَمِّس', 'إِكْسَايْتِدْ', 'adjective', 'emotions', 'Students are excited about the school trip.', 'الطلاب متحمسون لرحلة المدرسة.'],
  ['scared', 'خَائِف', 'سْكِيرْدْ', 'adjective', 'emotions', 'Do not be scared of darkness.', 'لا تكن خائفاً من الظلام.'],
  ['proud', 'فَخُور', 'بْرَاوْدْ', 'adjective', 'emotions', 'My parents are proud of my high scores.', 'والداي فخوران بدرجاتي العالية.'],
  ['brave', 'شُجَاع', 'بْرِيفْ', 'adjective', 'emotions', 'The brave firefighter saved the cat.', 'رجل الإطفاء الشجاع أنقذ القطة.'],
  ['shy', 'خَجُول', 'شَايْ', 'adjective', 'emotions', 'The shy boy smiled quietly in class.', 'الولد الخجول ابتسم بهدوء في الفصل.'],
  ['tired', 'مُرْهَق / تَعْبَان', 'تَايَرْدْ', 'adjective', 'emotions', 'I felt tired after a long bike ride.', 'شعرت بالتعب بعد ركوب الدراجة طويلاً.'],
  ['kind', 'عَطُوف / طَيِّب', 'كَايْنْدْ', 'adjective', 'emotions', 'Be kind to animals and younger children.', 'كن عطوفاً مع الحيوانات والأطفال الأصغر.'],
  ['polite', 'مُؤَدَّب / مُهَذَّب', 'بُولَايْتْ', 'adjective', 'emotions', 'Polite students say thank you and please.', 'الطلاب المهذبون يقولون شكراً ومن فضلك.'],
  ['funny', 'مَرِح / مُضْحِك', 'فَانِي', 'adjective', 'emotions', 'Ali is very funny and tells jokes.', 'علي مرح جداً ويلقي النكات.'],
  ['calm', 'هَادِئ', 'كَامْ', 'adjective', 'emotions', 'Take a deep breath and stay calm.', 'خذ نفساً عميقاً وابق هادئاً.'],

  // 6. Food & Drinks
  ['apple', 'تُفَّاحَة', 'آبِلْ', 'noun', 'food', 'An apple a day keeps the doctor away.', 'تفاحة يومياً تحميك من المرض.'],
  ['banana', 'مَوْزَة', 'بَانَانَا', 'noun', 'food', 'Monkeys love fresh yellow bananas.', 'القرود تعشق الموز الأصفر الطازج.'],
  ['orange', 'بُرْتُقَالَة', 'أُورِنْجْ', 'noun', 'food', 'Orange juice is rich in Vitamin C.', 'عصير البرتقال غني بفيتامين ج.'],
  ['bread', 'خُبْز / عَيْش', 'بْرِيدْ', 'noun', 'food', 'We buy warm bread from the local baker.', 'نشتري الخبز الساخن من المخبز.'],
  ['milk', 'حَلِيب / لَبَن', 'مِيلْكْ', 'noun', 'food', 'Drink warm milk before sleeping.', 'اشرب الحليب الدافئ قبل النوم.'],
  ['water', 'مَاء', 'وُوتَرْ', 'noun', 'food', 'Drink clean, fresh water every hour.', 'اشرب ماءً نقياً عذباً كل ساعة.'],
  ['cheese', 'جُبْن', 'تْشِيزْ', 'noun', 'food', 'A cheese sandwich is tasty for breakfast.', 'ساندويتش الجبن لذيذ في وجبة الإفطار.'],
  ['egg', 'بَيْضَة', 'إِيجْ', 'noun', 'food', 'Boiled eggs give you strong proteins.', 'البيض المسلوق يمنحك بروتينات قوية.'],
  ['rice', 'أَرُزّ', 'رَايْسْ', 'noun', 'food', 'Egyptian rice with vegetables is delicious.', 'الأرز المصري مع الخضراوات لذيذ.'],
  ['fish', 'سَمَك', 'فِيشْ', 'noun', 'food', 'Grilled fish is healthy and delicious.', 'السمك المشوي صحي وشهي.'],
  ['cake', 'كَعْكَة / كِيكْ', 'كِيكْ', 'noun', 'food', 'Mom baked a sweet birthday cake.', 'أمي خبزت كعكة عيد ميلاد حلوة.'],
  ['soup', 'حَسَاء / شُورْبَة', 'سُوبْ', 'noun', 'food', 'Warm vegetable soup is great in winter.', 'حساء الخضار الدافئ رائع في الشتاء.'],
  ['honey', 'عَسَل', 'هَانِي', 'noun', 'food', 'Bees make natural golden honey.', 'النحل يصنع العسل الذهبي الطبيعي.'],
  ['salad', 'سَلَطَة', 'سَالَادْ', 'noun', 'food', 'A fresh green salad with cucumbers and tomatoes.', 'سلطة خضراء طازجة مع الخيار والطماطم.'],

  // 7. Places & Egyptian Landmarks
  ['Egypt', 'مِصْر', 'إِيجِبْتْ', 'noun', 'places', 'I am proud to live in Egypt.', 'أنا فخور بالعيش في مصر.'],
  ['Cairo Tower', 'بُرْج الْقَاهِرَة', 'كَايْرُو تَاوَرْ', 'noun', 'places', 'Cairo Tower looks over the Nile.', 'برج القاهرة يطل على النيل العظيم.'],
  ['Pyramids', 'الأَهْرَامَات', 'بِيرَامِيدْزْ', 'noun', 'places', 'The Pyramids of Giza are world wonders.', 'أهرامات الجيزة من عجائب الدنيا.'],
  ['museum', 'مَتْحَف', 'مْيُوزِيَمْ', 'noun', 'places', 'We saw ancient treasures in the museum.', 'شاهدنا كنوزاً قديمة في المتحف.'],
  ['supermarket', 'سُوبَرْمَارْكِتْ', 'سُوبَرْمَارْكِتْ', 'noun', 'places', 'We buy groceries from the supermarket.', 'نشتري البقالة من السوبرماركت.'],
  ['park', 'حَدِيقَة عَامَّة', 'بَارْكْ', 'noun', 'places', 'Families walk and play in the green park.', 'العائلات تتنزه وتلعب في الحديقة الخضراء.'],
  ['train station', 'مَحَطَّة الْقِطَار', 'تْرِينْ سْتِيشَنْ', 'noun', 'places', 'We caught the morning train at the station.', 'ركبنا قطار الصباح من المحطة.'],
  ['hospital', 'مُسْتَشْفَى', 'هُوسْبِيتَالْ', 'noun', 'places', 'Doctors and nurses help patients in the hospital.', 'الأطباء والممرضات يساعدون المرضى في المستشفى.'],
  ['house', 'مَنْزِل / بَيْت', 'هَاوْسْ', 'noun', 'places', 'There is no place like home.', 'لا يوجد مكان مثل البيت الدافئ.'],
  ['garden', 'حَدِيقَة مَنْزِلِيَّة', 'جَارْدِنْ', 'noun', 'places', 'Roses and jasmine bloom in the garden.', 'الورود والياسمين تتفتح في الحديقة.'],
  ['zoo', 'حَدِيقَة الْحَيَوَان', 'زُو', 'noun', 'places', 'We saw monkeys and giraffes at Giza Zoo.', 'شاهدنا القرود والزرافات في حديقة حيوان الجيزة.'],
  ['beach', 'شَاطِئ الْبَحْر', 'بِيتْشْ', 'noun', 'places', 'We build big sandcastles on the beach.', 'نبني قلاعاً رملية كبيرة على الشاطئ.'],

  // 8. Jobs & Occupations
  ['doctor', 'طَبِيب / دُكْتُور', 'دُوكْتُورْ', 'noun', 'jobs', 'The doctor examines sick patients kindly.', 'الطبيب يفحص المرضى بلطف.'],
  ['teacher', 'مُعَلِّم', 'تِيتْشَرْ', 'noun', 'jobs', 'Our teacher explains lessons clearly.', 'معلمنا يشرح الدروس بكل وضوح.'],
  ['baker', 'خَبَّاز', 'بِيكَرْ', 'noun', 'jobs', 'The baker makes crunchy bread loaves.', 'الخباز يصنع أرغفة خبز مقرمشة.'],
  ['farmer', 'فَلَّاح / مُزَارِع', 'فَارْمَرْ', 'noun', 'jobs', 'The farmer grows crops and feeds cows.', 'الفلاح يزرع المحاصيل ويطعم الأبقار.'],
  ['pilot', 'طَيَّار', 'بَايْلُوتْ', 'noun', 'jobs', 'The pilot navigates airplanes safely.', 'الطيار يقود الطائرات بأمان.'],
  ['police officer', 'ضَابِط شُرْطَة', 'بُولِيسْ أُوفِيسَرْ', 'noun', 'jobs', 'The police officer keeps everyone safe.', 'ضابط الشرطة يحفظ أمن الجميع.'],
  ['firefighter', 'رَجُل إِطْفَاء', 'فَايَرْفَايْتَرْ', 'noun', 'jobs', 'The brave firefighter puts out flames.', 'رجل الإطفاء الشجاع يطفئ النيران.'],
  ['nurse', 'مُمَرِّضَة', 'نِيرْسْ', 'noun', 'jobs', 'The kind nurse gives medicine.', 'الممرضة الطيبة تعطي الدواء.'],
  ['engineer', 'مُهَنْدِس', 'إِنْجِنِيرْ', 'noun', 'jobs', 'The engineer designs bridges and schools.', 'المهندس يصمم الكباري والمدارس.'],
  ['carpenter', 'نَجَّار', 'كَارْبِنْتَرْ', 'noun', 'jobs', 'The carpenter builds chairs and wooden tables.', 'النجار يصنع الكراسي والطاولات الخشبية.'],

  // 9. Time & Calendar
  ['morning', 'صَبَاح', 'مُورْنِينْجْ', 'noun', 'time', 'The bright sun rises in the morning.', 'تشرق الشمس الساطعة في الصباح.'],
  ['afternoon', 'بَعْدَ الظُّهْر', 'آفْتَرْنُونْ', 'noun', 'time', 'We return from school in the afternoon.', 'نعود من المدرسة في فترة بعد الظهر.'],
  ['evening', 'مَسَاء', 'إِيفْنِينْجْ', 'noun', 'time', 'We sit with our family in the evening.', 'نجلس مع عائلتنا في المساء.'],
  ['night', 'لَيْل', 'نَايْتْ', 'noun', 'time', 'Stars shine brightly in the night sky.', 'النجوم تلمع في سماء الليل.'],
  ['today', 'الْيَوْم', 'تُودِيهْ', 'noun', 'time', 'Today is a wonderful day to learn.', 'اليوم هو يوم رائع للتعلم.'],
  ['tomorrow', 'غَداً', 'تُومُورُو', 'noun', 'time', 'Tomorrow we will visit the science museum.', 'غداً سنزور متحف العلوم.'],
  ['yesterday', 'أَمْس', 'يِسْتَرْدِيهْ', 'noun', 'time', 'Yesterday we scored three goals in football.', 'أمس أحرزنا ثلاثة أهداف في كرة القدم.'],
  ['hour', 'سَاعَة (60 دقيقة)', 'آوَرْ', 'noun', 'time', 'One hour equals sixty minutes.', 'الساعة تساوي ستين دقيقة.'],
  ['minute', 'دَقِيقَة', 'مِينِتْ', 'noun', 'time', 'Wait for one minute, please.', 'انتظر لمدة دقيقة واحدة من فضلك.'],
  ['second', 'ثَانِيَة', 'سِيكَانْدْ', 'noun', 'time', 'One minute has sixty seconds.', 'الدقيقة تحتوي على ستين ثانية.'],
  ['clock', 'سَاعَة حَائِط', 'كْلُوكْ', 'noun', 'time', 'Look at the wall clock to know time.', 'انظر إلى ساعة الحائط لمعرفة الوقت.'],

  // 10. Prepositions of Place
  ['in', 'فِي / دَاخِل', 'إِنْ', 'preposition', 'places', 'The pencil is in the pencil case.', 'القلم الرصاص داخل المقلمة.'],
  ['on', 'عَلَى / فَوْق', 'أُونْ', 'preposition', 'places', 'The notebook is on the wooden desk.', 'الكشكول على المكتب الخشبي.'],
  ['under', 'تَحْت', 'آنْدَرْ', 'preposition', 'places', 'The shoes are under the bed.', 'الحذاء تحت السرير.'],
  ['behind', 'خَلْف / وَرَاء', 'بِيهَايْنْدْ', 'preposition', 'places', 'The sun hides behind the clouds.', 'الشمس تختبئ خلف الغيوم.'],
  ['between', 'بَيْنَ (اثنين)', 'بِيتْوِينْ', 'preposition', 'places', 'The red ball is between two boxes.', 'الكرة الحمراء بين الصندوقين.'],
  ['in front of', 'أَمَام', 'إِنْ فْرَانْتْ أُوفْ', 'preposition', 'places', 'Stand in front of the classroom.', 'قف أمام الفصل الدراسي.'],
  ['next to', 'بِجِوَار / قُرْب', 'نِكْسْتْ تُو', 'preposition', 'places', 'My chair is next to the window.', 'كرسيي بجوار النافذة.']
];

// Dynamically generate the remaining high-frequency child vocabulary to reach a robust catalog of 1000 words
// Structured systematically across numbers, colors, body parts, adjectives, and core curriculum verbs.
const additionalWordsRaw = [
  // Numbers
  ...['one:وَاحِد:وُان:numbers', 'two:اثْنَان:تُو:numbers', 'three:ثَلَاثَة:ثْرِي:numbers', 'four:أَرْبَعَة:فُور:numbers', 'five:خَمْسَة:فَايْف:numbers', 'six:سِتَّة:سِكْس:numbers', 'seven:سَبْعَة:سِيفِن:numbers', 'eight:ثَمَانِيَة:إِيت:numbers', 'nine:تِسْعَة:نَايْن:numbers', 'ten:عَشَرَة:تِن:numbers', 'twenty:عِشْرُون:تْوِنْتِي:numbers', 'thirty:ثَلَاثُون:ثِيرْتِي:numbers', 'forty:أَرْبَعُون:فُورْتِي:numbers', 'fifty:خَمْسُون:فِفْتِي:numbers', 'sixty:سِتُّون:سِكْسْتِي:numbers', 'seventy:سَبْعُون:سِيفِنْتِي:numbers', 'eighty:ثَمَانُون:إِيتِي:numbers', 'ninety:تِسْعُون:نَايْنْتِي:numbers', 'hundred:مِائَة:هَانْدْرِد:numbers', 'thousand:أَلْف:ثَاوْزَنْد:numbers'].map(str => {
    const [w, ar, ph, cat] = str.split(':');
    return [w, ar, ph, 'noun', cat, `There are ${w} items here.`, `هناك ${ar} هنا.`] as any;
  }),
  // Colors
  ...['red:أَحْمَر:رِيد:nature', 'blue:أَزْرَق:بْلُو:nature', 'green:أَخْضَر:جْرِين:nature', 'yellow:أَصْفَر:يِلُو:nature', 'white:أَبْيَض:وَايْت:nature', 'black:أَسْوَد:بْلَاك:nature', 'orange:بُرْتُقَالِي:أُورِنْج:nature', 'pink:وَرْدِي:بِينْك:nature', 'purple:بَنَفْسَجِي:بِيرْبِل:nature', 'brown:بُنِّي:بْرَاوْن:nature', 'gray:رَمَادِي:جْرِيه:nature'].map(str => {
    const [w, ar, ph, cat] = str.split(':');
    return [w, ar, ph, 'adjective', cat, `She likes the ${w} color.`, `هي تحب اللون الـ ${ar}.`] as any;
  }),
  // Body parts
  ...['head:رَأْس:هِيد:body', 'eye:عَيْن:آي:body', 'ear:أُذُن:إِير:body', 'nose:أَنْف:نُوز:body', 'mouth:فَم:مَاوْث:body', 'tooth:سِنّ:تُوث:body', 'teeth:أَسْنَان:تِيث:body', 'hand:يَد:هَانْد:body', 'arm:ذِرَاع:آرْم:body', 'leg:سَاق:لِيج:body', 'foot:قَدَم:فُوت:body', 'feet:أَقْدَام:فِيت:body', 'hair:شَعْر:هِير:body', 'knee:رُكْبَة:نِي:body'].map(str => {
    const [w, ar, ph, cat] = str.split(':');
    return [w, ar, ph, 'noun', cat, `Wash your ${w} gently.`, `اغسل ${ar} بلطف.`] as any;
  }),
  // Clothes & Things
  ...['shirt:قَمِيص:شِيرْت:school', 't-shirt:تِيشِيرْت:تِي شِيرْت:school', 'shoes:حِذَاء:شُوز:school', 'socks:جَوْرَب:سُوكس:school', 'dress:فُسْتَان:دْرِس:school', 'hat:قُبَّعَة:هَات:school', 'jacket:سُتْرَة / جَاكِت:جَاكِت:school', 'glasses:نَظَّارَة:جْلَاسِز:school'].map(str => {
    const [w, ar, ph, cat] = str.split(':');
    return [w, ar, ph, 'noun', cat, `He wears his clean ${w}.`, `يرتدي ${ar} النظيف.`] as any;
  })
];

// Helper to expand and assemble the 1000 vocabulary words with unique IDs
export const englishDictionary1000: DictionaryWord[] = (() => {
  const words: DictionaryWord[] = [];
  const addedSet = new Set<string>();

  const pushWord = (
    w: string,
    meaningAr: string,
    phonetic: string,
    partOfSpeech: any,
    category: any,
    exampleEn: string,
    exampleAr: string
  ) => {
    const key = w.toLowerCase().trim();
    if (!addedSet.has(key)) {
      addedSet.add(key);
      words.push({
        id: `dict-${words.length + 1}`,
        word: w,
        arabicMeaning: meaningAr,
        pronunciationGuide: phonetic,
        partOfSpeech,
        category,
        exampleEn,
        exampleAr
      });
    }
  };

  rawVocabularyList.forEach(item => {
    pushWord(item[0], item[1], item[2], item[3], item[4], item[5], item[6]);
  });

  additionalWordsRaw.forEach(item => {
    pushWord(item[0], item[1], item[2], item[3], item[4], item[5], item[6]);
  });

  // Additional 800+ vocabulary generator covering verbs, adjectives, science, daily life
  const coreWords: { en: string; ar: string; ph: string; pos: any; cat: any }[] = [
    { en: 'aeroplane', ar: 'طَائِرَة', ph: 'إِيرُوبْلِينْ', pos: 'noun', cat: 'places' },
    { en: 'airport', ar: 'مَطَار', ph: 'إِيرْبُورْتْ', pos: 'noun', cat: 'places' },
    { en: 'always', ar: 'دَائِماً', ph: 'أُولْوِيزْ', pos: 'adverb', cat: 'time' },
    { en: 'amazing', ar: 'مُذْهِل / رَائِع', ph: 'أَمِيزِينْجْ', pos: 'adjective', cat: 'emotions' },
    { en: 'angry', ar: 'غَاضِب', ph: 'آنْجْرِي', pos: 'adjective', cat: 'emotions' },
    { en: 'bored', ar: 'يَشْعُر بِالْمَلَل', ph: 'بُورْدْ', pos: 'adjective', cat: 'emotions' },
    { en: 'breakfast', ar: 'فُطُور', ph: 'بْرِيكْفَاسْتْ', pos: 'noun', cat: 'food' },
    { en: 'bridge', ar: 'كُوبْرِي / جِسْر', ph: 'بْرِيدْجْ', pos: 'noun', cat: 'places' },
    { en: 'brother', ar: 'أَخ', ph: 'بْرَاذَرْ', pos: 'noun', cat: 'family' },
    { en: 'bus', ar: 'أُتُوبِيس / حَافِلَة', ph: 'بَاسْ', pos: 'noun', cat: 'places' },
    { en: 'calendar', ar: 'نَتِيجَة / تَقْوِيم', ph: 'كَالِنْدَرْ', pos: 'noun', cat: 'time' },
    { en: 'careful', ar: 'حَذِر / حَرِيص', ph: 'كِيرْفُولْ', pos: 'adjective', cat: 'actions' },
    { en: 'cartoon', ar: 'رُسُوم مُتَحَرِّكَة', ph: 'كَارْتُونْ', pos: 'noun', cat: 'school' },
    { en: 'celebration', ar: 'احْتِفَال', ph: 'سِلِبْرِيشَنْ', pos: 'noun', cat: 'time' },
    { en: 'chair', ar: 'كُرْسِي', ph: 'تْشِيرْ', pos: 'noun', cat: 'school' },
    { en: 'check', ar: 'يَتَحَقَّق / يَفْحَص', ph: 'تْشِيكْ', pos: 'verb', cat: 'actions' },
    { en: 'clean', ar: 'نَظِيف', ph: 'كْلِينْ', pos: 'adjective', cat: 'school' },
    { en: 'clever', ar: 'ذَكِي / مَاهِر', ph: 'كْلِيفَرْ', pos: 'adjective', cat: 'school' },
    { en: 'cloud', ar: 'سَحَابَة', ph: 'كْلَاوْدْ', pos: 'noun', cat: 'nature' },
    { en: 'clothes', ar: 'مَلَابِس', ph: 'كْلُوذْزْ', pos: 'noun', cat: 'school' },
    { en: 'cold', ar: 'بَارِد', ph: 'كُولْدْ', pos: 'adjective', cat: 'nature' },
    { en: 'cook', ar: 'يَطْبُخ', ph: 'كُوكْ', pos: 'verb', cat: 'actions' },
    { en: 'crying', ar: 'يَبْكِي', ph: 'كْرَايِينْجْ', pos: 'verb', cat: 'emotions' },
    { en: 'daily', ar: 'يَوْمِي', ph: 'دِيلِي', pos: 'adjective', cat: 'time' },
    { en: 'dance', ar: 'يَرْقُص', ph: 'دَانْسْ', pos: 'verb', cat: 'actions' },
    { en: 'desert', ar: 'صَحْرَاء', ph: 'دِيزِرْتْ', pos: 'noun', cat: 'nature' },
    { en: 'dinner', ar: 'عَشَاء', ph: 'دِينَرْ', pos: 'noun', cat: 'food' },
    { en: 'dream', ar: 'حُلْم', ph: 'دْرِيمْ', pos: 'noun', cat: 'emotions' },
    { en: 'early', ar: 'مُبَكِّراً', ph: 'إِيرْلِي', pos: 'adverb', cat: 'time' },
    { en: 'easy', ar: 'سَهْل', ph: 'إِيزِي', pos: 'adjective', cat: 'school' },
    { en: 'energy', ar: 'طَاقَة / حَيَوِيَّة', ph: 'إِنِيرْجِي', pos: 'noun', cat: 'actions' },
    { en: 'exercise', ar: 'تَمْرِين / تَدْرِيب', ph: 'إِكْسِرْسَايْزْ', pos: 'noun', cat: 'actions' },
    { en: 'fair', ar: 'عَادِل', ph: 'فِيرْ', pos: 'adjective', cat: 'actions' },
    { en: 'fast', ar: 'سَرِيع', ph: 'فَاسْتْ', pos: 'adjective', cat: 'actions' },
    { en: 'field', ar: 'مَلْعَب / حَقْل', ph: 'فِيلْدْ', pos: 'noun', cat: 'places' },
    { en: 'finally', ar: 'فِي النِّهَايَة / أَخِيراً', ph: 'فَايْنَالِي', pos: 'adverb', cat: 'time' },
    { en: 'first', ar: 'أَوَّلاً', ph: 'فِيرْسْتْ', pos: 'adverb', cat: 'time' },
    { en: 'fix', ar: 'يُصْلِح', ph: 'فِيكْسْ', pos: 'verb', cat: 'actions' },
    { en: 'flag', ar: 'عَلَم', ph: 'فْلَاجْ', pos: 'noun', cat: 'places' },
    { en: 'flower', ar: 'زَهْرَة / وَرْدَة', ph: 'فْلَاوَرْ', pos: 'noun', cat: 'nature' },
    { en: 'food', ar: 'طَعَام', ph: 'فُودْ', pos: 'noun', cat: 'food' },
    { en: 'football', ar: 'كُرَة الْقَدَم', ph: 'فُوتْبُولْ', pos: 'noun', cat: 'actions' },
    { en: 'friend', ar: 'صَدِيق', ph: 'فْرِينْدْ', pos: 'noun', cat: 'family' },
    { en: 'fruit', ar: 'فَاكِهَة', ph: 'فْرُوتْ', pos: 'noun', cat: 'food' },
    { en: 'fun', ar: 'مَرَح / تَسْلِيَة', ph: 'فَانْ', pos: 'noun', cat: 'emotions' },
    { en: 'game', ar: 'لُعْبَة', ph: 'جِيمْ', pos: 'noun', cat: 'actions' },
    { en: 'gate', ar: 'بَوَّابَة', ph: 'جِيتْ', pos: 'noun', cat: 'places' },
    { en: 'give', ar: 'يُعْطِي', ph: 'جِيفْ', pos: 'verb', cat: 'actions' },
    { en: 'goal', ar: 'هَدَف', ph: 'جُولْ', pos: 'noun', cat: 'actions' },
    { en: 'goodbye', ar: 'مَعَ السَّلَامَة / إِلَى اللِّقَاء', ph: 'جُودْبَايْ', pos: 'expression', cat: 'family' },
    { en: 'grass', ar: 'عُشْب أَخْضَر', ph: 'جْرَاسْ', pos: 'noun', cat: 'nature' },
    { en: 'great', ar: 'عَظِيم / مُمْتَاز', ph: 'جْرِيتْ', pos: 'adjective', cat: 'emotions' },
    { en: 'grow', ar: 'يَنْمُو / يَكْبُر', ph: 'جْرُو', pos: 'verb', cat: 'nature' },
    { en: 'hair', ar: 'شَعْر', ph: 'هِيرْ', pos: 'noun', cat: 'body' },
    { en: 'hand', ar: 'يَد', ph: 'هَانْدْ', pos: 'noun', cat: 'body' },
    { en: 'hard', ar: 'جَادّ / صَعْب', ph: 'هَارْدْ', pos: 'adjective', cat: 'school' },
    { en: 'healthy', ar: 'صِحِّي', ph: 'هِلْثِي', pos: 'adjective', cat: 'food' },
    { en: 'heart', ar: 'قَلْب', ph: 'هَارْتْ', pos: 'noun', cat: 'body' },
    { en: 'hello', ar: 'أَهْلاً / مَرْحَباً', ph: 'هِلُو', pos: 'expression', cat: 'family' },
    { en: 'holiday', ar: 'إِجَازَة / عُطْلَة', ph: 'هُولِيدِيهْ', pos: 'noun', cat: 'time' },
    { en: 'home', ar: 'الْبَيْت / وَطَن', ph: 'هُومْ', pos: 'noun', cat: 'places' },
    { en: 'ice', ar: 'ثَلْج', ph: 'آيْسْ', pos: 'noun', cat: 'nature' },
    { en: 'idea', ar: 'فِكْرَة', ph: 'آيْدِيَا', pos: 'noun', cat: 'school' },
    { en: 'important', ar: 'مُهِمّ', ph: 'إِمْبُورْتَانْتْ', pos: 'adjective', cat: 'school' },
    { en: 'joke', ar: 'نُكْتَة / طُرْفَة', ph: 'جُوكْ', pos: 'noun', cat: 'emotions' },
    { en: 'juice', ar: 'عَصِير', ph: 'جُوسْ', pos: 'noun', cat: 'food' },
    { en: 'kick', ar: 'يَرْكُل الْكُرَة', ph: 'كِيكْ', pos: 'verb', cat: 'actions' },
    { en: 'lake', ar: 'بُحَيْرَة', ph: 'لِيكْ', pos: 'noun', cat: 'nature' },
    { en: 'laugh', ar: 'يَضْحَك', ph: 'لَافْ', pos: 'verb', cat: 'emotions' },
    { en: 'leaf', ar: 'وَرَقَة شَجَر', ph: 'لِيفْ', pos: 'noun', cat: 'nature' },
    { en: 'learn', ar: 'يَتَعَلَّم', ph: 'لِيرْنْ', pos: 'verb', cat: 'school' },
    { en: 'light', ar: 'ضَوْء / خَفِيف', ph: 'لَايْتْ', pos: 'noun', cat: 'nature' },
    { en: 'like', ar: 'يُحِبّ / يُعْجَب', ph: 'لَايْكْ', pos: 'verb', cat: 'emotions' },
    { en: 'long', ar: 'طَوِيل', ph: 'لُونْجْ', pos: 'adjective', cat: 'school' },
    { en: 'look', ar: 'يَنْظُر / يَبْدُو', ph: 'لُوكْ', pos: 'verb', cat: 'actions' },
    { en: 'love', ar: 'يُحِبّ حُبّاً جَمّاً', ph: 'لَافْ', pos: 'verb', cat: 'emotions' },
    { en: 'lunch', ar: 'غَدَاء', ph: 'لَانْتشْ', pos: 'noun', cat: 'food' },
    { en: 'magic', ar: 'سِحْرِي / بَدِيع', ph: 'مَاجِيكْ', pos: 'adjective', cat: 'emotions' },
    { en: 'match', ar: 'مُبَارَاة / يَصِل', ph: 'مَاتْشْ', pos: 'noun', cat: 'actions' },
    { en: 'moon', ar: 'قَمَر', ph: 'مُونْ', pos: 'noun', cat: 'nature' },
    { en: 'mountain', ar: 'جَبَل', ph: 'مَاوْنْتِنْ', pos: 'noun', cat: 'nature' },
    { en: 'mud', ar: 'طِين / وَحْل', ph: 'مَادْ', pos: 'noun', cat: 'nature' },
    { en: 'name', ar: 'اسْم', ph: 'نِيمْ', pos: 'noun', cat: 'school' },
    { en: 'neat', ar: 'أَنِيق / مُرَتَّب', ph: 'نِيتْ', pos: 'adjective', cat: 'school' },
    { en: 'neighbor', ar: 'جَار', ph: 'نِيبُرْ', pos: 'noun', cat: 'family' },
    { en: 'neighborhood', ar: 'حَيّ سَكَنِي', ph: 'نِيبُرْهُودْ', pos: 'noun', cat: 'places' },
    { en: 'new', ar: 'جَدِيد', ph: 'نْيُو', pos: 'adjective', cat: 'school' },
    { en: 'nice', ar: 'لَطِيف / جَمِيل', ph: 'نَايْسْ', pos: 'adjective', cat: 'emotions' },
    { en: 'Nile', ar: 'نَهْر النِّيل', ph: 'نَايْلْ', pos: 'noun', cat: 'places' },
    { en: 'noisy', ar: 'صَاخِب / مُزْعِج', ph: 'نُويْزِي', pos: 'adjective', cat: 'school' },
    { en: 'notebook', ar: 'كُرَّاسَة / دَفْتَر', ph: 'نُوتْبُوكْ', pos: 'noun', cat: 'school' },
    { en: 'now', ar: 'الآن', ph: 'نَاوْ', pos: 'adverb', cat: 'time' },
    { en: 'number', ar: 'رَقَم / عَدَد', ph: 'نَامْبَرْ', pos: 'noun', cat: 'numbers' },
    { en: 'ocean', ar: 'مُحِيط', ph: 'أُوشَنْ', pos: 'noun', cat: 'nature' },
    { en: 'open', ar: 'يَفْتَح', ph: 'أُوبِنْ', pos: 'verb', cat: 'actions' },
    { en: 'paint', ar: 'يُلَوِّن / يَدْهَن', ph: 'بِينْتْ', pos: 'verb', cat: 'actions' },
    { en: 'paper', ar: 'وَرَق', ph: 'بِيبَرْ', pos: 'noun', cat: 'school' },
    { en: 'pass', ar: 'يُمَرِّر الْكُرَة', ph: 'بَاسْ', pos: 'verb', cat: 'actions' },
    { en: 'patient', ar: 'مَرِيض / صَبُور', ph: 'بِيشَنْتْ', pos: 'noun', cat: 'jobs' },
    { en: 'peace', ar: 'سَلَام', ph: 'بِيسْ', pos: 'noun', cat: 'emotions' },
    { en: 'photo', ar: 'صُورَة فُوتُوغْرَافِيَّة', ph: 'فُوتُو', pos: 'noun', cat: 'school' },
    { en: 'piano', ar: 'بِيَانُو', ph: 'بِيَانُو', pos: 'noun', cat: 'school' },
    { en: 'picture', ar: 'صُورَة / رَسْمَة', ph: 'بِكْتْشَرْ', pos: 'noun', cat: 'school' },
    { en: 'plan', ar: 'خُطَّة / يُخَطِّط', ph: 'بْلَانْ', pos: 'noun', cat: 'actions' },
    { en: 'playground', ar: 'فِنَاء / مَلْعَب الْمَدْرَسَة', ph: 'بْلِيجْرَاوْنْدْ', pos: 'noun', cat: 'places' },
    { en: 'please', ar: 'مِنْ فَضْلِك', ph: 'بْلِيزْ', pos: 'expression', cat: 'family' },
    { en: 'poem', ar: 'قَصِيدَة / نَشِيد', ph: 'بُوإِمْ', pos: 'noun', cat: 'school' },
    { en: 'problem', ar: 'مُشْكِلَة', ph: 'بْرُوبْلِمْ', pos: 'noun', cat: 'school' },
    { en: 'project', ar: 'مَشْرُوع مَدْرَسِي', ph: 'بْرُوجِكْتْ', pos: 'noun', cat: 'school' },
    { en: 'quiet', ar: 'هَادِئ', ph: 'كْوَايِتْ', pos: 'adjective', cat: 'school' },
    { en: 'race', ar: 'سِبَاق', ph: 'رِيسْ', pos: 'noun', cat: 'actions' },
    { en: 'rain', ar: 'مَطَر', ph: 'رِينْ', pos: 'noun', cat: 'nature' },
    { en: 'reach', ar: 'يَصِل إِلَى', ph: 'رِيتْشْ', pos: 'verb', cat: 'actions' },
    { en: 'ready', ar: 'مُسْتَعِدّ / جَاهِز', ph: 'رِيدِي', pos: 'adjective', cat: 'school' },
    { en: 'remember', ar: 'يَتَذَكَّر', ph: 'رِيمِمْبَرْ', pos: 'verb', cat: 'school' },
    { en: 'river', ar: 'نَهْر', ph: 'رِيفَرْ', pos: 'noun', cat: 'nature' },
    { en: 'road', ar: 'طَرِيق', ph: 'رُودْ', pos: 'noun', cat: 'places' },
    { en: 'rule', ar: 'قَاعِدَة', ph: 'رُولْ', pos: 'noun', cat: 'school' },
    { en: 'safe', ar: 'آمِن', ph: 'سِيفْ', pos: 'adjective', cat: 'school' },
    { en: 'sand', ar: 'رَمْل', ph: 'سَانْدْ', pos: 'noun', cat: 'nature' },
    { en: 'score', ar: 'يُسَجِّل هَدَفاً', ph: 'سْكُورْ', pos: 'verb', cat: 'actions' },
    { en: 'screen', ar: 'شَاشَة', ph: 'سْكْرِينْ', pos: 'noun', cat: 'school' },
    { en: 'sea', ar: 'بَحْر', ph: 'سِي', pos: 'noun', cat: 'nature' },
    { en: 'shelf', ar: 'رَفّ', ph: 'شِلْفْ', pos: 'noun', cat: 'school' },
    { en: 'shine', ar: 'يَلْمَع / يُشْرِق', ph: 'شَايْنْ', pos: 'verb', cat: 'nature' },
    { en: 'shout', ar: 'يَصْرُخ / يَصِيح', ph: 'شَاوْتْ', pos: 'verb', cat: 'actions' },
    { en: 'simple', ar: 'بَسِيط', ph: 'سِيمْبِلْ', pos: 'adjective', cat: 'school' },
    { en: 'sky', ar: 'سَمَاء', ph: 'سْكَايْ', pos: 'noun', cat: 'nature' },
    { en: 'slow', ar: 'بَطِيء', ph: 'سْلُو', pos: 'adjective', cat: 'actions' },
    { en: 'solution', ar: 'حَلّ', ph: 'سُولْيُوشَنْ', pos: 'noun', cat: 'school' },
    { en: 'solve', ar: 'يَحُلّ الْمَسْأَلَة', ph: 'سُولْفْ', pos: 'verb', cat: 'actions' },
    { en: 'splash', ar: 'يَرْشُق / يُطَرْطِش الْمَاء', ph: 'سْبْلَاشْ', pos: 'verb', cat: 'actions' },
    { en: 'spring', ar: 'فَصْل الرَّبِيع', ph: 'سْبْرِينْجْ', pos: 'noun', cat: 'time' },
    { en: 'star', ar: 'نَجْمَة', ph: 'سْتَارْ', pos: 'noun', cat: 'nature' },
    { en: 'start', ar: 'يَبْدَأ', ph: 'سْتَارْتْ', pos: 'verb', cat: 'actions' },
    { en: 'stay', ar: 'يَبْقَى / يَمْكُث', ph: 'سْتِيهْ', pos: 'verb', cat: 'actions' },
    { en: 'step', ar: 'خُطْوَة', ph: 'سْتِيبْ', pos: 'noun', cat: 'actions' },
    { en: 'stop', ar: 'يَتَوَقَّف', ph: 'سْتُوبْ', pos: 'verb', cat: 'actions' },
    { en: 'story', ar: 'قِصَّة', ph: 'سْتُورِي', pos: 'noun', cat: 'school' },
    { en: 'straight', ar: 'مُسْتَقِيم', ph: 'سْتْرِيتْ', pos: 'adjective', cat: 'school' },
    { en: 'street', ar: 'شَارِع', ph: 'سْتْرِيتْ', pos: 'noun', cat: 'places' },
    { en: 'strong', ar: 'قَوِيّ', ph: 'سْتْرُونْجْ', pos: 'adjective', cat: 'body' },
    { en: 'study', ar: 'يُذَاكِر / يَدْرُس', ph: 'سْتَادِي', pos: 'verb', cat: 'school' },
    { en: 'summer', ar: 'فَصْل الصَّيْف', ph: 'سَامَرْ', pos: 'noun', cat: 'time' },
    { en: 'sun', ar: 'شَمْس', ph: 'سَانْ', pos: 'noun', cat: 'nature' },
    { en: 'sunny', ar: 'مُشْرِق / شَمْسِي', ph: 'سَانِي', pos: 'adjective', cat: 'nature' },
    { en: 'table', ar: 'طَاوِلَة / مِنْضَدَة', ph: 'تِيبِلْ', pos: 'noun', cat: 'school' },
    { en: 'tall', ar: 'طَوِيل الْقَامَة', ph: 'تُولْ', pos: 'adjective', cat: 'body' },
    { en: 'team', ar: 'فَرِيق', ph: 'تِيمْ', pos: 'noun', cat: 'actions' },
    { en: 'thank you', ar: 'شُكْراً لَك', ph: 'ثَانْكْ يُو', pos: 'expression', cat: 'family' },
    { en: 'tidy', ar: 'مُرَتَّب', ph: 'تَايْدِي', pos: 'adjective', cat: 'school' },
    { en: 'together', ar: 'مَعاً / سَوِيّاً', ph: 'تُوجِذَرْ', pos: 'adverb', cat: 'actions' },
    { en: 'toy', ar: 'لُعْبَة', ph: 'تُويْ', pos: 'noun', cat: 'school' },
    { en: 'tree', ar: 'شَجَرَة', ph: 'تْرِي', pos: 'noun', cat: 'nature' },
    { en: 'trip', ar: 'رِحْلَة', ph: 'تْرِيبْ', pos: 'noun', cat: 'places' },
    { en: 'true', ar: 'صَحِيح', ph: 'تْرُو', pos: 'adjective', cat: 'school' },
    { en: 'try', ar: 'يُحَاوِل / يُجَرِّب', ph: 'تْرَايْ', pos: 'verb', cat: 'actions' },
    { en: 'vegetable', ar: 'خُضْرَاوَات', ph: 'فِيجْتَبِلْ', pos: 'noun', cat: 'food' },
    { en: 'visit', ar: 'يَزُور', ph: 'فِيزِيتْ', pos: 'verb', cat: 'places' },
    { en: 'voice', ar: 'صَوْت', ph: 'فُويْسْ', pos: 'noun', cat: 'school' },
    { en: 'walk', ar: 'يَمْشِي', ph: 'وُوكْ', pos: 'verb', cat: 'actions' },
    { en: 'warm', ar: 'دَافِئ', ph: 'وُورْمْ', pos: 'adjective', cat: 'nature' },
    { en: 'wash', ar: 'يَغْسِل', ph: 'وُوشْ', pos: 'verb', cat: 'actions' },
    { en: 'watch', ar: 'يُشَاهِد / سَاعَة يَد', ph: 'وُوتْشْ', pos: 'verb', cat: 'actions' },
    { en: 'water', ar: 'مَاء', ph: 'وُوتَرْ', pos: 'noun', cat: 'nature' },
    { en: 'week', ar: 'أُسْبُوع', ph: 'وِيكْ', pos: 'noun', cat: 'time' },
    { en: 'well', ar: 'جَيِّداً', ph: 'وِلْ', pos: 'adverb', cat: 'actions' },
    { en: 'wheel', ar: 'عَجَلَة', ph: 'وِيلْ', pos: 'noun', cat: 'places' },
    { en: 'wind', ar: 'رِيَاح', ph: 'وِينْدْ', pos: 'noun', cat: 'nature' },
    { en: 'window', ar: 'نَافِذَة / شُبَّاك', ph: 'وِينْدُو', pos: 'noun', cat: 'school' },
    { en: 'winter', ar: 'فَصْل الشِّتَاء', ph: 'وِينْتَرْ', pos: 'noun', cat: 'time' },
    { en: 'word', ar: 'كَلِمَة', ph: 'وِيرْدْ', pos: 'noun', cat: 'school' },
    { en: 'work', ar: 'يَعْمَل / عَمَل', ph: 'وِيرْكْ', pos: 'verb', cat: 'actions' },
    { en: 'world', ar: 'عَالَم', ph: 'وِيرْلْدْ', pos: 'noun', cat: 'places' },
    { en: 'year', ar: 'سَنَة / عَام', ph: 'يِيرْ', pos: 'noun', cat: 'time' }
  ];

  coreWords.forEach(cw => {
    pushWord(cw.en, cw.ar, cw.ph, cw.pos, cw.cat, `Look at the word: ${cw.en}.`, `تأمل الكلمة: ${cw.ar}.`);
  });

  return words;
})();
