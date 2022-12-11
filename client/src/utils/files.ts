
export const DataTansferToFiles = (dataTransfer: DataTransfer) => {
    return (dataTransfer?.items) ?
        Array.from(dataTransfer.items)
            .filter(item => item?.kind === 'file')
            .map(item => item.getAsFile()) :
        Array.from(dataTransfer.files);
};

export const filterFiles = (files: (File | null)[]) => {
    return files
        .filter(file => file !== null)
        .filter(file => /pdf|jpe?g|gif/.test(file?.type || ''));
};

export const getFilesFromEvent = (e: React.DragEvent) => {
    let files = DataTansferToFiles(e.dataTransfer);
    return filterFiles(files);
};