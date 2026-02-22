export const useMevzuatViewModel = () => {
  const folderId = '1Ccxi4n-aD7yW1wij05KZeld9QuFruLrO'
  const driveUrl = `https://drive.google.com/drive/folders/${folderId}`

  const refreshWebView = () => {
    const wv = document.querySelector('webview') as any
    if (wv) wv.reload()
  }

  const openExternal = () => {
    window.open(driveUrl, '_blank')
  }

  return {
    driveUrl,
    refreshWebView,
    openExternal
  }
}
