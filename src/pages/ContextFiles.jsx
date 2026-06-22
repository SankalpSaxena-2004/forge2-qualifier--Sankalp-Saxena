import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './ContextFiles.css'

function ContextFiles() {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchContextFiles()
  }, [])

  const fetchContextFiles = async () => {
    try {
      const response = await fetch('/api/context-files')
      const data = await response.json()
      setFiles(data.files || [])

      // Auto-select first file
      if (data.files?.length > 0 && !selectedFile) {
        selectFile(data.files[0])
      }
    } catch (error) {
      console.error('Error fetching context files:', error)
    }
  }

  const selectFile = async (file) => {
    setSelectedFile(file)
    setIsEditing(false)
    setShowPreview(false)

    try {
      const response = await fetch(`/api/context-files/${file.name}`)
      const content = await response.text()
      setFileContent(content)
      setEditedContent(content)
    } catch (error) {
      console.error('Error loading file:', error)
      setFileContent('Error loading file')
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/context-files/${selectedFile.name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain' },
        body: editedContent
      })

      if (response.ok) {
        setFileContent(editedContent)
        setIsEditing(false)
        fetchContextFiles() // Refresh file list
      }
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'n/a'
    const kb = bytes / 1024
    return kb < 1 ? `${bytes} B` : `${kb.toFixed(1)} KB`
  }

  return (
    <div className="context-files-page">
      <div className="context-sidebar">
        <div className="context-header">
          <h2>🧠 Context Storage</h2>
          <p>Agent Configuration & Memory</p>
        </div>

        <div className="files-list">
          {files.map(file => (
            <div
              key={file.name}
              className={`file-item ${selectedFile?.name === file.name ? 'active' : ''} ${!file.exists ? 'missing' : ''}`}
              onClick={() => file.exists && selectFile(file)}
            >
              <div className="file-size">
                {file.exists ? formatFileSize(file.size) : 'not found'}
              </div>
              <div className="file-name">{file.name}</div>
              <div className="file-desc">{file.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="context-editor">
        {selectedFile && (
          <>
            <div className="editor-header">
              <div className="editor-title">
                <h3>{selectedFile.name}</h3>
                <p>{selectedFile.description}</p>
              </div>

              <div className="editor-actions">
                {!isEditing && (
                  <>
                    <button onClick={() => setShowPreview(!showPreview)}>
                      {showPreview ? '📝 Editor' : '👁️ Preview'}
                    </button>

                    <button onClick={() => setIsEditing(true)}>
                      ✏️ Edit
                    </button>
                  </>
                )}

                {isEditing && (
                  <>
                    <button onClick={() => setIsEditing(false)}>
                      ❌ Cancel
                    </button>

                    <button onClick={handleSave} className="save-btn">
                      💾 Save
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="editor-content">
              {showPreview && !isEditing ? (
                <div className="markdown-preview">
                  <ReactMarkdown>{fileContent}</ReactMarkdown>
                </div>
              ) : isEditing ? (
                <textarea
                  className="content-editor"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Edit file content..."
                />
              ) : (
                <pre className="content-viewer">{fileContent}</pre>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ContextFiles
