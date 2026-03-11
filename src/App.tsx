import { useState, useCallback, useRef } from 'react'
import { Upload, FileText, X, Copy, Check, AlertCircle, Folder, File, FolderOpen, Download } from 'lucide-react'
import JSZip from 'jszip'
import { Button } from './components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'

interface ExtractedFile {
  name: string
  path: string
  content: string
  size: number
  isDirectory: boolean
}

interface FileInfo {
  name: string
  size: number
  files: ExtractedFile[]
  selectedFile: ExtractedFile | null
}

export default function App() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isZipFile = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const arr = new Uint8Array(e.target?.result as ArrayBuffer)
        resolve(arr.length >= 2 && arr[0] === 0x50 && arr[1] === 0x4B)
      }
      reader.onerror = () => resolve(false)
      reader.readAsArrayBuffer(file.slice(0, 2))
    })
  }

  const extractZipContents = async (file: File): Promise<ExtractedFile[]> => {
    const zip = await JSZip.loadAsync(file)
    const files: ExtractedFile[] = []

    const promises = Object.keys(zip.files).map(async (path) => {
      const zipEntry = zip.files[path]
      const isDirectory = zipEntry.dir

      let content = ''
      let size = 0

      if (!isDirectory) {
        try {
          content = await zipEntry.async('string')
          size = content.length
        } catch {
          try {
            const uncompressedSize = (zipEntry as any)?.uncompressedSize || 0
            content = `[Binary file - ${formatFileSize(uncompressedSize)}]`
            size = uncompressedSize
          } catch {
            content = '[Unable to read file content]'
            size = 0
          }
        }
      }

      files.push({
        name: path.split('/').pop() || path,
        path: path,
        content: content,
        size: size,
        isDirectory: isDirectory
      })
    })

    await Promise.all(promises)

    return files.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1
      if (!a.isDirectory && b.isDirectory) return 1
      return a.path.localeCompare(b.path)
    })
  }

  const validateAndReadFile = useCallback(async (file: File) => {
    setError(null)
    setIsLoading(true)

    if (!file.name.toLowerCase().endsWith('.util')) {
      setError('Invalid file type. Please upload a .util file.')
      setIsLoading(false)
      return
    }

    try {
      const isZip = await isZipFile(file)

      if (isZip) {
        const extractedFiles = await extractZipContents(file)
        const textFiles = extractedFiles.filter(f => !f.isDirectory && f.content && !f.content.startsWith('[Binary'))

        setFileInfo({
          name: file.name,
          size: file.size,
          files: extractedFiles,
          selectedFile: textFiles.length > 0 ? textFiles[0] : (extractedFiles.find(f => !f.isDirectory) || null)
        })
      } else {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setFileInfo({
            name: file.name,
            size: file.size,
            files: [{
              name: file.name,
              path: file.name,
              content: content,
              size: content.length,
              isDirectory: false
            }],
            selectedFile: {
              name: file.name,
              path: file.name,
              content: content,
              size: content.length,
              isDirectory: false
            }
          })
          setIsLoading(false)
        }
        reader.onerror = () => {
          setError('Error reading file. Please try again.')
          setIsLoading(false)
        }
        reader.readAsText(file)
        return
      }
    } catch (err) {
      console.error('Error processing file:', err)
      setError('Error processing file. The file may be corrupted.')
    }

    setIsLoading(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      validateAndReadFile(files[0])
    }
  }, [validateAndReadFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      validateAndReadFile(files[0])
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [validateAndReadFile])

  const handleClear = useCallback(() => {
    setFileInfo(null)
    setError(null)
    setCopied(false)
  }, [])

  const handleDownload = useCallback(() => {
    if (fileInfo?.selectedFile?.content) {
      const blob = new Blob([fileInfo.selectedFile.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${fileInfo.selectedFile.name}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }, [fileInfo])

  const handleCopy = useCallback(async () => {
    if (fileInfo?.selectedFile?.content) {
      try {
        await navigator.clipboard.writeText(fileInfo.selectedFile.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        setError('Failed to copy to clipboard')
      }
    }
  }, [fileInfo])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleSelectFile = useCallback((file: ExtractedFile) => {
    if (!file.isDirectory) {
      setFileInfo(prev => prev ? { ...prev, selectedFile: file } : null)
      setCopied(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            .util File Viewer with ❤️ by Juan Mackie
          </h1>
          <p className="mt-2 text-zinc-400">
            Drag and drop or select a .util file to view its contents
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 transition-all">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto rounded-full p-1 transition-colors hover:bg-red-500/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {!fileInfo ? (
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300
              ${isDragging
                ? 'border-emerald-400 bg-emerald-400/10 scale-[1.02]'
                : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-800/50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".util"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              <div
                className={`
                  rounded-full p-6 transition-all duration-300
                  ${isDragging
                    ? 'bg-emerald-400/20 text-emerald-400'
                    : 'bg-zinc-800 text-zinc-400'
                  }
                `}
              >
                <Upload className={`h-10 w-10 ${isDragging ? 'animate-bounce' : ''}`} />
              </div>

              <div>
                <p className="text-lg font-medium text-white">
                  {isDragging ? 'Drop your file here' : 'Drag & drop your .util file'}
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  or click to browse your computer
                </p>
              </div>

              <Button
                variant="outline"
                className="mt-2 border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
                disabled={isLoading}
              >
                <FileText className="h-4 w-4" />
                {isLoading ? 'Loading...' : 'Select File'}
              </Button>
            </div>

            <div className="absolute -top-1 -right-1 h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400/20 to-transparent blur-2xl" />
            <div className="absolute -bottom-1 -left-1 h-20 w-20 rounded-full bg-gradient-to-br from-teal-400/20 to-transparent blur-2xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row">
            {fileInfo.files.length > 1 && (
              <Card className="border-zinc-700 bg-zinc-900/80 backdrop-blur-sm lg:w-72 shrink-0">
                <CardHeader className="border-b border-zinc-700/50 py-3">
                  <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Archive Contents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 max-h-[60vh] overflow-auto">
                  <div className="space-y-1">
                    {fileInfo.files.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectFile(file)}
                        disabled={file.isDirectory}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all
                          ${file.isDirectory
                            ? 'text-zinc-500 cursor-default'
                            : fileInfo.selectedFile?.path === file.path
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                          }
                        `}
                      >
                        {file.isDirectory ? (
                          <Folder className="h-4 w-4 shrink-0 text-zinc-500" />
                        ) : (
                          <File className="h-4 w-4 shrink-0 text-zinc-400" />
                        )}
                        <span className="truncate text-sm">{file.name}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-zinc-700 bg-zinc-900/80 backdrop-blur-sm flex-1 min-w-0">
              <CardHeader className="border-b border-zinc-700/50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-lg bg-emerald-500/20 p-2 shrink-0">
                      <FileText className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg text-white truncate">
                        {fileInfo.selectedFile?.name || fileInfo.name}
                      </CardTitle>
                      <p className="text-sm text-zinc-500">
                        {fileInfo.files.length > 1 ? (
                          <>
                            {fileInfo.name} • {formatFileSize(fileInfo.size)} • {fileInfo.files.filter(f => !f.isDirectory).length} files
                          </>
                        ) : (
                          formatFileSize(fileInfo.size)
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleClear}
                      className="bg-red-600/80 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="relative">
                  <div className="absolute right-3 top-3 z-10">
                    <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-500">
                      {fileInfo.selectedFile?.content.split('\n').length || 0} lines
                    </span>
                  </div>

                  <pre className="max-h-[60vh] min-h-[300px] overflow-auto p-6 pt-12">
                    <code className="block whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-zinc-300">
                      {fileInfo.selectedFile?.content || <span className="text-zinc-500 italic">Empty file</span>}
                    </code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-zinc-600">
          Only .util files are supported. All processing is done locally in your browser.
        </div>
      </div>
    </div>
  )
}
