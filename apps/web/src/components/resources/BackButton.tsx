"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="text-sm text-brand-gray/60 hover:text-brand-cyan transition-colors flex items-center gap-3 group"
        >
            <div className="w-9 h-9 rounded-full border border-brand-white/10 bg-brand-navy/40 backdrop-blur-md flex items-center justify-center group-hover:border-brand-cyan/30 group-hover:bg-brand-cyan/10 group-hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all duration-300">
                <ArrowLeft className="w-4 h-4 text-brand-gray group-hover:text-brand-cyan transition-colors" />
            </div>
            <span className="font-semibold tracking-wide">Обратно</span>
        </button>
    );
}
