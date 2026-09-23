import React from 'react';
import { UserProfile } from '../types';
import { computeUserBadges } from '../utils/badgeSystem';
import { sounds } from '../utils/audio';
import { X, Award, Printer, Star, CheckCircle, Trophy, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  if (!isOpen) return null;

  const { allProgress, unlockedBadges } = computeUserBadges(profile);

  const isGirl = profile.heroType === 'girl';
  const heroTitle = isGirl ? 'الْبَطَلَةُ الْمُبْدِعَةُ' : 'الْبَطَلُ الشُّجَاعُ';

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div 
      id="certificate-modal-root"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-stone-950/70 backdrop-blur-sm overflow-y-auto"
    >
      <div 
        id="certificate-modal-container"
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden my-auto"
      >
        {/* Modal Top Actions */}
        <div className="bg-stone-900 text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-black">شَهَادَةُ التَّمَيُّزِ وَلَوْحَةُ الأَوْسِمَةِ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 px-3 py-1.5 rounded-xl font-black text-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>طِبَاعَةُ الشَّهَادَةِ</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Printable) */}
        <div className="p-6 md:p-10 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 relative">
          
          {/* Certificate Border Design */}
          <div className="border-4 border-double border-amber-500/80 rounded-2xl p-6 md:p-8 text-center space-y-6 relative overflow-hidden bg-white shadow-inner">
            
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 right-2 text-2xl text-amber-400 select-none">❖</div>
            <div className="absolute top-2 left-2 text-2xl text-amber-400 select-none">❖</div>
            <div className="absolute bottom-2 right-2 text-2xl text-amber-400 select-none">❖</div>
            <div className="absolute bottom-2 left-2 text-2xl text-amber-400 select-none">❖</div>

            {/* Header Stamp */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full border-2 border-amber-400 text-3xl shadow-sm">
              🎖️
            </div>

            <div>
              <p className="text-xs md:text-sm font-black text-amber-700 tracking-wider">
                جُمْهُورِيَّةُ مِصْرَ الْعَرَبِيَّةِ - كِتَابُ اللُّغَةِ الْعَرَبِيَّةِ
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-stone-900 mt-1 tracking-tight">
                شَهَادَةُ تَمَيُّزٍ وَفَخْرٍ
              </h2>
              <p className="text-xs font-bold text-stone-500 mt-1">
                تُهْدَى إِلَى نَجْمِ الصَّفِّ الثَّالِثِ الابْتِدَائِيِّ
              </p>
            </div>

            {/* Recipient Name */}
            <div className="py-2">
              <p className="text-sm font-bold text-stone-600 mb-1">
                تَشْهَدُ إِدَارَةُ مَغَامَرَةِ اللُّغَةِ الْعَرَبِيَّةِ بِأَنَّ:
              </p>
              <div className="inline-block border-b-4 border-amber-500 pb-1 px-8">
                <span className="text-3xl md:text-4xl font-black text-amber-900">
                  {heroTitle} / {profile.name}
                </span>
              </div>
            </div>

            {/* Commendation Text */}
            <p className="text-sm md:text-base font-semibold text-stone-700 leading-loose max-w-xl mx-auto">
              قَدْ أَظْهَرَ عَزِيمَةً وَإِصْرَاراً فَائِقاً فِي رِحْلَتِهِ عَبْرَ وَحْدَاتِ كِتَابِ الْوَزَارَةِ الرَّسْمِيِّ 
              (الْعَمَلُ وَالأَمَلُ - صِفَاتِي الْجَمِيلَةُ - أَدَبُ بَلَدِي)، وَأَتْقَنَ قِرَاءَةَ النُّصُوصِ، وَفَهْمَ الْمُفْرَدَاتِ، 
              وَحَلَّ الأَسَالِيبَ وَالتَّرَاكِيبَ بِكُلِّ جَدَارَةٍ وَتَفَوُّقٍ.
            </p>

            {/* Stats Badges in Certificate */}
            <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
              <div className="bg-amber-50 border border-amber-300 px-4 py-2 rounded-xl text-center">
                <span className="text-[11px] font-bold text-stone-500 block">رَصِيدُ النُّجُومِ</span>
                <span className="text-xl font-black text-amber-600">{profile.totalStars} ⭐</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-xl text-center">
                <span className="text-[11px] font-bold text-stone-500 block">الدُّرُوسُ الْمُنْجَزَةُ</span>
                <span className="text-xl font-black text-emerald-700">{profile.completedLessons.length} مَحَطَّة</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t-2 border-stone-200 flex items-center justify-between text-right px-4">
              <div>
                <p className="text-xs font-bold text-stone-500">رَفِيقُكَ فِي التَّعَلُّمِ:</p>
                <p className="text-sm font-black text-purple-700">الرُّوبُوتُ الذَّكِيُّ 🤖</p>
              </div>

              <div className="text-left">
                <p className="text-xs font-bold text-stone-500">مُطَوِّرُ وَمُصَمِّمُ التَّجْرِبَةِ:</p>
                <p className="text-base font-black text-amber-800">الأُسْتَاذُ شَرِيف عَسْقَلَانِي</p>
                <p className="text-[10px] font-bold text-stone-400">خَبِيرُ الْمَنَاهِجِ وَالتَّعْلِيمِ</p>
              </div>
            </div>

          </div>

          {/* Badges Showcase (no-print or included) */}
          <div className="mt-8 space-y-3 no-print">
            <h3 className="text-base font-black text-stone-800 text-right flex items-center gap-2">
              <span>🏆</span>
              <span>أَوْسِمَةُ الأَبْطَالِ الْمُكْتَسَبَةُ وَالْمُتَاحَةُ:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allProgress.map(({ badge, isUnlocked, hintText }) => {
                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition ${
                      isUnlocked
                        ? 'border-amber-300 bg-amber-50/70'
                        : 'border-stone-200 bg-stone-50 opacity-60'
                    }`}
                  >
                    <span className="text-3xl">{badge.icon}</span>
                    <div className="text-right flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-stone-900">{badge.title}</h4>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            مُكْتَسَبٌ ✓
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-stone-500">
                            {hintText}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
