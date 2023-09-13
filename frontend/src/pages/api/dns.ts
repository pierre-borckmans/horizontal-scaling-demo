import type { NextApiRequest, NextApiResponse } from "next";
import * as dns from "dns";
import { updateClients } from "~/pages/api/socket";
const dnsPromises = dns.promises;

export default async function resolveDNS(
  req: NextApiRequest,
  res: NextApiResponse<{ host: string; ips: string[] } | { error: string }>
) {
  const host = req.query.host as string;
  try {
    const ips = await dnsPromises.resolve6(host);
    // const ips = ["localhost"];
    updateClients(ips);
    res.status(200).json({ host, ips });
  } catch (err) {
    res.status(500).json({ error: `Could not resolve [${host}]` });
  }
}
