# Checklist de candidata del MVP web

> Este checklist demuestra una candidata local. No demuestra preparación para
> producción. Antes de cualquier despliegue público deben completarse las
> [13 puertas obligatorias](TESTING.md) y finalizar correctamente
> `npm run predeploy:check`.

## Identidad

- Versión candidata: `0.1.0-rc.1`.
- Alcance: Fases 0 a 6 del MVP web.
- Paquetes internos permanecen privados y en `0.0.0`; la versión raíz identifica el conjunto verificable.
- No existe publicación, tag, commit, remoto, despliegue ni firma asociados a esta candidata.

## Validación obligatoria

El comando canónico es:

```bash
npm run release:check
```

Ejecuta, en orden:

- [x] formato;
- [x] lint;
- [x] TypeScript estricto;
- [x] pruebas de tipos y runtime sin servicios pagos;
- [x] builds web/API/paquetes;
- [x] búsqueda de patrones sensibles en el bundle web;
- [x] enlaces Markdown locales;
- [x] smoke de demo con API efímera.

## Evidencia manual

- [x] Axe en inicio, guía completa, privacidad y 404.
- [x] Skip-link, landmarks, labels, nombres y estados accesibles.
- [x] 320×568, 768×1024 y 1440×900 sin overflow horizontal.
- [x] Consulta `comfortable`, reproducción Web Speech, favorito y preferencias persistentes.
- [x] Consola del navegador sin errores ni advertencias.
- [x] La candidata original tuvo `npm audit --omit=dev` sin vulnerabilidades de producción.
- [ ] La revisión actual informa dos avisos altos transitivos relacionados con RSC Actions; deben resolverse o aceptarse formalmente antes de producción.

## Límites conocidos aceptados

- El WAV simulado no contiene voz; Web Speech ofrece la demo audible según el navegador.
- OpenAI requiere configuración explícita del backend y puede generar costo; no se usó para esta candidata.
- Progreso local no sincroniza dispositivos.
- Hosting, presupuesto, licencia, remoto y publicación siguen siendo decisiones del propietario.
- Capacitor, iOS y Android comienzan después de aceptar la candidata web.

Una falla en cualquier punto invalida la candidata hasta corregirla y repetir `release:check`.

## Checklist Android previo a Google Play

### Evidencia técnica

- [x] Proyecto sincronizable y verificadores móviles verdes.
- [x] APK Debug compilado, firmado con esquema v2 e instalado.
- [x] Samsung S24 en Android 16/API 36.
- [x] Pixel 6 virtual en Android 15/API 35.
- [x] Consulta, navegación, responsive y persistencia local.
- [x] Natural, Lenta y Profesor con audio real en el S24.
- [x] Sin micrófono, cámara, ubicación, contactos ni almacenamiento general.
- [x] HTTP permitido únicamente en Debug; Release exige HTTPS.
- [x] Clave de OpenAI ausente del bundle y del proyecto Android.

### Antes de crear un Release

- [ ] Confirmar nombre, identificador de aplicación y versión.
- [ ] Confirmar dominio y backend HTTPS productivo.
- [ ] Aprobar política de privacidad pública y datos declarados.
- [ ] Crear y respaldar la clave de subida fuera del repositorio.
- [ ] Configurar Play App Signing y canal de prueba interno.
- [ ] Probar el AAB Release en al menos un dispositivo físico.
- [ ] Retirar `VITE_SHOW_DOCUMENTATION` si el centro temporal ya no es necesario.
- [ ] Revisar precios, cuota compartida, presupuesto mensual y alertas del proveedor.
- [ ] Aprobar ficha, capturas, clasificación de contenido y países.
- [ ] Obtener autorización explícita del propietario para subir o publicar.

SmartTalky procesa la palabra o frase en el backend para generar contenido y audio; guarda historial, favoritos, preferencias y contadores únicamente en el dispositivo. No usa cuentas, anuncios ni analítica. Esta descripción debe reflejarse sin contradicciones en la política de privacidad y en la sección de seguridad de datos de Google Play.
