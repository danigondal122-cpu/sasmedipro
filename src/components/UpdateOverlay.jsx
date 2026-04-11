// renderer/src/components/UpdateOverlay.jsx
import { useEffect, useState } from "react";

export default function UpdateOverlay() {
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [updateReady, setUpdateReady] = useState(false);
  const [show, setShow] = useState(false); // show overlay only during update



  
  useEffect(() => {
   

    window.electronAPI.checkForUpdates();
       window.electronAPI.onUpdateMessage((msg) => {
      // Only show if it's not "No updates available"
      if (!msg.toLowerCase().includes("no updates available")) {
        setMessage(msg);
        setShow(true);
      }
    });
    
    window.electronAPI.onUpdateAvailable((info) => {
      
      setMessage(`Update ${info.version} available. Downloading...`);
      setShow(true);
    });
    window.electronAPI.onDownloadProgress((p) => {
      console.log(p)
      setProgress(Math.round(p.percent));
    });
    window.electronAPI.onUpdateDownloaded(() => {
      setMessage("Update downloaded. Restarting...");
      setUpdateReady(true);
    });

     window.electronAPI.onUpdateError(() => {
      
       setMessage("An error occured while updating.");
      setShow(false);
    });


  }, []);

  const handleRestart = () => {
    window.electronAPI.installUpdate();
  };

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <p>{message}</p>
        {progress > 0 && progress < 100 && (
          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: `${progress}%` }} />
          </div>
        )}
        {updateReady && (
          <button style={styles.button} onClick={handleRestart}>
            Restart & Install
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },
  container: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    textAlign: "center",
    width: 350,
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    margin: "12px 0"
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 5,
    transition: "width 0.3s ease"
  },
  button: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#1976d2",
    color: "#fff",
    cursor: "pointer"
  }
};
