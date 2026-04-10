# Opaque
Opaque is a client-side image utility application where all the processing happens in the browser. <br/>
No uploads. No server storage. No tracking

### Overview
Opaque provides simple image tools:
- Convert images to PDF
- Edit PDFs
- Merge PDFs
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
- `pdf-lib` (PDF editing / merging)
- `pdfjs-dist` (PDF rendering for previews)
- `browser-image-compression` (Image compression)
- `dnd-kit` (Drag and drop sorting)
- `Zustand` (Client-side state management)

### Folder Structure
```
├── app
│   ├── compress
│   │   └── page.tsx
│   ├── edit-pdf
│   │   └── page.tsx
│   ├── img-to-pdf
│   │   ├── page.tsx
│   │   ├── pdf
│   │   │   └── page.tsx
│   │   └── selected
│   │       └── page.tsx
│   ├── jpg-to-png
│   │   └── page.tsx
│   ├── merge-pdf
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components
│   ├── compress
│   │   ├── compressButton.tsx
│   │   └── imgToCompressUploader.tsx
│   │
│   ├── edit-pdf
│   │   ├── pdfUploader.tsx
│   │   ├── pdfPageThumbnail.tsx
│   │   └── sortablePdfPage.tsx
│   │
│   ├── img-to-pdf
│   │   ├── imageCard.tsx
│   │   ├── invalidFileModal.tsx
│   │   ├── sortableImageCard.tsx
│   │   └── upload.tsx
│   │
│   ├── jpg-to-png
│   │   ├── convertButton.tsx
│   │   ├── imagePreview.tsx
│   │   └── jpgToPngUploader.tsx
│   │
│   └── merge-pdf
│       ├── pdfUploader.tsx
│       ├── pdfPageThumbnail.tsx
│       └── sortablePdfPage.tsx
│
├── lib
│   ├── pdf-helper.ts
│   └── pdf-utils.ts
│
└── store
    └── useFileStore.ts
