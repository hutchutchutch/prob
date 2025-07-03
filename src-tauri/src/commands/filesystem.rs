use std::env;

#[tauri::command]
pub fn get_platform() -> String {
    env::consts::OS.to_string()
}

#[tauri::command]
pub async fn open_terminal(directory: String) -> Result<(), String> {
    use std::process::Command;
    
    let platform = env::consts::OS;
    
    let result = match platform {
        "macos" => {
            Command::new("open")
                .args(&["-a", "Terminal", &directory])
                .spawn()
        },
        "windows" => {
            Command::new("cmd")
                .args(&["/c", "start", "cmd", "/k", "cd", &directory])
                .spawn()
        },
        "linux" => {
            // Try gnome-terminal first
            let result = Command::new("gnome-terminal")
                .arg("--working-directory")
                .arg(&directory)
                .spawn();
                
            if result.is_err() {
                // Try xterm
                Command::new("xterm")
                    .arg("-e")
                    .arg(format!("cd {} && bash", directory))
                    .spawn()
            } else {
                result
            }
        },
        _ => {
            return Err(format!("Unsupported platform: {}", platform));
        }
    };
    
    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to open terminal: {}", e))
    }
}