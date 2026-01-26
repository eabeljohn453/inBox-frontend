"use client"
import {
  FileText,
  Image as ImageIcon,
  Video,
  PieChartIcon,
} from "lucide-react";
import DashboardLayout from "../app/layout/layout.tsx";
import { useState, useEffect } from "react";
export default function DashboardPage() {
  const [recent, setRecent] = useState([])
  const [storage, setStorage] = useState(
    {
      total: 0, used: 0, usedPercentage: 0
    }
  )
  const [documents, setDocuments] = useState({
    date: 0, files: 0
  })
  const [images, setImages] = useState({
    date: 0, files: 0
  })
  const [viau, setViau] = useState({
    date: 0, files: 0
  })
  const [others, setOthers] = useState({
    date: 0, files: 0
  })
  const [loading, setLoading] = useState(true)
 const fetchDetail = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      setDocuments(data.documents ?? { date: "-", files: 0 });
      setImages(data.images ?? { date: "-", files: 0 });
      setViau(data.viau ?? { date: "-", files: 0 });
      setOthers(data.others ?? { date: "-", files: 0 });
      setRecent(data.recent ?? []);
      setStorage(
        data.storage ?? { total: 0, used: 0, usedPercentage: 0 }
      );
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    const refresh=()=>fetchDetail()
    window.addEventListener("files-updated",refresh)
    return()=>(window.addEventListener("files-updated",refresh))
  }, []);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[100vh]  bg-white gap-3">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading files...</p>
      </div>
    );
  }const getFileCategory = (name) => {
  const ext = name.split(".").pop()?.toLowerCase();

  if (!ext) return "other";

  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "webm", "mov", "avi"].includes(ext)) return "video";
  if (["pdf", "doc", "docx", "txt", "ppt", "pptx", "xls", "xlsx"].includes(ext))
    return "document";

  return "other";
};

  return (
    <DashboardLayout>
      <div className="grid grid-cols-[2fr_1fr] gap-6">

        <div className="space-y-6">

          {loading ? (<p className="text-sm text-black opacity-80">Loading storage...</p>) : (

            <div className="bg-[#FF7A7A] rounded-2xl p-6 text-white flex justify-between items-center mb-20">

              <div>
                <p className="text-sm opacity-80">Available Storage</p>
                <h3 className="text-xl font-semibold mt-1">
                  {storage.used.toFixed(2)}GB / {storage.total}GB

                </h3>
              </div>

              <div className="w-24 h-24 rounded-full border-8 border-white/40 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-semibold">  {storage.usedPercentage.toFixed(1)}%</p>
                  <p className="text-xs opacity-80">Space used</p>
                </div>
              </div>
            </div>)}


          <div className="grid grid-cols-2 gap-6   gap-10">

            {/* DOCUMENTS */}
            <div className="bg-white rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center absolute -top-6 left-6 bg-red-100">
                <FileText size={20} className="text-red-500" />
              </div>

              <div className="pt-6  ">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-800">Documents</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {documents.files} files
                  </p>
                </div>

                <div className="my-3 border-t border-gray-100" />
                <p className="text-xs text-gray-400">Last update</p>
                <p className="text-xs text-gray-500 mt-1">{documents.date}</p>
              </div>
            </div>

            {/* IMAGES */}
            <div className="bg-white rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center absolute -top-6 left-6 bg-blue-100">
                <ImageIcon size={20} className="text-blue-500" />
              </div>

              <div className="pt-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-800">Images</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {images.files} files
                  </p>
                </div>

                <div className="my-3 border-t border-gray-100" />
                <p className="text-xs text-gray-400">Last update</p>
                <p className="text-xs text-gray-500 mt-1">{images.date}</p>
              </div>
            </div> 
            {/* VIDEO / AUDIO */}
            <div className="bg-white rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center absolute -top-6 left-6 bg-emerald-100">
                <Video size={20} className="text-emerald-500" />
              </div>

              <div className="pt-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-800">Video / Audio</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {viau.files} files
                  </p>
                </div>

                <div className="my-3 border-t border-gray-100" />
                <p className="text-xs text-gray-400">Last update</p>
                <p className="text-xs text-gray-500 mt-1">{viau.date}</p>
              </div>
            </div>

            {/* OTHERS */}
            <div className="bg-white rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center absolute -top-6 left-6 bg-purple-100">
                <PieChartIcon size={20} className="text-purple-500" />
              </div>

              <div className="pt-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-800">Others</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {others.files} files
                  </p>
                </div>

                <div className="my-3 border-t border-gray-100" />
                <p className="text-xs text-gray-400">Last update</p>
                <p className="text-xs text-gray-500 mt-1">{others.date}</p>
              </div>
            </div>

          </div>


        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-white rounded-2xl p-6">
          <h4 className="font-semibold text-gray-800 mb-6">
            Recent files uploaded
          </h4>
          {recent.length === 0 ? (<p className="text-black">no upload</p>) : (
            <ul className="space-y-4 text-sm">
              {recent.map((file) => (
                <li key={file.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
  {(() => {
    const type = getFileCategory(file.name);

    if (type === "image") {
        return <ImageIcon size={16} className="text-blue-500" />;
    }

    if (type === "video") {
      return <Video size={16} className="text-emerald-500" />;
    }

    if (type === "document") {
      return <FileText size={16} className="text-red-500" />;
    }

    return <PieChartIcon size={16} className="text-purple-500" />;
  })()}
</div>

                    <div>
                      <p className="text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {file.date}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400">⋮</span>
                </li>
              ))}
            </ul>)}
        </div>

      </div></DashboardLayout>
  );
}
