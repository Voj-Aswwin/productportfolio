const fs = require('fs');
const glob = require('glob'); // Note: we can just use native fs since Node >= 20 has glob, or recursive readdir

function invertThemes() {
    const files = [
        'src/App.tsx',
        'src/components/ArtifactGallery.tsx',
        'src/components/ProductModal.tsx',
        'src/components/ProductShowcase.tsx',
        'src/components/PDFViewer.tsx',
        'src/components/ImageGallery.tsx',
        'src/components/AskVojaswwin.tsx'
    ];

    const pairs = [
        ['text-white', 'text-black'],
        ['text-black', 'text-white'], // Wait, replacing text-white with text-black will then be replaced BACK to text-white. We must use a token proxy.
    ];

    // Better approach: regex with function replacer
    const map = {
        'text-white': 'text-black',
        'text-black': 'text-white',
        'bg-white': 'bg-black',
        'bg-black': 'bg-white',
        'border-white': 'border-black',
        'border-black': 'border-white',
        'text-neutral-200': 'text-neutral-800',
        'text-neutral-800': 'text-neutral-200',
        'text-neutral-300': 'text-neutral-700',
        'text-neutral-700': 'text-neutral-300',
        'bg-zinc-950': 'bg-zinc-50',
        'bg-zinc-50': 'bg-zinc-950',
        'shadow-white': 'shadow-black',
        'shadow-black': 'shadow-white',
        'bg-white/55': 'bg-black/55',
        'bg-black/55': 'bg-white/55',
        'bg-white/85': 'bg-black/85',
        'bg-black/85': 'bg-white/85',
        'bg-white/10': 'bg-black/10',
        'bg-black/10': 'bg-white/10',
        'bg-white/15': 'bg-black/15',
        'bg-black/15': 'bg-white/15',
        'bg-white/5': 'bg-black/5',
        'bg-black/5': 'bg-white/5',
        'border-white/10': 'border-black/10',
        'border-black/10': 'border-white/10',
        'border-white/15': 'border-black/15',
        'border-black/15': 'border-white/15',
        'border-white/20': 'border-black/20',
        'border-black/20': 'border-white/20',
        'border-white/25': 'border-black/25',
        'border-black/25': 'border-white/25',
        'text-white/20': 'text-black/20',
        'text-black/20': 'text-white/20',
        'text-white/50': 'text-black/50',
        'text-black/50': 'text-white/50',
        'text-white/70': 'text-black/70',
        'text-black/70': 'text-white/70',
        'text-white/90': 'text-black/90',
        'text-black/90': 'text-white/90',
        'shadow-[0_10px_40px_rgba(0,0,0,0.65)]': 'shadow-[0_10px_40px_rgba(0,0,0,0.15)]',
        'shadow-[0_8px_40px_rgba(0,0,0,0.5)]': 'shadow-[0_8px_40px_rgba(0,0,0,0.15)]',
        'shadow-[0_8px_30px_rgba(0,0,0,0.4)]': 'shadow-[0_8px_30px_rgba(0,0,0,0.1)]',
    };

    // To prevent overlapping matches, we match precisely the classes by looking for word boundaries, or sorting them by length to match the longest first.
    const keys = Object.keys(map).sort((a, b) => b.length - a.length);
    // Escape specific regex chars
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?<=className="[^"]*)\\b(${keys.map(escapeRegExp).join('|')})\\b`, 'g');

    // A simpler regex that matches anywhere inside the file because in React we often use string concatenations for classes
    const globalPattern = new RegExp(`\\b(${keys.map(escapeRegExp).join('|')})\\b`, 'g');


    files.forEach(file => {
        if (!fs.existsSync(file)) return;
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(globalPattern, (match) => {
            return map[match];
        });
        fs.writeFileSync(file, content, 'utf8');
    });
    console.log("Replaced successfully.");
}

invertThemes();
