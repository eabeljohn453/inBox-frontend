import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Video,
  Folder,
  Upload,
  LogOut,
  MoreVertical,
  FileQuestion,
} from "lucide-react";

export default function OthersPage() {
  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Documents", icon: FileText },
    { name: "Images", icon: ImageIcon },
    { name: "Media", icon: Video },
    { name: "Others", icon: Folder, active: true },
  ];

  const otherFiles = [
    { name: "App School.cc", size: "2 GB" },
    { name: "BC company.dd", size: "2 GB" },
    { name: "Because i love you.txt", size: "15 MB" },
    { name: "CompanyANV.dd", size: "2 GB" },
    { name: "company ABC.dd", size: "6 MB" },
    { name: "My CV.df", size: "2 GB" },
    { name: "My Jobs.co", size: "2 GB" },
    { name: "Photoshop.cc", size: "2 GB" },
    { name: "Pig Pig Pig.co", size: "2 GB" },
    { name: "system.dd", size: "2 GB" },
    { name: "school.dd", size: "15 MB" },
    { name: "Water.dd", size: "2 GB" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F5F7FB] flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[260px] bg-white px-6 py-8 flex flex-col justify-between border-r">

        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 text-lg font-semibold text-[#FF7A7A] mb-10">
            <div className="w-6 h-6 rounded-full bg-[#FF7A7A]" />
                InBox
          </div>

          {/* Navigation */}
          <nav className="space-y-2 text-sm">
            {sidebarItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                  ${
                    item.active
                      ? "bg-[#FF7A7A] text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Illustration */}
        <div className="relative h-[150px] w-full my-6">
          <Image
            src="/assets/file.svg"
            alt="illustration"
            fill
            className="object-contain"
          />
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div className="text-xs">
            <p className="font-medium text-gray-800">Adrian JSM</p>
            <p className="text-gray-400">adrian@jsmastery.pro</p>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 px-8 py-6">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-8">
          <input
            placeholder="Search files"
            className="w-[360px] px-5 py-3 rounded-full border bg-white outline-none"
          />

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[#FF7A7A] text-white px-6 py-3 rounded-full">
              <Upload size={16} />
              Upload
            </button>

            <button
              title="Sign out"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border"
            >
              <LogOut size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Others
            </h1>
            <p className="text-sm text-gray-400">
              Total: 12GB
            </p>
          </div>

          <select className="px-4 py-2 rounded-lg border bg-white text-sm">
            <option>Date Created (newest)</option>
            <option>Date Created (oldest)</option>
            <option>Name (A-Z)</option>
          </select>
        </div>

        {/* OTHERS GRID */}
        <div className="grid grid-cols-4 gap-6">
          {otherFiles.map((file, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 relative"
            >
              <button className="absolute top-4 right-4 text-gray-400">
                <MoreVertical size={16} />
              </button>

              {/* OTHERS ICON (Lucide) */}
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <FileQuestion size={24} className="text-indigo-500" />
              </div>

              <p className="text-sm font-medium text-gray-800 truncate">
                {file.name}
              </p>

              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>{file.size}</span>
                <span>10:09pm, 10 Oct</span>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
