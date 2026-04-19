import os
import re

files = [
    'src/App.tsx',
    'src/components/ArtifactGallery.tsx',
    'src/components/ProductModal.tsx',
    'src/components/ProductShowcase.tsx',
    'src/components/PDFViewer.tsx',
    'src/components/ImageGallery.tsx',
    'src/components/AskVojaswwin.tsx'
]

mapping = {
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
    # Percentages
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
    'bg-white/0': 'bg-black/0',
    'bg-black/0': 'bg-white/0',
    'bg-white/20': 'bg-black/20',
    'bg-black/20': 'bg-white/20',
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
    'shadow-[0_20px_40px_rgba(0,0,0,0.55)]': 'shadow-[0_20px_40px_rgba(0,0,0,0.2)]'
}

keys_sorted = sorted(mapping.keys(), key=len, reverse=True)
pattern = re.compile(r'\b(' + '|'.join(map(re.escape, keys_sorted)) + r')\b')

def replace_func(match):
    return mapping[match.group(0)]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        new_content = pattern.sub(replace_func, content)
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Processed {filepath}")
