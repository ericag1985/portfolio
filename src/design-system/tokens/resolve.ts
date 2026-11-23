export type TokenMap = Map<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function collectTokens(
  node: unknown,
  path: string[],
  into: TokenMap,
): void {
  if (!isRecord(node)) {
    return;
  }

  if ('$value' in node) {
    into.set(path.join('.'), node.$value);
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) {
      continue;
    }
    collectTokens(value, path.concat(key), into);
  }
}

export function resolveValue(name: string, tokens: TokenMap): unknown {
  const seen: string[] = [];

  function resolve(tokenName: string): unknown {
    if (!tokens.has(tokenName)) {
      throw new Error(`Missing token ${tokenName}.`);
    }

    const value = tokens.get(tokenName);
    if (typeof value !== 'string') {
      return value;
    }

    const match = /^\{([^{}]+)\}$/.exec(value.trim());
    const reference = match?.[1];
    if (!reference) {
      return value;
    }

    if (seen.includes(reference)) {
      throw new Error(
        `Circular token reference: ${seen.concat(reference).join(' → ')}.`,
      );
    }

    seen.push(reference);
    return resolve(reference);
  }

  return resolve(name);
}

export function colorHex(value: unknown): string {
  if (!isRecord(value) || typeof value.hex !== 'string') {
    throw new Error(
      `Expected a DTCG color, received ${JSON.stringify(value)}.`,
    );
  }

  const hex = value.hex.toLowerCase();
  if (!/^#[0-9a-f]{6}$/.test(hex)) {
    throw new Error(`Expected a 6-digit hex color, received ${value.hex}.`);
  }

  return hex;
}

function linearChannel(hex: string, offset: number): number {
  const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
  if (channel <= 0.04045) {
    return channel / 12.92;
  }
  return ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  return (
    0.2126 * linearChannel(hex, 1) +
    0.7152 * linearChannel(hex, 3) +
    0.0722 * linearChannel(hex, 5)
  );
}

export function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}
