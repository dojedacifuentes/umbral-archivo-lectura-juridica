import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const output = join(process.cwd(), "public", "sounds");
mkdirSync(output, { recursive: true });

const presets = {
  click: [420, 0.055],
  correct: [740, 0.16],
  incorrect: [155, 0.22],
  "level-up": [980, 0.32],
  unlock: [620, 0.28],
  open: [260, 0.18],
  flip: [520, 0.08],
  boss: [92, 0.48],
};

function createWav(frequency, duration) {
  const sampleRate = 22050;
  const count = Math.floor(sampleRate * duration);
  const dataSize = count * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < count; i += 1) {
    const t = i / sampleRate;
    const envelope = Math.max(0, 1 - i / count);
    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.28;
    buffer.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }
  return buffer;
}

for (const [name, [frequency, duration]] of Object.entries(presets)) {
  writeFileSync(join(output, `${name}.wav`), createWav(frequency, duration));
}

console.log(`Generated ${Object.keys(presets).length} original sound cues in ${output}`);
