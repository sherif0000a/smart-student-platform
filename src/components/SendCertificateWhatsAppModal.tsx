import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  X, 
  Phone, 
  UserCheck, 
  Star, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  MessageSquare,
  ShieldCheck,
  Download,
  Share2,
  FileImage,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SendCertificateWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: UserProfile[];
  teacherName?: string;
  initialStudentId?: string;
}

export const SendCertificateWhatsAppModal: React.FC<SendCertificateWhatsAppModalProps> = ({
  isOpen,
  onClose,
  students,
  teacherName = 'الأستاذ شريف عسقلاني (01080997505)',
  initialStudentId
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || (students[0]?.id || '')
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const [phone, setPhone] = useState<string>(selectedStudent?.parentPhone || '01080997505');
  const [certificateCategory, setCertificateCategory] = useState<string>('math');
  const [customNote, setCustomNote] = useState<string>(
    'أَحْسَنْتَ التَّفَوُّقَ وَأَتْمَمْتَ كَافَّةَ تَدْرِيبَاتِ الْمَنْهَجِ بِجَدَارَةٍ وَامْتِيَازٍ!'
  );
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);

  // Sync phone when student changes
  useEffect(() => {
    if (selectedStudent) {
      setPhone(selectedStudent.parentPhone || '01080997505');
    }
  }, [selectedStudentId, selectedStudent]);

  const categories = [
    { id: 'math', title: 'بَطَلُ عَبَاقِرَةِ الرِّيَاضِيَّاتِ وَالسَّاعَةِ وَجَدْوَلِ الضَّرْبِ', icon: '🧮' },
    { id: 'all', title: 'وِسَامُ التَّقْفِيلِ وَالتَّفَوُّقِ الْعَامِّ فِي كَافَّةِ الْمَوَادِّ', icon: '🌟' },
    { id: 'arabic', title: 'فَارِسُ اللُّغَةِ الْعَرَبِيَّةِ وَالأَنَاشِيدِ وَالنَّحْوِ', icon: '📖' },
    { id: 'english', title: 'نَجْمُ التَّمَيُّزِ فِي مَنْهَجِ Connect 3 وَالْقَامُوسِ', icon: '🔤' },
    { id: 'ideal', title: 'وِسَامُ الطَّالِبِ الْمِثَالِيِّ وَالْمُوَاظِبِ عَلَى الْمُذَاكَرَةِ', icon: '👑' }
  ];

  const currentCategoryObj = categories.find(c => c.id === certificateCategory) || categories[0];

  // Draw 5-pointed star helper for Canvas
  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#B45309';
    ctx.stroke();
  };

  // High-Resolution 1500 x 1020 Canvas Certificate Generator (Print-Ready 300 DPI layout)
  const generateCertificateBlob = async (): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1500;
    canvas.height = 1020;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Royal Parchment Background
    const bgGradient = ctx.createLinearGradient(0, 0, 1500, 1020);
    bgGradient.addColorStop(0, '#FFFDF8');
    bgGradient.addColorStop(0.5, '#FFFBF2');
    bgGradient.addColorStop(1, '#FFF5E4');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1500, 1020);

    // Decorative background pattern
    ctx.save();
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.25;
    for (let i = 40; i < 1500; i += 60) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1020);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Heavy Royal Gold Triple Border Frame
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#D4AF37'; // Royal Gold
    ctx.strokeRect(36, 36, 1428, 948);

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#996515';
    ctx.strokeRect(58, 58, 1384, 904);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FBBF24';
    ctx.strokeRect(68, 68, 1364, 884);

    // Corner rosettes
    const drawRosette = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#D4AF37';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#78350F';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#FEF3C7';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#B45309';
      ctx.fill();
      ctx.restore();
    };
    drawRosette(68, 68);
    drawRosette(1432, 68);
    drawRosette(68, 952);
    drawRosette(1432, 952);

    // 3. Header Texts
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';

    // Ministry of Education Line
    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 24px "Cairo", "Tajawal", "Noto Naskh Arabic", sans-serif';
    ctx.fillText('جُمْهُورِيَّةُ مِصْرَ الْعَرَبِيَّةِ • وِزَارَةُ التَّرْبِيَةِ وَالتَّعْلِيمِ', 750, 125);

    ctx.font = '600 20px "Cairo", "Tajawal", sans-serif';
    ctx.fillStyle = '#92400E';
    ctx.fillText('مَنَصَّةُ الطَّالِبِ الْمُجْتَهِدِ التَّعْلِيمِيَّةُ الْمُعْتَمَدَةُ - مَنْهَجُ الصَّفِّ الثَّالِثِ الابْتِدَائِيِّ', 750, 160);

    // Golden Ribbon Banner for Certificate Title
    const ribbonY = 205;
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(320, ribbonY, 860, 80);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#D97706';
    ctx.strokeRect(320, ribbonY, 860, 80);

    ctx.fillStyle = '#9A3412';
    ctx.font = '900 46px "Cairo", "Amiri", "Tahoma", sans-serif';
    ctx.fillText('🏆 شَهَادَةُ شُكْرٍ وَتَقْدِيرٍ وَامْتِيَازٍ 🏆', 750, ribbonY + 56);

    // Awarded Subtitle
    const isGirl = selectedStudent?.heroType === 'girl';
    ctx.fillStyle = '#451A03';
    ctx.font = 'bold 26px "Cairo", sans-serif';
    ctx.fillText(
      isGirl
        ? 'تَسُرُّ إِدَارَةُ الْمَنَصَّةِ بِالتَّعَاوُنِ مَعَ مُعَلِّمِ الْمَادَّةِ أَنْ تَمْنَحَ هَذِهِ الشَّهَادَةَ لِلْبَطَلَةِ الْمُتَفَوِّقَةِ:'
        : 'تَسُرُّ إِدَارَةُ الْمَنَصَّةِ بِالتَّعَاوُنِ مَعَ مُعَلِّمِ الْمَادَّةِ أَنْ تَمْنَحَ هَذِهِ الشَّهَادَةَ لِلْبَطَلِ الْمُتَفَوِّقِ:',
      750,
      335
    );

    // Student Name Box (Cartouche)
    const studentName = selectedStudent?.name || 'مَالِك';
    ctx.save();
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(280, 365, 940, 95);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#F59E0B';
    ctx.strokeRect(280, 365, 940, 95);

    // Inner cartouche line
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#D97706';
    ctx.strokeRect(286, 371, 928, 83);

    // Student Name in Calligraphic Bold
    ctx.fillStyle = '#78350F';
    ctx.font = '900 52px "Cairo", "Amiri", sans-serif';
    ctx.fillText(studentName, 750, 432);
    ctx.restore();

    // Award Category Title
    ctx.fillStyle = '#B45309';
    ctx.font = '900 30px "Cairo", sans-serif';
    ctx.fillText(`وِسَامُ الاسْتِحْقَاقِ: ${currentCategoryObj.title}`, 750, 515);

    // Golden Stars Display (Drawn on canvas)
    const starsCount = selectedStudent?.totalStars || 120;
    const starSpacing = 42;
    const startX = 750 - (2 * starSpacing);
    for (let s = 0; s < 5; s++) {
      drawStar(ctx, startX + s * starSpacing, 565, 5, 16, 7);
    }

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 24px "Cairo", sans-serif';
    ctx.fillText(`رَصِيدُ النُّجُومِ الْمُكْتَسَبَةِ: (${starsCount} نَجْمَةً ذَهَبِيَّةً)`, 750, 615);

    // Teacher's Custom Note
    ctx.fillStyle = '#1C1917';
    ctx.font = 'italic bold 26px "Cairo", "Amiri", serif';
    ctx.fillText(`«${customNote}»`, 750, 680);

    // Encouraging Words
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 22px "Cairo", sans-serif';
    ctx.fillText('نَفْخَرُ بِكَ دَائِماً وَنَتَمَنَّى لَكَ دَوَامَ التَّفَوُّقِ وَالصَّدَارَةِ فِي جَمِيعِ الْمَوَادِّ!', 750, 735);

    // Separator line
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 780);
    ctx.lineTo(1320, 780);
    ctx.stroke();

    // 4. Footer Accreditation & Signatures
    const todayDate = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    ctx.textAlign = 'right';
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 22px "Cairo", sans-serif';
    ctx.fillText(`تَارِيخُ الاعْتِمَادِ: ${todayDate}`, 1300, 830);
    ctx.font = '600 18px "Cairo", sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('الْخَتْمُ الرَّسْمِيُّ: وِحْدَةُ التَّطْوِيرِ التَّعْلِيمِيِّ', 1300, 868);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1E3A8A';
    ctx.font = '900 24px "Cairo", sans-serif';
    ctx.fillText(`إِشْرَافُ وَاعْتِمَادُ: ${teacherName}`, 200, 830);
    ctx.font = 'bold 18px "Cairo", sans-serif';
    ctx.fillStyle = '#059669';
    ctx.fillText('شَهَادَةٌ مُوَثَّقَةٌ جَاهِزَةٌ لِلطِّبَاعَةِ وَالتَّعْلِيقِ 🖨️', 200, 868);

    // Circular Gold Seal Stamp on Center-Bottom
    ctx.save();
    ctx.translate(750, 855);
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#B45309';
    ctx.stroke();

    // Inner dashed ring
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#78350F';
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#78350F';
    ctx.font = '900 14px "Cairo", sans-serif';
    ctx.fillText('مُعْتَمَدٌ رَسْمِيّاً', 0, -10);
    ctx.fillText('★ امْتِيَازٌ ★', 0, 12);
    ctx.fillText('2026', 0, 32);
    ctx.restore();

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  // Pre-generate image URL whenever student or category changes
  useEffect(() => {
    let active = true;
    generateCertificateBlob().then((blob) => {
      if (active && blob) {
        const url = URL.createObjectURL(blob);
        setGeneratedImageUrl(url);
      }
    });
    return () => {
      active = false;
    };
  }, [selectedStudentId, certificateCategory, customNote]);

  // Clean WhatsApp text (guaranteed no broken characters or '?')
  const formatWhatsAppText = () => {
    const studentName = selectedStudent?.name || 'البطل';
    const isGirl = selectedStudent?.heroType === 'girl';
    const stars = selectedStudent?.totalStars || 120;
    const studentGrade = selectedStudent?.grade || 'الصف الثالث الابتدائي';

    return `🎓 *شَهَادَةُ تَقْدِيرٍ وَامْتِيَازٍ رَسْمِيَّةٌ* 🌟
----------------------------------------
✨ *مَنَصَّةُ الطَّالِبِ الْمُجْتَهِدِ التَّعْلِيمِيَّةُ* ✨
تحت إشراف وتطوير: *${teacherName}* 👨‍🏫

يَسُرُّ إِدَارَةَ الْمَنَصَّةِ أَنْ تَمْنَحَ:
🎖️ ${isGirl ? 'الْبَطَلَةَ الْمُتَفَوِّقَةَ' : 'الْبَطَلَ الْمُتَفَوِّقَ'}: *${studentName}*
🏫 المرحلة: *${studentGrade}*
🏆 الوسام المستحق: *${currentCategoryObj.title}*
⭐ رصيد النجوم المكتسبة: *${stars} نَجْمَةً ذَهَبِيَّةً*

💬 *كَلِمَةُ الْمُعَلِّمِ:*
«${customNote}»

📸 *صُورَةُ الشَّهَادَةِ الْمُعْتَمَدَةِ جَاهِزَةٌ لِلطِّبَاعَةِ الْمُبَاشَرَةِ!*
(تَمَّ إِرْسَالُ مِلَفِّ الصُّورَةِ عَالِيَةِ الدِّقَّةِ لِحِفْظِهَا وَطِبَاعَتِهَا فَوْراً)

نَفْخَرُ بِكَ دَائِماً وَنَتَمَنَّى لَكَ دَوَامَ التَّفَوُّقِ وَالصَّدَارَةِ! 🚀
رابط المنصة: https://al-talib-al-mujtahid.web.app`;
  };

  // High-Quality Direct Image Printing (Hidden iframe method without UI clutter)
  const handlePrintCertificateImage = async () => {
    sounds.playClick();
    const blob = await generateCertificateBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    iframe.contentWindow?.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <title>شهادة تقدير - ${selectedStudent?.name || 'الطالب'}</title>
        <style>
          @page { size: landscape; margin: 0; }
          body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
          img { width: 100vw; height: 100vh; object-fit: contain; }
        </style>
      </head>
      <body>
        <img src="${url}" onload="setTimeout(() => { window.print(); }, 250);" />
      </body>
      </html>
    `);
    iframe.contentWindow?.document.close();

    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      URL.revokeObjectURL(url);
    }, 60000);
  };

  // Download high-res PNG image
  const handleDownloadImage = async () => {
    sounds.playCheerSuccess();
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}

    const blob = await generateCertificateBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shahada-${selectedStudent?.name || 'student'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy Image to Clipboard (So teacher can just Ctrl+V in WhatsApp Web!)
  const handleCopyImageToClipboard = async () => {
    sounds.playButtonTap();
    setIsGeneratingImage(true);
    try {
      const blob = await generateCertificateBlob();
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedImage(true);
        sounds.playCheerSuccess();
        setTimeout(() => setCopiedImage(false), 3000);
      } else {
        handleDownloadImage();
      }
    } catch (err) {
      console.warn('Clipboard image write notice:', err);
      handleDownloadImage();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Direct Mobile Share (Attaches image directly to WhatsApp on phones)
  const handleShareImageMobile = async () => {
    sounds.playFanfare();
    try {
      const blob = await generateCertificateBlob();
      if (!blob) return;

      const file = new File([blob], `shahada-${selectedStudent?.name || 'student'}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'شَهَادَةُ تَقْدِيرٍ وَامْتِيَازٍ',
          text: formatWhatsAppText()
        });
      } else {
        handleSendWhatsApp();
        handleDownloadImage();
      }
    } catch (e) {
      console.warn('Share notice:', e);
      handleSendWhatsApp();
    }
  };

  const handleSendWhatsApp = () => {
    sounds.playFanfare();
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch {}

    const rawNumber = phone.replace(/[^0-9]/g, '');
    let finalPhone = rawNumber;
    if (finalPhone.startsWith('01') && finalPhone.length === 11) {
      finalPhone = `2${finalPhone}`;
    }

    const message = formatWhatsAppText();
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${finalPhone}?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleCopyText = () => {
    sounds.playButtonTap();
    navigator.clipboard.writeText(formatWhatsAppText());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 w-full max-w-2xl overflow-hidden max-h-[94vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 p-4 sm:p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner">
                🏆
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full inline-block mb-0.5">
                  خَاصٌّ بِالْمُعَلِّمِ وَالْمُشْرِفِ
                </span>
                <h3 className="text-base sm:text-lg font-black leading-tight">
                  تَسْلِيمُ شَهَادَةِ تَقْدِيرٍ صُورَةً قَابِلَةً لِلطِّبَاعَةِ وَالْوَاتْسَابِ 📱
                </h3>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-right">
            
            {/* Student Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>اخْتَرِ الطَّالِبَ الْمُسَجَّلَ الْمُرَادَ تَكْرِيمُهُ:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {students.map((st) => {
                  const isSelected = (selectedStudent?.id === st.id) || (selectedStudent?.name === st.name);
                  return (
                    <button
                      key={st.id || st.name}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSelectedStudentId(st.id || st.name);
                      }}
                      className={`p-2.5 rounded-2xl border-2 transition text-right flex items-center gap-2 ${
                        isSelected
                          ? 'bg-amber-100/90 border-amber-500 shadow-xs'
                          : 'bg-stone-50 border-stone-200 hover:bg-amber-50/50'
                      }`}
                    >
                      <span className="text-2xl">{st.avatar || (st.heroType === 'girl' ? '👧' : '👦')}</span>
                      <div className="overflow-hidden">
                        <h4 className="font-black text-xs text-stone-900 truncate">{st.name}</h4>
                        <span className="text-[10px] text-amber-800 font-bold block">{st.totalStars} ⭐</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parent WhatsApp Number */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 space-y-2">
              <label className="text-xs font-black text-emerald-950 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>رَقْمُ وَاتْسَابِ وَلِيِّ الأَمْرِ / الطَّالِبِ:</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  يُمْكِنُ التَّعْدِيلُ أَوْ كِتَابَةُ رَقْمٍ جَدِيدٍ
                </span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01080997505"
                  className="w-full bg-white border-2 border-emerald-400 rounded-xl py-2 px-3 text-stone-900 font-bold text-sm tracking-wider focus:outline-hidden focus:border-emerald-600 shadow-inner"
                />
              </div>
              <p className="text-[10px] text-emerald-800 font-semibold">
                💡 الرَّقَمُ يُحْفَظُ لِإِرْسَالِ التَّقَارِيرِ وَالشَّهَادَاتِ لِلْوَلِيِّ بِضَغْطَةِ زِرٍّ وَاحِدَةٍ دُونَ عَنَاءٍ.
              </p>
            </div>

            {/* Certificate Occasion Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-stone-800">
                اخْتَرْ نَوْعَ الشَّهَادَةِ أَوْ الْوِسَامَ الْمَمْنُوحَ:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCertificateCategory(cat.id);
                    }}
                    className={`p-2.5 rounded-xl border-2 text-right text-xs font-bold transition flex items-center gap-2 ${
                      certificateCategory === cat.id
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Teacher's Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>رِسَالَةُ وَكَلِمَةُ الْمُعَلِّمِ فِي الشَّهَادَةِ:</span>
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                rows={2}
                className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl p-2.5 text-xs font-bold text-stone-900 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            {/* Visual Live Certificate Preview - High Definition Royal Design */}
            <div className="relative group bg-gradient-to-b from-[#FFFDF7] via-[#FFFBF0] to-[#FFF7E6] border-4 border-amber-400 rounded-3xl p-5 shadow-lg text-center overflow-hidden">
              <div className="absolute top-2 left-2 text-2xl opacity-40">✨</div>
              <div className="absolute bottom-2 right-2 text-2xl opacity-40">🎖️</div>

              {/* Quick zoom preview button */}
              <button
                type="button"
                onClick={() => setShowFullPreview(true)}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-stone-700 px-2.5 py-1 rounded-xl text-[11px] font-black border border-stone-300 shadow-xs flex items-center gap-1 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>مُعَايَنَةٌ كَبِيرَةٌ</span>
              </button>
              
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-900 flex items-center justify-center text-3xl shadow-inner mb-2 border-2 border-amber-600">
                🏆
              </div>

              <span className="text-[11px] font-black text-amber-800 tracking-wider">
                جُمْهُورِيَّةُ مِصْرَ الْعَرَبِيَّةِ • وِزَارَةُ التَّرْبِيَةِ وَالتَّعْلِيمِ
              </span>
              <h4 className="text-base sm:text-lg font-black text-amber-950 uppercase tracking-widest mt-0.5">
                شَهَادَةُ شُكْرٍ وَتَقْدِيرٍ وَامْتِيَازٍ رَسْمِيَّةٌ
              </h4>
              <p className="text-[11px] text-amber-800 font-bold">
                مَنَصَّةُ الطَّالِبِ الْمُجْتَهِدِ • الصَّفُّ الثَّالِثُ الابْتِدَائِيُّ
              </p>

              <div className="my-3 py-3 border-y-2 border-dashed border-amber-300 bg-amber-50/60 rounded-2xl">
                <p className="text-xs text-stone-700 font-bold mb-1">تُمْنَحُ بِفَخْرٍ وَاعْتِزَازٍ لِلْبَطَلِ / الْبَطَلَةِ:</p>
                <h2 className="text-2xl font-black text-amber-950 flex items-center justify-center gap-2">
                  <span>{selectedStudent?.name || 'مَالِك'}</span>
                  <span className="text-xl">{selectedStudent?.avatar || '🦁'}</span>
                </h2>
                <p className="text-xs font-black text-amber-900 mt-1.5">
                  {currentCategoryObj.title}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-amber-200/90 text-amber-950 font-black text-xs px-3.5 py-1 rounded-full mt-2 border border-amber-400">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                  <span>رَصِيدُ النُّجُومِ: {selectedStudent?.totalStars || 120} نَجْمَةً ذَهَبِيَّةً</span>
                </div>
              </div>

              <p className="text-xs font-bold text-stone-800 italic max-w-md mx-auto my-2">
                «{customNote}»
              </p>

              <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between text-[11px] text-amber-950 font-bold">
                <span>تَارِيخُ الاعْتِمَادِ: {new Date().toLocaleDateString('ar-EG')}</span>
                <span className="flex items-center gap-1 font-black">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>مُعَلِّمُ الْفَصْلِ: {teacherName}</span>
                </span>
              </div>
            </div>

            {/* Power Actions: Image Download, Copy Image, Share, WhatsApp, Print */}
            <div className="pt-2 space-y-2.5">
              
              {/* Primary Image Sending / Download Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="py-3 px-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-2xl font-black text-xs shadow-md transition transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>تَحْمِيلُ صُورَةِ الشَّهَادَةِ (PNG عَالِيَةُ الدِّقَّةِ) 🖼️</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyImageToClipboard}
                  disabled={isGeneratingImage}
                  className="py-3 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs shadow-md transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {copiedImage ? <Check className="w-4 h-4 text-emerald-300" /> : <FileImage className="w-4 h-4" />}
                  <span>{copiedImage ? 'تَمَّ نَسْخُ الصُّورَةِ! الصَقْهَا فِي الْوَاتْس (Ctrl+V) 👍' : 'نَسْخُ صُورَةِ الشَّهَادَةِ لِلْحَافِظَةِ 📋'}</span>
                </button>
              </div>

              {/* Mobile Direct Share / WhatsApp button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleShareImageMobile}
                  className="py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مُشَارَكَةُ الصُّورَةِ مُبَاشَرَةً عَلَى الْوَاتْسَابِ 📱</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 border-2 border-emerald-400 rounded-2xl font-black text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>فَتْحُ مُحَادَثَةِ الْوَاتْسَابِ بِالنَّصِّ الْمُنَسَّقِ 💬</span>
                </button>
              </div>

              {/* Secondary Utility Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs border border-stone-300 transition flex items-center justify-center gap-1.5"
                >
                  {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedText ? 'تَمَّ نَسْخُ النَّصِّ!' : 'نَسْخُ نَصِّ الرِّسَالَةِ'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintCertificateImage}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs border border-stone-300 transition flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-stone-700" />
                  <span>طِبَاعَةُ صُورَةِ الشَّهَادَةِ فَوْراً 🖨️</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>

      {/* Fullscreen High-Res Image Preview Modal */}
      {showFullPreview && generatedImageUrl && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-white rounded-3xl p-4 shadow-2xl flex flex-col max-h-[95vh]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-black text-sm text-stone-900">
                  مُعَايَنَةُ صُورَةِ الشَّهَادَةِ الْمُعْتَمَدَةِ (بِدِقَّةِ الطِّبَاعَةِ الْفَائِقَةِ)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowFullPreview(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-auto flex items-center justify-center">
              <img
                src={generatedImageUrl}
                alt="شهادة تقدير"
                className="max-h-[65vh] w-auto rounded-xl shadow-lg border border-amber-300 object-contain"
              />
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handlePrintCertificateImage}
                className="py-2.5 px-4 bg-stone-800 hover:bg-black text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>طِبَاعَةٌ مُبَاشَرَةٌ 🖨️</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadImage}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>تَحْمِيلُ الصُّورَةِ 🖼️</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFullPreview(false)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
              >
                إِغْلاقٌ
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
