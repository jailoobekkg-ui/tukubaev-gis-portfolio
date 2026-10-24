"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: fd.get("username"), password: fd.get("password") }),
    });
    if (res.ok) {
      window.location.href = "/admin";
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error || "Ошибка входа");
    setBusy(false);
  }

  return (
    <div className="grid-bg grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent"><Icon name="lock" /></span>
          <div>
            <h1 className="font-display text-lg font-bold">Вход в админ-панель</h1>
            <p className="text-xs text-muted">Только для владельца сайта</p>
          </div>
        </div>
        {!configured && (
          <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
            Вход не настроен. Задайте <code>ADMIN_PASSWORD_HASH</code> и <code>AUTH_SECRET</code> в файле <code>.env.local</code> (см. README) и перезапустите сервер.
          </p>
        )}
        <div>
          <label htmlFor="u" className="label">Логин</label>
          <input id="u" name="username" autoComplete="username" required className="input" />
        </div>
        <div>
          <label htmlFor="p" className="label">Пароль</label>
          <input id="p" name="password" type="password" autoComplete="current-password" required className="input" />
        </div>
        {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
        <button type="submit" disabled={busy || !configured} className="btn-primary w-full">
          {busy ? "Проверка…" : "Войти"}
        </button>
        <a href="/" className="block text-center text-xs text-muted hover:text-accent">← На сайт</a>
      </form>
    </div>
  );
}
