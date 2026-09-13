const SAMPLE_RATE = 8_000
const SAMPLE_COUNT = 800

function writeAscii(view: DataView, offset: number, value: string): void {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index))
  }
}

/** WAV PCM mono válido con 100 ms de silencio para pruebas sin voz real. */
function createFakeWavBytes(): Uint8Array {
  const bytes = new Uint8Array(44 + SAMPLE_COUNT)
  const view = new DataView(bytes.buffer)
  writeAscii(view, 0, 'RIFF')
  view.setUint32(4, 36 + SAMPLE_COUNT, true)
  writeAscii(view, 8, 'WAVE')
  writeAscii(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, SAMPLE_RATE, true)
  view.setUint32(28, SAMPLE_RATE, true)
  view.setUint16(32, 1, true)
  view.setUint16(34, 8, true)
  writeAscii(view, 36, 'data')
  view.setUint32(40, SAMPLE_COUNT, true)
  bytes.fill(128, 44)
  return bytes
}

export const FAKE_WAV_BYTES = createFakeWavBytes()
