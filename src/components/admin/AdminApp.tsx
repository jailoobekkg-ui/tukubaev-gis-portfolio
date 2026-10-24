"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { ThemeToggleStandalone } from "./ThemeToggleStandalone";
import { FieldsForm, getPath } from "./fields";
import { collections, contactFields, profileFields, type CollectionDef } from "./schemas";
import en from "@/lib/i18n/en";
import ru from "@/lib/i18n/ru";
import ky from "@/lib/i18n/ky";
import type { ContactMessage, I18n, Locale, SiteContent } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "profile" | "contacts" | CollectionDef["key"] | "translations" | "messages" | "json";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "profile", label: "Профиль и биография", icon: "user" },
  { key: "contacts", label: "Контакты", icon: "phone" },
  ...collections.map((c) => ({
    key: c.key as Tab,
    label: c.label,
    icon: { experience: "briefcase", projects: "globe", education: "graduation", certificates: "award", skills: "code", portfolio: "image", services: "compass" }[c.key],
  })),
  { key: "translations", label: "Тексты интерфейса", icon: "language" },
  { key: "messages", label: "Сообщения", icon: "inbox" },
  { key: "json", label: "JSON (эксперт)", icon: "database" },
];

const label = (v: unknown) => {
  const x = v as I18n | string | undefined;
  if (!x) return "—";
  if (typeof x === "string") return x || "—";
  return x.ru || x.en || x.ky || "—";
};

function CollectionEditor({ def, items, onChange }: { def: CollectionDef; items: Record<string, unknown>[]; onChange: (items: Record<string, unknown>[]) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const update = (i: number, v: Record<string, unknown>) => onChange(items.map((x, j) => (j === i ? v : x)));
  const move = (i: number, d: number) => {
    const next = [...items];
    const [x] = next.splice(i, 1);
    next.splice(i + d, 0, x);
    onChange(next);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">Элементов: {items.length}. Скрытые элементы не видны на сайте.</p>
        <button
          type="button"
          className="btn-primary px-3 py-2"
          onClick={() => {
            const t = def.template();
            onChange([t, ...items]);
            setOpen(String(t.id));
          }}
        >
          <Icon name="plus" className="h-4 w-4" /> Добавить
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => {
          const id = String(item.id);
          const isOpen = open === id;
          const published = Boolean(item.published);
          return (
            <li key={id} className={cn("card overflow-hidden", !published && "opacity-80")}>
              <div className="flex items-center gap-2 px-4 py-3">
                <button type="button" onClick={() => setOpen(isOpen ? null : id)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-expanded={isOpen}>
                  <Icon name="chevron-down" className={cn("h-4 w-4 shrink-0 text-muted transition", isOpen && "rotate-180")} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{label(getPath(item, def.titleKey))}</span>
                    {def.subtitle && <span className="block truncate text-xs text-muted">{def.subtitle(item)}</span>}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => update(i, { ...item, published: !published })}
                  className={cn("chip shrink-0", published ? "border-accent2/50 text-accent2" : "")}
                  title={published ? "Скрыть" : "Опубликовать"}
                >
                  <Icon name={published ? "eye" : "eye-off"} className="mr-1 h-3.5 w-3.5" /> {published ? "Опубликовано" : "Скрыто"}
                </button>
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 text-muted hover:text-fg disabled:opacity-30" aria-label="Выше"><Icon name="arrowUp" className="h-4 w-4" /></button>
                <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="rounded p-1 text-muted hover:text-fg disabled:opacity-30" aria-label="Ниже"><Icon name="arrowDown" className="h-4 w-4" /></button>
                <button
                  type="button"
                  onClick={() => confirm("Удалить этот элемент? Изменение вступит в силу после сохранения.") && onChange(items.filter((_, j) => j !== i))}
                  className="rounded p-1 text-red-400 hover:bg-red-500/10"
                  aria-label="Удалить"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-line/10 p-4 md:p-5">
                  <FieldsForm defs={def.fields} value={item} onChange={(v) => update(i, v as Record<string, unknown>)} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TranslationsEditor({ value, onChange }: { value: SiteContent["uiOverrides"]; onChange: (v: SiteContent["uiOverrides"]) => void }) {
  const [filter, setFilter] = useState("");
  const base: Record<Locale, Record<string, string>> = { en, ru, ky };
  const keys = Object.keys(en).filter((k) => {
    const q = filter.toLowerCase();
    return !q || k.includes(q) || (["en", "ru", "ky"] as Locale[]).some((l) => (value?.[l]?.[k] || base[l][k] || "").toLowerCase().includes(q));
  });
  const set = (l: Locale, k: string, v: string) => {
    const next = { en: { ...(value?.en ?? {}) }, ru: { ...(value?.ru ?? {}) }, ky: { ...(value?.ky ?? {}) } };
    if (v) next[l][k] = v;
    else delete next[l][k];
    onChange(next);
  };
  return (
    <div>
      <p className="mb-3 text-sm text-muted">Здесь можно уточнить любой текст интерфейса (меню, кнопки, заголовки). Пустое поле — используется стандартный перевод (показан серым).</p>
      <input className="input mb-4" placeholder="Поиск по ключу или тексту…" value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ul className="space-y-3">
        {keys.slice(0, 80).map((k) => (
          <li key={k} className="card p-3">
            <p className="mb-2 font-mono text-[11px] text-accent">{k}</p>
            <div className="grid gap-2 md:grid-cols-3">
              {(["en", "ru", "ky"] as Locale[]).map((l) => (
                <label key={l} className="flex items-start gap-2">
                  <span className="mt-2 w-6 font-mono text-[11px] text-muted">{l === "ky" ? "KG" : l.toUpperCase()}</span>
                  <textarea rows={2} className="input py-1.5 text-xs" placeholder={base[l][k]} value={value?.[l]?.[k] ?? ""} onChange={(e) => set(l, k, e.target.value)} />
                </label>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {keys.length > 80 && <p className="mt-3 text-xs text-muted">Показаны первые 80 — уточните поиск.</p>}
    </div>
  );
}

function Messages() {
  const [items, setItems] = useState<ContactMessage[] | null>(null);
  const load = useCallback(() => fetch("/api/admin/messages").then((r) => r.json()).then(setItems).catch(() => setItems([])), []);
  useEffect(() => {
    load();
  }, [load]);
  const patch = async (body: Record<string, unknown>) => {
    await fetch("/api/admin/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    load();
  };
  if (!items) return <p className="text-muted">Загрузка…</p>;
  if (!items.length) return <p className="text-muted">Сообщений пока нет.</p>;
  return (
    <ul className="space-y-3">
      {items.map((m) => (
        <li key={m.id} className={cn("card p-4", !m.read && "border-accent/50")}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium">
              {m.name} · <a className="text-accent hover:underline" href={`mailto:${m.email}`}>{m.email}</a>
              {m.organization && <span className="text-muted"> · {m.organization}</span>}
            </p>
            <p className="text-xs text-muted">{new Date(m.createdAt).toLocaleString()} · {m.locale?.toUpperCase()}</p>
          </div>
          {m.service && <p className="mt-1 text-xs text-accent2">{m.service}</p>}
          <p className="mt-2 whitespace-pre-wrap text-sm">{m.message}</p>
          <div className="mt-3 flex gap-3 text-xs">
            <button type="button" className="text-accent hover:underline" onClick={() => patch({ id: m.id, read: !m.read })}>{m.read ? "Отметить непрочитанным" : "Отметить прочитанным"}</button>
            <button type="button" className="text-red-400 hover:underline" onClick={() => confirm("Удалить сообщение?") && patch({ id: m.id, delete: true })}>Удалить</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function JsonEditor({ value, onApply }: { value: SiteContent; onApply: (v: SiteContent) => void }) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [err, setErr] = useState("");
  useEffect(() => setText(JSON.stringify(value, null, 2)), [value]);
  return (
    <div>
      <p className="mb-3 text-sm text-muted">Полное содержимое сайта. Изменения применяются кнопкой ниже, затем нажмите «Сохранить».</p>
      <textarea className="input min-h-[60vh] font-mono text-xs" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
      {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
      <button
        type="button"
        className="btn-ghost mt-3"
        onClick={() => {
          try {
            onApply(JSON.parse(text));
            setErr("");
          } catch (e) {
            setErr((e as Error).message);
          }
        }}
      >
        <Icon name="check" className="h-4 w-4" /> Применить JSON
      </button>
    </div>
  );
}

export default function AdminApp() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [tab, setTab] = useState<Tab>("profile");
  const [status, setStatus] = useState<{ kind: "ok" | "error" | "busy"; text: string } | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => {
        if (r.status === 401) window.location.href = "/admin/login";
        return r.json();
      })
      .then((c: SiteContent) => {
        setContent(c);
        setSaved(JSON.stringify(c));
      })
      .catch(() => setStatus({ kind: "error", text: "Не удалось загрузить содержимое" }));
  }, []);

  const dirty = useMemo(() => !!content && JSON.stringify(content) !== saved, [content, saved]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = async () => {
    if (!content) return;
    setStatus({ kind: "busy", text: "Сохранение…" });
    const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setSaved(JSON.stringify(content));
      setStatus({ kind: "ok", text: "Сохранено. Сайт обновлён." });
    } else {
      setStatus({ kind: "error", text: data.error || `Ошибка ${res.status}` });
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  if (!content) {
    return <div className="grid min-h-screen place-items-center text-muted">{status?.text ?? "Загрузка…"}</div>;
  }

  const current = TABS.find((t) => t.key === tab)!;
  const coll = collections.find((c) => c.key === tab);
  const pendingDocs = [...content.certificates, ...content.education].filter((x) => x.image && !x.imageApproved).length;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className={cn("glass border-y-0 border-l-0 lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto", navOpen ? "block" : "hidden")}>
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent"><Icon name="lock" className="h-4 w-4" /></span>
          <span className="font-display font-bold">Админ-панель</span>
        </div>
        <nav className="space-y-0.5 px-3 pb-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTab(t.key);
                setNavOpen(false);
              }}
              className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition", tab === t.key ? "bg-accent/15 text-accent" : "text-muted hover:bg-fg/5 hover:text-fg")}
            >
              <Icon name={t.icon} className="h-4 w-4" /> {t.label}
              {t.key === "certificates" && pendingDocs > 0 && <span className="ml-auto rounded-full bg-amber-500/20 px-1.5 text-[10px] text-amber-400">{pendingDocs}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="glass sticky top-0 z-20 flex flex-wrap items-center gap-3 border-x-0 border-t-0 px-4 py-3 md:px-8">
          <button type="button" className="rounded-lg p-1.5 text-muted lg:hidden" onClick={() => setNavOpen((v) => !v)} aria-label="Меню"><Icon name="menu" /></button>
          <h1 className="font-display text-lg font-semibold">{current.label}</h1>
          <div className="ml-auto flex items-center gap-2">
            {status && <span className={cn("text-xs", status.kind === "error" ? "text-red-400" : status.kind === "ok" ? "text-accent2" : "text-muted")} role="status">{status.text}</span>}
            {dirty && <span className="text-xs text-amber-400">● есть несохранённые изменения</span>}
            <a href="/en" target="_blank" rel="noopener" className="btn-ghost px-3 py-2 text-xs"><Icon name="external" className="h-4 w-4" /> Сайт</a>
            <button type="button" onClick={save} disabled={!dirty || status?.kind === "busy"} className="btn-primary px-3 py-2 text-xs"><Icon name="save" className="h-4 w-4" /> Сохранить</button>
            <ThemeToggleStandalone />
            <button type="button" onClick={logout} className="rounded-lg p-2 text-muted hover:text-red-400" aria-label="Выйти" title="Выйти"><Icon name="logout" /></button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl p-4 md:p-8">
          {tab === "certificates" && pendingDocs > 0 && (
            <div className="mb-5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
              Документов ожидают проверки: <strong>{pendingDocs}</strong>. Откройте каждый сертификат (и диплом в разделе «Образование»), проверьте скан и отметьте
              «Изображение проверено и одобрено». До этого посетители видят только описание без скана.
            </div>
          )}
          {tab === "profile" && (
            <div className="card p-5 md:p-6">
              <FieldsForm defs={profileFields} value={content.profile} onChange={(v) => setContent({ ...content, profile: v as SiteContent["profile"] })} />
            </div>
          )}
          {tab === "contacts" && (
            <div className="card p-5 md:p-6">
              <p className="mb-4 text-sm text-muted">Пустые поля на сайте не показываются. Не указывайте паспортные данные и домашний адрес.</p>
              <FieldsForm defs={contactFields} value={content.contacts} onChange={(v) => setContent({ ...content, contacts: v as SiteContent["contacts"] })} />
            </div>
          )}
          {coll && (
            <CollectionEditor
              def={coll}
              items={content[coll.key] as unknown as Record<string, unknown>[]}
              onChange={(items) => setContent({ ...content, [coll.key]: items } as SiteContent)}
            />
          )}
          {tab === "translations" && <TranslationsEditor value={content.uiOverrides} onChange={(v) => setContent({ ...content, uiOverrides: v })} />}
          {tab === "messages" && <Messages />}
          {tab === "json" && <JsonEditor value={content} onApply={(v) => setContent(v)} />}
        </main>
      </div>
    </div>
  );
}
