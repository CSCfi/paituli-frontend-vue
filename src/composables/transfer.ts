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

  function open() {
    inFlight.value++
    return () => inFlight.value = Math.max(0, inFlight.value - 1)
  }

  // A counted fetch whose body is still a stream, for callers that consume it
  // as one - deserializing FlatGeoBuf features, say, rather than waiting for a
  // whole file.
  async function fetchTracked(url: string, init?: RequestInit): Promise<Response> {
    const settled = open()
    try {
      const response = await fetch(url, init)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return track(response, settled)
    } catch (cause) {
      settled()
      throw cause
    }
  }

  // A whole file at once. Unlike a ranged read this has a real total: the file
  // arrives entire, so its Content-Length is a finish line rather than a
  // running tally, and a percentage built on it is exact.
  async function fetchAll(url: string): Promise<Blob> {
    return (await fetchTracked(url)).blob()
  }

  // The shape a GeoTIFF source wants for its `loader`, which routes every range
  // request geotiff.js makes through the counter above. Errors are left to the
  // caller, so a failed range read is not turned into a rejection here.
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
    fetchTracked,
    fetchAll,
    loader,
  }
}
