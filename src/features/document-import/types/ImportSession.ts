import type { ScanResult } from "./ScanResult";

export interface ImportSession {

    id: string;

    imageName: string;

    imageUrls: string[];

    scan: ScanResult;

}
