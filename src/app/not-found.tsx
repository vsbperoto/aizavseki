"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home, BookOpen, SearchX } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-purple/5 blur-[100px] animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-cyan/10 ring-1 ring-brand-cyan/20"
        >
          <SearchX className="h-10 w-10 text-brand-cyan" />
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-8xl font-bold gradient-text sm:text-9xl"
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 font-heading text-xl text-brand-white sm:text-2xl"
        >
          {"\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430\u0442\u0430 \u043D\u0435 \u0435 \u043D\u0430\u043C\u0435\u0440\u0435\u043D\u0430"}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-2 text-brand-gray max-w-md mx-auto"
        >
          {"\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430\u0442\u0430, \u043A\u043E\u044F\u0442\u043E \u0442\u044A\u0440\u0441\u0438\u0442\u0435, \u043D\u0435 \u0441\u044A\u0449\u0435\u0441\u0442\u0432\u0443\u0432\u0430 \u0438\u043B\u0438 \u0435 \u043F\u0440\u0435\u043C\u0435\u0441\u0442\u0435\u043D\u0430."}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/">
            <Button className="hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-shadow">
              <Home className="mr-2 h-4 w-4" />
              {"\u041D\u0430\u0447\u0430\u043B\u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430"}
            </Button>
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand-cyan hover:text-brand-cyan-bright transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            {"\u0420\u0430\u0437\u0433\u043B\u0435\u0434\u0430\u0439 \u0431\u043B\u043E\u0433\u0430"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
