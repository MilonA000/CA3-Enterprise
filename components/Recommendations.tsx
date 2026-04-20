"use client"

import { eventClusters } from "data/event_clusters"
import styles from "./Homepage.module.css" 

export default function Recommendations() {

  const recommended = eventClusters.filter(e => e.cluster === 1).slice(0, 3)

  return (
    <div className={styles.PopoutShell}>
      <div className={styles.Popout2}>
        <h2>Recommended Events</h2>
        <p>Based on event clustering using TF-IDF and k-means, here are some events you might like:</p>
        <ul>
          {recommended.map(event => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
        <p><small>ML Explanation: Events are clustered into 4 themes based on their descriptions. This uses TF-IDF to vectorize text and k-means for grouping. Fictional data of 15 events was used for training.</small></p>
      </div>
    </div>
  )
}