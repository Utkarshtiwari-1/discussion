import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"


import "video-react/dist/video-react.css"
import { Player } from "video-react"

export default function Upload({
  
  label,
  register,
  setValue,
  
  video = false,
  viewData = null,
  editData = null,
}) {

  
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData!==null ? viewData : editData!==null ? editData : ""
  )
  const inputRef = useRef(null)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  })

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
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-slate-700" htmlFor="Media">
        {label} 
      </label>
      <div
        className={`${
          isDragActive ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed transition hover:border-brand-400 hover:bg-brand-50/50`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
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
            className="flex w-full flex-col items-center p-6"
            {...getRootProps()}
          >
            <input {...getInputProps()} ref={inputRef} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-brand-100">
              <FiUploadCloud className="text-2xl text-brand-600" />
            </div>
            <p className="mt-3 max-w-[220px] text-center text-sm text-slate-500">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-brand-600">Browse</span> a
              file
            </p>
            <ul className="mt-6 flex list-disc justify-between space-x-10 text-center text-xs text-slate-400">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
    
    </div>
  )
}
