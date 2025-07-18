// Multi-provider failover utility
export async function failover(providers: Array<() => Promise<any>>): Promise<any> {
  for (const provider of providers) {
    try {
      const result = await provider();
      if (result) return result;
    } catch (err) {
      // Try next provider
    }
  }
  throw new Error('All providers failed');
}
