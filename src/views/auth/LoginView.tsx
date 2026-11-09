import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLogin: (username: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('adimin');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = username.trim();

    if (!trimmedUser) {
      setErrorMsg('请输入账号');
      return;
    }
    if (!password) {
      setErrorMsg('请输入密码');
      return;
    }

    // Strictly enforce password and account
    if (password !== 'admin123') {
      setErrorMsg('密码错误，仅支持指定密码登录');
      return;
    }

    if (trimmedUser !== 'adimin' && trimmedUser !== 'admin') {
      setErrorMsg('账号错误，请输入指定的运维账号 (adimin)');
      return;
    }

    setIsLoading(true);
    // Simulate instantaneous verification
    setTimeout(() => {
      setIsLoading(false);
      onLogin(trimmedUser);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 lg:p-8 font-sans select-none">
      {/* Main Container: Split 2-Column Layout */}
      <div className="w-full max-w-5xl h-[580px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch">
        
        {/* Left Side: Login Form Window */}
        <div className="w-full md:w-[420px] lg:w-[440px] shrink-0 p-8 lg:p-10 flex flex-col justify-between bg-slate-900 z-10">
          <div>
            {/* Platform Branding */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950/40">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-100 tracking-tight leading-none">
                  全息数据基础设施管理平台
                </h1>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  DataOps Holographic Infrastructure Console
                </p>
              </div>
            </div>

            {/* Login Title */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-100">系统登录</h2>
              <p className="text-xs text-slate-400 mt-1">请输入运维账号与登录密码进入系统</p>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form: Only Account & Password as requested */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  账号
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="请输入账号"
                    autoComplete="username"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-cyan-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="请输入密码"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-cyan-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-950/50 cursor-pointer"
              >
                <span>{isLoading ? '正在验证...' : '登录'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
            全息数据系统运维专网 · 安全访问控制
          </div>
        </div>

        {/* Right Side: Relevant Data Center & Holographic Infrastructure Image */}
        <div className="hidden md:block flex-1 relative bg-slate-950 overflow-hidden">
          <img
            src="/src/assets/images/login_datacenter_visual_1794019785659.jpg"
            alt="智能算力数据中心基础设施"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-700"
            onError={(e) => {
              // Resilient fallback in case of image load delay
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Subtle overlay gradient to blend with left border */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
          
          {/* Right Bottom Caption */}
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800/70 backdrop-blur-md text-xs">
            <div className="flex items-center justify-between text-slate-200 font-semibold mb-1">
              <span>全息智算与高密数据中心集群</span>
              <span className="font-mono text-[11px] text-cyan-400">STATUS: ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              实时承载高带宽 RoCEv2 网络 Fabric、PB级湖仓存储阵列与大规模分布式容器编排系统。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
