# Modelo de datos

Este documento describe conceptos, no tablas de una base de datos. El MVP usa archivos para audio/metadatos y almacenamiento local del navegador para progreso.

## Configuración lingüística

```json
{
  "interfaceLanguage": "es",
  "nativeLanguage": "es",
  "learningLanguage": "en",
  "pronunciationLocale": "en-US"
}
```

## PronunciationRequest

- `text`: palabra o frase corta original.
- `locale`: inicialmente `en-US`.
- `modes`: lista de modalidades solicitadas: `natural`, `slow` o `teacher`.

Voz, velocidad y proveedor no forman parte del contrato público inicial. Se resolverán en el backend para evitar acoplar los consumidores a un proveedor.

## PronunciationEntry

- `text` y `kind` (`word` o `phrase`).
- `locale`, inicialmente `en-US`.
- IPA, segmentación silábica y sílaba tónica opcionales.
- traducción, ejemplo en inglés y traducción del ejemplo opcionales.
- fuente/procedencia futura si se incorpora contenido externo.

## PronunciationAudio

- `key`: clave opaca controlada por el backend; nunca una ruta de archivo.
- `mode`: modalidad educativa.
- `mimeType`: únicamente `audio/mpeg` o `audio/wav` en el contrato actual.
- `byteLength` y duración opcional en milisegundos.

`PronunciationResponse` agrupa una `PronunciationEntry` y la lista de audios disponibles.

Ejemplo mínimo válido:

```json
{
  "pronunciation": {
    "text": "hello",
    "kind": "word",
    "locale": "en-US"
  },
  "audio": [
    {
      "key": "mock-natural",
      "mode": "natural",
      "mimeType": "audio/wav",
      "byteLength": 44
    }
  ]
}
```

## Normalización y límites implementados

- Normalización Unicode NFC.
- Separadores Unicode consecutivos convertidos en un espacio ASCII y retirados de los extremos.
- Mayúsculas y puntuación preservadas porque pueden aportar significado.
- Máximo predeterminado configurable de 120 puntos de código.
- Controles C0, DEL y C1 rechazados; no se eliminan silenciosamente durante la normalización.

## AudioIdentity

Incluye texto normalizado, locale, voz, modalidad, velocidad, modelo y versión de configuración/prompt. Su representación canónica se transforma mediante un hash criptográfico; el texto nunca se usa como nombre de archivo.

La versión de serialización inicial es `audio-identity-v1`. Las propiedades se escriben en un orden fijo y la clave es el SHA-256 hexadecimal de 64 caracteres de ese JSON UTF-8. Cambiar texto, locale, voz, modalidad, velocidad, modelo o versión de instrucciones produce otra clave; velocidades no finitas o no positivas se rechazan.

## AudioMetadata

- clave/hash.
- atributos completos de identidad.
- tipo MIME, tamaño y fecha de creación.
- versión de esquema.
- proveedor/modelo sin credenciales.
- estado necesario para validar compatibilidad.

## EducationalContentCacheEntry

- entrada educativa validada;
- modelo y versión del prompt;
- fecha de creación;
- identidad SHA-256 derivada de texto normalizado, locale, modelo y prompt.

El archivo se limita a 64 KiB y el texto nunca forma parte de su nombre.

## Datos locales del usuario

- historial de consultas con fecha y datos mínimos.
- favoritos.
- contador de reproducciones completadas por palabra o frase.
- preferencias de voz, velocidad y modalidad.
- versión del esquema para migraciones.

El esquema local actual es v4. Las versiones v1–v3 migran conservando historial, favoritos y preferencias; v4 añade `practiceCounts`. No se almacenan cuentas en el MVP.
