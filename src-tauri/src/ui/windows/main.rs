use std::{thread};
use embedded_lang::get_string;
use tauri::{
    AppHandle, Window, Manager, WindowMenuEvent, 
    Menu, Submenu, CustomMenuItem
};

use super::Logs;
use crate::core::language;

/// Tabs on the main window
#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub enum WindowTabs {
	History, Extensions, Settings, Help
}

/// Main application window
pub struct Main(Window);
impl Main {
    /// Create a new handle to the main window
    /// 
    /// # Arguments
    /// * `app_handle` - AppHandle
    pub fn new(app_handle: AppHandle) -> Option<Main> {
        Some(Self(app_handle.get_window("main")?))
    }

    /// Create a new handle to a window
    /// 
    /// # Arguments
    /// * `app_handle` - AppHandle
    pub fn new_with_window(window: Window) -> Main {
        Self(window)
    }

    /// Show the window, and switch to a tab
    /// 
    /// # Arguments
    /// * `tab` - Tab to switch to
    pub fn show_tab(&self, tab: WindowTabs) -> tauri::Result<()> { 
        // Bring to front
        let w = self.0.clone();
        thread::spawn(move || {
            w.show().ok();
        });
        self.0.set_always_on_top(true)?;
        self.0.request_user_attention(Some(tauri::UserAttentionType::Informational))?;
        self.0.set_always_on_top(false)?;
    
        // Set tab
        self.0.emit_all("switch_tab", tab)?;
        Ok(())
    }

    /// Hide the main window
    pub fn hide(&self) -> tauri::Result<()> {
        let w = self.0.clone();
        thread::spawn(move || {
            w.hide().ok();
        });
        Ok(())
    }

    /// Create a new menu for the window
    pub fn get_menu() -> Menu {
        let lang = language::initialize();

        Menu::new()
        .add_submenu(Submenu::new(get_string!(lang, "menu_file"), Menu::new()
            .add_item(CustomMenuItem::new("quit", get_string!(lang, "menu_file_quit")))
        ))
        .add_submenu(Submenu::new(get_string!(lang, "menu_help"), Menu::new()
            .add_item(CustomMenuItem::new("help", get_string!(lang, "menu_help_help")))
            .add_item(CustomMenuItem::new("log", get_string!(lang, "menu_help_logs")))
            .add_item(CustomMenuItem::new("about", get_string!(lang, "menu_help_about")))
        ))
    }

    /// Handle a menu event
    pub fn handle_menu_event(e: WindowMenuEvent) {
        match e.menu_item_id() {
            "quit" => {
                e.window().app_handle().exit(0);
            },
            "help" => {
                Main::new_with_window(e.window().clone()).show_tab(WindowTabs::Help).ok();
            },
            "log" => {
                Logs::new(e.window(), e.window().app_handle().state());
            },
            "about" => {
                tauri::api::dialog::message(Some(e.window()), "Lavendeux", "Created by @rscarson");
            },

            _ => {}
        }
    }
}