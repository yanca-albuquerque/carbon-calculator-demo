/**
 * RoutesDB - Database de Rotas Brasileiras
 * Contém informações de distâncias entre cidades brasileiras
 * e métodos para buscar informações de rotas
 */

const RoutesDB = {
  /**
   * Array de objetos de rota com estrutura:
   * - origin: string (cidade e estado, ex: "São Paulo, SP")
   * - destination: string (cidade e estado)
   * - distanceKm: number (distância real entre as cidades em km)
   */
  routes: [
    // Conexões entre capitais
    { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
    { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
    { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },
    { origin: "São Paulo, SP", destination: "Salvador, BA", distanceKm: 1680 },
    { origin: "Rio de Janeiro, RJ", destination: "Salvador, BA", distanceKm: 1590 },
    { origin: "São Paulo, SP", destination: "Recife, PE", distanceKm: 2286 },
    { origin: "Brasília, DF", destination: "Salvador, BA", distanceKm: 1440 },
    { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKm: 580 },
    { origin: "Rio de Janeiro, RJ", destination: "Belo Horizonte, MG", distanceKm: 440 },
    { origin: "São Paulo, SP", destination: "Curitiba, PR", distanceKm: 410 },
    { origin: "São Paulo, SP", destination: "Porto Alegre, RS", distanceKm: 1100 },
    { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 207 },

    // Região de São Paulo
    { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
    { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 65 },
    { origin: "São Paulo, SP", destination: "Sorocaba, SP", distanceKm: 110 },
    { origin: "São Paulo, SP", destination: "Ribeirão Preto, SP", distanceKm: 310 },
    { origin: "Campinas, SP", destination: "Ribeirão Preto, SP", distanceKm: 250 },

    // Região do Rio de Janeiro
    { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
    { origin: "Rio de Janeiro, RJ", destination: "Petrópolis, RJ", distanceKm: 65 },
    { origin: "Rio de Janeiro, RJ", destination: "Duque de Caxias, RJ", distanceKm: 35 },
    { origin: "Rio de Janeiro, RJ", destination: "Angra dos Reis, RJ", distanceKm: 150 },

    // Minas Gerais
    { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKm: 100 },
    { origin: "Belo Horizonte, MG", destination: "Uberlândia, MG", distanceKm: 565 },
    { origin: "Belo Horizonte, MG", destination: "Governador Valadares, MG", distanceKm: 300 },
    { origin: "Belo Horizonte, MG", destination: "Divinópolis, MG", distanceKm: 120 },

    // Bahia
    { origin: "Salvador, BA", destination: "Feira de Santana, BA", distanceKm: 116 },
    { origin: "Salvador, BA", destination: "Ilhéus, BA", distanceKm: 450 },
    { origin: "Salvador, BA", destination: "Camaçari, BA", distanceKm: 50 },
    { origin: "Salvador, BA", destination: "Vitória da Conquista, BA", distanceKm: 520 },

    // Ceará
    { origin: "Fortaleza, CE", destination: "Natal, RN", distanceKm: 530 },
    { origin: "Fortaleza, CE", destination: "Juazeiro do Norte, CE", distanceKm: 520 },

    // Pernambuco
    { origin: "Recife, PE", destination: "João Pessoa, PB", distanceKm: 120 },
    { origin: "Recife, PE", destination: "Maceió, AL", distanceKm: 300 },
    { origin: "Recife, PE", destination: "Caruaru, PE", distanceKm: 135 },

    // Paraná
    { origin: "Curitiba, PR", destination: "Londrina, PR", distanceKm: 360 },
    { origin: "Curitiba, PR", destination: "Maringá, PR", distanceKm: 400 },
    { origin: "Curitiba, PR", destination: "Cascavel, PR", distanceKm: 620 },

    // Rio Grande do Sul
    { origin: "Porto Alegre, RS", destination: "Caxias do Sul, RS", distanceKm: 120 },
    { origin: "Porto Alegre, RS", destination: "Santa Maria, RS", distanceKm: 295 },
    { origin: "Porto Alegre, RS", destination: "Pelotas, RS", distanceKm: 260 },
    { origin: "Porto Alegre, RS", destination: "Rio Grande, RS", distanceKm: 300 },

    // Santa Catarina
    { origin: "Florianópolis, SC", destination: "Blumenau, SC", distanceKm: 120 },
    { origin: "Florianópolis, SC", destination: "Joinville, SC", distanceKm: 140 },

    // Espírito Santo
    { origin: "Vitória, ES", destination: "Rio de Janeiro, RJ", distanceKm: 525 },
    { origin: "Vitória, ES", destination: "Cachoeiro de Itapemirim, ES", distanceKm: 130 },

    // Pará
    { origin: "Belém, PA", destination: "Marabá, PA", distanceKm: 400 },
  ],

  /**
   * Retorna um array ordenado alfabeticamente com todas as cidades únicas
   * Extrai de ambos origin e destination, remove duplicatas
   * @returns {Array<string>} Lista ordenada de todas as cidades
   */
  getAllCities: function() {
    const cities = new Set();
    this.routes.forEach(route => {
      cities.add(route.origin);
      cities.add(route.destination);
    });
    return Array.from(cities).sort();
  },

  /**
   * Busca a distância entre duas cidades
   * Normaliza a entrada e procura em ambas as direções
   * @param {string} origin - Cidade de origem
   * @param {string} destination - Cidade de destino
   * @returns {number|null} Distância em km ou null se não encontrado
   */
  findDistance: function(origin, destination) {
    // Normaliza entrada: remove espaços e converte para minúsculas
    const originNormalized = origin.trim().toLowerCase();
    const destNormalized = destination.trim().toLowerCase();

    // Procura a rota em ambas as direções
    for (let route of this.routes) {
      const routeOrigin = route.origin.toLowerCase();
      const routeDestination = route.destination.toLowerCase();

      // Verifica se a rota corresponde em qualquer direção
      if (
        (routeOrigin === originNormalized &&
          routeDestination === destNormalized) ||
        (routeOrigin === destNormalized &&
          routeDestination === originNormalized)
      ) {
        return route.distanceKm;
      }
    }

    // Retorna null se a rota não foi encontrada
    return null;
  },
};
