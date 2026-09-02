import { ref } from 'vue'

// Counts the traffic one download generates, so that anything doing the
// fetching can report the same thing. There is no other way to see it: an <img>
// reports no progress, and geotiff.js only exposes its reads through a custom
// loader.
export function useTransfer() {
  const bytesRead = ref(0)
  const bytesExpected = ref(0)
  // Requests still open. Tile events alone cannot tell whether anything is
  // happening, because a source reads a file's metadata before asking for its
  // first tile, and for a file whose directory sits at the end that read is
  // most of the wait.
  const inFlight = ref(0)

  function reset() {
    bytesRead.value = 0
    bytesExpected.value = 0
    inFlight.value = 0
  }

  // Counts a body as it streams. Content-Length is known sooner, but a read
  // arriving in tens of megabytes per request would then jump to its total on
  // the first header and sit still for the whole download.
  function track(response: Response, settled: () => void): Response {
    const length = Number(response.headers.get('content-length'))
    if (Number.isFinite(length)) bytesExpected.value += length
    if (!response.body) {
      settled()
      return response
    }

    const counter = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        bytesRead.value += chunk.byteLength
        controller.enqueue(chunk)
      },
      flush: settled,
    })
    return new Response(response.body.pipeThrough(counter), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  }

  // Marks a read as outstanding and hands back the way to close it. Exported
  // for reads whose bytes cannot be counted - ones made by a library holding
  // its own fetch - which should still keep the indicator up while they run.
  function open() {
    inFlight.value++
    return () => inFlight.value = Math.max(0, inFlight.value - 1)
  }

  // A whole file at once, so its Content-Length is a real total
  async function fetchAll(url: string): Promise<Blob> {
    const settled = open()
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return track(response, settled).blob()
    } catch (cause) {
      // A stream that fails part way never reaches the flush above, so this is
      // still the only place the read is closed.
      settled()
      throw cause
    }
  }

  // The shape a GeoTIFF source wants for its `loader`, which routes every range
  // request geotiff.js makes through the counter above. A non-ok status is
  // passed through rather than raised, for geotiff.js to interpret itself.
  function loader(url: string, headers: HeadersInit, signal: AbortSignal) {
    const settled = open()
    return fetch(url, { headers, signal }).then(
      (response) => track(response, settled),
      (cause) => {
        settled()
        throw cause
      },
    )
  }

  return {
    bytesRead,
    bytesExpected,
    inFlight,
    reset,
    open,
    fetchAll,
    loader,
  }
}
