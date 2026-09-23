import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { sounds, stopSpeaking } from '../utils/audio';
import { 
  Star, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Bot, 
  Award,
  BookOpen,
  Users,
  BookMarked,
  Gamepad2,
  Shield,
  Square,
  LogOut
} from 'lucide-react';

interface NavigationHeaderProps {
  profile: UserProfile;
  currentRole?: UserRole;
  onOpenProfile: () => void;
  onOpenBadges: () => void;
  onOpenCertificate: () => void;
  onOpenDedication: () => void;
  onOpenTeacherHub: () => void;
  onOpenSupervisorPanel?: () => void;
  onOpenEducationalGames?: () => void;
  onSwitchAccount?: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  onReturnToMap: () => void;
  isInsideLesson: boolean;
  onOpenRewardGame?: () => void;
  onOpenOnlineStudents?: () => void;
  onOpenDictionary?: () => void;
  onOpenSendWhatsAppCertificate?: () => void;
  onlineCount?: number;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  profile,
  currentRole = 'student',
  onOpenProfile,
  onOpenBadges,
  onOpenCertificate,
  onOpenDedication,
  onOpenTeacherHub,
  onOpenSupervisorPanel,
  onOpenEducationalGames,
  onSwitchAccount,
  onToggleChat,
  isChatOpen,
  onReturnToMap,
  isInsideLesson,
  onOpenRewardGame,
  onOpenOnlineStudents,
  onOpenDictionary,
  onOpenSendWhatsAppCertificate,
  onlineCount = 1
}) => {
  const [isMuted, setIsMuted] = useState(sounds.isMuted);

  const toggleMute = () => {
    sounds.isMuted = !sounds.isMuted;
    setIsMuted(sounds.isMuted);
    if (!sounds.isMuted) {
      sounds.playClick();
    }
  };

  const handleStopAllAudio = () => {
    stopSpeaking();
    sounds.playButtonTap();
  };

  const isGirl = profile.heroType === 'girl';
  const heroBadge = currentRole === 'supervisor'
    ? 'المشرف والمطور'
    : currentRole === 'teacher'
    ? 'المعلم'
    : isGirl
    ? 'بَطَلَتُنَا الْمُجْتَهِدَةُ'
    : 'بَطَلُنَا الْمُجْتَهِدُ';

  return (
    <header 
      id="main-app-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-indigo-100 shadow-sm px-3 sm:px-4 py-2.5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        
        {/* Logo & Platform Name: الطالب المجتهد */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            id="brand-home-btn"
            onClick={() => {
              sounds.playClick();
              onReturnToMap();
            }}
            className="flex items-center gap-2 group text-right focus:outline-none"
            title="الرئيسية - منصة الطالب المجتهد"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition transform animate-bounce-subtle">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                  مَنَصَّةُ الطَّالِبِ الْمُجْتَهِدِ
                </span>
                <span className="bg-indigo-100 text-indigo-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-200">
                  صَفّ ٣ الابْتِدَائِيُّ
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold hidden sm:block">
                مَنْهَجُ جُمْهُورِيَّةِ مِصْرَ الْعَرَبِيَّةِ (رِيَاضِيَّاتٌ • إِنْجِلِيزِيٌّ • عَرَبِيٌّ)
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">

          {/* Quick Stop Audio Button */}
          <button
            onClick={handleStopAllAudio}
            className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 px-2 py-1 rounded-xl text-xs font-bold transition shadow-2xs active:scale-95"
            title="إيقاف أي صوت يعمل حالياً فوراً"
          >
            <Square className="w-3 h-3 fill-rose-600 text-rose-600" />
            <span className="hidden md:inline">إِيقَافُ الصَّوْتِ 🛑</span>
          </button>

          {/* Educational Challenge Games */}
          {onOpenEducationalGames && (
            <button
              onClick={() => {
                sounds.playButtonTap();
                onOpenEducationalGames();
              }}
              className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs px-2.5 py-1.5 rounded-2xl shadow transition transform hover:scale-105 active:scale-95"
              title="ألعاب التحدي الذكية لتقفيل النقاط"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>أَلْعَابُ التَّحَدِّي 🎮</span>
            </button>
          )}

          {/* Teacher Hub Modal Trigger */}
          {(currentRole === 'teacher' || currentRole === 'supervisor') && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenTeacherHub();
              }}
              className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs px-2.5 py-1.5 rounded-2xl shadow-xs transition active:scale-95"
              title="لوحة تحكم المعلم والفصل"
            >
              <span>👨‍🏫</span>
              <span>فَصْلُ الْمُعَلِّمِ</span>
            </button>
          )}

          {/* Teacher/Supervisor Direct WhatsApp Certificate Button */}
          {(currentRole === 'teacher' || currentRole === 'supervisor') && onOpenSendWhatsAppCertificate && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenSendWhatsAppCertificate();
              }}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-2.5 py-1.5 rounded-2xl shadow-xs transition active:scale-95"
              title="تسليم شهادة تقدير للطالب عبر الواتساب مباشرة"
            >
              <span>📱</span>
              <span className="hidden sm:inline">شَهَادَةُ وَاتْسَاب</span>
            </button>
          )}

          {/* Supervisor & Developer Panel Trigger */}
          {currentRole === 'supervisor' && onOpenSupervisorPanel && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenSupervisorPanel();
              }}
              className="flex items-center gap-1 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs px-2.5 py-1.5 rounded-2xl shadow-xs transition active:scale-95"
              title="إعدادات المشرف والمطور (الأستاذ شريف عسقلاني)"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>إِعْدَادَاتُ الْمُشْرِفِ 🛠️</span>
            </button>
          )}

          {/* Real-time Online Counter */}
          {onOpenOnlineStudents && (
            <button
              id="online-students-header-btn"
              onClick={() => {
                sounds.playClick();
                onOpenOnlineStudents();
              }}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 px-2.5 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-xs"
              title="الطلاب المتصلون أونلاين الآن"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>أَوْنْلَايْن: <strong className="text-emerald-900">{onlineCount}</strong></span>
            </button>
          )}

          {/* Reward Game Button */}
          {onOpenRewardGame && (
            <button
              onClick={() => {
                sounds.playButtonTap();
                onOpenRewardGame();
              }}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-black text-xs px-2.5 py-1.5 rounded-2xl shadow transition transform hover:scale-105 active:scale-95"
              title="لعبة جوائز تقفيل النقاط للطفل"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-950" />
              <span>لُعْبَةُ التَّقْفِيلِ 🎯</span>
            </button>
          )}

          {/* Dictionary Shortcut */}
          {onOpenDictionary && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenDictionary();
              }}
              className="hidden lg:flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs px-2.5 py-1.5 rounded-2xl transition shadow-xs"
              title="قاموس 1000 كلمة إنجليزية مترجمة مع النطق الصوتي"
            >
              <BookMarked className="w-3.5 h-3.5 text-sky-600" />
              <span>قَامُوسُ 1000 كَلِمَةٍ 📖</span>
            </button>
          )}

          {/* Stars Counter */}
          <div 
            id="user-stars-counter"
            className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-300 px-2.5 py-1 rounded-2xl shadow-xs"
            title="النجوم المحققة"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
            <span className="text-sm font-black text-amber-900">
              {profile.totalStars}
            </span>
          </div>

          {/* Digital Badges Button */}
          <button
            id="badges-header-btn"
            onClick={() => {
              sounds.playClick();
              onOpenBadges();
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs px-2.5 py-1.5 rounded-2xl shadow-sm hover:shadow transition active:scale-95"
            title="لوحة الأوسمة الرقمية"
          >
            <Award className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden sm:inline">الأَوْسِمَةُ</span>
          </button>

          {/* Certificate Button */}
          <button
            id="certificate-header-btn"
            onClick={() => {
              sounds.playClick();
              onOpenCertificate();
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-amber-950 font-black text-xs px-2.5 py-1.5 rounded-2xl shadow-sm hover:shadow transition active:scale-95"
            title="عرض شهادة الإنجاز"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-900" />
            <span className="hidden sm:inline">الشَّهَادَةُ</span>
          </button>

          {/* Dedication Button */}
          <button
            id="malek-dedication-header-btn"
            onClick={() => {
              sounds.playCheerSuccess();
              onOpenDedication();
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs px-2.5 py-1.5 rounded-2xl shadow-sm transition active:scale-95"
            title="باقة إهداء البطل مالك ورفاق الفصل"
          >
            <span>👑</span>
            <span className="hidden md:inline">الإِهْدَاءُ</span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            id="sound-toggle-btn"
            onClick={toggleMute}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* User Profile Chip */}
          <button
            id="user-profile-header-btn"
            onClick={() => {
              sounds.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 p-1 md:px-2.5 md:py-1 rounded-2xl transition"
            title="تعديل الملف الشخصي"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-200/70 flex items-center justify-center text-base">
              {profile.avatar === 'girl_hero' ? '👧' : profile.avatar === 'robot_companion' ? '🤖' : profile.avatar || '👦'}
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-800 leading-tight">
                {profile.name}
              </p>
              <p className="text-[9px] font-bold text-amber-700">
                {heroBadge}
              </p>
            </div>
          </button>

          {/* Switch Account / Logout */}
          {onSwitchAccount && (
            <button
              onClick={() => {
                sounds.playClick();
                onSwitchAccount();
              }}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition"
              title="تبديل الحساب أو تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
