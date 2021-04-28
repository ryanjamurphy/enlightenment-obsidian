import { addIcon, Plugin } from 'obsidian';

addIcon('enlightenment-sparkles', `<?xml version="1.0" encoding="UTF-8" standalone="no"?> // Torch icon modified from Flat Icon/Freepik: https://www.flaticon.com/free-icon/shines_764690?term=shine&page=1&position=5&page=1&position=5&related_id=764690&origin=search
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
<g>
	<g>
		<path d="M298.138,136.665c-62.065-13.011-110.576-61.522-123.585-123.588C172.955,5.458,166.235,0,158.448,0
			s-14.507,5.458-16.104,13.078c-13.01,62.065-61.521,110.575-123.586,123.584c-7.62,1.597-13.079,8.318-13.079,16.104
			s5.458,14.507,13.079,16.104c62.064,13.011,110.573,61.521,123.583,123.586c1.597,7.62,8.317,13.079,16.104,13.079
			c7.786,0,14.507-5.458,16.104-13.079c13.011-62.065,61.523-110.575,123.588-123.583c7.62-1.597,13.079-8.317,13.079-16.104
			C311.215,144.983,305.757,138.262,298.138,136.665z" style="fill:currentColor;"/>
	</g>
</g>
<g>
	<g>
		<path d="M270.938,408.484c-29.242-6.129-52.098-28.985-58.229-58.229c-1.597-7.62-8.317-13.079-16.104-13.079
			c-7.786,0-14.507,5.457-16.104,13.078c-6.131,29.243-28.988,52.099-58.23,58.229c-7.62,1.597-13.079,8.318-13.079,16.104
			c0,7.786,5.458,14.507,13.079,16.104c29.241,6.13,52.098,28.987,58.228,58.23c1.597,7.62,8.317,13.079,16.104,13.079
			c7.786,0,14.507-5.457,16.104-13.079c6.131-29.243,28.988-52.099,58.231-58.229c7.62-1.597,13.079-8.318,13.079-16.104
			C284.017,416.802,278.559,410.082,270.938,408.484z" style="fill:currentColor;"/>
	</g>
</g>
<g>
	<g>
		<path d="M493.243,256.135c-39.526-8.286-70.419-39.18-78.704-78.705c-1.597-7.62-8.317-13.079-16.104-13.079
			c-7.786,0-14.507,5.457-16.104,13.078c-8.286,39.526-39.179,70.419-78.705,78.704c-7.62,1.597-13.079,8.318-13.079,16.104
			c0,7.786,5.458,14.506,13.079,16.104c39.525,8.286,70.418,39.179,78.703,78.705c1.597,7.62,8.317,13.079,16.104,13.079
			c7.786,0,14.507-5.457,16.104-13.079c8.287-39.526,39.18-70.419,78.705-78.703c7.62-1.598,13.079-8.318,13.079-16.104
			S500.863,257.732,493.243,256.135z" style="fill:currentColor;"/>
	</g>
</g>
`);


export default class EnlightenmentPlugin extends Plugin {

	async onload() {
		console.log('Loading the Enlightenment plugin.');


		this.addRibbonIcon('enlightenment-sparkles', 'Cycle through Enlightenment modes (off, across all panes, or the activeed pane only)', () => {
			this.cycleEnlightenmentMode();
		});

		this.addCommand({
			id: 'enable-enlightenment',
			name: 'Enable Enlightenment (across all panes)',
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						this.addStyle("full");
					}
					return true;
				}
				return false;
			}
		});

		this.addCommand({
			id: 'enable-enlightenment-active-pane',
			name: 'Enable Enlightenment (only on the active pane)',
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						this.addStyle('active-pane');
					}
					return true;
				}
				return false;
			}
		});

		this.addCommand({
			id: 'disable-enlightenment',
			name: 'Disable Enlightenment',
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						this.removeStyle();
					}
					return true;
				}
				return false;
			}
		});
	}

	onunload() {
		console.log('Unloading the Enlightenment plugin.');
		this.removeStyle();
	}

	cycleEnlightenmentMode = () => {
		const fullEnlightenment = document.getElementById('plugin-enlightenment-full');
		const activePaneEnlightenment = document.getElementById('plugin-enlightenment-active-pane');
		if (fullEnlightenment) {
			this.removeStyle();
			this.addStyle('active-pane');
		} else if (activePaneEnlightenment) {
			this.removeStyle();
		} else {
			this.addStyle('full');
		}
		
	}

	addStyle(enlightenmentType: string) {
		const css = document.createElement('style');
		document.getElementsByTagName("head")[0].appendChild(css);
		if (enlightenmentType == "full") {
			document.body.classList.add('plugin-enlightenment-full');
			css.id = 'plugin-enlightenment-full';
		} else if (enlightenmentType == "active-pane") {
			document.body.classList.add('plugin-enlightenment-active-pane');
			css.id = 'plugin-enlightenment-active-pane';
		}
	}

	removeStyle = () => { // Thanks, @death_au!
		const fullEnlightenment = document.getElementById('plugin-enlightenment-full');
		if (fullEnlightenment) fullEnlightenment.remove();
		const activePaneEnlightenment = document.getElementById('plugin-enlightenment-active-pane');
		if (activePaneEnlightenment) activePaneEnlightenment.remove();
		document.body.classList.remove('plugin-enlightenment');
		document.body.classList.remove('plugin-enlightenment-full'); 
		document.body.classList.remove('plugin-enlightenment-active-pane');
	  }
}