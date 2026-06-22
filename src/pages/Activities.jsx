import React, { useState, useEffect } from 'react'
import './Activities.css'

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activity')
      const data = await response.json()
      setActivities(data.activities || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })}`
    } else {
      return date.toLocaleString('en-US')
    }
  }

  if (loading) {
    return <div className="activities-loading">Loading activities...</div>
  }

  return (
    <div className="activities-page">
      <div className="activities-header">
        <h1>📜 Activities</h1>
        <p>Chronological overview of all project activities</p>
      </div>

      <div className="activities-timeline">
        {activities.length === 0 ? (
          <div className="no-activities">No activities available</div>
        ) : (
          activities.map((activity, index) => (
            <div key={activity.id || index} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-date">
                    {formatDate(activity.timestamp)}
                  </span>
                  <span className={`timeline-status ${activity.status}`}>
                    {activity.status}
                  </span>
                </div>

                <div className="timeline-body">
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>

                  {activity.metadata && (
                    <div className="timeline-meta">
                      {activity.metadata.projectName && (
                        <span className="meta-tag">
                          📁 {activity.metadata.projectName}
                        </span>
                      )}

                      {activity.metadata.taskCount && (
                        <span className="meta-tag">
                          📋 {activity.metadata.taskCount} Tasks
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Activities
