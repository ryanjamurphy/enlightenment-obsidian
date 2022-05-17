import { addIcon, App, Plugin, Notice, PluginSettingTab, Setting, SliderComponent } from 'obsidian';

addIcon('enlightenment-sparkles', `<?xml version='1.0' encoding='UTF-8' standalone='no'?>) // Torch icon modified from Flat Icon/Freepik: https://www.flaticon.com/free-icon/shines_764690?term=shine&page=1&position=5&page=1&position=5&related_id=764690&origin=search
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
<svg viewBox='0 0 100 100'>
<path fill='currentColor' stroke='currentColor' d='M57.974,27.418c-11.745,-2.462 -20.925,-11.642 -23.386,-23.387c-0.303,-1.441 -1.574,-2.474 -3.048,-2.474c-1.473,0 -2.745,1.033 -3.047,2.475c-2.462,11.744 -11.642,20.924 -23.387,23.386c-1.441,0.302 -2.474,1.574 -2.474,3.047c0,1.473 1.032,2.745 2.474,3.047c11.745,2.462 20.924,11.642 23.386,23.387c0.302,1.442 1.574,2.475 3.048,2.475c1.473,0 2.745,-1.033 3.047,-2.475c2.462,-11.745 11.642,-20.925 23.387,-23.386c1.442,-0.302 2.475,-1.574 2.475,-3.047c-0.001,-1.474 -1.033,-2.746 -2.475,-3.048Z'/>
<path fill='currentColor' stroke='currentColor' d='M52.827,78.855c-5.534,-1.16 -9.859,-5.485 -11.019,-11.019c-0.302,-1.442 -1.574,-2.475 -3.047,-2.475c-1.474,0 -2.746,1.033 -3.048,2.475c-1.16,5.533 -5.485,9.859 -11.019,11.018c-1.442,0.303 -2.475,1.575 -2.475,3.048c0,1.473 1.033,2.745 2.475,3.047c5.534,1.16 9.859,5.485 11.019,11.019c0.302,1.442 1.574,2.475 3.047,2.475c1.474,0 2.745,-1.033 3.048,-2.475c1.16,-5.534 5.485,-9.859 11.019,-11.019c1.442,-0.302 2.475,-1.574 2.475,-3.047c0,-1.473 -1.033,-2.745 -2.475,-3.047Z'/>
<path fill='currentColor' stroke='currentColor' d='M94.894,50.026c-7.48,-1.568 -13.326,-7.415 -14.894,-14.894c-0.302,-1.442 -1.573,-2.475 -3.047,-2.475c-1.473,0 -2.745,1.033 -3.047,2.475c-1.568,7.479 -7.414,13.325 -14.894,14.893c-1.442,0.302 -2.475,1.574 -2.475,3.048c0,1.473 1.033,2.745 2.475,3.047c7.48,1.568 13.326,7.414 14.893,14.893c0.303,1.442 1.574,2.475 3.048,2.475c1.473,0 2.745,-1.032 3.047,-2.475c1.568,-7.479 7.414,-13.325 14.894,-14.893c1.441,-0.302 2.474,-1.574 2.474,-3.047c0,-1.473 -1.032,-2.745 -2.474,-3.047Z'/>
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
			.setDesc('Set the transparency for items in the background. The default is .7, as in "70%". (0 = 0%, 1 = 100%.).')
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
			.setDesc('Set the opacity for items you\'re focusing on. The default is 1, as in "100%". (.5 = 50%).')
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