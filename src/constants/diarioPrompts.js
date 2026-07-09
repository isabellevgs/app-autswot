export const PERGUNTA_AUTOADVOCACIA_1 =
  'Você tem compartilhado com alguém informações sobre seu processo de autoconhecimento por meio da AutSWOT? Se sim, com quem? Descreva como tem sido. Se não, escreva sobre as razões pelas quais não tem compartilhado descrevendo as barreiras ou dificuldades.';

export const PERGUNTA_AUTOADVOCACIA_2 =
  'Você tem tentado aplicar as estratégias de enfrentamento e autoadvogar suas necessidades especificas nos diversos âmbitos em que circula (estudo, trabalho, família, amigos, parceiros românticos). Se sim, escreva como tem sido esse processo. Se não, escreva sobre as razões pelas quais não tem conseguido, descrevendo as barreiras ou dificuldades.';

export const TITULOS_QUADRANTE = {
  ameaca: 'Ameaças',
  fraqueza: 'Fraquezas',
  oportunidade: 'Oportunidades',
  forca: 'Forças',
};

export function contarPalavras(text) {
  return String(text ?? '').trim().split(/\s+/).filter(Boolean).length;
}
