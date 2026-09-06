"use client";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FilterSelect } from "@/components/common/FilterSelect";
import { EmptyState } from "@/components/common/Shared";
import type { GalleryPhoto } from "@/types/community";
export function GalleryGrid({
  photos,
  preview = false,
}: {
  photos: GalleryPhoto[];
  preview?: boolean;
}) {
  const [year, setYear] = useState("all");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = photos.filter(
    (p) =>
      (year === "all" ||
        (year === "unknown" ? p.year === null : String(p.year) === year)) &&
      (category === "All" || p.category === category),
  );
  const current = filtered.findIndex((p) => p.id === selected);
  const photo = filtered[current];
  const move = (step: number) => {
    if (filtered.length)
      setSelected(
        filtered[(current + step + filtered.length) % filtered.length].id,
      );
  };
  return (
    <>
      {!preview && (
        <div className="toolbar gallery-toolbar">
          <div className="filter-group">
            <FilterSelect
              label="Celebration year"
              value={year}
              options={[
                { value: "all", label: "All years" },
                ...[2026, 2025, 2024, 2023].map((y) => ({
                  value: String(y),
                  label: String(y),
                })),
                { value: "unknown", label: "Year not recorded" },
              ]}
              onChange={setYear}
            />
            <FilterSelect
              label="Photo category"
              value={category}
              options={[
                "All",
                "Ganesh Idol",
                "Puja",
                "Decorations",
                "Cultural Programs",
                "Annadanam",
                "Laddu Auction",
                "Nimajjanam",
                "Community Moments",
              ].map((c) => ({
                value: c,
                label: c === "All" ? "All categories" : c,
              }))}
              onChange={setCategory}
            />
          </div>
          <span className="muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "memory" : "memories"}
          </span>
        </div>
      )}
      {filtered.length ? (
        <div className={"gallery-grid" + (preview ? " gallery-preview" : "")}>
          {filtered.map((p) => (
            <button
              className="gallery-item"
              key={p.id}
              onClick={() => setSelected(p.id)}
              aria-label={"Open photo: " + p.caption}
            >
              <span className="gallery-image">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 33vw"
                  style={{
                    objectPosition:
                      p.id === "community-group" ? "center 65%" : "center",
                  }}
                />
                <span className="expand-icon">
                  <Expand size={18} />
                </span>
              </span>
              <span className="gallery-caption">
                <span className="eyebrow">{p.category}</span>
                <strong>{p.caption}</strong>
                <small>{p.year ?? "Year not recorded"}</small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No celebration photos in this selection"
          description="Choose another year or category to explore our memories."
        />
      )}
      <Dialog
        open={!!photo}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="lightbox"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              move(1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              move(-1);
            }
          }}
        >
          <DialogTitle>{photo?.caption ?? "Photo preview"}</DialogTitle>
          <DialogDescription>
            {photo?.category} · {photo?.year ?? "Year not recorded"}
          </DialogDescription>
          {photo && (
            <div className="lightbox-image">
              <Image
                src={photo.image}
                alt={photo.alt}
                fill
                sizes="95vw"
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
          <div className="lightbox-controls">
            <button
              className="button secondary"
              onClick={() => move(-1)}
              aria-label="Previous photo"
            >
              <ArrowLeft size={18} /> Previous
            </button>
            <span aria-live="polite">
              {current + 1} / {filtered.length}
            </span>
            <button
              className="button secondary"
              onClick={() => move(1)}
              aria-label="Next photo"
            >
              Next <ArrowRight size={18} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
