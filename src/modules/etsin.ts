
import type { Dataset, MetadataParse } from '@/shared/types'
import { currentLocale } from './locale';
import { URLS } from '@/shared/constants';

// Fetch a dataset's metadata from Etsin and parse it
export async function fetchEtsinMetadata(dataset: Dataset): Promise<MetadataParse> {
  const response = await fetch(`${URLS.ETSIN_METADATA_JSON_BASE}${dataset.meta}`)
  if (!response.ok) throw new Error(`HTTP code ${response.status}`)
  return parseMetadata(await response.json());
}

interface MetadataLike {
  research_dataset: {
    remote_resources: {
      title: string
      download_url: {
        identifier: string
      }
    }[]
    description: {
      fi: string
      en: string
    }
  }
}

// For extracting a human-readable description from Etsin metadata
function parseMetadata(metadata: MetadataLike): MetadataParse {

  const resources = metadata.research_dataset.remote_resources || []
  const links = resources
    .filter((item) =>
      item.title &&
      item.download_url?.identifier &&
      !item.download_url.identifier.toLowerCase().includes('paituli.csc.fi/download')
    )
    .map((item) => ({
      title: item.title,
      url: item.download_url.identifier,
    }))

  const descObj = metadata.research_dataset.description || {}
  const desc = currentLocale.value == 'fi' ? descObj.fi : descObj.en

  const parseMarkdownishText = (text: string): string => {
    // Markdown-style [title](url)
    text = text.replace(/\[([^\]]+)\]\((http.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    // <http://example.com>
    text = text.replace(/<http(.*?)>/g, '<a href="http$1" target="_blank">http$1</a>')
    // Line breaks
    return text.replace(/(\r\n|\n|\r)/gm, '<br>')
    // Would we need further sanitization?
  }

  return {
    description: parseMarkdownishText(desc ?? ''),
    links: links
  }
}
