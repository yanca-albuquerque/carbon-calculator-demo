/**
 * Calculator - Módulo de Cálculos da Calculadora de Emissões de CO₂
 * Contém métodos para calcular emissões, economias e créditos de carbono
 */

const Calculator = {
  /**
   * Calcula a emissão de CO₂ para uma distância e modo de transporte específicos
   * @param {number} distanceKm - Distância em quilômetros
   * @param {string} transportMode - Modo de transporte (bicycle, car, bus, truck)
   * @returns {number} Emissão em kg CO₂ arredondada para 2 casas decimais
   */
  calculateEmission: function(distanceKm, transportMode) {
    // Obtém o fator de emissão do CONFIG
    const factor = CONFIG.EMISSION_FACTORS[transportMode];

    if (factor === undefined) {
      console.error(`Modo de transporte desconhecido: ${transportMode}`);
      return 0;
    }

    // Calcula a emissão: distância * fator de emissão
    const emission = distanceKm * factor;

    // Retorna arredondado para 2 casas decimais
    return Math.round(emission * 100) / 100;
  },

  /**
   * Calcula emissões para todos os modos de transporte e compara com o carro
   * @param {number} distanceKm - Distância em quilômetros
   * @returns {Array} Array ordenado por emissão (menor primeiro) com objetos {mode, emission, percentageVsCar}
   */
  calculateAllModes: function(distanceKm) {
    const results = [];
    const carEmission = this.calculateEmission(distanceKm, 'car'); // Baseline

    // Calcula para cada modo de transporte
    Object.keys(CONFIG.EMISSION_FACTORS).forEach(mode => {
      const emission = this.calculateEmission(distanceKm, mode);
      const percentageVsCar = carEmission > 0 ? (emission / carEmission) * 100 : 0;

      results.push({
        mode: mode,
        emission: emission,
        percentageVsCar: Math.round(percentageVsCar * 100) / 100, // Arredonda para 2 casas
      });
    });

    // Ordena por emissão crescente (menor emissão primeiro)
    results.sort((a, b) => a.emission - b.emission);

    return results;
  },

  /**
   * Calcula economia de emissão comparada com uma baseline
   * @param {number} emission - Emissão atual em kg CO₂
   * @param {number} baselineEmission - Emissão baseline em kg CO₂
   * @returns {Object} {savedKg, percentage} com valores arredondados
   */
  calculateSavings: function(emission, baselineEmission) {
    // Calcula kg economizados: baseline - emissão atual
    const savedKg = baselineEmission - emission;

    // Calcula porcentagem economizada
    const percentage = baselineEmission > 0 ? (savedKg / baselineEmission) * 100 : 0;

    return {
      savedKg: Math.round(savedKg * 100) / 100,
      percentage: Math.round(percentage * 100) / 100,
    };
  },

  /**
   * Calcula quantos créditos de carbono são necessários para compensar a emissão
   * @param {number} emissionKg - Emissão em kg CO₂
   * @returns {number} Número de créditos necessários arredondado para 4 casas decimais
   */
  calculateCarbonCredits: function(emissionKg) {
    // Divide a emissão pelo kg por crédito
    const credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;

    // Retorna arredondado para 4 casas decimais
    return Math.round(credits * 10000) / 10000;
  },

  /**
   * Estima o preço dos créditos de carbono baseado na faixa de preço
   * @param {number} credits - Número de créditos
   * @returns {Object} {min, max, average} preços em BRL arredondados para 2 casas
   */
  estimateCreditPrice: function(credits) {
    const min = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
    const max = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;
    const average = (min + max) / 2;

    return {
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      average: Math.round(average * 100) / 100,
    };
  },
};