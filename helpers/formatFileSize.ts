export default function formatFileSize(bytes: number) {
    const sizeInMB = Math.round(bytes/(1024*1024));
    const sizeInKB = Math.round(bytes/1024);
    return sizeInMB ? sizeInMB + " MB" : sizeInKB ? sizeInKB + " KB": bytes + " B";
}