
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
    .then(() => {
      // show a toast/notification instead?
      console.log('Copied:', text)
    })
    .catch(err => {
      console.error('Failed to copy: ', err)
    })
}