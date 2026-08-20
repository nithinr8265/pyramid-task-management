"use client";

import { useRef, useState } from "react";
import { FileUp, Link2, Paperclip, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface AddResourceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (resource: {
    name: string;
    url?: string;
    dataUrl?: string;
    mimeType?: string;
  }) => Promise<void> | void;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function formatUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function AddResourceModal({
  open,
  onClose,
  onSubmit,
}: AddResourceModalProps) {
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function resetForm() {
    setTitle("");
    setLinkUrl("");
    setSelectedFile(null);
    setError(null);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setError(null);
    }
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const trimmedUrl = linkUrl.trim();
    const hasFile = Boolean(selectedFile);
    const hasLink = Boolean(trimmedUrl);

    // Neither provided (Case 4)
    if (!hasFile && !hasLink) {
      setError("Please provide a file, a link, or both.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let dataUrl: string | undefined;
      let mimeType: string | undefined;

      if (selectedFile) {
        dataUrl = await readFileAsDataUrl(selectedFile);
        mimeType = selectedFile.type || "application/octet-stream";
      }

      const finalUrl = hasLink ? formatUrl(trimmedUrl) : undefined;

      // Determine default name if user didn't enter custom title
      let finalName = title.trim();
      if (!finalName) {
        if (selectedFile) {
          finalName = selectedFile.name;
        } else if (finalUrl) {
          try {
            const parsed = new URL(finalUrl);
            finalName = parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
          } catch {
            finalName = finalUrl;
          }
        } else {
          finalName = "Resource Attachment";
        }
      }

      await onSubmit({
        name: finalName,
        url: finalUrl,
        dataUrl,
        mimeType,
      });

      handleClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to add resource.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Resource or Link">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div
            role="alert"
            className="p-2.5 rounded-lg text-xs bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
          >
            {error}
          </div>
        )}

        {/* Optional Title */}
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Title / Name <span className="text-text-subtle font-normal">(optional)</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design Specs or Reference Doc"
            disabled={loading}
            className="w-full h-10 px-3 rounded-lg border border-border-strong bg-surface text-sm outline-none focus-visible:outline-2 disabled:opacity-60"
          />
        </div>

        {/* File Attachment (Optional) */}
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            File <span className="text-text-subtle font-normal">(optional)</span>
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
          {selectedFile ? (
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-muted text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <Paperclip size={16} className="text-text-subtle shrink-0" />
                <span className="truncate font-medium text-xs text-text">
                  {selectedFile.name}
                </span>
                <span className="text-[11px] text-text-subtle shrink-0">
                  ({formatFileSize(selectedFile.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={loading}
                aria-label="Remove selected file"
                className="text-text-subtle hover:text-rose-500 p-1"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full h-20 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong hover:border-text-muted bg-surface/50 text-xs text-text-muted hover:text-text transition-colors"
            >
              <FileUp size={18} className="text-text-subtle" />
              <span>Click to choose or upload a file</span>
            </button>
          )}
        </div>

        {/* Link / URL (Optional) */}
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Link / URL <span className="text-text-subtle font-normal">(optional)</span>
          </label>
          <div className="relative flex items-center">
            <Link2 size={15} className="absolute left-3 text-text-subtle pointer-events-none" />
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com or paste link"
              disabled={loading}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border-strong bg-surface text-sm outline-none focus-visible:outline-2 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="h-9 px-4 rounded-lg text-sm font-medium text-text-muted hover:bg-surface-hover disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save Resource"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
