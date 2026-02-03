"use client";

import {
  ArrowDownToLine,
  Edit3,
  Info,
  MoreVertical,
  Play,
  Trash,
} from "lucide-react";
import DashboardLayout from "../app/layout/layout.tsx";
import { useEffect, useState } from "react";

export default function MediaPage() {
  const [activeMenu,setActiveMenu]=useState("")
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null); // 🎥 video preview
  const [newName,setNewName]=useState("")
  const [renameFile,setRenameFile]=useState("")
  const [deleteFile,setDeleteFile]=useState("")
  const [detailsFile,setDetailsFile]=useState("") 
  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch("http://localhost:5000/api/files/videos", {
          method:"GET",
          credentials:"include"
        });
        const data = await res.json();
        console.log("API RESPONSE 👉", Array.isArray(data) ? data : []);
        setMedia(Array.isArray(data) ? data : []);
      } catch (e) {
        console.log("error", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, []);
 const handleRename=async()=>{
  try{ 
    const res=await fetch(
        `http://localhost:5000/api/files/${renameFile._id}/rename`,{
          method:"PATCH",
          credentials:"include",
          body:JSON.stringify({newName})
      
        })
        const data=res.json()
        if(!res.ok){
           alert(data.message || "Rename failed");
        return;
        }
            setMedia(prev =>
      prev.map(file =>
        file._id === renameFile._id
          ? { ...file, name: newName }
          : file
      )
    );
 `` 
      setRenameFile(null)
      setNewName("")
  }
  catch(e){
    console.log("error occured",e)
  }
 }
  // ESC to close
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Media</h1>
          <p className="text-sm text-gray-400">
            Total: {media.length} files
          </p>
        </div>

        <select className="px-4 py-2 rounded-lg border bg-white text-sm">
          <option>Date Created (newest)</option>
          <option>Date Created (oldest)</option>
          <option>Name (A-Z)</option>
        </select>
      </div>  
    {console.log("media",media)}
      {/* MEDIA GRID */}
 
        <div className="grid grid-cols-4 gap-6">
          {media.map((file) => (
            <div
              key={file._id}
              onClick={() => 
                setPreview({ url: file.url, name: file.name })
              }
              className="bg-white rounded-2xl p-5 relative cursor-pointer hover:shadow-md transition"
            >
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(activeMenu === file._id ? null : file._id);
                }}   className="absolute top-4 right-4 text-gray-400 cursor-pointer"
              >
                <MoreVertical size={30} />
              </button>

                {activeMenu === file._id && (
                <div className="absolute right-4 top-10 bg-white rounded-xl shadow-xl w-48 text-sm z-50 border">

                  <button
                    onClick={() => {
                      setRenameFile(file);
                      setNewName(file.name);
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-black cursor-pointer"
                  >
                    <Edit3 size={16} className="text-black cursor-pointer" />
                    Rename
                  </button>

                  <button
                    onClick={() => {
                      setDetailsFile(file);
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-black cursor-pointer"
                  >
                    <Info size={16} className="text-black" />
                    Details
                  </button>

                  <button
                    onClick={() => window.open(file.url, "_blank")}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-black cursor-pointer"
                  >
                    <ArrowDownToLine size={16} className="text-black" />
                    Download
                  </button>

                  <button
                    onClick={() => {
                      setDeleteFile(file);
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-red-600 text-black cursor-pointer"
                  >
                    <Trash size={16} />
                    Move to Trash
                  </button>
                </div>
              )}
              

              {/* ICON */}
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-rose-100">
                <Play size={22} className="text-rose-500" />
              </div>

              <p className="text-sm font-medium text-gray-800 truncate">
                {file.name}
              </p>

              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>{(file.size / 1024 / 1024).toFixed(2)}  MB</span>
                <span>
                  {file.date}
                </span>
              </div>
            </div>
          ))}
        </div>
    

      {/* 🎥 VIDEO PREVIEW MODAL */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-4 bg-black rounded-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setPreview(null)}
               className="absolute top-3 right-3 text-white bg-black/60 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-black/30"
      >
              ✕
            </button>

            {/* Video */}
            <video
              src={preview.url}
              controls
              autoPlay
              className="w-full max-h-[80vh] rounded-lg"
            />

            <p className="text-center text-sm text-gray-300 mt-2">
              {preview.name}
            </p>
          </div>
        </div>
      )}  {renameFile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-black">
          <div className="bg-white rounded-xl p-6 w-[320px]">
            <h3 className="font-semibold mb-4">Rename</h3>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-black/40" onClick={() => setRenameFile(null)}>Cancel</button>
              <button
                className="bg-[#FF7A7A] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red/40"
                onClick={handleRename}
                
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
 {detailsFile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-black">
          <div className="bg-white rounded-xl p-6 w-[340px]">
            <h3 className="font-semibold mb-4">Details</h3>
            <p className="text-sm"><b>Name:</b> {detailsFile.name}</p>
            <p className="text-sm"><b>Size:</b> {(detailsFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p className="text-sm"><b>Date:</b> {detailsFile.date}</p>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-black/40" onClick={() => setDetailsFile(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
