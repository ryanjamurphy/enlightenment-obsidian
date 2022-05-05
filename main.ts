import { addIcon, App, Plugin, Notice, PluginSettingTab, Setting, SliderComponent } from 'obsidian';

addIcon('enlightenment-sparkles', `<?xml version='1.0' encoding='UTF-8' standalone='no'?>) // Torch icon modified from Flat Icon/Freepik: https://www.flaticon.com/free-icon/shines_764690?term=shine&page=1&position=5&page=1&position=5&related_id=764690&origin=search
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
<svg viewBox='0 0 512 512'>
<path fill='currentColor' stroke='currentColor' d='M298.138,136.665c-62.065-13.011-110.576-61.522-123.585-123.588C172.955,5.458,166.235,0,158.448,0
			s-14.507,5.458-16.104,13.078c-13.01,62.065-61.521,110.575-123.586,123.584c-7.62,1.597-13.079,8.318-13.079,16.104
			s5.458,14.507,13.079,16.104c62.064,13.011,110.573,61.521,123.583,123.586c1.597,7.62,8.317,13.079,16.104,13.079
			c7.786,0,14.507-5.458,16.104-13.079c13.011-62.065,61.523-110.575,123.588-123.583c7.62-1.597,13.079-8.317,13.079-16.104
			C311.215,144.983,305.757,138.262,298.138,136.665z'/>
<path fill='currentColor' stroke='currentColor' d='M270.938,408.484c-29.242-6.129-52.098-28.985-58.229-58.229c-1.597-7.62-8.317-13.079-16.104-13.079
			c-7.786,0-14.507,5.457-16.104,13.078c-6.131,29.243-28.988,52.099-58.23,58.229c-7.62,1.597-13.079,8.318-13.079,16.104
			c0,7.786,5.458,14.507,13.079,16.104c29.241,6.13,52.098,28.987,58.228,58.23c1.597,7.62,8.317,13.079,16.104,13.079
			c7.786,0,14.507-5.457,16.104-13.079c6.131-29.243,28.988-52.099,58.231-58.229c7.62-1.597,13.079-8.318,13.079-16.104
			C284.017,416.802,278.559,410.082,270.938,408.484z'/>
<path fill='currentColor' stroke='currentColor' d='M493.243,256.135c-39.526-8.286-70.419-39.18-78.704-78.705c-1.597-7.62-8.317-13.079-16.104-13.079
			c-7.786,0-14.507,5.457-16.104,13.078c-8.286,39.526-39.179,70.419-78.705,78.704c-7.62,1.597-13.079,8.318-13.079,16.104
			c0,7.786,5.458,14.506,13.079,16.104c39.525,8.286,70.418,39.179,78.703,78.705c1.597,7.62,8.317,13.079,16.104,13.079
			c7.786,0,14.507-5.457,16.104-13.079c8.287-39.526,39.18-70.419,78.705-78.703c7.62-1.598,13.079-8.318,13.079-16.104
			S500.863,257.732,493.243,256.135z'/>
`);

type EnlightenmentType = "all-panes" | "active-pane" | "inactive-panes" | "none"

interface EnlightenmentSettings {
	backgroundTransparency: number,
	focusOpacity: number
}

const DEFAULT_SETTINGS: EnlightenmentSettings = {
	backgroundTransparency: .7,
	focusOpacity: 1
}


export default class EnlightenmentPlugin extends Plugin {

	settings: EnlightenmentSettings;

	async onload() {
		console.log('Loading the Enlightenment plugin v1.');

		await this.loadSettings();

		let root = document.documentElement;
		root.style.setProperty('--enlightenment-background-transparency', this.settings.backgroundTransparency.toString());
		root.style.setProperty('--enlightenment-focus-opacity', this.settings.focusOpacity.toString());


		this.addRibbonIcon('enlightenment-sparkles', 'Cycle through Enlightenment modes (off, across all panes, or the active pane only)', () => {
			this.cycleEnlightenmentMode();
		});

		this.addCommand({
			id: 'enable-enlightenment',
			name: 'Enable Enlightenment (across all panes)',
			callback: () => {
				this.changeEnlightenmentMode('all-panes');
			}
		});

		this.addCommand({
			id: 'enable-enlightenment-active-pane',
			name: 'Enable Enlightenment (only on the active pane)',
			callback: () => {
				this.changeEnlightenmentMode('active-pane');
			}
		});

		this.addCommand({
			id: 'enable-enlightenment-inactive-panes',
			name: 'Enable Enlightenment (only on inactive panes)',
			callback: () => {
				this.changeEnlightenmentMode('inactive-panes');
			}
		});

		this.addCommand({
			id: 'disable-enlightenment',
			name: 'Disable Enlightenment',
			callback: () => {
				this.changeEnlightenmentMode('none');
			}
		});

		this.addSettingTab(new EnlightenmentSettingsTab(this.app, this));
	}

	onunload() {
		console.log('Unloading the Enlightenment plugin.');
		this.changeEnlightenmentMode("none");
	}

	cycleEnlightenmentMode = () => {
		const allPanesEnlightenment = document.body.hasClass('plugin-enlightenment-all-panes');
		const activePaneEnlightenment = document.body.hasClass('plugin-enlightenment-active-pane');
		const inactivePanesEnlightenment = document.body.hasClass('plugin-enlightenment-inactive-panes');
		if (allPanesEnlightenment) {
			this.changeEnlightenmentMode('active-pane');
		} else if (activePaneEnlightenment) {
			this.changeEnlightenmentMode('inactive-panes');
		} else if (inactivePanesEnlightenment) {
			this.changeEnlightenmentMode('none');
		} else {
			this.changeEnlightenmentMode('all-panes');
		}
		
	}

	changeEnlightenmentMode = (someEnlightenmentType : EnlightenmentType) => {
		const bodyElement = document.body;
		bodyElement.removeClasses(['plugin-enlightenment-all-panes', 'plugin-enlightenment-active-pane', 'plugin-enlightenment-inactive-panes']); 
		if (someEnlightenmentType == 'all-panes') {
			bodyElement.addClass('plugin-enlightenment-all-panes');
			new Notice("Enlightenment enabled across all panes.");
		} else if (someEnlightenmentType == 'active-pane') {
			bodyElement.addClass('plugin-enlightenment-active-pane');
			new Notice("Enlightenment enabled only for the active pane.");
		} else if (someEnlightenmentType == 'inactive-panes') {
			bodyElement.addClass('plugin-enlightenment-inactive-panes');
			new Notice("Enlightenment enabled only for inactive panes.");
		} else if (someEnlightenmentType == 'none') {
			new Notice("Enlightenment disabled.");
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	  }
	  
}

class EnlightenmentSettingsTab extends PluginSettingTab {
	plugin: EnlightenmentPlugin;

	constructor(app: App, plugin: EnlightenmentPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Enlightenment Settings'});

		new Setting(containerEl)
			.setName('Background Transparency')
			.setDesc('Set the transparency for items in the background. The default is .7.')
			.addSlider(slider => slider
				.setDynamicTooltip()
				.setLimits(0, 1, .05)
				.setValue(this.plugin.settings.backgroundTransparency)
				.onChange(async (value) => {
					this.plugin.settings.backgroundTransparency = (value);
					let root = document.documentElement;
					root.style.setProperty('--enlightenment-background-transparency', value.toString());
					console.log(root.style.getPropertyValue("--enlightenment-background-transparency"));
					this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Focus Opacity')
			.setDesc('Set the opacity for items you\'re focusing on. The default is 1.')
			.addSlider(slider => slider
				.setDynamicTooltip()
				.setLimits(0, 1, .05)
				.setValue(this.plugin.settings.focusOpacity)
				.onChange(async (value) => {
					this.plugin.settings.focusOpacity = (value);
					let root = document.documentElement;
					root.style.setProperty('--enlightenment-focus-opacity', value.toString());
					console.log(root.style.getPropertyValue("--enlightenment-focus-opacity"));
					this.plugin.saveSettings();
				}));
			}
}