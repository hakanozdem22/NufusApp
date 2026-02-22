interface MevzuatWebviewProps {
  driveUrl: string
}

export const MevzuatWebview = ({ driveUrl }: MevzuatWebviewProps) => {
  return (
    <div className="flex-1 mx-4 mt-2 mb-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative transition-colors">
      {/* @ts-ignore */}
      <webview
        src={driveUrl}
        partition="persist:google"
        useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        style={{ width: '100%', height: '100%', border: 'none' }}
        allowpopups={true}
      ></webview>
    </div>
  )
}
