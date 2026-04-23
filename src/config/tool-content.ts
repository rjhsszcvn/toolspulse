import { getToolBySlug } from "@/config/tools";

export interface ToolContent {
  toolSlug: string;
  howTo: {
    title: string;
    steps: { title: string; description: string }[];
    tips: string[];
  };
  faq: { question: string; answer: string }[];
  alternatives: {
    intro: string;
    tools: { name: string; description: string; differentiator: string }[];
    whyUs: string;
  };
  useCases: { title: string; description: string }[];
}

export const toolContentMap: Record<string, ToolContent> = {
  "pdf-to-word": {
    toolSlug: "pdf-to-word",
    howTo: {
      title: "How to Convert PDF to Word Online",
      steps: [
        { title: "Open the PDF to Word tool", description: "Navigate to the tool page and you'll see a drag-and-drop upload area. No login or signup is required." },
        { title: "Upload your PDF file", description: "Drag your PDF onto the upload zone or click to browse and select the file from your device. The tool accepts any PDF file size." },
        { title: "Wait for processing", description: "The converter analyzes your PDF structure, text, images, and formatting. Everything is processed locally in your browser — nothing is uploaded to any server." },
        { title: "Download your Word document", description: "Once conversion is complete, click the download button to save your .docx file. The document preserves your original formatting, fonts, and layout." },
      ],
      tips: [
        "Text-based PDFs convert with the highest accuracy. If your PDF was originally created from Word, it will convert almost perfectly.",
        "Scanned PDFs (images of text) require OCR first. Use our Image to Text tool before converting.",
        "Complex layouts with multiple columns may shift slightly — review your output and adjust as needed.",
        "For best results, use PDFs with selectable text rather than scanned documents.",
        "The converted file will maintain hyperlinks, headers, footers, and table structures from the original PDF.",
      ],
    },
    faq: [
      { question: "Is this PDF to Word converter really free?", answer: "Yes, completely free. There are no hidden costs, premium tiers, or usage limits. Convert as many PDFs as you need." },
      { question: "Do you upload my PDF to a server?", answer: "No. All processing happens locally in your browser using JavaScript. Your files never leave your device — we physically cannot access them." },
      { question: "What's the maximum file size?", answer: "There's no hard limit since processing happens in your browser. However, very large PDFs (100+ pages) may take longer to process depending on your device's capabilities." },
      { question: "Will the formatting be preserved?", answer: "The converter preserves text, fonts, images, tables, and basic formatting. Complex layouts with multiple columns or unusual formatting may require minor adjustments." },
      { question: "Can I convert password-protected PDFs?", answer: "If the PDF requires a password to open, you'll need to enter the password first. Print-restricted PDFs (that can be opened but not printed) can typically be converted." },
      { question: "Does it work on mobile devices?", answer: "Yes. The tool works on any device with a modern web browser — phones, tablets, laptops, and desktops." },
    ],
    alternatives: {
      intro: "There are many PDF to Word converters available, but most require file uploads to remote servers. Here's how the major options compare.",
      tools: [
        { name: "Adobe Acrobat", description: "Professional PDF suite with conversion capabilities", differentiator: "Requires expensive subscription ($20+/month). Desktop software installation needed." },
        { name: "Smallpdf", description: "Popular online PDF converter", differentiator: "Uploads files to cloud servers. Free tier limited to 2 tasks per day." },
        { name: "iLovePDF", description: "Web-based PDF toolkit", differentiator: "Files are uploaded to servers and processed remotely. Ads on free tier." },
        { name: "Google Docs", description: "Can open PDFs and convert to editable format", differentiator: "Requires Google account. Formatting is often lost during conversion." },
      ],
      whyUs: "ToolsePulse processes everything in your browser. Zero file uploads means complete privacy. No account needed, no daily limits, no watermarks. Your sensitive documents never touch a remote server.",
    },
    useCases: [
      { title: "Editing contracts and agreements", description: "Convert received PDF contracts to Word to make amendments, add clauses, or update terms before sending back." },
      { title: "Updating resumes", description: "If you only have your resume as a PDF, convert it to Word to update your experience, skills, and contact information." },
      { title: "Extracting content for reports", description: "Pull text, tables, and data from PDF reports into Word for reuse in your own documents and presentations." },
      { title: "Academic work", description: "Convert PDF research papers and textbook excerpts to Word for annotating, citing, and incorporating into your own papers." },
      { title: "Archival and accessibility", description: "Convert old PDF documents to editable Word files for easier searching, archival, and accessibility compliance." },
    ],
  },
  "word-to-pdf": {
    toolSlug: "word-to-pdf",
    howTo: {
      title: "How to Convert Word to PDF Online",
      steps: [
        { title: "Open the Word to PDF tool", description: "Go to the tool page. You'll see an upload area ready for your document." },
        { title: "Upload your Word document", description: "Drag and drop your .doc or .docx file, or click to browse. The tool handles all Word formats." },
        { title: "Convert instantly", description: "The tool processes your document in the browser, converting it to PDF while preserving all formatting, fonts, and images." },
        { title: "Download your PDF", description: "Save the converted PDF to your device. It's ready to share, print, or upload anywhere." },
      ],
      tips: [
        "Fonts embedded in your Word document will be preserved in the PDF output.",
        "Images and charts maintain their quality and positioning during conversion.",
        "Headers, footers, page numbers, and tables of contents are all preserved.",
        "For documents with custom fonts, make sure the fonts are embedded in the Word file for best results.",
      ],
    },
    faq: [
      { question: "Will my formatting be preserved?", answer: "Yes. The converter maintains fonts, images, tables, headers, footers, and page layout from your original Word document." },
      { question: "Can I convert .doc files or only .docx?", answer: "Both .doc (legacy Word) and .docx (modern Word) formats are supported." },
      { question: "Is there a page limit?", answer: "No page limit. Convert documents of any length for free." },
      { question: "Do I need Microsoft Word installed?", answer: "No. The tool works entirely in your browser without any software installation." },
      { question: "Can I convert multiple Word files at once?", answer: "Currently the tool processes one document at a time. For multiple files, convert them one after another." },
    ],
    alternatives: {
      intro: "Converting Word to PDF is a common task with many solutions. Here's how the alternatives stack up.",
      tools: [
        { name: "Microsoft Word", description: "Built-in 'Save as PDF' feature", differentiator: "Requires Microsoft Office license. Desktop software only." },
        { name: "Google Docs", description: "Open Word file and download as PDF", differentiator: "Requires Google account and internet. May alter complex formatting." },
        { name: "LibreOffice", description: "Free office suite with PDF export", differentiator: "Requires software installation. May not handle all Word formatting perfectly." },
      ],
      whyUs: "No software to install, no account to create. Upload your Word file, get a PDF in seconds. Everything processed privately in your browser.",
    },
    useCases: [
      { title: "Sharing final documents", description: "Convert your finished reports, proposals, or letters to PDF so recipients can't accidentally modify them." },
      { title: "Job applications", description: "Most employers prefer PDF resumes and cover letters. Convert your Word documents to PDF before submitting." },
      { title: "Printing", description: "PDFs render consistently across all printers and devices, ensuring your document looks exactly as intended." },
      { title: "Email attachments", description: "PDFs are universally readable and often smaller than Word files, making them ideal for email attachments." },
    ],
  },
  "pdf-compressor": {
    toolSlug: "pdf-compressor",
    howTo: {
      title: "How to Compress a PDF File Online",
      steps: [
        { title: "Open the PDF Compressor", description: "Navigate to the tool page. No account or login required." },
        { title: "Upload your PDF", description: "Drag and drop your PDF file or click to select it from your device." },
        { title: "Choose compression level", description: "Select your preferred balance between file size and quality. Higher compression means smaller files with slightly reduced image quality." },
        { title: "Download compressed PDF", description: "Save your compressed file. The tool shows you exactly how much space you saved." },
      ],
      tips: [
        "For email attachments, most providers have a 25MB limit. Compress PDFs to stay well under this threshold.",
        "PDFs with lots of high-resolution images benefit most from compression — you can often reduce size by 60-80%.",
        "Text-heavy PDFs are already small and may not compress significantly further.",
        "The tool preserves text quality perfectly — only embedded images are compressed.",
      ],
    },
    faq: [
      { question: "How much can I reduce my PDF size?", answer: "Typically 40-80% for PDFs with images. Text-heavy PDFs with few images may only compress by 10-20%." },
      { question: "Will compression affect text quality?", answer: "No. Text, fonts, and vector graphics remain perfectly crisp. Only embedded raster images are compressed." },
      { question: "Can I compress a PDF below a specific size?", answer: "The compression level slider lets you target different size-quality tradeoffs. Try different settings to hit your target size." },
      { question: "Is there a file size limit?", answer: "No strict limit since processing is local. Very large PDFs will take longer but will still work." },
    ],
    alternatives: {
      intro: "PDF compression tools are widely available, but privacy and quality vary significantly.",
      tools: [
        { name: "Adobe Acrobat Pro", description: "Professional PDF compression", differentiator: "Paid subscription required. Best compression quality but expensive." },
        { name: "Smallpdf", description: "Online PDF compressor", differentiator: "Uploads files to cloud. Free tier limited to 2 compressions per day." },
        { name: "iLovePDF", description: "Web-based PDF compressor", differentiator: "Files processed on remote servers. Shows ads on free tier." },
      ],
      whyUs: "Compress PDFs with zero file uploads. Your documents stay on your device the entire time. No daily limits, no ads, no watermarks.",
    },
    useCases: [
      { title: "Email attachments", description: "Compress large PDFs to fit within email size limits (typically 25MB)." },
      { title: "Website uploads", description: "Reduce PDF size for faster downloads when hosting documents on your website." },
      { title: "Cloud storage", description: "Save storage space by compressing PDFs before uploading to Google Drive, Dropbox, or OneDrive." },
      { title: "Form submissions", description: "Many online forms have file size limits. Compress your PDFs to meet upload requirements." },
    ],
  },
  "merge-pdf": {
    toolSlug: "merge-pdf",
    howTo: {
      title: "How to Merge PDF Files Online",
      steps: [
        { title: "Open the Merge PDF tool", description: "Go to the tool page. Ready to use immediately — no login needed." },
        { title: "Add your PDF files", description: "Drag and drop all the PDFs you want to combine. Add as many files as you need." },
        { title: "Reorder if needed", description: "Drag files into your preferred order. The merged document will follow this sequence." },
        { title: "Merge and download", description: "Click merge and download your combined PDF. All pages are joined into a single document." },
      ],
      tips: [
        "Name your files logically (01-intro.pdf, 02-body.pdf) to make ordering easier.",
        "Each PDF's page orientation is preserved — landscape and portrait pages can coexist.",
        "Bookmarks and table of contents from individual PDFs may not be merged automatically.",
        "The output file size equals roughly the sum of all input files.",
      ],
    },
    faq: [
      { question: "How many PDFs can I merge at once?", answer: "There's no fixed limit. You can merge as many PDF files as your browser can handle — typically dozens of files work fine." },
      { question: "Will the page quality be affected?", answer: "No. Merging simply combines pages — there's zero quality loss." },
      { question: "Can I reorder pages within the merged document?", answer: "You can reorder entire files before merging. For page-level reordering within a file, you'd need a PDF editor." },
      { question: "Does it work with encrypted PDFs?", answer: "Unprotected and view-only PDFs work fine. Password-protected PDFs that require a password to open cannot be merged directly." },
    ],
    alternatives: {
      intro: "Merging PDFs is a common need with solutions ranging from desktop software to online tools.",
      tools: [
        { name: "Adobe Acrobat", description: "Professional PDF merging", differentiator: "Paid subscription. Desktop software." },
        { name: "Smallpdf", description: "Online PDF merger", differentiator: "Cloud-based processing. Daily limits on free tier." },
        { name: "Preview (macOS)", description: "Built-in Mac PDF tool", differentiator: "macOS only. Limited to drag-and-drop page merging." },
      ],
      whyUs: "Merge unlimited PDFs in your browser. No file uploads, no limits, no watermarks. Works on any device with a web browser.",
    },
    useCases: [
      { title: "Assembling reports", description: "Combine separate report sections, appendices, and cover pages into one professional document." },
      { title: "Expense reports", description: "Merge multiple receipts and invoices into a single PDF for expense submissions." },
      { title: "Application packages", description: "Combine resume, cover letter, portfolio, and references into one application document." },
      { title: "Legal documents", description: "Merge multiple contract pages, addendums, and exhibits into a single case file." },
    ],
  },
  "image-compressor": {
    toolSlug: "image-compressor",
    howTo: {
      title: "How to Compress Images Online Without Losing Quality",
      steps: [
        { title: "Open the Image Compressor", description: "Navigate to the tool. Works instantly — no signup required." },
        { title: "Upload your images", description: "Drop one or multiple images. Supports JPG, PNG, and WebP formats." },
        { title: "Adjust quality settings", description: "Use the quality slider to balance file size vs visual quality. 80% quality is typically ideal for most uses." },
        { title: "Download compressed images", description: "Save your optimized images. The tool shows the original vs compressed size for each file." },
      ],
      tips: [
        "For web use, 75-85% JPEG quality is usually indistinguishable from the original.",
        "PNG files with solid colors compress better than photographic PNGs.",
        "WebP typically achieves 25-35% smaller files than JPEG at equivalent visual quality.",
        "Batch compression lets you optimize entire folders of images at once.",
        "Always keep your original files — compress copies for distribution.",
      ],
    },
    faq: [
      { question: "How much can images be compressed?", answer: "Typically 40-80% size reduction for JPEG photos at 80% quality. PNG compression varies based on image content — graphics compress more than photos." },
      { question: "Will my images look worse?", answer: "At 80% quality, compression artifacts are invisible to the human eye. Below 60%, you may start to notice slight quality loss." },
      { question: "What image formats are supported?", answer: "JPG/JPEG, PNG, and WebP are all supported for both input and output." },
      { question: "Can I compress multiple images at once?", answer: "Yes. Drop multiple files and they'll all be compressed with your chosen settings." },
      { question: "Do you store my images?", answer: "No. All processing happens in your browser. Your images never leave your device." },
    ],
    alternatives: {
      intro: "Image compression tools are essential for web developers, designers, and anyone sharing images online.",
      tools: [
        { name: "TinyPNG", description: "Popular online image compressor", differentiator: "Uploads to servers. Free tier limited to 20 images per batch, max 5MB each." },
        { name: "Squoosh (Google)", description: "Browser-based image optimizer", differentiator: "Excellent quality but processes one image at a time. No batch support." },
        { name: "ImageOptim (Mac)", description: "Desktop image optimizer", differentiator: "macOS only. Requires software installation." },
      ],
      whyUs: "Batch compress images in your browser with zero uploads. No limits on file count or size. Your images stay completely private.",
    },
    useCases: [
      { title: "Website optimization", description: "Compress images to improve page load speed and Core Web Vitals scores for better SEO." },
      { title: "Email attachments", description: "Reduce image sizes to send more photos in a single email without hitting size limits." },
      { title: "Social media", description: "Optimize images before uploading to prevent platforms from applying aggressive compression." },
      { title: "E-commerce listings", description: "Compress product photos for faster loading product pages that convert better." },
    ],
  },
  "image-resizer": {
    toolSlug: "image-resizer",
    howTo: {
      title: "How to Resize Images Online",
      steps: [
        { title: "Open the Image Resizer", description: "Go to the tool page. Ready to use instantly." },
        { title: "Upload your image", description: "Drop your image or click to select. Supports JPG, PNG, and WebP." },
        { title: "Set dimensions", description: "Enter your desired width and height. Lock aspect ratio to prevent distortion, or unlock for custom proportions." },
        { title: "Download resized image", description: "Save your resized image in your preferred format." },
      ],
      tips: [
        "Always resize down, not up. Enlarging images reduces quality.",
        "Lock the aspect ratio to prevent stretching or squishing.",
        "Common social media sizes: Instagram (1080x1080), Twitter (1600x900), Facebook (1200x630).",
        "For retina displays, export at 2x your target display size.",
      ],
    },
    faq: [
      { question: "Can I resize without losing quality?", answer: "Resizing down preserves quality perfectly. Resizing up (enlarging) will reduce quality since the tool needs to create new pixels. For upscaling, use our AI Image Upscaler instead." },
      { question: "Can I resize to exact pixel dimensions?", answer: "Yes. Enter exact width and height values. You can also lock aspect ratio to resize proportionally." },
      { question: "What's the maximum output size?", answer: "There's no limit on output dimensions, though extremely large images may be slow to process in the browser." },
      { question: "Can I resize multiple images at once?", answer: "Currently the tool handles one image at a time. Process them sequentially for batch resizing." },
    ],
    alternatives: {
      intro: "Image resizing is available in many tools, from professional editors to simple online utilities.",
      tools: [
        { name: "Photoshop", description: "Professional image editor", differentiator: "Expensive subscription. Overkill for simple resizing." },
        { name: "Canva", description: "Online design tool with resize feature", differentiator: "Requires account. Premium features locked behind paywall." },
        { name: "BulkResizePhotos", description: "Online batch resizer", differentiator: "Uploads images to servers. Limited format support." },
      ],
      whyUs: "Resize images instantly in your browser. No account, no uploads, no quality loss. Simple and fast for any device.",
    },
    useCases: [
      { title: "Social media posts", description: "Resize images to exact dimensions required by Instagram, Twitter, Facebook, and LinkedIn." },
      { title: "Website thumbnails", description: "Create consistently sized thumbnails for blog posts, product listings, and galleries." },
      { title: "Print preparation", description: "Resize images to specific print dimensions (4x6, 5x7, 8x10) at the correct resolution." },
      { title: "Profile pictures", description: "Crop and resize photos to common profile picture dimensions across platforms." },
    ],
  },
  "background-remover": {
    toolSlug: "background-remover",
    howTo: {
      title: "How to Remove Image Backgrounds Online with AI",
      steps: [
        { title: "Open the Background Remover", description: "Go to the tool page. No signup or login required." },
        { title: "Upload your image", description: "Drop an image with a subject you want to isolate. Works with photos, product shots, and portraits." },
        { title: "AI processes automatically", description: "The AI identifies your subject and removes the background. This takes a few seconds depending on image complexity." },
        { title: "Download transparent PNG", description: "Save your image with the background removed as a transparent PNG, ready for use in designs." },
      ],
      tips: [
        "High contrast between subject and background gives the best results.",
        "Well-lit photos produce cleaner cutouts than dark or shadowy images.",
        "For product photos, shoot on a solid-colored background for best accuracy.",
        "Hair and fur edges are handled well by the AI, but very fine details may need touch-up.",
        "Use the transparent PNG output to place your subject on any background in design tools.",
      ],
    },
    faq: [
      { question: "How accurate is the AI background removal?", answer: "Very accurate for clear subjects with defined edges. It handles hair, fur, and complex shapes well. Transparent or semi-transparent subjects are more challenging." },
      { question: "Is this really processed in my browser?", answer: "The AI model runs in your browser using WebAssembly. No files are uploaded to any server." },
      { question: "What image formats are supported?", answer: "JPG, PNG, and WebP images are all supported as input. Output is always a transparent PNG." },
      { question: "Can I remove backgrounds from multiple images?", answer: "Process one image at a time for best quality. Each removal takes only a few seconds." },
      { question: "Does it work with complex backgrounds?", answer: "Yes. The AI can handle busy backgrounds, gradients, and outdoor scenes. The clearer the subject stands out, the better the results." },
    ],
    alternatives: {
      intro: "AI background removal has become a common feature across many platforms. Here's how they compare.",
      tools: [
        { name: "Remove.bg", description: "Dedicated background removal service", differentiator: "Uploads images to servers. Free tier provides low-resolution output only." },
        { name: "Canva", description: "Design tool with background remover", differentiator: "Requires account. Background removal is a premium feature." },
        { name: "Photoshop", description: "Professional editing with AI selection", differentiator: "Expensive subscription. Complex interface for a simple task." },
      ],
      whyUs: "Full-resolution output for free. No uploads to remote servers. No account needed. The AI runs directly in your browser for complete privacy.",
    },
    useCases: [
      { title: "E-commerce product photos", description: "Remove backgrounds from product images for clean, professional listing photos on Amazon, Shopify, and eBay." },
      { title: "Social media content", description: "Create cut-out stickers, profile pictures, and layered graphics for posts and stories." },
      { title: "Professional headshots", description: "Remove distracting backgrounds from headshots for LinkedIn, company websites, and ID photos." },
      { title: "Design and marketing", description: "Isolate subjects for flyers, banners, presentations, and any design project needing transparency." },
    ],
  },
  "qr-code-generator": {
    toolSlug: "qr-code-generator",
    howTo: {
      title: "How to Create a QR Code for Free",
      steps: [
        { title: "Open the QR Code Generator", description: "Navigate to the tool. Ready to use immediately." },
        { title: "Select content type", description: "Choose what your QR code should contain — URL, plain text, WiFi credentials, email, or other data types." },
        { title: "Enter your data", description: "Type or paste the content. The QR code updates in real-time as you type." },
        { title: "Download your QR code", description: "Save as high-resolution PNG for print or SVG for scalable vector output." },
      ],
      tips: [
        "Always test your QR code by scanning it before printing or sharing.",
        "Use short URLs to keep the QR code simple — simpler codes scan faster.",
        "For print materials, download the SVG version for crisp output at any size.",
        "Leave adequate white space (quiet zone) around the code for reliable scanning.",
        "Avoid making QR codes smaller than 2cm × 2cm (about 0.8 inches) in print.",
      ],
    },
    faq: [
      { question: "Do QR codes expire?", answer: "Static QR codes (which this tool generates) never expire. The data is encoded directly in the pattern, so it works forever." },
      { question: "What can I put in a QR code?", answer: "URLs, plain text, WiFi credentials, email addresses, phone numbers, and more. Each type triggers different actions when scanned." },
      { question: "What's the difference between PNG and SVG output?", answer: "PNG is a raster image — great for digital use and printing at a fixed size. SVG is a vector image — it scales to any size without losing quality, ideal for large format printing." },
      { question: "Can I customize the colors?", answer: "The tool generates standard black-and-white QR codes for maximum scan reliability. Always ensure high contrast between the code and background." },
      { question: "How do I scan a QR code?", answer: "Most modern phones have QR scanning built into the camera app. Just point your camera at the code and tap the notification that appears." },
    ],
    alternatives: {
      intro: "QR code generators are widely available online. Quality and feature sets vary significantly.",
      tools: [
        { name: "QR Code Monkey", description: "Feature-rich QR code generator", differentiator: "Supports custom designs and logos. Requires email for high-res downloads." },
        { name: "QRCode Generator (qr-code-generator.com)", description: "Commercial QR platform", differentiator: "Free tier adds watermarks. Dynamic QR codes require paid plan." },
        { name: "Google Charts API", description: "Programmatic QR code generation", differentiator: "Requires technical knowledge. No user interface." },
      ],
      whyUs: "Generate high-resolution QR codes instantly. No watermarks, no signup, no tracking. Download print-ready PNG or SVG files for free.",
    },
    useCases: [
      { title: "Business cards", description: "Add a QR code linking to your website, LinkedIn, or digital portfolio for easy contact sharing." },
      { title: "Restaurant menus", description: "Create QR codes linking to digital menus. Update the menu content without reprinting codes." },
      { title: "WiFi sharing", description: "Generate a QR code with your WiFi credentials so guests can connect by scanning instead of typing passwords." },
      { title: "Event tickets and flyers", description: "Link to event pages, ticket purchases, or registration forms from printed materials." },
      { title: "Product packaging", description: "Add QR codes to packaging linking to product manuals, warranty registration, or how-to videos." },
    ],
  },
  "heic-to-jpg": {
    toolSlug: "heic-to-jpg",
    howTo: {
      title: "How to Convert HEIC to JPG Online",
      steps: [
        { title: "Open the HEIC to JPG Converter", description: "Go to the tool page. No app installation or signup needed." },
        { title: "Upload HEIC files", description: "Drop your iPhone HEIC photos onto the upload area. Batch conversion is supported." },
        { title: "Convert automatically", description: "The tool converts each HEIC file to standard JPG format instantly in your browser." },
        { title: "Download JPG files", description: "Save your converted photos. They're now compatible with every device and platform." },
      ],
      tips: [
        "HEIC files are typically 30-50% smaller than equivalent JPGs, so converted files will be slightly larger.",
        "Quality is preserved during conversion — there's no visible difference between the HEIC original and JPG output.",
        "To prevent this issue going forward, change your iPhone camera settings to 'Most Compatible' in Settings > Camera > Formats.",
        "Batch convert multiple files at once to save time when processing an entire photo album.",
      ],
    },
    faq: [
      { question: "What is HEIC format?", answer: "HEIC (High Efficiency Image Container) is Apple's default photo format since iOS 11. It offers better compression than JPEG but isn't universally supported on non-Apple devices." },
      { question: "Why can't I open HEIC files on Windows?", answer: "Windows doesn't natively support HEIC. You need to either install a codec from the Microsoft Store or convert files to JPG for universal compatibility." },
      { question: "Is there quality loss when converting?", answer: "Minimal. HEIC already uses lossy compression, and converting to JPG applies its own lossy compression, but at high quality settings the difference is imperceptible." },
      { question: "Can I convert HEIC to PNG instead?", answer: "This tool converts to JPG specifically. For PNG output, use our image converter tool." },
      { question: "How do I stop my iPhone from saving HEIC?", answer: "Go to Settings > Camera > Formats and select 'Most Compatible.' This saves all future photos as JPG by default." },
    ],
    alternatives: {
      intro: "HEIC to JPG conversion is needed by millions of iPhone users who share photos with non-Apple devices.",
      tools: [
        { name: "iMazing HEIC Converter", description: "Desktop HEIC converter", differentiator: "Requires software installation. Desktop only." },
        { name: "CloudConvert", description: "Online file converter", differentiator: "Uploads files to servers. Free tier has daily conversion limits." },
        { name: "Windows HEIC Codec", description: "Microsoft Store extension", differentiator: "Windows only. Adds system-wide HEIC support but doesn't batch convert." },
      ],
      whyUs: "Convert HEIC to JPG instantly in your browser. No app to install, no files uploaded to servers, and no conversion limits.",
    },
    useCases: [
      { title: "Sharing iPhone photos with Android/Windows users", description: "Convert HEIC photos to universally compatible JPG before sending to friends and family on non-Apple devices." },
      { title: "Uploading to websites", description: "Many website builders and CMS platforms don't accept HEIC. Convert to JPG for guaranteed compatibility." },
      { title: "Social media uploads", description: "While most platforms now accept HEIC, converting to JPG ensures compatibility with all platforms and avoids upload errors." },
      { title: "Printing photos", description: "Many photo printing services require JPG format. Convert your HEIC files before ordering prints." },
    ],
  },
  "image-to-pdf": {
    toolSlug: "image-to-pdf",
    howTo: {
      title: "How to Convert Images to PDF Online",
      steps: [
        { title: "Open the Image to PDF Converter", description: "Navigate to the tool page." },
        { title: "Upload your images", description: "Drop multiple images at once. Supports JPG, PNG, and WebP formats." },
        { title: "Arrange page order", description: "Drag images into your desired page sequence." },
        { title: "Convert and download", description: "Click convert and download your multi-page PDF document." },
      ],
      tips: [
        "Images are placed one per page by default, maintaining their original aspect ratio.",
        "Higher resolution images produce sharper PDFs — use the highest quality source images available.",
        "Name your image files logically to make ordering easier before upload.",
      ],
    },
    faq: [
      { question: "Can I combine multiple images into one PDF?", answer: "Yes, that's the primary purpose. Upload multiple images and they'll become separate pages in a single PDF." },
      { question: "What image formats are accepted?", answer: "JPG, PNG, and WebP are all supported." },
      { question: "Will image quality be reduced?", answer: "No. Images are embedded at their original quality in the PDF." },
    ],
    alternatives: {
      intro: "Converting images to PDF is useful for creating photo documents, portfolios, and scanned document compilations.",
      tools: [
        { name: "Adobe Acrobat", description: "Professional PDF creator", differentiator: "Paid subscription required." },
        { name: "Windows Print to PDF", description: "Built-in Windows feature", differentiator: "Desktop only. Limited formatting options." },
      ],
      whyUs: "Convert unlimited images to PDF for free. Reorder pages before conversion. No file uploads needed.",
    },
    useCases: [
      { title: "Creating photo documents", description: "Compile photos into a single PDF for easy sharing and printing." },
      { title: "Digitizing scanned documents", description: "Combine scanned page images into a single PDF document." },
      { title: "Portfolio creation", description: "Create PDF portfolios from design work, photography, or artwork." },
    ],
  },
};

// Generate content for tools that don't have custom entries
export function getToolContent(toolSlug: string): ToolContent | null {
  if (toolContentMap[toolSlug]) return toolContentMap[toolSlug];

  const tool = getToolBySlug(toolSlug);
  if (!tool) return null;

  // Auto-generate basic content from tool data
  return {
    toolSlug,
    howTo: {
      title: `How to Use ${tool.name} Online`,
      steps: [
        { title: `Open ${tool.name}`, description: `Navigate to the ${tool.name} tool page. No signup or account required.` },
        { title: "Upload or enter your data", description: `Provide the input your task requires — upload a file or enter your data directly.` },
        { title: "Process", description: `The tool processes everything instantly in your browser. Your data never leaves your device.` },
        { title: "Download or copy results", description: `Save your output or copy results to your clipboard. Free, no watermarks, no limits.` },
      ],
      tips: [
        "All processing happens locally in your browser for complete privacy.",
        "No account or signup is required to use this tool.",
        "The tool works on any device with a modern web browser.",
      ],
    },
    faq: [
      { question: `Is ${tool.name} free?`, answer: "Yes, completely free with no hidden costs, premium tiers, or usage limits." },
      { question: "Do you upload my files?", answer: "No. All processing happens in your browser. Your files never leave your device." },
      { question: "Does it work on mobile?", answer: "Yes. The tool is fully responsive and works on phones, tablets, and desktops." },
      { question: "Do I need to create an account?", answer: "No. The tool works instantly without any registration or login." },
    ],
    alternatives: {
      intro: `There are several options for this type of tool. Here's why ${tool.name} on ToolsePulse stands out.`,
      tools: [],
      whyUs: `Free, private, and instant. No file uploads to servers, no account needed, no usage limits. ${tool.name} runs entirely in your browser.`,
    },
    useCases: [
      { title: "Personal use", description: `Use ${tool.name} for your personal projects and everyday tasks.` },
      { title: "Professional work", description: `${tool.name} is suitable for professional workflows where privacy and speed matter.` },
      { title: "On-the-go access", description: `Access ${tool.name} from any device — phone, tablet, or desktop — whenever you need it.` },
    ],
  };
}
