import React, { useEffect, useState } from 'react'
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from 'react-icons/fi';
import { useRef } from 'react';

export default function Imageuploader({ label,register,setValue,viewData = null}){

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSource, setPreviewSource] = useState(
        viewData!==null ? viewData  : ""
    )
    const inputRef = useRef(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
          previewFile(file)
          setSelectedFile(file)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 
          { "image/*": [".jpeg", ".jpg", ".png"] },
        
        onDrop,
    });

    const previewFile = (file) => {
        // console.log(file)
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          setPreviewSource(reader.result)
        }
    }

    useEffect(() => {
        register("Media")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [register])

    useEffect(() => {
        setValue("Media", selectedFile)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFile, setValue])
    

  return (
    <div className="flex h-[240px] flex-col items-center space-y-2">
    <label className="pt-2 text-sm font-medium text-slate-700" htmlFor="Media">
      {label} 
    </label>
    <div
      className={`${
        isDragActive ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50"
      } flex w-[150px] cursor-pointer items-center justify-center rounded-full border-2 border-dashed transition hover:border-brand-400`}
    >
      {previewSource ? (
        <div className="flex h-[150px] w-[150px] flex-col p-1">
          {(
            <img
              src={previewSource}
              alt="Preview"
              className="aspect-square h-[150px] w-[150px] rounded-full object-cover"
            />
          )}
          {!viewData && (
            <button
              type="button"
              onClick={() => {
                setPreviewSource("")
                setSelectedFile(null)
                setValue("Media", null)
              }}
              className="mt-3 text-sm font-medium text-rose-600 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      ) : (
        <div
          className="flex h-[150px] max-w-[150px] flex-col items-center justify-center p-4"
          {...getRootProps()}
        >
          <input {...getInputProps()} ref={inputRef} />
          <div className="grid aspect-square w-10 place-items-center rounded-full bg-brand-100">
            <FiUploadCloud className="text-2xl text-brand-600" />
          </div>
          <p className="mt-2 max-w-[200px] text-center text-xs text-slate-500">
            Drag and drop an image or click to{" "}
            <span className="font-semibold text-brand-600">Browse</span> a
            file
          </p>
          
        </div>
      )}
    </div>
  
  </div>
  )
}
