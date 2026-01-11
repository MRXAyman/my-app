/**
 * EcoTrack API Authentication Methods
 * 
 * جرب هذه الطرق المختلفة إذا استمر خطأ 403
 */

// الطريقة 1: Query Parameter (الحالية)
export async function shipWithQueryParam(url: string, apiKey: string, data: any) {
    return fetch(`${url}?api_key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}

// الطريقة 2: X-API-Key Header
export async function shipWithApiKeyHeader(url: string, apiKey: string, data: any) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
        },
        body: JSON.stringify(data)
    })
}

// الطريقة 3: Authorization Header (بدون Bearer)
export async function shipWithAuthHeader(url: string, apiKey: string, data: any) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey,
        },
        body: JSON.stringify(data)
    })
}

// الطريقة 4: Bearer Token
export async function shipWithBearerToken(url: string, apiKey: string, data: any) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(data)
    })
}

// الطريقة 5: API Key في Body
export async function shipWithApiKeyInBody(url: string, apiKey: string, data: any) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...data,
            api_key: apiKey
        })
    })
}

/**
 * لتجربة طريقة مختلفة، غير هذا السطر في ecotrack-api.ts:
 * 
 * const response = await shipWithQueryParam(...)
 * 
 * إلى واحدة من:
 * - shipWithApiKeyHeader
 * - shipWithAuthHeader
 * - shipWithBearerToken
 * - shipWithApiKeyInBody
 */
