export interface DocumentCrop {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface DocumentPage {
    id: string;
    file: File;
    previewUrl: string;
    rotation: 0 | 90 | 180 | 270;
    enhance: boolean;
    crop: DocumentCrop;
}
