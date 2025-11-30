export const handleDownload = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.log("Download failed:", err);
  }
};

