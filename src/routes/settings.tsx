import CloudArrowUpIn from "@gravity-ui/icons/CloudArrowUpIn";
import LinkIcon from "@gravity-ui/icons/Link";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser, updateProfile } from "@/lib/db/functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  beforeLoad: async () => {
    const { user } = await getCurrentUser();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    return { user };
  },
  component: SettingsPage,
});

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDateForInput(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = new Date(d);
  return date.toISOString().split("T")[0];
}

function SettingsPage() {
  const { user } = Route.useRouteContext();

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [website, setWebsite] = useState(user.website ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [birthday, setBirthday] = useState(formatDateForInput(user.birthday));
  const [imageUrl, setImageUrl] = useState(user.image ?? "");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch("/api/upload/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", contentType: file.type }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to get upload URL");
      }
      const { presignedUrl, publicUrl } = await res.json();

      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("Failed to upload to S3");

      const confirmRes = await fetch("/api/upload/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm", imageUrl: publicUrl }),
      });
      if (!confirmRes.ok) throw new Error("Failed to save image URL");

      setImageUrl(publicUrl);
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleUrlSubmit() {
    if (!urlInput.trim()) return;
    setImageUrl(urlInput.trim());
    setUrlInput("");
    toast.success("Profile picture updated");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        data: {
          name,
          bio,
          website,
          location,
          birthday: birthday ? new Date(birthday) : null,
        },
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="border-border border-t">
      <div className="container-editorial py-16 md:py-24">
        <header className="mb-12 flex max-w-3xl flex-col gap-4 md:mb-16">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            Settings
          </p>
          <h1 className="display">Account Settings</h1>
          <p className="lead max-w-2xl">
            Manage your profile, avatar, and personal information.
          </p>
        </header>

        {/* Bento grid */}
        <div className="grid gap-6 md:grid-cols-6">
          {/* ── Profile picture: spans 2 cols, 2 rows ── */}
          <Card className="md:col-span-2 md:row-span-2">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <Avatar className="size-28">
                {imageUrl ? (
                  <AvatarImage className="object-cover" src={imageUrl} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Drag-and-drop zone */}
              <div
                className={cn(
                  "border-border flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                  dragActive
                    ? "border-foreground bg-muted/50"
                    : "hover:border-foreground/40 hover:bg-muted/30",
                )}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <CloudArrowUpIn className="text-muted-foreground size-8" />
                <p className="text-muted-foreground text-xs">
                  Drag &amp; drop an image here
                </p>
                <p className="text-muted-foreground text-xs">or</p>
                <input
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  type="file"
                />
                <Button
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  variant="outline"
                >
                  {uploading ? "Uploading..." : "Browse Files"}
                </Button>
                <p className="text-muted-foreground mt-1 text-[10px]">
                  JPEG, PNG, WebP, GIF — max 5 MB
                </p>
              </div>

              {/* URL input */}
              <div className="flex w-full flex-col gap-2">
                <Label className="text-xs" htmlFor="avatar-url">
                  Or paste an image URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    className="flex-1"
                    id="avatar-url"
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                    placeholder="https://example.com/photo.jpg"
                    value={urlInput}
                  />
                  <Button
                    disabled={!urlInput.trim()}
                    onClick={handleUrlSubmit}
                    size="icon"
                    variant="outline"
                  >
                    <LinkIcon className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Profile form: spans 4 cols ── */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-6" onSubmit={handleSave}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      value={name}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      onChange={(e) => setBirthday(e.target.value)}
                      type="date"
                      value={birthday}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    maxLength={160}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="A short bio about yourself"
                    value={bio}
                  />
                  <p className="text-muted-foreground text-xs">
                    {bio.length}/160 characters
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                      type="url"
                      value={website}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                      value={location}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button disabled={saving} type="submit">
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* ── Account info: spans 3 cols ── */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Username</span>
                <span className="font-medium">@{user.username ?? "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium capitalize">
                  {user.role ?? "User"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ── Member since: spans 3 cols ── */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
