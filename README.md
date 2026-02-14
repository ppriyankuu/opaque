# Opaque
Opaque is a client-side image utility application where all the processing happens in the browser. <br/>
No uploads. No server storage. No tracking

### Overview
Opaque provides simple image tools:
- Convert images to PDF
- Compress images
- Convert JPG to PNG

The application is fully client-side. Images never leave the user's device.

### Core Features
- Upload multiple PNG / JPG images
- Select or deselect images before generating the PDF
- Drag and rearrange image order
- Optional compressed PDF output
- Automatic timestamp-based filenames
- Maintains image aspect ratio (no stretching in PDF)
- Instant download after processing
- 100% client-side processing (no uploads, no server interaction)

### Tech Stack
- `Next.js` (App Router)
- `DaisyUI` + `TailwindCSS`
- `jsPDF` (PDF generation)
- `browser-image-compression` (Image compression)
- `dnd-kit` (Drag and drop sorting)

### Folder Structure
```
├── app
│   ├── compress
│   │   └── page.tsx
│   ├── img-to-pdf
│   │   ├── page.tsx
│   │   ├── pdf
│   │   │   └── page.tsx
│   │   └── selected
│   │       └── page.tsx
│   ├── jpg-to-png
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components
│   ├── compress
│   │   ├── compressButton.tsx
│   │   └── imgToCompressUploader.tsx
│   │
│   ├── img-to-pdf
│   │   ├── imageCard.tsx
│   │   ├── invalidFileModal.tsx
│   │   ├── sortableImageCard.tsx
│   │   └── upload.tsx
│   │
│   └── jpg-to-png
│       ├── convertButton.tsx
│       ├── imagePreview.tsx
│       └── jpgToPngUploader.tsx
│
└── lib
    └──pdf-helper.ts
