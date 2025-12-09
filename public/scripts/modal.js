document.addEventListener("DOMContentLoaded", () => {
  const shareButton = document.getElementById("share-button")
  const shareDialog = document.getElementById("share-dialog")

  const isCat = shareButton.dataset.isCat
  const isMP4 = shareButton.dataset.isMp4
  const imageId = encodeURIComponent(shareButton.dataset.imageId || '')
  const slipId = encodeURIComponent(shareButton.dataset.slipId || '')

  const shareLink = `${window.location.origin}/share/${isCat}/${isMP4}/${imageId}/${slipId}`


  shareButton.addEventListener('click', () => {
    setClipboard(shareLink)
    shareDialog.showModal()
    setTimeout(() => {
      shareDialog.close()
    }, 2000)
  })
})

async function setClipboard(shareLink) {
  const type = "text/plain"
  const clipboardData = {
    [type]: shareLink,
  }
  const clipBoardItem = new ClipboardItem(clipboardData)
  await navigator.clipboard.write([clipBoardItem])
}