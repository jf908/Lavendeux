import React, {useState, useEffect} from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';

import { IconButton } from '../icon_button';
import { listen, run } from '../../include/tauri';

import "./settings.css"

// Range of values for the shortcut key
const alpha_range = Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
const keys = ["Space", ...alpha_range, "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];

// Range of values for the shortcut modifier
const mod_values = [
	{"key":"CmdOrCtrl", "name":"CTRL"},
	{"key":"Shift", "name":"SHIFT"},
	{"key":"CmdOrCtrl+Shift", "name":"CTRL+SHIFT"}
];

/**
 * Render the settings tab
 * @param {Object} props Component properties
 * @returns Component contents
 */
function Settings(props) {
	const [shortcutModifier, setShortcutModifier] = useState("CmdOrCtrl");
	const [shortcutKey, setShortcutKey] = useState("Space");
	const [settings, setSettings] = useState({});
    const [lang, setLang] = useState({});

	useEffect(() => {
		listen('settings', event => {
			if (!event.payload.shortcut) return;
			
			let shortcut = event.payload.shortcut.split("+");
			setShortcutModifier(shortcut[0]);
			setShortcutKey(shortcut[1]);

			setSettings(event.payload);
		});
		
        run("get_settings")
        .then(e => {setSettings(e)})
        .catch(err => console.log(`Error: ${err}`));
		
        run("lang_en").then(l => setLang(l));
	}, []);

	function updateSettings(key, value) {
		const newSettings = {
			...settings,
			[key]: value
		};

		setSettings(newSettings);
	}

	/**
	 * Render the clipboard mode settings
	 * @returns Rendered data
	 */
	function renderClipboardMode() {
		return (<>
			<dl class="row row-setting">
				<dt class="col-sm-3">{lang.settingview_clipboard_mode}</dt>
				<dd class="col-sm-9">{lang.settingview_clipboard_mode_desc}</dd>
			</dl>

			<div className="form-group">
				<div className="form-check">
					<input className="form-check-input" type="radio" name="autoPaste" id="autopasteOn" 
						checked={settings.auto_paste} onChange={e => updateSettings("auto_paste", true)} />
					<label className="form-check-label setting-label" htmlFor="autopasteOn">
					{lang.settingview_clipboard_mode_auto}
					</label>
				</div>

				<div className="form-check">
					<input className="form-check-input" type="radio" name="autoPaste" id="autopasteOff" 
						checked={!settings.auto_paste} onChange={e => updateSettings("auto_paste", false)} />
					<label className="form-check-label setting-label" htmlFor="autopasteOff">
					{lang.settingview_clipboard_mode_off}
					</label>
				</div>
			</div>
		</>);
	}

	/**
	 * Render the error handling settings
	 * @returns Rendered data
	 */
	function renderErrorMode() {
		return (<>
			<dl class="row row-setting">
				<dt class="col-sm-3">{lang.settingview_silent_errors}</dt>
				<dd class="col-sm-9" style={{}}>{lang.settingview_silent_errors_desc}</dd>
			</dl>

			<div className="form-group">
				<div className="form-check">
					<input className="form-check-input" type="radio" name="silent_errors" id="silent_errorsOff" 
						checked={!settings.silent_errors} onChange={e => updateSettings("silent_errors", false)} />
					<label className="form-check-label setting-label" htmlFor="silent_errorsOff">
					{lang.settingview_silent_errors_off}
					</label>
				</div>

				<div className="form-check">
					<input className="form-check-input" type="radio" name="silent_errors" id="silent_errorsOn" 
						checked={settings.silent_errors} onChange={e => updateSettings("silent_errors", true)} />
					<label className="form-check-label setting-label" htmlFor="silent_errorsOn">
					{lang.settingview_silent_errors_on}
					</label>
				</div>
			</div>
		</>);
	}

	/**
	 * Render the autostart settings
	 * @returns Rendered data
	 */
	function renderAutostart() {
		return (<>
			<dl class="row row-setting">
				<dt class="col-sm-3">{lang.settingview_autostart}</dt>
				<dd class="col-sm-9">{lang.settingview_autostart_desc}</dd>
			</dl>

			<div className="form-group">
				<div className="form-check">
					<input className="form-check-input" type="radio" name="autostart" id="autostartOff" 
						checked={!settings.autostart} onChange={e => updateSettings("autostart", false)} />
					<label className="form-check-label setting-label" htmlFor="autostartOff">
					{lang.settingview_autostart_off}
					</label>
				</div>

				<div className="form-check">
					<input className="form-check-input" type="radio" name="autostart" id="autostartOn" 
						checked={settings.autostart} onChange={e => updateSettings("autostart", true)} />
					<label className="form-check-label setting-label" htmlFor="autostartOn">
					{lang.settingview_autostart_on}
					</label>
				</div>
			</div>
			</>);
	}

	/**
	 * Render the theme settings
	 * @returns Rendered data
	 */
	function renderTheme() {
		return (<>
			<dl class="row row-setting">
				<dt class="col-sm-3">{lang.settingview_theme}</dt>
				<dd class="col-sm-9">{lang.settingview_theme_desc}</dd>
			</dl>
				
			<div className="form-group">
				<label className="setting-label">
					<input type="radio" name="dark" autoComplete="off" checked={!settings.dark}
						onChange={e => updateSettings("dark", false)} /> {lang.settingview_theme_off}
				</label><br/>
				<label className="setting-label">
					<input type="radio" name="dark" autoComplete="off" checked={settings.dark}
						onChange={e => updateSettings("dark", true)} /> {lang.settingview_theme_on}
				</label>
			</div>
		</>);
	}

	/**
	 * Render the shortcut settings
	 * @returns Rendered data
	 */
	function renderKeyboardShortcut() {
		return (<>
			<dl class="row row-setting">
				<dt class="col-sm-3">{lang.settingview_keyboard_shortcut}</dt>
				<dd class="col-sm-9">{lang.settingview_keyboard_shortcut_desc}</dd>
			</dl>
				
			<Row>
				<Col className="form-group">
					<select className="form-control" value={shortcutModifier}
						onChange={e => {setShortcutModifier(e.target.value); updateSettings("shortcut", `${e.target.value}+${shortcutKey}`)}}>

						{mod_values.map(v => (
							<option key={v.key} value={v.key}>{v.name}</option>
						))}
					</select>
				</Col>
				<Col className="form-group">
					<select className="form-control" value={shortcutKey}
						onChange={e => {setShortcutKey(e.target.value); updateSettings("shortcut", `${shortcutModifier}+${e.target.value}`)}}>

						{keys.map(v => (
							<option key={v} value={v}>{v}</option>
						))}
					</select>
				</Col>
			</Row>
		</>);
	}

	/**
	 * Render the extension settings
	 * @returns Rendered data
	 */
	function renderExtensionDir() {
		return (<>
			<dl class="row row-setting">
				<dt class="col-sm-3">{lang.settingview_extension_dir}</dt>
				<dd class="col-sm-9">{lang.settingview_extension_dir_desc}</dd>
			</dl>

			<div className="form-group">
				<input type="text" className="form-control" placeholder="Path to extensions" value={settings.extension_dir} 
					onChange={e => updateSettings("extension_dir", e.target.value)} />
			</div>
			</>);
	}

	/**
	 * Render the save button
	 * @returns Rendered data
	 */
	function renderSaveButton() {
		return (
			<IconButton variant="success" onClick={() => run("update_settings", {settings: settings})} icon="save" title={lang.settingview_save} />
		);
	}

	return (
		<div className="nav-content">
			<ListGroup variant="flush">
                <ListGroup.Item>{renderSaveButton()}</ListGroup.Item>

                <ListGroup.Item>{renderClipboardMode()}</ListGroup.Item>
                <ListGroup.Item>{renderErrorMode()}</ListGroup.Item>
                <ListGroup.Item>{renderKeyboardShortcut()}</ListGroup.Item>
                <ListGroup.Item>{renderAutostart()}</ListGroup.Item>
                <ListGroup.Item>{renderTheme()}</ListGroup.Item>
                <ListGroup.Item>{renderExtensionDir()}</ListGroup.Item>
				
                <ListGroup.Item>{renderSaveButton()}</ListGroup.Item>
			</ListGroup>
		</div>
	);
}

export default Settings;