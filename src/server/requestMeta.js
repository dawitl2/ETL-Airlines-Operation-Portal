import { UAParser } from 'ua-parser-js'

export function getRequestMeta(request) {
  const userAgent = request.headers.get('user-agent') || ''
  const parsed = new UAParser(userAgent).getResult()
  const ipAddress =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  return {
    browser: parsed.browser.name ? `${parsed.browser.name} ${parsed.browser.version || ''}`.trim() : 'Unknown browser',
    deviceName: parsed.device.vendor || parsed.device.model || 'Unknown device',
    ipAddress,
    operatingSystem: parsed.os.name ? `${parsed.os.name} ${parsed.os.version || ''}`.trim() : 'Unknown OS',
    userAgent,
  }
}
