import type { NextApiRequest, NextApiResponse } from "next";
import * as dns from "dns";
const dnsPromises = dns.promises;

export default async function resolveDNS(
  req: NextApiRequest,
  res: NextApiResponse<{ host: string; ips: string[] } | { error: string }>
) {
  const host = req.query.host as string;
  try {
    const ips = await dnsPromises.resolve(host);
    res.status(200).json({ host, ips });
  } catch (err) {
    res.status(500).json({ error: `Could not resolve [${host}]` });
  }
}
