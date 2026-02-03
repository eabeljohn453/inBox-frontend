"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  MoreVertical,
  Edit3,
  Info,
  ArrowDownToLine,
  Trash,
  FileQuestion,
} from "lucide-react";

import DashboardLayout from "../app/layout/layout.tsx";

export default function OthersPage() {
  const [files, setFiles] = useState([]);
  const [preview,setPreview]=useState(null)
  const [activeMenu, setActiveMenu] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [newName, setNewName] = useState("");
  const [detailsFile, setDetailsFile] = useState(null);
  const [deleteFile, setDeleteFile] = useState(null);
 
  useEffect(() => { 
    async function fetchOthers() {
      try {
        const res = await fetch("http://localhost:5000/api/files/other", {
          credentials:"include"
        });
        console.log("erssdsdsfsrfraaf",res)
        const data = await res.json();
        console.log("ddddddaaaaaaaaaaaaata",data)
     setFiles(Array.isArray(data) ? data : data.files || []);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    }

    fetchOthers();
  }, []);
 
  const handleRename = async () => {
    if (!newName.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/files/${renameFile._id}/rename`,
        {
          method: "PATCH",
          credentials:"include",
          body: JSON.stringify({ newName }),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Rename failed");

      setFiles((prev) =>
        prev.map((f) =>
          f._id === renameFile._id ? { ...f, name: newName } : f
        )
      );

      setRenameFile(null);
      setNewName("");
    } catch (e) {
      console.error("Rename error:", e);
    }
  };
  console.log("fileeeeeeeee",files)
  return (
    <DashboardLayout> 
    
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Others</h1>
          <p className="text-sm text-gray-400">Total files: {files.length}</p>
        </div>
      </div>
 
      <div className="grid grid-cols-4 gap-6 ">
         {files.length === 0 ? (
          <p className="text-gray-400">No files found</p>
        ) : (
          files.map((file) => (
            <div key={file._id} className="bg-white rounded-2xl p-5 relative cursor-pointer"  onClick={()=>{   setPreview(file)}}>
               
              <button
              
                onClick={(e) => {
                  e.stopPropagation();
                  
                
                  setActiveMenu(activeMenu === file._id ? null : file._id);
                }}
                className="absolute top-4 right-4 text-gray-400 cursor-pointer"
              >
                <MoreVertical size={30} />
              </button>
 
              {activeMenu === file._id && (
                <div className="absolute right-4 top-10 bg-white rounded-xl shadow-xl w-48 text-sm z-50 border ">
                  <button
                    onClick={() => {
                      setRenameFile(file);
                      setNewName(file.name);
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-black cursor-pointer"
                  >
                    <Edit3 size={16} /> Rename
                  </button>

                  <button
                    onClick={() => {
                      setDetailsFile(file);
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-black cursor-pointer"
                  >
                    <Info size={16} /> Details
                  </button>

                  <button
                    onClick={() => window.open(file.url, "_blank")}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-black cursor-pointer"
                  >
                    <ArrowDownToLine size={16} /> Download
                  </button>

                  <button
                    onClick={() => {
                      setDeleteFile(file);
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-red-600 cursor-pointer "
                  >
                    <Trash size={16} /> Move to Trash
                  </button>
                </div>
              )}

              {/* ICON */}
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <FileQuestion size={26} className="text-indigo-500" />
              </div>

              {/* NAME */}
              <p className="text-sm font-medium text-gray-800 truncate">
                {file.name}
              </p>

              {/* META */}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>{file.size} MB</span>
                <span>{new Date(file.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )} 
{preview &&  (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={() => setPreview(null)}
  >
    <div
      className="relative max-w-5xl max-h-[90vh] w-full mx-4 bg-black rounded-xl p-4"
      onClick={(e) => e.stopPropagation()}
    > 
      <button
        onClick={() => setPreview(null)}
        className="absolute top-3 right-3 text-white bg-black/60 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
      >
        ✕
      </button>
 
   <iframe
  src={preview.url.replace("/upload/", "/upload/fl_attachment:false/")}
  className="w-full h-[80vh] rounded-lg bg-white"
  title="PDF Preview"
/>


 
      <p className="text-center text-sm text-gray-300 mt-2">
        {preview.name}
      </p>
    </div>
  </div>
)}

      </div> 
      {renameFile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[320px]">
            <h3 className="font-semibold mb-4 text-black">Rename</h3>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4 text-black"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRenameFile(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="bg-[#FF7A7A] text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )} 
      {detailsFile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[340px]">
            <h3 className="font-semibold mb-4">Details</h3>
            <p className="text-sm">
              <b>Name:</b> {detailsFile.name}
            </p>
            <p className="text-sm">
              <b>Size:</b>{" "}
              {(detailsFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-sm">
              <b>Date:</b>{" "}
              {new Date(detailsFile.date).toLocaleString()}
            </p>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setDetailsFile(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
