export interface FileWithPreview extends File {
  preview?: string;
}

export interface ProcessingState {
  status: "idle" | "processing" | "complete" | "error";
  progress: number;
  message: string;
}

export interface ToolPageProps {
  params: Promise<{ slug: string }>;
}
