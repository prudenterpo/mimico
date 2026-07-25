# PRD - Mimico V1

Status: Validated 1.0  
Data: 2026-07-25  
Objetivo deste documento: redefinir a versao alvo do jogo sem depender da documentacao antiga.

## 1. Resumo do produto

Mimico e um jogo multiplayer online de mímica para navegador. Quatro jogadores entram em uma mesa privada, formam dois times e disputam uma partida em tempo real usando video e chat. Em cada rodada, um jogador faz a mimica de uma palavra enquanto seu parceiro tenta acertar antes do tempo acabar.

O projeto tem dois objetivos simultaneos:

- ser um jogo realmente funcional e jogavel
- servir como projeto de portfolio e laboratorio de desenvolvimento assistido por IA

## 2. Objetivos do V1

- Entregar uma versao completa, coerente e deployavel do jogo.
- Preservar e aproveitar ao maximo o que ja esta bem implementado.
- Manter um escopo pequeno o bastante para permitir iteracao, testes e revisoes de alta qualidade.
- Criar um fluxo de desenvolvimento com IA em que requisitos, tarefas, testes e revisoes partem de documentos claros e verificaveis.

## 3. Nao objetivos do V1

- sistema de ranking global
- historico completo de partidas e replays
- matchmaking publico
- modos com mais de 4 jogadores
- monetizacao
- app mobile nativo
- social graph, clanes ou perfis avancados

## 4. Publico-alvo

Primario:

- recrutadores, clientes e pares tecnicos avaliando portfolio
- amigos ou colegas testando o jogo em sessoes curtas

Secundario:

- o proprio autor como estudo pratico de produto, arquitetura, testes, deploy e IA assistida

## 5. Tese do produto

O Mimico V1 deve demonstrar tres coisas ao mesmo tempo:

- uma experiencia multiplayer em tempo real divertida e clara
- um sistema full-stack com regras de jogo bem modeladas
- um processo moderno de construcao orientado por especificacao, testes e revisao assistida por IA

## 6. Experiencia principal proposta

Fluxo principal proposto para o V1:

1. Usuario cria conta e entra no lobby.
2. Usuario cria uma mesa privada e convida outros tres jogadores.
3. Os quatro entram na mesa, o host define manualmente os dois times e confirma o inicio.
4. A partida comeca.
5. Em cada rodada:
   - o time da vez avanca no tabuleiro ao rolar o dado
   - o mimico recebe opcoes de palavra
   - o parceiro tenta acertar pelo chat antes do tempo acabar
   - em casas especiais, o time adversario tambem pode roubar a rodada
6. A partida termina quando um time alcanca a ultima casa.
7. Os jogadores veem o resultado e podem iniciar uma revanche.

## 7. Escopo funcional proposto para o V1

### 7.1 Conta e autenticacao

- cadastro com email, nickname e senha
- login com sessao autenticada
- restauracao de sessao no frontend

### 7.2 Lobby

- lista de usuarios online
- chat global simples
- criacao de mesa privada

### 7.3 Mesa privada

- host cria mesa com nome
- host convida jogadores especificos
- convidados aceitam ou recusam
- mesa mostra quem entrou e quem falta
- existe chat livre da mesa antes do inicio da partida e entre rodadas
- partida so inicia quando houver 4 jogadores presentes e com times definidos pelo host

### 7.4 Formacao da partida

- 4 jogadores por partida
- 2 times com 2 jogadores cada
- host define manualmente a composicao dos times antes do inicio
- definicao clara de quem e o primeiro mimico de cada time

### 7.5 Rodada

- ordem de turno bem definida
- rolagem de dado
- avancar no tabuleiro
- escolha de 1 palavra entre 3 opcoes, uma por categoria fixa
- cronometro fixo de 60 segundos por rodada
- video em tempo real entre os participantes
- chat com permissao de acordo com o contexto da rodada
- validacao automatica do palpite correto
- ao cair em casa especial, os 4 jogadores podem tentar acertar desde o inicio da rodada
- se o tempo acabar sem acerto, a rodada termina e a vez passa para o outro time

### 7.6 Regras de tabuleiro

- tabuleiro finito com progressao por casas
- casas especiais que habilitam roubo da rodada
- condicao de vitoria objetiva e visivel

### 7.7 Estado em tempo real

- sincronizacao da partida para todos os jogadores
- tratamento de desconexao e reconexao
- pausa automatica da partida por ate 60 segundos em caso de queda de conexao relevante
- retomada do mesmo estado quando o jogador reconecta dentro da janela permitida
- recuperacao de estado em caso de refresh ou queda curta

### 7.8 Encerramento

- tela final com vencedor
- opcao de revanche na mesma mesa
- a mesa pode permanecer ativa para a mesma composicao de 4 jogadores iniciar nova partida

## 8. Requisitos de qualidade do V1

- o fluxo principal deve funcionar sem intervencao manual no banco
- o estado do jogo deve permanecer consistente para os quatro clientes
- a interface precisa ser clara em desktop e mobile
- a experiencia mobile faz parte do escopo do V1 e nao deve ser tratada como adaptacao secundaria
- o projeto deve ter deploy funcional de frontend e backend
- o deploy final deve estar acessivel por URL publica para demonstracao externa
- o sistema deve ter logs e mensagens de erro suficientes para depuracao

## 9. Direcao tecnica proposta

Direcao preferencial, porque ja existe codigo relevante:

- frontend em Next.js
- backend em Spring Boot
- autenticacao com JWT
- tempo real com WebSocket
- persistencia em PostgreSQL
- Redis para sessoes ou estado efemero quando fizer sentido

Regra de decisao:

- preservar a stack atual por padrao
- so trocar stack se houver ganho muito claro para escopo, aprendizado ou deploy

## 10. Principios de produto

- Clareza acima de complexidade: o jogador deve entender rapidamente o que fazer a cada etapa.
- Um unico fluxo principal excelente vale mais que varios fluxos medianos.
- O jogo deve ser divertido de demonstrar ao vivo em portfolio.
- Regras explicitas vencem comportamento implicito.
- Cada tela precisa deixar claro: estado atual, proxima acao e quem pode agir.

## 11. Principios do workflow com IA

Este projeto sera guiado por uma cadeia de artefatos em que cada etapa depende da anterior.

Ordem proposta:

1. PRD do V1
2. Spec funcional detalhada por fluxo
3. Plano de implementacao com tarefas pequenas e verificaveis
4. TDD por componente ou fluxo critico
5. Implementacao assistida por IA
6. Revisao de codigo e verificacoes
7. Deploy e checklist final

Regras operacionais:

- nenhum trabalho de codigo comeca sem escopo e criterio de aceite claros
- toda tarefa deve citar a spec que a originou
- mudancas grandes devem ser quebradas em entregas pequenas
- toda feature precisa ter estrategia de teste definida antes da implementacao
- prompts para IA devem apontar para documentos fonte, nao para instrucoes vagas no chat

## 12. Definicao preliminar de pronto

O Mimico V1 sera considerado pronto quando:

- um usuario consegue registrar 4 contas de teste
- os 4 jogadores conseguem entrar na mesma mesa
- o host so consegue iniciar quando houver exatamente 4 jogadores e os dois times estiverem definidos
- a partida completa pode ser jogada ate o fim
- video, chat, turnos, timer e vitoria funcionam de ponta a ponta
- reconexao basica funciona sem corromper o estado
- existe um banco inicial de palavras curado e suficiente para partidas reais
- a revanche funciona na mesma mesa com os mesmos 4 jogadores
- frontend e backend estao publicados em URL publica acessivel
- existe documentacao suficiente para outra pessoa subir, testar e entender o projeto

## 13. Decisoes validadas do V1

### D1. Formato da partida

Decisao aprovada: manter o formato diferenciado de corrida em tabuleiro com dado e casas especiais.

Motivo: preserva a identidade do jogo e aumenta o reaproveitamento do que ja existe no codigo.

### D2. Video no V1

Decisao aprovada: video integrado no navegador e obrigatorio na experiencia principal.

Motivo: faz parte da proposta central do produto e fortalece o valor didatico e de portfolio.

### D3. Formacao dos times

Decisao aprovada: host define manualmente os times antes do inicio da partida.

Motivo: da mais controle ao fluxo social do jogo e melhora a experiencia em sessoes combinadas.

### D4. Barreira de entrada

Decisao aprovada: somente usuarios autenticados podem jogar no V1.

Motivo: reduz escopo, simplifica seguranca e ajuda a manter o estado multiplayer mais previsivel.

### D5. Plataforma-alvo do V1

Decisao aprovada: mobile e desktop devem ter o mesmo nivel de acabamento no V1.

Motivo: a experiencia final precisa parecer completa e polida em qualquer dispositivo comum de uso.

### D6. Temporizador por rodada

Decisao aprovada: cada rodada tera temporizador fixo de 60 segundos.

Motivo: reduz variacoes de regra no V1 e facilita balanceamento, UX e testes.

### D7. Roubo em casa especial

Decisao aprovada: ao cair em casa especial, os 4 jogadores podem tentar acertar no mesmo chat desde o inicio da rodada.

Motivo: deixa a regra mais simples, mais clara e mais dinamica para os jogadores.

### D8. Fim da rodada sem acerto

Decisao aprovada: se o tempo acabar sem acerto, a rodada termina e a vez passa para o outro time.

Motivo: evita estados extras, simplifica a regra e reduz ambiguidade no fluxo.

### D9. Escolha da palavra

Decisao aprovada: o mimico escolhe 1 entre 3 palavras, uma por categoria fixa.

Motivo: aumenta a agencia do jogador e reaproveita bem a modelagem ja sugerida no projeto.

### D10. Reconexao

Decisao aprovada: a partida pausa por ate 60 segundos e retoma do mesmo estado se a reconexao ocorrer dentro da janela.

Motivo: equilibra robustez com simplicidade e preserva a experiencia multiplayer em tempo real.

### D11. Inicio da partida

Decisao aprovada: o host so pode iniciar a partida quando houver exatamente 4 jogadores e os 2 times estiverem definidos.

Motivo: preserva a coerencia da regra principal e evita estados parciais fora do escopo do V1.

### D12. Revanche

Decisao aprovada: depois da partida, os mesmos 4 jogadores podem iniciar uma revanche na mesma mesa.

Motivo: melhora a experiencia de jogo e evita friccao desnecessaria entre partidas.

### D13. Chat fora da rodada

Decisao aprovada: existe chat livre na mesa antes da partida e entre rodadas.

Motivo: reforca o aspecto social do jogo e melhora coordenacao entre os jogadores.

### D14. Palavra e banco inicial

Decisao aprovada: o V1 precisa sair com um banco inicial curado de palavras suficiente para partidas reais.

Motivo: o produto precisa ser de fato jogavel, nao apenas demonstravel tecnicamente.

### D15. Deploy alvo do V1

Decisao aprovada: frontend e backend devem estar publicados em URL publica, prontos para demonstracao externa.

Motivo: isso faz parte do objetivo de portfolio e da definicao real de entrega do projeto.

## 14. Artefatos que este PRD deve destravar

Depois de validado, este documento sera base para criar:

- spec do fluxo de lobby e mesa
- spec do fluxo de partida
- plano de tarefas
- estrategia de testes
- checklist de deploy
- harness de execucao assistida por IA

## 15. Observacao de validacao

Este documento passa a ser a fonte de verdade do V1 do Mimico em 2026-07-25.

Documentacao antiga pode ser consultada apenas como contexto historico ou fonte de reaproveitamento tecnico, nunca como definicao vigente de produto.
