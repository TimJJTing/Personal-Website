CMS.registerEditorComponent({
	id: 'instagram',
	label: 'Instagram',
	fields: [
		{
			name: 'url',
			label: 'Instagram Post URL',
			widget: 'string'
		},
		{
			name: 'captioned',
			label: 'Captioned',
			widget: 'boolean',
			default: true
		}
	],
	pattern: /^<Instagram\s+url="([^"]+)"(\s+captioned)?\s*\/>$/,
	fromBlock: function (match) {
		return {
			url: match[1],
			captioned: !!match[2]
		};
	},
	toBlock: function (obj) {
		return `<Instagram url="${obj.url}"${obj.captioned ? ' captioned' : ''} />`;
	},
	toPreview: function (obj) {
		return `
      <div style="padding: 16px; border: 1px solid #ddd; border-radius: 4px; background: #fff; max-width: 500px;">
        <div style="font-weight: bold; margin-bottom: 8px;">Instagram Embed</div>
        <div style="font-size: 0.9em; color: #666; margin-bottom: 4px;">URL: ${obj.url}</div>
        <div style="font-size: 0.9em; color: #666;">Captioned: ${obj.captioned ? 'Yes' : 'No'}</div>
      </div>
    `;
	}
});

CMS.registerEditorComponent({
	id: 'youtube',
	label: 'YouTube',
	fields: [
		{
			name: 'url',
			label: 'YouTube Video URL',
			widget: 'string'
		},
		{
            name: 'allowfullscreen',
			label: 'Allow Fullscreen',
			widget: 'boolean',
			default: true,
			required: false
		},
        {
            name: 'autoplay',
            label: 'Autoplay',
            widget: 'boolean',
            default: false,
            required: false
        },
        {
			name: 'width',
			label: 'Width (Optional)',
			widget: 'string',
			required: false
		},
		{
			name: 'height',
			label: 'Height (Optional)',
			widget: 'string',
			required: false
		},
	],
	pattern: /^<YouTube\s+url="([^"]+)"(.*)\/>$/,
	fromBlock: function (match) {
		const attrs = match[2];
		const widthMatch = attrs.match(/width="([^"]+)"/);
		const heightMatch = attrs.match(/height="([^"]+)"/);
		return {
			url: match[1],
			width: widthMatch ? widthMatch[1] : '',
			height: heightMatch ? heightMatch[1] : '',
			autoplay: attrs.includes('autoplay'),
			allowfullscreen: attrs.includes('allowfullscreen')
		};
	},
	toBlock: function (obj) {
		let out = `<YouTube url="${obj.url}"`;
		if (obj.width) out += ` width="${obj.width}"`;
		if (obj.height) out += ` height="${obj.height}"`;
		if (obj.autoplay) out += ` autoplay`;
		if (obj.allowfullscreen) out += ` allowfullscreen`;
		out += ` />`;
		return out;
	},
	toPreview: function (obj) {
		return `
      <div style="padding: 16px; border: 1px solid #ddd; border-radius: 4px; background: #fff; max-width: 500px;">
        <div style="font-weight: bold; margin-bottom: 8px;">YouTube Embed</div>
        <div style="font-size: 0.9em; color: #666; margin-bottom: 4px;">URL: ${obj.url}</div>
        <div style="font-size: 0.9em; color: #666;">Autoplay: ${obj.autoplay ? 'Yes' : 'No'}</div>
        <div style="font-size: 0.9em; color: #666;">Allow Fullscreen: ${obj.allowfullscreen ? 'Yes' : 'No'}</div>
        ${obj.width ? `<div style="font-size: 0.9em; color: #666;">Width: ${obj.width}</div>` : ''}
        ${obj.height ? `<div style="font-size: 0.9em; color: #666;">Height: ${obj.height}</div>` : ''}
      </div>
    `;
	}
});
