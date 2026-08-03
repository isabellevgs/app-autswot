export const CATEGORIAS_ATRAPALHAR = [
  {
    field: 'atrapalharAcademico',
    label: 'Acadêmico (faculdade, local de estudo, etc.)',
  },
  {
    field: 'atrapalharProfissional',
    label: 'Profissional',
  },
  {
    field: 'atrapalharFamiliar',
    label: 'Familiar',
  },
  {
    field: 'atrapalharAmigosColegas',
    label: 'Amigos e colegas de estudo ou trabalho',
  },
  {
    field: 'atrapalharParceiros',
    label: 'Parceiros românticos',
  },
]

export const CATEGORIAS_EXEMPLOS_OPORTUNIDADE = [
  {
    field: 'exemplosOportunidadeAcademico',
    label: 'Acadêmico (faculdade, local de estudo, etc.)',
  },
  {
    field: 'exemplosOportunidadeProfissional',
    label: 'Profissional',
  },
  {
    field: 'exemplosOportunidadeFamiliar',
    label: 'Familiar',
  },
  {
    field: 'exemplosOportunidadeAmigosColegas',
    label: 'Amigos e colegas de estudo ou trabalho',
  },
  {
    field: 'exemplosOportunidadeParceiros',
    label: 'Parceiros românticos',
  },
]

export const CATEGORIAS_EXEMPLOS_PRATICOS_FORCA = [
  { field: 'exemplosPraticosEstudo', label: 'No estudo' },
  { field: 'exemplosPraticosTrabalho', label: 'No trabalho' },
  { field: 'exemplosPraticosCotidiano', label: 'No cotidiano' },
]

/**
 * Monta bullet points categorizados por âmbito a partir de campos estruturados
 * ou de um array legado (formato "Label: texto").
 */
export function montarItensPorCategoria(detalhe, categorias, legacyArray = []) {
  if (!detalhe) return []

  const temFormatoEstruturado = categorias.some(({ field }) => detalhe[field]?.trim?.())

  if (temFormatoEstruturado) {
    return categorias
      .map(({ field, label }) => {
        const texto = (detalhe[field] ?? '').trim()
        return texto ? `${label}: ${texto}` : null
      })
      .filter(Boolean)
  }

  return Array.isArray(legacyArray) ? legacyArray : []
}

/**
 * Monta os bullet points de "como atrapalhar" a partir do formato estruturado (SH/CH)
 * ou do array legado (FO/F via TracoDetalhe).
 */
export function montarItensAtrapalhar(detalhe) {
  return montarItensPorCategoria(
    detalhe,
    CATEGORIAS_ATRAPALHAR,
    detalhe?.comoAtrapalhar ?? [],
  )
}

export const CATEGORIAS_COMO_USAR = [
  { field: 'comoUsarAcademico', label: 'Na faculdade' },
  { field: 'comoUsarProfissional', label: 'No trabalho' },
  { field: 'comoUsarCotidiano', label: 'Na vida pessoal' },
]

export function montarComoUsar(detalhe) {
  return montarItensPorCategoria(
    detalhe,
    CATEGORIAS_COMO_USAR,
    detalhe?.comoUsar ?? [],
  )
}

export function montarExemplosOportunidade(detalhe) {
  return montarItensPorCategoria(
    detalhe,
    CATEGORIAS_EXEMPLOS_OPORTUNIDADE,
    detalhe?.exemplosOportunidade ?? [],
  )
}

export function montarExemplosPraticosForca(detalhe) {
  if (!detalhe) return []
  return CATEGORIAS_EXEMPLOS_PRATICOS_FORCA
    .map(({ field }) => (detalhe[field] ?? '').trim())
    .filter(Boolean)
}
