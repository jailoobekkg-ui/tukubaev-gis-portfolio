"use client";

import { useId, useState } from "react";
import Icon from "@/components/Icon";
import type { I18n, I18nList, MapSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "bool"
  | "i18n"
  | "i18nArea"
  | "i18nList"
  | "list"
  | "image"
  | "images"
  | "select"
  | "multiselect"
  | "map";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: { value: string; label: string }[];
};

const LANGS: { key: keyof I18n; label: string }[] = [
  { key: "en", label: "EN" },
  { key: "ru", label: "RU" },
  { key: "ky", label: "KG" },
];

export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
  return data.url as string;
}

function UploadButton({ onUploaded, accept, multiple, label = "Загрузить" }: { onUploaded: (urls: string[]) => void; accept?: string; multiple?: boolean; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <span className="inline-flex flex-col">
      <label className={cn("btn-ghost cursor-pointer px-3 py-1.5 text-xs", busy && "opacity-60")}>
        <Icon name="upload" className="h-4 w-4" /> {busy ? "Загрузка…" : label}
        <input
          type="file"
          className="sr-only"
          accept={accept ?? ".jpg,.jpeg,.png,.webp,.gif,.pdf"}
          multiple={multiple}
          disabled={busy}
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (!files.length) return;
            setBusy(true);
            setErr("");
            try {
              const urls: string[] = [];
              for (const f of files) urls.push(await uploadFile(f));
              onUploaded(urls);
            } catch (x) {
              setErr((x as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      {err && <span className="mt-1 text-xs text-red-400">{err}</span>}
    </span>
  );
}

const emptyI18n = (): I18n => ({ en: "", ru: "", ky: "" });
const emptyI18nList = (): I18nList => ({ en: [], ru: [], ky: [] });

export function FieldEditor({ def, value, onChange }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const id = useId();
  const head = (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <label htmlFor={id} className="text-xs font-semibold text-fg/80">{def.label}</label>
      {def.help && <span className="text-[11px] text-muted">{def.help}</span>}
    </div>
  );

  switch (def.type) {
    case "text":
      return <div>{head}<input id={id} className="input" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} /></div>;
    case "textarea":
      return <div>{head}<textarea id={id} className="input min-h-[90px]" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} /></div>;
    case "number":
      return <div>{head}<input id={id} type="number" className="input" value={(value as number) ?? 0} onChange={(e) => onChange(Number(e.target.value))} /></div>;
    case "bool":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--accent))]" />
          {def.label}
          {def.help && <span className="text-[11px] text-muted">— {def.help}</span>}
        </label>
      );
    case "select":
      return (
        <div>{head}
          <select id={id} className="input" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">—</option>
            {def.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      );
    case "multiselect": {
      const arr = (value as string[]) ?? [];
      return (
        <div>{head}
          <div className="flex flex-wrap gap-1.5">
            {def.options?.map((o) => {
              const on = arr.includes(o.value);
              return (
                <button key={o.value} type="button" onClick={() => onChange(on ? arr.filter((x) => x !== o.value) : [...arr, o.value])} className={cn("chip", on && "chip-active")}>
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    case "i18n":
    case "i18nArea": {
      const v = (value as I18n) ?? emptyI18n();
      return (
        <div>{head}
          <div className="space-y-1.5">
            {LANGS.map((l) => (
              <div key={l.key} className="flex gap-2">
                <span className="mt-2 w-7 shrink-0 font-mono text-[11px] text-accent">{l.label}</span>
                {def.type === "i18n" ? (
                  <input id={l.key === "en" ? id : undefined} className="input py-2" value={v[l.key] ?? ""} onChange={(e) => onChange({ ...v, [l.key]: e.target.value })} />
                ) : (
                  <textarea id={l.key === "en" ? id : undefined} className="input min-h-[110px]" value={v[l.key] ?? ""} onChange={(e) => onChange({ ...v, [l.key]: e.target.value })} />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "i18nList": {
      const v = (value as I18nList) ?? emptyI18nList();
      return (
        <div>{head}
          <p className="mb-1.5 text-[11px] text-muted">Один пункт — одна строка.</p>
          <div className="space-y-1.5">
            {LANGS.map((l) => (
              <div key={l.key} className="flex gap-2">
                <span className="mt-2 w-7 shrink-0 font-mono text-[11px] text-accent">{l.label}</span>
                <textarea
                  className="input min-h-[90px]"
                  value={(v[l.key] ?? []).join("\n")}
                  onChange={(e) => onChange({ ...v, [l.key]: e.target.value.split("\n") })}
                  onBlur={(e) => onChange({ ...v, [l.key]: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "list": {
      const arr = (value as string[]) ?? [];
      return (
        <div>{head}
          <input id={id} className="input" value={arr.join(", ")} onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trimStart()))} onBlur={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
          <p className="mt-1 text-[11px] text-muted">Через запятую.</p>
        </div>
      );
    }
    case "image": {
      const src = (value as string) ?? "";
      return (
        <div>{head}
          <div className="flex flex-wrap items-center gap-3">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="h-20 w-28 rounded-lg border border-line/20 object-cover" />
            ) : (
              <span className="grid h-20 w-28 place-items-center rounded-lg border border-dashed border-line/30 text-xs text-muted">нет</span>
            )}
            <UploadButton onUploaded={(u) => onChange(u[0])} />
            {src && <button type="button" className="text-xs text-red-400 hover:underline" onClick={() => onChange("")}>Убрать</button>}
          </div>
          <input className="input mt-2 py-1.5 text-xs" value={src} onChange={(e) => onChange(e.target.value)} placeholder="/api/media/u/…" aria-label={`${def.label} URL`} />
        </div>
      );
    }
    case "images": {
      const arr = (value as string[]) ?? [];
      const move = (i: number, d: number) => {
        const next = [...arr];
        const [x] = next.splice(i, 1);
        next.splice(i + d, 0, x);
        onChange(next);
      };
      return (
        <div>{head}
          <div className="flex flex-wrap gap-3">
            {arr.map((src, i) => (
              <div key={src + i} className="relative">
                {src.toLowerCase().endsWith(".pdf") ? (
                  <span className="grid h-20 w-28 place-items-center rounded-lg border border-line/20 text-xs">PDF</span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="h-20 w-28 rounded-lg border border-line/20 object-cover" />
                )}
                <div className="mt-1 flex justify-center gap-1">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-0.5 text-muted hover:text-fg disabled:opacity-30" aria-label="Влево"><Icon name="chevron-left" className="h-4 w-4" /></button>
                  <button type="button" onClick={() => onChange(arr.filter((_, j) => j !== i))} className="rounded p-0.5 text-red-400" aria-label="Удалить"><Icon name="trash" className="h-4 w-4" /></button>
                  <button type="button" disabled={i === arr.length - 1} onClick={() => move(i, 1)} className="rounded p-0.5 text-muted hover:text-fg disabled:opacity-30" aria-label="Вправо"><Icon name="chevron-right" className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
            <UploadButton multiple onUploaded={(u) => onChange([...arr, ...u])} label="Добавить" />
          </div>
        </div>
      );
    }
    case "map": {
      const v = (value as MapSettings) ?? {};
      return (
        <div>{head}
          <input id={id} className="input py-2" placeholder="/maps/…-{lang}/index.html — {lang} заменяется на en / ru / ky" value={v.embedUrl ?? ""} onChange={(e) => onChange({ ...v, embedUrl: e.target.value })} />
          <p className="mt-1 text-[11px] text-muted">
            Готовая веб-карта (например, экспорт qgis2web в папке public/maps). Пусто — блок карты на странице не показывается. Не публикуйте служебные или ограниченные геоданные.
          </p>
        </div>
      );
    }
  }
}

export function getPath(obj: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}

export function setPath<T>(obj: T, key: string, value: unknown): T {
  const [head, ...rest] = key.split(".");
  const src = (obj ?? {}) as Record<string, unknown>;
  return { ...src, [head]: rest.length ? setPath(src[head], rest.join("."), value) : value } as T;
}

export function FieldsForm({ defs, value, onChange }: { defs: FieldDef[]; value: unknown; onChange: (v: unknown) => void }) {
  return (
    <div className="grid gap-5">
      {defs.map((d) => (
        <FieldEditor key={d.key} def={d} value={getPath(value, d.key)} onChange={(v) => onChange(setPath(value, d.key, v))} />
      ))}
    </div>
  );
}
