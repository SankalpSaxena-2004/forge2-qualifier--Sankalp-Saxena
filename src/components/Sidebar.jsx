import React, { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ projects = [], activeProjectId, setActiveProjectId }) {
  const [agentStatus, setAgentStatus] = useState({
    status: 'available',
    text: 'Available'
  })
  const [projectsExpanded, setProjectsExpanded] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const fetchAgentStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/agent-status')
      if (!response.ok) return

      const data = await response.json()
      setAgentStatus(data)
    } catch (error) {
      console.error('Error fetching agent status:', error)
    }
  }, [])

  useEffect(() => {
    fetchAgentStatus()
    const interval = setInterval(fetchAgentStatus, 30000)
    return () => clearInterval(interval)
  }, [fetchAgentStatus])

  const handleProjectClick = (projectId) => {
    if (!projectId) return

    setActiveProjectId?.(projectId)
    localStorage.setItem('lastProjectId', projectId)
    navigate(`/projects/${projectId}`)
  }

  const isActiveTab = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const toggleProjects = () => {
    setProjectsExpanded(prev => !prev)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">🦞 Molt's Kanban</div>

      <div className="agent-status">
        <div className={`agent-status-dot ${agentStatus.status}`} />
        <span className="agent-status-text">
          {agentStatus.text}
        </span>
      </div>

      <nav className="nav-menu">
        <Link to="/" className={`nav-item ${isActiveTab('/') ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Dashboard</span>
        </Link>

        <div
          className={`nav-item ${isActiveTab('/projects') ? 'active' : ''}`}
          onClick={toggleProjects}
          role="button"
        >
          <span className="nav-icon">📁</span>
          <span className="nav-label">Projects</span>
        </div>

        {projectsExpanded && (
          <div className="nav-submenu">
            <div className="projects-list">
              {projects.length === 0 ? (
                <div className="empty-projects">No Projects</div>
              ) : (
                projects.map(project => (
                  <div
                    key={project.id}
                    className={`project-item ${
                      activeProjectId === project.id ? 'active' : ''
                    }`}
                    onClick={() => handleProjectClick(project.id)}
                    style={{ borderLeftColor: project.color }}
                  >
                    <div className="project-id">{project.id}</div>
                    <div className="project-name">{project.name}</div>
                  </div>
                ))
              )}
            </div>

            <button
              className="add-project-btn"
              onClick={() => console.log('Create project clicked')}
            >
              + New Project
            </button>
          </div>
        )}

        <Link
          to="/activities"
          className={`nav-item ${isActiveTab('/activities') ? 'active' : ''}`}
        >
          <span className="nav-icon">📜</span>
          <span className="nav-label">Activities</span>
        </Link>

        <Link
          to="/context"
          className={`nav-item ${isActiveTab('/context') ? 'active' : ''}`}
        >
          <span className="nav-icon">🧠</span>
          <span className="nav-label">Context Storage</span>
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
