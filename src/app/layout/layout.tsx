"use client";
import { User } from "lucide-react"; 
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Video,
  Folder,
  Upload,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
  setSearch,
}: {
  children: React.ReactNode;
  setSearch?: (value: string) => void;
}) {

  const pathname = usePathname();
  const router = useRouter();
 
  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Documents", icon: FileText, href: "document" },
    { name: "Images", icon: ImageIcon, href: "images" },
    { name: "Media", icon: Video, href: "viau" },
    { name: "Others", icon: Folder, href: "other" },
  ];
  const [user, setUser] = useState<{ name: string, email: string } | null>(null)
 const [uploads, setUploads] = useState<
    { id: string; name: string; progress: number }[]
  >([]);
  useEffect(() => {  
    fetch("http://localhost:5000/api/auth/get", {
  method: "GET",
  credentials: "include" 
})
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null))
  }, []) 
 
 
  const handleLogout = () => {
     
    router.push("/login");
  }; 
  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";

    input.onchange = () => {
      if (!input.files?.length) return;

      const file = input.files[0];
      const uploadId = Date.now().toString();

      setUploads((prev) => [
        ...prev,
        { id: uploadId, name: file.name, progress: 0 },
      ]);

      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:5000/api/files/upload");
xhr.withCredentials = true;  
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;
        const percent = Math.round((e.loaded / e.total) * 100);

        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId ? { ...u, progress: percent } : u
          )
        );
      };
 
      xhr.onload = () => {
        if (xhr.status === 201) {
          setUploads((prev) => prev.filter((u) => u.id !== uploadId));
          window.dispatchEvent(new Event("files-updated"))
        }
      };

      xhr.send(formData);
    };

    input.click();
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F7FB] flex"> 
      <aside className="w-[260px] bg-white px-6 py-8 flex flex-col justify-between border-r">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-[#FF7A7A] mb-10">
            <div className="w-6 h-6 rounded-full bg-[#FF7A7A]" />
            InBox
          </div>

          <nav className="space-y-2 text-sm">
            {sidebarItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = pathname.endsWith(item.href);

              console.log("isaddfdf",isActive)
              return (
                <Link
                  key={i}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                    ${isActive
                      ? "bg-[#FF7A7A]/10 text-[#FF7A7A]"
                      : "text-gray-500 hover:bg-gray-100 "
                    }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="relative h-[150px] w-full my-6">
          <Image
            src="/assets/file.svg"
            alt="illustration"
            fill
            className="object-contain"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={18} className="text-gray-600" />
          </div>

          <div className="text-xs">
            <p className="font-medium text-gray-800">{user?.name || "user"}</p>
            <p className="text-gray-400">{user?.email || "email"}</p>
          </div>
        </div>
      </aside>
 
      <main className="flex-1 px-8 py-6">
  
        <div className="flex items-center justify-between mb-8">
          <input
            placeholder="Search files"
            className="w-[360px] px-5 py-3 rounded-full border bg-white outline-none text-black"
            onChange={(e) => setSearch?.(e.target.value)}
          />

          <div className="flex items-center gap-4">
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 bg-[#FF7A7A] text-white px-6 py-3 rounded-full cursor-pointer"
            >
              <Upload size={16} />
              Upload
            </button>

            <button
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border cursor-pointer"
            >
              <LogOut size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
 
        {uploads.length > 0 && (
          <div className="mb-6 bg-white rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-3">In Progress</h4>

            <div className="space-y-3">
              {uploads.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-gray-400">Uploading…</p>
                  </div>

                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF7A7A]"
                      style={{ width: `${u.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {children}
      </main>
    </div>
  );
}
