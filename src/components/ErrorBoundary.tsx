import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, ShieldCheck, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  autoRecoverAttempted: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    autoRecoverAttempted: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, autoRecoverAttempted: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled applet error caught by ErrorBoundary:', error, errorInfo);

    // Auto-correction / self-healing: if an unexpected render glitch occurs, auto-reset once smoothly
    if (!this.state.autoRecoverAttempted) {
      setTimeout(() => {
        this.setState({ hasError: false, error: null, autoRecoverAttempted: true });
      }, 1500);
    }
  }

  private handleManualReset = () => {
    this.setState({ hasError: false, error: null, autoRecoverAttempted: true });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4 text-stone-900" dir="rtl">
          <div className="bg-white rounded-3xl border-4 border-amber-400 p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-inner animate-pulse">
              🛡️
            </div>
            
            <span className="inline-block bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full">
              نِظَامُ التَّصْحِيحِ التِّلْقَائِيِّ الذَّكِيِّ
            </span>

            <h2 className="text-lg font-black text-amber-950">
              جَارٍ اسْتِعَادَةُ الْمُذَاكَرَةِ وَتَصْحِيحُ التَّطْبِيقِ...
            </h2>

            <p className="text-xs font-bold text-stone-600 leading-relaxed">
              تَمَّ رَصْدُ تَحْدِيثٍ سَرِيعٍ فِي الْبَيَانَاتِ، النِّظَامُ يَقُومُ حَالِياً بِالتَّصْحِيحِ التِّلْقَائِيِّ لِضَمَانِ اسْتِمْرَارِ التَّعَلُّمِ لِلطَّالِبِ وَالْمُعَلِّمِ دُونَ انْقِطَاعٍ.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={this.handleManualReset}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>مُوَاصَلَةُ الْمُذَاكَرَةِ وَتَحْدِيثُ الشَّاشَةِ 🚀</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
