import 'source-map-support'
import { getCacheFromRedis, redisSetWithTimestamp } from '@app/util/redis'
import { getYieldOppys } from '@app/util/markets'

export default async function handler(req, res) {
  const cacheKey = `oppys-v1.0.0`;

  try {
    const validCache = await getCacheFromRedis(cacheKey, true, 60);
    if (validCache) {
      res.status(200).json(validCache);
      return
    }

    const pools = await getYieldOppys();

    const resultData = {
      pools: pools,
    }

    await redisSetWithTimestamp(cacheKey, resultData);

    res.status(200).json(resultData)
  } catch (err) {
    console.error(err);
    // if an error occured, try to return last cached results
    try {
      const cache = await getCacheFromRedis(cacheKey, false);
      if (cache) {
        console.log('Api call failed, returning last cache found');
        res.status(200).json(cache);
      }
    } catch (e) {
      console.error(e);
    }
  }
}