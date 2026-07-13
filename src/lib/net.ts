// Subnetting-Berechnungen (IPv4). 32-Bit-Arithmetik mit >>> 0 (unsigned).

export interface SubnetInfo {
  cidr: number
  maskStr: string
  networkStr: string
  broadcastStr: string
  firstHostStr: string
  lastHostStr: string
  usableHosts: number
  blockSize: number
}

function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, o) => ((acc << 8) + Number(o)) >>> 0, 0) >>> 0
}

function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
}

export function subnetInfo(ip: string, cidr: number): SubnetInfo {
  const maskInt = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0
  const ipInt = ipToInt(ip)
  const networkInt = (ipInt & maskInt) >>> 0
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0
  const size = 2 ** (32 - cidr)
  const usableHosts = cidr >= 31 ? 0 : size - 2
  return {
    cidr,
    maskStr: intToIp(maskInt),
    networkStr: intToIp(networkInt),
    broadcastStr: intToIp(broadcastInt),
    firstHostStr: intToIp((networkInt + 1) >>> 0),
    lastHostStr: intToIp((broadcastInt - 1) >>> 0),
    usableHosts,
    blockSize: size,
  }
}

/** 32 Bits als Array; erste `cidr` Bits = Netzanteil (true = Netz). */
export function maskBits(cidr: number): boolean[] {
  return Array.from({ length: 32 }, (_, i) => i < cidr)
}

export interface SubnetDrill {
  ip: string
  cidr: number
  info: SubnetInfo
}

/** Generiert eine zufällige /25../30-Aufgabe (Maske im letzten Oktett → gut lernbar). */
export function randomDrill(): SubnetDrill {
  const cidr = 25 + Math.floor(Math.random() * 6) // 25..30
  const ip = `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
  return { ip, cidr, info: subnetInfo(ip, cidr) }
}
