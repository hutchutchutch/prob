use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use std::collections::HashMap;
use std::io::{Read, Write};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter};
use std::thread;

// Store active terminal sessions
lazy_static::lazy_static! {
    static ref TERMINAL_SESSIONS: Arc<Mutex<HashMap<String, TerminalSession>>> = Arc::new(Mutex::new(HashMap::new()));
}

struct TerminalSession {
    writer: Box<dyn Write + Send>,
    _child: Box<dyn portable_pty::Child + Send>,
}

#[tauri::command]
pub async fn start_terminal_session(app: AppHandle, cwd: String) -> Result<String, String> {
    let session_id = uuid::Uuid::new_v4().to_string();
    
    // Create a new PTY
    let pty_system = native_pty_system();
    
    let pty_pair = pty_system.openpty(PtySize {
        rows: 24,
        cols: 80,
        pixel_width: 0,
        pixel_height: 0,
    }).map_err(|e| format!("Failed to open PTY: {}", e))?;
    
    // Get the shell command based on the OS
    let shell = if cfg!(target_os = "windows") {
        "cmd.exe".to_string()
    } else {
        std::env::var("SHELL").unwrap_or_else(|_| "/bin/bash".to_string())
    };
    
    let mut cmd = CommandBuilder::new(shell);
    cmd.cwd(&cwd);
    
    // Spawn the shell process
    let child = pty_pair.slave.spawn_command(cmd)
        .map_err(|e| format!("Failed to spawn shell: {}", e))?;
    
    // Get reader and writer
    let reader = pty_pair.master.try_clone_reader()
        .map_err(|e| format!("Failed to clone reader: {}", e))?;
    let writer = pty_pair.master.take_writer()
        .map_err(|e| format!("Failed to take writer: {}", e))?;
    
    // Store the session
    {
        let mut sessions = TERMINAL_SESSIONS.lock().unwrap();
        sessions.insert(session_id.clone(), TerminalSession {
            writer,
            _child: child,
        });
    }
    
    // Start reading output in a separate thread
    let app_handle = app.clone();
    let session_id_clone = session_id.clone();
    thread::spawn(move || {
        let mut reader = reader;
        let mut buffer = [0u8; 4096];
        
        loop {
            match reader.read(&mut buffer) {
                Ok(0) => {
                    // EOF, terminal closed
                    let _ = app_handle.emit("terminal-closed", &session_id_clone);
                    break;
                }
                Ok(n) => {
                    let output = String::from_utf8_lossy(&buffer[..n]);
                    let _ = app_handle.emit("terminal-output", output.to_string());
                }
                Err(e) => {
                    eprintln!("Error reading from terminal: {}", e);
                    let _ = app_handle.emit("terminal-error", format!("Read error: {}", e));
                    break;
                }
            }
        }
        
        // Clean up the session
        let mut sessions = TERMINAL_SESSIONS.lock().unwrap();
        sessions.remove(&session_id_clone);
    });
    
    Ok(session_id)
}

#[tauri::command]
pub async fn write_to_terminal(session_id: String, data: String) -> Result<(), String> {
    let mut sessions = TERMINAL_SESSIONS.lock().unwrap();
    
    if let Some(session) = sessions.get_mut(&session_id) {
        session.writer.write_all(data.as_bytes())
            .map_err(|e| format!("Failed to write to terminal: {}", e))?;
        session.writer.flush()
            .map_err(|e| format!("Failed to flush terminal: {}", e))?;
        Ok(())
    } else {
        Err("Terminal session not found".to_string())
    }
}

#[tauri::command]
pub async fn close_terminal_session(session_id: String) -> Result<(), String> {
    let mut sessions = TERMINAL_SESSIONS.lock().unwrap();
    
    if sessions.remove(&session_id).is_some() {
        Ok(())
    } else {
        Err("Terminal session not found".to_string())
    }
}

#[tauri::command]
pub async fn resize_terminal(_session_id: String, _cols: u16, _rows: u16) -> Result<(), String> {
    // Note: This would require storing the PTY master in the session
    // For now, this is a placeholder
    Ok(())
} 