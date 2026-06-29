"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Logo, LogoMark } from "@/components/ui/Logo";

const ADMIN_EMAIL = "admin@aguiarimoveis.com.br";
const ADMIN_PASSWORD = "Aguiar@2024";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_auth", "authenticated");
      localStorage.setItem(
        "admin_user",
        JSON.stringify({ name: "Ediel Aguiar", email, role: "admin" })
      );
      router.push("/admin");
    } else {
      setError("E-mail ou senha incorretos.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B2344] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-[#C79A3B]/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-white/3 blur-[100px]" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C79A3B]/40 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <LogoMark size={48} />
            </div>
            <h1 className="font-display font-bold text-white text-xl mb-1">
              Painel Administrativo
            </h1>
            <p className="text-white/40 text-sm">Aguiar Imóveis</p>
          </div>

          {/* Security */}
          <div className="flex items-center gap-2 bg-[#C79A3B]/10 border border-[#C79A3B]/25 rounded-xl px-3 py-2.5 mb-6">
            <ShieldCheck className="h-4 w-4 text-[#C79A3B] flex-shrink-0" />
            <p className="text-[#C79A3B]/90 text-xs font-medium">Área restrita — acesso protegido</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                <input
                  type="email"
                  placeholder="admin@aguiarimoveis.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/8 border border-white/12 text-white placeholder:text-white/25 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C79A3B]/60 focus:border-[#C79A3B]/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/8 border border-white/12 text-white placeholder:text-white/25 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C79A3B]/60 focus:border-[#C79A3B]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C79A3B] hover:bg-[#b8882d] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-200 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Entrando...</>
              ) : "Entrar no painel"}
            </button>
          </form>

          <div className="mt-6 p-3 bg-white/4 border border-white/8 rounded-xl">
            <p className="text-white/30 text-[11px] text-center">
              Login: <span className="text-white/50">admin@aguiarimoveis.com.br</span> | Senha: <span className="text-white/50">Aguiar@2024</span>
            </p>
          </div>
        </div>

        <p className="text-center text-white/30 text-sm mt-4">
          <a href="/" className="hover:text-[#C79A3B] transition-colors">← Voltar ao site</a>
        </p>
      </motion.div>
    </div>
  );
}
