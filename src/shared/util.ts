import { useLocale } from '@/composables/locale';

const { currentLocale } = useLocale()

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

export type MetadataParse = {
  description: string,
  links: { title: string, url: string }[]
}

// Extract dataset description from metadata
export function parseMetadata(metadata: any): MetadataParse | null {
  if (!metadata || !metadata.research_dataset) {
    return null
  }

  const resources = metadata.research_dataset.remote_resources || []
  const links: { title: string, url: string }[] = resources
    .filter((item: any) =>
      item.title &&
      item.download_url?.identifier &&
      !item.download_url.identifier.toLowerCase().includes('paituli.csc.fi/download')
    )
    .map((item: any) => ({
      title: item.title,
      url: item.download_url.identifier,
    }))

  const descObj = metadata.research_dataset.description || {}
  const desc = currentLocale.value == 'fi' ? descObj.fi : descObj.en
  return {
    description: parseMarkdownishText(desc ?? ''),
    links: links
  }
}

function parseMarkdownishText(text: string): string {
  // Markdown-style [title](url)
  text = text.replace(/\[([^\]]+)\]\((http.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
  // <http://example.com>
  text = text.replace(/<http(.*?)>/g, '<a href="http$1" target="_blank">http$1</a>')
  // Line breaks
  return text.replace(/(\r\n|\n|\r)/gm, '<br>')

  // Would we need further sanitization?
}