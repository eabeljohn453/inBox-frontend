"use client";

import Image from "next/image"; import {
  MoreVertical,
  Edit3,
  Info,
  Trash,
  ArrowDownToLine,
  Link2,
  X,
} from "lucide-react";

import DashboardLayout from "../app/layout/layout.tsx";
import { useEffect, useState } from "react";

export default function ImagesPage() {
  const [images, setImages] = useState([]); 
  const [search, setSearch] = useState("");
  // preview image
  const [preview, setPreview] = useState(null);

  // menu + modals
  const [activeMenu, setActiveMenu] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [detailsFile, setDetailsFile] = useState(null);
  const [deleteFile, setDeleteFile] = useState(null);
  const [newName, setNewName] = useState("");
  const [page,setPage] = useState(1)
  useEffect(() => {
  async function fetchImages() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/files/images?page=${page}&limit=6`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
 setImages(images.map(img =>
  img._id === renameFile._id
    ? { ...img, name: newName }
    : img
));
    } catch (e) {
      console.log("error found", e);
    }
  }

  fetchImages();
}, [page]);
    useEffect(() => {
    const esc = (e) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const handleRename = async () => {
    if (!newName.trim()) return;

    try {
        const res = await fetch(
          `http://localhost:5000/api/files/${renameFile._id}/rename`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ newName }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Rename failed");
        return;
      }

      const updatedImages = images.map((img) => {
        if (img._id === renameFile._id) {
          img.name = newName;    
        }
        return img;
      });

      setImages(updatedImages);


      setRenameFile(null);
      setNewName("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };
  const handleDelete = async () => {
    try {

      const res = await fetch(`http://localhost:5000/api/files/${deleteFile._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log("error", res)
      if (!res.ok) {
        alert("Delete failed");
        return;
      }
      setImages(prev =>
        prev.filter(img => img._id !== deleteFile._id)
      )
      setDeleteFile(null)
    }
    catch (e) {
      console.log("error", e)
    }
  }
  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <DashboardLayout setSearch={setSearch}>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Images</h1>
          <p className="text-sm text-gray-400">
            Total: {images.length} files
          </p>
        </div>

        <select className="px-4 py-2 rounded-lg border bg-white text-black text-sm">
          <option>Date Created (newest)</option>
          <option>Date Created (oldest)</option>
          <option>Name (A-Z)</option>
        </select>
      </div>

      { images.length === 0 ? (
        <p className="text-gray-400">No images found</p>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img._id}
              onClick={() => setPreview({ url: img.url, name: img.name })}
              className="bg-white rounded-2xl p-5 relative cursor-pointer hover:shadow-md transition"
            >
              {/* 3 DOT MENU */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(activeMenu === img._id ? null : img._id);
                }}
                className="absolute top-4 right-4 text-gray-400 cursor-pointer"
              >
                <MoreVertical size={30} />
              </button>

              {activeMenu === img._id && (
                <div className="absolute right-4 top-10 bg-white rounded-xl shadow-xl w-48 text-sm z-50 border">

                  <button
                    onClick={() => {
                      setRenameFile(img);
                      setNewName(img.name);
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-black cursor-pointer"
                  >
                    <Edit3 size={16} className="text-black cursor-pointer" />
                    Rename
                  </button>

                  <button
                    onClick={() => {
                      setDetailsFile(img);
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-black cursor-pointer"
                  >
                    <Info size={16} className="text-black" />
                    Details
                  </button>

                  <button
                    onClick={() => window.open(img.url, "_blank")}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-black cursor-pointer"
                  >
                    <ArrowDownToLine size={16} className="text-black" />
                    Download
                  </button>

                  <button
                    onClick={() => {
                      setDeleteFile(img);
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-red-600 text-black cursor-pointer"
                  >
                    <Trash size={16} />
                    Move to Trash
                  </button>
                </div>
              )}

              {/* IMAGE */}
              <div className="w-14 h-14 rounded-full overflow-hidden mb-4">
                <Image
                  src={img.url}
                  alt={img.name}
                  width={300}
                  height={300}
                  className="object-cover"
                  unoptimized
                />
              </div>

              <p className="text-sm font-medium text-gray-800 truncate">
                {img.name}
              </p>

              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>{(img.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>
                  {img.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) }

      {/* IMAGE PREVIEW MODAL */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full mx-4 bg-black rounded-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 text-white bg-black/60 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <img
              src={preview.url}
              alt={preview.name}
              className="w-full h-[80vh] object-contain rounded-lg"
            />

            <p className="text-center text-sm text-gray-300 mt-2">
              {preview.name}
            </p>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {renameFile && (
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

      {/* DETAILS MODAL */}
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

      {/* DELETE MODAL */}
      {deleteFile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-black">
          <div className="bg-white rounded-xl p-6 w-[340px]">
            <h3 className="font-semibold mb-3">Move to Trash</h3>
            <p className="text-sm mb-6">
              Are you sure you want to move <b>{deleteFile.name}</b> to trash?
            </p>
            <div className="flex justify-end gap-3">
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-pointer" onClick={() => setDeleteFile(null)}>Cancel</button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                onClick={
                  handleDelete}
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
