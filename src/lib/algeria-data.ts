/**
 * Algeria Wilayas and Communes Data
 * Generated from algeria_cities_commune_with_latlng.json
 * For use with EcoTrack API integration
 */

import algeriaData from '../../algeria_cities_commune_with_latlng.json'

export interface Commune {
    name_ar: string
    name_ascii: string
}

export interface Wilaya {
    code: number
    name_ar: string
    name_ascii: string
    communes: Commune[]
}

/**
 * Process and group data by wilaya
 */
function processAlgeriaData(): Wilaya[] {
    const wilayasMap = new Map<string, Wilaya>()

    algeriaData.forEach((item: any) => {
        const wilayaCode = item.wilaya_code

        if (!wilayasMap.has(wilayaCode)) {
            wilayasMap.set(wilayaCode, {
                code: parseInt(wilayaCode),
                name_ar: item.wilaya_name.trim(),
                name_ascii: item.wilaya_name_ascii,
                communes: []
            })
        }

        const wilaya = wilayasMap.get(wilayaCode)!
        wilaya.communes.push({
            name_ar: item.commune_name,
            name_ascii: item.commune_name_ascii
        })
    })

    return Array.from(wilayasMap.values()).sort((a, b) => a.code - b.code)
}

export const ALGERIA_WILAYAS = processAlgeriaData()

// Export as 'wilayas' for backward compatibility
export const wilayas = ALGERIA_WILAYAS

/**
 * Get wilaya by code
 */
export function getWilayaByCode(code: number): Wilaya | undefined {
    return ALGERIA_WILAYAS.find(w => w.code === code)
}

/**
 * Get wilaya by Arabic name
 */
export function getWilayaByName(name: string): Wilaya | undefined {
    return ALGERIA_WILAYAS.find(w => w.name_ar === name || w.name_ascii === name)
}

/**
 * Get wilaya code from Arabic name
 */
export function getWilayaCode(wilayaName: string): number {
    const wilaya = getWilayaByName(wilayaName)
    return wilaya?.code || 16 // Default to Algiers
}

/**
 * Get communes for a wilaya
 */
export function getCommunesForWilaya(wilayaCode: number): Commune[] {
    const wilaya = getWilayaByCode(wilayaCode)
    return wilaya?.communes || []
}

/**
 * Find commune ASCII name from Arabic name within a wilaya
 */
export function getCommuneAsciiName(wilayaCode: number, communeNameAr: string): string {
    const communes = getCommunesForWilaya(wilayaCode)
    const commune = communes.find(c => c.name_ar === communeNameAr)
    return commune?.name_ascii || communeNameAr
}
